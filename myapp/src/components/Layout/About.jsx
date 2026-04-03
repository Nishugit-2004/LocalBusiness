import React from "react";
import Footer from "./Footer";
import { FaStore, FaTags, FaShippingFast, FaHeadset } from "react-icons/fa";

const About = () => {
  return (
    <>
      {/* Intro Section */}
      <div className="bg-indigo-50 py-16 px-6 md:px-20 text-center">
        <h2 className="text-5xl font-bold text-[#12a9a1] mb-4 animate-fade-in-down">
          Welcome to ShopLocal
        </h2>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto animate-fade-in-up">
          Empowering local businesses and helping you shop smarter—right around
          the corner.
        </p>
      </div>

      {/* About Section */}
      <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-12 px-6">
          <div className="flex justify-center">
            <img
              src="../../../images/man.png"
              alt="About ShopLocal"
              className="w-[500px] md:w-[550px] h-auto rounded-2xl shadow-2xl transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div className="space-y-6 text-gray-700">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Welcome to <span className="text-indigo-600">ShopLocal</span>
            </h1>
            <p className="text-lg leading-relaxed">
              Discover nearby stores, grab exclusive deals, enjoy quick
              checkouts, and experience exceptional customer support—all in one
              app. With ShopLocal, you can effortlessly locate stores around
              you, get access to the best deals and discounts, and enjoy
              seamless and fast checkout processes.
            </p>
            <p className="text-lg leading-relaxed">
              Whether you need help or have questions, our support is always
              available. The app also uses automatic location access to suggest
              personalized local shops for you.
            </p>
            <button className="px-6 py-3 bg-indigo-800 text-white font-semibold rounded-lg shadow hover:bg-indigo-500 transition duration-300">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Key Features Section */}
      <div className="bg-gray-100 py-20 px-6 md:px-20 text-center">
        <h3 className="text-3xl font-bold text-gray-800 mb-10">
          Why ShopLocal?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 max-w-6xl mx-auto">
          {[
            {
              icon: <FaStore />,
              title: "Nearby Stores",
              desc: "Easily locate stores around you in real-time.",
            },
            {
              icon: <FaTags />,
              title: "Best Deals",
              desc: "Unlock exclusive discounts and offers.",
            },
            {
              icon: <FaShippingFast />,
              title: "Quick Checkout",
              desc: "Fast and seamless buying experience.",
            },
            {
              icon: <FaHeadset />,
              title: "24/7 Support",
              desc: "Get help anytime you need it.",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:translate-y-[-5px]"
            >
              <div className="text-indigo-600 text-4xl mb-4">
                {feature.icon}
              </div>
              <h4 className="text-xl font-bold mb-2">{feature.title}</h4>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#12a9a1] text-white py-16 text-center">
        <h3 className="text-4xl font-bold mb-4">
          Ready to explore your local shops?
        </h3>
        <p className="mb-6 text-lg">
          Join ShopLocal today and make smarter, faster, and local choices.
        </p>
        <button className="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-full hover:bg-gray-200 transition duration-300">
          Get Started
        </button>
      </div>

      <Footer />
    </>
  );
};

export default About;
