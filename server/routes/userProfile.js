const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");
const bcrypt = require("bcryptjs");

// Read the user's own profile by their id (every role can access this route)
//console.log(req.user.id);

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({
      error,
      message: error.message,
    });
  }
});

// Update the user's own profile by their id
router.put("/", auth, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        name,
        email,
        password: hashedPassword,
      },
      { new: true }
      // { new: true } is used to return the updated object
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

module.exports = router;
