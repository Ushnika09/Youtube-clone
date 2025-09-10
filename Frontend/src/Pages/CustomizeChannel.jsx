import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import ModeContext from "../context/ModeContext";

function CustomizeChannel({ isOpen, onClose, channel, onChannelUpdated }) {
  const { mode } = useContext(ModeContext);
  
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Initialize form with channel data
  useEffect(() => {
    if (channel) {
      setName(channel.name || "");
      setHandle(channel.handle || "");
      setAvatarUrl(channel.avatarUrl || "");
      setBannerUrl(channel.bannerUrl || "");
      setDescription(channel.description || "");
    }
  }, [channel]);

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
      const res = await axios.put(
        `http://localhost:5000/api/channel/${channel._id}`,
        { name, handle, description, avatarUrl, bannerUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onChannelUpdated(res.data);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update channel");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] overflow-y-auto w-full max-w-lg">
        <div
          className={`w-full rounded-xl shadow-lg p-8 flex flex-col gap-6 ${
            mode ? "bg-[#181818] text-white" : "bg-white text-gray-900"
          }`}
        >
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Customize Channel</h2>
            <button
              onClick={onClose}
              className={`text-2xl ${mode ? "text-white" : "text-gray-900"} hover:opacity-70`}
            >
              &times;
            </button>
          </div>

          {/* Banner Preview */}
          <div>
            <label className="block text-sm mb-2">Banner Image</label>
            <div className="w-full h-40 rounded-lg overflow-hidden mb-2 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              {bannerUrl ? (
                <img
                  src={bannerUrl}
                  alt="Channel Banner"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-500 text-sm">Channel Banner Preview</span>
              )}
            </div>
            <input
              type="text"
              placeholder="Paste Banner Image URL"
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
              className={`w-full px-4 py-2 rounded-md border ${
                mode
                  ? "bg-[#121212] border-gray-700 text-white"
                  : "bg-white border-gray-300 text-black"
              }`}
            />
          </div>

          {/* Avatar Preview */}
          <div>
            <label className="block text-sm mb-2">Profile Picture</label>
            <div className="flex flex-col items-center gap-2 mb-2">
              <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
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
                rows="3"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-2">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-md font-medium ${
                  mode 
                    ? "bg-gray-700 text-white hover:bg-gray-600" 
                    : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CustomizeChannel;