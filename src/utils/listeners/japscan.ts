import { Downloader } from "japscandl";
import path from "path";
import { BrowserWindow, ipcMain, shell } from "electron";
import { ComponentFlags } from "japscandl/js/src/utils/types";
import puppeteer from "puppeteer-core";
import downloadHandler from "../downloadHandler";
import MangaAttributes from "japscandl/js/src/MangaAttributes";

ipcMain.on("website", (event) => {
  event.returnValue = "https://japscan.me";
});

export async function setupJapscandlListeners(
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

        ipcMain.on("download", downloadHandler(downloader, win));
        ipcMain.on("openMangaFolder", (_, data) => {
          shell.openPath(
            path.resolve(path.join(downloader.outputDirectory, data))
          );
        });

        ipcMain.on("search", async (event, data) => {
          const results = await downloader.searchManga(data.value);
          if (data.sync) {
            console.log("Sync");
            event.returnValue = results;
          } else {
            console.log("Not sync", data.value);
            event.reply("searchResult", { results, value: data.value });
          }
        });

        ipcMain.removeAllListeners("website");

        ipcMain.on("website", (event) => {
          event.returnValue = downloader.website;
        });

        resolve(downloader);
      })
      .catch((error) => reject(error));
  });
}
