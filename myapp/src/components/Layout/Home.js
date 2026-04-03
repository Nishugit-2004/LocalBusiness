import React from "react";
import RestaurantList from "../Shop/ShopList";
import Footer from "../Layout/Footer";
import "./Home.css";
import { Link } from "react-router-dom";
import ContactUs from "./ContactUs";
import ShopList from "../Shop/ShopList";
const Home = () => {
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
          <br />
          <br />
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
        </div>
      </div>
      <ShopList/>

      <div className="home-page2">
        <div
          style={{ backgroundColor: "rgba(0, 0, 0, 0.608)", height: "100%" }}
        >
          <h1 id="about">What Our Clints are saying</h1>
          <div class="review-cards">
            <div class="card">
              <div class="card-content ">
                <p>
                  "The food was absolutely amazing! The best dining experience
                  . Highly recommend the steak!"
                  <br />
                  <br />
                </p>
                <br />
                <div class="flex justify-between">
                  <img
                    src="https://randomuser.me/api/portraits/men/1.jpg"
                    alt="User Image"
                  />
                  <h3>John Doe</h3>
                </div>
              </div>
            </div>
            <div class="card">
              <div class="card-content ">
                <p>
                  "Wonderful ambiance and friendly staff. The desserts were to
                  die for. Will definitely come back soon!"
                  <br />
                  <br />
                </p>

                <br />
                <div class="flex justify-between">
                  <img
                    src="https://randomuser.me/api/portraits/women/2.jpg"
                    alt="User Image"
                  />
                  <h3>Jane Smith</h3>
                </div>
              </div>
            </div>
            <div class="card">
              <div class="card-content">
                <p>
                  "A hidden gem in the city. The pasta dishes were exquisite.
                  Excellent service and great value for money."
                  <br />
                  <br />
                </p>
                <br />

                <div class="flex">
                  <img
                    src="https://randomuser.me/api/portraits/men/3.jpg"
                    alt="User Image"
                  />
                  <h3>Mike Johnson</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ContactUs />
    </>
  );
};

export default Home;
