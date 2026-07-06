import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@restaurant/shared';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  authenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  authenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
      state.authenticated = !!action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.authenticated = false;
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const { setLoading, setUser, setError, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
