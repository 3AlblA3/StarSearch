import { createSlice } from '@reduxjs/toolkit';

// Définition des états d'authentifications

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true
  },
  reducers: {
    // Gestion de la réussite de connexion
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
    },
    // Gestion du logout
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  }
});

export const { loginSuccess, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
