const express = require('express');
const {
  register,
  verifyRegisterOtp,
  resendRegisterOtp,
  login,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
} =  require('../Controllers/authController');

const router = express.Router();

// Registration & Login
router.post('/register', register);
router.post('/verify-register-otp', verifyRegisterOtp);
router.post('/resend-register-otp', resendRegisterOtp);
router.post('/login', login);


// Password Recovery
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyResetOtp);
router.post('/reset-password', resetPassword);

module.exports = router;