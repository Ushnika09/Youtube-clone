import React from "react";
import { Link } from "react-router-dom";
import VideoTimer from "./VideoTimer";

function Videocard({ video }) {
  console.log(video, "card");
  return (
    <Link to={`/video/${video.id}`}>
      <div>
        {/* thumbnail */}
        <div className="relative rounded-lg overflow-hidden">
          <img
            onLoad={(e) => e.currentTarget.classList.remove("opacity-0")}
            className="rounded-lg transition-opacity duration-1200 opacity-0"
            src={video?.thumbnails[0].url}
            alt=""
          />
          {/* timestamp */}
          {video?.lengthSeconds && <VideoTimer time={video?.lengthSeconds} />}
        </div>

        <div className=" flex mt-2.5 justify-start items-center gap-3 ">
          {/* channel logo */}
          <div className=" h-10 w-10 rounded-full shrink-0">
            <img src={video?.author?.avatar[0]?.url} className="rounded-full h-full w-full"  alt=""/>
          </div>
          {/* video name + view */}
          <div className="flex flex-col overflow-hidden">
            <h1 className="line-clamp-2 ">{video?.descriptionSnippet}</h1>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default Videocard;
