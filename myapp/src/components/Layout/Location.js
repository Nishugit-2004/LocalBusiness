import React, { useState, useEffect } from 'react';
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
    const response = await fetch('http://localhost:4000/api/location', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ latitude: lat, longitude: lng, address, userId }),
    });

    if (!response.ok) {
      throw new Error('Failed to post location to server');
    }
  };

  return (
    <div>
      <h3>Your Location</h3>
      {loading ? (
        <p>Fetching location...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>Error: {error}</p>
      ) : (
        <div className="review-cards" style={{ backgroundColor: '#12a9a1', color: 'white', padding: '30px' }}>
          <h1>Your Current Location</h1><br />
          <p><strong>Latitude:</strong> {location.latitude}</p><br />
          <p><strong>Longitude:</strong> {location.longitude}</p><br />
          <p><strong>Address:</strong> {address}</p>
        </div>
      )}
    </div>
  );
};

export default Location;
