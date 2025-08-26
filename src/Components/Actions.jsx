import React, { useContext, useEffect, useRef, useState } from "react";
import { GoDownload, GoThumbsdown, GoThumbsup } from "react-icons/go";
import { BsThreeDots } from "react-icons/bs";
import { PiShareFat } from "react-icons/pi";
import millify from "millify";
import { RiThumbUpFill, RiVerifiedBadgeFill } from "react-icons/ri";

function Actions({ video, matchedVideo, mode }) {
  const menuRef = useRef(null); // reference for menu
  const [isOpen, setOpen] = useState(false); //3 dots

  // ✅ Close menu if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="flex flex-row gap-2.5 w-full justify-between">
      {/* left */}
      <div className="flex gap-9 items-center">
        <div className="flex flex-col  overflow-hidden w-[10rem] ">
          <h1 className="flex flex-row justify-start  gap-2 items-center font-bold   text-nowrap text-xl  ">
            {/* channel name */}
            <span className="truncate">{video?.channelTitle}</span>
            <span>
              {matchedVideo?.video?.author?.badges[0]?.type ===
                "VERIFIED_CHANNEL" && <RiVerifiedBadgeFill />}
            </span>
          </h1>
          {video?.author?.stats?.subscribers && (
            <span className="text-sm">
              {" "}
              {/* In case subscribers */}
              video?.author?.stats?.subscribers Subscribers
            </span>
          )}
        </div>
        <button
          className={`px-4 shadow py-1.5 flex items-center rounded-3xl text-[1rem] font-bold ${
            mode ? "bg-white text-black" : "bg-black text-white"
          }`}
        >
          Subscribe
        </button>
      </div>

      {/* right */}
      <div className=" flex gap-7 items-center ">
        <div
          className={`flex  items-center 
                  px-4 py-1.5 rounded-3xl ${
                    mode ? "bg-neutral-600/70" : "bg-neutral-200/50"
                  }`}
        >
          {/*  Like */}
          <GoThumbsup className="text-xl cursor-pointer hover:scale-110 transition-transform" />
          <span className="text-[1rem] font-medium">
            {video?.likeCount !== undefined
              ? millify(video?.likeCount, { precision: 0 })
              : ""}
          </span>

          {/* Divider */}
          <div
            className={`h-6 mx-2 w-[1px] ${mode ? "bg-white" : "bg-black"}`}
          ></div>

          {/*  Dislike */}
          <GoThumbsdown className="text-xl cursor-pointer hover:scale-110 transition-transform" />
        </div>
        {/* share */}
        <div
          className={`flex gap-1 items-center 
                  px-4 py-1.5 rounded-3xl ${
                    mode ? "bg-neutral-600/70" : "bg-neutral-200/50"
                  }`}
        >
          <PiShareFat className="text-xl cursor-pointer hover:scale-110 transition-transform" />
          <span className="text-[1rem] font-medium ">Share</span>
        </div>
        {/* 3 dots */}
        <div ref={menuRef}>
          <button
            onClick={() => setOpen(!isOpen)}
            className={`relative px-2 py-2 rounded-full ${
              mode ? "bg-neutral-600/70" : "bg-neutral-200/50"
            } `}
          >
            <BsThreeDots />
            {isOpen && (
              <div
                className={`absolute left-1.5 rounded-xl bottom-8.5  flex gap-1 px-3.5 py-2 items-center ${
                  mode ? "bg-neutral-600/70" : "bg-neutral-200/50"
                }`}
              >
                <GoDownload />
                Download
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Actions;
