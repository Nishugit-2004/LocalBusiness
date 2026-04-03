import express from 'express';
import Order from '../model/orderSchema.js';
import stripeLib from 'stripe'

const stripe=stripeLib(process.env.secretkey)


const router = express.Router();  
router.get('/orderdetails', async (req, res) => {
  const {userId}=req.query;
  try {
    const orders = await Order.find({userId});
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

router.delete('/delete', async (req, res) => {
  const {id}=req.query;
  try {
    const order = await Order.findByIdAndDelete(id);
    if (!order) return res.status(404).send('Order not found');
    res.status(200).send('Order deleted successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});



router.post('/orderdetails', async (req, res) => {
    const { userId, userName,items, restaurantName, totalPrice, discountedPrice, discount } = req.body;

    const order = new Order({
      userId,
      userName,
      items,
      restaurantName,
      totalPrice,
      discountedPrice,
      discount,

    });
  
    try {
      const savedOrder = await order.save();
       res.status(201).json({
        order: savedOrder
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });


  router.post('/create-checkout-session', async (req, res) => {
    const { items, email, totalPrice } = req.body;
  
    console.log()
    const line_items = items.map(item => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));
  
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/user/welcome`, 
      cancel_url: `${process.env.FRONTEND_URL}/`, 
      customer_email: email,
    });
  
    res.json({ id: session.id });
  });


export default router;
