import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import '../User/Signup.css'; 
import {useDispatch, useSelector} from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import { adminlogin } from '../../store/adminSlice';
import { Toaster,toast } from 'react-hot-toast';
import Loader from '../Loader';
import Lottie from 'lottie-react';
import Animation from '../Animations/lottieanim.json'
const AdminLogin = () => {
    const initial={
        email: '',
        password: ''
    };
    const [formData, setFormData] = useState(initial);
    const { email, password } = formData;
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const [loading,setLoading]=useState();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const isAuthenticated = useSelector(state => state.admin.isAuthenticated);

    useEffect(() => {
        const adminData = JSON.parse(sessionStorage.getItem('adminData'));
        if (adminData && !isAuthenticated) {
            dispatch(adminlogin(adminData));
        }
    }, [dispatch, isAuthenticated]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const res = await axios.post('http://localhost:4000/admin/login', formData);
            const adminData={
                admin: res.data.admin,
                token: res.data.token,
            }
            
            sessionStorage.setItem('adminData', JSON.stringify(adminData));
            
            dispatch(adminlogin(adminData))
            setFormData(initial)
            navigate('/')
            toast.success('Login successful!');
            } catch (err) {
            toast.error('Invalid Credentials');
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

        
    
        <Lottie animationData={Animation} loop={true} autoplay={true} />
        <div className="login-container">
            <h1 style={{fontFamily: "Roboto Slab",color:"#12a9a1",fontSize:"2rem"}}>Seller Welcome here...</h1>
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
                <button type="submit">Login</button><br/>
            </form>
           <p>Don't have an account?<Link to="/admin/signup" style={{color:"#ff9d00"}}>Sign Up</Link></p>
            
        </div>
        </div>
        <Toaster />
        </>
    );
};

export default AdminLogin;
