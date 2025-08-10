// src/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/users", authController.getUsers);
router.get("/users/:id", authController.getUserById);
router.put("/users/:id", authController.updateUser); // New route for updating user
router.delete("/users/:id", authController.deleteUser);

module.exports = router;
