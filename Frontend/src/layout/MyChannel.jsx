import React, { useContext, useEffect, useState } from "react";
import UserContext from "../context/UserContext";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function MyChannel() {
  const { user } = useContext(UserContext);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChannel = async () => {
      if (!user) return;

      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("jwtYT");
        const res = await axios.get(
          `http://localhost:5000/api/channels/${user._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setChannel(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch channel");
      } finally {
        setLoading(false);
      }
    };

    fetchChannel();
  }, [user]);

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;
    try {
      const token = localStorage.getItem("jwtYT");
      await axios.delete(
        `http://localhost:5000/api/channels/${channel._id}/video/${videoId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setChannel({
        ...channel,
        videos: channel.videos.filter((v) => v._id !== videoId),
      });
    } catch (err) {
      console.error(err);
      alert("Failed to delete video");
    }
  };

  const handleEditVideo = (videoId) => {
    navigate(`/edit-video/${videoId}`);
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 px-4">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        {/* Channel header */}
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-800">
            <img
              src={channel.avatar || "https://via.placeholder.com/150"}
              alt={channel.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {channel.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">@{channel.handle}</p>
            <p className="mt-2 text-gray-700 dark:text-gray-200">
              {channel.description || "No description provided"}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {channel.videos?.length || 0} videos
            </p>
          </div>
        </div>

        {/* Video grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {channel.videos?.map((video) => (
            <div
              key={video._id}
              className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md flex flex-col"
            >
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-2 flex flex-col gap-1">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {video.title}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-300">
                  {video.viewCount} views • {new Date(video.publishedAt).toLocaleDateString()}
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleEditVideo(video._id)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 rounded flex items-center justify-center gap-1"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteVideo(video._id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs py-1 rounded flex items-center justify-center gap-1"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyChannel;
