// backend/config/db.js
import mongoose from "mongoose";

// Single connection, reused across the app's lifetime.
// Fails fast on startup rather than silently failing on first query.
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected:", mongoose.connection.host);
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};