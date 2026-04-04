import React from 'react';
import './App.css';
import Home from './components/Layout/Home';
import Navbar from './components/Layout/Navbar';
import { Route, Routes } from 'react-router-dom';

import Signup from './components/User/Signup';
import Login from './components/User/Login';
import {Provider} from 'react-redux'
import store from './store/store';
import { Cart } from './components/Cart/Cart';
import OrderList from './components/Cart/OrderList';
import Profile from './components/User/Profile';
import Welcome from './components/User/Welcome';
import AdminSignup from './components/Admin/AdminSignup';
import AdminLogin from './components/Admin/AdminLogin';
import AdminWelcome from './components/Admin/AdminWelcome';
import AdminProfile from './components/Admin/AdminProfile';
import AdminAlluser from './components/Admin/AdminAlluser';
import AdminAlladmin from './components/Admin/AdminAlladmin';
import AdminAllorder from './components/Admin/AdminAllorder';
import ContactUs from './components/Layout/ContactUs';
import About from './components/Layout/About';
import ForgotPassword from './components/User/ForgetPassword';
import ResetPassword from './components/User/ResetPassword';
import AllFeedback from './components/Admin/AllFeedback';
import Location from './components/Layout/Location';
import AddShop from './components/Shop/AddShop';
import EditShop from './components/Shop/EditShop';
import AdminShops from './components/Admin/AdminShops';
import ShopMenu from './components/Menus/ShopMenu';
import ManageMenu from './components/Admin/ManageMenu';
import AdminAnalytics from './components/Admin/AdminAnalytics';
import AuthSelection from './components/Layout/AuthSelection';

import { Toaster } from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { setItems } from './store/cartSlice';
import axios from 'axios';
import { API_BASE_URL } from './api';

const CartSyncManager = () => {
    const dispatch = useDispatch();
    const cart = useSelector(state => state.cart);
    const isAuthenticated = useSelector(state => state.user.isAuthenticated);
    const token = JSON.parse(localStorage.getItem('userData'))?.token;

    // Pull from Database when Auth confirms
    React.useEffect(() => {
        if (isAuthenticated && token) {
            axios.get(`${API_BASE_URL}/cart`, { headers: { Authorization: `Bearer ${token}` }})
            .then(res => {
                if (res.data?.items) {
                    const dbCart = res.data.items.map(i => ({...i.menuItemId, quantity: i.quantity}));
                    if(dbCart.length > 0) dispatch(setItems(dbCart));
                }
            }).catch(e => console.error(e));
        }
    }, [isAuthenticated, token, dispatch]);

    // Push quietly to database on frontend Cartesian edits
    React.useEffect(() => {
        if (isAuthenticated && token) {
            const mappedItems = cart.map(i => ({ menuItemId: i._id, quantity: i.quantity || 1 }));
            axios.post(`${API_BASE_URL}/cart/sync`, { items: mappedItems }, { headers: { Authorization: `Bearer ${token}` }})
               .catch(e => console.error(e));
        }
    }, [cart, isAuthenticated, token]);

    return null;
}

function App() {
  
  return (
     <div className="App">
      <Provider store={store}>
      <CartSyncManager />
      <Toaster position="top-center" />
      <Navbar/>
      <Location/>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop/:shopId" element={<ShopMenu/>}/>
          
          <Route path="/signup" element={<AuthSelection/>}/>
          <Route path="/login" element={<AuthSelection/>}/>
          <Route path="/user/signup" element={<Signup/>}/>
          <Route path="/user/login" element={<Login/>}/>
          <Route path="/admin/signup" element={<AdminSignup/>}/>
          <Route path="/admin/login" element={<AdminLogin/>}/>
          <Route path='/contact' element={<ContactUs/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path="/admin/add-shop" element={<AddShop />} 
          />
          <Route path="/cart" element={<Cart />} 
          />
          <Route path='/order/orderdetails' element={<OrderList/>}/>
          <Route path='/user/profile' element={<Profile/>}/>
          <Route path='/user/welcome' element={<Welcome/>}/>

          <Route path='/admin/welcome' element={<AdminWelcome/>}/>
          <Route path='/admin/profile' element={<AdminProfile/>}/>
          <Route path='/admin/alluser' element={<AdminAlluser/>}/>
          <Route path='/admin/alladmin' element={<AdminAlladmin/>}/>
          <Route path='/admin/allorder' element={<AdminAllorder/>}/>
          <Route path='/admin/shops' element={<AdminShops/>}/>
          <Route path='/admin/contact' element={<AllFeedback/>}/>
          <Route path='/admin/manage-menu/:shopId' element={<ManageMenu/>}/>
          <Route path='/admin/edit-shop/:id' element={<EditShop/>}/>
          <Route path='/admin/analytics' element={<AdminAnalytics/>}/>
          <Route path='/user/forgotpassword' element={<ForgotPassword/>}/>
          <Route path='/user/resetpassword/:token' element={<ResetPassword/>}/>
      </Routes>
      </Provider>
  </div>
  );
}

export default App;
