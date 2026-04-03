import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Loader from '../Loader';

const OrderCard = ({ order, onRemove }) => {
  const [loading, setLoading] = useState(false);

  const handleRemoveOrder = async () => {
    setLoading(true);
    try {
      await axios.delete(`https://mernbackend-1-9ihi.onrender.com/order/delete?id=${order._id}`);
      onRemove(order._id);
      toast.success('Removed successfully!');
      window.location.reload();
    } catch (error) {
      console.error('Error removing order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <div className="bg-white shadow-md rounded-lg p-5 mb-6 w-full">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-lg font-semibold text-gray-800">Ordered by: {order.userName}</h1>
          <button
            onClick={handleRemoveOrder}
            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
          >
            Remove Order
          </button>
        </div>

        <h2 className="text-md text-teal-700 mb-1">Restaurant: {order.restaurantName}</h2>
        <p>Total Price: ₹{order.totalPrice}</p>
        <p>Discounted Price: ₹{order.discountedPrice}</p>
        <p className="text-sm text-gray-600">
          Order Date:{' '}
          {new Date(order.orderDate).toLocaleDateString()}{' '}
          {new Date(order.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          {order.items.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="border rounded-md p-2 shadow-sm flex flex-col items-center bg-gray-50"
            >
              <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover mb-2 rounded" />
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-700">Price: ₹{item.price}</p>
              <p className="text-sm text-gray-700">Qty: {item.quantity}</p>
            </div>
          ))}
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default OrderCard;
