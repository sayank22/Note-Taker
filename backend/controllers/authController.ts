import { Request, Response } from "express";
import Otp from "../models/Otp";
import User from "../models/User";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendOtpMail } from "../utils/sendOtp";

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.userId).select("-otp -__v");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Error fetching user", error: err });
  }
};

// Send OTP
export const sendOtp = async (req: Request, res: Response) => {
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

res.status(200).json({ message: "OTP sent" });
} catch (error) {
console.error("Error sending OTP:", error);
res.status(500).json({ message: "Error sending OTP" });
}
};

// Verify OTP
export const verifyOtp = async (req: Request, res: Response) => {
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

res.json({ token, user });
} catch (err) {
console.error("OTP Verification Error:", err);
res.status(500).json({ message: "Server error during OTP verification" });
}
};