/**
 * A generic priority queue (binary min-heap) implementation similar to Java's PriorityQueue.
 * Backed by a dynamic array. Default ordering is min-heap (smallest element at top).
 * A custom comparator can be provided to change the ordering.
 * offer/poll: O(log n), peek: O(1)
 */

type Comparator<T> = (a: T, b: T) => number;

class StesPriorityQueue<T> {
  private heap: T[] = [];
  private readonly cmp: Comparator<T>;

  constructor(comparator?: Comparator<T>);
  constructor(items: Iterable<T>, comparator?: Comparator<T>);
  constructor(
    itemsOrCmp?: Iterable<T> | Comparator<T>,
    maybeCmp?: Comparator<T>
  ) {
    let items: Iterable<T> | undefined;
    let cmp: Comparator<T> | undefined;

    if (typeof itemsOrCmp === 'function') {
      cmp = itemsOrCmp as Comparator<T>;
    } else {
      items = itemsOrCmp;
      cmp = maybeCmp;
    }

    // Default comparator: min-heap (like Java)
    this.cmp = cmp ?? ((a, b) => (a < b ? -1 : a > b ? 1 : 0));

    if (items) {
      for (const item of items) {
        this.heap.push(item);
      }
      // Build heap in O(n)
      for (let i = (this.heap.length >> 1) - 1; i >= 0; i--) {
        this._siftDown(i);
      }
    }
  }

  // ─── Capacity ────────────────────────────────────────────────

  get size(): number {
    return this.heap.length;
  }

  get empty(): boolean {
    return this.heap.length === 0;
  }

  // ─── Element Access ──────────────────────────────────────────

  /** Access the highest-priority element (smallest in min-heap) without removing it */
  peek(): T {
    if (this.heap.length === 0) throw new Error('StesPriorityQueue::peek — queue is empty');
    return this.heap[0];
  }

  // ─── Modifiers ───────────────────────────────────────────────

  /** Add an element to the priority queue */
  offer(value: T): void {
    this.heap.push(value);
    this._siftUp(this.heap.length - 1);
  }

  /** Remove and return the highest-priority element */
  poll(): T {
    if (this.heap.length === 0) throw new Error('StesPriorityQueue::poll — queue is empty');
    const top = this.heap[0];
    const last = this.heap.pop() as T;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this._siftDown(0);
    }
    return top;
  }

  /** Remove a specific element. Returns true if found and removed. */
  remove(value: T): boolean {
    const idx = this.heap.indexOf(value);
    if (idx === -1) return false;

    const last = this.heap.pop() as T;
    if (idx < this.heap.length) {
      this.heap[idx] = last;
      // Re-heapify: could go up or down
      this._siftUp(idx);
      this._siftDown(idx);
    }
    return true;
  }

  /** Remove all elements */
  clear(): void {
    this.heap = [];
  }

  // ─── Iterators ───────────────────────────────────────────────

  /** Iterate over elements in heap order (NOT sorted order). Use poll() for sorted access. */
  *[Symbol.iterator](): IterableIterator<T> {
    for (const item of this.heap) {
      yield item;
    }
  }

  /** Iterate elements in sorted (priority) order by repeatedly polling. Destructive! */
  *sorted(): IterableIterator<T> {
    const copy = [...this.heap];
    while (this.heap.length > 0) {
      yield this.poll();
    }
    this.heap = copy;
  }

  // ─── Algorithms ──────────────────────────────────────────────

  forEach(callback: (value: T, index: number) => void): void {
    for (let i = 0; i < this.heap.length; i++) {
      callback(this.heap[i], i);
    }
  }

  find(predicate: (value: T) => boolean): T | undefined {
    for (const item of this.heap) {
      if (predicate(item)) return item;
    }
    return undefined;
  }

  /** Return a sorted array (ascending by priority). Non-destructive. */
  toArray(): T[] {
    return [...this.heap];
  }

  /** Return a sorted array in priority order. Non-destructive. */
  toSortedArray(): T[] {
    const result: T[] = [];
    const copy = [...this.heap];
    while (this.heap.length > 0) {
      result.push(this.poll());
    }
    this.heap = copy;
    return result;
  }

  // ─── Comparison ──────────────────────────────────────────────

  equals(other: StesPriorityQueue<T>): boolean {
    if (this.heap.length !== other.heap.length) return false;
    // Compare sorted contents
    const a = this.toSortedArray();
    const b = other.toSortedArray();
    for (let i = 0; i < a.length; i++) {
      if (this.cmp(a[i], b[i]) !== 0) return false;
    }
    return true;
  }

  // ─── String ──────────────────────────────────────────────────

  toString(): string {
    return `StesPriorityQueue(${this.heap.length}) {top=${this.heap.length > 0 ? this.heap[0] : 'empty'}, heap=[${this.heap.join(', ')}]}`;
  }

  // ─── Private: Heap Operations ────────────────────────────────

  private _siftUp(idx: number): void {
    while (idx > 0) {
      const parent = (idx - 1) >> 1;
      if (this.cmp(this.heap[idx], this.heap[parent]) < 0) {
        this._swap(idx, parent);
        idx = parent;
      } else {
        break;
      }
    }
  }

  private _siftDown(idx: number): void {
    const n = this.heap.length;
    while (true) {
      let smallest = idx;
      const left = 2 * idx + 1;
      const right = 2 * idx + 2;

      if (left < n && this.cmp(this.heap[left], this.heap[smallest]) < 0) {
        smallest = left;
      }
      if (right < n && this.cmp(this.heap[right], this.heap[smallest]) < 0) {
        smallest = right;
      }
      if (smallest !== idx) {
        this._swap(idx, smallest);
        idx = smallest;
      } else {
        break;
      }
    }
  }

  private _swap(i: number, j: number): void {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }
}

export { StesPriorityQueue };
export type { Comparator };
