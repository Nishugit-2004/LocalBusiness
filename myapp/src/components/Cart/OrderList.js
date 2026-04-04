import React, { useEffect, useState } from 'react';
import axios from 'axios';
import OrderCard from './OrderCard';
import { Link, useNavigate } from 'react-router-dom';
import { initializeAuth, logout } from '../../store/userSlice';
import { useDispatch } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import Loader from '../Loader';

import { API_BASE_URL } from '../../api';
import UserSidebar from '../User/UserSidebar';

function OrderList() {
  const [order, setorder] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchDate, setSearchDate] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchOrders = async () => {
      const userdata = JSON.parse(localStorage.getItem('userData'));
      const userId = userdata?.user?.id;

      if (!userId) {
        toast.error('No authorized user found');
        navigate('/user/login');
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/order/orderdetails?userId=${userId}`);
        setorder(response.data);
      } catch (error) {
        console.error('There was an error fetching the data!', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  const handleRemoveOrder = async (orderId) => {
    try {
      await axios.delete(`${API_BASE_URL}/order/delete?id=${orderId}`);
      setorder(order.filter((order) => order._id !== orderId));
      window.location.reload();
    } catch (error) {
      console.error('Error removing order:', error);
    }
  };

  const handleSearchDateChange = (e) => {
    setSearchDate(e.target.value);
  };

  const filteredOrders = searchDate
    ? order.filter(
        (order) =>
          new Date(order.orderDate).toLocaleDateString() === new Date(searchDate).toLocaleDateString()
      )
    : order;

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 mt-16">
      <UserSidebar />
      
      {/* Main Content */}
      <div className="flex-1 ml-0 md:ml-64 p-4 md:p-10 text-center">
        <h1 className="text-3xl font-black text-orange-500 mb-8 mt-5 tracking-tight uppercase">My Orders</h1>

        <div className="max-w-5xl mx-auto space-y-8">
          <div className="bg-white shadow-xl rounded-3xl p-6 border border-gray-100">
             <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 text-left">
               <div>
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px] block mb-1">Filter by date</span>
                  <input
                    type="date"
                    value={searchDate}
                    onChange={handleSearchDateChange}
                    className="px-6 py-3 rounded-2xl border-2 border-orange-100 focus:border-orange-500 outline-none transition font-bold text-gray-700 bg-gray-50"
                  />
               </div>
               <div className="text-right">
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px] block mb-1">Total Orders</span>
                  <span className="text-2xl font-black text-teal-600">{order.length}</span>
               </div>
             </div>

             <div className="overflow-x-auto rounded-2xl shadow-inner bg-gray-50 border border-gray-100">
                <table className="min-w-full text-left">
                  <thead className="bg-orange-500 text-white font-bold uppercase text-[10px] tracking-[0.2em]">
                    <tr>
                      <th className="px-6 py-4 text-center">ID</th>
                      <th className="px-6 py-4">Ordered by</th>
                      <th className="px-6 py-4">Seller ID</th>
                      <th className="px-6 py-4">Total</th>
                      <th className="px-6 py-4">Net</th>
                      <th className="px-6 py-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-white transition cursor-default">
                        <td className="px-6 py-4 font-mono text-[10px] text-gray-400 text-center">#{order._id.slice(-6)}</td>
                        <td className="px-6 py-4 font-bold text-gray-700">{order.userName}</td>
                        <td className="px-6 py-4 font-mono text-[10px] text-gray-400">{order.adminId}</td>
                        <td className="px-6 py-4 font-black text-teal-600">₹{order.totalPrice}</td>
                        <td className="px-6 py-4 font-black text-orange-500">₹{order.discountedPrice}</td>
                        <td className="px-6 py-4 text-xs text-gray-400">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
            {order.map((order) => (
              <OrderCard key={order._id} order={order} onRemove={handleRemoveOrder} />
            ))}
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default OrderList;
