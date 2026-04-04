import mongoose from "mongoose";
let isConnected = false;

const dbconnection = async () => {
    if (isConnected) {
        return;
    }

    try {
        const url = process.env.MONGO_URL || 'mongodb://localhost:27017/VirtualBusiness';
        
        // Optimize for Serverless environment cold starts
        const db = await mongoose.connect(url, {
            serverSelectionTimeoutMS: 5000, // Trigger fail-fast if MongoDB Atlas is blocking Vercel IP
        });

        isConnected = db.connections[0].readyState;
        console.log("Connected to MongoDB successfully!");
    } catch (err) {
        console.error("FATAL: MongoDB Atlas connection failed!", err);
        // We log aggressively so Vercel logs explicitly show if IP is blocked.
    }
}
export default dbconnection;


