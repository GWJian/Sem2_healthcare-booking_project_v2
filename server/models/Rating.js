//this is Rating.js in models
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RatingSchema = new Schema({
  customer: { type: Schema.Types.ObjectId, ref: "User" },
  rating: { type: Number, required: true, min: 1, max: 5 },
});

module.exports = mongoose.model("Rating", RatingSchema);

// let ratings = [
//   {
//       customer: 1,
//       rating: 5,
//   }
//   {
//       customer: 2,
//       rating: 4
//   },
//   {
//       customer: 3,
//       rating: 2
//   }
// ]

// customer = n
// n 除 ratings score = average rating
