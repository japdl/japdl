import { BrowserWindow, app, ipcMain, shell } from "electron";
import { Downloader } from "../../../japscandl/js";
import MangaAttributes from "japscandl/js/src/MangaAttributes";
import { ComponentFlags } from "japscandl/js/src/utils/types";
import path from "path";
import puppeteer from "puppeteer-core";
import downloadHandler from "../downloadHandler";
import { setupLogListener } from "./handler";

ipcMain.on("website", (event) => {
  event.returnValue = "https://japscan.lol";
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
    selector?: string;
  },
  win: BrowserWindow
): Promise<Downloader> {
  setupLogListener("checkChromePath", (event, arg) => {
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
    Downloader.getInstance(options)
      .then((downloader) => {
        downloader.setCacheDirectory(
          path.join(app.getPath("appData"), "Japdl", "fetch_cache")
        );
        downloader.browser.on("disconnected", () => {
          process.exit(1);
        });
        setupLogListener("getMangaContent", async (event, data) => {
          const content = await downloader.fetchMangaContent(data);
          event.reply("returnMangaContent", content);
        });
        setupLogListener("getMangaInfos", async (event, data) => {
          try {
            const stats = await downloader.fetchStats(data);
            event.reply("replyMangaInfos", stats);
          } catch (e) {
            event.reply("replyMangaInfos", false);
          }
        });

        setupLogListener("download", downloadHandler(downloader, win));
        setupLogListener("openMangaFolder", (_, data) => {
          shell.openPath(
            path.resolve(path.join(downloader.outputDirectory, data))
          );
        });

        setupLogListener("search", async (event, data) => {
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

        setupLogListener("website", (event) => {
          event.returnValue = downloader.website;
        });

        resolve(downloader);
      })
      .catch((error) => reject(error));
  });
}
