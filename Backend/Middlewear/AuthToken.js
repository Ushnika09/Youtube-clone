import jwt from "jsonwebtoken";
import UserModel from "../Model/UserModel.js";
import dotenv from "dotenv";

dotenv.config();

export const authenticateToken = async (req, res, next) => {
  try {
    let token = req.headers["authorization"];
    if (!token) return res.status(401).json({ message: "No token provided" });

    // Remove 'Bearer ' prefix if present
    if (token.startsWith("Bearer ")) token = token.slice(7, token.length).trim();

    // Verify token
    const decoded = jwt.verify(token, "Secret123");

    // Fetch user from DB
    const user = await UserModel.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
