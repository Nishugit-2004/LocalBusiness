import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { initializeAuth, logout } from "../../store/userSlice";
import { initializeAdmin } from "../../store/adminSlice";
import toast, { Toaster } from "react-hot-toast";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const AdminAuthenticated = useSelector(
    (state) => state.admin.isAuthenticated
  );
  const items = useSelector((state) => state.cart);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const adminData = JSON.parse(sessionStorage.getItem("adminData"));
  const adminname = adminData ? adminData.admin.name : null;

  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const username = userData ? userData.user.name : null;
  const userProfilePic = userData ? userData.user.profilePic : null;

  const handleToggleMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    dispatch(logout());
    toast.success("Logged out successfully!");
    navigate("/");
    window.location.reload();
  };

  useEffect(() => {
    dispatch(initializeAuth());
    dispatch(initializeAdmin());
  }, [dispatch]);

  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center">
        {/* Logo */}
        <a href="/" className="flex items-center">
          <img
            src="../../images/logo2.jpg"
            alt="Logo"
            className="w-10 h-10 object-cover"
          />
        </a>

        {/* Centered Links */}
        <div className="hidden md:flex items-center space-x-10 mx-auto">
          <Link
            to="/"
            className="text-lg font-medium text-teal-600 hover:text-teal-800 transition duration-300"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-lg font-medium text-teal-600 hover:text-teal-800 transition duration-300"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-lg font-medium text-teal-600 hover:text-teal-800 transition duration-300"
          >
            Contact Us
          </Link>
        </div>

        {/* Right-side Buttons */}
        <div className="flex items-center space-x-3 ml-auto">
          {isAuthenticated ? (
            <>
              <>
                {/* User Profile */}
                <div className="flex items-center space-x-1 bg-gray-100 px-2 py-[2px] rounded-full shadow-sm hover:bg-gray-200 transition duration-300">
                  <img
                    src={userProfilePic || "../../images/userlogo.png"}
                    alt="User"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <Link
                    to="/user/profile"
                    className="text-xs px-2 py-2 font-medium text-gray-700 hover:text-teal-700 transition duration-300"
                  >
                    {username}
                  </Link>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="text-xs mt-3 font-medium px-4 py-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition duration-300 shadow-sm"
                >
                  Logout
                </button>

                {/* Cart */}
                <div className="relative">
                  <Link to="/cart">
                    <i className="fa-solid fa-cart-shopping text-base text-teal-600 hover:text-teal-800 transition duration-300"></i>
                  </Link>
                  {items.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow">
                      {items.length}
                    </span>
                  )}
                </div>
              </>
            </>
          ) : AdminAuthenticated ? (
            <>
              {/* Admin Profile */}
              <div className="flex items-center gap-2">
                {/* Admin Profile */}
                <div
                  className="flex items-center space-x-1 bg-gray-100 px-4 py-2 rounded-full shadow-sm hover:bg-gray-200 transition duration-300"
                  onClick={() => navigate("/admin/profile")}
                  title="View Profile"
                >
                  <img
                    src="../../images/userlogo.png"
                    alt="Admin"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <div className="text-xs font-medium text-gray-700 hover:text-teal-700 transition duration-300">
                    {adminname}
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="text-xs mt-3 font-medium px-4 py-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition duration-300 shadow-sm"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Seller and Customer Buttons */}
              <Link
                to="/admin/signup"
                className="text-sm font-medium text-white bg-teal-600 hover:bg-teal-800 px-3 py-1 rounded-md transition duration-300"
              >
                Become a Seller
              </Link>

              <Link
                to="/user/signup"
                className="text-sm font-medium text-white bg-teal-600 hover:bg-teal-800 px-3 py-1 rounded-md transition duration-300"
              >
                Become a Customer
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-teal-600 ml-4"
          onClick={handleToggleMenu}
        >
          <i className="fa fa-bars text-2xl"></i>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`md:hidden bg-white shadow-md absolute top-0 right-0 w-full px-6 py-4 transition-transform ${
          isMobileMenuOpen
            ? "transform translate-x-0"
            : "transform translate-x-full"
        }`}
      >
        <div className="space-y-7">
          <Link
            to="/"
            className="block text-lg font-medium text-teal-600 hover:text-teal-800"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="block text-lg font-medium text-teal-600 hover:text-teal-800"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="block text-lg font-medium text-teal-600 hover:text-teal-800"
          >
            Contact Us
          </Link>
        </div>
        <div className="mt-6">
          {isAuthenticated ? (
            <>
              <Link
                to="/user/profile"
                className="block text-lg font-medium text-teal-600 hover:text-teal-800"
              >
                {username}
              </Link>

              <button
                onClick={handleLogout}
                className="block w-full py-2 text-center text-sm font-medium text-teal-600 hover:text-teal-800"
              >
                Logout
              </button>
            </>
          ) : AdminAuthenticated ? (
            <>
              <Link
                to="/admin/welcome"
                className="block text-lg font-medium text-teal-600 hover:text-teal-800"
              >
                {adminname}
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full py-2 text-center text-sm font-medium text-teal-600 hover:text-teal-800"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/admin/signup"
                className="px-4 py-2 text-sm font-semibold bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-300"
              >
                Become a Seller
              </Link>
              <Link
                to="/user/signup"
                className="px-4 py-2 text-sm font-semibold bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition duration-300"
              >
                Become a Customer
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      <Toaster position="top-center" />
    </nav>
  );
};

export default Navbar;
