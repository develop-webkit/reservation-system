import axios from 'axios';
import useAuthStore from '../store/authStore.js';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:7000/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

http.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }

    return Promise.reject(error);
  },
);

export default http;
