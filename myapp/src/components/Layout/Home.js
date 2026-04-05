import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import ContactUs from "./ContactUs";
import ShopList from "../Shop/ShopList";

const Home = () => {
  const { t } = useTranslation();
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
            {t('signup_prompt')}
          </h1>
          <p>
            {t('signup_desc')}
          </p>
          {!anyAuth && (
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <Link
                to="/signup"
                className="px-8 py-4 bg-teal-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-teal-700 shadow-2xl transition active:scale-95"
              >
                {t('sign_up')}
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border-2 border-white/50 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white hover:text-teal-700 transition active:scale-95"
              >
                {t('sign_in')}
              </Link>
            </div>
          )}
        </div>
      </div>
      {isAuthenticated && !AdminAuthenticated && <ShopList />}

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
                    "Very helpful for discovering new shops in my area that I didn’t even know existed."
                  </p>
                  <br />
                  <div className="flex justify-between">
                    <img src="https://www.shutterstock.com/image-photo/generate-passport-style-photo-straight-260nw-2612340347.jpg" alt="User" />
                    <h3>Santhosh</h3>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-content">
                  <p>
                    "Ordering from nearby stores has never been this easy. Highly recommended!"
                  </p>
                  <br />
                  <div className="flex justify-between">
                    <img src="https://www.shutterstock.com/image-photo/female-indian-advocate-passport-size-260nw-2756299755.jpg" alt="User" />
                    <h3>Mahima</h3>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-content">
                  <p>
                    "As a shop owner, this app helped me get more customers.”
                  </p>
                  <br />
                  <div className="flex">
                    <img src="https://i.pinimg.com/236x/4c/cd/08/4ccd086a8b7970c7a1ab4961e9bfcafc.jpg" alt="User" />
                    <h3>Rajesh</h3>
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
