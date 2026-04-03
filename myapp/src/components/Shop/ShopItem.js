import React, { useEffect, useState } from 'react';
import './ShopList.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Haversine Formula for distance in km
const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of earth in KM
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(2); // Return distance in km
};

const ShopItem = ({ shop, userLocation }) => {
  const [admin, setAdmin] = useState(null);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/admin/${shop.adminId}`);
        setAdmin(res.data);
      } catch (err) {
        console.error('Failed to fetch admin details:', err);
      }
    };

    if (shop.adminId) {
      fetchAdmin();
    }
  }, [shop.adminId]);

  useEffect(() => {
    if (
      userLocation &&
      shop.latitude &&
      shop.longitude
    ) {
      const dist = getDistanceFromLatLonInKm(
        userLocation.latitude,
        userLocation.longitude,
        shop.latitude,
        shop.longitude
      );
      setDistance(dist);
    }
  }, [userLocation, shop.latitude, shop.longitude]);

  return (
    <div className="shop-item">
      <Link to={`/shop/${shop._id}`}>
        <img src={shop.imageUrl} alt={shop.name} style={{ width: '250px' }} />
      </Link>

      <h3 style={{ textTransform: 'capitalize', color: '#12a9a1', fontFamily: 'unset' }}>
        {shop.name}
      </h3>
      <p style={{ color: 'rgba(128, 128, 128, 0.886)', fontSize: '12px', fontFamily: 'Roboto Slab' }}>
        {shop.description}
      </p>
      <p style={{ color: 'rgba(128, 128, 128, 0.886)', fontSize: '12px', fontFamily: 'Roboto Slab' }}>
        Views: {shop.views}
      </p>
      <p style={{ color: 'orange', fontSize: '12px', fontFamily: 'Roboto Slab' }}>
        Seller Details: {admin ? `${admin.name} ${admin.email}` : 'Loading...'}
      </p>
      <p>
        <strong>Location:</strong> {shop.location}
      </p>
      {distance && (
        <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#12a9a1' }}>
          📍 Distance: {distance} km away
        </p>
      )}
    </div>
  );
};

export default ShopItem;
