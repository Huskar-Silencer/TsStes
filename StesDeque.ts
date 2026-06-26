/**
 * A generic double-ended queue (deque) implementation similar to C++ std::deque
 * Uses block-based storage for O(1) amortized push/pop at both ends
 * Supports efficient random access via index
 */
class StesDeque<T> {
  private static readonly BLOCK_SIZE = 64;

  /** Central map of block arrays */
  private blocks: (T | undefined)[][] = [];
  /** Index of the front element within its block */
  private frontIdx = 0;
  /** Index one past the back element within its block */
  private backIdx = 0;
  /** Total number of elements */
  private _size = 0;

  constructor();
  constructor(count: number, value: T);
  constructor(items: Iterable<T>);
  constructor(countOrItems?: number | Iterable<T>, value?: T) {
    this._allocBlocks(1);
    // Center front/back pointers in the first block
    this.frontIdx = StesDeque.BLOCK_SIZE;
    this.backIdx = StesDeque.BLOCK_SIZE;

    if (countOrItems === undefined) return;

    if (typeof countOrItems === 'number') {
      for (let i = 0; i < countOrItems; i++) {
        this.pushBack(value as T);
      }
    } else {
      for (const item of countOrItems) {
        this.pushBack(item);
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

  /** Access element at position (like operator[]) */
  at(index: number): T {
    if (index < 0 || index >= this._size) {
      throw new RangeError(`StesDeque::at — index ${index} out of range [0, ${this._size})`);
    }
    const realIdx = this.frontIdx + index;
    const block = (realIdx / StesDeque.BLOCK_SIZE) | 0;
    const offset = realIdx % StesDeque.BLOCK_SIZE;
    return this.blocks[block][offset] as T;
  }

  /** Subscript operator equivalent */
  get(index: number): T | undefined {
    if (index < 0 || index >= this._size) return undefined;
    return this.at(index);
  }

  /** Set element at position */
  set(index: number, value: T): void {
    if (index < 0 || index >= this._size) {
      throw new RangeError(`StesDeque::set — index ${index} out of range [0, ${this._size})`);
    }
    const realIdx = this.frontIdx + index;
    const block = (realIdx / StesDeque.BLOCK_SIZE) | 0;
    const offset = realIdx % StesDeque.BLOCK_SIZE;
    this.blocks[block][offset] = value;
  }

  front(): T {
    if (this._size === 0) throw new Error('StesDeque::front — deque is empty');
    return this.at(0);
  }

  back(): T {
    if (this._size === 0) throw new Error('StesDeque::back — deque is empty');
    return this.at(this._size - 1);
  }

  // ─── Modifiers ───────────────────────────────────────────────

  pushFront(value: T): void {
    if (this.frontIdx === 0) {
      this._prependBlock();
      this.frontIdx = StesDeque.BLOCK_SIZE;
    }
    this.frontIdx--;
    const block = (this.frontIdx / StesDeque.BLOCK_SIZE) | 0;
    const offset = this.frontIdx % StesDeque.BLOCK_SIZE;
    this.blocks[block][offset] = value;
    this._size++;
  }

  pushBack(value: T): void {
    const realIdx = this.backIdx;
    const block = (realIdx / StesDeque.BLOCK_SIZE) | 0;
    if (block >= this.blocks.length) {
      this._appendBlock();
    }
    const offset = realIdx % StesDeque.BLOCK_SIZE;
    this.blocks[block][offset] = value;
    this.backIdx++;
    this._size++;
  }

  popFront(): T {
    if (this._size === 0) throw new Error('StesDeque::popFront — deque is empty');
    const value = this.at(0);
    const block = (this.frontIdx / StesDeque.BLOCK_SIZE) | 0;
    const offset = this.frontIdx % StesDeque.BLOCK_SIZE;
    this.blocks[block][offset] = undefined;
    this.frontIdx++;
    this._size--;
    return value;
  }

  popBack(): T {
    if (this._size === 0) throw new Error('StesDeque::popBack — deque is empty');
    const value = this.at(this._size - 1);
    this.backIdx--;
    const block = (this.backIdx / StesDeque.BLOCK_SIZE) | 0;
    const offset = this.backIdx % StesDeque.BLOCK_SIZE;
    this.blocks[block][offset] = undefined;
    this._size--;
    return value;
  }

  /** Insert element at position (like std::deque::insert) */
  insert(index: number, value: T): void {
    if (index < 0 || index > this._size) {
      throw new RangeError(`StesDeque::insert — index ${index} out of range [0, ${this._size}]`);
    }
    if (index === 0) { this.pushFront(value); return; }
    if (index === this._size) { this.pushBack(value); return; }

    // Shift elements: choose the shorter side
    if (index <= this._size / 2) {
      // Shift front part left: move elements [0..index-1] to [1..index]
      // First, save all elements we need to shift
      const toShift: T[] = [];
      for (let i = 0; i < index; i++) {
        toShift.push(this.at(i));
      }
      this.pushFront(toShift[0]); // grow by 1 at front
      for (let i = 1; i < index; i++) {
        this.set(i, toShift[i]);
      }
      this.set(index, value);
    } else {
      // Shift back part right: move elements [index..size-1] to [index+1..size]
      const toShift: T[] = [];
      for (let i = index; i < this._size; i++) {
        toShift.push(this.at(i));
      }
      this.pushBack(toShift[toShift.length - 1]); // grow by 1 at back
      for (let i = 0; i < toShift.length - 1; i++) {
        this.set(index + 1 + i, toShift[i]);
      }
      this.set(index, value);
    }
  }

  /** Erase element at position (like std::deque::erase) */
  erase(index: number): T {
    if (index < 0 || index >= this._size) {
      throw new RangeError(`StesDeque::erase — index ${index} out of range [0, ${this._size})`);
    }
    const removed = this.at(index);

    if (index === 0) { this.popFront(); return removed; }
    if (index === this._size - 1) { this.popBack(); return removed; }

    // Shift elements: choose the shorter side
    if (index < this._size / 2) {
      for (let i = index; i > 0; i--) {
        this.set(i, this.at(i - 1));
      }
      this.popFront();
    } else {
      for (let i = index; i < this._size - 1; i++) {
        this.set(i, this.at(i + 1));
      }
      this.popBack();
    }
    return removed;
  }

  /** Remove all elements */
  clear(): void {
    this.blocks = [];
    this._allocBlocks(1);
    this.frontIdx = StesDeque.BLOCK_SIZE;
    this.backIdx = StesDeque.BLOCK_SIZE;
    this._size = 0;
  }

  /** Swap contents with another deque */
  swap(other: StesDeque<T>): void {
    [this.blocks, other.blocks] = [other.blocks, this.blocks];
    [this.frontIdx, other.frontIdx] = [other.frontIdx, this.frontIdx];
    [this.backIdx, other.backIdx] = [other.backIdx, this.backIdx];
    [this._size, other._size] = [other._size, this._size];
  }

  // ─── Iterators ───────────────────────────────────────────────

  *[Symbol.iterator](): IterableIterator<T> {
    for (let i = 0; i < this._size; i++) {
      yield this.at(i);
    }
  }

  /** Reverse iteration */
  *reverse(): IterableIterator<T> {
    for (let i = this._size - 1; i >= 0; i--) {
      yield this.at(i);
    }
  }

  // ─── Algorithms ──────────────────────────────────────────────

  forEach(callback: (value: T, index: number) => void): void {
    for (let i = 0; i < this._size; i++) {
      callback(this.at(i), i);
    }
  }

  map<U>(callback: (value: T, index: number) => U): U[] {
    const result: U[] = [];
    for (let i = 0; i < this._size; i++) {
      result.push(callback(this.at(i), i));
    }
    return result;
  }

  find(predicate: (value: T, index: number) => boolean): T | undefined {
    for (let i = 0; i < this._size; i++) {
      const v = this.at(i);
      if (predicate(v, i)) return v;
    }
    return undefined;
  }

  toArray(): T[] {
    return [...this];
  }

  // ─── Comparison ──────────────────────────────────────────────

  equals(other: StesDeque<T>, cmp?: (a: T, b: T) => boolean): boolean {
    if (this._size !== other._size) return false;
    const eq = cmp ?? ((a, b) => a === b);
    for (let i = 0; i < this._size; i++) {
      if (!eq(this.at(i), other.at(i))) return false;
    }
    return true;
  }

  // ─── String ──────────────────────────────────────────────────

  toString(): string {
    return `StesDeque(${this._size}) [${this.toArray().join(', ')}]`;
  }

  // ─── Private Helpers ─────────────────────────────────────────

  private _allocBlocks(count: number): void {
    for (let i = 0; i < count; i++) {
      this.blocks.push(new Array<T | undefined>(StesDeque.BLOCK_SIZE).fill(undefined));
    }
  }

  private _prependBlock(): void {
    this.blocks.unshift(new Array<T | undefined>(StesDeque.BLOCK_SIZE).fill(undefined));
    this.frontIdx += StesDeque.BLOCK_SIZE;
    this.backIdx += StesDeque.BLOCK_SIZE;
  }

  private _appendBlock(): void {
    this.blocks.push(new Array<T | undefined>(StesDeque.BLOCK_SIZE).fill(undefined));
  }
}

export { StesDeque };