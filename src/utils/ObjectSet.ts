export default abstract class ObjectSet<T> {
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

  // return true if they are the same, must be implemented by the subclass
  abstract compare(obj1: T, obj2: T): boolean;
}
