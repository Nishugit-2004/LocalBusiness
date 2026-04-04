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