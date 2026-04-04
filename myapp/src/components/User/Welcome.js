import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { initializeAuth, logout } from '../../store/userSlice';
import Animation from '../Animations/welcome.json';
import Lottie from 'lottie-react';
import { Toaster, toast } from 'react-hot-toast';

import UserSidebar from './UserSidebar';

const Welcome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userData = JSON.parse(localStorage.getItem('userData'));
  const username = userData && userData.user ? userData.user.name : 'Guest';

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return (
    <div className="flex min-h-screen bg-gray-50 mt-16">
      <UserSidebar />
      
      {/* Main Content */}
      <div className="flex-1 ml-0 md:ml-64 p-4 md:p-10 flex flex-col w-full">
        <div className="max-w-5xl mx-auto w-full">
           <div className="bg-white shadow-xl rounded-2xl p-6 md:p-10 mb-8 border border-gray-100 transform transition hover:scale-[1.01]">
              <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-400 mb-4">
                Hello, {username}!
              </h1>
              <p className="text-gray-500 font-medium italic">Welcome to your local shop command center.</p>
           </div>

           <div className="bg-white shadow-2xl rounded-3xl p-6 md:p-12 flex flex-col lg:flex-row items-center gap-12 border border-gray-50">
              <div className="flex-1 space-y-6">
                <div className="bg-teal-50 border-l-8 border-teal-500 p-6 rounded-r-2xl">
                   <p className="text-teal-800 text-lg font-medium leading-relaxed">
                     Dear <span className="font-bold underlineDecoration-teal-500">{username}</span>,<br /><br />
                     Welcome to <strong>ShopLocal</strong> – your neighborhood marketplace in the palm of your hand! 🛍️
                     We’re thrilled to have you support local businesses and bring the charm of your nearby stores online.
                   </p>
                </div>
                
                <div className="text-gray-600 leading-relaxed space-y-4">
                   <p>Every order you make helps strengthen the local economy, uplift small vendors, and build a more connected community.</p>
                   <p className="font-bold text-teal-700">Let’s shop local, support small, and grow together!</p>
                </div>

                <div className="pt-6 border-t border-gray-100">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-4">Your Support Team</p>
                    <div className="flex items-center gap-3">
                       <span className="font-black text-gray-800 text-lg">The ShopLocal Team</span>
                    </div>
                </div>
              </div>
              
              <div className="w-full lg:w-2/5 max-w-sm">
                  <div className="bg-teal-50 rounded-full p-4 shadow-inner">
                     <Lottie animationData={Animation} loop={true} autoplay={true} />
                  </div>
              </div>
           </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Welcome;
