// ShopMenu.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../api';
import MenuCard from './MenuCard'; 
import './MenuCard.css'; 
import Loader from '../Loader';

const ShopMenu = () => {
  const { shopId } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [menuRes, shopRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/menus/${shopId}`),
          axios.get(`${API_BASE_URL}/shop/${shopId}`)
        ]);
        setMenuItems(menuRes.data);
        setShop(shopRes.data);
      } catch (error) {
        console.error('Error fetching shop data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [shopId]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredMenuItems = menuItems.filter(menu =>
    menu.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 md:px-10 mt-16">
      <div className="max-w-7xl mx-auto">
        {shop && (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 mb-12 transform transition hover:scale-[1.01]">
            <div className="h-48 bg-gradient-to-r from-teal-600 to-teal-400 relative">
               <img src={shop.imageUrl} alt={shop.name} className="w-full h-full object-cover opacity-30 mix-blend-overlay" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <h1 className="text-5xl font-black text-white uppercase tracking-tighter drop-shadow-lg">{shop.name}</h1>
               </div>
            </div>
            
            <div className="p-8 grid md:grid-cols-3 gap-8 items-center">
               <div className="md:col-span-2 space-y-4">
                  <p className="text-gray-500 font-medium leading-relaxed italic border-l-4 border-teal-500 pl-4">
                    {shop.description || 'Welcome to our local shop! We are happy to serve you the best products from our catalog.'}
                  </p>
                  <div className="flex flex-wrap gap-4 pt-2">
                     <div className="flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 rounded-full text-xs font-black shadow-sm">
                        <i className="fa-solid fa-phone"></i>
                        {shop.phone || 'Contact not provided'}
                     </div>
                     <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-full text-xs font-black shadow-sm">
                        <i className="fa-solid fa-location-dot"></i>
                        {shop.address || 'Address not provided'}
                     </div>
                  </div>
               </div>
               
               <div className="bg-gray-50 p-6 rounded-2xl flex flex-col items-center">
                  <div className="relative w-full max-w-sm mb-2">
                    <input
                      type="text"
                      placeholder="Search items..."
                      value={searchTerm}
                      onChange={handleSearch}
                      className="w-full px-5 py-3 rounded-xl border-2 border-gray-100 bg-white focus:outline-none focus:border-teal-500 font-bold text-gray-700 text-sm transition"
                    />
                    <i className="fa-solid fa-search absolute right-4 top-4 text-gray-300"></i>
                  </div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Discover our current menu</span>
               </div>
            </div>
          </div>
        )}

        {filteredMenuItems.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm p-16 text-center border border-gray-100 flex flex-col items-center justify-center">
            <i className="fa-solid fa-box-open text-6xl text-gray-200 mb-4"></i>
            <p className="text-xl font-bold text-gray-400">No products available in this shop yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredMenuItems.map(menu => (
              <MenuCard key={menu._id} menu={menu} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopMenu;

