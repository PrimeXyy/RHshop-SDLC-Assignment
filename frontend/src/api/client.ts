import axios from 'axios';

// Create Axios client pointing to reverse proxy '/api'
export const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Helper to compute isolated session headers based on route and storage tokens
 */
export function resolveAuthHeaders(
  url: string,
  customerToken?: string | null,
  staffToken?: string | null
): Record<string, string> {
  const headers: Record<string, string> = {};

  // 1. Maintain isolated actor headers so backend guards authenticate correct actor
  if (customerToken) {
    headers['x-customer-token'] = customerToken;
  }
  if (staffToken) {
    headers['x-staff-token'] = staffToken;
  }

  // 2. Select appropriate Bearer token context
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

/**
 * Request Interceptor for Multi-Role Session Isolation:
 * Injects store_customer_token and store_staff_token so concurrent customer and staff tabs
 * do not overwrite each other or fail role checks.
 */
apiClient.interceptors.request.use((config) => {
  const customerToken = localStorage.getItem('store_customer_token');
  const staffToken = localStorage.getItem('store_staff_token');
  const url = config.url || '';

  const authHeaders = resolveAuthHeaders(url, customerToken, staffToken);

  // Apply resolved headers if not explicitly set
  for (const [key, value] of Object.entries(authHeaders)) {
    if (!config.headers[key]) {
      config.headers[key] = value;
    }
  }

  return config;
});
