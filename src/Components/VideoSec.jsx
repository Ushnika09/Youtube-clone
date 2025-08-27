import millify from "millify";
import React, { useContext } from "react";

import YouTube from "react-youtube";
import ModeContext from "../context/ModeContext";
import { useData } from "../context/DataContext";
import Details from "./Details";

function VideoSec({ id, video }) {


  return (
    <div className="flex flex-col w-[700px]">
      <div className="w-[700px] h-[380px] relative overflow-hidden rounded-lg">
        <YouTube
          className="absolute top-0 left-0 w-full h-full"
          videoId={id}
          opts={{
            height: "100%",
            width: "100%",
            playerVars: {
              autoplay: 1, // no autoplay
              controls: 1, // show controls
            },
          }}
          onReady={(e) => e.target.pauseVideo()}
        />
      </div>
      <Details id={id} video={video} />
    </div>
  );
}

export default VideoSec;
