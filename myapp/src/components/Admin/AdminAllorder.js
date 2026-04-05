import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../api";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { initializeAdmin } from "../../store/adminSlice";
import Loader from "../Loader";
import AdminSidebar from "./AdminSidebar";
import OrderCard from "../Cart/OrderCard";
import "./Admin.css";
import "../Cart/Order.css";

function OrderList() {
  const [order, setorder] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchDate, setSearchDate] = useState("");
  const isAuthenticated = useSelector((state) => state.admin.isAuthenticated);

  useEffect(() => {
    dispatch(initializeAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchorders();
    }
  }, [isAuthenticated]);

  const fetchorders = async () => {
    setLoading(true);
    try {
      const adminData = JSON.parse(sessionStorage.getItem("adminData"));
      const token = adminData?.token;
      
      const response = await axios.get(`${API_BASE_URL}/admin/allorder`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setorder(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchDateChange = (e) => {
    setSearchDate(e.target.value);
  };

  const handleRemoveOrder = async (id) => {
    if (window.confirm("Remove this order record?")) {
      try {
        // Implement delete API call here if available, currently just filtering out
        setorder(order.filter(o => o._id !== id));
      } catch (error) {
        console.error("Error removing order:", error);
      }
    }
  };

  const filteredOrders = searchDate
    ? order.filter((o) => new Date(o.orderDate).toISOString().split('T')[0] === searchDate)
    : order;

  if (!isAuthenticated || loading) {
    return <Loader />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 mt-16">
      <AdminSidebar />
      <div className="flex-1 ml-0 md:ml-64 p-4 md:p-10 text-center">
        <h1 className="text-3xl font-black text-orange-500 mb-8 mt-5 tracking-tight uppercase">
          Order Details
        </h1>
        
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white shadow-xl rounded-3xl p-6 border border-gray-100">
             <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
               <div className="text-center md:text-left">
                  <span className="text-gray-400 font-black uppercase tracking-widest text-[10px] block mb-1">Administrative Log</span>
                  <h2 className="text-xl font-bold text-gray-800">Master Order Ledger</h2>
               </div>
               <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                 <span className="text-gray-400 font-bold uppercase tracking-widest text-[9px] whitespace-nowrap">Filter by date:</span>
                 <input
                   type="date"
                   value={searchDate}
                   onChange={handleSearchDateChange}
                   className="w-full sm:w-auto px-6 py-3 rounded-2xl border-2 border-orange-100 focus:border-orange-500 bg-gray-50 outline-none transition font-bold text-gray-700 text-sm shadow-sm"
                 />
               </div>
             </div>

             <div className="hidden lg:block overflow-x-auto rounded-2xl shadow-inner bg-gray-50 border border-gray-100">
                <table className="min-w-full text-left">
                  <thead className="bg-orange-500 text-white font-bold uppercase text-[10px] tracking-[0.2em]">
                    <tr>
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Shop</th>
                      <th className="px-6 py-4">Total</th>
                      <th className="px-6 py-4">Net</th>
                      <th className="px-6 py-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-white transition">
                        <td className="px-6 py-4 font-mono text-[10px] text-gray-400">#{order._id.slice(-6)}</td>
                        <td className="px-6 py-4 font-bold text-gray-700">{order.userName}</td>
                        <td className="px-6 py-4 font-medium text-gray-500">{order.restaurantName}</td>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 pb-20">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <div key={order._id} className="transform transition hover:scale-[1.02]">
                  <OrderCard
                    order={order}
                    onRemove={handleRemoveOrder}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                 <i className="fa-solid fa-calendar-xmark text-5xl text-gray-200 mb-4"></i>
                 <p className="text-gray-400 font-bold">No orders found for this date selection.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderList;
