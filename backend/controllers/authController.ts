import { Request, Response } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

import { AuthRequest } from "../middlewares/authMiddleware";
import Otp from "../models/Otp";
import User from "../models/User";
import { sendOtpMail } from "../utils/sendOtp";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @route   POST /api/auth/google-login
// @desc    Login or Register user via Google OAuth token
// @access  Public
export const googleLogin = async (req: Request, res: Response) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(400).json({ message: "Google login failed" });
    }

    let user = await User.findOne({ email: payload.email });

    if (!user) {
      user = new User({
        name: payload.name,
        email: payload.email,
        avatar: payload.picture,
      });
      await user.save();
    }

    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      message: "Google login successful",
      token: jwtToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Google login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// @route   GET /api/auth/me
// @desc    Get authenticated user details
// @access  Private
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return res.status(200).json({ user: req.user });
  } catch (err) {
    console.error("Error in getMe:", err);
    return res.status(500).json({ message: "Error fetching user" });
  }
};

// @route   POST /api/auth/send-otp
// @desc    Send OTP to user's email
// @access  Public
export const sendOtp = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const otp = crypto.randomInt(100000, 999999).toString();

    await Otp.findOneAndUpdate(
      { email },
      { otp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    await sendOtpMail(email, otp);

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({ message: "Error sending OTP" });
  }
};

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP and issue JWT
// @access  Public
export const verifyOtp = async (req: Request, res: Response) => {
  const { name, dob, email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  try {
    const existingOtp = await Otp.findOne({ email });

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

    return res.status(200).json({
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
    console.error("OTP verification error:", err);
    return res.status(500).json({ message: "Server error during OTP verification" });
  }
};
