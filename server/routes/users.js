//this is users.js

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//======================== helper function start ===============================
function validateEmail(email) {
  const res = /\S+@\S+\.\S+/;
  return res.test(email);
}
//======================== helper function end ===============================

//======================== register route start ===============================
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    let userFound = await User.findOne({ username });
    let userFoundByEmail = await User.findOne({ email });

    if (!validateEmail(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

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

    let user = new User(req.body);
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);
    user.password = hash;
    await user.save();
    return res.status(200).json({
      message: "Registered successfully",
    });
  } catch (error) {
    return res.status(400).json({
      error,
      message: "Failed to register",
    });
  }
});

//======================== register route end ===============================

//======================== login route ===============================
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    let userFound = await User.findOne({ username });

    if (!userFound) {
      return res.status(400).json({
        message: "Username does not exist",
      });
    }

    let isMatch = bcrypt.compareSync(password, userFound.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    jwt.sign(
      { user: userFound },
      process.env.SECRET_KEY,
      { expiresIn: "720h" },
      (err, token) => {
        if (err) res.status(400).json({ err, msg: "Unable to login" });
        return res.json({ token, user: userFound });
      }
    );
  } catch (e) {
    return res.status(400).json({ e, msg: "Invalid Credentials" });
  }
});

//======================== login route end ===============================

module.exports = router;
