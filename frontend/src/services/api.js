import axios from 'axios';
import { store }       from '../redux/store';
import { forceLogout } from '../redux/slices/authSlice';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request Interceptor ─────────────────────────────────────────────────────
// Auto-attach Bearer token from Redux to every request
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
// FIX: On 401 — clear BOTH Redux store AND localStorage, then redirect.
// Previously only localStorage was cleared leaving a zombie login state where
// the UI showed the user as logged in but every API call failed silently.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(forceLogout()); // clears Redux + localStorage atomically

      // Redirect outside of React component context
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;