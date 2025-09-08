import CommentModel from "../Model/CommentSchema.js"

// Create a new comment
export const addComment = async (req, res) => {
  try {
    const { videoId, text } = req.body;
    const userId = req.user._id; 

    if (!text) return res.status(400).json({ message: "Comment cannot be empty" });

    const newComment = await CommentModel.create({ videoId, userId, text });
    res.status(201).json(newComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete comment
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await CommentModel.findById(commentId);

    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (comment.userId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "You can only delete your own comments" });

    await comment.remove();
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// Update comment
export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;

    if (!text) return res.status(400).json({ message: "Comment cannot be empty" });

    const comment = await CommentModel.findById(commentId);

    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (comment.userId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "You can only edit your own comments" });

    comment.text = text;
    await comment.save();

    res.status(200).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



// Get all comments for a video
export const getComments = async (req, res) => {
  try {
    const { videoId } = req.params;

    const comments = await CommentModel.find({ videoId })
      .populate("userId", "name") // so we can show username
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
