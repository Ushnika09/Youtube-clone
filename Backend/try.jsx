// ✅ Get videos 
export const getVideos = async (req, res) => {
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