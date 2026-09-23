const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please add the user name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please add the email address"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
      trim: true,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    authProviders: {
      type: [String],
      default: [],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    // Registration OTP fields
    otp: {
      type: String,
      default: null,
    },
    otpExpires: {
      type: Date,
      default: null,
    },
    // Forgot Password OTP fields
    resetOtp: {
      type: String,
      default: null,
    },
    resetOtpExpiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index(
  { otpExpires: 1 },
  {
    expireAfterSeconds: 0,
    partialFilterExpression: { isVerified: false },
  }
);

module.exports = mongoose.model("User", userSchema);