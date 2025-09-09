import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import ModeContext from "../context/ModeContext";
import axios from "axios";

function CreateChannel({ onClose }) {
  const { user, setUser } = useContext(UserContext);
  const { mode } = useContext(ModeContext);
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [handle, setHandle] = useState(user ? `@${user.name.replace(/\s+/g, "")}` : "");
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAvatarChange = (e) => setAvatar(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !handle) {
      setError("Name and handle are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("handle", handle);
      if (avatar) formData.append("avatar", avatar);

      const token = localStorage.getItem("jwtYT");
      const res = await axios.post("http://localhost:5000/api/channel/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setUser({ ...user, isChannel: true });
      navigate("/my-channel");
      onClose(); // ✅ close modal after success
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create channel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`w-full max-w-lg rounded-xl shadow-lg p-8 flex flex-col gap-6 ${
        mode ? "bg-[#181818] text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Avatar */}
      <div className="flex flex-col items-center gap-2">
        <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
          {avatar ? (
            <img
              src={URL.createObjectURL(avatar)}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-5xl text-gray-500">👤</span>
          )}
        </div>
        <label
          htmlFor="avatar"
          className="text-blue-500 font-medium hover:underline cursor-pointer"
        >
          Select picture
        </label>
        <input
          id="avatar"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
        />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div>
          <label className="block text-sm mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-4 py-2 rounded-md border ${
              mode
                ? "bg-[#121212] border-gray-700 text-white"
                : "bg-white border-gray-300 text-black"
            }`}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Handle</label>
          <input
            type="text"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            className={`w-full px-4 py-2 rounded-md border ${
              mode
                ? "bg-[#121212] border-gray-700 text-white"
                : "bg-white border-gray-300 text-black"
            }`}
          />
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-gray-500 leading-snug">
          By clicking Create channel, you agree to{" "}
          <a href="#" className="text-blue-500 hover:underline">
            YouTube’s Terms of Service
          </a>
          . Changes made to your name and profile picture are visible only on
          YouTube and not other Google services.{" "}
          <a href="#" className="text-blue-500 hover:underline">
            Learn more
          </a>
        </p>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="text-blue-500 font-medium hover:underline"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="text-blue-500 font-medium hover:underline disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create channel"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateChannel;
