import React, { useEffect, useState } from "react";
import axios from "axios";
import OrderCard from "./OrderCard";
import "./Order.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { adminlogout, initializeAdmin } from "../../store/adminSlice";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../Loader";
import "../Cart/Order.css";
function OrderList() {
  const [order, setorder] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState();

  useEffect(() => {
    const fetchorders = async () => {
      const admindata = JSON.parse(sessionStorage.getItem("Data"));
      const token = admindata.token;
      if (!token) {
        toast.error("No authorized user found");
        navigate("/user/login");
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:4000/admin/allorder`
        );

        setorder(response.data);
      } catch (error) {
        console.error("There was an error fetching the data!", error);
      } finally {
        setLoading(false);
      }
    };

    fetchorders();
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.clear();
    dispatch(adminlogout());
    toast.success("Logged Out Successfully!");

    navigate("/");
    window.location.reload();
  };
  useEffect(() => {
    dispatch(initializeAdmin());
  }, [dispatch]);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="main-order">
        <div className="order1">
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
                  to="/admin/add-restaurant"
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
        </div>
        <div className="order2">
          <h1
            style={{
              textAlign: "center",
              color: "#ff9d00",
              fontSize: "2rem",
              fontWeight: "bold",
            }}
          >
            Order Details
          </h1>

          <div className="restaurant-list">
            {order.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                onRemove={handleRemoveOrder}
              />
            ))}
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
}

export default OrderList;
