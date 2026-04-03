import React from 'react';
import './MenuCard.css';
import {add}  from '../../store/cartSlice'; 
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
const MenuCard = ({ menu }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useSelector(state => state.user.isAuthenticated);

    const handleAdd = (menu) => {
        if (!isAuthenticated) {
            alert("If User Please Login First!");
            sessionStorage.clear();
            navigate('/user/login');
            window.location.reload();
        } else {
            dispatch(add(menu));
            
        }
    };

    return (
        <div className={`group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition duration-500 overflow-hidden border border-gray-100 ${!menu.inStock ? 'opacity-80 grayscale-[0.5]' : ''}`}>
            <div className="h-56 relative overflow-hidden">
                {menu.imageUrl ? (
                    <img src={menu.imageUrl} alt={menu.name} className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700" />
                ) : (
                    <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-200">
                      <i className="fa-solid fa-utensils text-6xl"></i>
                    </div>
                )}
                <div className="absolute top-4 right-4 z-30 bg-white/90 backdrop-blur p-2 rounded-full text-red-500 shadow-sm hover:bg-red-50 transform hover:scale-110 transition cursor-pointer">
                    <i className="fa-solid fa-heart text-xl"></i>
                </div>
                {!menu.inStock && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                    <span className="bg-red-500 text-white px-6 py-2 rounded-full font-black text-xs tracking-widest uppercase shadow-xl transform -rotate-12">OUT OF STOCK</span>
                  </div>
                )}
            </div>

            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <h2 className="text-2xl font-black text-gray-800 tracking-tight">{menu.name}</h2>
                    <span className="text-xl font-black text-teal-600">₹{menu.price}</span>
                </div>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed line-clamp-2 italic font-medium h-10">"{menu.description}"</p>
                
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => handleAdd(menu)} 
                        disabled={!menu.inStock}
                        className={`flex-1 py-4 rounded-2xl font-black text-sm tracking-wide shadow-xl transform transition active:scale-95 flex items-center justify-center gap-2 ${
                            menu.inStock 
                            ? 'bg-teal-600 text-white hover:bg-teal-700' 
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        <i className={`fa-solid ${menu.inStock ? 'fa-cart-plus' : 'fa-ban'}`}></i>
                        {menu.inStock ? 'ADD TO CART' : 'UNAVAILABLE'}
                    </button>
                    <div className="w-12 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 hover:bg-orange-100 transition cursor-pointer">
                        <i className="fa-solid fa-share-nodes text-lg"></i>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MenuCard;
