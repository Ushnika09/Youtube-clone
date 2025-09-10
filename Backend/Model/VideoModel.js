import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema({
  videoId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: String,
  thumbnails: [
    {
      url: String,
      width: Number,
      height: Number,
    },
  ],
  richThumbnail: String,
  lengthText: String,
  videoUrl:String,
  viewCount: { type: Number, default: 0 },
  likeCount: { type: Number, default: 0 },
  dislikeCount: { type: Number, default: 0 },
  likedByUser: { type: Boolean, default: false },
  dislikedByUser: { type: Boolean, default: false },
  publishedTimeText: String,
  channelId: String,
  channelName: String,
  channelAvatar: String,
  channelSubscribers: Number,
  query: { type: String, default: "New" },
});

const Video = mongoose.model("Video", VideoSchema);
export default Video;
