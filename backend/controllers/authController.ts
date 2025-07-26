import { Request, Response } from 'express';
import Otp from '../models/Otp';
import jwt from 'jsonwebtoken';
import { sendOtpMail } from '../utils/sendOtp';

export const sendOtp = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await Otp.deleteMany({ email }); // Clear previous
  await new Otp({ email, code, expiresAt }).save();

  await sendOtpMail(email, code);

  res.json({ message: 'OTP sent successfully' });
};

export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: 'All fields required' });

  const record = await Otp.findOne({ email, code: otp });
  if (!record || record.expiresAt < new Date()) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  // Generate JWT token
  const token = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: '7d' });

  await Otp.deleteMany({ email }); // Clear used OTP

  res.json({ message: 'Login successful', token });
};
