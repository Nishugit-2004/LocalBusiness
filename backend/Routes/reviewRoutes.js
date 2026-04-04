import express from 'express';
import Review from '../model/ReviewSchema.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Get reviews for a specific menu item
router.get('/:menuItemId', async (req, res) => {
  try {
    const reviews = await Review.find({ menuItemId: req.params.menuItemId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
});

// Add a review to a menu item
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { menuItemId, rating, comment } = req.body;

    // Check if user already reviewed this item
    const existingReview = await Review.findOne({ userId: req.user.id, menuItemId });
    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment;
      await existingReview.save();
      return res.status(200).json({ message: 'Review updated', review: existingReview });
    }

    const review = new Review({
      userId: req.user.id,
      menuItemId,
      rating,
      comment
    });
    await review.save();
    res.status(201).json({ message: 'Review created', review });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting review', error: error.message });
  }
});

export default router;
