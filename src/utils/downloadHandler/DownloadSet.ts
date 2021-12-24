import { Download } from ".";

export default class DownloadSet {
  private data: Download[] = [];

  get size() {
    return this.data.length;
  }

  add(value: Download): void {
    if (!this.has(value)) this.data.push(value);
  }

  get next(): Download | null {
    /**
     * could be used instead of size, idk
     */
    return this.data[0] ?? null;
  }

  popNext(): Download | null {
    /**
     * remove first element of the array and returns it
     */
    return this.data.shift() ?? null;
  }

  remove(value: Download): void {
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

  has(value: Download): boolean {
    /* every returns true if every element in the array is different from `value`
     * we need to return true if one of the elements is the same, so we use `!`
     */
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
