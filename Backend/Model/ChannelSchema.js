import mongoose from "mongoose";

// Schema for embedded videos
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  videoUrl: { type: String, required: true }, // video link or embed URL
  thumbnailUrl: { type: String, required: true },
  lengthText: { type: String, default: "" },
  viewCount: { type: Number, default: 0 },
  likeCount: { type: Number, default: 0 },
  dislikeCount: { type: Number, default: 0 },
  publishedAt: { type: Date, default: Date.now },
}, { _id: true }); // allow unique _id per video

// Channel schema with embedded videos
const channelSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  handle: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  videos: [videoSchema], // embedded videos
}, { timestamps: true });

// Export Channel model
const ChannelModel = mongoose.model("Channel", channelSchema);
export default ChannelModel;
