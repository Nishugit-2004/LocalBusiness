import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { adminlogout } from "../../store/adminSlice";
import { toast } from "react-hot-toast";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.admin.isAuthenticated);
  const [isOpen, setIsOpen] = useState(false);

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    sessionStorage.clear();
    dispatch(adminlogout());
    toast.success("Logged Out Successfully!");
    navigate("/");
    window.location.reload();
  };

  const navItems = [
    { to: "/admin/welcome", icon: "fa-house", label: "Home" },
    { to: "/admin/profile", icon: "fa-user-tie", label: "My Profile" },
    { to: "/admin/add-shop", icon: "fa-plus", label: "Add New Shop" },
    { to: "/Shop/AddShop", icon: "fa-shop", label: "My Shops" },
    { to: "/admin/alluser", icon: "fa-users", label: "Customer" },
    { to: "/admin/alladmin", icon: "fa-user-shield", label: "Seller" },
    { to: "/admin/allorder", icon: "fa-boxes-stacked", label: "All Orders" },
    { to: "/admin/contact", icon: "fa-comment-dots", label: "Feedback" },
    { to: "/", icon: "fa-arrow-left", label: "Go Back" },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-teal-600 text-white rounded-full shadow-2xl flex items-center justify-center transform transition active:scale-95"
      >
        <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars-staggered'} text-2xl`}></i>
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-black/50 z-30"
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 bottom-0 left-0 w-64 bg-teal-600 text-white p-8 shadow-2xl mt-16 z-40 overflow-y-auto transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <h2 className="text-xl font-extrabold mb-10 tracking-tight border-b border-teal-500 pb-4">
          <i className="fa-solid fa-gauge-high mr-2"></i> Admin Panel
        </h2>
        <ul className="space-y-3">
          {navItems.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={`flex items-center py-3 px-4 rounded-xl transition duration-200 ${
                  window.location.pathname === item.to
                    ? "bg-teal-700 shadow-inner"
                    : "hover:bg-teal-700"
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
    </>
  );
};

export default AdminSidebar;

