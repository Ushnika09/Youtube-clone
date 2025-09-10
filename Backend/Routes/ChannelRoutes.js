import express from "express";
import {
  createChannel,
  addVideoToChannel,
  getChannelByUserId,
  deleteVideoFromChannel,
  updateChannel,
  updateVideoInChannel
} from "../Controller/ChennelController.js";
import { verifyToken } from "../Middlewear/AuthMiddlewear.js";

const router = express.Router();

//Public routes 
router.get("/user/:userId", getChannelByUserId); // Get channel by user ID

//Protected routes 
router.post("/", verifyToken, createChannel);                   // Create a new channel
router.post("/:channelId/video", verifyToken, addVideoToChannel); // Add video to a channel
router.delete("/:channelId/video/:videoId", verifyToken, deleteVideoFromChannel);
// Update channel
router.put("/:channelId", verifyToken, updateChannel);

// Update video
router.put("/:channelId/video/:videoId", verifyToken, updateVideoInChannel);


export default router;