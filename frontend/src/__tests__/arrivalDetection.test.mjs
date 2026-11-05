import test from 'node:test';
import assert from 'node:assert';

/**
 * Pure function extracted from useFulfillmentQueue change detection logic
 */
function detectNewOrderArrivals(prevKnownIds, incomingOrders, isInitialLoad) {
  const currentIds = new Set(incomingOrders.map((o) => o.id));

  if (isInitialLoad) {
    return {
      newlyArrivedIds: [],
      updatedKnownIds: currentIds,
      shouldPlayAudio: false,
    };
  }

  const newlyArrivedIds = [];
  currentIds.forEach((id) => {
    if (!prevKnownIds.has(id)) {
      newlyArrivedIds.push(id);
    }
  });

  return {
    newlyArrivedIds,
    updatedKnownIds: currentIds,
    shouldPlayAudio: newlyArrivedIds.length > 0,
  };
}

test('Arrival Change Detection - Initial load populates known set without false alarm chime', () => {
  const initialBatch = [{ id: 'ord_1' }, { id: 'ord_2' }];
  const result = detectNewOrderArrivals(new Set(), initialBatch, true);

  assert.strictEqual(result.shouldPlayAudio, false, 'Initial load should not play arrival chime');
  assert.strictEqual(result.newlyArrivedIds.length, 0);
  assert.strictEqual(result.updatedKnownIds.has('ord_1'), true);
  assert.strictEqual(result.updatedKnownIds.has('ord_2'), true);
});

test('Arrival Change Detection - New order ID in subsequent poll triggers Web Audio chime & highlight', () => {
  const knownIds = new Set(['ord_1', 'ord_2']);
  const polledBatch = [{ id: 'ord_1' }, { id: 'ord_2' }, { id: 'ord_3_NEW' }];

  const result = detectNewOrderArrivals(knownIds, polledBatch, false);

  assert.strictEqual(result.shouldPlayAudio, true, 'Brand new order ID must trigger audio chime');
  assert.deepStrictEqual(result.newlyArrivedIds, ['ord_3_NEW']);
  assert.strictEqual(result.updatedKnownIds.has('ord_3_NEW'), true);
});

test('Arrival Change Detection - Unchanged poll list does NOT re-trigger chime', () => {
  const knownIds = new Set(['ord_1', 'ord_2', 'ord_3_NEW']);
  const sameBatch = [{ id: 'ord_1' }, { id: 'ord_2' }, { id: 'ord_3_NEW' }];

  const result = detectNewOrderArrivals(knownIds, sameBatch, false);

  assert.strictEqual(result.shouldPlayAudio, false, 'Unchanged poll cycle must not trigger audio chime');
  assert.strictEqual(result.newlyArrivedIds.length, 0);
});

test('Arrival Change Detection - Admin Live Order Queue triggers chime on incoming customer ticket', () => {
  const adminKnownIds = new Set(['ord_1001']);
  const adminPolledOrders = [{ id: 'ord_1001' }, { id: 'ord_1002_NEW_CUSTOMER_ORDER' }];

  const result = detectNewOrderArrivals(adminKnownIds, adminPolledOrders, false);

  assert.strictEqual(result.shouldPlayAudio, true, 'Admin order queue must trigger arrival chime on new order');
  assert.deepStrictEqual(result.newlyArrivedIds, ['ord_1002_NEW_CUSTOMER_ORDER']);
  assert.strictEqual(result.updatedKnownIds.has('ord_1002_NEW_CUSTOMER_ORDER'), true);
});
