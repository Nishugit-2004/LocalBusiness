import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { initializeAdmin, adminlogout } from "../../store/adminSlice";
import Animation from "../Animations/welcome.json";
import Lottie from "lottie-react";
import { Toaster } from "react-hot-toast";
import "../Cart/Order.css";

const AdminWelcome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const adminData = JSON.parse(sessionStorage.getItem("adminData"));
  const username = adminData ? adminData.admin.name : null;

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
  return (
    <>
      <div className="main-order">
        {/* Sidebar */}
        <div className="w-64 bg-teal-600 text-white fixed top-0 left-0 bottom-0 p-6">
          <h2 className="text-2xl font-bold mb-6">Profile Menu</h2>
          <ul>
            <li>
              <Link
                to="/admin/welcome"
                className="block py-2 px-4 hover:bg-teal-500 rounded-md"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/admin/profile"
                className="block py-2 px-4 hover:bg-teal-500 rounded-md"
              >
                User Profile
              </Link>
            </li>
            <li>
              <Link
                to="/admin/add-shop"
                className="block py-2 px-4 hover:bg-teal-500 rounded-md"
              >
                Add Shop
              </Link>
            </li>
            <li>
              <Link
                to="/admin/alluser"
                className="block py-2 px-4 hover:bg-teal-500 rounded-md"
              >
                Customer
              </Link>
            </li>
            <li>
              <Link
                to="/admin/alladmin"
                className="block py-2 px-4 hover:bg-teal-500 rounded-md"
              >
                Seller
              </Link>
            </li>
            <li>
              <Link
                to="/admin/allorder"
                className="block py-2 px-4 hover:bg-teal-500 rounded-md"
              >
                All Orders
              </Link>
            </li>
            <li>
              <Link
                to="/admin/contact"
                className="block py-2 px-4 hover:bg-teal-500 rounded-md"
              >
                Feedback
              </Link>
            </li>

            <li>
              <Link
                to="/"
                className="block py-2 px-4 hover:bg-teal-500 rounded-md"
              >
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
        <div className="order2">
          <h1 class=" text-orange-500 font-bold font-serif text-xl">
            Hello {username}!
          </h1>

          <div className="order2_con">
            <div style={{ width: "100%", color: "rgba(0, 0, 0, 0.601)" }}>
              Dear {username},<br />
              <br />
              Thank you for your hard work and dedication.
              <br /> Your efforts keep ShopLocal running smoothly and
              efficiently. Your commitment and excellence make a huge impact
              every day. We appreciate everything you do. Keep up the great
              work!
              <br />
              <br />
              Best regards,
              <br />
              Team ShopLocal
            </div>
            <Lottie animationData={Animation} loop={true} autoplay={true} />
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default AdminWelcome;
