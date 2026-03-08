import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ─── Helpers ─────────────────────────────────────────
const getStoredUser = () => {
  try {
    const user = localStorage.getItem('user');
    if (!user || user === 'undefined') return null;
    return JSON.parse(user);
  } catch {
    return null;
  }
};

const storedUser = getStoredUser();
const storedToken = localStorage.getItem('token');

// ─── Initial State ───────────────────────────────────
const initialState = {
  user: storedUser || null,
  token: storedToken || null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
  isAuthenticated: !!storedToken,
};

// ─── LOAD USER ───────────────────────────────────────
export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      if (!token) return thunkAPI.rejectWithValue('No token');

      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = response.data.user || response.data;
      localStorage.setItem('user', JSON.stringify(user));

      return user;
    } catch (error) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');

      // ✅ Standardized error handling
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to load user'
      );
    }
  }
);

// ─── REGISTER ───────────────────────────────────────
export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      return response.data; // { user, token }
    } catch (error) {
      // ✅ Standardized error handling
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || 'Registration failed'
      );
    }
  }
);

// ─── LOGIN ──────────────────────────────────────────
export const login = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, userData);
      return response.data; // { user, token }
    } catch (error) {
      // ✅ Standardized error handling
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || 'Login failed'
      );
    }
  }
);

// ─── UPDATE PROFILE ─────────────────────────────────
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;

      const {
        role,
        isApproved,
        isActive,
        isVerified,
        token: _,
        password,
        _id,
        createdAt,
        updatedAt,
        __v,
        ...safeData
      } = profileData;

      const response = await axios.put(
        `${API_URL}/auth/profile`,
        safeData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.data;
    } catch (error) {
      // ✅ Standardized error handling
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || 'Profile update failed'
      );
    }
  }
);

// ─── LOGOUT ─────────────────────────────────────────
// Note: This is technically synchronous but kept as async thunk for consistency
// Not a breaking error - just adds pending/fulfilled actions for a sync operation
export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
});

// ─── SLICE ──────────────────────────────────────────
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },

    // Used by api.js interceptor
    forceLogout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';

      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder

      // ── LOAD USER
      .addCase(loadUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loadUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })

      // ── REGISTER
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        // ✅ Set both user and token immediately
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;

        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })

      // ── LOGIN
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        // ✅ Set both user and token immediately - critical for navigation
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;

        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })

      // ── UPDATE PROFILE
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // ── LOGOUT
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
      });
  },
});

export const { reset, forceLogout } = authSlice.actions;
export default authSlice.reducer;