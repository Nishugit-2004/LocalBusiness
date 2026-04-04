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

  // Get adminData from sessionStorage
  const adminData = JSON.parse(sessionStorage.getItem('adminData'));
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
        setError('Admin ID not found in sessionStorage.');
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
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 font-medium">
                     <span className="flex items-center gap-1">
                        <i className="fa-solid fa-location-dot text-orange-500"></i> 
                        {shop.location?.coordinates ? `Loc: ${shop.location.coordinates[1].toFixed(2)}, ${shop.location.coordinates[0].toFixed(2)}` : (typeof shop.location === 'string' ? shop.location : 'Global')}
                     </span>
                     <span className="flex items-center gap-1">
                        <i className="fa-solid fa-utensils text-teal-500"></i> {shop.cuisine || 'N/A'}
                     </span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                   <Link to={`/admin/manage-menu/${shop._id}`} className="block bg-teal-600 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-teal-700 shadow-xl transform transition active:scale-95 text-center">
                     MANAGE MENU
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
