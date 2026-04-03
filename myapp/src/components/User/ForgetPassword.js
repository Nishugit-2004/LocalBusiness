import React, { useState } from 'react';
import axios from 'axios';
import './ForgetPassword.css'; 
import toast, { Toaster } from 'react-hot-toast';
import Loader from '../Loader';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const[loading ,setLoading]=useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const response = await axios.post('http://localhost:4000/user/forgotpassword', { email });
      if (response.status === 200) {
        toast.success('Password reset email sent!');
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again later.');
    }finally{
      setLoading(false)
    }
  };

  if(loading){
    return <Loader/>
  }
  return (
    <>
    <div className="forgot-password-container">
      <h2 className="forgot-password-heading">Forgot Password</h2>
      <form onSubmit={handleSubmit} className="forgot-password-form">
        <label >
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="forgot-password-input"
            required
          />
        </label>
        <button type="submit" className="forgot-password-button">Submit</button>
      </form>
    </div>
    <Toaster/>
    </>
  );
};

export default ForgotPassword;
