//this is the route for the user role that will be used to create, read, update and delete users

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { isAdmin, isDoctorOrAdmin } = require("../middleware/role");
const auth = require("../middleware/auth");
const bcrypt = require("bcryptjs");

// Create a new user (only admin role can access this route)
router.post("/", auth, isAdmin(), async (req, res) => {
  try {
    const { name, email, username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userFound = await User.findOne({ username });
    let userFoundByEmail = await User.findOne({ email });

    if (userFound) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    if (userFoundByEmail) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const user = new User({
      name,
      email,
      username,
      password: hashedPassword,
      role,
    });

    await user.save();
    return res.status(200).json({
      message: "User created successfully",
    });
  } catch (error) {
    return res.status(400).json({
      error,
      message: error.message,
    });
  }
});

// Read all users (only admin role can access this route)
router.get("/", auth, async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(400).json({
      error,
      message: error.message,
    });
  }
});

// Read a user by id (admin and doctor roles can access this route)
router.get("/:id", auth, isDoctorOrAdmin(), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({
      error,
      message: error.message,
    });
  }
});

// Update a user (only admin role can access this route)
router.put("/:id", auth, isAdmin(), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        password: hashedPassword,
        role,
      },
      { new: true }
    );
    return res.status(200).json({
      message: "User updated successfully",
    });
  } catch (error) {
    return res.status(400).json({
      error,
      message: error.message,
    });
  }
});

// Delete a user (only admin role can access this route)
router.delete("/:id", auth, isAdmin(), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      error,
      message: error.message,
    });
  }
});

module.exports = router;
