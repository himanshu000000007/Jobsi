import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getStoredUser = () => {
  try {
    const user = localStorage.getItem("user");
    if (!user || user === "undefined") return null;
    return JSON.parse(user);
  } catch {
    return null;
  }
};

const storedUser  = getStoredUser();
const storedToken = localStorage.getItem("token");

// ─── Initial State ────────────────────────────────────────────────────────────
const initialState = {
  user:            storedUser  || null,
  token:           storedToken || null,
  isError:         false,
  isSuccess:       false,
  isLoading:       false,
  message:         "",
  isAuthenticated: !!storedToken,
};

// ─── Thunks ───────────────────────────────────────────────────────────────────

// FIX #1: loadUser — called on every app start / page refresh.
// Uses the token already in Redux (hydrated from localStorage) to fetch
// fresh user data from the server so Redux store is never stale.
export const loadUser = createAsyncThunk(
  "auth/loadUser",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      if (!token) return thunkAPI.rejectWithValue("No token");

      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update localStorage with fresh data
      localStorage.setItem("user", JSON.stringify(response.data.user));
      return response.data.user;
    } catch (error) {
      // Token is invalid/expired — clear everything
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// REGISTER
export const register = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      return response.data; // { user, token }
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// LOGIN
export const login = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, userData);
      return response.data; // { user, token }
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// UPDATE PROFILE
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
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
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// FIX #2: logout — clears BOTH localStorage AND Redux store.
// Previously only localStorage was cleared, leaving Redux in a "zombie" state.
export const logout = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  // No return value needed — fulfilled handler clears the store
});

// ─── Slice ────────────────────────────────────────────────────────────────────
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError   = false;
      state.message   = "";
    },
    // FIX #2: Sync action so api.js interceptor can dispatch this directly
    // without needing to await a thunk. Used when a 401 arrives mid-session.
    forceLogout: (state) => {
      state.user            = null;
      state.token           = null;
      state.isAuthenticated = false;
      state.isLoading       = false;
      state.isError         = false;
      state.message         = "";
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder

      // ── loadUser ──────────────────────────────────────────────────────────
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

      // ── register ──────────────────────────────────────────────────────────
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading       = false;
        state.isSuccess       = true;
        state.user            = action.payload.user;
        state.token           = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem("user",  JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading       = false;
        state.isError         = true;
        state.user            = null;
        state.token           = null;
        state.isAuthenticated = false;
        state.message         = action.payload;
      })

      // ── login ─────────────────────────────────────────────────────────────
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading       = false;
        state.isSuccess       = true;
        state.user            = action.payload.user;
        state.token           = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem("user",  JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading       = false;
        state.isError         = true;
        state.user            = null;
        state.token           = null;
        state.isAuthenticated = false;
        state.message         = action.payload;
      })

      // ── updateProfile ─────────────────────────────────────────────────────
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user      = { ...state.user, ...action.payload };
        localStorage.setItem("user", JSON.stringify(state.user));
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError   = true;
        state.message   = action.payload;
      })

      // ── logout ────────────────────────────────────────────────────────────
      .addCase(logout.fulfilled, (state) => {
        state.user            = null;
        state.token           = null;
        state.isAuthenticated = false;
      });
  },
});

export const { reset, forceLogout } = authSlice.actions;
export default authSlice.reducer;