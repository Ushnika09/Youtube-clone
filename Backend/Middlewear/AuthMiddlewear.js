import jwt from "jsonwebtoken";
import UserModel from "../Model/UserModel.js";

export const verifyToken = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, "Secret123");

    const user = await UserModel.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user; // full user object
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
