import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getStoredUser = () => {
  try {
    const user = localStorage.getItem('user');
    if (!user || user === 'undefined') return null;
    return JSON.parse(user);
  } catch {
    return null;
  }
};

const storedUser  = getStoredUser();
const storedToken = localStorage.getItem('token');

// ─── Initial State ─────────────────────────────────────────────────────────────
const initialState = {
  user:            storedUser  || null,
  token:           storedToken || null,
  isError:         false,
  isSuccess:       false,
  isLoading:       false,
  message:         '',
  isAuthenticated: !!storedToken,
};

// ─── Thunks ───────────────────────────────────────────────────────────────────

// FIX: loadUser — called on every app start / page refresh
// Fetches fresh user data from server so Redux is never stale after hard refresh
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
      // Token invalid/expired — clear storage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// REGISTER
export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      return response.data; // { user, token }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// LOGIN
export const login = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, userData);
      return response.data; // { user, token }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// UPDATE PROFILE
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.put(
        `${API_URL}/auth/profile`,
        profileData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// LOGOUT — clears both localStorage AND Redux store
export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
});

// ─── Slice ────────────────────────────────────────────────────────────────────
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError   = false;
      state.message   = '';
    },
    // FIX: Sync action for api.js interceptor to dispatch on 401
    // Clears Redux store + localStorage atomically without needing a thunk
    forceLogout: (state) => {
      state.user            = null;
      state.token           = null;
      state.isAuthenticated = false;
      state.isLoading       = false;
      state.isError         = false;
      state.message         = '';
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder

      // ── loadUser ────────────────────────────────────────────────────────────
      .addCase(loadUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.isLoading       = false;
        state.user            = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loadUser.rejected, (state) => {
        // Token was invalid — treat as logged out
        state.isLoading       = false;
        state.user            = null;
        state.token           = null;
        state.isAuthenticated = false;
      })

      // ── register ────────────────────────────────────────────────────────────
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading       = false;
        state.isSuccess       = true;
        state.user            = action.payload.user;
        state.token           = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem('user',  JSON.stringify(action.payload.user));
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading       = false;
        state.isError         = true;
        state.user            = null;
        state.token           = null;
        state.isAuthenticated = false;
        state.message         = action.payload;
      })

      // ── login ───────────────────────────────────────────────────────────────
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading       = false;
        state.isSuccess       = true;
        state.user            = action.payload.user;
        state.token           = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem('user',  JSON.stringify(action.payload.user));
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading       = false;
        state.isError         = true;
        state.user            = null;
        state.token           = null;
        state.isAuthenticated = false;
        state.message         = action.payload;
      })

      // ── updateProfile ───────────────────────────────────────────────────────
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user      = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError   = true;
        state.message   = action.payload;
      })

      // ── logout ──────────────────────────────────────────────────────────────
      .addCase(logout.fulfilled, (state) => {
        state.user            = null;
        state.token           = null;
        state.isAuthenticated = false;
        state.isSuccess       = false;
        state.isError         = false;
        state.message         = '';
      });
  },
});

export const { reset, forceLogout } = authSlice.actions;
export default authSlice.reducer;