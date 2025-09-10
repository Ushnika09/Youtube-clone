import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { GoUpload, GoVideo, GoPencil } from "react-icons/go";
import { RiUserFollowLine } from "react-icons/ri";
import ModeContext from "../context/ModeContext";
import UploadVideo from "../Pages/UploadVideo";
import VideoGrid from "../Components/VideoGrid";
import { useParams } from "react-router-dom";
import CustomizeChannel from "../Pages/CustomizeChannel";

function MyChannel() {
  const { id } = useParams();
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const { mode } = useContext(ModeContext);
  const [refreshVideos, setRefreshVideos] = useState(false);

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
      } catch (err) {
        console.error(err);
        setError("Failed to fetch channel");
      } finally {
        setLoading(false);
      }
    };
    fetchChannel();
  }, [id]);

  // Add this useEffect to handle video refresh
  useEffect(() => {
    if (!refreshVideos || !channel?._id) return;

    const fetchVideos = async () => {
      try {
        const token = localStorage.getItem("jwtYT");
        const res = await axios.get(
          `http://localhost:5000/api/channel/${channel._id}/videos`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setChannel((prev) => ({ ...prev, videos: res.data }));
      } catch (err) {
        console.error("Failed to refresh videos", err);
      } finally {
        setRefreshVideos(false); // Reset the refresh flag
      }
    };

    fetchVideos();
  }, [refreshVideos, channel?._id]);

  const handleDeleteVideo = async (videoId) => {
    if (!channel?._id || !videoId) return;
    if (!window.confirm("Are you sure you want to delete this video?")) return;

    try {
      const token = localStorage.getItem("jwtYT");
      await axios.delete(
        `http://localhost:5000/api/channel/${channel._id}/video/${videoId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRefreshVideos(true); // Trigger refresh instead of local state update
    } catch (err) {
      console.error(err);
      alert("Failed to delete video");
    }
  };

  const handleVideoUploaded = (newVideo) => {
    setRefreshVideos(true); // Trigger refresh
  };

  const handleChannelUpdated = (updatedChannel) => {
    setChannel(updatedChannel);
  };

  const handleVideoUpdated = (updatedVideo) => {
    setRefreshVideos(true); // Trigger refresh
  };

  if (loading) {
    return (
      <div className={`min-h-screen pt-20 flex items-center justify-center ${mode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Loading channel...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen pt-20 flex items-center justify-center ${mode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="text-center p-6 bg-red-100 dark:bg-red-900/30 rounded-lg max-w-md">
          <div className="text-red-700 dark:text-red-400 text-lg font-medium mb-2">
            Error Loading Channel
          </div>
          <p className="text-red-600 dark:text-red-300">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!channel) {
    return (
      <div className={`min-h-screen pt-20 flex items-center justify-center ${mode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="text-center p-6 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg max-w-md">
          <div className="text-yellow-700 dark:text-yellow-400 text-lg font-medium mb-2">
            Channel Not Found
          </div>
          <p className="text-yellow-600 dark:text-yellow-300">
            The channel you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${mode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* Fixed Banner */}
      <div className="relative ml-4 w-full h-56 bg-gradient-to-r from-blue-600 to-purple-600 overflow-hidden">
        {channel.bannerUrl ? (
          <img
            src={channel.bannerUrl}
            alt={`${channel.name} banner`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
        )}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Channel Header */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-4 relative">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Avatar  */}
          <div className="relative -mt-20 md:-mt-24">
            <div className="w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white shadow-xl">
              <img
                src={channel.avatarUrl || "https://via.placeholder.com/150"}
                alt={channel.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Channel Info */}
          <div className="flex-1 ">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl md:text-3xl font-bold">{channel.name}</h1>
              <p className={`${mode ? "text-gray-300" : "text-gray-600"}`}>
                {channel.handle}
              </p>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-sm">
                  <GoVideo className="text-blue-500" />
                  <span className="font-medium">
                    {channel.videos?.length || 0} videos
                  </span>
                </div>
              </div>

              <p className={`text-sm md:text-base ${mode ? "text-gray-300" : "text-gray-600"} mt-2`}>
                {channel.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-4">
              <button
                onClick={() => setIsUploadOpen(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-medium transition-all"
              >
                <GoUpload className="text-lg" />
                Upload Video
              </button>

              <button
                onClick={() => setIsCustomizeOpen(true)}
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-5 py-2.5 rounded-full font-medium transition-all"
              >
                <GoPencil className="text-lg" />
                Customize Channel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Videos Section */}
      <div className="max-w-6xl mx-auto px-4 md:px-6  pb-12">
        {/* Videos Section Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex items-center">
            <div className="px-1 py-3 font-medium border-b-2 border-red-600 dark:border-red-400 flex items-center gap-2 text-red-600 dark:text-red-400">
              <GoVideo className="text-lg" />
              <span className="font-semibold">Videos</span>
            </div>
          </div>
        </div>

        {/* Video Grid */}
        {channel.videos && channel.videos.length > 0 ? (
          <VideoGrid
            channel={channel}
            onDeleteVideo={handleDeleteVideo}
            onVideoUpdated={handleVideoUpdated}
            refreshVideos={refreshVideos}
          />
        ) : (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-red-800 rounded-full mb-2">
              <GoVideo className="text-2xl text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-1">No videos yet</h3>
            <p className={`mb-6 max-w-md mx-auto ${mode ? "text-gray-400" : "text-gray-500"}`}>
              Start sharing your videos with the world. Your audience is
              waiting!
            </p>
          </div>
        )}
      </div>

      {/* Upload Video Modal */}
      <UploadVideo
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        channelId={channel._id}
        onVideoUploaded={handleVideoUploaded}
      />

      {/* Customize Channel Modal */}
      <CustomizeChannel
        isOpen={isCustomizeOpen}
        onClose={() => setIsCustomizeOpen(false)}
        channel={channel}
        onChannelUpdated={handleChannelUpdated}
      />
    </div>
  );
}

export default MyChannel;