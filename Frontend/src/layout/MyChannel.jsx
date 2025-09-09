import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import ModeContext from "../context/ModeContext"
import { GoUpload } from "react-icons/go";

function MyChannel() {
  const { id } = useParams(); 
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const {mode} =useContext(ModeContext)

  useEffect(() => {
    const fetchChannel = async () => {
      if (!id) return;

      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("jwtYT");
        const res = await axios.get(
          `http://localhost:5000/api/channel/user/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setChannel(res.data);
        console.log(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch channel");
      } finally {
        setLoading(false);
      }
    };

    fetchChannel();
  }, [id]); // Depend on id from URL params

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


  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!channel) return <p className="p-4">Channel not found</p>;

  return (
    <div className={`min-h-screen mt-5  pt-20 px-4 ${mode ? "bg-black text-white" : "bg-white text-black"}`}>
      <div className={`max-w-6xl mx-15  flex flex-col gap-6 `}>
        {/* Channel Header */}
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-800">
            <img
              src={channel.avatarUrl || "https://via.placeholder.com/150"}
              alt={channel.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">
              {channel.name}
            </h1>
            <p className="">{channel.handle}</p>
            <p className="mt-2 ">
              {channel.description || "No description provided"}
            </p>
            <p className="mt-1 text-sm t">
              {channel.videos?.length || 0} videos
            </p>
          </div>
        </div>

        {/*  Videos */}
        <div className="border-b border-gray-300 dark:border-gray-700">
          <button className="px-4 py-2 font-medium text-blue-500 border-b-2 border-blue-500">
            Videos
          </button>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {channel.videos?.length > 0 ? (
            channel.videos.map((video) => (
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
                  <h2 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {video.title}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-300">
                    {video.viewCount} views •{" "}
                    {new Date(video.publishedAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleDeleteVideo(video._id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs py-1 rounded flex items-center justify-center gap-1"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-10 col-span-full">
  <h1 className="text-center text-gray-500 dark:text-gray-400 mb-4">
    No videos uploaded yet.
  </h1>
  <button className="flex items-center justify-center gap-1.5 text-blue-500 hover:text-blue-600 font-bold dark:hover:text-blue-300">
    <GoUpload className="text-xl font-bold" />
    <span>Upload videos</span>
  </button>
</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyChannel;