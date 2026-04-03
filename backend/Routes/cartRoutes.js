import express from 'express';
const router = express.Router();
import authMiddleware from '../middleware/authMiddleware.js';


router.post('/', authMiddleware, (req, res) => {
    console.log("cart route working")
    res.send('Item displayed');
});

router.post('/place-order', authMiddleware, (req, res) => {
    res.send('Order placed');
});

router.get('/order-history', authMiddleware, (req, res) => {
    res.send('Order history');
});

export default router;
