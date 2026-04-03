import { configureStore } from "@reduxjs/toolkit";
import cartReducer  from './cartSlice'
import useReducer  from "./userSlice";
import adminSlice from "./adminSlice";

const store=configureStore({
    reducer:{
        cart:cartReducer,
        user:useReducer,
        admin:adminSlice
    }
})


export default store;