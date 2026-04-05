import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { initializeAdmin, adminlogout } from "../../store/adminSlice";
import Animation from "../Animations/welcome.json";
import Lottie from "lottie-react";

import AdminSidebar from "./AdminSidebar";

const AdminWelcome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.admin.isAuthenticated);

  const adminData = JSON.parse(localStorage.getItem("adminData"));
  const username = adminData ? adminData.admin.name : "Admin";

  useEffect(() => {
    dispatch(initializeAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-gray-50 mt-16">
      <AdminSidebar />
      
      <div className="flex-1 ml-0 md:ml-64 p-4 md:p-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="bg-white shadow-xl rounded-2xl p-6 md:p-10 mb-8 border border-gray-100 transform transition hover:scale-[1.01]">
            <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-400 mb-4">
              Hello, {username}!
            </h1>
            <p className="text-gray-500 font-medium italic">Welcome back to Mandi - Local Business Connector.</p>
          </div>

          <div className="bg-white shadow-2xl rounded-3xl p-6 md:p-12 flex flex-col lg:flex-row items-center gap-12 border border-gray-50">
            <div className="flex-1 space-y-6">
              <div className="bg-teal-50 border-l-8 border-teal-500 p-6 rounded-r-2xl">
                 <p className="text-teal-800 text-lg font-medium leading-relaxed">
                   Dear <span className="font-bold underlineDecoration-teal-500">{username}</span>,<br /><br />
                   Thank you for your hard work and dedication. Your efforts keep 
                   <span className="font-black text-teal-700"> Mandi - Local Business Connector</span> running smoothly 
                   and efficiently. Your commitment makes a huge impact every single day.
                 </p>
              </div>
              <div className="pt-6">
                 <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">Authenticated admin</p>
                 <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center text-white shadow-lg">
                       <i className="fa-solid fa-shield-check text-xl"></i>
                    </div>
                    <span className="font-black text-gray-700">Team Mandi - Local Business Connector Support</span>
                 </div>
              </div>
            </div>
            
            <div className="w-full lg:w-1/2 max-w-sm">
                <div className="bg-teal-50 rounded-full p-4 shadow-inner">
                   <Lottie animationData={Animation} loop={true} autoplay={true} />
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminWelcome;
