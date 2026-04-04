import mongoose from "mongoose";

const FoodItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    imageUrl: {
        type: String,
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: [
            'Daily Needs', 'Hardware & Home Improvement', 'Fashion & Clothing', 
            'Food & Dining', 'Electronics & Gadgets', 'Automobile & Services', 
            'Health & Medical', 'Home Services', 'Education & Training', 
            'Professional Services'
        ],
        required: true,
        default: 'Daily Needs'
    },
    views: {
        type: Number,
        default: 0,
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    location: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point'
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          default: [0, 0]
        }
    }
});

// Create text index for Smart Search Auto-Suggestions
FoodItemSchema.index({ name: 'text', description: 'text' });

// Create 2dsphere index for Location-based Discovery $geoNear
FoodItemSchema.index({ location: '2dsphere' });

const Fooditem = mongoose.model('FoodItem', FoodItemSchema);
export default Fooditem;