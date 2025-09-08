import React, { useContext } from "react";
import ModeContext from "../context/ModeContext";
import { useData } from "../context/DataContext";
import VideoDescription from "./VideoDescription";
import Actions from "./Actions";
import pic from "../assets/logo.png";

function Details({ id, video }) {
  const { mode } = useContext(ModeContext);
  const { data } = useData();

  // Use passed video first, fallback to backend data
  const matchedVideo = video || data.find((item) => item?.videoId === id);
  const logo = matchedVideo?.channelAvatar || pic;

  if (!matchedVideo) return <div>Video not found</div>;

  return (
    <div
      className={`flex mt-2 justify-start gap-2 px-2 flex-col transition-all duration-300 ${
        mode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* Video title */}
      <h1 className="text-xl font-bold line-clamp-2 mt-2 mb-0">
        {matchedVideo?.title}
      </h1>

      <div className="flex gap-3 items-center my-1.5">
        {/* Channel logo */}
        <div className="h-10 w-10 rounded-full flex">
          <img
            src={logo}
            className="rounded-full h-10 w-10 shrink-0 border"
            alt="Channel Logo"
          />
        </div>

        {/* Actions */}
        <Actions video={matchedVideo} mode={mode} />
      </div>

      {/* Video description */}
      <VideoDescription video={matchedVideo} />
    </div>
  );
}

export default Details;
