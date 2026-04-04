import express from 'express';
import Order from '../model/orderSchema.js';
import Shop from '../model/ShopSchema.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';
import stripeLib from 'stripe'

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
    const { userId, userName, items, restaurantName, shopId, totalPrice, discountedPrice, discount } = req.body;

    const order = new Order({
      userId,
      userName,
      items,
      restaurantName,
      shopId,
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

  router.put('/:id/status', verifyAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
      if (!order) return res.status(404).json({ message: 'Order not found' });
      
      // Emit socket notification
      const io = req.app.get('io');
      if (io) {
        io.to(req.params.id).emit('status_update', { orderId: req.params.id, status });
      }

      res.json(order);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  router.get('/seller-analytics', verifyAdmin, async (req, res) => {
    try {
        const adminId = req.admin.id;
        const shops = await Shop.find({ adminId });
        const shopIds = shops.map(s => s._id);

        if (shopIds.length === 0) {
            return res.json({ totalRevenue: 0, totalOrders: 0, popularItems: [] });
        }

        // Aggregate across matching orders
        const pipeline = [
            { // Match orders where the root shopId or any item's restaurantId belongs to the seller
                $match: {
                    $or: [
                        { shopId: { $in: shopIds } },
                        { 'items.restaurantId': { $in: shopIds } }
                    ]
                }
            },
            {
                $facet: {
                    overview: [
                        { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" }, totalOrders: { $sum: 1 } } }
                    ],
                    popularItems: [
                        { $unwind: "$items" },
                        { $match: { "items.restaurantId": { $in: shopIds } } },
                        { $group: { _id: "$items.name", quantitySold: { $sum: "$items.quantity" }, revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } } } },
                        { $sort: { quantitySold: -1 } },
                        { $limit: 5 }
                    ]
                }
            }
        ];

        const results = await Order.aggregate(pipeline);
        const overview = results[0].overview[0] || { totalRevenue: 0, totalOrders: 0 };
        res.json({
            totalRevenue: overview.totalRevenue,
            totalOrders: overview.totalOrders,
            popularItems: results[0].popularItems
        });
    } catch (err) {
        console.error('Analytics Error:', err);
        res.status(500).json({ message: 'Server error fetching analytics' });
    }
  });


  router.post('/create-checkout-session', async (req, res) => {
    const { items, email, totalPrice } = req.body;
  
    // Dynamically initialize Stripe to securely pull the Environment Variable at Runtime, bypassing Vercel boot crashes
    const stripe = stripeLib(process.env.secretkey);
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
