import React, { useContext, useState } from "react";
import axios from "axios";
import { IoClose } from "react-icons/io5";
import ModeContext from "../context/ModeContext";

function UploadVideo({ isOpen, onClose, channelId, onVideoUploaded }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [lengthText, setLengthText] = useState(""); 
  const [loading, setLoading] = useState(false);
  const { mode } = useContext(ModeContext);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target.id === "overlay") {
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !thumbnailUrl || !videoUrl || !lengthText) {
      alert("Title, thumbnail URL, video URL, and length are required.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("jwtYT");

      const res = await axios.post(
        `http://localhost:5000/api/channel/${channelId}/video`,
        {
          title,
          description,
          thumbnailUrl,
          videoUrl,
          lengthText,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(res.data);
      onVideoUploaded(res.data.globalVideo);
      
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to upload video");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="overlay"
      onClick={handleOverlayClick}
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
    >
      <div
        className={`${
          mode ? "bg-gray-800 text-white" : "bg-white text-black"
        } p-6 rounded-lg shadow-lg w-full max-w-md relative`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className={`absolute top-3 right-3 ${
            mode
              ? "bg-black text-white hover:text-gray-200"
              : "bg-white hover:text-gray-800 text-black"
          }`}
        >
          <IoClose size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-4">Upload Video</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Video Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`p-2 border rounded ${
              mode ? "bg-black text-white" : "bg-white text-black"
            }`}
            required
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`p-2 border rounded ${
              mode ? "bg-black text-white" : "bg-white text-black"
            }`}
            rows="3"
          />

          <input
            type="url"
            placeholder="Thumbnail URL"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            className={`p-2 border rounded ${
              mode ? "bg-black text-white" : "bg-white text-black"
            }`}
            required
          />

          <input
            type="url"
            placeholder="Video URL"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className={`p-2 border rounded ${
              mode ? "bg-black text-white" : "bg-white text-black"
            }`}
            required
          />

          {/* ✅ New field */}
          <input
            type="text"
            placeholder="Video Length (e.g. 10:45)"
            value={lengthText}
            onChange={(e) => setLengthText(e.target.value)}
            className={`p-2 border rounded ${
              mode ? "bg-black text-white" : "bg-white text-black"
            }`}
            required
          />

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 hover:bg-red-800 bg-red-700 text-white rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UploadVideo;
