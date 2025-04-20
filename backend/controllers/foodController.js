import foodModel from "../models/foodModel.js";
import userModel from "../models/userModel.js";
import fs from "fs";

// Add food items
const addFood = async (req, res) => {
  console.log("User ID:", req.userId); // Check userId
  console.log("User Role:", req.userRole); // Check userRole
  
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Image is required" });
  }

  let image_filename = req.file.filename;

  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
  });

  try {
    let userData = await userModel.findById(req.userId);
    if (userData && userData.role === "admin") {
      await food.save();
      res.json({ success: true, message: "Food Added" });
    } else {
      res.json({ success: false, message: "You are not admin" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error" });
  }
};


// List all foods
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Remove food item
const removeFood = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ success: false, message: "Food ID is required" });
  }

  try {
    let userData = await userModel.findById(req.userId); // Use the userId from the token
    if (userData && userData.role === "admin") {
      const food = await foodModel.findById(id);
      
      if (!food) {
        return res.status(404).json({ success: false, message: "Food item not found" });
      }

      const imagePath = `uploads/${food.image}`;
      
      // Check if the image file exists before attempting to delete it
      fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (!err) {
          fs.unlink(imagePath, (err) => {
            if (err) console.error('Error deleting image:', err);
          });
        }
      });

      await foodModel.findByIdAndDelete(id);
      res.json({ success: true, message: "Food Removed" });
    } else {
      res.json({ success: false, message: "You are not admin" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { addFood, listFood, removeFood };
