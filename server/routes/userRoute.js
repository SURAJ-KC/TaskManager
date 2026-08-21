const express = require("express");
const { 
  registerUser, 
  loginUser, 
  currentUser, 
  getUsers // 1. Import getUsers controller
} = require("../Controllers/userController"); 

const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

// Public route to fetch all registered users for RightRegi
router.get("/", getUsers);

// Registration & Login routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected route
router.get("/current", validateToken, currentUser);

module.exports = router;