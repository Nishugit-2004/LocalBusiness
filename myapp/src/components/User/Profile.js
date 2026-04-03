import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { initializeAuth, logout } from '../../store/userSlice';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import '../Cart/Order.css';

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

  const handleLogout = () => {
    sessionStorage.clear();
    dispatch(logout());
    toast.success('Logged Out Successfully!');
    navigate('/');
    window.location.reload();
  };

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:4000/user/update?userId=${userId}`,
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
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-teal-600 text-white fixed top-0 bottom-0 left-0 p-6">
        <h2 className="text-2xl font-bold mb-6">Profile Menu</h2>
        <ul>
          <li>
            <Link to="/user/welcome" className="block py-2 px-4 hover:bg-teal-500 rounded-md">
              Home
            </Link>
          </li>
          <li>
            <Link to="/user/profile" className="block py-2 px-4 hover:bg-teal-500 rounded-md">
              User Profile
            </Link>
          </li>
          <li>
            <Link to="/order/orderdetails" className="block py-2 px-4 hover:bg-teal-500 rounded-md">
              All Orders
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

      {/* Main Content */}
      <div className="flex-1 ml-64 p-6">
        {/* Navbar */}
        <nav className="sticky top-0 bg-white shadow-md z-50 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold text-teal-600">Welcome {name}!</h1>
            </div>
          </div>
        </nav>

        <div className="mt-6">
          <div className="bg-white shadow-md p-6 rounded-lg">
            <h1 className="font-medium text-lg">Name: {name}</h1>
            <h2 className="font-medium text-md">Phone: {phone}</h2>
            <h2 className="font-medium text-md">Email: {email}</h2>

            <button
              onClick={() => setShowModal(true)}
              className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition duration-300"
            >
              Update Profile
            </button>
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
