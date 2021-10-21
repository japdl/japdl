import { Downloader } from "japscandl";
import fs from "fs";
import path from "path";
import { BrowserWindow, ipcMain, shell } from "electron";
import { ComponentFlags, MangaAttributes } from "japscandl/js/src/utils/types";
import puppeteer from "puppeteer-core";

async function setupJapscandl(
  options: {
    chromePath?: string;
    onEvent?: {
      onPage?: (attributes: MangaAttributes, totalPages: number) => void;
      onChapter?: (
        attributes: MangaAttributes,
        currentChapter: number,
        totalChapters: number
      ) => void;
      onVolume?: (mangaName: string, current: number, total: number) => void;
    };
    flags?: ComponentFlags;
    outputDirectory?: string;
    imageFormat?: "png" | "jpg";
  },
  win: BrowserWindow
): Promise<Downloader> {
  ipcMain.on("checkChromePath", (event, arg) => {
    console.log("Checking chrome path with path: " + arg);
    puppeteer
      .launch({
        executablePath: arg,
      })
      .then(async (browser) => {
        await browser.close();
        event.returnValue = { good: true };
      })
      .catch((e) => {
        event.returnValue = { msg: e };
      });
  });
  return new Promise((resolve, reject) => {
    Downloader.launch(options)
      .then((downloader) => {
        /**
         * Locations are directories, so we need to use recursive true
         * to delete all images inside of each directory.
         */
        function removeDownloadLocations(
          locations: string | string[] | string[][]
        ): void {
          if (typeof locations === "string") {
            return fs.rmSync(locations, { force: true, recursive: true });
          } else {
            locations.forEach((location: string | string[] | string[][]) =>
              removeDownloadLocations(location)
            );
          }
        }
        ipcMain.on("getMangaContent", async (event, data) => {
          const content = await downloader.fetchMangaContent(data);
          event.reply("returnMangaContent", content);
        });
        ipcMain.on("getMangaInfos", async (event, data) => {
          try {
            const stats = await downloader.fetchStats(data);
            event.reply("replyMangaInfos", stats);
          } catch (e) {
            event.reply("replyMangaInfos", false);
          }
        });

        ipcMain.on(
          "download",
          async (
            _,
            args: {
              type: "volume" | "chapter";
              manga: string;
              start: number;
              end?: number;
              compression?: "pdf" | "cbr";
              keepImages: boolean;
            }
          ) => {
            const { type, manga, start, end, compression, keepImages } = args;
            console.log("Starting download...", args);
            let downloadLocation;
            // if type is volume
            if (type === "volume") {
              // if it's multiple volumes
              if (end) {
                const parentName = manga + " volume " + start + "-" + end;
                const attributes = {
                  manga,
                  current: start,
                  total: end,
                };
                // send a start download volumes to main process
                win.webContents.send("downloadChaptersSetup", {
                  attributes,
                  parentName,
                });
                downloadLocation = await downloader.downloadVolumes(
                  manga,
                  start,
                  end,
                  {
                    compression,
                    onPage: (attributes, total) => {
                      console.log(attributes, total);
                      const downloadName =
                        attributes.manga + " " + attributes.chapter;
                      console.log(downloadName, attributes.page);
                      win.webContents.send("downloaChaptersUpdatePage", {
                        attributes,
                        total,
                        downloadName,
                        parentName,
                      });
                    },
                  }
                );
                win.webContents.send("downloadChaptersEnd", {
                  parentName,
                });
              } else {
                const parentName = manga + " volume " + start;
                // send a start download volume to main process
                const attributes = {
                  manga,
                  current: start,
                  total: end,
                };
                win.webContents.send("downloadChaptersSetup", {
                  attributes,
                  parentName,
                });
                downloadLocation = await downloader.downloadVolume(
                  manga,
                  start,
                  {
                    compression,
                    onPage: (attributes, total) => {
                      console.log(attributes, total);
                      const downloadName =
                        attributes.manga + " " + attributes.chapter;
                      console.log(downloadName, attributes.page);
                      win.webContents.send("downloadChaptersUpdatePage", {
                        attributes,
                        total,
                        downloadName,
                        parentName,
                      });
                    },
                  }
                );
                win.webContents.send("downloadChaptersEnd", {
                  parentName,
                });
              }
            } /* chapter */ else {
              // if it's multiple chapters
              const parentName = manga + " " + start + "-" + end;
              if (end) {
                {
                  const attributes = {
                    manga,
                    current: start,
                    total: end,
                  };
                  console.log("downloadChaptersSetup", attributes);
                  win.webContents.send("downloadChaptersSetup", {
                    attributes,
                    parentName,
                  });
                }
                downloadLocation = await downloader.downloadChapters(
                  manga,
                  start,
                  end,
                  {
                    compression,
                    onChapter: (attributes, current, total) => {
                      const downloadName =
                        attributes.manga + " " + attributes.chapter;
                      win.webContents.send("downloadChaptersUpdateChapter", {
                        attributes,
                        current,
                        total,
                        downloadName,
                        parentName,
                      });
                    },
                    onPage: (attributes, total) => {
                      console.log(attributes, total);
                      const downloadName =
                        attributes.manga + " " + attributes.chapter;
                      console.log(downloadName, attributes.page);
                      win.webContents.send("downloadChaptersUpdatePage", {
                        attributes,
                        total,
                        downloadName,
                        parentName,
                      });
                    },
                  }
                );
                // send a chapters end event to the main process
                win.webContents.send("downloadChaptersEnd", {
                  attributes: {
                    manga,
                    current: start,
                    total: end,
                  },
                  parentName,
                });
              } else {
                // if it's a single chapter
                const attributes = {
                  manga,
                  current: start,
                  total: end,
                };
                const parentName = manga + " " + start;
                win.webContents.send("downloadChapterSetup", {
                  attributes,
                  parentName,
                });
                downloadLocation = await downloader.downloadChapter(
                  manga,
                  start,
                  {
                    compression,
                    onPage: (attributes, total) => {
                      console.log(attributes, total);
                      win.webContents.send("downloadChapterUpdatePage", {
                        attributes,
                        total,
                        parentName,
                      });
                    },
                  }
                );
                win.webContents.send("downloadChapterEnd", {
                  parentName,
                });
              }
            }
            console.log("Done!");
            if (!keepImages) removeDownloadLocations(downloadLocation);
            ipcMain.emit("downloadFinish", downloadLocation);
          }
        );
        ipcMain.on("openMangaFolder", (_, data) => {
          shell.openPath(
            path.resolve(path.join(downloader.outputDirectory, data))
          );
        });

        ipcMain.on("search", async (event, data) => {
          console.log(data);
          const results = await downloader.searchManga(data.value);
          if (data.sync) {
            console.log("Sync");
            event.returnValue = results;
          } else {
            console.log("Not sync", data.value);
            event.reply("searchResult", { results, value: data.value });
          }
        });

        resolve(downloader);
      })
      .catch((error) => reject(error));
  });
}

export default setupJapscandl;
