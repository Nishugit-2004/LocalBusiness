import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ShopItem from './ShopItem';
import './ShopList.css';
import Loader from '../Loader';

function ShopList() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:4000/shop');
        setShops(response.data);
      } catch (error) {
        console.error('Error fetching shops:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Get user location
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          console.error('Error getting user location:', error);
          setUserLocation(null);
        }
      );
    }
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredShopItems = searchTerm !== ''
    ? shops.filter((shop) =>
        shop.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : shops;

  if (loading) {
    return <Loader />;
  }

  return (
    <div style={{ backgroundColor: 'white' }}>
      <h1 style={{ textAlign: 'center', color: '#12a9a1', fontSize: '1.5rem' }}>
        Shops
      </h1>

      <div className="search-container">
        <label htmlFor="search-input" className="sr-only">
          Search Shops
        </label>
        <input
          id="search-input"
          type="text"
          placeholder="Search Shops..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <i className="fa-solid fa-magnifying-glass absolute right-2 top-5 text-brand"></i>
      </div>

      <div className="shop-list">
        {filteredShopItems.length === 0 ? (
          <p style={{ textAlign: 'center' }}>No shops found.</p>
        ) : (
          filteredShopItems.map((shop) => (
            <ShopItem
              key={shop._id}
              shop={shop}
              userLocation={userLocation}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default ShopList;
