import React from 'react';
import './MenuCard.css';
import {add}  from '../../store/cartSlice'; 
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../api';
import toast, { Toaster } from 'react-hot-toast';
const MenuCard = ({ menu }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useSelector(state => state.user.isAuthenticated);
    
    const [isWishlisted, setIsWishlisted] = React.useState(false);
    const [showReviewModal, setShowReviewModal] = React.useState(false);
    const [rating, setRating] = React.useState(5);
    const [comment, setComment] = React.useState("");
    const [reviews, setReviews] = React.useState([]);
    const [averageRating, setAverageRating] = React.useState(0);

    const token = JSON.parse(localStorage.getItem('userData'))?.token;

    React.useEffect(() => {
        axios.get(`${API_BASE_URL}/reviews/${menu._id}`)
            .then(res => {
                setReviews(res.data);
                if (res.data.length > 0) {
                    const avg = res.data.reduce((acc, curr) => acc + curr.rating, 0) / res.data.length;
                    setAverageRating(avg.toFixed(1));
                }
            })
            .catch(err => console.error(err));
    }, [menu._id]);

    const handleWishlist = async () => {
        if (!isAuthenticated) return toast.error("Please Login First!");
        try {
            const res = await axios.post(`${API_BASE_URL}/wishlist/toggle`, { menuItemId: menu._id }, { headers: { Authorization: `Bearer ${token}` } });
            if (res.data.action === 'added') setIsWishlisted(true);
            else setIsWishlisted(false);
            toast.success(res.data.message);
        } catch (e) { 
            toast.error("Error tracking wishlist"); 
        }
    };

    const submitReview = async () => {
        try {
            await axios.post(`${API_BASE_URL}/reviews`, { menuItemId: menu._id, rating, comment }, { headers: { Authorization: `Bearer ${token}` } });
            toast.success("Review Submitted!");
            setShowReviewModal(false);
            // Refresh
            const res = await axios.get(`${API_BASE_URL}/reviews/${menu._id}`);
            setReviews(res.data);
            const avg = res.data.reduce((acc, curr) => acc + curr.rating, 0) / res.data.length;
            setAverageRating(avg.toFixed(1));
        } catch (e) { toast.error("Failed to post Review"); }
    };

    const handleAdd = (menu) => {
        if (!isAuthenticated) {
            alert("If User Please Login First!");
            localStorage.clear();
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
                <div 
                    onClick={handleWishlist}
                    className="absolute top-4 right-4 z-30 bg-white/90 backdrop-blur p-2 rounded-full text-red-500 shadow-sm hover:bg-red-50 transform hover:scale-110 transition cursor-pointer"
                >
                    <i className={`${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart text-xl`}></i>
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
                
                <div className="flex items-center gap-2 mb-3 cursor-pointer" onClick={() => isAuthenticated ? setShowReviewModal(true) : toast.error("Login to review")}>
                    <div className="flex text-yellow-400">
                        <i className="fa-solid fa-star text-sm"></i>
                    </div>
                    <span className="text-xs font-bold text-gray-600 hover:text-teal-600 transition">{averageRating} ({reviews.length} reviews)</span>
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
                </div>
            </div>

            {showReviewModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl transform transition-all">
                        <h3 className="text-2xl font-black text-gray-800 mb-4 tracking-tight">Rate Product</h3>
                        <p className="text-sm font-medium text-gray-500 mb-6">{menu.name}</p>
                        
                        <div className="flex justify-between mb-6 text-3xl text-gray-200">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <i 
                                    key={star} 
                                    onClick={() => setRating(star)}
                                    className={`fa-solid fa-star cursor-pointer transition ${star <= rating ? 'text-yellow-400 transform scale-110' : 'hover:text-yellow-200'}`}
                                ></i>
                            ))}
                        </div>

                        <textarea 
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your experience..."
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-teal-500 focus:bg-white rounded-xl p-4 text-sm font-medium outline-none transition mb-6 min-h-[100px]"
                        ></textarea>

                        <div className="flex gap-3">
                            <button onClick={submitReview} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-black py-4 rounded-xl shadow-lg transform transition active:scale-95">POST</button>
                            <button onClick={() => setShowReviewModal(false)} className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-500 font-black rounded-xl transition">CANCEL</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuCard;
