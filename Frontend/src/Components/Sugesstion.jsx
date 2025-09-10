import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { GoDotFill } from "react-icons/go";
import millify from "millify";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import VideoTimer from "./VideoTimer";
import ModeContext from "../context/ModeContext";
import { Link } from "react-router-dom";

function Sugesstion({query}) {
  const [related, setRelated] = useState([]);
  const { mode } = useContext(ModeContext);

  useEffect(() => {
    async function fetchFromDB() {
      try {
        const res = await axios.get("http://localhost:5000/api/videos/random?random=true");
        setRelated(res.data);
        console.log(res.data, "from DB");
      } catch (err) {
        console.error("cant fetch related videos", err);
      }
    }
    fetchFromDB();
  }, []);

  return (
    <div className={`w-full md:w-auto hidden md:flex flex-col gap-3.5 flex-1 ${mode ? "text-white" : "text-black"}`}>
      {related.map((video) => (
        <Link
          key={video.videoId}
          to={`/video/${video.videoId}`}
          className="flex justify-center gap-2.5"
        >
          {/* thumbnail */}
          <div className="relative rounded-lg overflow-hidden h-20 md:h-24 w-32 md:w-42">
            <img
              onLoad={(e) => e.currentTarget.classList.remove("opacity-0")}
              className="rounded-lg w-full h-full transition-opacity duration-1200 opacity-0"
              src={video.richThumbnail || video.thumbnails?.[0]?.url}
              alt=""
            />
            {video.lengthText && <VideoTimer time={video.lengthText} />}
          </div>

          {/* video details */}
          <div className={`flex flex-col mt-1 md:mt-2.5 justify-start gap-1 md:gap-3 flex-1 pr-2 md:pr-3.5`}>
            <div className={`flex flex-col overflow-hidden text-xs md:text-sm pr-2 md:pr-3`}>
              <h1 className="line-clamp-2 font-extrabold">{video.title}</h1>
              <h1
                className={`flex flex-row font-medium justify-start gap-1 md:gap-2 items-center ${
                  mode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {video.channelName}
                <RiVerifiedBadgeFill className="text-sm md:text-base" />
              </h1>

              <div
                className={`flex gap-1 text-xs md:text-sm text-nowrap items-center font-medium ${
                  mode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <span>{millify(video.viewCount || 0)} views</span>
                <GoDotFill className="text-[0.4rem] md:text-[0.5rem]" />
                <span>{video.publishedTimeText}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default Sugesstion;
