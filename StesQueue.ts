/**
 * A generic queue (FIFO) implementation similar to C++ std::queue.
 * Backed by a singly-linked list for true O(1) enqueue/dequeue.
 */

class QueueNode<T> {
  value: T;
  next: QueueNode<T> | null;
  constructor(value: T) {
    this.value = value;
    this.next = null;
  }
}

class StesQueue<T> {
  private head: QueueNode<T> | null = null;
  private tail: QueueNode<T> | null = null;
  private _size = 0;

  constructor();
  constructor(items: Iterable<T>);
  constructor(items?: Iterable<T>) {
    if (items) {
      for (const item of items) {
        this.push(item);
      }
    }
  }

  // ─── Capacity ────────────────────────────────────────────────

  get size(): number {
    return this._size;
  }

  get empty(): boolean {
    return this._size === 0;
  }

  // ─── Element Access ──────────────────────────────────────────

  /** Access the front element (like std::queue::front) */
  front(): T {
    if (!this.head) throw new Error('StesQueue::front — queue is empty');
    return this.head.value;
  }

  /** Access the back element (like std::queue::back) */
  back(): T {
    if (!this.tail) throw new Error('StesQueue::back — queue is empty');
    return this.tail.value;
  }

  // ─── Modifiers ───────────────────────────────────────────────

  /** Add element to the back (like std::queue::push) */
  push(value: T): void {
    const node = new QueueNode(value);
    if (this.tail) {
      this.tail.next = node;
    } else {
      this.head = node;
    }
    this.tail = node;
    this._size++;
  }

  /** Remove the front element and return it (like std::queue::pop) */
  pop(): T {
    if (!this.head) throw new Error('StesQueue::pop — queue is empty');
    const value = this.head.value;
    this.head = this.head.next;
    if (!this.head) this.tail = null;
    this._size--;
    return value;
  }

  /** Remove all elements */
  clear(): void {
    this.head = null;
    this.tail = null;
    this._size = 0;
  }

  /** Swap contents with another queue */
  swap(other: StesQueue<T>): void {
    [this.head, other.head] = [other.head, this.head];
    [this.tail, other.tail] = [other.tail, this.tail];
    [this._size, other._size] = [other._size, this._size];
  }

  // ─── Iterators ───────────────────────────────────────────────

  /** Iterate from front to back (FIFO order) */
  *[Symbol.iterator](): IterableIterator<T> {
    let node = this.head;
    while (node) {
      yield node.value;
      node = node.next;
    }
  }

  // ─── Algorithms ──────────────────────────────────────────────

  forEach(callback: (value: T, index: number) => void): void {
    let node = this.head;
    let i = 0;
    while (node) {
      callback(node.value, i++);
      node = node.next;
    }
  }

  find(predicate: (value: T) => boolean): T | undefined {
    let node = this.head;
    while (node) {
      if (predicate(node.value)) return node.value;
      node = node.next;
    }
    return undefined;
  }

  toArray(): T[] {
    return [...this];
  }

  // ─── Comparison ──────────────────────────────────────────────

  equals(other: StesQueue<T>, cmp?: (a: T, b: T) => boolean): boolean {
    if (this._size !== other._size) return false;
    const eq = cmp ?? ((a, b) => a === b);
    const itA = this[Symbol.iterator]();
    const itB = other[Symbol.iterator]();
    while (true) {
      const a = itA.next();
      const b = itB.next();
      if (a.done && b.done) return true;
      if (a.done !== b.done) return false;
      if (!eq(a.value, b.value)) return false;
    }
  }

  // ─── String ──────────────────────────────────────────────────

  toString(): string {
    return `StesQueue(${this._size}) [${this.toArray().join(', ')}]`;
  }
}

export { StesQueue };
