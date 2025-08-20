import { FaYoutube, FaSearch, FaUserCircle, FaBars } from "react-icons/fa";

const Header = ({ onMenuClick }) => (
  <header className="flex items-center justify-between px-4 py-2 bg-white shadow">
    <div className="flex items-center gap-3">
      <button
        className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
        onClick={onMenuClick}
        aria-label="Toggle sidebar"
      >
        <FaBars className="text-xl" />
      </button>
      <FaYoutube className="text-red-600 text-2xl" />
      <span className="font-bold text-xl text-gray-800">YouTube</span>
    </div>
    <div className="flex items-center w-1/2 max-w-xl">
      <input
        type="text"
        placeholder="Search"
        className="w-full px-4 py-1 border rounded-l-full focus:outline-none"
      />
      <button className="bg-gray-100 px-4 py-1 rounded-r-full border-l">
        <FaSearch />
      </button>
    </div>
    <FaUserCircle className="text-2xl text-gray-600" />
  </header>
);

export default Header;