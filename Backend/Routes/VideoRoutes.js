import express from "express";
import { getVideos, seedVideos, getVideoById } from "../Controller/VideoController.js";

const router = express.Router();

router.get("/", getVideos);        // GET all videos
router.get("/:id", getVideoById);  // GET single video by videoId
router.post("/seed", seedVideos);  // Seed new videos

export default router;
