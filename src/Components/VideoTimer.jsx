import moment from "moment/moment";
import React from "react";

function VideoTimer({ time }) {
  const timer =
    time >= 3600
      ? moment.utc(time * 1000).format("HH:mm:ss")
      : moment.utc(time * 1000).format("mm:ss");
  return (
    <div className="bg-gray-700/70 bottom-2 text-sm right-8 text-white p-1 rounded-sm px-2 absolute">
      {timer}
    </div>
  );
}

export default VideoTimer;
