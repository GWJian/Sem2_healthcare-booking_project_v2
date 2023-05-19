//this is the model for the User.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["customer", "doctor", "admin"],
    default: "customer",
  },
});

module.exports = mongoose.model("User", UserSchema);
