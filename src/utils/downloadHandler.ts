import { BrowserWindow, Event, ipcMain } from "electron";
import { Downloader } from "../../../japscandl";
import fs from "fs";
import { bytesToSize } from "../../../japscandl/js/src/utils/compress";

const currentDownload = null;
const downloads = new Set();

export default (downloader: Downloader, win: BrowserWindow) =>
  async (
    _: Event,
    args: {
      type: "volume" | "chapitre";
      manga: string;
      start: number;
      end?: number;
      compression: boolean;
      keepImages: boolean;
    }
  ): Promise<void> => {
    const { type, manga, start, end, compression, keepImages } = args;
    console.log("Starting download...", args);
    win.webContents.send("loading");
    if (type === "chapitre" && !end) {
      downloader.downloadChapter(manga, start, {
        compression,
        deleteAfterCompression: !keepImages,
        callback: (events) => {
          events.on("start", (attributes, link, total) => {
            win.webContents.send("chapter-start", {
              manga,
              attributes,
              total,
            });
          });
          events.on("page", (attributes, total) => {
            win.webContents.send("chapter-page", {
              page: attributes.page,
              total,
            });
          });
          if (compression) {
            events.on("compressing", () => {
              win.webContents.send("chapter-compressing");
            });
            events.on("compressed", (attributes, path, stats) => {
              win.webContents.send("chapter-compressed", {
                stats,
              });
            });
          }
          events.on("done", () => {
            win.webContents.send("chapter-done");
          });
        },
      });
    }
    console.log("Done!");
  };
