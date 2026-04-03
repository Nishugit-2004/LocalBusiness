import React, { useState } from 'react';
import Animation from '../Animations/contact.json';
import Lottie from 'lottie-react';
import Footer from './Footer';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import Loader from '../Loader';

const ContactUs = () => {
  const [loading, setLoading] = useState(false);
  const initial = {
    name: '',
    email: '',
    message: '',
  };

  const [formData, setFormData] = useState(initial);
  const { name, email, message } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:4000/user/contact', formData);
      setFormData(initial);
      toast.success('Message sent successfully!');
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <div
        className="max-w-7xl mx-auto py-16 px-6 grid md:grid-cols-2 items-center gap-12"
        id="contact"
      >
        <div className="bg-white shadow-xl p-8 rounded-xl w-full">
          <h2 className="text-3xl font-bold text-indigo-600 mb-6">Contact Us</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={onChange}
                required
                placeholder="Your Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Message
              </label>
              <textarea
                name="message"
                value={message}
                onChange={onChange}
                required
                placeholder="Type your message..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition duration-300"
            >
              Send Message
            </button>
          </form>
        </div>
        <div className="hidden md:block">
          <Lottie animationData={Animation} loop autoplay />
        </div>
        <Toaster />
      </div>
      <Footer />
    </>
  );
};

export default ContactUs;
