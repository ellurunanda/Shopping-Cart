// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../services/api';

const getErrMsg = (err) => {
  // axios style
  const data = err?.response?.data;
  if (data?.message) return data.message;
  if (Array.isArray(data?.errors) && data.errors.length) {
    // express-validator shape
    return data.errors[0].msg || 'Validation error';
  }
  // fetch style
  if (err?.message) return err.message;
  return 'Something went wrong';
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await authAPI.login(credentials);  // expects { user }
      return res.data.user;
    } catch (err) {
      return rejectWithValue(getErrMsg(err));
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const res = await authAPI.register(userData);  // expects { user }
      return res.data.user;
    } catch (err) {
      return rejectWithValue(getErrMsg(err));
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, isAuthenticated: false, loading: false, error: null },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      // optional: localStorage.removeItem('user');
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (b) => {
    b
      .addCase(loginUser.pending,   (s) => { s.loading = true; s.error = null; })
      .addCase(loginUser.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; s.isAuthenticated = true; })
      .addCase(loginUser.rejected,  (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(registerUser.pending,   (s) => { s.loading = true; s.error = null; })
      .addCase(registerUser.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; s.isAuthenticated = true; })
      .addCase(registerUser.rejected,  (s, a) => { s.loading = false; s.error = a.payload; });
  },
});
// ======= ADDED: handy selectors =======
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

// Optional: derive a display name that works for both user models
export const getDisplayName = (user) =>
  user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : (user?.name || user?.username || '');

// ======= ADDED: lightweight persistence helpers (optional) =======
// Use these from your app/store file if you want login/registration to survive refresh.
export const loadAuthFromStorage = () => {
  try {
    const raw = localStorage.getItem('auth');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveAuthToStorage = (user, isAuthenticated = true) => {
  try {
    localStorage.setItem('auth', JSON.stringify({ user, isAuthenticated }));
  } catch {}
};

export const clearAuthFromStorage = () => {
  try {
    localStorage.removeItem('auth');
  } catch {}
};

// Optional: helper to attach persistence via store subscription
// Call this once in your store setup: attachAuthPersistence(store)
export const attachAuthPersistence = (store) => {
  let last = null;
  store.subscribe(() => {
    const { user, isAuthenticated } = store.getState().auth || {};
    if (user !== last) {
      if (user && isAuthenticated) saveAuthToStorage(user, isAuthenticated);
      else clearAuthFromStorage();
      last = user;
    }
  });
};

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
