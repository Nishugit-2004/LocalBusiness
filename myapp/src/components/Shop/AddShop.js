import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";

const AddShop = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleLogout = () => {
    sessionStorage.removeItem("adminData");
    toast.success("Logged out successfully!");
    window.location.href = "/";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const adminData = JSON.parse(sessionStorage.getItem("adminData"));
    const adminId = adminData?.admin?.id;
    const token = adminData?.token;

    if (!adminId) {
      toast.error("Only admins can post a shop.");
      return;
    }

    const newShop = {
      name,
      description,
      imageUrl,
      adminId,
    };

    try {
      const response = await axios.post(
        "http://localhost:4000/shop",
        newShop,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Shop posted successfully!");
      console.log(response.data);

      setName("");
      setDescription("");
      setImageUrl("");
    } catch (error) {
      console.error("Error posting shop:", error);
      toast.error("Something went wrong.");
    }
  };

  return (
    <>
      <div className="w-64 bg-teal-600 text-white fixed top-0 left-0 bottom-0 p-6">
        <h2 className="text-2xl font-bold mb-6">Profile Menu</h2>
        <ul>
          <li>
            <Link to="/admin/welcome" className="block py-2 px-4 hover:bg-teal-500 rounded-md">
              Home
            </Link>
          </li>
          <li>
            <Link to="/admin/profile" className="block py-2 px-4 hover:bg-teal-500 rounded-md">
              User Profile
            </Link>
          </li>
          <li>
            <Link to="/admin/add-shop" className="block py-2 px-4 hover:bg-teal-500 rounded-md">
              Add Shop
            </Link>
          </li>
          <li>
            <Link to="/admin/alluser" className="block py-2 px-4 hover:bg-teal-500 rounded-md">
              Customer
            </Link>
          </li>
          <li>
            <Link to="/admin/alladmin" className="block py-2 px-4 hover:bg-teal-500 rounded-md">
              Seller
            </Link>
          </li>
          <li>
            <Link to="/admin/allorder" className="block py-2 px-4 hover:bg-teal-500 rounded-md">
              All Orders
            </Link>
          </li>
          <li>
            <Link to="/admin/contact" className="block py-2 px-4 hover:bg-teal-500 rounded-md">
              Feedback
            </Link>
          </li>
          <li>
            <Link to="/" className="block py-2 px-4 hover:bg-teal-500 rounded-md">
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

      <div className="p-8 max-w-md mx-auto bg-white shadow-lg rounded-lg mt-20">
        <h1 className="text-2xl font-bold text-brand mb-4 text-center">Add New Shop</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Shop Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button type="submit" className="w-full bg-brand text-white p-2 rounded hover:bg-brand">
            Submit
          </button>
        </form>
        <Toaster />
      </div>
    </>
  );
};

export default AddShop;
