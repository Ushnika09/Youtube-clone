import React from "react";
import { Link } from "react-router-dom";
import VideoTimer from "./VideoTimer";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import millify from "millify";
import { GoDotFill } from "react-icons/go";

function Videocard({ video }) {
  // console.log(video, "card");
  return (
    <Link to={`/video/${video?.videoId}`}>
      <div>
        {/* thumbnail */}
        <div className="relative rounded-lg  overflow-hidden flex-1">
          {video?.richThumbnail?.[0]?.url ? (
            //movingThumbnails
            <img
              onLoad={(e) => e.currentTarget.classList.remove("opacity-0")}
              className="rounded-lg w-full h-full transition-opacity duration-1200 opacity-0"
              src={video?.richThumbnail[0]?.url}
              alt=""
            />
          ) : (
            //thumbnails
            <img
              onLoad={(e) => e.currentTarget.classList.remove("opacity-0")}
              className="rounded-lg w-full h-full transition-opacity duration-1200 opacity-0 "
              src={video?.thumbnail[0].url}
              alt=""
            />
          )}

          {/* timestamp */}
          {video?.lengthText && <VideoTimer time={video?.lengthText} />}
        </div>

        <div className=" flex mt-2.5 justify-start gap-3 ">
          {/* channel logo */}
          <div className=" h-10 w-10 rounded-full shrink-0">
            <img
              src={video?.channelAvatar[0]?.url}
              className="rounded-full h-full w-full"
              alt=""
            />
          </div>
          {/* video details */}
          <div className="flex flex-col overflow-hidden text-gray-600 text-sm">
            <h1 className="line-clamp-2 font-semibold">{video?.title}</h1>
            <h1 className="flex flex-row justify-start gap-2 items-center ">
              {video?.author?.title}
              {video?.author?.badges[0]?.type === "VERIFIED_CHANNEL" && (
                <RiVerifiedBadgeFill />
              )}
            </h1>
            <div className="flex gap-1.5 items-center">
              <span>{millify(video?.viewCount || 0, { precision: 0 })} views</span><GoDotFill className="text-[0.5rem]"/>
              <span>{video?.publishedTimeText}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default Videocard;
