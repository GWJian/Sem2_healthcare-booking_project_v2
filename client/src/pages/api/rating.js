//this is rating.js
//app.use("/rating", require("./routes/ratingRoutes"));

import axios from "axios";
import localforage from "localforage";

// Get overall rating
export const getOverallRating = async () => {
  const res = await axios.get("http://localhost:8000/rating/overall");
  return res.data;
};

// Update a rating by a customer ._id
export const updateRating = async (editRating) => {
  let tok = await localforage.getItem("token");
  const res = await axios.put("http://localhost:8000/rating", editRating, {
    headers: {
      "x-auth-token": tok.token,
    },
  });
  return res.data;
};

// Add a new rating by a customer._id and only one rating per customer
export const addRating = async (rating) => {
  let tok = await localforage.getItem("token");
  const res = await axios.post("http://localhost:8000/rating", rating, {
    headers: {
      "x-auth-token": tok.token,
    },
  });
  return res.data;
};

// Get all ratings without login
export const getAllRatings = async () => {
  const res = await axios.get("http://localhost:8000/rating");
  return res.data;
};
