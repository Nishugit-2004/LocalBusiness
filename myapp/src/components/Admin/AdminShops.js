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
  const isAuthenticated = useSelector((state) => state.admin.isAuthenticated);

  // Get adminData from localStorage
  const adminData = JSON.parse(localStorage.getItem('adminData'));
  const adminId = adminData?.admin?.id;
  const adminName = adminData?.admin?.name;

  useEffect(() => {
    dispatch(initializeAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchShops = async () => {
      if (!adminId) {
        setError('Admin ID not found in localStorage.');
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`${API_BASE_URL}/Shop/restaurants`, {
          headers: { Authorization: `Bearer ${adminData?.token}` }
        });
        setShops(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch shops.');
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [adminId]);

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500 font-bold text-center mt-32">Error: {error}</p>;

  return (
    <div className="flex min-h-screen bg-gray-50 mt-16 text-center">
      <AdminSidebar />
      <div className="flex-1 ml-0 md:ml-64 p-4 md:p-10">
        <h2 className="text-3xl font-black text-orange-600 mb-8 mt-5 tracking-tight uppercase">
          {adminName ? `${adminName}'s Shops` : 'My Shops'}
        </h2>

        {shops.length === 0 ? (
          <div className="bg-white shadow-xl rounded-3xl p-10 max-w-md mx-auto">
             <i className="fa-solid fa-store-slash text-5xl text-gray-200 mb-4"></i>
             <p className="text-gray-400 font-medium">No shops found for this admin.</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto grid gap-6">
            {shops.map((shop) => (
              <div
                key={shop._id}
                className="bg-white p-8 rounded-3xl shadow-xl border border-gray-50 flex flex-col md:flex-row items-center justify-between text-left transform transition hover:scale-[1.01]"
              >
                <div>
                  <h3 className="text-2xl font-black text-gray-800 mb-2">{shop.name}</h3>
                   <div className="flex flex-wrap gap-4 text-[10px] text-gray-400 font-black uppercase tracking-widest">
                     <span className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full">
                        <i className="fa-solid fa-tag text-teal-500"></i> 
                        {shop.category || 'No Category'}
                     </span>
                     <span className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full">
                        <i className="fa-solid fa-phone text-teal-500"></i> 
                        {shop.phone || 'N/A'}
                     </span>
                     <span className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full">
                        <i className="fa-solid fa-map-location-dot text-teal-500"></i> 
                        {shop.address || 'N/A'}
                     </span>
                  </div>
                </div>
                 <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
                    <Link to={`/admin/manage-menu/${shop._id}`} className="block bg-teal-600 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-teal-700 shadow-xl transform transition active:scale-95 text-center">
                      MANAGE MENU
                    </Link>
                    <Link to={`/admin/edit-shop/${shop._id}`} className="block bg-white text-gray-500 border-2 border-gray-100 px-8 py-4 rounded-2xl font-black text-sm hover:bg-gray-50 shadow-sm transition active:scale-95 text-center">
                      EDIT METADATA
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
