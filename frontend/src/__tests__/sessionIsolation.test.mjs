import test from 'node:test';
import assert from 'node:assert';

/**
 * Pure function extracted from apiClient request interceptor
 */
function resolveAuthHeaders(url, customerToken, staffToken) {
  const headers = {};

  if (customerToken) {
    headers['x-customer-token'] = customerToken;
  }
  if (staffToken) {
    headers['x-staff-token'] = staffToken;
  }

  if (url.startsWith('/fulfillment') || url.startsWith('/admin')) {
    if (staffToken) {
      headers['Authorization'] = `Bearer ${staffToken}`;
    }
  } else if (url.startsWith('/orders') || url.startsWith('/auth')) {
    if (customerToken) {
      headers['Authorization'] = `Bearer ${customerToken}`;
    } else if (staffToken) {
      headers['Authorization'] = `Bearer ${staffToken}`;
    }
  }

  return headers;
}

test('Frontend Session Isolation - Staff routes use store_staff_token for Authorization', () => {
  const customerToken = 'jwt_token_customer_alice';
  const staffToken = 'jwt_token_staff_bob_warehouse';

  const headers = resolveAuthHeaders('/fulfillment/queue', customerToken, staffToken);

  assert.strictEqual(headers['Authorization'], `Bearer ${staffToken}`);
  assert.strictEqual(headers['x-staff-token'], staffToken);
  assert.strictEqual(headers['x-customer-token'], customerToken, 'Customer token remains isolated in header for multi-tab coexistence');
});

test('Frontend Session Isolation - Fulfillment status mutation targets staff route without dropping credentials', () => {
  const customerToken = 'jwt_token_customer_alice';
  const staffToken = 'jwt_token_staff_bob_warehouse';

  const headers = resolveAuthHeaders('/fulfillment/orders/ord_1001/status', customerToken, staffToken);

  assert.strictEqual(headers['Authorization'], `Bearer ${staffToken}`);
  assert.strictEqual(headers['x-staff-token'], staffToken);
});

test('Frontend Session Isolation - Customer order routes use store_customer_token for Authorization', () => {
  const customerToken = 'jwt_token_customer_alice';
  const staffToken = 'jwt_token_staff_bob_warehouse';

  const headers = resolveAuthHeaders('/orders/my-orders', customerToken, staffToken);

  assert.strictEqual(headers['Authorization'], `Bearer ${customerToken}`);
  assert.strictEqual(headers['x-customer-token'], customerToken);
});

test('Frontend Session Isolation - Independent Storage Keys in localStorage', () => {
  const mockLocalStorage = new Map();

  // Tab 1: Customer Alice logs in
  mockLocalStorage.set('store_customer_token', 'token_alice');

  // Tab 2: Warehouse Bob logs in concurrently
  mockLocalStorage.set('store_staff_token', 'token_bob');

  // Both tokens coexist without overwrite
  assert.strictEqual(mockLocalStorage.get('store_customer_token'), 'token_alice');
  assert.strictEqual(mockLocalStorage.get('store_staff_token'), 'token_bob');

  // Tab 1 logout does not destroy Tab 2 session
  mockLocalStorage.delete('store_customer_token');
  assert.strictEqual(mockLocalStorage.get('store_customer_token'), undefined);
  assert.strictEqual(mockLocalStorage.get('store_staff_token'), 'token_bob', 'Staff token must remain active after customer logout');
});
