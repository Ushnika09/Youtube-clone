import React from "react";
import YouTube from "react-youtube";
import Details from "./Details";

function VideoSec({ id, video }) {
  const url = video.videoUrl; // MP4 or video URL
  const isVideoUrl = url && url.startsWith("http");

  return (
    <div className="flex flex-col w-full md:w-[700px]">
      <div className="w-full md:w-[700px] h-[200px] sm:h-[300px] md:h-[380px] relative overflow-hidden rounded-lg">
        {isVideoUrl ? (
          <video
            src={url}
            controls
            autoPlay
            loop
            muted
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        ) : (
          <YouTube
            videoId={id}
            opts={{
              height: "100%",
              width: "100%",
              playerVars: {
                autoplay: 1,
                controls: 1,
              },
            }}
            className="absolute top-0 left-0 w-full h-full"
          />
        )}
      </div>
      <Details id={id} video={video} />
    </div>
  );
}

export default VideoSec;
