import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { initializeAuth, logout } from '../../store/userSlice';
import Animation from '../Animations/welcome.json';
import Lottie from 'lottie-react';
import { Toaster, toast } from 'react-hot-toast';

const Welcome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userData = JSON.parse(sessionStorage.getItem('userData'));
  const username = userData && userData.user ? userData.user.name : 'Guest';

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

  return (
    <>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-teal-600 text-white fixed top-0 left-0 bottom-0 p-6">
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
        <div className="ml-64 p-6 flex flex-col w-full">
          <h1 className="text-orange-500 font-bold text-2xl mb-6">Hello {username}!</h1>
          <div className="flex justify-between items-start">
            <div className="w-3/5 text-lg text-gray-700">
              <p>
                Dear {username},<br />
                <br />
                Welcome to <strong>ShopLocal</strong> – your neighborhood marketplace in the palm of your hand! 🛍️
                <br />
                <br />
                We’re thrilled to have you join our mission to support local businesses and bring the charm of your
                nearby stores online. Whether you’re craving something special, looking for daily essentials, or just
                exploring what’s around you — we connect you to trusted shops just around the corner.
                <br />
                <br />
                Every order you make helps strengthen the local economy, uplift small vendors, and build a more connected
                community.
                <br />
                <br />
                <strong>Let’s shop local, support small, and grow together!</strong>
                <br />
                <br />
                Warm regards,
                <br />
                <strong>The ShopLocal Team</strong>
              </p>
            </div>
            <div className="w-2/5">
              <Lottie animationData={Animation} loop={true} autoplay={true} />
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default Welcome;
