import React, { useEffect, useState } from 'react';
import axios from 'axios';
import OrderCard from './OrderCard';
import { Link, useNavigate } from 'react-router-dom';
import { initializeAuth, logout } from '../../store/userSlice';
import { useDispatch } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import Loader from '../Loader';

function OrderList() {
  const [order, setorder] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchDate, setSearchDate] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchOrders = async () => {
      const userdata = JSON.parse(sessionStorage.getItem('userData'));
      const token = userdata?.token;
      const userId = userdata?.user?.id;

      if (!token) {
        toast.error('No authorized user found');
        navigate('/user/login');
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(`https://mernbackend-1-9ihi.onrender.com/order/orderdetails?userId=${userId}`);
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

  const handleLogout = () => {
    sessionStorage.clear();
    dispatch(logout());
    toast.success('Logged Out Successfully!');
    navigate('/');
    window.location.reload();
  };

  const handleRemoveOrder = async (orderId) => {
    try {
      await axios.delete(`https://mernbackend-1-9ihi.onrender.com/order/delete?id=${orderId}`);
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
    <>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-teal-600 text-white fixed top-0 left-0 bottom-0 p-6">
          <h2 className="text-2xl font-bold mb-6">Profile Menu</h2>
          <ul>
            <li>
              <Link to="/user/welcome" className="block py-2 px-4 hover:bg-teal-500 rounded-md">
                Home
              </Link>
            </li>
            <li>
              <Link to="/user/profile" className="block py-2 px-4 hover:bg-teal-500 rounded-md">
                User Profile
              </Link>
            </li>
            <li>
              <Link to="/order/orderdetails" className="block py-2 px-4 hover:bg-teal-500 rounded-md">
                All Orders
              </Link>
            </li>
            <li>
              <Link to="/" className="block py-2 px-4 hover:bg-teal-500 rounded-md">
                Go Back
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="block w-full py-2 px-4 mt-6 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="ml-64 p-6 w-full">
          <h1 className="text-orange-500 font-bold text-2xl mb-4">Order Details</h1>

          <div className="mb-6">
            <input
              type="date"
              value={searchDate}
              onChange={handleSearchDateChange}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Search by Date"
            />
          </div>

          <div className="overflow-x-auto mb-10">
            <table className="min-w-full bg-white border border-gray-300 rounded-md shadow">
              <thead className="bg-teal-500 text-white">
                <tr>
                  <th className="px-4 py-2">Order ID</th>
                  <th className="px-4 py-2">Ordered by</th>
                  <th className="px-4 py-2">Seller</th>
                  <th className="px-4 py-2">Total Price</th>
                  <th className="px-4 py-2">Discounted Price</th>
                  <th className="px-4 py-2">Order Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="text-center border-t">
                    <td className="px-4 py-2">{order._id}</td>
                    <td className="px-4 py-2">{order.userName}</td>
                    <td className="px-4 py-2">{order.adminId}</td>
                    <td className="px-4 py-2">{order.totalPrice}</td>
                    <td className="px-4 py-2">{order.discountedPrice}</td>
                    <td className="px-4 py-2">
                      {new Date(order.orderDate).toLocaleDateString()} <br />
                      {new Date(order.orderDate).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {order.map((order) => (
              <OrderCard key={order._id} order={order} onRemove={handleRemoveOrder} />
            ))}
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
}

export default OrderList;
