import { createSlice } from '@reduxjs/toolkit';


const initialState=loadState();
const CartSlice=createSlice({
    name:'cart',
    initialState,
    reducers:{
        add(state,action){
            const item = action.payload;
            if (item.inStock) {
                state.push(item);
                saveState(state);
                toast.success("Added successfully!")
            } else {
                toast.error(`Out of stock`);
            }
            <Toaster/>

        },
        remove(state,action){
            const newState= state.filter((item)=>item._id!== action.payload);
            saveState(newState);
            return newState;
        },
        clearCart(state){
            const newState=[];
            saveState(newState)
            sessionStorage.removeItem('cart')
            return newState;
        },
        setItems(state, action) {
            const newState= action.payload;
            saveState(newState)
            return newState;
        }
    }
    

})


export const {add,remove,clearCart,setItems} =CartSlice.actions;
export default CartSlice.reducer