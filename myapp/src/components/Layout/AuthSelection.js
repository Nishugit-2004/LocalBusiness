import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthSelection = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Determine if we are in 'login' or 'signup' mode based on path
    const isLogin = location.pathname.includes('login');
    const modeText = isLogin ? 'Login' : 'Sign Up';

    const handleSeller = () => {
        navigate(isLogin ? '/admin/login' : '/admin/signup');
    };

    const handleCustomer = () => {
        navigate(isLogin ? '/user/login' : '/user/signup');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 pt-16">
            <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Seller Option */}
                <div 
                    onClick={handleSeller}
                    className="group bg-white p-10 rounded-3xl shadow-xl border-2 border-transparent hover:border-teal-600 transition-all cursor-pointer transform hover:-translate-y-2 flex flex-col items-center text-center"
                >
                    <div className="w-20 h-20 bg-teal-100 rounded-2xl flex items-center justify-center mb-6 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-all">
                        <i className="fa-solid fa-briefcase text-3xl"></i>
                    </div>
                    <h2 className="text-2xl font-black text-gray-800 mb-4 uppercase tracking-tight">Manage Your Business</h2>
                    <p className="text-gray-500 font-medium mb-8">List your products, manage orders, and grow your local dream.</p>
                    <span className="mt-auto px-8 py-3 bg-teal-600 text-white rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg group-hover:bg-teal-700 transition">
                         {modeText} as Seller
                    </span>
                </div>

                {/* Customer Option */}
                <div 
                    onClick={handleCustomer}
                    className="group bg-white p-10 rounded-3xl shadow-xl border-2 border-transparent hover:border-orange-500 transition-all cursor-pointer transform hover:-translate-y-2 flex flex-col items-center text-center"
                >
                    <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
                        <i className="fa-solid fa-basket-shopping text-3xl"></i>
                    </div>
                    <h2 className="text-2xl font-black text-gray-800 mb-4 uppercase tracking-tight">Discover Businesses</h2>
                    <p className="text-gray-500 font-medium mb-8">Browse local treasures, support neighbors, and shop unique finds.</p>
                    <span className="mt-auto px-8 py-3 bg-orange-500 text-white rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg group-hover:bg-orange-600 transition">
                         {modeText} as Customer
                    </span>
                </div>

            </div>
        </div>
    );
};

export default AuthSelection;
