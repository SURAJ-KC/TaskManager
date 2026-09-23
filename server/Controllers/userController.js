const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const PendingUser = require("../models/PendingUser");
const bcrypt = require("bcrypt");
const { randomInt } = require("crypto");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

// ==========================================
// 1. REGISTER USER & SEND OTP
// ==========================================
//@route POST /api/users/register
const registerUser = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, phone, password } = req.body;

  if (!firstname || !lastname || !email || !phone || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  // Prevent re-registration if account is already verified
  if (user && user.isVerified) {
    res.status(400);
    throw new Error("User already registered and verified!");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const username = `${firstname} ${lastname}`.trim();
  const otp = randomInt(100000, 1000000).toString();
  const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
  let pendingUser = await PendingUser.findOne({ email: normalizedEmail });

  if (!pendingUser) {
    pendingUser = new PendingUser({ email: normalizedEmail });
  }

  pendingUser.username = username;
  pendingUser.password = hashedPassword;
  pendingUser.phone = phone;
  pendingUser.otp = otp;
  pendingUser.otpExpires = otpExpires;

  try {
    await sendEmail({
      to: normalizedEmail,
      subject: "Your OTP Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2>Welcome ${username}!</h2>
          <p>Your 6-digit verification code is:</p>
          <h1 style="color: #8b5cf6; letter-spacing: 4px;">${otp}</h1>
          <p>This code expires in 10 minutes.</p>
        </div>
      `,
    });

    await pendingUser.save();

    return res.status(201).json({
      message: "Registration successful! OTP sent to your email.",
      email: pendingUser.email,
    });
  } catch (error) {
    console.error("❌ Email Error:", error);
    res.status(500);
    throw new Error(`Registration could not be completed: ${error.message}`);
  }
});

// ==========================================
// 2. VERIFY REGISTER OTP
// ==========================================
//@route POST /api/users/verify-otp
const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    res.status(400);
    throw new Error("Email and OTP are required");
  }

  const normalizedEmail = email.trim().toLowerCase();
  const verifiedUser = await User.findOne({ email: normalizedEmail, isVerified: true });

  if (verifiedUser) {
    return res.status(200).json({ message: "User is already verified." });
  }

  const pendingUser = await PendingUser.findOne({ email: normalizedEmail });

  if (!pendingUser) {
    res.status(404);
    throw new Error("Registration not found or OTP expired");
  }

  if (pendingUser.otp !== otp || pendingUser.otpExpires < Date.now()) {
    res.status(400);
    throw new Error("Invalid or expired OTP");
  }

  await User.deleteOne({ email: normalizedEmail, isVerified: false });
  const createdUser = await User.create({
    username: pendingUser.username,
    email: pendingUser.email,
    password: pendingUser.password,
    phone: pendingUser.phone,
    isVerified: true,
  });
  await PendingUser.deleteOne({ _id: pendingUser._id });

  const accessToken = jwt.sign(
    {
      user: {
        username: createdUser.username,
        email: createdUser.email,
        id: createdUser._id,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  res.status(200).json({
    message: "Email verified successfully!",
    accessToken,
    user: {
      id: createdUser._id,
      username: createdUser.username,
      email: createdUser.email,
    },
  });
});

// ==========================================
// 3. RESEND OTP
// ==========================================
//@route POST /api/users/resend-otp
const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Email is required");
  }

  const normalizedEmail = email.trim().toLowerCase();
  const pendingUser = await PendingUser.findOne({ email: normalizedEmail });

  if (!pendingUser) {
    res.status(404);
    throw new Error("Registration not found or OTP expired");
  }

  const newOtp = randomInt(100000, 1000000).toString();
  pendingUser.otp = newOtp;
  pendingUser.otpExpires = Date.now() + 10 * 60 * 1000;

  try {
    await sendEmail({
      to: normalizedEmail,
      subject: "Your New OTP Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2>Your New Verification Code</h2>
          <h1 style="color: #8b5cf6; letter-spacing: 4px;">${newOtp}</h1>
          <p>This code expires in 10 minutes.</p>
        </div>
      `,
    });

    await pendingUser.save();
    res.status(200).json({ message: "New OTP sent successfully!" });
  } catch (error) {
    console.error("❌ Email Error:", error);
    res.status(500);
    throw new Error(`Failed to resend OTP: ${error.message}`);
  }
});

// ==========================================
// 4. LOGIN USER (GATED FOR UNVERIFIED USERS)
// ==========================================
//@route POST /api/users/login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required!");
  }

  const normalizedEmail = email.toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (user && (await bcrypt.compare(password, user.password))) {
    // 🔒 Gating check
    if (!user.isVerified) {
      res.status(403);
      throw new Error("Please verify your email before logging in.");
    }

    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user._id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    return res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("Email or password is not valid");
  }
});

// ==========================================
// 5. FORGOT PASSWORD (REQUEST RESET OTP)
// ==========================================
//@route POST /api/users/forgot-password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Email is required");
  }

  const normalizedEmail = email.toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    res.status(404);
    throw new Error("User not found with this email");
  }

  const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
  user.resetOtp = resetOtp;
  user.resetOtpExpiresAt = Date.now() + 10 * 60 * 1000;
  await user.save();

  try {
    await sendEmail({
      to: normalizedEmail,
      subject: "Password Reset OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2>Reset Your Password</h2>
          <p>Your password reset code is:</p>
          <h1 style="color: #8b5cf6; letter-spacing: 4px;">${resetOtp}</h1>
          <p>This code expires in 10 minutes.</p>
        </div>
      `,
    });

    res.status(200).json({ message: "Password reset OTP sent to your email!" });
  } catch (error) {
    console.error("❌ Email Error:", error);
    res.status(500);
    throw new Error(`Failed to send password reset OTP: ${error.message}`);
  }
});

// ==========================================
// 6. VERIFY RESET OTP
// ==========================================
//@route POST /api/users/verify-reset-otp
const verifyResetOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    res.status(400);
    throw new Error("Email and OTP are required");
  }

  const normalizedEmail = email.toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (!user.resetOtp || user.resetOtp !== otp || user.resetOtpExpiresAt < Date.now()) {
    res.status(400);
    throw new Error("Invalid or expired reset OTP");
  }

  res.status(200).json({ message: "OTP verified successfully. You can now reset your password." });
});

// ==========================================
// 7. RESET PASSWORD
// ==========================================
//@route POST /api/users/reset-password
const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    res.status(400);
    throw new Error("Email, OTP, and new password are required");
  }

  const normalizedEmail = email.toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (!user.resetOtp || user.resetOtp !== otp || user.resetOtpExpiresAt < Date.now()) {
    res.status(400);
    throw new Error("Invalid or expired reset session");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  user.resetOtp = undefined;
  user.resetOtpExpiresAt = undefined;
  await user.save();

  res.status(200).json({ message: "Password reset successful! You can now log in with your new password." });
});

// ==========================================
// 8. AUXILIARY USER ROUTES
// ==========================================
//@route GET /api/users/current
const currentUser = asyncHandler(async (req, res) => res.json(req.user));

//@route GET /api/users/
const getUsers = asyncHandler(async (req, res) => res.json({ message: "Get users route working" }));

module.exports = { 
  registerUser, 
  verifyOtp, 
  resendOtp, 
  loginUser, 
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  currentUser, 
  getUsers 
};