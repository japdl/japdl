import { BrowserWindow } from "electron";
import { Download, QueueDisplay } from ".";
import { Downloader } from "../../../../japscandl/js";
import ObjectSet from "../ObjectSet";
import handleChapterDownload from "./chapter";

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
    win.webContents.send("update-queue", this.toQueueDisplay());
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
  private downloader: Downloader;
  private window: BrowserWindow;
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

  async handleDownload(download: Download): Promise<void> {
    if (download.type === "chapitre") {
      if (!download.end) {
        await handleChapterDownload(
          this.downloader,
          this.window,
          download.manga,
          download.start,
          download.compression,
          !download.keepImages
        );
      }
    }
  }

  async startNextDownload(): Promise<void> {
    const download = this.downloadQueue.first;
    await this.handleDownload(download);
    this.done.add(this.downloadQueue.popFirst() as Download);
    if (this.downloadQueue.isEmpty()) return;
    return this.startNextDownload();
  }

  async register(download: Download): Promise<void> {
    // if there is already a download, add it to the queue
    const isNotEmpty = !this.downloadQueue.isEmpty();
    this.downloadQueue.add(download);
    if (isNotEmpty) return;
    // treat here
    return this.startNextDownload();
  }
}
