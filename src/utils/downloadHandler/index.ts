import { BrowserWindow, Event } from "electron";
import { Downloader } from "../../../../japscandl/js";
import handleChapterDownload from "./chapter";
import DownloadSet from "./DownloadSet";

export type Download = {
  type: "volume" | "chapitre";
  manga: string;
  start: number;
  end?: number;
  compression: boolean;
  keepImages: boolean;
};

let currentDownload: Download | null = null;

const downloadQueue = new DownloadSet();

const downloadFromArgs =
  (downloader: Downloader, win: BrowserWindow) =>
  async (_: Event, args: Download): Promise<void> => {
    const { type, manga, start, end, compression, keepImages } = args;
    if (currentDownload) {
      // if user accidentally double clicked, don't register
      if (!downloadQueue.compare(currentDownload, args)) {
        downloadQueue.add(args);
      } else {
        console.log("already downloading");
      }
      console.log("adding to queue");
      return;
    } else {
      win.webContents.send("loading");
      console.log("Starting download...", args);
      currentDownload = args;
    }
    if (type === "chapitre") {
      if (!end) {
        await handleChapterDownload(
          downloader,
          win,
          manga,
          start,
          compression,
          !keepImages
        );
      } /* else {
        handleChaptersDownload(
          downloader,
          win,
          manga,
          start,
          end,
          compression,
          !keepImages
        );
    } else {
      if(!end){
        handleVolumeDownload();
      } else {
        handleVolumesDownload();
      }
    */
    }
    console.log("Done!");
    currentDownload = null;
    if (downloadQueue.size) {
      const next = downloadQueue.popNext();
      if (!next) return;
      console.log("downloading", next, "from queue");
      downloadFromArgs(downloader, win)(_, next);
    } else {
      console.log("downloadqueue is", downloadQueue.size);
    }
  };

export default downloadFromArgs;
