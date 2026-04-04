import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem'
  }]
}, { timestamps: true });

const Wishlist = mongoose.model('Wishlist', WishlistSchema);
export default Wishlist;
