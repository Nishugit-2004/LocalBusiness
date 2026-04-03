import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { initializeAdmin, adminlogout } from "../../store/adminSlice";
import "../Cart/Order.css";
import axios from "axios";
import { API_BASE_URL } from "../../api";
import { Toaster, toast } from "react-hot-toast";
import Loader from "../Loader";

const AdminProfile = () => {
  const [adminData, setadminData] = useState(() => {
    const storedadminData = sessionStorage.getItem("adminData");
    return storedadminData ? JSON.parse(storedadminData) : null;
  });

  const adminId = adminData ? adminData.admin.id : null;
  const token = adminData ? adminData.token : null;
  const [name, setName] = useState(adminData ? adminData.admin.name : "");
  const [email, setEmail] = useState(adminData ? adminData.admin.email : "");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    sessionStorage.clear();
    dispatch(adminlogout());
    alert("Logged Out Successfully!");

    navigate("/");
    window.location.reload();
  };
  useEffect(() => {
    dispatch(initializeAdmin());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(
        `${API_BASE_URL}/admin/update?adminId=${adminId}`,
        {
          name: name,
          email: email,
        },
        {
          headers: {
            Authorization: `Bearer${token}`,
          },
        }
      );

      const updatedAdminData = response.data;
      sessionStorage.setItem(
        "adminData",
        JSON.stringify({
          admin: { ...updatedAdminData, id: updatedAdminData._id },
          token: token,
        })
      );

      setadminData({
        admin: { ...updatedAdminData, id: updatedAdminData._id },
        token: token,
      });
      toast.success("Admin updated!");
      setShowModal(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }
  return (
    <div className="flex min-h-screen bg-gray-50 mt-16">
      {/* Sidebar - Hidden on Mobile, Fixed on Desktop */}
      <div className="hidden md:block w-64 bg-teal-600 text-white fixed top-0 bottom-0 left-0 p-8 shadow-xl mt-16 overflow-y-auto">
        <h2 className="text-xl font-extrabold mb-10 tracking-tight border-b border-teal-500 pb-4">
          <i className="fa-solid fa-gauge-high mr-2"></i> Admin Panel
        </h2>
        <ul className="space-y-3">
          {[
            { to: "/admin/welcome", icon: "fa-house", label: "Dashboard" },
            { to: "/admin/profile", icon: "fa-user-tie", label: "My Profile" },
            { to: "/admin/add-shop", icon: "fa-plus", label: "Add Shop" },
            { to: "/admin/alluser", icon: "fa-users", label: "Customers" },
            { to: "/admin/alladmin", icon: "fa-user-shield", label: "Sellers" },
            { to: "/admin/allorder", icon: "fa-boxes-stacked", label: "All Orders" },
            { to: "/admin/contact", icon: "fa-comment-dots", label: "Feedback" },
            { to: "/", icon: "fa-arrow-left", label: "Go Back" }
          ].map((item) => (
            <li key={item.to}>
              <Link 
                to={item.to} 
                className={`flex items-center py-3 px-4 rounded-xl transition duration-200 ${
                  window.location.pathname === item.to ? "bg-teal-700 shadow-inner" : "hover:bg-teal-700"
                }`}
              >
                <i className={`fa-solid ${item.icon} mr-3 text-sm opacity-80`}></i> {item.label}
              </Link>
            </li>
          ))}
          <li className="pt-8">
            <button
              onClick={handleLogout}
              className="flex items-center w-full py-4 px-4 bg-red-500 text-white rounded-2xl hover:bg-red-600 shadow-lg transform transition active:scale-95"
            >
              <i className="fa-solid fa-right-from-bracket mr-3"></i> Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-0 md:ml-64 p-4 md:p-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100">
             {/* Admin Header Banner */}
             <div className="bg-teal-600 h-32 relative">
                <div className="absolute -bottom-16 left-8">
                   <div className="w-32 h-32 rounded-3xl border-8 border-white shadow-xl bg-teal-50 flex items-center justify-center text-teal-600">
                      <i className="fa-solid fa-user-shield text-5xl"></i>
                   </div>
                </div>
             </div>

             <div className="pt-20 pb-10 px-8">
               <h1 className="text-3xl font-black text-gray-800 tracking-tight">Admin Overview</h1>
               <p className="text-gray-500 text-sm mb-8">Managing VirtualShop with authority.</p>

               <div className="grid md:grid-cols-2 gap-6 bg-teal-50/50 p-6 rounded-2xl border border-dashed border-teal-200">
                  <div className="space-y-1">
                     <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">Admin Name</span>
                     <p className="text-lg font-bold text-gray-700">{name}</p>
                  </div>
                  <div className="space-y-1">
                     <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">Admin Email</span>
                     <p className="text-lg font-bold text-gray-700 truncate">{email}</p>
                  </div>
                  <div className="space-y-1">
                     <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">Access Level</span>
                     <p className="text-sm font-bold bg-teal-600 text-white px-3 py-1 rounded-full w-fit">Full Admin</p>
                  </div>
               </div>

               <div className="mt-10 flex gap-4 flex-wrap">
                  <button
                    onClick={() => setShowModal(true)}
                    className="px-8 py-4 bg-teal-600 text-white rounded-2xl font-bold hover:bg-teal-700 shadow-xl transform transition hover:-translate-y-1"
                  >
                    Edit Profile
                  </button>
                  <Link
                    to="/admin/welcome"
                    className="px-8 py-4 bg-gray-100 text-teal-700 rounded-2xl font-bold hover:bg-gray-200 transition"
                  >
                    Back to Dashboard
                  </Link>
               </div>
             </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>
              &times;
            </span>
            <form onSubmit={handleSubmit}>
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit">Update</button>
            </form>
          </div>
        </div>
      )}
      <Toaster />
    </div>
  );
};

export default AdminProfile;
