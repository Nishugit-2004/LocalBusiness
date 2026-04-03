import React, { useState } from 'react';

const Footer = () => {
    const [email, setEmail] = useState('');

    const handleInputChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(`Subscribed with email: ${email}`);
        setEmail('');
    };

    return (
        <footer className="bg-gray-800 text-gray-300 py-10 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                {/* Logo */}
                <div>
                    <img
                        src="../../images/logo2.jpg"
                        alt="Logo"
                        className="w-28 rounded-lg mb-4"
                    />
                </div>

                {/* About Us */}
                <div>
                    <h3 className="text-lg font-semibold text-yellow-400 mb-3">About Us</h3>
                    <p className="text-sm">
                        Creative and expressive way of conveying the idea that the taste and experience of the food at a particular restaurant.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-lg font-semibold text-yellow-400 mb-3">Quick Links</h3>
                    <ul className="space-y-2 text-sm">
                        <li><a href="/#" className="hover:text-white">Home</a></li>
                        <li><a href="/#about" className="hover:text-white">About Us</a></li>
                        <li><a href="/#contact" className="hover:text-white">Contact Us</a></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h3 className="text-lg font-semibold text-yellow-400 mb-3">Contact Info</h3>
                    <p>Email: manyavar12@gmail.com</p>
                    <p>Phone: +1234567890</p>
                    <p>Address: 123 Indrapuri, Bhopal M.P.</p>
                </div>
            </div>

            {/* Newsletter & Social */}
            <div className="mt-10 text-center">
                <h3 className="text-lg font-semibold text-yellow-400 mb-4">Subscribe to Our Newsletter</h3>
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row justify-center items-center gap-3">
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        required
                        className="px-4 py-2 rounded-md text-gray-900 w-64"
                    />
                    <button
                        type="submit"
                        className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-2 rounded-md"
                    >
                        Subscribe
                    </button>
                </form>

                {/* Social Icons */}
                <div className="mt-6 flex justify-center gap-6 text-xl">
                    <a href="#facebook" className="hover:text-blue-500"><i className="fab fa-facebook-f"></i></a>
                    <a href="#twitter" className="hover:text-blue-400"><i className="fab fa-twitter"></i></a>
                    <a href="#linkedin" className="hover:text-blue-300"><i className="fab fa-linkedin-in"></i></a>
                    <a href="#instagram" className="hover:text-pink-400"><i className="fab fa-instagram"></i></a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
