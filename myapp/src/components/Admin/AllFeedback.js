import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../api";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { adminlogout, initializeAdmin } from "../../store/adminSlice";
import Card from "./Card";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../Loader";

const AllFeedback = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(adminlogout());
    toast.success("Logged Out Successfully!");

    navigate("/");
    window.location.reload();
  };
  useEffect(() => {
    dispatch(initializeAdmin());
  }, [dispatch]);

  useEffect(() => {
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
          <h1 class=" text-orange-500 font-bold text-xl">All Feedback</h1>

          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {users.map((feedback) => (
                <tr key={feedback._id}>
                  <td>{feedback.name}</td>
                  <td>{feedback.email}</td>
                  <td>{feedback.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default AllFeedback;
