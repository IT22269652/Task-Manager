// src/models/task.js
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: String, enum: ["Low", "Medium", "High"], required: true },
  dueDate: { type: Date, required: true },
  checklist: [{ type: String }],
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Complete"],
    default: "Pending",
  },
  completedCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Task", taskSchema);
