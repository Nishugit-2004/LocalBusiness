import express from 'express';
import MenuItem from '../model/MenuItemSchema.js';

const router = express.Router();  
router.get('/:restaurantId', async (req, res) => {
  try {
    const menus = await MenuItem.find({ restaurantId: req.params.restaurantId });
    res.json(menus);
    } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
