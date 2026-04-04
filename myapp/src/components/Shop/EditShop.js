import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../api";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { initializeAdmin } from "../../store/adminSlice";
import toast from "react-hot-toast";
import Loader from "../Loader";
import AdminSidebar from "../Admin/AdminSidebar";

const EditShop = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [category, setCategory] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.admin.isAuthenticated);

  const categories = [
    'Daily Needs', 'Hardware & Home Improvement', 'Fashion & Clothing', 
    'Food & Dining', 'Electronics & Gadgets', 'Automobile & Services', 
    'Health & Medical', 'Home Services', 'Education & Training', 
    'Professional Services'
  ];

  useEffect(() => {
    dispatch(initializeAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchShop = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/Shop/${id}`);
        const shop = response.data;
        setName(shop.name);
        setDescription(shop.description);
        setImageUrl(shop.imageUrl);
        setPhone(shop.phone);
        setAddress(shop.address);
        setCategory(shop.category);
        if (shop.location?.coordinates) {
          setLongitude(shop.location.coordinates[0]);
          setLatitude(shop.location.coordinates[1]);
        }
      } catch (error) {
        console.error("Error fetching shop details:", error);
        toast.error("Failed to load shop details");
      } finally {
        setLoading(false);
      }
    };
    fetchShop();
  }, [id, isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const adminData = JSON.parse(localStorage.getItem("adminData"));
    const token = adminData?.token;

    const updatedShop = { name, description, imageUrl, phone, address, category, latitude, longitude };

    try {
      await axios.put(`${API_BASE_URL}/Shop/${id}`, updatedShop, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Shop updated successfully!");
      navigate("/admin/shops");
    } catch (error) {
      console.error("Error updating shop:", error);
      toast.error("Update failed.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Permanently delete this shop?")) {
      const adminData = JSON.parse(localStorage.getItem("adminData"));
      const token = adminData?.token;
      try {
        await axios.delete(`${API_BASE_URL}/Shop/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Shop deleted!");
        navigate("/admin/shops");
      } catch (error) {
        toast.error("Deletion failed.");
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="flex min-h-screen bg-gray-50 mt-16">
      <AdminSidebar />
      <div className="flex-1 ml-0 md:ml-64 p-4 md:p-10 flex flex-col items-center justify-start">
        <div className="max-w-md w-full bg-white shadow-2xl rounded-3xl p-8 md:p-10 border border-gray-100 mt-5">
           <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-black text-gray-800 tracking-tight">Edit Metadata</h1>
              <button onClick={handleDelete} className="text-red-500 hover:text-red-700 text-sm font-bold uppercase tracking-widest bg-red-50 px-4 py-2 rounded-xl transition">
                <i className="fa-solid fa-trash-can mr-2"></i> Delete
              </button>
           </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Shop Name</label>
               <input
                 type="text"
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                 className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-teal-500 outline-none transition bg-gray-50 font-bold text-gray-700"
                 required
               />
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Description</label>
               <textarea
                 value={description}
                 onChange={(e) => setDescription(e.target.value)}
                 className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-teal-500 outline-none transition bg-gray-50 font-medium min-h-[100px]"
               />
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Category</label>
               <select
                 value={category}
                 onChange={(e) => setCategory(e.target.value)}
                 className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-teal-500 outline-none transition bg-gray-50 font-bold text-teal-800"
                 required
               >
                 {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
               </select>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Business Phone</label>
               <input
                 type="tel"
                 value={phone}
                 onChange={(e) => setPhone(e.target.value)}
                 className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-teal-500 outline-none transition bg-gray-50 font-bold text-gray-700"
                 required
               />
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Shop Address</label>
               <input
                 type="text"
                 value={address}
                 onChange={(e) => setAddress(e.target.value)}
                 className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-teal-500 outline-none transition bg-gray-50 font-bold text-gray-700"
                 required
               />
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Shop Image URL</label>
               <input
                 type="text"
                 value={imageUrl}
                 onChange={(e) => setImageUrl(e.target.value)}
                 className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-teal-500 outline-none transition bg-gray-50 font-medium"
               />
            </div>

            <div className="space-y-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => {
                    setLocationLoading(true);
                    navigator.geolocation.getCurrentPosition(
                      (pos) => { setLatitude(pos.coords.latitude); setLongitude(pos.coords.longitude); setLocationLoading(false); toast.success("Location locked!") },
                      (err) => { setLocationLoading(false); toast.error("Coordinate capture failed.") },
                      { timeout: 5000 }
                    );
                  }}
                  className={`w-full py-4 rounded-2xl border-2 border-dashed font-bold flex items-center justify-center gap-2 transition ${latitude ? 'border-green-500 text-green-600 bg-green-50' : 'border-gray-300 text-gray-500 hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50'}`}
                >
                  <i className="fa-solid fa-location-crosshairs"></i>
                  {locationLoading ? 'Updating GPS...' : latitude ? 'Coordinates Updated ✓' : 'Overwrite Shop GPS Pin'}
                </button>
            </div>

            <button type="submit" className="w-full bg-orange-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-orange-700 transform transition active:scale-95 mt-4">
              SAVE CHANGES
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditShop;
