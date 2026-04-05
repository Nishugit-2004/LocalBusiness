import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../api';
import ShopItem from './ShopItem';
import './ShopList.css';
import Loader from '../Loader';

function ShopList() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [userLocation, setUserLocation] = useState(null);

  const categories = [
    'Daily Needs', 'Hardware & Home Improvement', 'Fashion & Clothing', 
    'Food & Dining', 'Electronics & Gadgets', 'Automobile & Services', 
    'Health & Medical', 'Home Services', 'Education & Training', 
    'Professional Services'
  ];

  // Get User Location on Mount with Timeout for Mobile protection
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          console.error('Error getting user location:', error);
          setUserLocation({ latitude: null, longitude: null }); 
        },
        { timeout: 5000, enableHighAccuracy: false } // Trigger faster resolution for mobile
      );
    } else {
        setUserLocation({ latitude: null, longitude: null }); 
    }
  }, []);

  // Primary Fetch logic wrapped in Debounce effect
  useEffect(() => {
    // We only want to execute the effect if location tracking has finally resolved (either success or fail)
    if (!userLocation) return;

    const delayDebounceFn = setTimeout(() => {
      const fetchShops = async () => {
        setLoading(true);
        try {
          const params = {};
          if (searchTerm) params.search = searchTerm;
          if (selectedCategory) params.category = selectedCategory;
          if (userLocation?.latitude && userLocation?.longitude) {
              params.lat = userLocation.latitude;
              params.lng = userLocation.longitude;
          }

          const response = await axios.get(`${API_BASE_URL}/Shop`, { params });
          setShops(response.data);
        } catch (error) {
          console.error('Error fetching shops:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchShops();
    }, 500); // 500ms Debounce

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, userLocation, selectedCategory]);

  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh', paddingBottom: '50px' }}>
      <h1 className="text-center px-4 pt-12 pb-2">
        <span className="block text-[2rem] sm:text-[3rem] font-black tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-br from-teal-950 via-teal-800 to-teal-700">
          Discover the Best Shops
        </span>
        <span className="text-teal-600/60 font-medium text-lg tracking-widest uppercase mt-4 block">
          Near Your Neighborhood
        </span>
      </h1>

      <div className="flex justify-center w-full px-4 sm:px-6">
        <div className="relative w-full max-w-[700px] mt-8 mb-10 transition-all duration-300 group">
          <input
            type="text"
            placeholder="Search securely by shop name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '22px 60px 22px 30px', 
              borderRadius: '50px', 
              border: '1px solid rgba(0,0,0,0.05)', 
              boxShadow: '0 20px 40px -15px rgba(13, 148, 136, 0.1)', 
              fontSize: '1.15rem', 
              outline: 'none',
              backgroundColor: '#fff',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            className="focus:shadow-teal-600/10 focus:border-teal-500/20"
          />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-teal-50 rounded-full text-teal-600 transition-colors group-focus-within:bg-teal-600 group-focus-within:text-white">
            <i className="fa-solid fa-magnifying-glass text-lg"></i>
          </div>
        </div>
      </div>

      {/* CATEGORY FILTER STRIP */}
      <div className="flex overflow-x-auto gap-3 pb-8 px-6 no-scrollbar snap-x scroll-smooth max-w-7xl mx-auto">
          <button
              onClick={() => setSelectedCategory('')}
              className={`whitespace-nowrap px-6 py-3 rounded-2xl font-black text-[10px] tracking-widest uppercase transition-all snap-start ${
                  selectedCategory === '' 
                  ? 'bg-teal-600 text-white shadow-xl scale-105' 
                  : 'bg-white text-teal-600 border-2 border-teal-50 shadow-sm hover:border-teal-200'
              }`}
          >
              All Categories
          </button>
          {categories.map((cat) => (
              <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap px-6 py-3 rounded-2xl font-black text-[10px] tracking-widest uppercase transition-all snap-start ${
                      selectedCategory === cat 
                      ? 'bg-teal-600 text-white shadow-xl scale-105' 
                      : 'bg-white text-gray-500 border-2 border-gray-50 shadow-sm hover:border-teal-200 hover:text-teal-600'
                  }`}
              >
                  {cat}
              </button>
          ))}
      </div>

      {loading ? <Loader /> : (
          <div className="shop-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', justifyContent: 'center', padding: '0 40px' }}>
            {shops.length === 0 ? (
               <div style={{ textAlign: 'center', padding: '80px', color: '#9ca3af' }}>
                   <i className="fa-solid fa-store-slash" style={{ fontSize: '4rem', marginBottom: '20px' }}></i>
                   <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#374151' }}>No shops found in this category or area.</p>
                   <button 
                      onClick={() => { setUserLocation({ latitude: null, longitude: null }); setSearchTerm(''); setSelectedCategory('') }} 
                      className="mt-6 px-8 py-3 bg-teal-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:bg-teal-700 transition"
                   >
                       Clear All Filters
                   </button>
               </div>
            ) : (
              shops.map((shop) => (
                <ShopItem
                  key={shop._id}
                  shop={shop}
                />
              ))
            )}
          </div>
      )}
    </div>
  );
}

export default ShopList;
