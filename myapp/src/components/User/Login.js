import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../api';
import 'react-toastify/dist/ReactToastify.css';
import './Signup.css'; 
import {useDispatch, useSelector} from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../store/userSlice';
import { Toaster ,toast} from 'react-hot-toast';
import Loader from '../Loader';
import Lottie from 'lottie-react';
import Animation from '../Animations/lottieanim.json'

const Login = () => {
    const initial={
        email: '',
        password: ''
    };
    const [formData, setFormData] = useState(initial);
    const [loading,setLoading]=useState()
    const { email, password } = formData;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const isAuthenticated = useSelector(state => state.user.isAuthenticated);

    
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    
    useEffect(() => {
        const userData = JSON.parse(sessionStorage.getItem('userData'));
        if (userData && !isAuthenticated) {
            dispatch(login(userData));
        }
    }, [dispatch, isAuthenticated]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const res = await axios.post(`${API_BASE_URL}/user/login`, formData);
            const userData={
                user: res.data.user,
                token: res.data.token,
            }
            
            sessionStorage.setItem('userData', JSON.stringify(userData));
            
            dispatch(login(userData))
            setFormData(initial)
            toast.success("Login Successful!")
            navigate('/')
            } catch (err) {
            const errorMessage = err.response && err.response.data && err.response.data.message 
                ? err.response.data.message 
                : 'Invalid Details';
            toast.error(errorMessage);
            console.error(err);
            setFormData(initial)
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

        
        <div className='login-image' >
        <Lottie animationData={Animation} loop={true} autoplay={true} />
        </div> 
        

        
        <div className="login-container">
            <h1 style={{fontFamily: "Roboto Slab",color:"#12a9a1",fontSize:"2rem"}}>Customer Welcome here...</h1>
            <p>Please login with your details here</p><br/>
               <form className="login-form" onSubmit={handleSubmit}>
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
                <p onClick={() => navigate('/user/forgotpassword')} style={{color:"#e68a00",cursor:"pointer"}}>Forgot Password</p><br/>
             
                <button type="submit">Login</button><br/>
            </form>
                  
             <p>Don't have an account?<Link to="/user/signup" style={{color:"#ff9d00"}}>Sign Up</Link></p>
            <Toaster />
        </div>
        </div>
        </>
    );
};

export default Login;
