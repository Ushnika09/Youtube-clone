
import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  videoId: { type: String, required: true },       // YouTube video ID
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // who posted
  text: { type: String, required: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
}, { timestamps: true });

const CommentModel = mongoose.model("Comment", CommentSchema);
export default CommentModel;
