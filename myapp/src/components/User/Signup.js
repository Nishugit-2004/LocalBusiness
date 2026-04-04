import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Signup.css'; // Import the CSS file for styling
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import Animation from '../Animations/lottieanim.json'

const Signup = () => {

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const initialData={
        name: '',
        email: '',
        password: '',
        phone: ''
    }
    const [formData, setFormData] = useState(initialData);
    const { name, email, password,  phone } = formData;

    const onChange = async e => {
        
        setFormData({ ...formData, [e.target.name]: e.target.value });
        
    };
    const validatePhoneNumber = (number) => {
        const phonePattern = /^\d{10}$/;
        return phonePattern.test(number);
    };
    const isPasswordStrong = (password) => {
        const uppercaseRegex = /[A-Z]/;
        const lowercaseRegex = /[a-z]/;
        const digitRegex = /[0-9]/;
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/; 
        if (password.length < 8) {
            return false;
        }
        if (!uppercaseRegex.test(password)) {
            return false;
        }
        if (!lowercaseRegex.test(password)) {
            return false;
        }
        if (!digitRegex.test(password)) {
            return false;
        }
        if (!specialCharRegex.test(password)) {
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isPasswordStrong(password)) {
            toast.error('Password should be at least 8 characters long and include uppercase, lowercase, number, and special character.');
            setFormData({password: ''})
            return;
        }
        if (!validatePhoneNumber(phone)) {
            toast.error('Invalid phone number. Please enter a valid 10-digit phone number.');
            
            return;
        }
        try {
            const res = await axios.post(`${API_BASE_URL}/user/signup`, formData);
            toast.success('Signup successful!');
            setFormData(initialData)
            console.log(res.data);
        } catch (err) {
            const errorMessage = err.response && err.response.data && err.response.data.message 
                ? err.response.data.message 
                : err.message || 'Invalid Details!';
            toast.error(errorMessage);
            setFormData(initialData)
        }
    };
    



    return (
        <>
        <div className='login-main'>

        
        <div className='login-image' >
        <Lottie animationData={Animation} loop={true} autoplay={true} />
        </div>
       
        <div className="signup-container">
        <h1 style={{fontFamily: "Roboto Slab",color:"#12a9a1",fontSize:"2rem"}}>Customer Welcome here...</h1>
            <p>Please Sign up with your details here</p><br/>
            
            <form className="signup-form" onSubmit={handleSubmit}>
                <div>
                <label for="name">
                        Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={name}
                        placeholder='Name'
                        onChange={onChange}
                        required
                    />
                </div>
                <div>
                <label for="email">
                        Email Address
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        placeholder='Email'
                        onChange={onChange}
                        required
                    />
                </div>
                <div>
                <label for="phone">
                        Phone
                    </label>
                    <input
                        type="text"
                        name="phone"
                        value={phone}
                        placeholder='Phone Number'
                        onChange={onChange}
                        required
                    />
                </div>
                <div>
                <label for="password">
                        Password
                    </label>
                    <div style={{ position: 'relative' }}>
                    <input
                        type={showPassword?"text":"password"}
                        name="password"
                        value={password}
                        onChange={onChange}
                        placeholder='Password'
                        style={{ paddingRight: '30px' }}
                        required
                    />
                    <span
                    onClick={togglePasswordVisibility}
                    style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer'
                    }}
                >
                    <i className={showPassword ? "fas fa-eye" : "fas fa-eye-slash"}></i>
                    </span>
            </div>
                </div>
                <button type="submit">Signup</button>
            </form><br/>
            <p>Already have an account?<Link to="/user/login" style={{color:"#ff9d00"}}>Login</Link></p>
           
        </div>
        <ToastContainer/>
        </div>

        
        </>
    );
};

export default Signup;












