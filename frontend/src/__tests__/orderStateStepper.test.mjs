import test from 'node:test';
import assert from 'node:assert';

const DELIVERY_STEPS = ['PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
const PICKUP_STEPS = ['PLACED', 'PROCESSING', 'READY_FOR_PICKUP', 'COMPLETED'];
const TERMINAL_STATUSES = new Set(['COMPLETED', 'DELIVERED', 'CANCELLED']);

function computeStepIndex(status, fulfillmentType) {
  if (status === 'CANCELLED') return -1;
  const steps = fulfillmentType === 'PICKUP' ? PICKUP_STEPS : DELIVERY_STEPS;
  return steps.indexOf(status);
}

function shouldContinuePolling(status) {
  return !TERMINAL_STATUSES.has(status);
}

test('Order State Stepper - Delivery Lifecycle Step Progression', () => {
  assert.strictEqual(computeStepIndex('PLACED', 'DELIVERY'), 0);
  assert.strictEqual(computeStepIndex('PROCESSING', 'DELIVERY'), 1);
  assert.strictEqual(computeStepIndex('SHIPPED', 'DELIVERY'), 2);
  assert.strictEqual(computeStepIndex('DELIVERED', 'DELIVERY'), 3);
});

test('Order State Stepper - Pickup Lifecycle Step Progression', () => {
  assert.strictEqual(computeStepIndex('PLACED', 'PICKUP'), 0);
  assert.strictEqual(computeStepIndex('PROCESSING', 'PICKUP'), 1);
  assert.strictEqual(computeStepIndex('READY_FOR_PICKUP', 'PICKUP'), 2);
  assert.strictEqual(computeStepIndex('COMPLETED', 'PICKUP'), 3);
});

test('Order State Stepper - Terminal Status Stops Polling Interval', () => {
  // Active states must poll
  assert.strictEqual(shouldContinuePolling('PLACED'), true);
  assert.strictEqual(shouldContinuePolling('PROCESSING'), true);
  assert.strictEqual(shouldContinuePolling('SHIPPED'), true);
  assert.strictEqual(shouldContinuePolling('READY_FOR_PICKUP'), true);

  // Terminal states must stop polling
  assert.strictEqual(shouldContinuePolling('DELIVERED'), false);
  assert.strictEqual(shouldContinuePolling('COMPLETED'), false);
  assert.strictEqual(shouldContinuePolling('CANCELLED'), false);
});
