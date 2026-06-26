/**
 * A generic Red-Black tree (self-balancing BST) implementation similar to Java's TreeMap.
 * All operations (insert, remove, find) run in O(log n).
 * Keys must be unique; inserting a duplicate key updates the value.
 *
 * Red-Black Tree properties:
 * 1. Every node is either red or black.
 * 2. The root is black.
 * 3. Every leaf (null) is black.
 * 4. If a node is red, both its children are black.
 * 5. For each node, all simple paths from the node to descendant leaves
 *    contain the same number of black nodes.
 */

// ─── Color ─────────────────────────────────────────────────────

const enum Color {
  RED,
  BLACK,
}

// ─── Node ──────────────────────────────────────────────────────

class RbNode<K, V> {
  key: K;
  value: V;
  color: Color;
  left: RbNode<K, V> | null = null;
  right: RbNode<K, V> | null = null;
  parent: RbNode<K, V> | null = null;

  constructor(key: K, value: V, color: Color = Color.RED) {
    this.key = key;
    this.value = value;
    this.color = color;
  }
}

// ─── StesRbTree ────────────────────────────────────────────────

type Comparator<K> = (a: K, b: K) => number;

class StesRbTree<K, V> {
  private root: RbNode<K, V> | null = null;
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

  /** Get value by key (alias for find, like Java TreeMap.get) */
  get(key: K): V | undefined {
    return this.find(key);
  }

  // ─── Modifiers ───────────────────────────────────────────────

  /**
   * Insert a key-value pair (like Java TreeMap.put).
   * If key exists, updates the value.
   * Returns true if inserted (new key), false if updated (existing key).
   */
  insert(key: K, value: V): boolean {
    // Standard BST insert
    let parent: RbNode<K, V> | null = null;
    let current = this.root;
    let cmp = 0;

    while (current !== null) {
      parent = current;
      cmp = this.cmp(key, current.key);
      if (cmp < 0) {
        current = current.left;
      } else if (cmp > 0) {
        current = current.right;
      } else {
        // Key exists → update value
        current.value = value;
        return false;
      }
    }

    const node = new RbNode(key, value, Color.RED);
    node.parent = parent;

    if (parent === null) {
      this.root = node;
    } else if (cmp < 0) {
      parent.left = node;
    } else {
      parent.right = node;
    }

    this._size++;
    this._insertFixup(node);
    return true;
  }

  /**
   * Remove a key (like Java TreeMap.remove).
   * Returns the removed value, or undefined if not found.
   */
  remove(key: K): V | undefined {
    const node = this._findNode(key);
    if (!node) return undefined;

    const removedValue = node.value;
    this._deleteNode(node);
    this._size--;
    return removedValue;
  }

  /** Remove all entries */
  clear(): void {
    this.root = null;
    this._size = 0;
  }

  // ─── Ordered Map Operations (Java TreeMap API) ───────────────

  /** Returns the entry with the smallest key >= given key (Java: ceilingEntry) */
  ceilingEntry(key: K): [K, V] | undefined {
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

  /** Returns the entry with the smallest key > given key (Java: higherEntry) */
  higherEntry(key: K): [K, V] | undefined {
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

  /** Returns the entry with the largest key <= given key (Java: floorEntry) */
  floorEntry(key: K): [K, V] | undefined {
    let result: [K, V] | undefined = undefined;
    let node = this.root;
    while (node) {
      const c = this.cmp(node.key, key);
      if (c <= 0) {
        result = [node.key, node.value];
        node = node.right;
      } else {
        node = node.left;
      }
    }
    return result;
  }

  /** Returns the entry with the largest key < given key (Java: lowerEntry) */
  lowerEntry(key: K): [K, V] | undefined {
    let result: [K, V] | undefined = undefined;
    let node = this.root;
    while (node) {
      const c = this.cmp(node.key, key);
      if (c < 0) {
        result = [node.key, node.value];
        node = node.right;
      } else {
        node = node.left;
      }
    }
    return result;
  }

  /** Ceiling key (alias for ceilingEntry, returns key only) */
  ceilingKey(key: K): K | undefined {
    return this.ceilingEntry(key)?.[0];
  }

  /** Higher key (alias for higherEntry, returns key only) */
  higherKey(key: K): K | undefined {
    return this.higherEntry(key)?.[0];
  }

  /** Floor key (alias for floorEntry, returns key only) */
  floorKey(key: K): K | undefined {
    return this.floorEntry(key)?.[0];
  }

  /** Lower key (alias for lowerEntry, returns key only) */
  lowerKey(key: K): K | undefined {
    return this.lowerEntry(key)?.[0];
  }

  /** Returns the entry with the minimum key (Java: firstEntry) */
  firstEntry(): [K, V] | undefined {
    const node = this._minNode(this.root);
    return node ? [node.key, node.value] : undefined;
  }

  /** Returns the entry with the maximum key (Java: lastEntry) */
  lastEntry(): [K, V] | undefined {
    const node = this._maxNode(this.root);
    return node ? [node.key, node.value] : undefined;
  }

  /** Returns the minimum key (Java: firstKey) */
  firstKey(): K | undefined {
    return this.firstEntry()?.[0];
  }

  /** Returns the maximum key (Java: lastKey) */
  lastKey(): K | undefined {
    return this.lastEntry()?.[0];
  }

  /** Remove and return the entry with the minimum key (Java: pollFirstEntry) */
  pollFirstEntry(): [K, V] | undefined {
    const node = this._minNode(this.root);
    if (!node) return undefined;
    const entry: [K, V] = [node.key, node.value];
    this._deleteNode(node);
    this._size--;
    return entry;
  }

  /** Remove and return the entry with the maximum key (Java: pollLastEntry) */
  pollLastEntry(): [K, V] | undefined {
    const node = this._maxNode(this.root);
    if (!node) return undefined;
    const entry: [K, V] = [node.key, node.value];
    this._deleteNode(node);
    this._size--;
    return entry;
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

  /** Reverse in-order iteration (descending) */
  *descending(): IterableIterator<[K, V]> {
    yield* this._reverseInorder(this.root);
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

  equals(other: StesRbTree<K, V>, valueCmp?: (a: V, b: V) => boolean): boolean {
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
    return `StesRbTree(${this._size}) {${pairs.join(', ')}}`;
  }

  // ─── Debug ───────────────────────────────────────────────────

  /** Verify red-black tree properties (for testing) */
  private _verify(): void {
    if (!this.root) return;

    // Property 2: Root is black
    if (this.root.color !== Color.BLACK) {
      throw new Error('RB verify: root is not black');
    }

    // Check all properties recursively
    this._verifyNode(this.root);
  }

  /** Returns the black-height of the subtree; throws if properties violated */
  private _verifyNode(node: RbNode<K, V>): number {
    // Property 4: Red node cannot have red children
    if (node.color === Color.RED) {
      if (node.left && node.left.color === Color.RED) {
        throw new Error(`RB verify: red node (${node.key}) has red left child`);
      }
      if (node.right && node.right.color === Color.RED) {
        throw new Error(`RB verify: red node (${node.key}) has red right child`);
      }
    }

    // BST property
    if (node.left && this.cmp(node.left.key, node.key) >= 0) {
      throw new Error(`RB verify: BST violation at ${node.key} (left)`);
    }
    if (node.right && this.cmp(node.right.key, node.key) <= 0) {
      throw new Error(`RB verify: BST violation at ${node.key} (right)`);
    }

    const leftBh = node.left ? this._verifyNode(node.left) : 0;
    const rightBh = node.right ? this._verifyNode(node.right) : 0;

    // Property 5: Equal black-height on both sides
    if (leftBh !== rightBh) {
      throw new Error(
        `RB verify: black-height mismatch at ${node.key}: left=${leftBh}, right=${rightBh}`
      );
    }

    return leftBh + (node.color === Color.BLACK ? 1 : 0);
  }

  // ─── Private: BST Core ───────────────────────────────────────

  private _findNode(key: K): RbNode<K, V> | null {
    let node = this.root;
    while (node) {
      const c = this.cmp(key, node.key);
      if (c === 0) return node;
      node = c < 0 ? node.left : node.right;
    }
    return null;
  }

  private _minNode(node: RbNode<K, V> | null): RbNode<K, V> | null {
    if (!node) return null;
    while (node.left) node = node.left;
    return node;
  }

  private _maxNode(node: RbNode<K, V> | null): RbNode<K, V> | null {
    if (!node) return null;
    while (node.right) node = node.right;
    return node;
  }

  /** In-order successor */
  private _successor(node: RbNode<K, V>): RbNode<K, V> | null {
    if (node.right) {
      return this._minNode(node.right);
    }
    let current = node;
    let parent = current.parent;
    while (parent && current === parent.right) {
      current = parent;
      parent = parent.parent;
    }
    return parent;
  }

  /** In-order predecessor */
  private _predecessor(node: RbNode<K, V>): RbNode<K, V> | null {
    if (node.left) {
      return this._maxNode(node.left);
    }
    let current = node;
    let parent = current.parent;
    while (parent && current === parent.left) {
      current = parent;
      parent = parent.parent;
    }
    return parent;
  }

  // ─── Private: Red-Black Tree Operations ──────────────────────

  /**
   * Left rotation (same as Java TreeMap.rotateLeft).
   *
   *     x              y
   *    / \            / \
   *   a   y    →    x   c
   *      / \       / \
   *     b   c     a   b
   */
  private _rotateLeft(x: RbNode<K, V>): void {
    const y = x.right!;
    x.right = y.left;
    if (y.left) y.left.parent = x;
    y.parent = x.parent;

    if (x.parent === null) {
      this.root = y;
    } else if (x === x.parent.left) {
      x.parent.left = y;
    } else {
      x.parent.right = y;
    }

    y.left = x;
    x.parent = y;
  }

  /**
   * Right rotation (same as Java TreeMap.rotateRight).
   *
   *       y            x
   *      / \          / \
   *     x   c  →    a   y
   *    / \              / \
   *   a   b            b   c
   */
  private _rotateRight(y: RbNode<K, V>): void {
    const x = y.left!;
    y.left = x.right;
    if (x.right) x.right.parent = y;
    x.parent = y.parent;

    if (y.parent === null) {
      this.root = x;
    } else if (y === y.parent.right) {
      y.parent.right = x;
    } else {
      y.parent.left = x;
    }

    x.right = y;
    y.parent = x;
  }

  /**
   * Fix red-black properties after insertion (CLRS / Java TreeMap style).
   * The newly inserted node is always RED. We only need to fix violations
   * when the parent is also RED.
   */
  private _insertFixup(node: RbNode<K, V>): void {
    let x = node;

    while (x !== this.root && x.parent!.color === Color.RED) {
      const parent = x.parent!;
      const grandparent = parent.parent!;

      if (parent === grandparent.left) {
        const uncle = grandparent.right;

        if (uncle && uncle.color === Color.RED) {
          // Case 1: Uncle is red → recolor
          parent.color = Color.BLACK;
          uncle.color = Color.BLACK;
          grandparent.color = Color.RED;
          x = grandparent;
        } else {
          if (x === parent.right) {
            // Case 2: Uncle is black, x is right child → left rotate
            x = parent;
            this._rotateLeft(x);
          }
          // Case 3: Uncle is black, x is left child → right rotate
          x.parent!.color = Color.BLACK;
          x.parent!.parent!.color = Color.RED;
          this._rotateRight(x.parent!.parent!);
        }
      } else {
        // Mirror: parent is right child of grandparent
        const uncle = grandparent.left;

        if (uncle && uncle.color === Color.RED) {
          // Case 1: Uncle is red → recolor
          parent.color = Color.BLACK;
          uncle.color = Color.BLACK;
          grandparent.color = Color.RED;
          x = grandparent;
        } else {
          if (x === parent.left) {
            // Case 2: Uncle is black, x is left child → right rotate
            x = parent;
            this._rotateRight(x);
          }
          // Case 3: Uncle is black, x is right child → left rotate
          x.parent!.color = Color.BLACK;
          x.parent!.parent!.color = Color.RED;
          this._rotateLeft(x.parent!.parent!);
        }
      }
    }

    this.root!.color = Color.BLACK;
  }

  /**
   * Delete a node from the tree (CLRS / Java TreeMap style).
   * Handles the standard BST deletion + red-black fixup.
   */
  private _deleteNode(node: RbNode<K, V>): void {
    // Find the node to actually splice out.
    // If node has two children, use its in-order successor.
    let target = node;
    if (target.left && target.right) {
      target = this._successor(target)!;
    }

    // target has at most one child
    const child = target.left ?? target.right;

    // Replace target with child
    if (child) {
      child.parent = target.parent;
    }

    if (target.parent === null) {
      this.root = child;
    } else if (target === target.parent.left) {
      target.parent.left = child;
    } else {
      target.parent.right = child;
    }

    // If the removed node was black, we need to fixup
    if (target.color === Color.BLACK) {
      if (child) {
        this._deleteFixup(child);
      } else if (target.parent !== null) {
        // child is null — use a sentinel-like approach
        // We pass a temporary null reference via the parent
        this._deleteFixupNull(target.parent, target === target.parent.left);
      }
      // If target was root with no children, tree is now empty — no fixup needed
    }

    // If we used a successor, copy its key/value into the original node
    if (target !== node) {
      node.key = target.key;
      node.value = target.value;
    }
  }

  /**
   * Fix red-black properties after deletion when the child exists (CLRS).
   * The child is passed as `x` — it carries the "extra black" from the deleted node.
   */
  private _deleteFixup(x: RbNode<K, V>): void {
    while (x !== this.root && x.color === Color.BLACK) {
      const parent = x.parent!;

      if (x === parent.left) {
        let sibling = parent.right!;

        if (sibling.color === Color.RED) {
          // Case 1: Sibling is red → rotate to make sibling black
          sibling.color = Color.BLACK;
          parent.color = Color.RED;
          this._rotateLeft(parent);
          sibling = parent.right!;
        }

        const slColor = sibling.left?.color ?? Color.BLACK;
        const srColor = sibling.right?.color ?? Color.BLACK;

        if (slColor === Color.BLACK && srColor === Color.BLACK) {
          // Case 2: Sibling's children are both black → recolor sibling
          sibling.color = Color.RED;
          x = parent;
        } else {
          if (srColor === Color.BLACK) {
            // Case 3: Sibling's right child is black → rotate right
            if (sibling.left) sibling.left.color = Color.BLACK;
            sibling.color = Color.RED;
            this._rotateRight(sibling);
            sibling = parent.right!;
          }
          // Case 4: Sibling's right child is red → rotate left
          sibling.color = parent.color;
          parent.color = Color.BLACK;
          if (sibling.right) sibling.right.color = Color.BLACK;
          this._rotateLeft(parent);
          x = this.root!; // done
        }
      } else {
        // Mirror: x is right child
        let sibling = parent.left!;

        if (sibling.color === Color.RED) {
          // Case 1
          sibling.color = Color.BLACK;
          parent.color = Color.RED;
          this._rotateRight(parent);
          sibling = parent.left!;
        }

        const slColor = sibling.left?.color ?? Color.BLACK;
        const srColor = sibling.right?.color ?? Color.BLACK;

        if (slColor === Color.BLACK && srColor === Color.BLACK) {
          // Case 2
          sibling.color = Color.RED;
          x = parent;
        } else {
          if (slColor === Color.BLACK) {
            // Case 3
            if (sibling.right) sibling.right.color = Color.BLACK;
            sibling.color = Color.RED;
            this._rotateLeft(sibling);
            sibling = parent.left!;
          }
          // Case 4
          sibling.color = parent.color;
          parent.color = Color.BLACK;
          if (sibling.left) sibling.left.color = Color.BLACK;
          this._rotateRight(parent);
          x = this.root!; // done
        }
      }
    }

    x.color = Color.BLACK;
    if (this.root) this.root.color = Color.BLACK;
  }

  /**
   * Fix red-black properties after deletion when the child is null.
   * `parent` is the parent of the deleted node, `isLeftChild` indicates
   * which side the deleted node was on.
   */
  private _deleteFixupNull(parent: RbNode<K, V>, isLeftChild: boolean): void {
    // We simulate a "double-black null" by working with the parent directly.
    // This is conceptually the same as CLRS but handles the null child case
    // without an explicit sentinel node.

    let xParent = parent;
    let xIsLeft = isLeftChild;

    while (xParent !== null) {
      if (xIsLeft) {
        let sibling = xParent.right;
        if (!sibling) break; // shouldn't happen in a valid RB tree

        if (sibling.color === Color.RED) {
          // Case 1: Sibling is red
          sibling.color = Color.BLACK;
          xParent.color = Color.RED;
          this._rotateLeft(xParent);
          sibling = xParent.right;
          if (!sibling) break;
        }

        const slColor = sibling.left?.color ?? Color.BLACK;
        const srColor = sibling.right?.color ?? Color.BLACK;

        if (slColor === Color.BLACK && srColor === Color.BLACK) {
          // Case 2: Both sibling children are black
          sibling.color = Color.RED;
          // Move up
          if (xParent === this.root) return;
          xIsLeft = xParent === xParent.parent!.left;
          xParent = xParent.parent!;
        } else {
          if (srColor === Color.BLACK) {
            // Case 3: Sibling's right is black
            if (sibling.left) sibling.left.color = Color.BLACK;
            sibling.color = Color.RED;
            this._rotateRight(sibling);
            sibling = xParent.right;
            if (!sibling) break;
          }
          // Case 4: Sibling's right is red
          sibling.color = xParent.color;
          xParent.color = Color.BLACK;
          if (sibling.right) sibling.right.color = Color.BLACK;
          this._rotateLeft(xParent);
          return; // done
        }
      } else {
        // Mirror: x is right child
        let sibling = xParent.left;
        if (!sibling) break;

        if (sibling.color === Color.RED) {
          // Case 1
          sibling.color = Color.BLACK;
          xParent.color = Color.RED;
          this._rotateRight(xParent);
          sibling = xParent.left;
          if (!sibling) break;
        }

        const slColor = sibling.left?.color ?? Color.BLACK;
        const srColor = sibling.right?.color ?? Color.BLACK;

        if (slColor === Color.BLACK && srColor === Color.BLACK) {
          // Case 2
          sibling.color = Color.RED;
          if (xParent === this.root) return;
          xIsLeft = xParent === xParent.parent!.left;
          xParent = xParent.parent!;
        } else {
          if (slColor === Color.BLACK) {
            // Case 3
            if (sibling.right) sibling.right.color = Color.BLACK;
            sibling.color = Color.RED;
            this._rotateLeft(sibling);
            sibling = xParent.left;
            if (!sibling) break;
          }
          // Case 4
          sibling.color = xParent.color;
          xParent.color = Color.BLACK;
          if (sibling.left) sibling.left.color = Color.BLACK;
          this._rotateRight(xParent);
          return; // done
        }
      }
    }
  }

  // ─── Private: Traversal Helpers ──────────────────────────────

  private *_inorder(node: RbNode<K, V> | null): IterableIterator<[K, V]> {
    if (!node) return;
    yield* this._inorder(node.left);
    yield [node.key, node.value];
    yield* this._inorder(node.right);
  }

  private *_reverseInorder(node: RbNode<K, V> | null): IterableIterator<[K, V]> {
    if (!node) return;
    yield* this._reverseInorder(node.right);
    yield [node.key, node.value];
    yield* this._reverseInorder(node.left);
  }
}

export { StesRbTree };
export type { RbNode, Comparator };
