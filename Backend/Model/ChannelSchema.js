import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  videoUrl: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  lengthText: { type: String, default: "" },
  viewCount: { type: Number, default: 0 },
  likeCount: { type: Number, default: 0 },
  dislikeCount: { type: Number, default: 0 },
  publishedAt: { type: Date, default: Date.now },
}, { _id: true });

const channelSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  handle: { type: String, required: true, unique: true },
  avatarUrl: { type: String, default: "" },
  description: { type: String, default: "" },
  bannerUrl: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  videos: [videoSchema],
}, { timestamps: true });

const ChannelModel = mongoose.model("Channel", channelSchema);
export default ChannelModel;
