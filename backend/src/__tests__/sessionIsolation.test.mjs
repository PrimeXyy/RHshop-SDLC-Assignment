import test from 'node:test';
import assert from 'node:assert';
import { generateToken, verifyToken, authenticate, requireRole } from '../middleware/auth.mjs';
import { memoryDb } from '../config/prisma.mjs';

test('Session Isolation - Token Generation and Role Claims', () => {
  const customer = memoryDb.users.get('cust_001');
  const warehouse = memoryDb.users.get('ware_001');
  const admin = memoryDb.users.get('admin_001');

  const customerToken = generateToken(customer);
  const warehouseToken = generateToken(warehouse);
  const adminToken = generateToken(admin);

  const decodedCustomer = verifyToken(customerToken);
  assert.strictEqual(decodedCustomer.role, 'CUSTOMER');
  assert.strictEqual(decodedCustomer.id, customer.id);

  const decodedWarehouse = verifyToken(warehouseToken);
  assert.strictEqual(decodedWarehouse.role, 'WAREHOUSE');

  const decodedAdmin = verifyToken(adminToken);
  assert.strictEqual(decodedAdmin.role, 'ADMIN');
});

test('Session Isolation - Actor Header Prioritization (x-customer-token vs x-staff-token)', (t, done) => {
  const customer = memoryDb.users.get('cust_001');
  const warehouse = memoryDb.users.get('ware_001');

  const customerToken = generateToken(customer);
  const warehouseToken = generateToken(warehouse);

  // Simulated request with BOTH headers present (testing in multi-tab browser)
  const req = {
    headers: {
      'x-customer-token': customerToken,
      'x-staff-token': warehouseToken,
    },
  };

  const res = {
    status: (code) => ({
      json: (data) => assert.fail(`Should not fail with ${code}: ${JSON.stringify(data)}`),
    }),
  };

  // Staff route with authenticate('STAFF') MUST select warehouseToken
  const staffAuth = authenticate('STAFF');
  staffAuth(req, res, () => {
    assert.strictEqual(req.user.role, 'WAREHOUSE');
    assert.strictEqual(req.user.id, warehouse.id);

    // Customer route with authenticate('CUSTOMER') MUST select customerToken
    const customerAuth = authenticate('CUSTOMER');
    customerAuth(req, res, () => {
      assert.strictEqual(req.user.role, 'CUSTOMER');
      assert.strictEqual(req.user.id, customer.id);
      done();
    });
  });
});

test('Session Isolation - Role Guard Rejection for Unauthorized Actor', (t, done) => {
  const customerReq = {
    user: {
      id: 'cust_001',
      role: 'CUSTOMER',
    },
  };

  let respondedCode = 0;
  let respondedBody = null;

  const res = {
    status: (code) => {
      respondedCode = code;
      return {
        json: (data) => {
          respondedBody = data;
        },
      };
    },
  };

  const guard = requireRole('WAREHOUSE', 'ADMIN');
  guard(customerReq, res, () => {
    assert.fail('Customer should not pass WAREHOUSE/ADMIN guard');
  });

  assert.strictEqual(respondedCode, 403);
  assert.strictEqual(respondedBody.success, false);
  assert.ok(respondedBody.message.includes('Forbidden'));
  done();
});

test('Session Isolation - Unauthenticated requests to transition orders are rejected', async () => {
  const { updateOrderStatus } = await import('../controllers/orderController.mjs');
  let statusCode = 0;
  let responseData = null;

  const req = {
    params: { id: 'ord_1001' },
    body: { nextStatus: 'PROCESSING' },
    // No user authenticated
  };

  const res = {
    status: (code) => {
      statusCode = code;
      return {
        json: (data) => {
          responseData = data;
        },
      };
    },
  };

  await updateOrderStatus(req, res);
  assert.strictEqual(statusCode, 401, 'Unauthenticated transition request must be rejected with 401');
  assert.strictEqual(responseData.success, false);
});

test('Session Isolation - Customer cannot cancel another customer order (Ownership Guard)', async () => {
  const { cancelOrder } = await import('../controllers/orderController.mjs');
  let statusCode = 0;
  let responseData = null;

  // Order ord_1001 belongs to cust_001
  // Attempt cancellation by attacker_cust_999
  const req = {
    user: { id: 'attacker_cust_999', role: 'CUSTOMER' },
    params: { id: 'ord_1001' },
    body: { reason: 'Malicious cancellation attempt' },
  };

  const res = {
    status: (code) => {
      statusCode = code;
      return {
        json: (data) => {
          responseData = data;
        },
      };
    },
  };

  await cancelOrder(req, res);
  assert.strictEqual(statusCode, 403, 'Customer should not be allowed to cancel another customer order');
  assert.strictEqual(responseData.success, false);
  assert.ok(responseData.message.includes('Unauthorized'));
});
