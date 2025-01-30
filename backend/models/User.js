// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  staffId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  fullName: { type: String, required: true },
  displayName: { type: String },
  dob: { type: Date, required: true },
  gender: { type: String, required: true },
  profilePicture: { type: String },

  // Forgot Password
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
