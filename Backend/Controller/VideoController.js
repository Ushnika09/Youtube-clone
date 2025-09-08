import axios from "axios";
import dotenv from "dotenv";
import Video from "../Model/VideoModel.js";

dotenv.config();

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = "yt-api.p.rapidapi.com";

// ✅ Get videos filtered by query
export const getVideos = async (req, res) => {
  try {
    const query = req.query.query || "New";
    const videos = await Video.find({ query });
    res.json(videos);
  } catch (error) {
    console.error("Failed to fetch videos:", error.message);
    res.status(500).json({ error: "Failed to fetch videos" });
  }
};

// Seed videos safely, including detailed info
export const seedVideos = async (req, res) => {
  try {
    const query = req.query.query || req.body.query || "New";
    console.log("Seeding videos for query:", query);

    //  Fetch search results
    const searchResp = await axios.get(
      `https://${RAPIDAPI_HOST}/search?query=${query}`,
      {
        headers: {
          "x-rapidapi-key": RAPIDAPI_KEY,
          "x-rapidapi-host": RAPIDAPI_HOST,
        },
      }
    );

    const items = searchResp.data.data || [];
    if (!items.length) return res.status(404).json({ error: "No videos found from API" });

    //  For each video, fetch detailed info using video/info endpoint
    const detailedVideos = await Promise.all(
      items
        .filter((v) => v.videoId && v.title)
        .map(async (v) => {
          try {
            const detailResp = await axios.get(
              `https://${RAPIDAPI_HOST}/video/info?id=${v.videoId}`,
              {
                headers: {
                  "x-rapidapi-key": RAPIDAPI_KEY,
                  "x-rapidapi-host": RAPIDAPI_HOST,
                },
              }
            );

            const detail = detailResp.data || {};

            return {
              videoId: v.videoId,
              title: v.title,
              description: detail.description || v.description || "",
              channelId: detail.author?.channelId || v.channelId || "",
              channelName: detail.author?.title || v.channelTitle || "",
              channelAvatar: detail.author?.avatar?.[0]?.url || v.channelAvatar?.[0]?.url || "",
              thumbnails: v.thumbnail || [],
              richThumbnail: v.richThumbnail?.[0]?.url || "",
              lengthText: v.lengthText || "",
              viewCount: detail.viewCount || v.viewCount || 0,
              likeCount: detail.likeCount || 0,
              publishedTimeText: v.publishedTimeText || "",
              query,
            };
          } catch (err) {
            console.error(`Failed fetching details for videoId ${v.videoId}`, err.message);
            return null; // skip this video if error occurs
          }
        })
    );

    const videosToInsert = detailedVideos.filter(Boolean);

    if (!videosToInsert.length)
      return res.status(404).json({ error: "No valid videos to insert after details fetch" });

    // Insert or skip duplicates using bulkWrite
    const bulkOps = videosToInsert.map((video) => ({
      updateOne: {
        filter: { videoId: video.videoId },
        update: { $setOnInsert: video },
        upsert: true,
      },
    }));

    const result = await Video.bulkWrite(bulkOps);

    console.log(`✅ Seeded ${result.upsertedCount} videos for query "${query}"`);
    res.status(201).json({
      message: `Videos for '${query}' seeded successfully`,
      insertedCount: result.upsertedCount,
    });
  } catch (error) {
    console.error("Seeding failed:", error);
    res.status(500).json({ error: "Failed to seed videos", details: error.message });
  }
};


// GET single video by videoId
export const getVideoById = async (req, res) => {
  try {
    const { id } = req.params; // videoId from URL
    const video = await Video.findOne({ videoId: id });

    if (!video) return res.status(404).json({ error: "Video not found" });

    res.json(video);
  } catch (error) {
    console.error("Failed to fetch video:", error.message);
    res.status(500).json({ error: "Failed to fetch video" });
  }
};

// PATCH /likes/:videoId
export const updateLikes = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { action } = req.body; // 'like' | 'unlike' | 'dislike' | 'undislike'

    const video = await Video.findOne({ videoId });
    if (!video) return res.status(404).json({ error: "Video not found" });

    switch (action) {
      case "like":
        video.likeCount = (video.likeCount || 0) + 1;
        if (video.dislikeCount > 0) video.dislikeCount -= 1;
        break;
      case "unlike":
        video.likeCount = Math.max((video.likeCount || 0) - 1, 0);
        break;
      case "dislike":
        video.dislikeCount = (video.dislikeCount || 0) + 1;
        if (video.likeCount > 0) video.likeCount -= 1;
        break;
      case "undislike":
        video.dislikeCount = Math.max((video.dislikeCount || 0) - 1, 0);
        break;
    }

    await video.save();
    res.json({ likeCount: video.likeCount, dislikeCount: video.dislikeCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update likes/dislikes" });
  }
};

