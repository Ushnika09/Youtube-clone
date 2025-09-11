import React from "react";
import { Link } from "react-router-dom";
import VideoTimer from "./VideoTimer";
import { GoDotFill } from "react-icons/go";
import millify from "millify";

function Videocard({ video, mode }) {
  return (
    <Link to={`/video/${video?.videoId}`}>
      <div className={`${mode ? "text-white" : "text-black"} flex flex-col`}>
        {/* Thumbnail */}
        <div
          className={`relative rounded-lg overflow-hidden flex-1 bg-neutral-200 ${
            mode ? "text-white" : "text-black"
          }`}
          style={{ paddingTop: "56.25%" }} 
        >
          {video?.richThumbnail || video?.thumbnails?.[0]?.url ? (
            <img
              onLoad={(e) => e.currentTarget.classList.remove("opacity-0")}
              className="absolute top-0 left-0 w-full h-full rounded-lg object-cover transition-opacity duration-700 opacity-100"
              src={video?.richThumbnail || video?.thumbnails?.[0]?.url}
              alt={video?.title}
            />
          ) : (
            // Placeholder div if no image
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-gray-400">
              No Thumbnail
            </div>
          )}

          {/* Timestamp */}
          {video?.lengthText && <VideoTimer time={video?.lengthText} />}
        </div>

        <div className="flex mt-2.5 justify-start gap-3">
          {/* Channel Logo */}
          <div className="h-10 w-10 rounded-full shrink-0 bg-gray-300">
            {video?.channelAvatar ? (
              <img
                src={video?.channelAvatar}
                className="rounded-full h-full w-full"
                alt={video?.channelName}
              />
            ) : (
              <div className="rounded-full h-full w-full bg-gray-400 flex items-center justify-center text-white text-sm">
                ?
              </div>
            )}
          </div>

          {/* Video Details */}
          <div
            className={`flex flex-col overflow-hidden text-gray-600 text-sm ${
              mode ? "text-white" : "text-black"
            }`}
          >
            <h1 className="line-clamp-2 font-semibold">{video?.title || "No Title"}</h1>
            <h1 className="flex flex-row justify-start gap-2 items-center">
              {video?.channelName || "Unknown Channel"}
            </h1>
            <div className="flex gap-1.5 items-center">
              <span>{millify(video?.viewCount || 0, { precision: 0 })} views</span>
              <GoDotFill className="text-[0.5rem]" />
              <span>{video?.publishedTimeText || "Unknown"}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default Videocard;
