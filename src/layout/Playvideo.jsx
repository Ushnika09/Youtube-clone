import React, { useContext, useEffect, useState } from "react";
import ModeContext from "../context/ModeContext";
import { useParams } from "react-router-dom";
import { FetchData } from "../../utils/Rapidapi";
import Sugesstion from "../Components/Sugesstion";
import VideoSec from "../Components/VideoSec";
import Comments from "../Components/Comments";

function Playvideo() {
  const { mode } = useContext(ModeContext);
  const [video, setVideo] = useState(null);
  
  const { id } = useParams();

  useEffect(() => {
    async function FetchVideoDetails() {
      let data = await FetchData(`video/info?id=${id}`);
      setVideo(data);
      console.log(data,"Playvideo");
    }
    FetchVideoDetails();
  }, [id]);

  return (
    // outermost div
    <div
      className={`pl-10 max-w-screen    mr-0 pt-[3.8rem] flex gap-5 ${
        mode ? "bg-black" : "bg-white"
      }`}
    >{/* necessary style flex-row =>vid+ suggestion */}

      <div className=" flex flex-col w-[700px]">
        <VideoSec id={id} video={video}/>
        <Comments id={id}/>
      </div>
      <Sugesstion id={id}/>
    </div>
  );
}

export default Playvideo;
