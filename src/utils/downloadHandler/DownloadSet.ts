import { Download } from ".";

export default class DownloadSet {
  private data: Download[] = [];

  get size() {
    return this.data.length;
  }

  add(value: Download): void {
    if (!this.has(value)){
      console.log("Is unique, adding");
      this.data.push(value);
    } else {
      console.log("duplicate, not adding");
    }
  }

  get next(): Download | null {
      return this.data[0] ?? null;
  }

  popNext(): Download | null {
      return this.data.shift() ?? null;
  }

  remove(value: Download): void {
    this.data = this.data.filter((obj) => !this.compare(obj, value));
  }

  has(value: Download): boolean {
    return !this.data.every((obj) => !this.compare(obj, value));
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
}