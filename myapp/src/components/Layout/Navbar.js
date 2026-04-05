import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { initializeAuth, logout } from "../../store/userSlice";
import { initializeAdmin } from "../../store/adminSlice";
import toast, { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const AdminAuthenticated = useSelector(
    (state) => state.admin.isAuthenticated
  );
  const items = useSelector((state) => state.cart);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const adminData = JSON.parse(localStorage.getItem("adminData"));
  const adminname = adminData ? adminData.admin.name : null;

  const userData = JSON.parse(localStorage.getItem("userData"));
  const username = userData ? userData.user.name : null;
  const userProfilePic = userData ? userData.user.profilePic : null;

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' }
  ];

  const handleToggleMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsLangOpen(false);
  };

  const currentLanguage = languages.find(l => l.code === i18n.language) || languages[0];

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logout());
    toast.success("Logged out successfully!");
    navigate("/");
    window.location.reload();
  };

  useEffect(() => {
    dispatch(initializeAuth());
    dispatch(initializeAdmin());
  }, [dispatch]);

  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <a href="/" className="flex items-center">
            <img
              src="../../images/logo2.jpg"
              alt="Logo"
              className="w-10 h-10 object-cover"
            />
          </a>

          {/* Language Switcher */}
          <div className="relative">
            <button 
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-2 bg-teal-50 px-3 py-1.5 rounded-lg text-teal-700 text-xs font-bold hover:bg-teal-100 transition-all border border-teal-100"
            >
              <span>{currentLanguage.flag}</span>
              <span className="hidden sm:inline">{currentLanguage.name}</span>
              <i className={`fa-solid fa-chevron-down text-[10px] transition-transform ${isLangOpen ? 'rotate-180' : ''}`}></i>
            </button>
            {isLangOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white shadow-2xl rounded-xl border border-gray-100 py-2 w-32 z-50 animate-fade-in">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-teal-50 transition-colors flex justify-between items-center ${i18n.language === lang.code ? 'text-teal-600 bg-teal-50/50' : 'text-gray-600'}`}
                  >
                    <span>{lang.name}</span>
                    {i18n.language === lang.code && <i className="fa-solid fa-check text-[10px]"></i>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Centered Links */}
        <div className="hidden lg:flex items-center space-x-10 mx-auto">
          <Link
            to="/"
            className="text-lg font-medium text-teal-600 hover:text-teal-800 transition duration-300"
          >
            {t('home')}
          </Link>
          <Link
            to="/about"
            className="text-lg font-medium text-teal-600 hover:text-teal-800 transition duration-300"
          >
            {t('about', 'About')}
          </Link>
          <Link
            to="/contact"
            className="text-lg font-medium text-teal-600 hover:text-teal-800 transition duration-300"
          >
            {t('contact_us', 'Contact Us')}
          </Link>
        </div>

        {/* Right-side Buttons */}
        <div className="flex items-center space-x-3 ml-auto">
          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
                {/* User Profile */}
                <div className="flex items-center space-x-1 bg-gray-100 px-2 py-[2px] rounded-full shadow-sm hover:bg-gray-200 transition duration-300">
                  <img
                    src={userProfilePic || "../../images/userlogo.png"}
                    alt="User"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <Link
                    to="/user/profile"
                    className="text-xs px-2 py-2 font-medium text-gray-700 hover:text-teal-700 transition duration-300"
                  >
                    {username}
                  </Link>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="hidden md:block text-xs mt-3 font-medium px-4 py-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition duration-300 shadow-sm"
                >
                  {t('logout', 'Logout')}
                </button>

                {/* Cart */}
                <div className="relative">
                  <Link to="/cart">
                    <i className="fa-solid fa-cart-shopping text-base text-teal-600 hover:text-teal-800 transition duration-300"></i>
                  </Link>
                  {items.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow">
                      {items.length}
                    </span>
                  )}
                </div>
            </div>
          ) : AdminAuthenticated ? (
            <div className="flex items-center gap-2">
              {/* Admin Profile */}
              <div
                className="flex items-center space-x-1 bg-gray-100 px-4 py-2 rounded-full shadow-sm hover:bg-gray-200 transition duration-300 cursor-pointer"
                onClick={() => navigate("/admin/profile")}
                title="View Profile"
              >
                <img
                  src="../../images/userlogo.png"
                  alt="Admin"
                  className="w-6 h-6 rounded-full object-cover"
                />
                <div className="text-xs font-medium text-gray-700 hover:text-teal-700 transition duration-300">
                  {adminname}
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="hidden md:block text-xs mt-3 font-medium px-4 py-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition duration-300 shadow-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-3">
              <Link
                to="/signup"
                className="text-sm font-black uppercase tracking-widest text-white bg-teal-600 hover:bg-teal-800 px-6 py-2 rounded-xl transition duration-300 shadow-lg"
              >
                {t('sign_up')}
              </Link>

              <Link
                to="/login"
                className="text-sm font-black uppercase tracking-widest text-teal-600 border-2 border-teal-600 hover:bg-teal-50 px-6 py-2 rounded-xl transition duration-300"
              >
                {t('sign_in')}
              </Link>
            </div>
          )}

        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-teal-600 ml-4"
          onClick={handleToggleMenu}
        >
          <i className="fa fa-bars text-2xl"></i>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`md:hidden bg-white shadow-xl fixed top-0 right-0 h-full w-4/5 px-6 py-6 transition-transform z-[60] overflow-y-auto ${
          isMobileMenuOpen
            ? "transform translate-x-0"
            : "transform translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-10">
           <Link to="/" onClick={() => setMobileMenuOpen(false)}>
             <img src="../../images/logo2.jpg" alt="Logo" className="w-12 h-12 rounded-lg" />
           </Link>
           <button onClick={() => setMobileMenuOpen(false)} className="text-teal-600 bg-teal-50 p-2 rounded-full">
             <i className="fa fa-times text-2xl"></i>
           </button>
        </div>
        <div className="space-y-8">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xl font-bold text-teal-700 hover:text-teal-900 border-b pb-4"
          >
            {t('home')}
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xl font-bold text-teal-700 hover:text-teal-900 border-b pb-4"
          >
            {t('about', 'About')}
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xl font-bold text-teal-700 hover:text-teal-900 border-b pb-4"
          >
            {t('contact_us', 'Contact Us')}
          </Link>
        </div>
        <div className="mt-12">
          {isAuthenticated ? (
            <div className="space-y-4">
              <Link
                to="/user/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-4 px-6 text-center text-lg font-bold bg-teal-50 text-teal-700 rounded-xl"
              >
                Profile ({username})
              </Link>
              <Link
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-4 px-6 text-center text-lg font-bold bg-teal-50 text-teal-700 rounded-xl"
              >
                My Cart ({items.length})
              </Link>
              <button
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="block w-full py-4 text-center text-lg font-bold bg-red-50 text-red-600 rounded-xl"
              >
                Logout
              </button>
            </div>
          ) : AdminAuthenticated ? (
            <div className="space-y-4">
              <Link
                to="/admin/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-4 px-6 text-center text-lg font-bold bg-teal-50 text-teal-700 rounded-xl"
              >
                Admin Profile ({adminname})
              </Link>
              <button
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="block w-full py-4 text-center text-lg font-bold bg-red-50 text-red-600 rounded-xl"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-5 text-center text-lg font-black uppercase tracking-widest bg-teal-600 text-white rounded-2xl shadow-xl border-b-4 border-teal-800"
              >
                Create Account
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-5 text-center text-lg font-black uppercase tracking-widest bg-white text-teal-600 rounded-2xl shadow-xl border-2 border-teal-600"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>


      {/* Toast Notification */}
      <Toaster position="top-center" />
    </nav>
  );
};

export default Navbar;
