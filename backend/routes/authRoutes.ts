import express from "express";
import { sendOtp, verifyOtp, getMe, googleLogin } from "../controllers/authController";
import { verifyToken } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/send-otp", sendOtp);

router.post("/verify-otp", verifyOtp);

router.get("/me", verifyToken, getMe);

router.post("/google-login", googleLogin);


export default router;
