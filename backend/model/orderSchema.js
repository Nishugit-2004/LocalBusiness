import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  userName:String,
  items: [
    {
      _id: mongoose.Schema.Types.ObjectId,
      name: String,
      price: Number,
      quantity: Number,
      restaurantId: mongoose.Schema.Types.ObjectId,
      imageUrl:String,
    },
  ],
  restaurantName: String,
  totalPrice: Number,
  discountedPrice: Number,
  discount: Number,
  orderDate: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
