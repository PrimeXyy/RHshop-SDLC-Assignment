import test from 'node:test';
import assert from 'node:assert';
import {
  validateStateTransition,
  getAvailableNextStates,
  OrderStatus,
  Role,
} from '../stateMachine/orderStateMachine.js';

test('Order State Machine - Delivery Lifecycle Happy Path', () => {
  // 1. PLACED -> PROCESSING (Warehouse)
  const step1 = validateStateTransition('PLACED', 'PROCESSING', 'WAREHOUSE', 'DELIVERY');
  assert.strictEqual(step1.valid, true, 'Warehouse should be able to accept PLACED order into PROCESSING');

  // 2. PROCESSING -> SHIPPED (Warehouse)
  const step2 = validateStateTransition('PROCESSING', 'SHIPPED', 'WAREHOUSE', 'DELIVERY');
  assert.strictEqual(step2.valid, true, 'Warehouse should be able to mark DELIVERY order as SHIPPED');

  // 3. SHIPPED -> DELIVERED (Warehouse / Carrier / Admin)
  const step3 = validateStateTransition('SHIPPED', 'DELIVERED', 'WAREHOUSE', 'DELIVERY');
  assert.strictEqual(step3.valid, true, 'Order should transition to DELIVERED');
});

test('Order State Machine - Pickup Lifecycle Happy Path', () => {
  // 1. PLACED -> PROCESSING (Warehouse)
  const step1 = validateStateTransition('PLACED', 'PROCESSING', 'WAREHOUSE', 'PICKUP');
  assert.strictEqual(step1.valid, true);

  // 2. PROCESSING -> READY_FOR_PICKUP (Warehouse)
  const step2 = validateStateTransition('PROCESSING', 'READY_FOR_PICKUP', 'WAREHOUSE', 'PICKUP');
  assert.strictEqual(step2.valid, true, 'Pickup order should transition to READY_FOR_PICKUP');

  // 3. READY_FOR_PICKUP -> COMPLETED (Warehouse / Customer Pickup)
  const step3 = validateStateTransition('READY_FOR_PICKUP', 'COMPLETED', 'WAREHOUSE', 'PICKUP');
  assert.strictEqual(step3.valid, true, 'Pickup order should transition to COMPLETED when customer collects');
});

test('Order State Machine - Invalid Transitions Rejected', () => {
  // Invalid jump from PLACED directly to DELIVERED
  const invalidJump = validateStateTransition('PLACED', 'DELIVERED', 'ADMIN');
  assert.strictEqual(invalidJump.valid, false);
  assert.ok(invalidJump.error?.includes('Invalid transition'));

  // Invalid backward transition from DELIVERED back to PLACED
  const backward = validateStateTransition('DELIVERED', 'PLACED', 'ADMIN');
  assert.strictEqual(backward.valid, false);

  // Invalid pickup status on delivery order
  const wrongType = validateStateTransition('PROCESSING', 'READY_FOR_PICKUP', 'WAREHOUSE', 'DELIVERY');
  assert.strictEqual(wrongType.valid, false);
  assert.ok(wrongType.error?.includes('DELIVERY'));
});

test('Order State Machine - Role Authorization Enforcement', () => {
  // Customer CANNOT transition order from PLACED to PROCESSING
  const customerAttempt = validateStateTransition('PLACED', 'PROCESSING', 'CUSTOMER');
  assert.strictEqual(customerAttempt.valid, false);
  assert.ok(customerAttempt.error?.includes('not authorized'));

  // Customer CANNOT mark order SHIPPED
  const customerShip = validateStateTransition('PROCESSING', 'SHIPPED', 'CUSTOMER');
  assert.strictEqual(customerShip.valid, false);

  // Customer CAN cancel their order while still in PLACED
  const customerCancel = validateStateTransition('PLACED', 'CANCELLED', 'CUSTOMER');
  assert.strictEqual(customerCancel.valid, true);

  // Customer CANNOT cancel once PROCESSING starts
  const customerCancelProcessing = validateStateTransition('PROCESSING', 'CANCELLED', 'CUSTOMER');
  assert.strictEqual(customerCancelProcessing.valid, false);

  // Warehouse CAN cancel order during PROCESSING
  const warehouseCancel = validateStateTransition('PROCESSING', 'CANCELLED', 'WAREHOUSE');
  assert.strictEqual(warehouseCancel.valid, true);
});

test('Order State Machine - getAvailableNextStates returns appropriate transitions for role', () => {
  const warehouseOptions = getAvailableNextStates('PLACED', 'WAREHOUSE', 'DELIVERY');
  assert.deepStrictEqual(warehouseOptions, ['PROCESSING', 'CANCELLED']);

  const customerOptions = getAvailableNextStates('PLACED', 'CUSTOMER', 'DELIVERY');
  assert.deepStrictEqual(customerOptions, ['CANCELLED']);

  const terminalOptions = getAvailableNextStates('COMPLETED', 'ADMIN', 'DELIVERY');
  assert.deepStrictEqual(terminalOptions, []);
});
