/**
 * A generic AVL tree (self-balancing binary search tree) implementation.
 * Similar to std::map in C++.
 * All operations (insert, remove, find) run in O(log n).
 * Keys must be unique; inserting a duplicate key updates the value.
 */

// ─── Node ──────────────────────────────────────────────────────

class AvlNode<K, V> {
  key: K;
  value: V;
  height: number;
  left: AvlNode<K, V> | null = null;
  right: AvlNode<K, V> | null = null;

  constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
    this.height = 1;
  }
}

// ─── StesAvl ───────────────────────────────────────────────────

type Comparator<K> = (a: K, b: K) => number;

class StesAvl<K, V> {
  private root: AvlNode<K, V> | null = null;
  private _size = 0;
  private cmp: Comparator<K>;

  constructor(comparator?: Comparator<K>) {
    this.cmp = comparator ?? ((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  }

  // ─── Capacity ────────────────────────────────────────────────

  get size(): number {
    return this._size;
  }

  get empty(): boolean {
    return this._size === 0;
  }

  // ─── Lookup ──────────────────────────────────────────────────

  /** Find value by key, returns undefined if not found */
  find(key: K): V | undefined {
    const node = this._findNode(key);
    return node ? node.value : undefined;
  }

  /** Check whether a key exists */
  has(key: K): boolean {
    return this._findNode(key) !== null;
  }

  /** Get value by key (alias for find) */
  get(key: K): V | undefined {
    return this.find(key);
  }

  // ─── Modifiers ───────────────────────────────────────────────

  /** Insert a key-value pair. If key exists, updates the value. Returns true if inserted, false if updated. */
  insert(key: K, value: V): boolean {
    const [newRoot, inserted] = this._insert(this.root, key, value);
    this.root = newRoot;
    if (inserted) this._size++;
    return inserted;
  }

  /** Remove a key. Returns the removed value, or undefined if not found. */
  remove(key: K): V | undefined {
    const [newRoot, removedValue] = this._remove(this.root, key);
    this.root = newRoot;
    if (removedValue !== undefined) this._size--;
    return removedValue;
  }

  /** Remove all entries */
  clear(): void {
    this.root = null;
    this._size = 0;
  }

  // ─── Ordered Set Operations ──────────────────────────────────

  /** Returns the entry with the smallest key >= given key (lower_bound) */
  lowerBound(key: K): [K, V] | undefined {
    let result: [K, V] | undefined = undefined;
    let node = this.root;
    while (node) {
      const c = this.cmp(node.key, key);
      if (c >= 0) {
        result = [node.key, node.value];
        node = node.left;
      } else {
        node = node.right;
      }
    }
    return result;
  }

  /** Returns the entry with the smallest key > given key (upper_bound) */
  upperBound(key: K): [K, V] | undefined {
    let result: [K, V] | undefined = undefined;
    let node = this.root;
    while (node) {
      const c = this.cmp(node.key, key);
      if (c > 0) {
        result = [node.key, node.value];
        node = node.left;
      } else {
        node = node.right;
      }
    }
    return result;
  }

  /** Returns the entry with the minimum key */
  min(): [K, V] | undefined {
    const node = this._minNode(this.root);
    return node ? [node.key, node.value] : undefined;
  }

  /** Returns the entry with the maximum key */
  max(): [K, V] | undefined {
    const node = this._maxNode(this.root);
    return node ? [node.key, node.value] : undefined;
  }

  // ─── Iterators ───────────────────────────────────────────────

  /** In-order iteration over [key, value] pairs */
  *[Symbol.iterator](): IterableIterator<[K, V]> {
    yield* this._inorder(this.root);
  }

  /** Iterate over keys in ascending order */
  *keys(): IterableIterator<K> {
    for (const [k] of this) yield k;
  }

  /** Iterate over values in key-ascending order */
  *values(): IterableIterator<V> {
    for (const [, v] of this) yield v;
  }

  /** Iterate over [key, value] entries in ascending order */
  *entries(): IterableIterator<[K, V]> {
    yield* this;
  }

  // ─── Algorithms ──────────────────────────────────────────────

  forEach(callback: (value: V, key: K) => void): void {
    for (const [k, v] of this) callback(v, k);
  }

  map<U>(callback: (value: V, key: K) => U): U[] {
    const result: U[] = [];
    for (const [k, v] of this) result.push(callback(v, k));
    return result;
  }

  toArray(): [K, V][] {
    return [...this];
  }

  // ─── Comparison ──────────────────────────────────────────────

  equals(other: StesAvl<K, V>, valueCmp?: (a: V, b: V) => boolean): boolean {
    if (this._size !== other._size) return false;
    const eq = valueCmp ?? ((a, b) => a === b);
    const itA = this[Symbol.iterator]();
    const itB = other[Symbol.iterator]();
    while (true) {
      const a = itA.next();
      const b = itB.next();
      if (a.done && b.done) return true;
      if (a.done !== b.done) return false;
      if (this.cmp(a.value[0], b.value[0]) !== 0) return false;
      if (!eq(a.value[1], b.value[1])) return false;
    }
  }

  // ─── String ──────────────────────────────────────────────────

  toString(): string {
    const pairs = this.toArray().map(([k, v]) => `${k} => ${v}`);
    return `StesAvl(${this._size}) {${pairs.join(', ')}}`;
  }

  // ─── Private: BST Core ───────────────────────────────────────

  private _findNode(key: K): AvlNode<K, V> | null {
    let node = this.root;
    while (node) {
      const c = this.cmp(key, node.key);
      if (c === 0) return node;
      node = c < 0 ? node.left : node.right;
    }
    return null;
  }

  private _insert(
    node: AvlNode<K, V> | null,
    key: K,
    value: V
  ): [AvlNode<K, V>, boolean] {
    if (!node) return [new AvlNode(key, value), true];

    const c = this.cmp(key, node.key);
    let inserted = true;

    if (c < 0) {
      const [newLeft, ins] = this._insert(node.left, key, value);
      node.left = newLeft;
      inserted = ins;
      if (!ins) node.value = value;
    } else if (c > 0) {
      const [newRight, ins] = this._insert(node.right, key, value);
      node.right = newRight;
      inserted = ins;
      if (!ins) node.value = value;
    } else {
      // Key exists → update value
      node.value = value;
      inserted = false;
    }

    if (!inserted) return [node, false];

    this._updateHeight(node);
    return [this._balance(node), true];
  }

  private _remove(
    node: AvlNode<K, V> | null,
    key: K
  ): [AvlNode<K, V> | null, V | undefined] {
    if (!node) return [null, undefined];

    const c = this.cmp(key, node.key);
    let removedValue: V | undefined;
    let newLeft = node.left;
    let newRight = node.right;

    if (c < 0) {
      const [nl, rv] = this._remove(node.left, key);
      newLeft = nl;
      removedValue = rv;
    } else if (c > 0) {
      const [nr, rv] = this._remove(node.right, key);
      newRight = nr;
      removedValue = rv;
    } else {
      // Found the node to remove
      removedValue = node.value;
      if (!node.left) return [node.right, removedValue];
      if (!node.right) return [node.left, removedValue];

      // Two children: replace with in-order successor (min of right subtree)
      const successor = this._minNode(node.right);
      node.key = successor.key;
      node.value = successor.value;
      const [nr] = this._remove(node.right, successor.key);
      newRight = nr;
      // Don't decrement size twice — the recursive call already did
      this._size++;
    }

    node.left = newLeft;
    node.right = newRight;
    this._updateHeight(node);
    return [this._balance(node), removedValue];
  }

  // ─── Private: Balancing ──────────────────────────────────────

  private _height(node: AvlNode<K, V> | null): number {
    return node ? node.height : 0;
  }

  private _balanceFactor(node: AvlNode<K, V>): number {
    return this._height(node.left) - this._height(node.right);
  }

  private _updateHeight(node: AvlNode<K, V>): void {
    node.height = 1 + Math.max(this._height(node.left), this._height(node.right));
  }

  private _balance(node: AvlNode<K, V>): AvlNode<K, V> {
    const bf = this._balanceFactor(node);

    // Left-heavy
    if (bf > 1) {
      if (this._balanceFactor(node.left!) < 0) {
        // Left-Right case
        node.left = this._rotateLeft(node.left!);
      }
      return this._rotateRight(node);
    }

    // Right-heavy
    if (bf < -1) {
      if (this._balanceFactor(node.right!) > 0) {
        // Right-Left case
        node.right = this._rotateRight(node.right!);
      }
      return this._rotateLeft(node);
    }

    return node;
  }

  // eslint-disable-next-line no-param-reassign
  private _rotateRight(y: AvlNode<K, V>): AvlNode<K, V> {
    const x = y.left!;
    const t2 = x.right;
    x.right = y;
    y.left = t2;
    this._updateHeight(y);
    this._updateHeight(x);
    return x;
  }

  // eslint-disable-next-line no-param-reassign
  private _rotateLeft(x: AvlNode<K, V>): AvlNode<K, V> {
    const y = x.right!;
    const t2 = y.left;
    y.left = x;
    x.right = t2;
    this._updateHeight(x);
    this._updateHeight(y);
    return y;
  }

  // ─── Private: Traversal Helpers ──────────────────────────────

  private _minNode(node: AvlNode<K, V> | null): AvlNode<K, V> {
    if (!node) throw new Error('StesAvl::_minNode — tree is empty');
    while (node.left) node = node.left;
    return node;
  }

  private _maxNode(node: AvlNode<K, V> | null): AvlNode<K, V> {
    if (!node) throw new Error('StesAvl::_maxNode — tree is empty');
    while (node.right) node = node.right;
    return node;
  }

  private *_inorder(node: AvlNode<K, V> | null): IterableIterator<[K, V]> {
    if (!node) return;
    yield* this._inorder(node.left);
    yield [node.key, node.value];
    yield* this._inorder(node.right);
  }
}

export { StesAvl };
export type { AvlNode, Comparator };
