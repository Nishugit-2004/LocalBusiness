import { createSlice } from '@reduxjs/toolkit';

const loadAdminState = () => {
  try {
      const serializedState = localStorage.getItem('adminData');
      if (!serializedState) return null;
      const data = JSON.parse(serializedState);
      return {
          admin: data.admin,
          token: data.token,
          isAuthenticated: true,
          name: data.admin?.name,
          email: data.admin?.email
      };
  } catch (e) {
      console.warn('Could not load Admin state', e);
      return null;
  }
};

const initialState = {
  admin: null,
  isAuthenticated: false,
  token: null,
  name: null,
  email: null,
  ...(loadAdminState() || {})
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
      localStorage.setItem('adminData', JSON.stringify(action.payload));
     
    },
    adminlogout: (state) => {
      state.admin = null;
      state.isAuthenticated = false;
      state.token = null;
      state.name = null;
      state.email = null;
      localStorage.removeItem('adminData');
       
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
