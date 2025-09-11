import axios from "axios";
import dotenv from "dotenv";
import Video from "../Model/VideoModel.js";

dotenv.config();

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = "yt-api.p.rapidapi.com";

//  Get videos filtered by query
export const getVideos = async (req, res) => {
  try {
    const query = req.query.query || "JavaScript";
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
    const query = req.query.query || req.body.query || "JavaScript";
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
    // console.log(searchResp.data.data);
    const items = searchResp.data.data || [];
    if (!items.length) return res.status(404).json({ error: "No videos found from API" });

    //  For each video, fetch detailed info using video/info endpoint
    const detailedVideos = await Promise.all(
      items
        .filter((v) => v.videoId && v.title && v.type=="video")
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
            // console.log("detail",detail.data);

            return {
              videoId: v.videoId,
              title: v.title,
              description: detail.description || v.description ,
              channelId: detail.author?.channelId || v.channelId ,
              channelName: detail.author?.title || v.channelTitle ,
              channelAvatar: detail.author?.avatar?.[0]?.url || v.channelAvatar?.[0]?.url ,
              thumbnails: v.thumbnail || [],
              richThumbnail: v.richThumbnail?.[0]?.url ,
              lengthText: v.lengthText || "0:15",
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

    console.log(` Seeded ${result.upsertedCount} videos for query "${query}"`);
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


// PUT /api/videos/likes/:videoId
export const updateLikes = async (req, res) => {
  try {
    console.log("Update likes called:", {
      videoId: req.params.videoId,
      action: req.body.action,
      userId: req.user?._id
    });

    const { videoId } = req.params;
    const { action } = req.body;

    if (!req.user) {
      console.log("No user found in request");
      return res.status(401).json({ message: "Not authenticated" });
    }

    const video = await Video.findOne({ videoId });
    if (!video) {
      console.log("Video not found:", videoId);
      return res.status(404).json({ error: "Video not found" });
    }

    // Like/Dislike switch logic
    switch (action) {
      case "like":
        if (!video.likedByUser) {
          video.likeCount = (video.likeCount || 0) + 1;
          if (video.dislikedByUser && video.dislikeCount > 0) {
            video.dislikeCount = Math.max(0, video.dislikeCount - 1);
          }
          video.likedByUser = true;
          video.dislikedByUser = false;
        }
        break;

      case "unlike":
        if (video.likedByUser && video.likeCount > 0) {
          video.likeCount = Math.max(0, video.likeCount - 1);
          video.likedByUser = false;
        }
        break;

      case "dislike":
        if (!video.dislikedByUser) {
          video.dislikeCount = (video.dislikeCount || 0) + 1;
          if (video.likedByUser && video.likeCount > 0) {
            video.likeCount = Math.max(0, video.likeCount - 1);
          }
          video.dislikedByUser = true;
          video.likedByUser = false;
        }
        break;

      case "undislike":
        if (video.dislikedByUser && video.dislikeCount > 0) {
          video.dislikeCount = Math.max(0, video.dislikeCount - 1);
          video.dislikedByUser = false;
        }
        break;

      default:
        return res.status(400).json({ message: "Invalid action" });
    }

    await video.save();

    res.json({
      likeCount: video.likeCount,
      dislikeCount: video.dislikeCount,
      likedByUser: video.likedByUser,
      dislikedByUser: video.dislikedByUser
    });

  } catch (error) {
    console.error("Update likes error details:", error);
    res.status(500).json({ 
      error: "Failed to update likes/dislikes",
      details: error.message 
    });
  }
};



//  Get videos 
export const getRandomVideos = async (req, res) => {
  try {
    const query = req.query.query || null ; // optional filter
    const random = req.query.random === "true"; // ?random=true
    let videos;

    if (query) {
      videos = await Video.find({ query });
    } else {
      videos = await Video.find();
    }

    if (!videos.length) {
      return res.status(404).json({ error: "No videos found in DB" });
    }

    // Pick random 12 if requested
    if (random) {
      const limit = parseInt(req.query.limit, 10) || 12;
      // Shuffle array and slice
      videos = videos.sort(() => 0.5 - Math.random()).slice(0, limit);
    }

    res.status(200).json(videos);
  } catch (error) {
    console.error("Failed to fetch videos:", error);
    res.status(500).json({ error: "Failed to fetch videos", details: error.message });
  }
};