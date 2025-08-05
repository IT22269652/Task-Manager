// src/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/users", authController.getUsers);
router.delete("/users/:id", authController.deleteUser); // Corrected line

module.exports = router;
