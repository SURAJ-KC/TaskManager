
const crypto = require('crypto');
const User = require('../models/userModel.js');
const PendingUser = require('../models/PendingUser.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const sendEmail = require('../utils/sendEmail.js');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper function for secure 6-digit OTP generation
const generateOtp = () => crypto.randomInt(100000, 1000000).toString();

// ==========================================
// 1. REGISTER (Initial Signup & Re-registration)
// ==========================================
const register = async (req, res) => {
  const { username, email, password, phone } = req.body;

  if (!username || !email || !password || !phone) {
    return res.status(400).json({ message: 'Username, email, phone, and password are required.' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    const user = await User.findOne({ email: normalizedEmail });

    // Prevent re-registration if already verified
    if (user && user.isVerified) {
      return res.status(400).json({ message: 'Email is already registered and verified.' });
    }

    const otp = generateOtp();
    const hashedPassword = await bcrypt.hash(password, 10);
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    let pendingUser = await PendingUser.findOne({ email: normalizedEmail });
    if (!pendingUser) {
      pendingUser = new PendingUser({ email: normalizedEmail });
    }

    pendingUser.username = username;
    pendingUser.password = hashedPassword;
    pendingUser.phone = phone;
    pendingUser.otp = otp;
    pendingUser.otpExpires = otpExpires;

    await sendEmail({
      to: normalizedEmail,
      subject: 'Verify Your Email OTP',
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

    res.status(200).json({ message: 'OTP sent to your email successfully.' });
  } catch (error) {
    console.error('Registration OTP error:', error);
    res.status(500).json({ message: error.message || 'Failed to send verification email. Registration aborted.' });
  }
};

// ==========================================
// 2. VERIFY REGISTER OTP
// ==========================================
const verifyRegisterOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required.' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    const verifiedUser = await User.findOne({ email: normalizedEmail, isVerified: true });
    if (verifiedUser) {
      return res.status(200).json({ message: 'User is already verified. You can log in.' });
    }

    const pendingUser = await PendingUser.findOne({ email: normalizedEmail });
    if (!pendingUser) {
      return res.status(404).json({ message: 'Registration not found or OTP expired' });
    }

    if (String(pendingUser.otp) !== String(otp)) {
      return res.status(400).json({ message: 'Invalid OTP code' });
    }

    if (Date.now() > new Date(pendingUser.otpExpires).getTime()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    await User.deleteOne({ email: normalizedEmail, isVerified: false });
    const createdUser = await User.create({
      username: pendingUser.username,
      email: pendingUser.email,
      password: pendingUser.password,
      phone: pendingUser.phone,
      isVerified: true,
      authProviders: ['local'],
    });
    await PendingUser.deleteOne({ _id: pendingUser._id });

    // Standardized JWT payload
    const accessToken = jwt.sign(
      { id: createdUser._id, email: createdUser.email },
      process.env.ACCESS_TOKEN_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Email verified successfully!',
      accessToken,
      user: {
        id: createdUser._id,
        username: createdUser.username,
        email: createdUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error verifying registration OTP' });
  }
};

// ==========================================
// 3. RESEND REGISTER OTP
// ==========================================
const resendRegisterOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    const pendingUser = await PendingUser.findOne({ email: normalizedEmail });

    if (!pendingUser) {
      return res.status(404).json({ message: 'Registration not found or OTP expired' });
    }

    const otp = generateOtp();
    pendingUser.otp = otp;
    pendingUser.otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    await sendEmail({
      to: normalizedEmail,
      subject: 'New Verification OTP',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2>New Verification Code</h2>
          <h1 style="color: #8b5cf6; letter-spacing: 4px;">${otp}</h1>
          <p>This code expires in 10 minutes.</p>
        </div>
      `,
    });

    await pendingUser.save();
    res.status(200).json({ message: 'New OTP sent to email successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error resending OTP' });
  }
};

// ==========================================
// 4. LOGIN (Blocks Unverified Users)
// ==========================================
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ message: 'Invalid credentials' });
    }

    const isMatch = user.password && (await bcrypt.compare(password, user.password));
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Gating check: Block unverified users
    if (!user.isVerified) {
      return res.status(403).json({
        message: 'Email is not verified. Please verify your OTP first.',
      });
    }

    // Standardized JWT Payload
    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Logged in successfully',
      accessToken,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error logging in' });
  }
};


// ==========================================
// 5. FORGOT PASSWORD (REQUEST RESET OTP)
// ==========================================
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(200).json({ message: 'If an account exists, a reset code was sent.' });
    }

    const otp = generateOtp();
    user.resetOtp = otp;
    user.resetOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await sendEmail({
      to: user.email,
      subject: 'Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2>Reset Your Password</h2>
          <p>Your password reset code is:</p>
          <h1 style="color: #8b5cf6; letter-spacing: 4px;">${otp}</h1>
          <p>This code expires in 10 minutes.</p>
        </div>
      `,
    });

    await user.save();
    res.status(200).json({ message: 'If an account exists, a reset code was sent.' });
  } catch (error) {
    console.error('Resend email error:', error);
    res.status(500).json({ message: error.message || 'Server error sending OTP' });
  }
};

// ==========================================
// 6. VERIFY RESET OTP
// ==========================================
const verifyResetOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required.' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ message: 'Invalid OTP or email' });
    }

    if (!user.resetOtp || String(user.resetOtp) !== String(otp)) {
      return res.status(400).json({ message: 'Invalid OTP code' });
    }

    if (Date.now() > new Date(user.resetOtpExpiresAt).getTime()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    res.status(200).json({ message: 'OTP verified successfully. Proceed to reset password.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error verifying OTP' });
  }
};

// ==========================================
// 7. RESET PASSWORD
// ==========================================
const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: 'Email, OTP, and new password are required.' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired session' });
    }

    if (
      !user.resetOtp ||
      String(user.resetOtp) !== String(otp) ||
      Date.now() > new Date(user.resetOtpExpiresAt).getTime()
    ) {
      return res.status(400).json({ message: 'Invalid or expired session' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = undefined;
    user.resetOtpExpiresAt = undefined;

    await user.save();

    res.status(200).json({ message: 'Password updated successfully! You can now log in.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error resetting password' });
  }
};

module.exports = {
  register,
  verifyRegisterOtp,
  resendRegisterOtp,
  login,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
};