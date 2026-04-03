import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, remove } from '../../store/cartSlice';
import './Cart.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader';
import { toast, Toaster } from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe("pk_test_51NmBxVSJm0EOvE96jDAKUOsep6pg3OfXGtTguyJdXCt0FFxOL8Ipho1HzbWtDVTUin5wJyEFX8jYwcmCrcHTx0gh00spEecMx7");

export const Cart = () => {
  const items = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userData = JSON.parse(sessionStorage.getItem('userData'));
  const userId = userData?.user?.id || null;
  const username = userData?.user?.name || '';
  const [restaurantNames, setRestaurantNames] = useState({});
  const [loading, setLoading] = useState(false);

  const groupedItems = items.reduce((acc, item) => {
    const existing = acc.find(i => i._id === item._id);
    if (existing) existing.quantity += 1;
    else acc.push({ ...item, quantity: 1 });
    return acc;
  }, []);

  const totalPrice = groupedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discount = 0.1;
  const discountedPrice = totalPrice * (1 - discount);

  useEffect(() => {
    axios.get('https://mernbackend-2-ebc9.onrender.com/restaurant')
      .then(res => {
        const names = res.data.reduce((acc, r) => ({ ...acc, [r._id]: r.name }), {});
        setRestaurantNames(names);
      })
      .catch(err => console.error('Fetch restaurant error:', err));
  }, []);

  const handleRemove = (id) => {
    dispatch(remove(id));
    toast.success('Removed Successfully!');
  };

  const handlePayment = async () => {
    if (!userId) return toast.error('Please log in to proceed.');

    const orderData = {
      userId,
      userName: username,
      items: groupedItems,
      restaurantName: groupedItems.map(item => restaurantNames[item.restaurantId]).join(', '),
      totalPrice,
      discountedPrice,
      discount,
    };

    setLoading(true);
    try {
      await axios.post('https://mernbackend-1-9ihi.onrender.com/order/orderdetails', orderData);
      const res = await axios.post('https://mernbackend-1-9ihi.onrender.com/order/create-checkout-session', orderData);
      const stripe = await stripePromise;

      dispatch(clearCart());
      sessionStorage.removeItem('cart');
      toast.success('Redirecting to payment...');
      await stripe.redirectToCheckout({ sessionId: res.data.id });
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="flex flex-col md:flex-row justify-center px-4 py-8 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-2/3">
        <h2 className="text-xl font-bold mb-4">Your Cart</h2>
        {groupedItems.length ? (
          groupedItems.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 mb-4 rounded-lg bg-yellow-50 shadow-sm">
              <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
              <div className="flex-1 ml-4">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
                <p className="text-sm">Restaurant: <span className="font-semibold">{restaurantNames[item.restaurantId]}</span></p>
                <p className="text-sm">Quantity: <span className="font-semibold">{item.quantity}</span></p>
                <p className="text-blue-600 font-semibold">Rs. {item.price}</p>
              </div>
              <button onClick={() => handleRemove(item._id)} aria-label="Remove" className="text-xl text-yellow-400 hover:text-yellow-700">
                <i className="fa-solid fa-trash-can"></i>
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No items in your cart.</p>
        )}
      </div>

      {groupedItems.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-1/3 h-fit">
          <h2 className="text-xl font-bold mb-4 text-center">Payment Summary</h2>
          <div className="space-y-2">
            {groupedItems.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>{item.name} x {item.quantity}</span>
                <span className="text-blue-600">Rs. {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <hr className="my-2" />
            <div className="flex justify-between font-semibold">
              <span>Total:</span>
              <span className="text-blue-600">Rs. {totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-700">
              <span>Discount (10%):</span>
              <span>- Rs. {(totalPrice * discount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Payable:</span>
              <span className="text-green-600">Rs. {discountedPrice.toFixed(2)}</span>
            </div>
            <button onClick={handlePayment} className="w-full mt-4 bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg transition duration-300">
              Pay Now
            </button>
          </div>
        </div>
      )}
      <Toaster />
    </div>
  );
};
