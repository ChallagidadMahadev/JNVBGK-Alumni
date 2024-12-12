import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { sendOTPEmail } from "../services/emailService.js";
import { generateOTP, verifyOTP } from "../services/otpService.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { validateResetToken } from "../middleware/auth.js";

const router = express.Router();

// Register
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { name, email, password, batchYear, gender } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      batchYear,
      gender,
      role: "alumni",
    });

    await user.save();

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Return user data without password
    const userWithoutPassword = { ...user.toObject() };
    delete userWithoutPassword.password;

    res.status(201).json({
      token,
      user: userWithoutPassword,
    });
  })
);

// Login
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Return user data without password
    const userWithoutPassword = { ...user.toObject() };
    delete userWithoutPassword.password;

    res.json({
      token,
      user: userWithoutPassword,
    });
  })
);

// Request password reset
router.post(
  "/forgot-password",
  asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate OTP
    const otp = await generateOTP(user._id);

    // Send OTP via email
    await sendOTPEmail(email, otp);

    res.json({ message: "OTP sent to your email" });
  })
);

// Verify OTP and get reset token
router.post(
  "/verify-otp",
  asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isValid = await verifyOTP(user._id, otp);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user._id, purpose: "reset" },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ resetToken });
  })
);

// Reset password
router.post(
  "/reset-password",
  validateResetToken,
  asyncHandler(async (req, res) => {
    const { password } = req.body;
    const userId = req.user.userId;

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update password
    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    res.json({ message: "Password updated successfully" });
  })
);

export default router;
