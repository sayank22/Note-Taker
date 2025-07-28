// routes/authRoutes.ts

import express from "express";
import { sendOtp, verifyOtp, getMe } from "../controllers/authController";
import { verifyToken } from "../middlewares/verifyToken";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.get("/me", verifyToken, getMe);

export default router;
