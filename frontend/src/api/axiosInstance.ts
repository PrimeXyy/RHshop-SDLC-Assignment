import axios from 'axios';
import { setAccessToken, clearAuth } from '../redux/slices/authSlice';


import { resolveAuthHeaders } from './client';

let storeRef: any;

export const setupAxios = (store: any) => { storeRef = store; };

const BASE_URL = import.meta.env?.VITE_API_URL || '/api';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, 
});

// Attach access token & isolated session tokens (store_customer_token vs store_staff_token)
axiosInstance.interceptors.request.use((config) => {
  const customerToken = typeof localStorage !== 'undefined' ? localStorage.getItem('store_customer_token') : null;
  const staffToken = typeof localStorage !== 'undefined' ? localStorage.getItem('store_staff_token') : null;
  const url = config.url || '';

  const authHeaders = resolveAuthHeaders(url, customerToken, staffToken);
  for (const [key, value] of Object.entries(authHeaders)) {
    if (!config.headers[key]) {
      config.headers[key] = value;
    }
  }

  if (!config.headers.Authorization) {
    const token: string | null = storeRef?.getState()?.auth?.accessToken ?? null;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Silent token refresh on 401 with concurrent-request queuing
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    // Skip refresh for auth endpoints — they use 401 as a normal response (e.g. wrong password)
    const isAuthEndpoint = original?.url?.includes('/auth/');
    if (error.response?.status !== 401 || original._retry || isAuthEndpoint) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(axiosInstance(original));
          },
          reject,
        });
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post(
        `${BASE_URL}/auth/token`,
        {},
        { withCredentials: true }
      );
      const newToken: string = data.accessToken;
      storeRef?.dispatch(setAccessToken(newToken));
      processQueue(null, newToken);
      original.headers.Authorization = `Bearer ${newToken}`;
      return axiosInstance(original);
    } catch (refreshError) {
      processQueue(refreshError, null);
      storeRef?.dispatch(clearAuth());
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;
