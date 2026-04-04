import express from 'express';
import Wishlist from '../model/WishlistSchema.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Get the user's wishlist
router.get('/', authMiddleware, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user.id }).populate('items');
    if (!wishlist) {
      return res.status(200).json({ items: [] });
    }
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wishlist', error: error.message });
  }
});

// Toggle an item in the wishlist
router.post('/toggle', authMiddleware, async (req, res) => {
  try {
    const { menuItemId } = req.body;
    let wishlist = await Wishlist.findOne({ userId: req.user.id });

    if (!wishlist) {
      wishlist = new Wishlist({ userId: req.user.id, items: [menuItemId] });
      await wishlist.save();
      return res.status(200).json({ message: 'Item added to wishlist', wishlist });
    }

    const itemIndex = wishlist.items.indexOf(menuItemId);
    if (itemIndex > -1) {
      // Remove if exists
      wishlist.items.splice(itemIndex, 1);
      await wishlist.save();
      return res.status(200).json({ message: 'Item removed from wishlist', action: 'removed', wishlist });
    } else {
      // Add if doesn't exist
      wishlist.items.push(menuItemId);
      await wishlist.save();
      return res.status(200).json({ message: 'Item added to wishlist', action: 'added', wishlist });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating wishlist', error: error.message });
  }
});

export default router;
