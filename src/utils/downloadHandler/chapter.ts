import { BrowserWindow } from "electron";
import { Downloader } from "../../../../japscandl/js";

const handleChapterDownload = async (
  downloader: Downloader,
  window: BrowserWindow,
  manga: string,
  chapter: number,
  compression: boolean,
  deleteAfterCompression: boolean
): Promise<void> => {
  await downloader.downloadChapter(manga, chapter, {
    compression,
    deleteAfterCompression,
    callback: (events) => {
      events.on("start", (attributes, link, total) => {
        window.webContents.send("chapter-start", {
          manga,
          attributes,
          total,
        });
      });
      events.on("noimage", (attributes, link) => {
        window.webContents.send("chapter-noimage", {
          attributes,
          link,
        });
      });
      events.on("page", (attributes, total) => {
        window.webContents.send("chapter-page", {
          page: attributes.page,
          total,
        });
        console.log(attributes, total);
      });
      if (compression) {
        events.on("compressing", () => {
          window.webContents.send("chapter-compressing");
        });
        events.on("compressed", (attributes, path, stats) => {
          window.webContents.send("chapter-compressed", {
            stats,
          });
        });
      }
      events.on("done", () => {
        window.webContents.send("chapter-done");
      });
    },
  });
};

export default handleChapterDownload;
