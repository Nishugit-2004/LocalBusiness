import React, { useEffect, useState } from 'react';
import './ShopList.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../api';

const ShopItem = ({ shop }) => {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/admin/${shop.adminId}`);
        setAdmin(res.data);
      } catch (err) {
        console.error('Failed to fetch admin details:', err);
      }
    };

    if (shop.adminId) {
      fetchAdmin();
    }
  }, [shop.adminId]);

  return (
    <div className="shop-item bg-white p-6 rounded-3xl shadow-lg border border-gray-100 transform transition hover:scale-[1.02] hover:shadow-2xl flex flex-col justify-between w-full max-w-sm">
      <div className="relative overflow-hidden rounded-2xl h-48 mb-4">
        <Link to={`/shop/${shop._id}`}>
          {shop.imageUrl ? (
            <img src={shop.imageUrl} alt={shop.name} className="w-full h-full object-cover transition duration-700 hover:scale-110" />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
               <i className="fa-solid fa-store text-5xl text-gray-300"></i>
            </div>
          )}
        </Link>
        {shop.distance !== undefined && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur font-black text-xs text-teal-600 px-3 py-1 rounded-full shadow-md">
            📍 { (shop.distance / 1000).toFixed(1) } km away
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1">
          <Link to={`/shop/${shop._id}`} className="no-underline">
              <h3 className="text-2xl font-black text-gray-800 tracking-tight capitalize mb-1 hover:text-teal-600 transition">
                {shop.name}
              </h3>
          </Link>
          <p className="text-gray-500 text-sm font-medium line-clamp-2 leading-relaxed mb-4 flex-1">
            {shop.description || 'Welcome to our local establishment! Tap to discover our catalog.'}
          </p>

          <hr className="border-gray-50 mb-4" />

          <div className="flex justify-between items-center text-xs font-bold text-gray-400">
             <div className="flex items-center gap-2">
                 <i className="fa-solid fa-user-tie text-gray-300"></i>
                 <span>{admin ? admin.name : 'System Generated'}</span>
             </div>
             <div className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-lg">
                 <i className="fa-solid fa-eye text-teal-400"></i>
                 <span className="text-gray-500">{shop.views || 0}</span>
             </div>
          </div>
      </div>
    </div>
  );
};

export default ShopItem;
