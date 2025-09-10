import express from "express";
import { getVideos, seedVideos, getVideoById, updateLikes, getRandomVideos} from "../Controller/VideoController.js";
import { authenticateToken } from "../Middlewear/AuthToken.js";


const router = express.Router();

router.put("/likes/:videoId", authenticateToken, updateLikes);
router.get("/", getVideos);        // GET all videos
router.get("/random", getRandomVideos); 
router.get("/:id", getVideoById);  // GET single video by videoId
router.post("/seed", seedVideos);  // Seed new videos


export default router;