import jwt from "jsonwebtoken";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// 🔧 Helper to extract userId from Bearer token
const getUserIdFromToken = (req) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) throw new Error("Token not found");
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded.id;
};

const placeOrder = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);

    const newOrder = new orderModel({
      userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      date: new Date(), // Assign the current timestamp as the order creation date
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ success: false, message: error.message });
  }
};


const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true") {
      res.json({ success: true, message: "Order confirmed" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Order canceled" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Error verifying order" });
  }
};

const userOrders = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    const orders = await orderModel.find({ userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ success: false, message: error.message });
  }
};

const listOrders = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    const userData = await userModel.findById(userId);

    if (userData && userData.role === "admin") {
      const orders = await orderModel.find({});
      res.json({ success: true, data: orders });
    } else {
      res.status(403).json({ success: false, message: "You are not admin" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ success: false, message: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    const userData = await userModel.findById(userId);

    if (userData && userData.role === "admin") {
      await orderModel.findByIdAndUpdate(req.body.orderId, {
        status: req.body.status,
      });
      res.json({ success: true, message: "Status Updated Successfully" });
    } else {
      res.status(403).json({ success: false, message: "You are not an admin" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ success: false, message: error.message });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
