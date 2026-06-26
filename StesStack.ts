/**
 * A generic stack (LIFO) implementation similar to C++ std::stack.
 * Backed by a dynamic array for O(1) amortized push/pop/top.
 */
class StesStack<T> {
  private data: T[] = [];

  constructor();
  constructor(items: Iterable<T>);
  constructor(items?: Iterable<T>) {
    if (items) {
      for (const item of items) {
        this.data.push(item);
      }
    }
  }

  // ─── Capacity ────────────────────────────────────────────────

  get size(): number {
    return this.data.length;
  }

  get empty(): boolean {
    return this.data.length === 0;
  }

  // ─── Element Access ──────────────────────────────────────────

  /** Access the top element (like std::stack::top) */
  top(): T {
    if (this.data.length === 0) throw new Error('StesStack::top — stack is empty');
    return this.data[this.data.length - 1];
  }

  // ─── Modifiers ───────────────────────────────────────────────

  /** Push element onto the top */
  push(value: T): void {
    this.data.push(value);
  }

  /** Pop the top element and return it */
  pop(): T {
    if (this.data.length === 0) throw new Error('StesStack::pop — stack is empty');
    return this.data.pop() as T;
  }

  /** Remove all elements */
  clear(): void {
    this.data = [];
  }

  /** Swap contents with another stack */
  swap(other: StesStack<T>): void {
    [this.data, other.data] = [other.data, this.data];
  }

  // ─── Iterators ───────────────────────────────────────────────

  /** Iterate from top to bottom (LIFO order) */
  *[Symbol.iterator](): IterableIterator<T> {
    for (let i = this.data.length - 1; i >= 0; i--) {
      yield this.data[i];
    }
  }

  // ─── Algorithms ──────────────────────────────────────────────

  forEach(callback: (value: T, index: number) => void): void {
    for (let i = this.data.length - 1; i >= 0; i--) {
      callback(this.data[i], this.data.length - 1 - i);
    }
  }

  find(predicate: (value: T) => boolean): T | undefined {
    for (let i = this.data.length - 1; i >= 0; i--) {
      if (predicate(this.data[i])) return this.data[i];
    }
    return undefined;
  }

  toArray(): T[] {
    return [...this.data];
  }

  // ─── Comparison ──────────────────────────────────────────────

  equals(other: StesStack<T>, cmp?: (a: T, b: T) => boolean): boolean {
    if (this.data.length !== other.data.length) return false;
    const eq = cmp ?? ((a, b) => a === b);
    for (let i = 0; i < this.data.length; i++) {
      if (!eq(this.data[i], other.data[i])) return false;
    }
    return true;
  }

  // ─── String ──────────────────────────────────────────────────

  toString(): string {
    return `StesStack(${this.data.length}) [${[...this].join(', ')}] <- top`;
  }
}

export { StesStack };
