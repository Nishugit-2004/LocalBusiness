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
  const [userLocation, setUserLocation] = useState(null);

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
  }, [searchTerm, userLocation]);

  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh', paddingBottom: '50px' }}>
      <h1 style={{ textAlign: 'center', color: '#134e4a', fontSize: '2.5rem', paddingTop: '40px', fontWeight: '900', letterSpacing: '-0.05em' }}>
        Discover the Best Shops Near You
      </h1>

      <div className="search-container" style={{ maxWidth: '700px', margin: '30px auto', position: 'relative' }}>
        <input
          type="text"
          placeholder="Search securely by exact shop name or detailed keywords..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '20px 50px 20px 30px', borderRadius: '40px', border: '2px solid #f3f4f6', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', fontSize: '1.1rem', outline: 'none' }}
        />
        <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', right: '30px', top: '23px', color: '#0d9488', fontSize: '1.2rem' }}></i>
      </div>

      {loading ? <Loader /> : (
          <div className="shop-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', justifyContent: 'center', padding: '0 40px' }}>
            {shops.length === 0 ? (
               <div style={{ textAlign: 'center', padding: '80px', color: '#9ca3af' }}>
                   <i className="fa-solid fa-store-slash" style={{ fontSize: '4rem', marginBottom: '20px' }}></i>
                   <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#374151' }}>No shops found in your specific area.</p>
                   <button 
                      onClick={() => { setUserLocation({ latitude: null, longitude: null }); setSearchTerm('') }} 
                      className="mt-6 px-8 py-3 bg-teal-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:bg-teal-700 transition"
                   >
                       Show All Global Shops
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
