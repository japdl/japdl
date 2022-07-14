import { BrowserWindow } from "electron";
import { Download, QueueDisplay, SideBarDownload } from ".";
import { Downloader } from "japscandl";
import ObjectSet from "../ObjectSet";
import handleChapterDownload from "./chapter";
import handleChaptersDownload from "./chapters";
import handleVolumeDownload from "./volume";
import handleVolumesDownload from "./volumes";

export class DownloadSet extends ObjectSet<Download> {
  constructor(downloads?: Download[]) {
    super(downloads);
  }

  /**
   * Show a summary of the downloads
   * @returns
   */
  toStringArray(): string[] {
    return this.get().map((obj) => this.toName(obj));
  }

  /**
   * returns a simple name to identify the download
   * @param obj1 download object
   * @returns download name in a human readable format
   */
  toName(obj1: Download): string {
    const endString = obj1.end ? `-${obj1.end}` : "";
    if (obj1.type === "chapitre") {
      return `${obj1.manga} - ${obj1.start}${endString}`;
    } else {
      return `${obj1.manga} volume ${obj1.start}${endString}`;
    }
  }

  toQueueDisplay(): QueueDisplay[] {
    return this.get().map((obj) => this.toDisplay(obj));
  }

  toDisplay(obj1: Download): QueueDisplay {
    return { ...obj1 };
  }

  signalUpdateTo(win: BrowserWindow): void {
    win.webContents.send("update-queue", this.toStringArray());
  }

  compare(obj1: Download, obj2: Download): boolean {
    if (obj1 === obj2) return true;
    if (obj1.compression !== obj2.compression) return false;
    if (obj1.keepImages !== obj2.keepImages) return false;
    if (obj1.type !== obj2.type) return false;
    if (obj1.manga !== obj2.manga) return false;
    if (obj1.start !== obj2.start) return false;
    if (obj1.end !== obj2.end) return false;
    return true;
  }

  toString(): string {
    return this.toStringArray().toString();
  }
}
export class DownloadSetHandler {
  downloader: Downloader;
  window: BrowserWindow;

  private downloadQueue: DownloadSet;
  private done: DownloadSet = new DownloadSet();
  constructor(
    downloader: Downloader,
    window: BrowserWindow,
    downloadQueue?: DownloadSet
  ) {
    this.downloader = downloader;
    this.window = window;
    this.downloadQueue = downloadQueue ?? new DownloadSet();
  }

  clearCurrentDownload(): void {
    this.window.webContents.send("update-current", null);
  }

  isDownloading(): boolean {
    return !this.downloadQueue.isEmpty();
  }

  synchronizeWithWindow(): void {
    this.window.webContents.send(
      "update-queue",
      this.downloadQueue.toStringArray()
    );

    this.window.webContents.send("update-done", this.done.toStringArray());
  }

  async handleDownload(download: Download): Promise<void> {
    switch (download.type) {
      case "chapitre": {
        if (!download.end) {
          return handleChapterDownload(
            this,
            download.manga,
            download.start,
            download.compression,
            !download.keepImages
          );
        } else {
          return handleChaptersDownload(
            this,
            download.manga,
            download.start,
            download.end,
            download.compression,
            !download.keepImages
          );
        }
      }
      case "volume": {
        if (!download.end) {
          return handleVolumeDownload(
            this,
            download.manga,
            download.start,
            download.compression,
            !download.keepImages
          );
        } else {
          return handleVolumesDownload(
            this,
            download.manga,
            download.start,
            download.end,
            download.compression,
            !download.keepImages
          );
        }
      }
      default:
        throw new Error("Unknown download type");
    }
  }
  setCurrentDownload(download: SideBarDownload): void {
    this.window.webContents.send("update-current", download);
  }

  addToQueue(download: Download): void {
    this.downloadQueue.add(download);
    this.synchronizeWithWindow();
  }

  addToFinished(download: Download): void {
    this.done.add(download);
    this.synchronizeWithWindow();
  }

  removeCurrentDownload(): void {
    this.downloadQueue.popFirst();
    this.synchronizeWithWindow();
  }

  async startNextDownload(): Promise<void> {
    /*
     * we need to keep current download in the queue
     * during the download
     */
    const download = this.downloadQueue.first;
    try {
      await this.handleDownload(download);
    } catch (e) {
      console.error(e);
    }
    this.removeCurrentDownload();
    this.addToFinished(download);
    if (this.downloadQueue.isEmpty()) return;
    return this.startNextDownload();
  }

  async register(download: Download): Promise<void> {
    /*
     * if there is already a download, add it to the queue
     * and leave function since all queue elements will be called
     * after the current download
     */
    const isNotEmpty = !this.downloadQueue.isEmpty();
    this.addToQueue(download);
    this.synchronizeWithWindow();
    if (isNotEmpty) return;
    // treat here
    return this.startNextDownload();
  }
}
