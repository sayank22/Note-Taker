import { Response } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import { AuthRequest } from "../middlewares/authMiddleware";
import Otp from "../models/Otp";
import User from "../models/User";
import { sendOtpMail } from "../utils/sendOtp";

// @desc    Get authenticated user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    res.status(200).json({ user: req.user });
  } catch (err) {
    console.error("Error in getMe:", err);
    res.status(500).json({ message: "Error fetching user", error: err });
  }
};

// @desc    Send OTP to email
// @route   POST /api/auth/send-otp
// @access  Public
export const sendOtp = async (req: AuthRequest, res: Response) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const otp = crypto.randomInt(100000, 999999).toString();

    await Otp.findOneAndUpdate(
      { email },
      { otp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    await sendOtpMail(email, otp);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Error sending OTP" });
  }
};

// @desc    Verify OTP and generate JWT
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOtp = async (req: AuthRequest, res: Response) => {
  const { name, dob, email, otp } = req.body;

  try {
    const existingOtp = await Otp.findOne({ email });

    console.log("User entered OTP:", otp);
    console.log("OTP from DB:", existingOtp?.otp);

    if (!existingOtp || existingOtp.otp !== String(otp)) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ name, dob, email });
      await user.save();
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    await Otp.deleteOne({ email });

    res.status(200).json({
      message: "OTP verified",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        dob: user.dob,
      },
    });
  } catch (err) {
    console.error("OTP Verification Error:", err);
    res.status(500).json({ message: "Server error during OTP verification" });
  }
};
