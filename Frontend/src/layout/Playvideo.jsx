import React, { useContext, useEffect, useState } from "react";
import ModeContext from "../context/ModeContext";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sugesstion from "../Components/Sugesstion";
import VideoSec from "../Components/VideoSec";
import Comments from "../Components/Comments";

function Playvideo() {
  const { mode } = useContext(ModeContext);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    async function fetchVideoFromBackend() {
      try {
        setLoading(true);
        // Fetch video by ID from backend
        const res = await axios.get(`http://localhost:5000/api/videos/${id}`);
        setVideo(res.data);
        console.log(res.data, "Playvideo backend");
      } catch (err) {
        console.error("Video not found:", err.message);
        setVideo(null);
      } finally {
        setLoading(false);
      }
    }

    fetchVideoFromBackend();
  }, [id]);

  if (loading)
    return (
      <div
        className={`${mode ? "bg-black text-white" : "bg-white text-black"} h-screen flex items-center justify-center`}
      >
        Loading...
      </div>
    );

  if (!video)
    return (
      <div
        className={`${mode ? "bg-black text-white" : "bg-white text-black"} h-screen flex items-center justify-center`}
      >
        Video not found
      </div>
    );

  return (
    <div className={`pl-2 md:pl-10 max-w-screen  pt-[3.8rem] flex md:flex-row flex-col gap-5 ${mode ? "bg-black" : "bg-white"}`}>
      <div className="flex flex-col w-full md:w-[700px]">
        <VideoSec video={video} id={id}/>
        <Comments id={id} />
      </div>
      <Sugesstion id={id} query={video.query}/>
    </div>
  );
}

export default Playvideo;
