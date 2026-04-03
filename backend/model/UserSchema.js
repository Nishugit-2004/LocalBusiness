import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number'] },
    resetPasswordExpires:{ type: Date, default: Date.now },
    resetPasswordToken: String,
});

const User=mongoose.model("User",userSchema);
export default User;
