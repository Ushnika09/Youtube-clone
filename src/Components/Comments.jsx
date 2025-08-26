import React, { useContext, useEffect, useState } from "react";
import { FetchData } from "../../utils/Rapidapi";
import { GoThumbsdown, GoThumbsup } from "react-icons/go";
import { PiThumbsDown, PiThumbsUpFill } from "react-icons/pi";
import ModeContext from "../context/ModeContext";

function Comments({ id }) {
  const [Comments, setComments] = useState([]);
  const {mode}=useContext(ModeContext)

  useEffect(() => {
    async function FetchComments() {
      try {
        let data = await FetchData(`comments?id=${id}`);
        setComments(data);
        console.log(data.data, "Comments");
      } catch (err) {
        console.log("cant fetch related videos", err);
      }
    }
    FetchComments();
  }, [id]);
  return (
    <div>
      <h1 className="font-bold text-2xl pl-3 py-3">
        {Comments?.commentsCount} Comments
      </h1>
      <div className="space-y-4">
        {Comments?.data?.map((comment) => (
          <div key={comment.commentId} className={`flex gap-3 ${mode?"text-white":"text-black"}`}>
            {/* Avatar */}
            <img
              src={comment?.authorThumbnail[0].url}
              className="w-10 h-10 rounded-full"
            />

            {/* Comment body */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-medium ">{comment.authorText}</span>
                <span className="text-sm ">
                  {comment.publishedTimeText}
                </span>
              </div>
              <p className="text-sm ">{comment.textDisplay}</p>
              <div className="flex flex-row gap-1 mt-1 text-sm text-gray-500 items-center">
                <PiThumbsUpFill className={`text-xl ${mode?"text-white":"text-black"}`}/>
                <span className={`pr-1.5 ${mode?"text-white":"text-black"}`}> {comment.likesCount || 0} </span>
                <PiThumbsDown className={`text-xl ${mode?"text-white":"text-black"}`}/>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Comments;
