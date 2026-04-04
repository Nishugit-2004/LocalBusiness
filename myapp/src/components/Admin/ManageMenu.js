import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { initializeAdmin } from "../../store/adminSlice";
import axios from "axios";
import { API_BASE_URL } from "../../api";
import AdminSidebar from "./AdminSidebar";
import Loader from "../Loader";
import toast, { Toaster } from "react-hot-toast";

const ManageMenu = () => {
  const { shopId } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    inStock: true,
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.admin.isAuthenticated);

  const adminData = JSON.parse(localStorage.getItem("adminData"));
  const token = adminData?.token;

  useEffect(() => {
    dispatch(initializeAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMenu();
    }
  }, [shopId, isAuthenticated]);

  const fetchMenu = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/menus/${shopId}`);
      setMenuItems(response.data);
    } catch (error) {
      console.error("Error fetching menu:", error);
      toast.error("Failed to load menu items");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await axios.put(`${API_BASE_URL}/menus/${editingItem._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Item updated successfully");
      } else {
        await axios.post(
          `${API_BASE_URL}/menus`,
          { ...formData, restaurantId: shopId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Item added successfully");
      }
      setShowModal(false);
      setEditingItem(null);
      setFormData({ name: "", description: "", price: "", imageUrl: "", inStock: true });
      fetchMenu();
    } catch (error) {
      console.error("Error saving item:", error);
      toast.error("Failed to save item");
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      imageUrl: item.imageUrl,
      inStock: item.inStock,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`${API_BASE_URL}/menus/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Item deleted");
        fetchMenu();
      } catch (error) {
        console.error("Error deleting item:", error);
        toast.error("Failed to delete item");
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="flex min-h-screen bg-gray-50 mt-16">
      <AdminSidebar />
      <div className="flex-1 ml-0 md:ml-64 p-4 md:p-10">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-400">
            Manage Product Menu
          </h1>
          <button
            onClick={() => {
              setEditingItem(null);
              setFormData({ name: "", description: "", price: "", imageUrl: "", inStock: true });
              setShowModal(true);
            }}
            className="bg-teal-600 text-white px-8 py-3 rounded-2xl font-bold shadow-xl hover:bg-teal-700 transform transition active:scale-95"
          >
            <i className="fa-solid fa-plus mr-2"></i> Add Item
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems.map((item) => (
            <div key={item._id} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-50 transform transition hover:scale-[1.02]">
              <div className="h-48 bg-gray-100 relative">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <i className="fa-solid fa-image text-5xl"></i>
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-black text-teal-600 shadow-sm">
                  ₹{item.price}
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-black text-gray-800">{item.name}</h3>
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${item.inStock ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {item.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mb-6 line-clamp-2">{item.description}</p>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(item)} className="flex-1 bg-gray-50 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-100 transition">Edit</button>
                  <button onClick={() => handleDelete(item._id)} className="px-4 bg-red-50 text-red-400 py-3 rounded-xl hover:bg-red-100 transition">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl">
              <h2 className="text-2xl font-black text-gray-800 mb-6">
                {editingItem ? "Update Menu Item" : "Add New Menu Item"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Item Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3 rounded-xl border-2 border-gray-50 bg-gray-50 focus:border-teal-500 outline-none transition font-medium"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3 rounded-xl border-2 border-gray-50 bg-gray-50 focus:border-teal-500 outline-none transition font-medium"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3 rounded-xl border-2 border-gray-50 bg-gray-50 focus:border-teal-500 outline-none transition font-medium min-h-[80px]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Image URL</label>
                  <input
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3 rounded-xl border-2 border-gray-50 bg-gray-50 focus:border-teal-500 outline-none transition font-medium"
                  />
                </div>
                <div className="flex items-center gap-3 pl-2 py-2">
                  <input
                    type="checkbox"
                    name="inStock"
                    id="inStock"
                    checked={formData.inStock}
                    onChange={handleInputChange}
                    className="w-5 h-5 rounded accent-teal-600"
                  />
                  <label htmlFor="inStock" className="text-sm font-bold text-gray-600">In Stock & Available</label>
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 bg-teal-600 text-white py-4 rounded-xl font-black shadow-lg hover:bg-teal-700 transition">
                    {editingItem ? "SAVE UPDATES" : "LAUNCH ITEM"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-100 text-gray-500 py-4 rounded-xl font-black hover:bg-gray-200 transition"
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
};

export default ManageMenu;
