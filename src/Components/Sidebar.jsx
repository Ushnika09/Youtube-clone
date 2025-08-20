import {
  FaHome,
  FaFire,
  FaHistory,
  FaThumbsUp,
  FaRegCompass,
  FaRegClock,
  FaPlayCircle,
  FaListUl,
  FaUserFriends,
  FaChevronDown,
  FaMusic,
  FaGamepad,
  FaTrophy,
  FaLightbulb,
  FaNewspaper,
  FaFilm,
  FaBroadcastTower,
  FaShoppingBag,
  FaPodcast,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

const mainLinks = [
  { to: "/", label: "Home", icon: <FaHome />, end: true },
  { to: "/explore", label: "Explore", icon: <FaRegCompass /> },
  { to: "/shorts", label: "Shorts", icon: <FaPlayCircle /> },
  { to: "/subscriptions", label: "Subscriptions", icon: <FaUserFriends /> },
];

const libraryLinks = [
  { to: "/library", label: "Library", icon: <FaListUl /> },
  { to: "/history", label: "History", icon: <FaHistory /> },
  { to: "/your-videos", label: "Your Videos", icon: <FaFilm /> },
  { to: "/watch-later", label: "Watch Later", icon: <FaRegClock /> },
  { to: "/liked", label: "Liked Videos", icon: <FaThumbsUp /> },
];

const exploreLinks = [
  { to: "/trending", label: "Trending", icon: <FaFire /> },
  { to: "/music", label: "Music", icon: <FaMusic /> },
  { to: "/gaming", label: "Gaming", icon: <FaGamepad /> },
  { to: "/sports", label: "Sports", icon: <FaTrophy /> },
  { to: "/news", label: "News", icon: <FaNewspaper /> },
  { to: "/live", label: "Live", icon: <FaBroadcastTower /> },
  { to: "/learning", label: "Learning", icon: <FaLightbulb /> },
  { to: "/fashion", label: "Fashion & Beauty", icon: <FaShoppingBag /> },
  { to: "/podcasts", label: "Podcasts", icon: <FaPodcast /> },
];

const SidebarSection = ({ links, open }) => (
  <nav className="flex flex-col gap-1 mb-2">
    {links.map(({ to, label, icon, end }) => (
      <NavLink
        key={to}
        to={to}
        end={end}
        className={({ isActive }) =>
          `flex items-center gap-4 px-5 py-3 rounded-lg text-gray-800 hover:bg-gray-100 transition font-medium ${
            isActive ? "bg-gray-200 font-bold" : ""
          } ${!open ? "justify-center" : ""}`
        }
        title={!open ? label : undefined}
      >
        <span className="text-xl">{icon}</span>
        {open && <span>{label}</span>}
      </NavLink>
    ))}
  </nav>
);

const Sidebar = ({ open }) => (
  <aside
    className={`${
      open ? "w-60" : "w-16"
    } h-screen bg-white border-r shadow-sm flex flex-col py-4 transition-all duration-200 overflow-y-auto`}
  >
    <SidebarSection links={mainLinks} open={open} />
    <hr className="my-2" />
    <SidebarSection links={libraryLinks} open={open} />
    <hr className="my-2" />
    <div className={`${open ? "px-5 mb-1 text-xs text-gray-500" : "hidden"}`}>
      Explore
    </div>
    <SidebarSection links={exploreLinks} open={open} />
    <button
      className={`flex items-center gap-4 px-5 py-3 rounded-lg text-gray-800 hover:bg-gray-100 transition font-medium mt-2 ${
        open ? "" : "justify-center"
      }`}
      tabIndex={0}
    >
      <FaChevronDown className="text-xl" />
      {open && <span>Show more</span>}
    </button>
    <div className={`mt-auto px-5 text-xs text-gray-500 ${open ? "" : "hidden"}`}>
      © {new Date().getFullYear()} YouTube Clone
    </div>
  </aside>
);

export default Sidebar;
