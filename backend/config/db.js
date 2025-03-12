import mongoose from "mongoose";

const connectDb = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MongoDB URI is missing in .env file");
    }
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

export default connectDb;
