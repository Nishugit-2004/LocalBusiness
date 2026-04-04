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
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/menus/${shopId}`);
        setMenuItems(response.data);
      } catch (error) {
        console.error('Error fetching menu:', error);
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
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-400 tracking-tight">
            Shop Products
          </h1>
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-5 pr-12 py-3 rounded-2xl shadow-sm border border-gray-100 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-gray-700"
            />
            <i className="fa-solid fa-magnifying-glass absolute right-4 top-4 text-teal-400"></i>
          </div>
        </div>

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

