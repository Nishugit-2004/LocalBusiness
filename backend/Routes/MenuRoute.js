import express from 'express';
import MenuItem from '../model/MenuItemSchema.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all menu items for a restaurant
router.get('/:restaurantId', async (req, res) => {
  try {
    const menus = await MenuItem.find({ restaurantId: req.params.restaurantId });
    res.json(menus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new menu item (Admin only)
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { restaurantId, name, description, imageUrl, price, inStock } = req.body;
    const newItem = new MenuItem({
      restaurantId,
      name,
      description,
      imageUrl,
      price,
      inStock
    });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a menu item (Admin only)
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const updatedItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a menu item (Admin only)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Menu item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
