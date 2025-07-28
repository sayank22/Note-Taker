import express from "express";
import { sendOtp, verifyOtp, getMe } from "../controllers/authController";
import { verifyToken } from "../middlewares/authMiddleware";

const router = express.Router();

// @route   POST /api/auth/send-otp
// @desc    Send OTP to email
// @access  Public
router.post("/send-otp", sendOtp);

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP and generate token
// @access  Public
router.post("/verify-otp", verifyOtp);

// @route   GET /api/auth/me
// @desc    Get logged in user
// @access  Private
router.get("/me", verifyToken, getMe);

export default router;
