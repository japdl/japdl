import { BrowserWindow, Event } from "electron";
import { Downloader } from "../../../../japscandl/js";
import { ChapterDownload } from "./chapter";
import { ChaptersDownload } from "./chapters";
import { DownloadSetHandler } from "./DownloadSet";
import { VolumeDownload } from "./volume";
import { VolumesDownload } from "./volumes";

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

export type SideBarDownload =
  | ChapterDownload
  | ChaptersDownload
  | VolumeDownload
  | VolumesDownload;

export let downloadQueue: DownloadSetHandler | null = null;

const downloadFromArgs = (
  downloader: Downloader,
  win: BrowserWindow
): ((_: Event, args: Download) => void) => {
  downloadQueue = new DownloadSetHandler(downloader, win);

  return (_: Event, args: Download): void => {
    downloadQueue?.register(args);
  };
};

export default downloadFromArgs;
