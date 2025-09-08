import { useContext, useEffect, useState } from "react";
import { FaYoutube, FaSearch, FaUserCircle, FaBars } from "react-icons/fa";
import ModeContext from "../context/ModeContext";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";

function Header({ onMenuClick }) {
  const { mode, setMode } = useContext(ModeContext);
  const [status, setStatus] = useState(navigator.onLine);
  const [query, setQuery] = useState(""); // ✅ controlled input
  const navigate = useNavigate(); // ✅ for navigation
  const { user } = useContext(UserContext);
  const hasChannel = user?.channel?.id; // based on channel created or not
  const [dropdownOpen, setDropdownOpen] = useState(false);



  // ✅ handle search
  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search/${query}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

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

  const handleLogout = () => {
  localStorage.removeItem("jwtYT");
  localStorage.removeItem("userYT");

  window.location.reload("/"); // reload to reset state
};


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
            className={`p-2 rounded-full ${
              mode ? "hover:bg-gray-300/50" : "hover:bg-gray-200"
            } focus:outline-none relative`}
            onClick={onMenuClick}
            aria-label="Toggle sidebar"
          >
            <FaBars
              className={`text-xl hover:cursor-pointer ${
                mode ? " text-white" : "text-black"
              }`}
            />
          </button>
          <Link
            to={"/"}
            className="flex gap-1 justify-center items-center relative"
          >
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
            value={query} // ✅ controlled input
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`min-w-[5rem] px-4 py-2 pl-6 border rounded-l-full focus:outline-none flex-1 items-center justify-center ${
              mode ? " bg-gray-50" : "bg-white"
            }`}
          />
          <button
            onClick={handleSearch}
            className="bg-gray-100 px-4 py-3 border rounded-r-full hover:cursor-pointer"
          >
            <FaSearch className="" />
          </button>
        </div>

        {/* Right */}
        <div>
          <div className="flex  gap-7 shrink-0 items-center">
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


            {/* User icon  */}
            {user ? (
  <div className="relative">
    <div
      className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg hover:cursor-pointer"
      onClick={() => setDropdownOpen(!dropdownOpen)}
    >
      {user.name.charAt(0).toUpperCase()}
    </div>

    {dropdownOpen && (
      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border rounded-lg shadow-lg z-50">
        <Link
          to={hasChannel ? "/my-channel" : "/create-channel"}
          className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => setDropdownOpen(false)}
        >
          {hasChannel ? "Your Channel" : "Create Channel"}
        </Link>
        <button
          className="w-full text-left px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    )}
  </div>
) : (
  <Link
    to={"/login"}
    className=" flex rounded-3xl flex-nowrap items-center gap-1.5 border px-4 py-2.5 text-blue-600 font-semibold border-neutral-300 hover:cursor-pointer"
  >
    <FaUserCircle className="text-2xl hover:cursor-pointer rounded-full" />
    <h1>Sign In</h1>
  </Link>
)}

          </div>
        </div>
      </header>
    </div>
  );
}

export default Header;
