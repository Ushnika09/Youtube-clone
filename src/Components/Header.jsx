import { useContext, useEffect, useState } from "react";
import {
  FaYoutube,
  FaSearch,
  FaUserCircle,
  FaBars,
  FaMicrophone,
} from "react-icons/fa";
import ModeContext from "../context/ModeContext";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { Link } from "react-router-dom";

function Header({ onMenuClick }) {
  const { mode, setMode } = useContext(ModeContext);
  const [status, setStatus] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setStatus(true);
    const handleOffline = () => setStatus(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOffline);
      window.removeEventListener("offline", handleOnline);
    };
  }, []);

  return (
    <div className="fixed top-0 z-10 w-full">
      <header
      className={`flex items-center justify-between gap-1 px-4 py-4 shadow transition-all duration-300  ${
        mode ? "bg-black" : "bg-white"
      }`}
    >
      {/* Left */}
      <div className="flex items-center gap-3 ">
        <button
          className={`p-2 rounded-full ${mode ? "hover:bg-gray-300/50" : "hover:bg-gray-200"} focus:outline-none relative`}
          onClick={onMenuClick}
          aria-label="Toggle sidebar"
        >
          <FaBars
            className={`text-xl hover:cursor-pointer ${
              mode ? " text-white" : "text-black"
            }`}
          />
        </button>
        <Link to={"/"} className="flex gap-1 justify-center items-center relative">
          <FaYoutube className="text-red-600 text-3xl hover:cursor-pointer" />
          <span
            className={`font-bold text-2xl text-gray-800 hover:cursor-pointer tracking-tighter ${
              mode ? " text-white " : "text-black"
            }`}
          >
            YouTube
          </span>
          <div
            className={`h-4 w-4 rounded-full animate-pulse bottom-1/2 -left-0.5 absolute ${
              status ? "bg-green-600" : "bg-orange-700"
            }`}
          ></div>
        </Link>
      </div>

      {/* Middle */}
      <div className="flex items-center w-1/2  max-w-xl">
        <input
          type="text"
          placeholder="Search"
          className={`min-w-[5rem] px-4 py-2 pl-6 border rounded-l-full focus:outline-none flex-1 items-center justify-center ${
            mode ? " bg-gray-50" : "bg-white"
          }`}
        />
        <button className="bg-gray-100 px-4 py-3 border rounded-r-full hover:cursor-pointer">
          <FaSearch className="" />
        </button>

        <button
          className={` mx-2 p-3  rounded-full hover:cursor-pointer ${
            mode ? "bg-gray-300" : "bg-gray-100"
          }`}
        >
          <FaMicrophone />
        </button>
      </div>

      {/* Right */}
      <div>
        <div className="flex  gap-3 shrink-0">
          <button
            className="   hover:cursor-pointer"
            onClick={() => setMode(!mode)}
          >
            {mode ? (
              <MdDarkMode
                className={`text-amber-500 rounded-full text-4xl p-2 shrink-0 ${
                  mode ? "bg-gray-300" : "bg-gray-100"
                }`}
              />
            ) : (
              <MdLightMode
                className={`text-amber-500 rounded-full text-4xl p-2 shrink-0 ${
                  mode ? "bg-gray-300" : "bg-gray-100"
                }`}
              />
            )}
          </button>
          <div className="px-3 py-1.5 rounded-3xl bg-gray-100 flex gap-1 border-gray-400/80 border text-blue-600">
            <FaUserCircle className="text-2xl  hover:cursor-pointer rounded-full" />
            <h1 className="flex text-nowrap hover:cursor-pointer">Sign in</h1>
          </div>
        </div>
      </div>
    </header>
    </div>
  );
}

export default Header;
