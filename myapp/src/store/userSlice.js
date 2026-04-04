import { createSlice } from '@reduxjs/toolkit';

const loadUserState = () => {
  try {
      const serializedState = localStorage.getItem('userData');
      if (!serializedState) return null;
      const data = JSON.parse(serializedState);
      return {
          user: data.user,
          token: data.token,
          isAuthenticated: true,
          name: data.user?.name,
          email: data.user?.email,
          phone: data.user?.phone
      };
  } catch (e) {
      console.warn('Could not load user state', e);
      return null;
  }
};

const initialState = {
  user: null,
  isAuthenticated: false,
  token: null,
  name: null,
  email: null,
  phone: null,
  ...(loadUserState() || {})
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.name = action.payload.user.name;
      state.email = action.payload.user.email;
      state.phone=action.payload.user.phone;
      localStorage.setItem('userData', JSON.stringify(action.payload));
     
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      state.name = null;
      state.email = null;
      state.phone=null;
      localStorage.removeItem('userData');
       
    },
    initializeAuth: (state) => {
      const userData = loadUserState();
      if (userData) {
        state.user = userData.user;
        state.isAuthenticated = true;
        state.token = userData.token;
        state.name = userData.user.name;
        state.email = userData.user.email;
        state.phone=userData.user.phone;
      }
    },
  },
});

export const { login, logout,initializeAuth } = userSlice.actions;

export default userSlice.reducer;
