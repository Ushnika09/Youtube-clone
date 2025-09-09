import express from "express";
import {
  createChannel,
  addVideoToChannel,
  getAllChannels,
  getChannelById,
} from "../Controller/channelController.js";
import { verifyToken } from "../Middlewear/AuthMiddlewear.js"

const router = express.Router();

// Public routes
router.get("/", getAllChannels);
router.get("/:id", getChannelById);

// Protected routes
router.post("/", verifyToken, createChannel);
router.post("/:channelId/video", verifyToken, addVideoToChannel);

export default router;
