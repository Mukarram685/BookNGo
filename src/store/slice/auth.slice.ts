import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    refreshToken: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { user, token, refreshToken } = action.payload;
      state.user = user;
      state.token = token;
      state.refreshToken = refreshToken;
    },
    updateUser: (state, action) => {
      if (action.payload) {
        state.user = typeof action.payload === 'object' 
          ? { ...(state.user || {}), ...action.payload }
          : action.payload;
      }
    },
    updateTokens: (state, action) => {
      const { token, refreshToken } = action.payload;
      state.token = token;
      state.refreshToken = refreshToken;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
    },
  },
});

export const { setCredentials, updateUser, logout, updateTokens } = authSlice.actions;
export default authSlice.reducer;
