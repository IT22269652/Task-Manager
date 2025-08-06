// src/controllers/taskController.js
const Task = require("../models/task");

exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, checklist } = req.body;
    const task = new Task({
      title,
      description,
      priority,
      dueDate: new Date(dueDate),
      checklist: checklist || [], // Handle checklist
    });
    await task.save();
    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, checklist } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        priority,
        dueDate: new Date(dueDate),
        checklist: checklist || [], // Handle checklist
      },
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
