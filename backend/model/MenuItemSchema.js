import mongoose from "mongoose";
const MenuItemSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fooditem',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  imageUrl: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  inStock: {
    type: Boolean,
    default: true
  }
});

const MenuItem = mongoose.model('MenuItem', MenuItemSchema);
export default MenuItem;