import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { GoDotFill } from "react-icons/go";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import VideoTimer from "../Components/VideoTimer";
import ModeContext from "../context/ModeContext";
import axios from "axios";
import { TbLoader } from "react-icons/tb";

function Search() {
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(true);   // 👈 new state
  const { query } = useParams();
  const { mode } = useContext(ModeContext);

  useEffect(() => {
    async function fetchSearchResults() {
      try {
        setLoading(true); // start loading
        let res = await axios.get(`http://localhost:5000/api/videos?query=${query}`);
        let videos = res.data;

        if (!videos || videos.length === 0) {
          console.log(`No search results for "${query}", seeding...`);
          await axios.post(`http://localhost:5000/api/videos/seed?query=${query}`);
          res = await axios.get(`http://localhost:5000/api/videos?query=${query}`);
          videos = res.data;
        }

        setSearchResult(videos);
      } catch (err) {
        console.error("Error fetching search results:", err.message);
        setSearchResult([]);
      } finally {
        setLoading(false); // stop loading
      }
    }
    fetchSearchResults();
  }, [query]);

  //  Show loader
  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center col-span-full">
                      <TbLoader className="text-3xl animate-spin text-green-600" />
                    </div>
    );
  }

  return (
    <div
      className={`flex flex-col px-[8rem] items-center pt-[4rem] gap-3.5 ${
        mode ? "text-white bg-black" : "text-black bg-white"
      }`}
    >
      <h1 className="self-start pl-0 text-2xl font-bold pb-2.5">
        {searchResult?.length} search Results
      </h1>

      <div className="flex flex-col gap-4">
        {searchResult?.map((video) => {
          if (!video.videoId) return null;
          return (
            <Link
              key={video.videoId}
              to={`/video/${video?.videoId}`}
              className="flex justify-center gap-3.5"
            >
              {/* Thumbnail */}
              <div className="relative rounded-lg overflow-hidden w-96 h-50 shrink-0">
                {video?.richThumbnail ? (
                  <img
                    onLoad={(e) => e.currentTarget.classList.remove("opacity-0")}
                    className="rounded-lg w-full h-full transition-opacity duration-1200 opacity-0"
                    src={video.richThumbnail}
                    alt=""
                  />
                ) : (
                  <img
                    onLoad={(e) => e.currentTarget.classList.remove("opacity-0")}
                    className="rounded-lg w-full h-full transition-opacity duration-1200 opacity-0"
                    src={video?.thumbnails?.[0]?.url}
                    alt=""
                  />
                )}
                {video?.lengthText && <VideoTimer time={video?.lengthText} />}
              </div>

              {/* Details */}
              <div
                className={`flex flex-col mt-2.5 justify-start gap-3 flex-1 pr-3.5 ${
                  mode ? "text-white" : "text-black"
                }`}
              >
                <div
                  className={`flex flex-col overflow-hidden text-sm pr-3 ${
                    mode ? "text-white" : "text-black"
                  }`}
                >
                  <h1 className="line-clamp-1 text-2xl font-extrabold">
                    {video?.title}
                  </h1>

                  <div
                    className={`flex gap-1.5 items-center font-medium ${
                      mode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <span>{video.viewCount} views</span>
                    <GoDotFill className="text-[0.5rem]" />
                    <span>{video?.publishedTimeText}</span>
                  </div>

                  <div className="flex gap-2 my-3">
                    <img
                      src={video?.channelAvatar}
                      alt=""
                      className="rounded-full h-8 w-8 shrink-0"
                    />
                    <h1
                      className={`flex flex-row font-medium justify-start gap-2 items-center ${
                        mode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {video?.channelName}
                      {video?.author?.badges?.[0]?.type === "VERIFIED_CHANNEL" && (
                        <RiVerifiedBadgeFill />
                      )}
                    </h1>
                  </div>

                  <h1 className="line-clamp-2">{video?.description}</h1>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Search;
