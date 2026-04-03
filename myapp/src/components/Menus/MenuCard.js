import React from 'react';
import './MenuCard.css';
import {add}  from '../../store/cartSlice'; 
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
const MenuCard = ({ menu }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useSelector(state => state.user.isAuthenticated);

    const handleAdd = (menu) => {
        if (!isAuthenticated) {
            alert("If User Please Login First!");
            sessionStorage.clear();
            navigate('/user/login');
            window.location.reload();
        } else {
            dispatch(add(menu));
            
        }
    };

    return (
        <>
        <div className="menu-card">
            <div class="relative">
                {/* <img src={menu.imageUrl} alt={menu.name} className="menu-image"/> */}
            <div class=" absolute right-2 z-30 bottom-4 text-red-600"><i class="fa-solid fa-heart"></i></div>
            </div>
            <h2 className="menu-name">{menu.name}</h2>
            <p className="menu-description">{menu.description}</p>
            <p className="menu-price">Price: Rs.{menu.price}</p>
            <p class="font-bold">{menu.inStock ? <span style={{color:"green"}}>In Stock</span> : <span style={{color:"red"}}>Out of Stock</span>}</p>
            <button onClick={() => handleAdd(menu)} className="btn-add" >Add to Cart</button>
        </div>
        <Toaster/>
        </>
        
    );
};

export default MenuCard;
