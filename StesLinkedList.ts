/**
 * A generic doubly-linked list implementation similar to C++ std::list / Java LinkedList.
 * Supports O(1) push/pop at both ends, and O(n) random access by index.
 */

class ListNode<T> {
  value: T;
  prev: ListNode<T> | null = null;
  next: ListNode<T> | null = null;
  constructor(value: T) {
    this.value = value;
  }
}

class StesLinkedList<T> {
  private head: ListNode<T> | null = null;
  private tail: ListNode<T> | null = null;
  private _size = 0;

  constructor();
  constructor(items: Iterable<T>);
  constructor(items?: Iterable<T>) {
    if (items) {
      for (const item of items) {
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

  /** Access the first element */
  front(): T {
    if (!this.head) throw new Error('StesLinkedList::front — list is empty');
    return this.head.value;
  }

  /** Access the last element */
  back(): T {
    if (!this.tail) throw new Error('StesLinkedList::back — list is empty');
    return this.tail.value;
  }

  /** Access element at index */
  at(index: number): T {
    const node = this._nodeAt(index);
    if (!node) throw new RangeError(`StesLinkedList::at — index ${index} out of range [0, ${this._size})`);
    return node.value;
  }

  /** Get element at index, returns undefined if out of range */
  get(index: number): T | undefined {
    const node = this._nodeAt(index);
    return node ? node.value : undefined;
  }

  /** Set element at index */
  set(index: number, value: T): void {
    const node = this._nodeAt(index);
    if (!node) throw new RangeError(`StesLinkedList::set — index ${index} out of range [0, ${this._size})`);
    node.value = value;
  }

  // ─── Modifiers ───────────────────────────────────────────────

  /** Insert element at the front */
  pushFront(value: T): void {
    const node = new ListNode(value);
    if (this.head) {
      node.next = this.head;
      this.head.prev = node;
      this.head = node;
    } else {
      this.head = this.tail = node;
    }
    this._size++;
  }

  /** Insert element at the back */
  pushBack(value: T): void {
    const node = new ListNode(value);
    if (this.tail) {
      node.prev = this.tail;
      this.tail.next = node;
      this.tail = node;
    } else {
      this.head = this.tail = node;
    }
    this._size++;
  }

  /** Remove and return the first element */
  popFront(): T {
    if (!this.head) throw new Error('StesLinkedList::popFront — list is empty');
    const value = this.head.value;
    this.head = this.head.next;
    if (this.head) {
      this.head.prev = null;
    } else {
      this.tail = null;
    }
    this._size--;
    return value;
  }

  /** Remove and return the last element */
  popBack(): T {
    if (!this.tail) throw new Error('StesLinkedList::popBack — list is empty');
    const value = this.tail.value;
    this.tail = this.tail.prev;
    if (this.tail) {
      this.tail.next = null;
    } else {
      this.head = null;
    }
    this._size--;
    return value;
  }

  /** Insert element at index */
  insert(index: number, value: T): void {
    if (index < 0 || index > this._size) {
      throw new RangeError(`StesLinkedList::insert — index ${index} out of range [0, ${this._size}]`);
    }
    if (index === 0) { this.pushFront(value); return; }
    if (index === this._size) { this.pushBack(value); return; }

    const node = this._nodeAt(index);
    if (!node) throw new RangeError(`StesLinkedList::insert — index ${index} out of range`);

    const newNode = new ListNode(value);
    newNode.prev = node.prev;
    newNode.next = node;
    if (node.prev) node.prev.next = newNode;
    node.prev = newNode;
    this._size++;
  }

  /** Remove element at index, returns the removed value */
  erase(index: number): T {
    if (index < 0 || index >= this._size) {
      throw new RangeError(`StesLinkedList::erase — index ${index} out of range [0, ${this._size})`);
    }
    if (index === 0) return this.popFront();
    if (index === this._size - 1) return this.popBack();

    const node = this._nodeAt(index);
    if (!node) throw new RangeError(`StesLinkedList::erase — index ${index} out of range`);

    const value = node.value;
    if (node.prev) node.prev.next = node.next;
    if (node.next) node.next.prev = node.prev;
    this._size--;
    return value;
  }

  /** Remove all elements */
  clear(): void {
    this.head = null;
    this.tail = null;
    this._size = 0;
  }

  /** Swap contents with another list */
  swap(other: StesLinkedList<T>): void {
    [this.head, other.head] = [other.head, this.head];
    [this.tail, other.tail] = [other.tail, this.tail];
    [this._size, other._size] = [other._size, this._size];
  }

  // ─── Iterators ───────────────────────────────────────────────

  /** Forward iteration */
  *[Symbol.iterator](): IterableIterator<T> {
    let node = this.head;
    while (node) {
      yield node.value;
      node = node.next;
    }
  }

  /** Reverse iteration */
  *reverse(): IterableIterator<T> {
    let node = this.tail;
    while (node) {
      yield node.value;
      node = node.prev;
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

  map<U>(callback: (value: T, index: number) => U): U[] {
    const result: U[] = [];
    let node = this.head;
    let i = 0;
    while (node) {
      result.push(callback(node.value, i++));
      node = node.next;
    }
    return result;
  }

  find(predicate: (value: T, index: number) => boolean): T | undefined {
    let node = this.head;
    let i = 0;
    while (node) {
      if (predicate(node.value, i)) return node.value;
      node = node.next;
      i++;
    }
    return undefined;
  }

  toArray(): T[] {
    return [...this];
  }

  // ─── Comparison ──────────────────────────────────────────────

  equals(other: StesLinkedList<T>, cmp?: (a: T, b: T) => boolean): boolean {
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
    return `StesLinkedList(${this._size}) [${this.toArray().join(', ')}]`;
  }

  // ─── Private Helpers ─────────────────────────────────────────

  private _nodeAt(index: number): ListNode<T> | null {
    if (index < 0 || index >= this._size) return null;

    let node: ListNode<T> | null;
    // Choose the shorter traversal direction
    if (index < this._size / 2) {
      node = this.head;
      for (let i = 0; i < index; i++) {
        node = node!.next;
      }
    } else {
      node = this.tail;
      for (let i = this._size - 1; i > index; i--) {
        node = node!.prev;
      }
    }
    return node;
  }
}

export { StesLinkedList };
export type { ListNode };
