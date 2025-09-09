import express from "express";
import {
  createChannel,
  addVideoToChannel,
  getAllChannels,
  getChannelById,
  getChannelByUserId
} from "../Controller/ChennelController.js";
import { verifyToken } from "../Middlewear/AuthMiddlewear.js";

const router = express.Router();

// ---------------- Public routes ----------------
router.get("/", getAllChannels);               // Get all channels
router.get("/:id", getChannelById);           // Get single channel by ID
router.get("/user/:userId", getChannelByUserId); // Get channel by user ID

// ---------------- Protected routes ----------------
router.post("/", verifyToken, createChannel);                   // Create a new channel
router.post("/:channelId/video", verifyToken, addVideoToChannel); // Add video to a channel

export default router;