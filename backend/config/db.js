import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URL;
    if (!uri) {
      throw new Error("MongoDB connection string not found in .env file.");
    }
    await mongoose.connect(uri);
    console.log("DB Connected");
  } catch (err) {
    console.error("DB Connection Error: ", err.message);
  }
};
