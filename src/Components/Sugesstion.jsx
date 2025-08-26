import React, { useContext, useEffect, useState } from 'react'
import { FetchData } from '../../utils/Rapidapi';
import { GoDotFill } from 'react-icons/go';
import millify from 'millify';
import { RiVerifiedBadgeFill } from 'react-icons/ri';
import VideoTimer from './VideoTimer';
import ModeContext from '../context/ModeContext';
import { Link } from 'react-router-dom';


function Sugesstion({id}) {
  const [related, setRelated] = useState([]);
  const {mode}=useContext(ModeContext)
  
  useEffect(()=>{
    async function FetchRelated() {
      try{
        let data=await FetchData(`related?id=${id}`)
        setRelated(data.data)
        console.log(data.data,"rec");
      }catch(err){
        console.log("cant fetch related videos",err);
      }
    }
    FetchRelated()
  },[id])
  return (
    <div className={`flex flex-col  gap-3.5 pr-6 ${mode ? "text-white" : "text-black"}`}>
      {related.map((video)=>{
        return(
          <Link to={`/video/${video?.videoId}`} className='flex  justify-center gap-2.5' >
        {/* thumbnail */}
        <div className="relative rounded-lg  overflow-hidden  h-24 w-50">
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
              src={video?.thumbnail?.[0]?.url}
              alt=""
            />
          )}

          {/* timestamp */}
          {video?.lengthText && <VideoTimer time={video?.lengthText} />}
        </div>

        <div className={`flex flex-col mt-2.5 justify-start gap-3 flex-1 pr-3.5 ${mode ? "text-white" : "text-black"}`}>
          {/* video details */}
          <div className={`flex flex-col overflow-hidden text-gray-600 text-sm pr-3 ${mode ? "text-white" : "text-black"}`}>
            <h1 className="line-clamp-2 font-extrabold">{video?.title}</h1>
            <h1 className={`flex flex-row font-medium justify-start gap-2 items-center  ${mode ? "text-gray-400" : "text-gray-600"}`}>
              {video?.channelTitle}
              {video?.author?.badges?.[0]?.type === "VERIFIED_CHANNEL" && (
                <RiVerifiedBadgeFill />
              )}
            </h1>

            <div className={`flex gap-1.5 text-nowrap items-center font-medium ${mode ? "text-gray-400" : "text-gray-600"}`}>
              <span className='text-nowrap'>{video.viewCountText}</span><GoDotFill className='text-[0.5rem]'/>
              <span className='text-nowrap'>{video?.publishedTimeText}</span>
            </div>
          </div>
        </div>
      </Link>
        )
      })}
    </div>
  )
}

export default Sugesstion