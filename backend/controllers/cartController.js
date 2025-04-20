import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

// Helper function to extract user ID from Bearer token
const getUserIdFromToken = (req) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) throw new Error("Token not found");
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded.id;
};

const addToCart = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    let userData = await userModel.findById(userId);
    let cartData = userData.cartData;

    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Added to Cart" });
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ success: false, message: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    let userData = await userModel.findById(userId);
    let cartData = userData.cartData;

    if (cartData[req.body.itemId] > 1) {
      cartData[req.body.itemId] -= 1;
    } else {
      delete cartData[req.body.itemId];
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Removed from Cart" });
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ success: false, message: error.message });
  }
};

const getCart = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    const userData = await userModel.findById(userId);
    const cartData = userData.cartData;
    res.json({ success: true, cartData });
  } catch (error) {
    console.log(mouissss)
    console.log(error.message);
    res.status(401).json({ success: false, message: error.message });
  }
};

export { addToCart, removeFromCart, getCart };
