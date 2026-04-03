import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { initializeAuth, logout } from '../../store/userSlice';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { API_BASE_URL } from '../../api';
import '../Cart/Order.css';

import UserSidebar from './UserSidebar';

const Profile = () => {
  const [userData, setUserData] = useState(() => {
    const storedUserData = sessionStorage.getItem('userData');
    return storedUserData ? JSON.parse(storedUserData) : null;
  });

  const userId = userData ? userData.user.id : null;
  const token = userData ? userData.token : null;

  const [name, setName] = useState(userData ? userData.user.name : '');
  const [email, setEmail] = useState(userData ? userData.user.email : '');
  const [phone, setPhone] = useState(userData ? userData.user.phone : '');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(
        `${API_BASE_URL}/user/update?userId=${userId}`,
        {
          name: name,
          email: email,
          phone: phone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUserData = response.data;
      sessionStorage.setItem(
        'userData',
        JSON.stringify({ user: { ...updatedUserData, id: updatedUserData._id }, token: token })
      );

      setUserData({ user: { ...updatedUserData, id: updatedUserData._id }, token: token });
      setShowModal(false);
      toast.success('User updated!');
      window.location.reload();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 mt-16">
      <UserSidebar />
      
      {/* Main Content - No margin on mobile, margin on desktop */}
      <div className="flex-1 ml-0 md:ml-64 p-4 md:p-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100">
            {/* Profile Header */}
            <div className="bg-teal-600 h-32 relative">
               <div className="absolute -bottom-16 left-8">
                  <img 
                    src="../../images/userlogo.png" 
                    className="w-32 h-32 rounded-3xl border-8 border-white shadow-xl bg-white"
                    alt="Profile"
                  />
               </div>
            </div>
            
            <div className="pt-20 pb-10 px-8">
              <h1 className="text-3xl font-black text-gray-800">Welcome, {name}!</h1>
              <p className="text-gray-500 text-sm mb-8 italic">Your account is active and secure.</p>
              
              <div className="grid md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-200">
                <div className="space-y-1">
                   <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">Full Name</span>
                   <p className="text-lg font-bold text-gray-700">{name}</p>
                </div>
                <div className="space-y-1">
                   <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">Email Address</span>
                   <p className="text-lg font-bold text-gray-700 truncate">{email}</p>
                </div>
                <div className="space-y-1">
                   <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">Phone Number</span>
                   <p className="text-lg font-bold text-gray-700">{phone}</p>
                </div>
              </div>

              <div className="mt-10 flex gap-4 flex-wrap">
                <button
                  onClick={() => setShowModal(true)}
                  className="px-8 py-4 bg-teal-600 text-white rounded-2xl font-bold hover:bg-teal-700 shadow-xl transform transition hover:-translate-y-1"
                >
                  Edit Profile
                </button>
                <Link
                  to="/"
                  className="px-8 py-4 bg-gray-100 text-teal-700 rounded-2xl font-bold hover:bg-gray-200 transition"
                >
                  Return Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Modal */}
      {showModal && (
        <div className="modal fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="modal-content bg-white p-8 rounded-lg shadow-lg">
            <span className="absolute top-2 right-2 text-xl cursor-pointer" onClick={() => setShowModal(false)}>
              &times;
            </span>
            <h2 className="text-lg font-semibold mb-4">Update Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <label htmlFor="username" className="block font-medium">
                Username:
              </label>
              <input
                type="text"
                id="username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <label htmlFor="email" className="block font-medium">
                Email:
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <label htmlFor="phone" className="block font-medium">
                Phone:
              </label>
              <input
                type="text"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <button
                type="submit"
                className="w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 transition duration-300"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      )}

      <Toaster />
    </div>
  );
};

export default Profile;
