import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" }, // default role is "user", but can be set to "admin" during registration
    cartData: { type: Object, default: {} }, // default empty object for cartData
  },
  { minimize: false } // This ensures empty objects are not removed
);

const userModel = mongoose.model("user", userSchema); // Corrected model creation
export default userModel;
