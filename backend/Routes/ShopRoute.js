import express from 'express';
import FoodItem from '../model/ShopSchema.js';
import { verifyAdmin } from '../middleware/authMiddleware.js'; 

const router = express.Router();


router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { name, description, imageUrl, latitude, longitude, phone, address } = req.body;
    const adminId = req.admin.id;  
    
    const shopData = { name, description, imageUrl, adminId, phone, address };
    
    if (latitude && longitude) {
      shopData.location = { 
        type: 'Point', 
        coordinates: [parseFloat(longitude), parseFloat(latitude)] 
      };
    }

    const newFoodItem = new FoodItem(shopData);
    await newFoodItem.save();

    res.status(201).json({ message: 'Store added successfully!', foodItem: newFoodItem });
  } catch (err) {
    console.error('Error adding restaurant:', err);
    res.status(500).json({ message: 'Error adding restaurant. Please try again.' });
  }
});


router.get('/', async (req, res) => {
  try {
    const { search, lat, lng, category } = req.query;
    let pipeline = [];

    // $geoNear MUST be the very first stage in the pipeline
    if (lat && lng) {
      pipeline.push({
        $geoNear: {
          near: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          distanceField: "distance", // Adds numeric distance in meters to results
          spherical: true
        }
      });
    }

    if (category) {
      pipeline.push({
        $match: { category }
      });
    }

    if (search && search.trim() !== '') {
      pipeline.push({
        $match: {
          name: { $regex: search, $options: 'i' }
        }
      });
    }

    let foodItems;
    if (pipeline.length > 0) {
      foodItems = await FoodItem.aggregate(pipeline);
    } else {
      foodItems = await FoodItem.find();
    }
    
    res.json(foodItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/restaurants', verifyAdmin, async (req, res) => {
  console.log("Fetching restaurants for adminId")
  const adminId = req.admin.id;

  if (!adminId) {
    return res.status(400).json({ message: 'Invalid or missing adminId' });
  }

  try {
    const restaurants = await FoodItem.find({ adminId });
    res.status(200).json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ message: 'Failed to fetch restaurants' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const restaurant = await FoodItem.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const { name, description, imageUrl, latitude, longitude, phone, address, category } = req.body;
    const adminId = req.admin.id;

    const findShop = await FoodItem.findById(req.params.id);
    if (!findShop || findShop.adminId.toString() !== adminId) {
      return res.status(403).json({ message: 'Unauthorized or shop not found' });
    }

    const updateData = { name, description, imageUrl, phone, address, category };
    
    if (latitude && longitude) {
        updateData.location = {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
        };
    }

    const updatedShop = await FoodItem.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json({ message: 'Shop updated successfully!', shop: updatedShop });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const adminId = req.admin.id;
    const findShop = await FoodItem.findById(req.params.id);
    if (!findShop || findShop.adminId.toString() !== adminId) {
      return res.status(403).json({ message: 'Unauthorized or shop not found' });
    }
    await FoodItem.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Shop deleted successfully!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
