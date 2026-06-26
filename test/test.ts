/**
 * Comprehensive test suite for all TsStes data structures
 */

import { StesStack } from '../StesStack';
import { StesQueue } from '../StesQueue';
import { StesDeque } from '../StesDeque';
import { StesLinkedList } from '../StesLinkedList';
import { StesSingleLinkedList } from '../StesSingleLinkedList';
import { StesPriorityQueue } from '../StesPriorityQueue';
import { StesAvl } from '../StesAvl';
import { StesRbTree } from '../StesRbTree';

// ─── Test Framework ────────────────────────────────────────────

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, message: string): void {
  totalTests++;
  if (condition) {
    passedTests++;
  } else {
    failedTests++;
    throw new Error(`❌ FAILED: ${message}`);
  }
}

function assertEqual<T>(actual: T, expected: T, message: string): void {
  totalTests++;
  if (actual === expected) {
    passedTests++;
  } else {
    failedTests++;
    throw new Error(`❌ FAILED: ${message}\n   Expected: ${expected}\n   Actual: ${actual}`);
  }
}

function assertArrayEqual<T>(actual: T[], expected: T[], message: string): void {
  totalTests++;
  if (actual.length === expected.length && actual.every((v, i) => v === expected[i])) {
    passedTests++;
  } else {
    failedTests++;
    throw new Error(`❌ FAILED: ${message}\n   Expected: [${expected}]\n   Actual: [${actual}]`);
  }
}

function test(name: string, fn: () => void): void {
  try {
    fn();
    process.stdout.write(`✓ ${name}\n`);
  } catch (error) {
    process.stdout.write(`✗ ${name}\n`);
    process.stdout.write(`  ${error}\n`);
  }
}

// ─── StesStack Tests ───────────────────────────────────────────

test('StesStack: basic operations', () => {
  const stack = new StesStack<number>();
  assert(stack.empty, 'New stack should be empty');
  assertEqual(stack.size, 0, 'New stack size should be 0');

  stack.push(1);
  stack.push(2);
  stack.push(3);
  assertEqual(stack.size, 3, 'Size should be 3');
  assertEqual(stack.top(), 3, 'Top should be 3');

  assertEqual(stack.pop(), 3, 'Pop should return 3');
  assertEqual(stack.top(), 2, 'Top should be 2');
  assertEqual(stack.size, 2, 'Size should be 2');
});

test('StesStack: constructor with items', () => {
  const stack = new StesStack([1, 2, 3]);
  assertEqual(stack.size, 3, 'Size should be 3');
  assertEqual(stack.top(), 3, 'Top should be 3');
});

test('StesStack: iterator', () => {
  const stack = new StesStack([1, 2, 3]);
  const arr = [...stack];
  assertArrayEqual(arr, [3, 2, 1], 'Iterator should be LIFO');
});

test('StesStack: clear and swap', () => {
  const s1 = new StesStack([1, 2, 3]);
  const s2 = new StesStack([4, 5]);
  s1.clear();
  assert(s1.empty, 'Cleared stack should be empty');

  s1.push(10);
  s1.swap(s2);
  assertEqual(s1.size, 2, 'After swap, s1 size should be 2');
  assertEqual(s2.size, 1, 'After swap, s2 size should be 1');
  assertEqual(s1.top(), 5, 'After swap, s1 top should be 5');
});

test('StesStack: equals', () => {
  const s1 = new StesStack([1, 2, 3]);
  const s2 = new StesStack([1, 2, 3]);
  const s3 = new StesStack([1, 2, 4]);
  assert(s1.equals(s2), 'Equal stacks should be equal');
  assert(!s1.equals(s3), 'Different stacks should not be equal');
});

// ─── StesQueue Tests ───────────────────────────────────────────

test('StesQueue: basic operations', () => {
  const queue = new StesQueue<number>();
  assert(queue.empty, 'New queue should be empty');

  queue.push(1);
  queue.push(2);
  queue.push(3);
  assertEqual(queue.size, 3, 'Size should be 3');
  assertEqual(queue.front(), 1, 'Front should be 1');
  assertEqual(queue.back(), 3, 'Back should be 3');

  assertEqual(queue.pop(), 1, 'Pop should return 1');
  assertEqual(queue.front(), 2, 'Front should be 2');
});

test('StesQueue: constructor with items', () => {
  const queue = new StesQueue([1, 2, 3]);
  assertEqual(queue.size, 3, 'Size should be 3');
  assertEqual(queue.front(), 1, 'Front should be 1');
  assertEqual(queue.back(), 3, 'Back should be 3');
});

test('StesQueue: iterator', () => {
  const queue = new StesQueue([1, 2, 3]);
  const arr = [...queue];
  assertArrayEqual(arr, [1, 2, 3], 'Iterator should be FIFO');
});

test('StesQueue: clear and swap', () => {
  const q1 = new StesQueue([1, 2, 3]);
  const q2 = new StesQueue([4, 5]);
  q1.clear();
  assert(q1.empty, 'Cleared queue should be empty');

  q1.push(10);
  q1.swap(q2);
  assertEqual(q1.size, 2, 'After swap, q1 size should be 2');
  assertEqual(q2.size, 1, 'After swap, q2 size should be 1');
});

test('StesQueue: equals', () => {
  const q1 = new StesQueue([1, 2, 3]);
  const q2 = new StesQueue([1, 2, 3]);
  const q3 = new StesQueue([1, 2, 4]);
  assert(q1.equals(q2), 'Equal queues should be equal');
  assert(!q1.equals(q3), 'Different queues should not be equal');
});

// ─── StesDeque Tests ───────────────────────────────────────────

test('StesDeque: basic operations', () => {
  const deque = new StesDeque<number>();
  assert(deque.empty, 'New deque should be empty');

  deque.pushBack(1);
  deque.pushBack(2);
  deque.pushFront(0);
  assertEqual(deque.size, 3, 'Size should be 3');
  assertEqual(deque.front(), 0, 'Front should be 0');
  assertEqual(deque.back(), 2, 'Back should be 2');
});

test('StesDeque: random access', () => {
  const deque = new StesDeque([10, 20, 30, 40, 50]);
  assertEqual(deque.at(0), 10, 'at(0) should be 10');
  assertEqual(deque.at(2), 30, 'at(2) should be 30');
  assertEqual(deque.at(4), 50, 'at(4) should be 50');

  deque.set(2, 99);
  assertEqual(deque.at(2), 99, 'After set(2, 99), at(2) should be 99');
});

test('StesDeque: pop operations', () => {
  const deque = new StesDeque([1, 2, 3, 4]);
  assertEqual(deque.popFront(), 1, 'popFront should return 1');
  assertEqual(deque.popBack(), 4, 'popBack should return 4');
  assertEqual(deque.size, 2, 'Size should be 2');
  assertEqual(deque.front(), 2, 'Front should be 2');
  assertEqual(deque.back(), 3, 'Back should be 3');
});

test('StesDeque: insert and erase', () => {
  const deque = new StesDeque([1, 2, 4, 5]);
  deque.insert(2, 3);
  assertArrayEqual(deque.toArray(), [1, 2, 3, 4, 5], 'After insert(2, 3)');

  const removed = deque.erase(2);
  assertEqual(removed, 3, 'erase(2) should return 3');
  assertArrayEqual(deque.toArray(), [1, 2, 4, 5], 'After erase(2)');
});

test('StesDeque: constructor variants', () => {
  const d1 = new StesDeque(3, 10);
  assertArrayEqual(d1.toArray(), [10, 10, 10], 'Constructor (3, 10)');

  const d2 = new StesDeque([1, 2, 3]);
  assertArrayEqual(d2.toArray(), [1, 2, 3], 'Constructor with iterable');
});

test('StesDeque: reverse iterator', () => {
  const deque = new StesDeque([1, 2, 3]);
  const arr = [...deque.reverse()];
  assertArrayEqual(arr, [3, 2, 1], 'Reverse iterator');
});

// ─── StesLinkedList Tests ──────────────────────────────────────

test('StesLinkedList: basic operations', () => {
  const list = new StesLinkedList<number>();
  assert(list.empty, 'New list should be empty');

  list.pushBack(1);
  list.pushFront(0);
  list.pushBack(2);
  assertEqual(list.size, 3, 'Size should be 3');
  assertEqual(list.front(), 0, 'Front should be 0');
  assertEqual(list.back(), 2, 'Back should be 2');
});

test('StesLinkedList: random access', () => {
  const list = new StesLinkedList([10, 20, 30, 40]);
  assertEqual(list.at(0), 10, 'at(0) should be 10');
  assertEqual(list.at(2), 30, 'at(2) should be 30');
  assertEqual(list.get(5), undefined, 'get(5) should be undefined');

  list.set(2, 99);
  assertEqual(list.at(2), 99, 'After set(2, 99)');
});

test('StesLinkedList: pop operations', () => {
  const list = new StesLinkedList([1, 2, 3, 4]);
  assertEqual(list.popFront(), 1, 'popFront should return 1');
  assertEqual(list.popBack(), 4, 'popBack should return 4');
  assertEqual(list.size, 2, 'Size should be 2');
});

test('StesLinkedList: insert and erase', () => {
  const list = new StesLinkedList([1, 2, 4, 5]);
  list.insert(2, 3);
  assertArrayEqual(list.toArray(), [1, 2, 3, 4, 5], 'After insert(2, 3)');

  const removed = list.erase(2);
  assertEqual(removed, 3, 'erase(2) should return 3');
  assertArrayEqual(list.toArray(), [1, 2, 4, 5], 'After erase(2)');
});

test('StesLinkedList: reverse iterator', () => {
  const list = new StesLinkedList([1, 2, 3]);
  const arr = [...list.reverse()];
  assertArrayEqual(arr, [3, 2, 1], 'Reverse iterator');
});

test('StesLinkedList: equals', () => {
  const l1 = new StesLinkedList([1, 2, 3]);
  const l2 = new StesLinkedList([1, 2, 3]);
  const l3 = new StesLinkedList([1, 2, 4]);
  assert(l1.equals(l2), 'Equal lists should be equal');
  assert(!l1.equals(l3), 'Different lists should not be equal');
});

// ─── StesPriorityQueue Tests ───────────────────────────────────

test('StesPriorityQueue: basic min-heap', () => {
  const pq = new StesPriorityQueue<number>();
  assert(pq.empty, 'New PQ should be empty');

  pq.offer(5);
  pq.offer(3);
  pq.offer(7);
  pq.offer(1);
  assertEqual(pq.size, 4, 'Size should be 4');
  assertEqual(pq.peek(), 1, 'Peek should be 1 (min)');

  assertEqual(pq.poll(), 1, 'Poll should return 1');
  assertEqual(pq.poll(), 3, 'Poll should return 3');
  assertEqual(pq.peek(), 5, 'Peek should be 5');
});

test('StesPriorityQueue: custom comparator (max-heap)', () => {
  const pq = new StesPriorityQueue<number>((a, b) => b - a);
  pq.offer(5);
  pq.offer(3);
  pq.offer(7);
  assertEqual(pq.peek(), 7, 'Max-heap peek should be 7');
  assertEqual(pq.poll(), 7, 'Max-heap poll should be 7');
});

test('StesPriorityQueue: constructor with items', () => {
  const pq = new StesPriorityQueue([5, 3, 7, 1, 9]);
  assertEqual(pq.size, 5, 'Size should be 5');
  assertEqual(pq.peek(), 1, 'Peek should be 1');
});

test('StesPriorityQueue: remove', () => {
  const pq = new StesPriorityQueue([5, 3, 7, 1]);
  assert(pq.remove(3), 'Remove 3 should succeed');
  assertEqual(pq.size, 3, 'Size should be 3');
  assert(!pq.remove(10), 'Remove 10 should fail');
});

test('StesPriorityQueue: sorted iterator', () => {
  const pq = new StesPriorityQueue([5, 3, 7, 1]);
  const sorted = [...pq.sorted()];
  assertArrayEqual(sorted, [1, 3, 5, 7], 'Sorted iterator');
});

// ─── StesAvl Tests ─────────────────────────────────────────────

test('StesAvl: basic operations', () => {
  const avl = new StesAvl<number, string>();
  assert(avl.empty, 'New AVL should be empty');

  avl.insert(5, 'five');
  avl.insert(3, 'three');
  avl.insert(7, 'seven');
  assertEqual(avl.size, 3, 'Size should be 3');
  assertEqual(avl.find(3), 'three', 'Find 3');
  assertEqual(avl.find(10), undefined, 'Find 10 should be undefined');
});

test('StesAvl: update existing key', () => {
  const avl = new StesAvl<number, string>();
  assert(avl.insert(5, 'five'), 'First insert should return true');
  assert(!avl.insert(5, 'FIVE'), 'Second insert should return false');
  assertEqual(avl.find(5), 'FIVE', 'Value should be updated');
});

test('StesAvl: remove', () => {
  const avl = new StesAvl<number, string>();
  [5, 3, 7, 1, 9].forEach(k => avl.insert(k, `v${k}`));
  assertEqual(avl.remove(3), 'v3', 'Remove should return value');
  assertEqual(avl.size, 4, 'Size should be 4');
  assertEqual(avl.remove(10), undefined, 'Remove non-existent should return undefined');
});

test('StesAvl: ordered operations', () => {
  const avl = new StesAvl<number, string>();
  [10, 20, 30, 40, 50].forEach(k => avl.insert(k, `v${k}`));

  assertEqual(avl.min()?.[0], 10, 'Min key should be 10');
  assertEqual(avl.max()?.[0], 50, 'Max key should be 50');

  const lb = avl.lowerBound(25);
  assertEqual(lb?.[0], 30, 'lowerBound(25) should be 30');

  const ub = avl.upperBound(30);
  assertEqual(ub?.[0], 40, 'upperBound(30) should be 40');
});

test('StesAvl: iterator', () => {
  const avl = new StesAvl<number, string>();
  [5, 3, 7, 1, 9].forEach(k => avl.insert(k, `v${k}`));
  const keys = [...avl.keys()];
  assertArrayEqual(keys, [1, 3, 5, 7, 9], 'Keys should be sorted');
});

test('StesAvl: equals', () => {
  const a1 = new StesAvl<number, string>();
  const a2 = new StesAvl<number, string>();
  [1, 2, 3].forEach(k => { a1.insert(k, `v${k}`); a2.insert(k, `v${k}`); });
  assert(a1.equals(a2), 'Equal AVLs should be equal');

  a2.insert(4, 'v4');
  assert(!a1.equals(a2), 'Different AVLs should not be equal');
});

// ─── StesRbTree Tests ──────────────────────────────────────────

test('StesRbTree: basic operations', () => {
  const tree = new StesRbTree<number, string>();
  assert(tree.empty, 'New tree should be empty');

  tree.insert(5, 'five');
  tree.insert(3, 'three');
  tree.insert(7, 'seven');
  assertEqual(tree.size, 3, 'Size should be 3');
  assertEqual(tree.find(3), 'three', 'Find 3');
  assertEqual(tree.find(10), undefined, 'Find 10 should be undefined');
});

test('StesRbTree: update existing key', () => {
  const tree = new StesRbTree<number, string>();
  assert(tree.insert(5, 'five'), 'First insert should return true');
  assert(!tree.insert(5, 'FIVE'), 'Second insert should return false');
  assertEqual(tree.find(5), 'FIVE', 'Value should be updated');
});

test('StesRbTree: remove', () => {
  const tree = new StesRbTree<number, string>();
  [5, 3, 7, 1, 9].forEach(k => tree.insert(k, `v${k}`));

  assertEqual(tree.remove(3), 'v3', 'Remove should return value');
  assertEqual(tree.size, 4, 'Size should be 4');
  assertEqual(tree.remove(10), undefined, 'Remove non-existent should return undefined');
});

test('StesRbTree: ordered operations', () => {
  const tree = new StesRbTree<number, string>();
  [10, 20, 30, 40, 50].forEach(k => tree.insert(k, `v${k}`));

  assertEqual(tree.firstKey(), 10, 'firstKey should be 10');
  assertEqual(tree.lastKey(), 50, 'lastKey should be 50');

  assertEqual(tree.ceilingKey(25), 30, 'ceilingKey(25) should be 30');
  assertEqual(tree.floorKey(25), 20, 'floorKey(25) should be 20');
  assertEqual(tree.lowerKey(30), 20, 'lowerKey(30) should be 20');
  assertEqual(tree.higherKey(30), 40, 'higherKey(30) should be 40');
});

test('StesRbTree: pollFirstEntry and pollLastEntry', () => {
  const tree = new StesRbTree<number, string>();
  [10, 20, 30].forEach(k => tree.insert(k, `v${k}`));

  const first = tree.pollFirstEntry();
  assertEqual(first?.[0], 10, 'pollFirstEntry key should be 10');
  assertEqual(tree.size, 2, 'Size should be 2');

  const last = tree.pollLastEntry();
  assertEqual(last?.[0], 30, 'pollLastEntry key should be 30');
  assertEqual(tree.size, 1, 'Size should be 1');
});

test('StesRbTree: iterator', () => {
  const tree = new StesRbTree<number, string>();
  [5, 3, 7, 1, 9].forEach(k => tree.insert(k, `v${k}`));
  const keys = [...tree.keys()];
  assertArrayEqual(keys, [1, 3, 5, 7, 9], 'Keys should be sorted');

  const descKeys = [...tree.descending()].map(([k]) => k);
  assertArrayEqual(descKeys, [9, 7, 5, 3, 1], 'Descending keys');
});

test('StesRbTree: large insert/remove sequence', () => {
  const tree = new StesRbTree<number, number>();
  const N = 1000;

  // Insert 0..999
  for (let i = 0; i < N; i++) {
    tree.insert(i, i * 10);
  }
  assertEqual(tree.size, N, 'Size should be 1000');

  // Verify all present
  for (let i = 0; i < N; i++) {
    assertEqual(tree.find(i), i * 10, `find(${i})`);
  }

  // Remove even numbers
  for (let i = 0; i < N; i += 2) {
    tree.remove(i);
  }
  assertEqual(tree.size, N / 2, 'Size should be 500');

  // Verify only odd remain
  for (let i = 0; i < N; i++) {
    if (i % 2 === 0) {
      assertEqual(tree.find(i), undefined, `Even ${i} should be removed`);
    } else {
      assertEqual(tree.find(i), i * 10, `Odd ${i} should exist`);
    }
  }
});

test('StesRbTree: equals', () => {
  const t1 = new StesRbTree<number, string>();
  const t2 = new StesRbTree<number, string>();
  [1, 2, 3].forEach(k => { t1.insert(k, `v${k}`); t2.insert(k, `v${k}`); });
  assert(t1.equals(t2), 'Equal trees should be equal');

  t2.insert(4, 'v4');
  assert(!t1.equals(t2), 'Different trees should not be equal');
});

test('StesRbTree: custom comparator', () => {
  const tree = new StesRbTree<number, string>((a, b) => b - a);
  [10, 20, 30].forEach(k => tree.insert(k, `v${k}`));
  const keys = [...tree.keys()];
  assertArrayEqual(keys, [30, 20, 10], 'Keys should be in descending order');
});

// ─── StesSingleLinkedList Tests ────────────────────────────────

test('StesSingleLinkedList: basic operations', () => {
  const list = new StesSingleLinkedList<number>();
  assert(list.empty, 'New list should be empty');

  list.pushBack(1);
  list.pushFront(0);
  list.pushBack(2);
  assertEqual(list.size, 3, 'Size should be 3');
  assertEqual(list.front(), 0, 'Front should be 0');
  assertEqual(list.back(), 2, 'Back should be 2');
});

test('StesSingleLinkedList: constructor with items', () => {
  const list = new StesSingleLinkedList([10, 20, 30]);
  assertEqual(list.size, 3, 'Size should be 3');
  assertEqual(list.front(), 10, 'Front should be 10');
  assertEqual(list.back(), 30, 'Back should be 30');
});

test('StesSingleLinkedList: random access', () => {
  const list = new StesSingleLinkedList([10, 20, 30, 40]);
  assertEqual(list.at(0), 10, 'at(0) should be 10');
  assertEqual(list.at(2), 30, 'at(2) should be 30');
  assertEqual(list.get(5), undefined, 'get(5) should be undefined');

  list.set(2, 99);
  assertEqual(list.at(2), 99, 'After set(2, 99)');
});

test('StesSingleLinkedList: pop operations', () => {
  const list = new StesSingleLinkedList([1, 2, 3, 4]);
  assertEqual(list.popFront(), 1, 'popFront should return 1');
  assertEqual(list.popBack(), 4, 'popBack should return 4');
  assertEqual(list.size, 2, 'Size should be 2');
  assertEqual(list.front(), 2, 'Front should be 2');
  assertEqual(list.back(), 3, 'Back should be 3');
});

test('StesSingleLinkedList: popBack single element', () => {
  const list = new StesSingleLinkedList([42]);
  assertEqual(list.popBack(), 42, 'popBack should return 42');
  assert(list.empty, 'List should be empty');
});

test('StesSingleLinkedList: insert and erase', () => {
  const list = new StesSingleLinkedList([1, 2, 4, 5]);
  list.insert(2, 3);
  assertArrayEqual(list.toArray(), [1, 2, 3, 4, 5], 'After insert(2, 3)');

  const removed = list.erase(2);
  assertEqual(removed, 3, 'erase(2) should return 3');
  assertArrayEqual(list.toArray(), [1, 2, 4, 5], 'After erase(2)');
});

test('StesSingleLinkedList: reverse', () => {
  const list = new StesSingleLinkedList([1, 2, 3, 4, 5]);
  list.reverse();
  assertArrayEqual(list.toArray(), [5, 4, 3, 2, 1], 'After reverse');
  assertEqual(list.front(), 5, 'Front should be 5');
  assertEqual(list.back(), 1, 'Back should be 1');
});

test('StesSingleLinkedList: iterator', () => {
  const list = new StesSingleLinkedList([1, 2, 3]);
  const arr = [...list];
  assertArrayEqual(arr, [1, 2, 3], 'Iterator should be forward');
});

test('StesSingleLinkedList: clear and swap', () => {
  const l1 = new StesSingleLinkedList([1, 2, 3]);
  const l2 = new StesSingleLinkedList([4, 5]);
  l1.clear();
  assert(l1.empty, 'Cleared list should be empty');

  l1.pushBack(10);
  l1.swap(l2);
  assertEqual(l1.size, 2, 'After swap, l1 size should be 2');
  assertEqual(l2.size, 1, 'After swap, l2 size should be 1');
});

test('StesSingleLinkedList: equals', () => {
  const l1 = new StesSingleLinkedList([1, 2, 3]);
  const l2 = new StesSingleLinkedList([1, 2, 3]);
  const l3 = new StesSingleLinkedList([1, 2, 4]);
  assert(l1.equals(l2), 'Equal lists should be equal');
  assert(!l1.equals(l3), 'Different lists should not be equal');
});

test('StesSingleLinkedList: toString', () => {
  const list = new StesSingleLinkedList([1, 2, 3]);
  assertEqual(list.toString(), 'StesSingleLinkedList(3) [1 → 2 → 3]', 'toString format');
});

// ─── Performance Benchmark ─────────────────────────────────────

test('Performance: Array.shift() vs StesDeque.popFront() (100k elements)', () => {
  const N = 100_000;

  // --- Array.shift() ---
  const arr: number[] = [];
  for (let i = 0; i < N; i++) arr.push(i);

  const arrStart = performance.now();
  while (arr.length > 0) arr.shift();
  const arrEnd = performance.now();
  const arrTime = arrEnd - arrStart;

  // --- StesDeque.popFront() ---
  const deque = new StesDeque<number>();
  for (let i = 0; i < N; i++) deque.pushBack(i);

  const dequeStart = performance.now();
  while (!deque.empty) deque.popFront();
  const dequeEnd = performance.now();
  const dequeTime = dequeEnd - dequeStart;

  process.stdout.write(`\n  [Benchmark] ${N.toLocaleString()} elements shift:\n`);
  process.stdout.write(`    Array.shift():      ${arrTime.toFixed(2)} ms\n`);
  process.stdout.write(`    StesDeque.popFront(): ${dequeTime.toFixed(2)} ms\n`);
  process.stdout.write(`    Speedup: ${(arrTime / dequeTime).toFixed(1)}x faster\n`);

  // Verify correctness
  assert(arrTime > 0, 'Array benchmark should complete');
  assert(dequeTime > 0, 'Deque benchmark should complete');
  assert(dequeTime < arrTime, `Deque (${dequeTime.toFixed(2)}ms) should be faster than Array.shift (${arrTime.toFixed(2)}ms)`);
});

// ─── Summary ───────────────────────────────────────────────────

process.stdout.write('\n' + '='.repeat(50) + '\n');
process.stdout.write(`Total: ${totalTests} | Passed: ${passedTests} | Failed: ${failedTests}\n`);
if (failedTests === 0) {
  process.stdout.write('✅ All tests passed!\n');
} else {
  process.stdout.write(`❌ ${failedTests} test(s) failed\n`);
  process.exit(1);
}
