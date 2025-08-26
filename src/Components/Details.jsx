import millify from "millify";
import React, { useContext, useEffect, useRef, useState } from "react";
import ModeContext from "../context/ModeContext";
import { useData } from "../context/DataContext";
import VideoDescription from "./VideoDescription";
import Actions from "./Actions";
import pic from "../assets/logo.png"

function Details({ id, video }) {
  const { mode } = useContext(ModeContext);
  const { data } = useData();
  console.log(data,"data details");

  const matchedVideo = data.find((item) => item?.videoId === id);
  const logo = matchedVideo?.channelAvatar[0].url 
  console.log(video,"mv");



  return (
    <div
      className={`flex mt-2 justify-start gap-1 px-2 flex-col transition-all duration-300 ${
        mode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* video title */}
      <h1 className="text-2xl font-bold text-wrap line-clamp-1  mb-0">
        {video?.title}
      </h1>

      <div className="flex gap-3 items-center mt-0.5">
        {/* channel logo + name + subscribe */}
        <div className=" h-12 w-12 rounded-full flex ">
          {/* channel logo */}
          <img src={logo || pic} className="rounded-full h-12 w-12 shrink-0 border" />
        </div>

        {/* Actions */}
        <Actions video={video} matchedVideo={matchedVideo} mode={mode} />
      </div>
      {/* video description */}
      <VideoDescription video={video} matchedVideo={matchedVideo} />
    </div>
  );
}

export default Details;
