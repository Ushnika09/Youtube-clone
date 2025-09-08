import millify from "millify";
import React, { useContext, useState } from "react";
import ModeContext from "../context/ModeContext";

function VideoDescription({ video }) {
  const { mode } = useContext(ModeContext);
  const [expanded, setExpanded] = useState(false);

  if (!video) return null;

  return (
    <div
      className={`${
        mode ? "bg-neutral-600/70" : "bg-neutral-200/50"
      } px-5 py-4 rounded-xl shadow my-2 transition-all duration-300`}
    >
      {/* Views & Published time */}
      <div className="flex gap-5 items-center font-semibold text-xl mb-2">
        <span>{millify(video?.viewCount || 0, { precision: 0 })} views</span>
        <span>{video?.publishedTimeText || "Unknown"}</span>
      </div>

      {/* Description */}
      <h1
        className={`text-[1rem] ${
          mode ? "text-white" : "text-gray-800/70"
        } ${expanded ? "" : "line-clamp-3"}`}
      >
        {video?.description || "No description available."}
      </h1>

      {/* Read More / Show Less */}
      {video?.description?.length > 100 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-blue-600/90 mt-2 hover:underline font-bold transition-all duration-300"
        >
          {expanded ? "Show less" : "...Read more"}
        </button>
      )}
    </div>
  );
}

export default VideoDescription;
