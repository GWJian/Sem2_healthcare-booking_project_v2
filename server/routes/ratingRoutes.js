//this is ratingRouters.js file in server\routes

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Rating = require("../models/Rating");

// Get all ratings without login
router.get("/", async (req, res) => {
  try {
    const ratings = await Rating.find().populate("customer");
    return res.status(200).json({
      ratings,
    });
  } catch (error) {
    return res.status(400).json({
      error,
      message: "Failed to get ratings",
    });
  }
});

// Add a new rating by a customer._id and only one rating per customer
router.post("/", auth, async (req, res) => {
  try {
    const { rating } = req.body;
    const customerId = req.user._id;

    // Check if the customer already rated
    const existingRating = await Rating.findOne({
      customer: customerId,
    });
    if (existingRating) {
      return res.status(400).json({
        message: "You already rated",
      });
    }

    if (rating < 0 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 0 and 5.",
      });
    }

    const newRating = new Rating({
      customer: customerId,
      rating,
    });

    await newRating.save();

    return res.status(200).json({
      message: "New Rating added successfully",
    });
  } catch (error) {
    return res.status(400).json({
      error,
      message: "Failed to add rating",
    });
  }
});

// Update a rating by a customer ._id
router.put("/", auth, async (req, res) => {
  try {
    const { rating } = req.body;
    const customer = req.user._id;
    const updatedRating = await Rating.findOneAndUpdate(
      { customer: customer },
      { rating },
      { new: true }
    );

    if (!updatedRating) {
      return res.status(404).json({
        message: "Rating not found",
      });
    }

    if (rating < 0 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 0 and 5.",
      });
    }

    return res.status(200).json({
      message: "Rating updated successfully",
      rating: updatedRating,
    });
  } catch (error) {
    return res.status(400).json({
      error,
      message: "Failed to update rating",
    });
  }
});

// Get overall rating
router.get("/overall", async (req, res) => {
  try {
    const ratings = await Rating.find();
    const totalCustomers = ratings.length;
    let totalRating = 0;

    ratings.forEach((rating) => {
      totalRating += rating.rating;
    });

    const overallRating = Math.round((totalRating / totalCustomers) * 10) / 10;

    return res.status(200).json({
      overallRating,
    });
  } catch (error) {
    return res.status(400).json({
      error,
      message: "Failed to get overall rating",
    });
  }
});

module.exports = router;
