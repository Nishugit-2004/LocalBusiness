import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../api';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { initializeAdmin } from '../../store/adminSlice';
import AdminSidebar from './AdminSidebar';
import Loader from '../Loader';

const AdminShops = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get admin info from Redux store (hydrated from localStorage)
  const { isAuthenticated, admin, token } = useSelector((state) => state.admin);
  const adminId = admin?.id || JSON.parse(localStorage.getItem('adminData'))?.admin?.id;
  const adminName = admin?.name || JSON.parse(localStorage.getItem('adminData'))?.admin?.name;
  const adminToken = token || JSON.parse(localStorage.getItem('adminData'))?.token;

  useEffect(() => {
    dispatch(initializeAdmin());
  }, [dispatch]);

  useEffect(() => {
    // If not authenticated after initialization, send to login
    if (!isAuthenticated && !localStorage.getItem('adminData')) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchShops = async () => {
      // Only proceed if we have a valid ID and are authenticated
      if (!adminId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${API_BASE_URL}/Shop/restaurants`, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        
        // Ensure we always have an array
        setShops(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error('Fetch Shops Error:', err);
        if (err.response?.status === 401 || err.response?.status === 403) {
            setError('Session expired. Please login again.');
            localStorage.clear();
            setTimeout(() => navigate('/admin/login'), 2000);
        } else {
            setError('Unable to reach marketplace. Check your connection.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [adminId, adminToken, navigate]);

  if (loading) return <Loader />;
  
  // If error, show it prominently within the dashboard layout
  if (error) return (
      <div className="flex min-h-screen bg-gray-50 mt-16">
          <AdminSidebar />
          <div className="flex-1 flex items-center justify-center">
              <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-sm border-2 border-red-50">
                  <i className="fa-solid fa-triangle-exclamation text-red-500 text-5xl mb-4"></i>
                  <h3 className="text-xl font-black text-gray-800 mb-2">Connection Issue</h3>
                  <p className="text-gray-500 font-medium">{error}</p>
              </div>
          </div>
      </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 mt-16">
      <AdminSidebar />
      <div className="flex-1 ml-0 md:ml-64 p-4 md:p-10">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400 uppercase tracking-tight">
              {adminName ? `${adminName}'s Shops` : 'My Marketplace'}
            </h2>
            <Link to="/admin/add-shop" className="bg-teal-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-teal-700 transform transition active:scale-95">
                <i className="fa-solid fa-plus mr-2"></i> Add New Store
            </Link>
        </div>

        {shops.length === 0 ? (
          <div className="bg-white shadow-2xl rounded-[40px] p-20 flex flex-col items-center justify-center text-center max-w-2xl mx-auto border border-gray-100">
             <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <i className="fa-solid fa-store-slash text-4xl text-gray-300"></i>
             </div>
             <h3 className="text-2xl font-black text-gray-800 mb-3">No Active Listings</h3>
             <p className="text-gray-400 font-medium mb-8 max-w-sm">
                You haven't added any businesses to the VirtualShop platform yet. Start your journey today!
             </p>
             <Link to="/admin/add-shop" className="bg-orange-600 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-orange-700 transition">
                Register Your First Shop
             </Link>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto grid gap-8">
            {shops.map((shop) => (
              <div
                key={shop._id}
                className="bg-white p-8 rounded-[32px] shadow-xl border border-gray-100 flex flex-col lg:flex-row items-center justify-between text-left group hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row items-center gap-8 w-full">
                    <div className="w-32 h-32 rounded-3xl overflow-hidden bg-gray-100 shadow-inner flex-shrink-0">
                        {shop.imageUrl ? (
                            <img src={shop.imageUrl} alt={shop.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <i className="fa-solid fa-image text-3xl"></i>
                            </div>
                        )}
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-2xl font-black text-gray-800 mb-3 group-hover:text-orange-600 transition">{shop.name}</h3>
                        <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                            <span className="flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                <i className="fa-solid fa-tag"></i> {shop.category || 'Daily Needs'}
                            </span>
                            <span className="flex items-center gap-2 bg-orange-50 text-orange-700 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                <i className="fa-solid fa-phone"></i> {shop.phone || 'No Contact'}
                            </span>
                             <span className="flex items-center gap-2 bg-gray-50 text-gray-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                <i className="fa-solid fa-location-arrow"></i> Live Active
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 lg:mt-0 flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                    <Link to={`/admin/manage-menu/${shop._id}`} className="flex-1 bg-teal-600 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-teal-700 shadow-lg text-center transform transition active:scale-95">
                        Manage Products
                    </Link>
                    <Link to={`/admin/edit-shop/${shop._id}`} className="flex-1 bg-white text-gray-500 border-2 border-gray-100 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 text-center transition active:scale-95">
                        Settings
                    </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminShops;
