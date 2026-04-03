import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminShops = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get adminData from sessionStorage
  const adminData = JSON.parse(sessionStorage.getItem('adminData'));
  const adminId = adminData?.admin?.id;
  const adminName = adminData?.admin?.name;

  useEffect(() => {
    const fetchShops = async () => {
      if (!adminId) {
        setError('Admin ID not found in sessionStorage.');
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get('http://localhost:4000/shop/shops', {
          params: { adminId }, 
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

  if (loading) return <p>Loading shops...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: '0 auto' }}>
      <h2 className="text-orange-600 font-bold text-2xl mb-4">
        {adminName ? `${adminName}'s Shops` : 'My Shops'}
      </h2>

      {shops.length === 0 ? (
        <p>No shops found for this admin.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {shops.map((shop) => (
            <li
              key={shop._id}
              style={{
                background: '#f9f9f9',
                padding: '15px',
                marginBottom: '10px',
                borderRadius: '10px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              }}
            >
              <h3 style={{ margin: '0 0 5px 0' }}>{shop.name}</h3>
              <p style={{ margin: 0 }}><strong>Location:</strong> {shop.location}</p>
              <p style={{ margin: 0 }}><strong>Type:</strong> {shop.cuisine}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminShops;
