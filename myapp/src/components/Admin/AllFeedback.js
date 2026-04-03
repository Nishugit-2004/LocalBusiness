import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../api";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { initializeAdmin } from "../../store/adminSlice";

import Loader from "../Loader";
import AdminSidebar from "./AdminSidebar";

const AllFeedback = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
    if (!isAuthenticated) return;
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/user/contact`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 mt-16">
      <AdminSidebar />
      <div className="flex-1 ml-0 md:ml-64 p-4 md:p-10">
        <h1 className="text-3xl font-black text-orange-500 mb-8 mt-5 tracking-tight uppercase text-center">All Feedback</h1>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100">
             <div className="overflow-x-auto rounded-2xl shadow-inner bg-gray-50 border border-gray-100">
                <table className="min-w-full text-left">
                  <thead className="bg-teal-600 text-white font-bold uppercase text-[10px] tracking-[0.2em]">
                    <tr>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Message</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((feedback) => (
                      <tr key={feedback._id} className="hover:bg-white transition">
                        <td className="px-6 py-4 font-bold text-gray-700">{feedback.name}</td>
                        <td className="px-6 py-4 font-medium text-gray-500">{feedback.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-400 italic">"{feedback.message}"</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllFeedback;
