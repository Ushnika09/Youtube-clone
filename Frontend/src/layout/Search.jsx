import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { FetchData } from '../../utils/Rapidapi';
import { GoDotFill } from 'react-icons/go';
import { RiVerifiedBadgeFill } from 'react-icons/ri';
import VideoTimer from '../Components/VideoTimer';
import ModeContext from '../context/ModeContext';

function Search() {
  const [searchResult,setSearchResult]=useState()
  const {query}=useParams()
  const {mode}=useContext(ModeContext)
  console.log(query);


  useEffect(() => {
      async function FetchSearchDetails() {
        let data = await FetchData(`search?query=${query}`);
        setSearchResult(data.data);
        console.log(data.data,"Search");
      }
      FetchSearchDetails();
    }, [query]);


  return (
    <div className={`flex flex-col px-[8rem] items-center pt-[4rem] gap-3.5 ${mode ? "text-white bg-black" : "text-black bg-white"}`}>
      <h1 className='self-start pl-0 text-2xl font-bold pb-2.5'>{searchResult?.length} search Results</h1>
      <div className='flex flex-col gap-4'>
        {searchResult?.map((video)=>{
        if(video.type!=="video") return
        return(
          <Link to={`/video/${video?.videoId}`} className='flex   justify-center gap-3.5' >
        {/* thumbnail */}
        <div className="relative rounded-lg  overflow-hidden  w-96 h-50 shrink-0">
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
            <h1 className="line-clamp-1 text-2xl font-extrabold">{video?.title}</h1>
            

            <div className={`flex gap-1.5 text-nowrap items-center font-medium ${mode ? "text-gray-400" : "text-gray-600"}`}>
              <span className='text-nowrap'>{video.viewCountText}</span><GoDotFill className='text-[0.5rem]'/>
              <span className='text-nowrap'>{video?.publishedTimeText}</span>
            </div>

            <div className='flex gap-2 my-3'>
              <img src={video?.channelThumbnail?.[0]?.url} alt="" className='rounded-full h-8 w-8 shrink-0'/>
              <h1 className={`flex flex-row font-medium justify-start gap-2 items-center  ${mode ? "text-gray-400" : "text-gray-600"}`}>
              {video?.channelTitle}
              {video?.author?.badges?.[0]?.type === "VERIFIED_CHANNEL" && (
                <RiVerifiedBadgeFill />
              )}
            </h1>
            </div>

            <h1>{video?.description}</h1>
          </div>
        </div>
      </Link>
        )
      })}
      </div>
    </div>
  )
}

export default Search