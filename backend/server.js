import dotenv from 'dotenv';
dotenv.config();
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
import User from './model/UserSchema.js';
import { Server } from 'socket.io';
import http from 'http';
import chatRouter from './Routes/chatRoute.js';
import aiChatRouter from './Routes/AIChatRoute.js';

const app = express();
const server = http.createServer(app);

// Socket.io configuration with wide CORS for mobile
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});
app.set('io', io);

app.use(bodyParser.json({ limit: '10mb' }));

// WIDE CORS FOR PRODUCTION APK STABILITY
app.use(cors({
  origin: "*", 
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Database connection wrapper
app.use(async (req, res, next) => {
  await dbconnection();
  next();
});

// Routes
app.use('/Shop', router);
app.use('/menus', menuRouter);
app.use('/user', userRouter);
app.use('/cart', cartRouter);
app.use('/order', orderRouter);
app.use('/admin', adminRouter);
app.use('/reviews', reviewRouter);
app.use('/wishlist', wishlistRouter);
app.use('/chat', chatRouter);
app.use('/aichat', aiChatRouter);

app.get('/', (req, res) => {
  res.send("VirtualShop Backend Online 🚀");
});

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
