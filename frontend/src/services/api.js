import axios from 'axios';
import { store } from '../redux/store';          // your Redux store
import { forceLogout } from '../redux/slices/authSlice';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request Interceptor ─────────────────────────────────────────────────────
// Automatically attach the Bearer token from Redux state to every request.
// Reading from Redux (not localStorage) keeps a single source of truth.
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

// ─── Response Interceptor ────────────────────────────────────────────────────
// FIX #2: When the server responds with 401 (token expired / invalid),
// dispatch forceLogout which clears BOTH Redux state AND localStorage.
//
// Previously, only localStorage was cleared here, so the Redux store kept the
// old user object — giving a "zombie login" where the UI looked logged-in but
// every API call silently failed.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear Redux store + localStorage in one atomic action
      store.dispatch(forceLogout());

      // Redirect to login without relying on React Router
      // (we're outside of a component here)
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;