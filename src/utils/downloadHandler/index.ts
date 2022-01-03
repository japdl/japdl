import { BrowserWindow, Event } from "electron";
import { Downloader } from "../../../../japscandl/js";
import { DownloadSetHandler } from "./DownloadSet";

export type QueueDisplay = {
  manga: string;
  type: "volume" | "chapitre";
  start: number;
  end?: number;
};

export type Download = QueueDisplay & {
  compression: boolean;
  keepImages: boolean;
};

const downloadFromArgs = (downloader: Downloader, win: BrowserWindow): void => {
  const downloadQueue = new DownloadSetHandler(downloader, win);

  async (_: Event, args: Download): Promise<void> => {
    downloadQueue.register(args);
  };
};

export default downloadFromArgs;
