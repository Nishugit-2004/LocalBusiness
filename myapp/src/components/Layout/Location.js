import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../api';
import './Home.css';

const Location = () => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setLocation({ latitude, longitude });

          try {
            const fetchedAddress = await getAddressFromLatLng(latitude, longitude);
            setAddress(fetchedAddress);

            // Send to backend
            await postLocationToServer(latitude, longitude, fetchedAddress);
          } catch (err) {
            setError('Error while fetching or posting address');
            console.error(err);
          }

          setLoading(false);
        },
        (err) => {
          setError(err.message);
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  }, []);

  // Reverse Geocoding
  const getAddressFromLatLng = async (lat, lng) => {
    try {
      const apiKey = 'YOUR_GOOGLE_API_KEY'; // Replace this with your key
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
      );
  
      if (!response.ok) {
        throw new Error('Unable to fetch address');
      }
  
      const data = await response.json();
  
      if (data.status !== 'OK' || !data.results.length) {
        return 'Address not found';
      }
  
      return data.results[0].formatted_address;
    } catch (error) {
      console.error('Google Geocoding Error:', error);
      return 'Unable to fetch address';
    }
  };
  
  // Send location to backend
  const postLocationToServer = async (lat, lng, address) => {
    const userId = localStorage.getItem('userId'); // optional
    const response = await fetch(`${API_BASE_URL}/api/location`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ latitude: lat, longitude: lng, address, userId }),
    });

    if (!response.ok) {
      throw new Error('Failed to post location to server');
    }
  };

  return (
    <div className="bg-teal-600 text-white p-3 text-center shadow-md animate-fade-in">
      {loading ? (
        <p className="text-sm italic opacity-80">Locating your neighborhood...</p>
      ) : error ? (
        <p className="text-red-100 text-xs font-bold">Please enable location for a better experience</p>
      ) : (
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2 mb-1">
            <i className="fa-solid fa-location-dot text-sm text-teal-200"></i>
            <h2 className="text-xs font-bold tracking-widest uppercase">Current Shop Zone</h2>
          </div>
          <p className="text-[10px] opacity-75 font-mono">
            {location.latitude.toFixed(4)}°N, {location.longitude.toFixed(4)}°E
          </p>
          <p className="text-xs font-medium max-w-xs truncate px-4">
            {address || "Locating..."}
          </p>
        </div>
      )}
    </div>
  );
};


export default Location;
