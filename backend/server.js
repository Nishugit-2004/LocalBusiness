import express from 'express';
import cors from 'cors';
import dbconnection from './DbConnection/DbConnect.js';
import router from './Routes/ShopRoute.js';
import menuRouter from  './Routes/MenuRoute.js';
import bodyParser from 'body-parser';
import userRouter from './Routes/userRoute.js';
import cartRouter from './Routes/cartRoutes.js';
import orderRouter from './Routes/orderRoute.js';
import adminRouter from './Routes/AdminRoute.js'
import reviewRouter from './Routes/reviewRoutes.js';
import wishlistRouter from './Routes/wishlistRoutes.js';
import dotenv from 'dotenv'
import User from './model/UserSchema.js';
const app=express();
app.use(bodyParser.json())
const port=4000;
dotenv.config();
app.use(cors());
app.use(express.json())
dbconnection();

app.use('/Shop',router)
app.use('/menus',menuRouter)
app.use('/user',userRouter);
app.use('/cart',cartRouter)
app.use('/order',orderRouter)
app.use('/admin',adminRouter)
app.use('/reviews', reviewRouter)
app.use('/wishlist', wishlistRouter)
 
app.get('/',(req,res)=>{
  res.send("ker dikhaya")
})

app.post('/api/location', (req, res) => {
  const { latitude, longitude } = req.body;
  console.log('User location received:', { latitude, longitude });


  res.json({ message: 'Location received successfully' });
});

app.post('/api/location/save', async (req, res) => {
  const { latitude, longitude, userId } = req.body;
  console.log('User location received for saving:', { latitude, longitude });

  try {
    await User.findByIdAndUpdate(userId, {
      location: {
        lat: latitude,
        lng: longitude
      }
    });
    res.json({ message: 'Location saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to save location' });
  }
});

// Prevent Vercel Serverless Crashes by wrapping listen
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}/`);
  });
}

// Strictly export a Vercel-compatible anonymous function wrapper 
export default (req, res) => app(req, res);
