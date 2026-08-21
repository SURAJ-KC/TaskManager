const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please add the user name"],
    },
    email: {
      type: String,
      required: [true, "Please add the email address"],
      unique: true, // ✅ Fixed: Must be a boolean (not an array with custom text)
    },
    password: {
      type: String,
      required: [true, "Please add password"],
    },
    phone: {
      type: String,
      required: [true, "Please add the phone number"], // ✅ Added to match backend controller
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);