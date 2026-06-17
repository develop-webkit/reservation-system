import axios from 'axios';
import useAuthStore from '../store/authStore.js';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:7000/api/v1',
  timeout: 15000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let failedRequestQueue = [];

const processQueue = (error) => {
  failedRequestQueue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve();
  });
  failedRequestQueue = [];
};

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const url = originalRequest?.url ?? '';

    // Don't intercept auth endpoints — prevents infinite refresh loops
    if (url.includes('/auth/')) {
      if (status === 401) {
        useAuthStore.getState().logout();
      }
      return Promise.reject(error);
    }

    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequestQueue.push({ resolve, reject });
        })
          .then(() => http(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await http.post('/auth/refresh');
        processQueue(null);
        return http(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default http;
