import { BrowserWindow } from "electron";
import { Download, QueueDisplay } from ".";

abstract class ObjectSet<T> {
  private data: T[];

  constructor(array?: T[]) {
    // to prevent using downloads as a reference to the private field
    this.data = array ? Array.from(array) : [];
  }

  get(): T[] {
    return this.data;
  }

  get size(): number {
    return this.data.length;
  }

  add(value: T): void {
    if (!this.has(value)) this.data.push(value);
  }

  isEmpty(): boolean {
    return this.data.length === 0;
  }

  popNext(): T | null {
    /**
     * remove first element of the array and returns it
     */
    return this.data.shift() ?? null;
  }

  remove(value: T): void {
    /**
     * This is better than filter because we stop when we find it
     * this.data = this.data.filter((obj) => !this.compare(obj, value));
     * instead of going through the entire array
     */
    for (let i = 0; i < this.data.length; i++) {
      if (this.compare(this.data[i], value)) {
        this.data.splice(i, 1);
        return;
      }
    }
  }

  has(value: T): boolean {
    /* every returns true if every element in the array is different from `value`
     * we need to return true if one of the elements is the same, so we use `!`
     */
    return !this.data.every((obj) => !this.compare(obj, value));
  }

  // return true if they are the same
  abstract compare(obj1: T, obj2: T): boolean;
}

export default class DownloadSet extends ObjectSet<Download> {
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

  // return true if they are the same
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

type QueueDownload = {
  manga: string;
  type: "volume" | "chapitre";
  start: number;
  end?: number;
  isDone: boolean;
  isCurrent: boolean;
  current: number;
  total: number;
  percent: number;
};

class DownloadQueue extends ObjectSet<QueueDownload> {
  // this approach only works for primitive typed fields
  compare(obj1: QueueDownload, obj2: QueueDownload): boolean {
    if (obj1 === obj2) return true;
    for (const key of Object.keys(obj1)) {
      //@ts-expect-error because string cannot index obj1, even if they are
      // from obj1 itself, thank you typescript
      if (obj1[key] !== obj2[key]) return false;
    }
    return true;
  }
}
