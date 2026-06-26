# TsStes - TypeScript Data Structures Library

A comprehensive collection of generic data structure implementations in TypeScript, inspired by C++ STL, Java Collections, and CLRS algorithms.

## 📦 Data Structures

### Linear Structures

| Structure | File | Description | Time Complexity |
|-----------|------|-------------|-----------------|
| **Stack** | `StesStack.ts` | LIFO stack backed by dynamic array | push/pop: O(1) amortized |
| **Queue** | `StesQueue.ts` | FIFO queue backed by linked list | push/pop: O(1) |
| **Deque** | `StesDeque.ts` | Double-ended queue with block-based storage | push/pop both ends: O(1) amortized |
| **Linked List** | `StesLinkedList.ts` | Doubly-linked list (like C++ std::list) | push/pop both ends: O(1), random access: O(n) |
| **Single Linked List** | `StesSingleLinkedList.ts` | Singly-linked list (like C++ std::forward_list) | pushFront/popFront: O(1), popBack: O(n) |

### Tree Structures

| Structure | File | Description | Time Complexity |
|-----------|------|-------------|-----------------|
| **Priority Queue** | `StesPriorityQueue.ts` | Binary min-heap (like Java PriorityQueue) | offer/poll: O(log n), peek: O(1) |
| **AVL Tree** | `StesAvl.ts` | Self-balancing BST (like C++ std::map) | insert/remove/find: O(log n) |
| **Red-Black Tree** | `StesRbTree.ts` | Red-Black tree (like Java TreeMap) | insert/remove/find: O(log n) |

## ✨ Features

- **Generic Types**: All data structures support generic types `<K, V>` or `<T>`
- **Custom Comparators**: Support for custom comparison functions
- **Iterator Protocol**: Implements `Symbol.iterator` for `for...of` loops
- **Comprehensive API**: Rich set of methods similar to STL/Java Collections
- **Type Safe**: Full TypeScript strict mode support
- **Well Tested**: 2159+ test cases with 100% pass rate

## 🚀 Installation

```bash
# Clone the repository
git clone <repo-url>
cd TsStes

# Install dependencies
npm install

# Build
npm run build
```

## 📖 Usage Examples

### Stack
```typescript
import { StesStack } from './StesStack';

const stack = new StesStack<number>();
stack.push(1);
stack.push(2);
stack.push(3);

console.log(stack.top());    // 3
console.log(stack.pop());    // 3
console.log(stack.size);     // 2
```

### Queue
```typescript
import { StesQueue } from './StesQueue';

const queue = new StesQueue<number>([1, 2, 3]);
queue.push(4);

console.log(queue.front());  // 1
console.log(queue.pop());    // 1
console.log(queue.back());   // 4
```

### Deque
```typescript
import { StesDeque } from './StesDeque';

const deque = new StesDeque<number>();
deque.pushBack(1);
deque.pushFront(0);
deque.pushBack(2);

console.log(deque.at(1));    // 1
console.log(deque.popFront()); // 0
console.log(deque.popBack());  // 2
```

### Linked List
```typescript
import { StesLinkedList } from './StesLinkedList';

const list = new StesLinkedList<number>([1, 2, 3]);
list.pushFront(0);
list.pushBack(4);
list.insert(2, 99);

console.log(list.toArray()); // [0, 1, 99, 2, 3, 4]
```

### Priority Queue
```typescript
import { StesPriorityQueue } from './StesPriorityQueue';

// Min-heap (default)
const pq = new StesPriorityQueue<number>();
pq.offer(5);
pq.offer(3);
pq.offer(7);

console.log(pq.peek());  // 3
console.log(pq.poll());  // 3

// Max-heap with custom comparator
const maxPQ = new StesPriorityQueue<number>((a, b) => b - a);
maxPQ.offer(5);
maxPQ.offer(3);
console.log(maxPQ.peek()); // 5
```

### AVL Tree
```typescript
import { StesAvl } from './StesAvl';

const avl = new StesAvl<number, string>();
avl.insert(5, 'five');
avl.insert(3, 'three');
avl.insert(7, 'seven');

console.log(avl.find(3));      // 'three'
console.log(avl.min()?.[0]);   // 3
console.log(avl.max()?.[0]);   // 7
console.log(avl.lowerBound(4)); // [5, 'five']
```

### Red-Black Tree
```typescript
import { StesRbTree } from './StesRbTree';

const tree = new StesRbTree<number, string>();
tree.insert(10, 'ten');
tree.insert(20, 'twenty');
tree.insert(30, 'thirty');

console.log(tree.ceilingKey(15)); // 20
console.log(tree.floorKey(25));   // 20
console.log(tree.firstKey());     // 10
console.log(tree.lastKey());      // 30

// Iteration
for (const [key, value] of tree) {
  console.log(`${key} => ${value}`);
}
```

## 🧪 Testing

```bash
# Run all tests
npx tsx test/test.ts

# Expected output:
# ✓ StesStack: basic operations
# ✓ StesQueue: basic operations
# ...
# ==================================================
# Total: 2159 | Passed: 2159 | Failed: 0
# ✅ All tests passed!
```

## 📊 Performance

### Deque vs Array.shift() (100,000 elements)
```
Array.shift():      857.82 ms
StesDeque.popFront(): 4.60 ms
Speedup: 186.3x faster 🚀
```

The block-based deque implementation provides **O(1)** amortized push/pop at both ends, while `Array.shift()` is **O(n)** due to element shifting.

## 🏗️ Architecture

### Design Principles

1. **Generic Types**: All structures use TypeScript generics for type safety
2. **Consistent API**: Similar naming conventions across all data structures
3. **Iterator Support**: All collections implement `Symbol.iterator`
4. **Error Handling**: Clear error messages with structure name prefixes
5. **Memory Efficiency**: Optimized internal representations

### Common API Pattern

All data structures follow this pattern:

```typescript
// Capacity
get size(): number
get empty(): boolean

// Element Access
front(): T
back(): T  // if applicable
at(index: number): T  // if applicable

// Modifiers
pushFront(value: T): void
pushBack(value: T): void
popFront(): T
popBack(): T
clear(): void

// Iterators
*[Symbol.iterator](): IterableIterator<T>

// Algorithms
forEach(callback: (value: T, index: number) => void): void
map<U>(callback: (value: T, index: number) => U): U[]
find(predicate: (value: T) => boolean): T | undefined
toArray(): T[]
equals(other: Structure<T>): boolean
toString(): string
```

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please ensure:
- All tests pass
- New features include tests
- Code follows existing style conventions
