import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Admin.css'; 
import { Link } from 'react-router-dom';
import Loader from '../Loader';
import Lottie from 'lottie-react';
import Animation from '../Animations/lottieanim.json'
const AdminSignup = () => {
    const initialData={
        name: '',
        email: '',
        password: '',
    }
    const [formData, setFormData] = useState(initialData);
    const { name, email, password} = formData;
    const [loading,setLoading]=useState()

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const onChange = async e => {
        
        setFormData({ ...formData, [e.target.name]: e.target.value });
        
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
        setLoading(true)
        try {
            const res = await axios.post('http://localhost:4000/admin/signup', formData);
            toast.success('Signup successful!');
            setFormData(initialData)
            console.log(res.data);
        } catch (err) {
            toast.error('Invalid Details');
            setFormData(initialData)
        }finally{
            setLoading(false)
        }
    };

    if(loading){
        return <Loader/>
    }

    return (
        <>
        <div className='login-main'>

        
        {/* <div className='login-image' >
            <img src='../../images/new_background.avif' style={{width:"100%",height:"100%"}}/>
        </div> */}
        <Lottie animationData={Animation} loop={true} autoplay={true} />
        <div className="signup-container">
        <h1 style={{fontFamily: "Roboto Slab",color:"#12a9a1",fontSize:"2rem"}}>Seller Welcome here...</h1>
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
            <p>Already have an account?<Link to="/admin/login" style={{color:"#ff9d00"}}>Login</Link></p>
           
        </div>
        <ToastContainer/>
        </div>

        
        </>
    );
};

export default AdminSignup;