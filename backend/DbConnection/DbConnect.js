import mongoose from "mongoose";
const dbconnection = async () => {
    try {
        const url = process.env.MONGO_URL || 'mongodb://localhost:27017/VirtualBusiness';
        await mongoose.connect(url);
        console.log("Connected to database");
    } catch (err) {
        console.log("Not connected", err);
    }
}
export default dbconnection;


