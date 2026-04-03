// src/components/ResetPassword.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import Loader from '../Loader';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading,setLoading]=useState()

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
     toast.error('Passwords do not match');
      return;
    }
    setLoading(true)

    try {
      const response = await axios.post(`http://localhost:4000/user/resetpassword/${token}`, { password });

      if (response.status === 200) {
        toast.success('Password has been reset!');
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
      <h2 className="forgot-password-heading">Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <label >
          New Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="forgot-password-input"
            required
          />
        </label>
        <label>
          Confirm New Password:
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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

export default ResetPassword;
