import React, { useState, useContext, useEffect } from "react";
import ModeContext from "../context/ModeContext";
import axios from "axios";

function EditVideo({ isOpen, onClose, video, channelId, onVideoUpdated }) {
  const { mode } = useContext(ModeContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [lengthText, setLengthText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (video) {
      setTitle(video.title || "");
      setDescription(video.description || "");
      setThumbnailUrl(video.thumbnailUrl || "");
      setLengthText(video.lengthText || "");
    }
  }, [video]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      setError("Title is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("jwtYT");
      const res = await axios.put(
        `http://localhost:5000/api/channel/${channelId}/video/${video._id}`,
        { title, description, thumbnailUrl, lengthText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onVideoUpdated(res.data); // update parent state
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update video");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className={`w-full max-w-lg rounded-xl p-6 relative ${
          mode ? "bg-[#181818] text-white" : "bg-white text-gray-900"
        }`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-2xl hover:opacity-70"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-4">Edit Video</h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full px-4 py-2 rounded-md border ${
              mode ? "bg-[#121212] border-gray-700 text-white" : "bg-white border-gray-300 text-black"
            }`}
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            className={`w-full px-4 py-2 rounded-md border ${
              mode ? "bg-[#121212] border-gray-700 text-white" : "bg-white border-gray-300 text-black"
            }`}
          />

          <input
            type="text"
            placeholder="Thumbnail URL"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            className={`w-full px-4 py-2 rounded-md border ${
              mode ? "bg-[#121212] border-gray-700 text-white" : "bg-white border-gray-300 text-black"
            }`}
          />

          <input
            type="text"
            placeholder="Video Duration (e.g. 10:25)"
            value={lengthText}
            onChange={(e) => setLengthText(e.target.value)}
            className={`w-full px-4 py-2 rounded-md border ${
              mode ? "bg-[#121212] border-gray-700 text-white" : "bg-white border-gray-300 text-black"
            }`}
          />

          <div className="flex justify-end gap-4 mt-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-md font-medium ${
                mode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-200 text-gray-900 hover:bg-gray-300"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditVideo;
