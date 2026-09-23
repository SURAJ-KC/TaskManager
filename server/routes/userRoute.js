
const express = require("express");
const { 
  registerUser, 
  verifyOtp, 
  resendOtp, 
  loginUser, 
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  currentUser, 
  getUsers ,
} = require("../Controllers/userController"); 

const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();

router.get("/", getUsers);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.get("/current", validateToken, currentUser);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);

module.exports = router;