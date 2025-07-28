import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    name: string;
    email: string;
    dob: string;
  };
}

export const verifyToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    const user = await User.findById(decoded.userId).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      dob: user.dob,
    };

    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
