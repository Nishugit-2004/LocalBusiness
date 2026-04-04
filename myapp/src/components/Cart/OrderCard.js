import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Loader from '../Loader';
import { API_BASE_URL } from '../../api';

const OrderCard = ({ order, onRemove }) => {
  const [loading, setLoading] = useState(false);

  const adminData = JSON.parse(sessionStorage.getItem('adminData'));
  const isAdmin = !!adminData?.token;

  const handleRemoveOrder = async () => {
    setLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/order/delete?id=${order._id}`);
      onRemove(order._id);
      toast.success('Removed successfully!');
    } catch (error) {
      console.error('Error removing order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    setLoading(true);
    try {
      await axios.put(`${API_BASE_URL}/order/${order._id}/status`, { status: newStatus }, {
          headers: { Authorization: `Bearer ${adminData.token}` }
      });
      toast.success(`Order marked as ${newStatus}`);
      window.location.reload();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const steps = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered'];
  const currentStepIndex = steps.indexOf(order.status || 'Pending');

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

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4 mb-8">
          {order.items.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="border rounded-md p-2 shadow-sm flex flex-col items-center bg-gray-50"
            >
              <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover mb-2 rounded" />
              <p className="font-bold text-center text-[10px] uppercase text-gray-700 mt-2">{item.name}</p>
              <p className="text-sm text-teal-600 font-black">₹{item.price} <span className="text-gray-400 font-normal">x {item.quantity}</span></p>
            </div>
          ))}
        </div>

        {/* ORDER TRACKING TIMELINE STEPPER */}
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
           <h3 className="text-[10px] uppercase tracking-widest font-black text-gray-400 text-center mb-6">Live Tracking Status</h3>
           <div className="flex items-center justify-between max-w-full relative px-2">
              {steps.map((step, idx) => (
                <div key={step} className="flex flex-col items-center relative w-full z-10">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shadow-md transition-all duration-300 ${idx <= currentStepIndex ? 'bg-orange-500 text-white scale-110' : 'bg-white text-gray-300 border-2 border-gray-100'}`}>
                      {idx < currentStepIndex ? <i className="fa-solid fa-check"></i> : idx + 1}
                   </div>
                   <p className={`text-[9px] mt-3 tracking-widest font-bold uppercase transition-colors duration-300 ${idx <= currentStepIndex ? 'text-orange-600' : 'text-gray-300'} text-center absolute -bottom-6 w-24 left-1/2 transform -translate-x-1/2`}>{step}</p>
                   
                   {/* Line Connector */}
                   {idx < steps.length - 1 && (
                      <div className={`absolute top-4 left-1/2 w-full h-[3px] -z-10 transition-colors duration-500 rounded-full ${idx < currentStepIndex ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]' : 'bg-gray-200'}`}></div>
                   )}
                </div>
              ))}
           </div>
           
           {/* Admin Action Bar */}
           {isAdmin && (
             <div className="mt-12 flex justify-center border-t border-gray-200 pt-6">
                <div className="flex gap-2 bg-white p-1 rounded-xl shadow-inner border border-gray-100">
                   {steps.map((step) => (
                      <button 
                        key={`btn-${step}`}
                        onClick={() => handleUpdateStatus(step)}
                        disabled={order.status === step}
                        className={`text-[10px] uppercase font-black tracking-wider px-3 py-2 rounded-lg transition-all ${order.status === step ? 'bg-teal-600 text-white shadow-md' : 'text-gray-400 hover:bg-teal-50 hover:text-teal-600'}`}
                      >
                         {step}
                      </button>
                   ))}
                </div>
             </div>
           )}
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default OrderCard;
