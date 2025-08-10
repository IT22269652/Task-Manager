// src/models/auth.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contactNumber: { type: String, required: true },
  role: { type: String, default: "user" }, // Default role, can be updated to "admin"
});

module.exports = mongoose.model("User", userSchema);
