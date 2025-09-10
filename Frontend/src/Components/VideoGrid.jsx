import React, { useContext, useState, useEffect } from "react";
import { FaTrash, FaEllipsisV } from "react-icons/fa";
import { GoPencil } from "react-icons/go";
import ModeContext from "../context/ModeContext";
import EditVideo from "../Pages/EditVideo";
import { useNavigate } from "react-router-dom";
import moment from "moment";





function VideoGrid({ channel, onDeleteVideo, onVideoUpdated ,refresh ,setRefresh}) {
  const [activeMenu, setActiveMenu] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { mode } = useContext(ModeContext);
  const navigate = useNavigate();

  const toggleMenu = (videoId) => setActiveMenu(activeMenu === videoId ? null : videoId);

  const openEditModal = (video, e) => {
    e.stopPropagation(); // Prevent card navigation
    setEditingVideo(video);
    setIsEditOpen(true);
    setActiveMenu(null);
  };

  const deleteVideo = (videoId, e) => {
    e.stopPropagation(); // Prevent card navigation
    onDeleteVideo(videoId);
    setActiveMenu(null);
  };

  const closeEditModal = () => {
    setEditingVideo(null);
    setIsEditOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (activeMenu && !e.target.closest('.menu-container')) setActiveMenu(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeMenu,]);



  // Add this useEffect to handle refresh
  useEffect(() => {
    if (refresh) {
      // This will force a re-render when refreshVideos changes
      setActiveMenu(null);
      setEditingVideo(null);
      setIsEditOpen(false);
    }
  }, [refresh]);


  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4.5">
        {channel.videos.map((video) => (
          <div
            key={video._id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col transition-transform hover:scale-[1.02] hover:shadow-lg relative cursor-pointer"
            onClick={() => navigate(`/video/${video._id}`)} // Card navigation
          >
            {/* Thumbnail */}
            <div className="relative">
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-40 object-cover"
              />
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1.5 py-0.5 rounded">
                {video.lengthText}
              </div>
            </div>

            {/* Video info */}
            <div className={`p-3 flex-1 flex flex-col ${mode ? "bg-black/40 text-white" : "bg-neutral-200 text-black"}`}>
              <h2 className="text-sm font-semibold line-clamp-2">{video.title}</h2>

              <div className="flex items-center justify-between mt-2">
                <div className="flex flex-row w-full gap-3.5 text-xs">
                  {video.viewCount? 
                  <p>{video.viewCount} views</p> : <p>0 views</p>}
                  {video.publishedAt? 
                  <p>{moment(video.publishedAt).fromNow()}</p> : <p>Just now</p>}
                </div>

                {/* Three-dot menu */}
                <div className="relative menu-container">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleMenu(video._id); }}
                    className="p-1 rounded-full transition-colors"
                  >
                    <FaEllipsisV className="text-gray-600" />
                  </button>

                  {activeMenu === video._id && (
                    <div className={`absolute right-5 -top-10 mt-2 rounded-md shadow-lg py-1 z-[100] border min-w-[120px] ${mode ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-white"}`}>
                      <button
                        onClick={(e) => openEditModal(video, e)}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-blue-600 dark:text-blue-400"
                      >
                        <GoPencil className="text-xs" /> Edit
                      </button>
                      <button
                        onClick={(e) => deleteVideo(video._id, e)}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                      >
                        <FaTrash className="text-xs" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Video Modal */}
      {isEditOpen && editingVideo && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4">
          <div className={`w-full max-w-lg rounded-xl p-6 relative ${mode ? "bg-[#181818] text-white" : "bg-white text-gray-900"}`}>
            <EditVideo
              isOpen={isEditOpen}
              onClose={closeEditModal}
              video={editingVideo}
              channelId={channel._id}
              onVideoUpdated={(updatedVideo) => {
                onVideoUpdated(updatedVideo);
                closeEditModal();
              }}
            />
            <button
              onClick={closeEditModal}
              className="absolute top-3 right-3 text-2xl hover:opacity-70"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default VideoGrid;
