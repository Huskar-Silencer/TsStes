/**
 * A generic singly-linked list implementation similar to C++ std::forward_list.
 * Supports O(1) pushFront/popFront, O(1) pushBack (via tail pointer).
 * popBack and random access by index are O(n).
 * More memory-efficient than doubly-linked list (no prev pointer per node).
 */

class SListNode<T> {
  value: T;
  next: SListNode<T> | null = null;
  constructor(value: T) {
    this.value = value;
  }
}

class StesSingleLinkedList<T> {
  private head: SListNode<T> | null = null;
  private tail: SListNode<T> | null = null;
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
    if (!this.head) throw new Error('StesSingleLinkedList::front — list is empty');
    return this.head.value;
  }

  /** Access the last element */
  back(): T {
    if (!this.tail) throw new Error('StesSingleLinkedList::back — list is empty');
    return this.tail.value;
  }

  /** Access element at index */
  at(index: number): T {
    const node = this._nodeAt(index);
    if (!node) throw new RangeError(`StesSingleLinkedList::at — index ${index} out of range [0, ${this._size})`);
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
    if (!node) throw new RangeError(`StesSingleLinkedList::set — index ${index} out of range [0, ${this._size})`);
    node.value = value;
  }

  // ─── Modifiers ───────────────────────────────────────────────

  /** Insert element at the front — O(1) */
  pushFront(value: T): void {
    const node = new SListNode(value);
    node.next = this.head;
    this.head = node;
    if (!this.tail) {
      this.tail = node;
    }
    this._size++;
  }

  /** Insert element at the back — O(1) */
  pushBack(value: T): void {
    const node = new SListNode(value);
    if (this.tail) {
      this.tail.next = node;
    } else {
      this.head = node;
    }
    this.tail = node;
    this._size++;
  }

  /** Remove and return the first element — O(1) */
  popFront(): T {
    if (!this.head) throw new Error('StesSingleLinkedList::popFront — list is empty');
    const value = this.head.value;
    this.head = this.head.next;
    if (!this.head) {
      this.tail = null;
    }
    this._size--;
    return value;
  }

  /** Remove and return the last element — O(n) */
  popBack(): T {
    if (!this.tail) throw new Error('StesSingleLinkedList::popBack — list is empty');

    // Only one element
    if (this.head === this.tail) {
      const value = this.tail.value;
      this.head = this.tail = null;
      this._size--;
      return value;
    }

    // Find the second-to-last node
    let node = this.head!;
    while (node.next !== this.tail) {
      node = node.next!;
    }
    const value = this.tail.value;
    node.next = null;
    this.tail = node;
    this._size--;
    return value;
  }

  /** Insert element at index — O(n) */
  insert(index: number, value: T): void {
    if (index < 0 || index > this._size) {
      throw new RangeError(`StesSingleLinkedList::insert — index ${index} out of range [0, ${this._size}]`);
    }
    if (index === 0) { this.pushFront(value); return; }
    if (index === this._size) { this.pushBack(value); return; }

    // Find the node just before the insertion point
    const prev = this._nodeAt(index - 1);
    if (!prev) throw new RangeError(`StesSingleLinkedList::insert — index ${index} out of range`);

    const newNode = new SListNode(value);
    newNode.next = prev.next;
    prev.next = newNode;
    this._size++;
  }

  /** Remove element at index, returns the removed value — O(n) */
  erase(index: number): T {
    if (index < 0 || index >= this._size) {
      throw new RangeError(`StesSingleLinkedList::erase — index ${index} out of range [0, ${this._size})`);
    }
    if (index === 0) return this.popFront();
    if (index === this._size - 1) return this.popBack();

    // Find the node just before the one to erase
    const prev = this._nodeAt(index - 1);
    if (!prev) throw new RangeError(`StesSingleLinkedList::erase — index ${index} out of range`);

    const target = prev.next!;
    const value = target.value;
    prev.next = target.next;
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
  swap(other: StesSingleLinkedList<T>): void {
    [this.head, other.head] = [other.head, this.head];
    [this.tail, other.tail] = [other.tail, this.tail];
    [this._size, other._size] = [other._size, this._size];
  }

  /** Reverse the list in-place — O(n) */
  reverse(): void {
    let prev: SListNode<T> | null = null;
    let current = this.head;
    this.tail = this.head; // old head becomes new tail

    while (current) {
      const next = current.next;
      current.next = prev;
      prev = current;
      current = next;
    }

    this.head = prev;
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

  equals(other: StesSingleLinkedList<T>, cmp?: (a: T, b: T) => boolean): boolean {
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
    return `StesSingleLinkedList(${this._size}) [${this.toArray().join(' → ')}]`;
  }

  // ─── Private Helpers ─────────────────────────────────────────

  private _nodeAt(index: number): SListNode<T> | null {
    if (index < 0 || index >= this._size) return null;

    let node = this.head;
    for (let i = 0; i < index; i++) {
      node = node!.next;
    }
    return node;
  }
}

export { StesSingleLinkedList };
export type { SListNode };
