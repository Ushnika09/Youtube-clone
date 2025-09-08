// routes/CommentRoutes.js
import express from "express";
import { addComment, getComments, updateComment, deleteComment } from "../Controller/CommentController.js";
import { verifyToken } from "../Middlewear/AuthMiddlewear.js"

const router = express.Router();

router.post("/", verifyToken, addComment);              // Add comment
router.get("/:videoId", getComments);                  // Fetch comments
router.put("/:commentId", verifyToken, updateComment); // Update comment
router.delete("/:commentId", verifyToken, deleteComment); // Delete comment

export default router;
