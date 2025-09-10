import React, { useState, useEffect, useContext } from "react";
import { FetchData } from "../../utils/Rapidapi";
import ModeContext from "../context/ModeContext";
import UserContext from "../context/UserContext";
import { PiThumbsDown, PiThumbsUpFill } from "react-icons/pi";
import { BsThreeDotsVertical } from "react-icons/bs";
import moment from "moment";

export default function Comments({ id }) {
  const { mode } = useContext(ModeContext);
  const { user } = useContext(UserContext);

  const [rapidComments, setRapidComments] = useState([]);
  const [userComments, setUserComments] = useState([]);
  const [allComments, setAllComments] = useState([]);

  const [newComment, setNewComment] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [menuOpenId, setMenuOpenId] = useState(null);

  const token = localStorage.getItem("jwtYT");

  // Fetch RapidAPI comments
  useEffect(() => {
    async function fetchRapid() {
      try {
        const data = await FetchData(`comments?id=${id}`);
        setRapidComments(data?.data || []);
      } catch (err) {
        console.log("Error fetching RapidAPI comments", err);
      }
    }
    fetchRapid();
  }, [id]);

  // Fetch user comments from backend
  useEffect(() => {
    async function fetchUserComments() {
      try {
        const res = await fetch(`http://localhost:5000/api/comments/${id}`);
        const data = await res.json();
        setUserComments(data);
      } catch (err) {
        console.log("Error fetching user comments", err);
      }
    }
    fetchUserComments();
  }, [id, user]);

  // Merge both comments
  useEffect(() => {
    const merged = [
      ...userComments.map((c) => ({
        _id: c._id,
        type: "user",
        name: c.userId?.name || "User",
        avatar: c.userId?.name ? c.userId.name[0].toUpperCase() : "U",
        text: c.text,
        createdAt: c.createdAt,
        likes: c.likes || 0,
        userAction: null, // NEW: track per-user like/dislike
      })),
      ...rapidComments.map((c) => ({
        _id: c.commentId,
        type: "rapid",
        name: c.authorText,
        avatar: c.authorText ? c.authorText[0].toUpperCase() : "R",
        text: c.textDisplay,
        createdAt: c.publishedTimeText,
        likes: c.likesCount || 0,
        thumbnail: c?.authorThumbnail?.[0]?.url,
        userAction: null, // NEW
      })),
    ];
    setAllComments(merged);
  }, [userComments, rapidComments]);

  // Add comment
  const handleAdd = async () => {
    if (!newComment.trim()) return;
    if (!user) {
      alert("Login to comment");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ videoId: id, text: newComment }),
      });
      const data = await res.json();
      setUserComments([data, ...userComments]);
      setNewComment("");
    } catch (err) {
      console.log("Add comment error:", err);
    }
  };

  // Update comment
  const handleUpdate = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/comments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: editText }),
      });
      const updated = await res.json();
      setUserComments(userComments.map((c) => (c._id === id ? updated : c)));
      setEditId(null);
      setEditText("");
    } catch (err) {
      console.log("Update comment error:", err);
    }
  };

  // Delete comment
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/comments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserComments(userComments.filter((c) => c._id !== id));
    } catch (err) {
      console.log("Delete comment error:", err);
    }
  };

  // Like & Dislike (frontend only for now)
  //  Like handler
  const handleLike = async (commentId, type) => {
    setAllComments((prev) =>
      prev.map((c) => {
        if (c._id !== commentId) return c;

        let newLikes = c.likes;
        let newAction = c.userAction;

        if (c.userAction === "like") {
          // 🔄 Undo like
          newLikes = Math.max(c.likes - 1, 0);
          newAction = null;
        } else if (c.userAction === "dislike") {
          // 🔄 Switch dislike → like
          newLikes = c.likes + 1;
          newAction = "like";
        } else {
          // ✅ First like
          newLikes = c.likes + 1;
          newAction = "like";
        }

        return { ...c, likes: newLikes, userAction: newAction };
      })
    );

    if (type === "user") {
      try {
        await fetch(`http://localhost:5000/api/comments/${commentId}/like`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.log("Backend like error:", err);
      }
    }
  };

  //  Dislike handler
  const handleDislike = async (commentId, type) => {
    setAllComments((prev) =>
      prev.map((c) => {
        if (c._id !== commentId) return c;

        let newLikes = c.likes;
        let newAction = c.userAction;

        if (c.userAction === "dislike") {
          //  Undo dislike
          newAction = null;
        } else if (c.userAction === "like") {
          //  Switch like → dislike
          newLikes = Math.max(c.likes - 1, 0);
          newAction = "dislike";
        } else {
          //  First dislike
          newAction = "dislike";
        }

        return { ...c, likes: newLikes, userAction: newAction };
      })
    );

    if (type === "user") {
      try {
        await fetch(`http://localhost:5000/api/comments/${commentId}/dislike`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.log("Backend dislike error:", err);
      }
    }
  };

  return (
    <div className={`${mode ? "text-white" : "text-black"} mt-2.5`}>
      <h1 className="font-bold text-xl md:text-2xl pl-2 md:pl-3 py-2 md:py-3">
        {allComments.length} Comments
      </h1>

      {/* Add Comment Box */}
      <div className="flex gap-2 md:gap-3 items-center mb-4 md:mb-6 px-2 md:px-3">
        {/* Avatar */}
        {user ? (
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm md:text-base">
            {user?.name?.[0]?.toUpperCase()}
          </div>
        ) : (
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold text-sm md:text-base">
            U
          </div>
        )}

        <input
          type="text"
          placeholder={user ? "Add a comment..." : "Login to comment"}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={!user}
          className={`flex-1 px-3 md:px-4 py-1.5 md:py-2 border rounded-lg text-sm md:text-base ${
            mode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
          }`}
        />
        <button
          onClick={handleAdd}
          disabled={!user}
          className="px-3 md:px-4 py-1.5 md:py-2 bg-blue-600 text-white rounded-lg text-sm md:text-base"
        >
          Comment
        </button>
      </div>

      {/* Comments List */}
      <div className="space-y-4 mt-4">
        {allComments.map((c) => (
          <div key={c._id} className="flex gap-2 md:gap-3 px-2 md:px-3 relative my-2 md:my-3">
            {/* Avatar */}
            {c.thumbnail ? (
              <img src={c.thumbnail} className="w-8 h-8 md:w-10 md:h-10 rounded-full" />
            ) : (
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm md:text-base">
                {c.avatar}
              </div>
            )}

            {/* Body */}
            <div className="flex flex-col flex-1">
              <div className="flex items-center gap-1 md:gap-2">
                <span className="font-medium text-sm md:text-base">{c.name}</span>
                <span className="text-xs md:text-sm text-gray-500">
                  {c.type === "user"
                    ? moment(c.createdAt).fromNow()
                    : c.createdAt}
                </span>
              </div>

              {/* If editing */}
              {editId === c._id ? (
                <>
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="px-2 py-1 border rounded flex-1 text-sm md:text-base"
                  />
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={() => handleUpdate(c._id)}
                      className="px-2 py-1 bg-green-600 text-white rounded text-sm md:text-base"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="px-2 py-1 bg-gray-400 text-white rounded text-sm md:text-base"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-xs md:text-sm">{c.text}</p>
              )}

              {/* Edit/Delete menu for user comments */}
              {c.type === "user" && c.name === user?.name && (
                <div className="absolute right-3 md:right-5 top-1 md:top-2">
                  <BsThreeDotsVertical
                    className="cursor-pointer text-sm md:text-base"
                    onClick={() =>
                      setMenuOpenId(menuOpenId === c._id ? null : c._id)
                    }
                  />
                  {menuOpenId === c._id && (
                    <div
                      className={`absolute right-3 md:right-5 top-0 mb-1 w-24 md:w-28 rounded-lg shadow-md z-10 ${
                        mode ? "bg-gray-800 text-white" : "bg-white text-black"
                      }`}
                    >
                      <button
                        onClick={() => {
                          setEditId(c._id);
                          setEditText(c.text);
                          setMenuOpenId(null);
                        }}
                        className="block w-full text-left px-2 md:px-3 py-1.5 md:py-2 hover:bg-gray-200 text-xs md:text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          handleDelete(c._id);
                          setMenuOpenId(null);
                        }}
                        className="block w-full text-left px-2 md:px-3 py-1.5 md:py-2 hover:bg-gray-200 text-red-600 text-xs md:text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Like/Dislike for all comments */}
              <div className="flex gap-1 md:gap-2 text-xs md:text-sm mt-1 items-center">
                <PiThumbsUpFill
                  onClick={() => handleLike(c._id, c.type)}
                  className={`text-lg md:text-xl cursor-pointer ${
                    c.userAction === "like"
                      ? "text-blue-500"
                      : mode
                      ? "text-white"
                      : "text-black"
                  }`}
                />
                <span>{c.likes || 0}</span>
                <PiThumbsDown
                  onClick={() => handleDislike(c._id, c.type)}
                  className={`text-lg md:text-xl cursor-pointer ${
                    c.userAction === "dislike"
                      ? "text-blue-500"
                      : mode
                      ? "text-white"
                      : "text-black"
                  }`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
