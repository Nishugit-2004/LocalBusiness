import { createSlice } from '@reduxjs/toolkit';

const loadAdminState = () => {
  try {
      const serializedState = sessionStorage.getItem('adminData');
      return serializedState ? JSON.parse(serializedState) : null;
  } catch (e) {
      console.warn('Could not load Admin state', e);
      return null;
  }
};

const initialState = {
  admin: null,
  isAuthenticated: false,
  token: null,
  name:null,
  email:null,
  ...loadAdminState()
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    adminlogin: (state, action) => {
      state.admin = action.payload.admin;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.name = action.payload.admin.name;
      state.email = action.payload.admin.email;
      sessionStorage.setItem('adminData', JSON.stringify(action.payload));
     
    },
    adminlogout: (state) => {
      state.admin = null;
      state.isAuthenticated = false;
      state.token = null;
      state.name = null;
      state.email = null;
      sessionStorage.removeItem('adminData');
       
    },
    initializeAdmin: (state) => {
      const adminData = loadAdminState();
      if (adminData) {
        state.admin = adminData.admin;
        state.isAuthenticated = true;
        state.token = adminData.token;
        state.name = adminData.admin.name;
        state.email = adminData.admin.email;
      }
    },
  },
});

export const { adminlogin, adminlogout,initializeAdmin } = adminSlice.actions;

export default adminSlice.reducer;
