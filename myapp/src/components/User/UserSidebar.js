import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/userSlice";
import { toast } from "react-hot-toast";

const UserSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    sessionStorage.clear();
    dispatch(logout());
    toast.success("Logged Out Successfully!");
    navigate("/");
    window.location.reload();
  };

  const navItems = [
    { to: "/", icon: "fa-house", label: "Home" },
    { to: "/user/profile", icon: "fa-user", label: "My Profile" },
    { to: "/order/orderdetails", icon: "fa-box", label: "My Orders" },
    { to: "/", icon: "fa-arrow-left", label: "Go Back" },
  ];

  return (
    <div className="hidden md:block w-64 bg-teal-600 text-white fixed top-0 bottom-0 left-0 p-8 shadow-xl mt-16 z-40 overflow-y-auto">
      <h2 className="text-xl font-extrabold mb-10 tracking-tight border-b border-teal-500 pb-4">
        <i className="fa-solid fa-circle-user mr-2"></i> My Account
      </h2>
      <ul className="space-y-4">
        {navItems.map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
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
        <li className="pt-10">
          <button
            onClick={handleLogout}
            className="flex items-center w-full py-4 px-4 bg-red-500 text-white rounded-2xl hover:bg-red-600 shadow-lg transform transition active:scale-95"
          >
            <i className="fa-solid fa-right-from-bracket mr-3"></i> Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default UserSidebar;
