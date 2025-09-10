import Channel from "../Model/ChannelSchema.js";
import User from "../Model/UserModel.js";
import mongoose from "mongoose";
import Video from "../Model/VideoModel.js";


// Add a video to a channel AND global Video collection
export const addVideoToChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const { title, description, videoUrl, thumbnailUrl, lengthText } = req.body;

    //  Find the channel
    const channel = await Channel.findById(channelId);
    if (!channel) return res.status(404).json({ message: "Channel not found" });

    // Check authorization
    if (channel.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Create video object for channel
    const newChannelVideo = {
      title,
      description,
      videoUrl,
      thumbnailUrl,
      lengthText,
      viewCount: 0,
      likeCount: 0,
      dislikeCount: 0,
      publishedAt: new Date(),
    };
    channel.videos.push(newChannelVideo);
    await channel.save();

    const savedChannelVideo = channel.videos[channel.videos.length - 1];
    const channelVideoId = savedChannelVideo._id.toString();

    // Create video object for global Video collection
    const newGlobalVideo = new Video({
  videoId: channelVideoId, 
  title,
  description,
  thumbnails: [{ url: thumbnailUrl }],
  lengthText,
  videoUrl,
  viewCount: 0,
  likeCount: 0,
  dislikeCount: 0,
  publishedTimeText: "Just now",
  channelId: channel._id.toString(),
  channelName: channel.name,
  channelAvatar: channel.avatarUrl,
  query: "User Upload",
});


    await newGlobalVideo.save();

    //  Return both saved videos
    res.status(201).json({
      message: "Video added successfully",
      channelVideo: savedChannelVideo,
      globalVideo: newGlobalVideo,
    });
  } catch (err) {
    console.error("Failed to add video:", err);
    res.status(500).json({ message: "Failed to add video", details: err.message });
  }
};


// Create a new channel
export const createChannel = async (req, res) => {
  try {
    const { name, handle, description, avatarUrl, bannerUrl } = req.body;

    if (!name || !handle) {
      return res.status(400).json({ message: "Name and handle are required" });
    }

    // Check if handle already exists
    const existing = await Channel.findOne({ handle });
    if (existing) {
      return res.status(400).json({ message: "Handle already taken" });
    }

    const newChannel = new Channel({
      userId: req.user._id,
      name,
      handle,
      description,
      avatarUrl,
      bannerUrl,
      isActive: true,
      videos: [],
    });

    await newChannel.save();

    // Update the user to mark as channel and return updated doc
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { isChannel: true },
      { new: true }
    );

    //  return both channel + updated user
    res.status(201).json({
      message: "Channel created successfully",
      channel: newChannel,
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create channel" });
  }
};

// Get channel by user ID
export const getChannelByUserId = async (req, res) => {
  try {
    const channel = await Channel.findOne({ userId: req.params.userId });
    if (!channel) return res.status(404).json({ message: "Channel not found" });
    res.json(channel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch channel" });
  }
};


// Delete a video from a channel
export const deleteVideoFromChannel = async (req, res) => {
  try {
    const { channelId, videoId } = req.params;

    const channel = await Channel.findById(channelId);
    if (!channel) return res.status(404).json({ message: "Channel not found" });

    // Only channel owner can delete videos
    if (channel.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete video" });
    }

    // Find video index
    const videoIndex = channel.videos.findIndex(
      (video) => video._id.toString() === videoId
    );

    if (videoIndex === -1) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Remove video
    channel.videos.splice(videoIndex, 1);

    await channel.save();

    res.status(200).json({ message: "Video deleted successfully", channel });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete video" });
  }
};

// Update a channel (name, handle, description, avatar, banner)
export const updateChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const { name, handle, description, avatarUrl, bannerUrl } = req.body;

    if (!name || !handle) {
      return res.status(400).json({ message: "Name and handle are required" });
    }

    const channel = await Channel.findById(channelId);
    if (!channel) return res.status(404).json({ message: "Channel not found" });

    // Only channel owner can update
    if (channel.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update channel" });
    }

    // Check if new handle is taken by another channel
    const existingHandle = await Channel.findOne({ handle });
    if (existingHandle && existingHandle._id.toString() !== channelId) {
      return res.status(400).json({ message: "Handle already taken" });
    }

    // Update fields
    channel.name = name;
    channel.handle = handle;
    channel.description = description || "";
    channel.avatarUrl = avatarUrl || channel.avatarUrl;
    channel.bannerUrl = bannerUrl || channel.bannerUrl;

    await channel.save();

    res.status(200).json(channel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update channel" });
  }
};

// Update a video inside a channel
export const updateVideoInChannel = async (req, res) => {
  try {
    const { channelId, videoId } = req.params;
    const { title, description, thumbnailUrl, lengthText } = req.body;

    const channel = await Channel.findById(channelId);
    if (!channel) return res.status(404).json({ message: "Channel not found" });

    // Only channel owner can update
    if (channel.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit video" });
    }

    // Find the video to update
    const video = channel.videos.id(videoId);
    if (!video) return res.status(404).json({ message: "Video not found" });

    // Update fields (only if provided)
    if (title) video.title = title;
    if (description) video.description = description;
    if (thumbnailUrl) video.thumbnailUrl = thumbnailUrl;
    if (lengthText) video.lengthText = lengthText;

    await channel.save();

    res.status(200).json(video); // return the updated video
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update video" });
  }
};
