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
  const [handle, setHandle] = useState(
    user ? `@${user.name.replace(/\s+/g, "")}` : ""
  );
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState(""); //  added banner
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !handle) {
      setError("Name and handle are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("jwtYT");
      const res = await axios.post(
        "http://localhost:5000/api/channel/",
        { name, handle, description, avatarUrl, bannerUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newChannel = res.data;

      // Update user context
      const updatedUser = { ...user, isChannel: true };
      setUser(updatedUser);
      localStorage.setItem("userYT", JSON.stringify(updatedUser));

      // Store channel ID in localStorage for immediate access
      localStorage.setItem("channelIdYT", newChannel._id);

      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create channel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-h-[90vh] overflow-y-auto">
      <div
        className={`w-full max-w-lg rounded-xl shadow-lg p-8 flex flex-col gap-6 ${
          mode ? "bg-[#181818] text-white" : "bg-white text-gray-900"
        }`}
      >
        {/* Banner Preview */}
        <div className="w-full h-40 rounded-lg overflow-hidden mb-4 bg-gray-200 flex items-center justify-center">
          {bannerUrl ? (
            <img
              src={bannerUrl}
              alt="Channel Banner"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-500 text-sm">
              Channel Banner Preview
            </span>
          )}
        </div>
        <input
          type="text"
          placeholder="Paste Banner Image URL"
          value={bannerUrl}
          onChange={(e) => setBannerUrl(e.target.value)}
          className={`w-full px-4 py-2 rounded-md border mb-4 ${
            mode
              ? "bg-[#121212] border-gray-700 text-white"
              : "bg-white border-gray-300 text-black"
          }`}
        />

        {/* Avatar Preview */}
        <div className="flex flex-col items-center gap-2 mb-4">
          <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-5xl text-gray-500">👤</span>
            )}
          </div>
          <input
            type="text"
            placeholder="Paste Avatar Image URL"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            className={`w-full px-4 py-2 rounded-md border ${
              mode
                ? "bg-[#121212] border-gray-700 text-white"
                : "bg-white border-gray-300 text-black"
            }`}
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

          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-4 py-2 rounded-md border ${
                mode
                  ? "bg-[#121212] border-gray-700 text-white"
                  : "bg-white border-gray-300 text-black"
              }`}
            />
          </div>

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
    </div>
  );
}

export default CreateChannel;
