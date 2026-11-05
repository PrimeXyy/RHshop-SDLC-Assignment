import test from 'node:test';
import assert from 'node:assert';
import {
  validateStateTransition,
  getAvailableNextStates,
} from '../stateMachine/orderStateMachine.mjs';

test('Order State Machine - Delivery Lifecycle Happy Path', () => {
  const step1 = validateStateTransition('PLACED', 'PROCESSING', 'WAREHOUSE', 'DELIVERY');
  assert.strictEqual(step1.valid, true, 'Warehouse should be able to accept PLACED order into PROCESSING');

  const step2 = validateStateTransition('PROCESSING', 'SHIPPED', 'WAREHOUSE', 'DELIVERY');
  assert.strictEqual(step2.valid, true, 'Warehouse should be able to mark DELIVERY order as SHIPPED');

  const step3 = validateStateTransition('SHIPPED', 'DELIVERED', 'WAREHOUSE', 'DELIVERY');
  assert.strictEqual(step3.valid, true, 'Order should transition to DELIVERED');
});

test('Order State Machine - Pickup Lifecycle Happy Path', () => {
  const step1 = validateStateTransition('PLACED', 'PROCESSING', 'WAREHOUSE', 'PICKUP');
  assert.strictEqual(step1.valid, true);

  const step2 = validateStateTransition('PROCESSING', 'READY_FOR_PICKUP', 'WAREHOUSE', 'PICKUP');
  assert.strictEqual(step2.valid, true, 'Pickup order should transition to READY_FOR_PICKUP');

  const step3 = validateStateTransition('READY_FOR_PICKUP', 'COMPLETED', 'WAREHOUSE', 'PICKUP');
  assert.strictEqual(step3.valid, true, 'Pickup order should transition to COMPLETED when customer collects');
});

test('Order State Machine - Invalid Transitions Rejected', () => {
  const invalidJump = validateStateTransition('PLACED', 'DELIVERED', 'ADMIN');
  assert.strictEqual(invalidJump.valid, false);
  assert.ok(invalidJump.error.includes('Invalid transition'));

  const backward = validateStateTransition('DELIVERED', 'PLACED', 'ADMIN');
  assert.strictEqual(backward.valid, false);

  const wrongType = validateStateTransition('PROCESSING', 'READY_FOR_PICKUP', 'WAREHOUSE', 'DELIVERY');
  assert.strictEqual(wrongType.valid, false);
  assert.ok(wrongType.error.includes('DELIVERY'));
});

test('Order State Machine - Role Authorization Enforcement', () => {
  const customerAttempt = validateStateTransition('PLACED', 'PROCESSING', 'CUSTOMER');
  assert.strictEqual(customerAttempt.valid, false);
  assert.ok(customerAttempt.error.includes('not authorized'));

  const customerShip = validateStateTransition('PROCESSING', 'SHIPPED', 'CUSTOMER');
  assert.strictEqual(customerShip.valid, false);

  // Customer can cancel while in PLACED state
  const customerCancelPlaced = validateStateTransition('PLACED', 'CANCELLED', 'CUSTOMER');
  assert.strictEqual(customerCancelPlaced.valid, true);

  // Customer CANNOT cancel once warehouse begins PROCESSING
  const customerCancelProcessing = validateStateTransition('PROCESSING', 'CANCELLED', 'CUSTOMER');
  assert.strictEqual(customerCancelProcessing.valid, false);
  assert.ok(customerCancelProcessing.error.includes('PLACED status'));

  // Warehouse or Admin CAN cancel order during PROCESSING
  const warehouseCancelProcessing = validateStateTransition('PROCESSING', 'CANCELLED', 'WAREHOUSE');
  assert.strictEqual(warehouseCancelProcessing.valid, true);

  // Warehouse CANNOT cancel order once SHIPPED
  const warehouseCancelShipped = validateStateTransition('SHIPPED', 'CANCELLED', 'WAREHOUSE');
  assert.strictEqual(warehouseCancelShipped.valid, false);
});

test('Order State Machine - getAvailableNextStates returns appropriate transitions for role', () => {
  const warehouseOptions = getAvailableNextStates('PLACED', 'WAREHOUSE', 'DELIVERY');
  assert.deepStrictEqual(warehouseOptions, ['PROCESSING', 'CANCELLED']);

  const customerOptions = getAvailableNextStates('PLACED', 'CUSTOMER', 'DELIVERY');
  assert.deepStrictEqual(customerOptions, ['CANCELLED']);

  const terminalOptions = getAvailableNextStates('COMPLETED', 'ADMIN', 'DELIVERY');
  assert.deepStrictEqual(terminalOptions, []);
});
