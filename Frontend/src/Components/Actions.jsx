import React, { useState, useRef, useEffect } from "react";
import { GoDownload } from "react-icons/go";
import { BsThreeDots } from "react-icons/bs";
import { PiShareFat } from "react-icons/pi";
import millify from "millify";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { BiSolidLike, BiSolidDislike } from "react-icons/bi";

function Actions({ video, mode }) {
  const menuRef = useRef(null);
  const [isOpen, setOpen] = useState(false);

  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    setLikes(Number(video?.likeCount) || 0);
  }, [video]);

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikes(likes - 1);
    } else {
      setLiked(true);
      setLikes(likes + 1);
      if (disliked) setDisliked(false);
    }
  };

  const handleDislike = () => {
    if (disliked) {
      setDisliked(false);
    } else {
      setDisliked(true);
      if (liked) {
        setLiked(false);
        setLikes(likes - 1);
      }
    }
  };

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-row gap-2.5 w-full justify-between">
      {/* Left: channel name + subscribe */}
      <div className="flex gap-4 items-center">
        <div className="flex flex-col overflow-hidden w-[10rem]">
          <h1 className="flex flex-row justify-start gap-2 items-center font-bold text-nowrap text-xl">
            <span className="truncate">{video?.channelName}</span>
            {video?.isVerified && <RiVerifiedBadgeFill />}
          </h1>
          {video?.subscriberCount && (
            <span className="text-sm">
              {millify(video?.subscriberCount)} Subscribers
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

      {/* Right: Like, Dislike, Share, Menu */}
      <div className="flex gap-4 items-center">
        <div
          className={`flex items-center px-4 py-1.5 rounded-3xl ${
            mode ? "bg-neutral-600/70" : "bg-neutral-200/50"
          }`}
        >
          <button
            onClick={handleLike}
            className="flex items-center gap-1 cursor-pointer"
          >
            <BiSolidLike className="text-xl" />
            <span className="text-[1rem] font-medium">
              {likes ? millify(likes, { precision: 0 }) : ""}
            </span>
          </button>

          <div
            className={`h-6 mx-2 w-[1px] ${mode ? "bg-white" : "bg-black"}`}
          />

          <button
            onClick={handleDislike}
            className="flex items-center gap-1 cursor-pointer"
          >
            <BiSolidDislike className="text-xl" />
          </button>
        </div>

        {/* Share */}
        <div
          className={`flex gap-1 items-center px-4 py-1.5 rounded-3xl ${
            mode ? "bg-neutral-600/70" : "bg-neutral-200/50"
          }`}
        >
          <PiShareFat className="text-xl cursor-pointer hover:scale-110 transition-transform" />
          <span className="text-[1rem] font-medium">Share</span>
        </div>

        {/* 3 dots menu */}
        <div ref={menuRef}>
          <button
            onClick={() => setOpen(!isOpen)}
            className={`relative px-2 py-2 rounded-full ${
              mode ? "bg-neutral-600/70" : "bg-neutral-200/50"
            }`}
          >
            <BsThreeDots />
            {isOpen && (
              <div
                className={`absolute left-1.5 font-semibold rounded-xl bottom-8.5 flex gap-1 px-3.5 py-2 items-center z-20 ${
                  mode ? "bg-neutral-600/70" : "bg-neutral-400"
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
