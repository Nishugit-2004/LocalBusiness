import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ContactUs from "./ContactUs";
import ShopList from "../Shop/ShopList";

const Home = () => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const AdminAuthenticated = useSelector((state) => state.admin.isAuthenticated);
  const anyAuth = isAuthenticated || AdminAuthenticated;

  return (
    <>
      <div className="home-container">
        <video className="background-video" autoPlay loop muted>
          <source src={`${process.env.PUBLIC_URL}/bg2.mp4`} type="video/mp4" />
        </video>
        <div className="content">
          <h1>
            Your neighborhood at your fingertips—discover local treasures
            online!
          </h1>
          <p>
            When you shop local, you’re not just buying a product — you’re
            backing a dream, a neighbor, a story. Shoploca connects you to the
            heart of your community, one purchase at a time.
          </p>
          {!anyAuth && (
            <div className="flex justify-center gap-4 mt-6">
              <Link
                to="/user/login"
                className="px-8 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-800"
              >
                Login
              </Link>
              <Link
                to="/user/signup"
                className="px-8 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-800"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
      <ShopList />

      {!anyAuth && (
        <div className="home-page2">
          <div
            style={{ backgroundColor: "rgba(0, 0, 0, 0.608)", height: "100%" }}
          >
            <h1 id="about">What Our Clients are saying</h1>
            <div className="review-cards">
              <div className="card">
                <div className="card-content">
                  <p>
                    "The food was absolutely amazing! The best dining experience. 
                    Highly recommend the steak!"
                  </p>
                  <br />
                  <div className="flex justify-between">
                    <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="User" />
                    <h3>John Doe</h3>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-content">
                  <p>
                    "Wonderful ambiance and friendly staff. The desserts were to
                    die for. Will definitely come back soon!"
                  </p>
                  <br />
                  <div className="flex justify-between">
                    <img src="https://randomuser.me/api/portraits/women/2.jpg" alt="User" />
                    <h3>Jane Smith</h3>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-content">
                  <p>
                    "A hidden gem in the city. The pasta dishes were exquisite.
                    Excellent service and great value for money."
                  </p>
                  <br />
                  <div className="flex">
                    <img src="https://randomuser.me/api/portraits/men/3.jpg" alt="User" />
                    <h3>Mike Johnson</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ContactUs />
    </>
  );
};

export default Home;
