import Channel from "../Model/ChannelSchema.js";
import User from "../Model/UserModel.js";
import mongoose from "mongoose";

// Create a new channel
export const createChannel = async (req, res) => {
  try {
    const { name, handle, description, avatarUrl } = req.body;

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

    res.status(201).json(newChannel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create channel" });
  }
};

// Get single channel by id
export const getChannelById = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id).populate("userId", "name username");
    if (!channel) return res.status(404).json({ message: "Channel not found" });
    res.json(channel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch channel" });
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

// Add a video to a channel
export const addVideoToChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const { title, description, videoUrl, thumbnailUrl, lengthText } = req.body;

    const channel = await Channel.findById(channelId);
    if (!channel) return res.status(404).json({ message: "Channel not found" });

    // Only channel owner can add videos
    if (channel.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const newVideo = {
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

    channel.videos.push(newVideo);
    await channel.save();

    res.status(201).json(channel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add video" });
  }
};

// Get all channels
export const getAllChannels = async (req, res) => {
  try {
    const channels = await Channel.find().populate("userId", "name username");
    res.json(channels);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch channels" });
  }
};