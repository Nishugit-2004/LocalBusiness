import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../api";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { initializeAdmin } from "../../store/adminSlice";
import toast from "react-hot-toast";

import AdminSidebar from "../Admin/AdminSidebar";

const AddShop = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [category, setCategory] = useState("Daily Needs");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.admin.isAuthenticated);

  useEffect(() => {
    dispatch(initializeAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, navigate]);

  const categories = [
    'Daily Needs', 'Hardware & Home Improvement', 'Fashion & Clothing', 
    'Food & Dining', 'Electronics & Gadgets', 'Automobile & Services', 
    'Health & Medical', 'Home Services', 'Education & Training', 
    'Professional Services'
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        
        // Compress to JPEG with 0.8 quality to keep payload small but good quality
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.8);
        setImageUrl(compressedBase64);
      };
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) return;

    const adminData = JSON.parse(localStorage.getItem("adminData"));
    const adminId = adminData?.admin?.id;
    const token = adminData?.token;

    const newShop = {
      name,
      description,
      imageUrl,
      adminId,
      latitude,
      longitude,
      phone,
      address,
      category
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/shop`,
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
      setPhone("");
      setAddress("");
      setCategory("Daily Needs");
      setLatitude(null);
      setLongitude(null);
    } catch (error) {
      console.error("Error posting shop:", error);
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 mt-16">
      <AdminSidebar />
      <div className="flex-1 ml-0 md:ml-64 p-4 md:p-10 flex flex-col items-center justify-start">
        <div className="max-w-md w-full bg-white shadow-2xl rounded-3xl p-8 md:p-10 border border-gray-100 mt-5 transform transition hover:scale-[1.01]">
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-400 mb-8 text-center tracking-tight">Add New Shop</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
               <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Shop Name</label>
               <input
                 type="text"
                 placeholder="Enter shop name..."
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                 className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-teal-500 outline-none transition bg-gray-50 font-medium"
                 required
               />
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Description</label>
               <textarea
                 placeholder="Tell us about the shop..."
                 value={description}
                 onChange={(e) => setDescription(e.target.value)}
                 className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-teal-500 outline-none transition bg-gray-50 font-medium min-h-[120px]"
               />
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Business Category</label>
               <select
                 value={category}
                 onChange={(e) => setCategory(e.target.value)}
                 className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-teal-500 outline-none transition bg-gray-50 font-black text-sm uppercase tracking-wider text-teal-800"
                 required
               >
                 {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
               </select>
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Business Phone</label>
               <input
                 type="tel"
                 placeholder="+91..."
                 value={phone}
                 onChange={(e) => setPhone(e.target.value)}
                 className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-teal-500 outline-none transition bg-gray-50 font-medium"
                 required
               />
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Shop Address (Manual)</label>
               <input
                 type="text"
                 placeholder="Street, City, Pincode..."
                 value={address}
                 onChange={(e) => setAddress(e.target.value)}
                 className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-teal-500 outline-none transition bg-gray-50 font-medium"
                 required
               />
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Shop Image Cover</label>
               <div className="relative group w-full h-56 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-teal-500 hover:bg-teal-50 cursor-pointer">
                 <input
                   type="file"
                   accept="image/*"
                   onChange={handleImageUpload}
                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                 />
                 {imageUrl ? (
                   <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                 ) : (
                   <div className="flex flex-col items-center justify-center text-gray-400 group-hover:text-teal-600 transition">
                     <i className="fa-solid fa-cloud-arrow-up text-5xl mb-3"></i>
                     <span className="font-extrabold">Tap to Upload Image</span>
                     <span className="text-xs mt-1 font-medium">(Max 5MB)</span>
                   </div>
                 )}
                 {imageUrl && (
                   <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center pointer-events-none">
                     <span className="text-white font-bold tracking-widest uppercase text-sm"><i className="fa-solid fa-pen mr-2"></i>Change Image</span>
                   </div>
                 )}
               </div>
            </div>

            <div className="space-y-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => {
                    setLocationLoading(true);
                    navigator.geolocation.getCurrentPosition(
                      (pos) => { setLatitude(pos.coords.latitude); setLongitude(pos.coords.longitude); setLocationLoading(false); toast.success("Location locked!") },
                      (err) => { setLocationLoading(false); toast.error("Could not fetch location.") }
                    );
                  }}
                  className={`w-full py-4 rounded-2xl border-2 border-dashed font-bold flex items-center justify-center gap-2 transition ${latitude ? 'border-green-500 text-green-600 bg-green-50' : 'border-gray-300 text-gray-500 hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50'}`}
                >
                  <i className="fa-solid fa-location-dot"></i>
                  {locationLoading ? 'Locating...' : latitude ? 'Coordinates Locked ✓' : 'Pin Shop Location Automatically'}
                </button>
            </div>

            <button type="submit" className="w-full bg-teal-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-teal-700 transform transition active:scale-95 mt-4">
              LAUNCH SHOP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddShop;
