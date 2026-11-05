import test from 'node:test';
import assert from 'node:assert';
import jwt from 'jsonwebtoken';
import { generateToken, authenticate, requireRole, AuthenticatedRequest } from '../middleware/auth.js';
import { config } from '../config/env.js';
import { memoryDb } from '../config/prisma.js';

test('Session Isolation - Token Generation and Role Claims', () => {
  const customer = memoryDb.users.get('cust_001')!;
  const warehouse = memoryDb.users.get('ware_001')!;
  const admin = memoryDb.users.get('admin_001')!;

  const customerToken = generateToken(customer);
  const warehouseToken = generateToken(warehouse);
  const adminToken = generateToken(admin);

  const decodedCustomer = jwt.verify(customerToken, config.jwtSecret) as any;
  assert.strictEqual(decodedCustomer.role, 'CUSTOMER');
  assert.strictEqual(decodedCustomer.id, customer.id);

  const decodedWarehouse = jwt.verify(warehouseToken, config.jwtSecret) as any;
  assert.strictEqual(decodedWarehouse.role, 'WAREHOUSE');

  const decodedAdmin = jwt.verify(adminToken, config.jwtSecret) as any;
  assert.strictEqual(decodedAdmin.role, 'ADMIN');
});

test('Session Isolation - Actor Header Prioritization (x-customer-token vs x-staff-token)', (t, done) => {
  const customer = memoryDb.users.get('cust_001')!;
  const warehouse = memoryDb.users.get('ware_001')!;

  const customerToken = generateToken(customer);
  const warehouseToken = generateToken(warehouse);

  // Simulated request with BOTH headers present (e.g. testing in multi-tab browser)
  const req: any = {
    headers: {
      'x-customer-token': customerToken,
      'x-staff-token': warehouseToken,
    },
  };

  const res: any = {
    status: (code: number) => ({
      json: (data: any) => assert.fail(`Should not fail with ${code}: ${JSON.stringify(data)}`),
    }),
  };

  // 1. When staff route executes with authenticate('STAFF'), it MUST pick warehouseToken
  const staffAuth = authenticate('STAFF');
  staffAuth(req, res, () => {
    assert.strictEqual(req.user.role, 'WAREHOUSE');
    assert.strictEqual(req.user.id, warehouse.id);

    // 2. When customer route executes with authenticate('CUSTOMER'), it MUST pick customerToken
    const customerAuth = authenticate('CUSTOMER');
    customerAuth(req, res, () => {
      assert.strictEqual(req.user.role, 'CUSTOMER');
      assert.strictEqual(req.user.id, customer.id);
      done();
    });
  });
});

test('Session Isolation - Role Guard Rejection for Unauthorized Actor', (t, done) => {
  const customerReq: any = {
    user: {
      id: 'cust_001',
      role: 'CUSTOMER',
    },
  };

  let respondedCode = 0;
  let respondedBody: any = null;

  const res: any = {
    status: (code: number) => {
      respondedCode = code;
      return {
        json: (data: any) => {
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
  const { updateOrderStatus } = await import('../controllers/orderController.js');
  let statusCode = 0;
  let responseData: any = null;

  const req: any = {
    params: { id: 'ord_1001' },
    body: { nextStatus: 'PROCESSING' },
  };

  const res: any = {
    status: (code: number) => {
      statusCode = code;
      return {
        json: (data: any) => {
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
  const { cancelOrder } = await import('../controllers/orderController.js');
  let statusCode = 0;
  let responseData: any = null;

  const req: any = {
    user: { id: 'attacker_cust_999', role: 'CUSTOMER' },
    params: { id: 'ord_1001' },
    body: { reason: 'Malicious cancellation attempt' },
  };

  const res: any = {
    status: (code: number) => {
      statusCode = code;
      return {
        json: (data: any) => {
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
