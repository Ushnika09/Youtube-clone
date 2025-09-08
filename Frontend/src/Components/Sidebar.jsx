import React, { useContext } from "react";
import { FaHistory, FaHome } from "react-icons/fa";
import { SiYoutubeshorts } from "react-icons/si";
import {
  MdOutlineSubscriptions,
  MdPlaylistPlay,
  MdOutlineWatchLater,
  MdOutlineThumbUp,
  MdOutlineFileDownload,
} from "react-icons/md";
import { NavLink } from "react-router-dom";
import ModeContext from "../context/ModeContext";

function Sidebar({ open }) {
  const { mode } = useContext(ModeContext);

  const menuItems = [
    { name: "Home", icon: <FaHome />, path: "/" },
    { name: "Shorts", icon: <SiYoutubeshorts />, path: "/shorts" },
    { name: "Subscriptions", icon: <MdOutlineSubscriptions />, path: "/subscriptions" },
    { name: "History", icon: <FaHistory />, path: "/history" },
    { name: "Downloads", icon: <MdOutlineFileDownload />, path: "/downloads" },
    { name: "Playlists", icon: <MdPlaylistPlay />, path: "/playlists" },
    { name: "Watch Later", icon: <MdOutlineWatchLater />, path: "/watchlater" },
    { name: "Liked Videos", icon: <MdOutlineThumbUp />, path: "/liked" },
  ];

  const visibleItems = open ? menuItems : menuItems.slice(0, 5);

  return (
    <div
      className={`h-screen fixed top-[4.88rem] shadow-md left-0 z-10 ${
        mode ? "bg-black text-white" : "bg-white"
      } transition-all  duration-300 ${open ? "w-54 " : "w-20"}`}
    >
      <nav className="flex flex-col ">
        {visibleItems.map((item, index) => (
          <React.Fragment key={item.name}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3  duration-300 transition-colors ${
                  isActive
                    ? mode
                      ? "bg-gray-100/50"
                      : "bg-gray-400/70"
                    : mode
                    ? "hover:bg-gray-200/30"
                    : "hover:bg-gray-400/30"
                }`
              }
            >
              {open ? (
                <>
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm">{item.name}</span>
                </>
              ) : (
                <div className="flex flex-col justify-center items-center w-full">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-[0.7rem]">{item.name}</span>
                </div>
              )}
            </NavLink>

            {/* ✅ Separator after the 3rd item (Subscriptions) */}
            {open && index === 2 && (
              <hr
                className={`my-2 border-t ${
                  mode ? "border-gray-700" : "border-gray-300"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;
