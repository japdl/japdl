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
                // send a start download volumes to main process
                win.webContents.send("downloadVolumesSetup", {
                  manga,
                  start,
                  end,
                });
                downloadLocation = await downloader.downloadVolumes(
                  manga,
                  start,
                  end,
                  { compression }
                );
                win.webContents.send("downloadVolumesEnd", {
                  manga,
                  start,
                  end,
                });
              } else {
                // send a start download volume to main process
                win.webContents.send("downloadVolumeSetup", {
                  manga,
                  volume: start,
                });
                downloadLocation = await downloader.downloadVolume(
                  manga,
                  start,
                  { compression }
                );
                win.webContents.send("downloadVolumeEnd", {
                  manga,
                  volume: start,
                });
              }
            } /* chapter */ else {
              // if it's multiple chapters
              if (end) {
                win.webContents.send("downloadChaptersSetup", {
                  attributes: {
                    manga,
                    current: start,
                    total: end,
                  },
                });
                downloadLocation = await downloader.downloadChapters(
                  manga,
                  start,
                  end,
                  {
                    compression,
                    onChapter: (attributes, current, total) => {
                      win.webContents.send("downloadUpdateChapter", {
                        attributes,
                        current,
                        total,
                      });
                    },
                    onPage: (attributes, total) => {
                      console.log(attributes, total);
                      win.webContents.send("downloadChaptersUpdatePage", {
                        attributes,
                        total,
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
                });
              } else {
                // if it's a single chapter
                win.webContents.send("downloadChapterSetup", {
                  manga,
                  chapter: start,
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
                      });
                    },
                  }
                );
                win.webContents.send("downloadChapterEnd", {
                  manga,
                  chapter: start,
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
