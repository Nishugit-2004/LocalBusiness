import express from 'express';
import Cart from '../model/CartSchema.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Get the current user's cart
router.get('/', authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.menuItemId');
    if (!cart) {
      return res.status(200).json({ items: [] });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error: error.message });
  }
});

// Update or initialize the cart entirely (Sync from Redux frontend to Database)
router.post('/sync', authMiddleware, async (req, res) => {
  try {
    const { items } = req.body;
    let cart = await Cart.findOne({ userId: req.user.id });
    
    if (cart) {
      cart.items = items;
      await cart.save();
    } else {
      cart = new Cart({
        userId: req.user.id,
        items
      });
      await cart.save();
    }
    
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error syncing cart', error: error.message });
  }
});

// Clear cart
router.delete('/', authMiddleware, async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.user.id });
    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing cart', error: error.message });
  }
});

export default router;
