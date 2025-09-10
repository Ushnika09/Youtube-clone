import React, { useContext } from "react";
import ModeContext from "../context/ModeContext";
import { DataContext } from "../context/DataContext";

function TopSlider() {
  const categories = [
    "React",
    "Trending",
    "Music",
    "Gaming",
    "Movies",
    "Live",
    "News",
    "Sports",
    "Learning",
    "Comedy",
    "India",
    "Drama",
  ];

  const { mode } = useContext(ModeContext);
  const { setVal, val } = useContext(DataContext);

  return (
    <div
      className={`flex gap-3 scroll-smooth transition-all duration-300 overflow-x-auto no-scrollbar pt-[4.5rem] pl-10 ${
        mode ? "bg-black " : "bg-white"
      }`}
    >
      <div className="flex gap-5">
        {categories.map((cat) => {
          return (
            <button
              key={cat}
              onClick={() => setVal(cat.toLowerCase())}
              className={`flex-nowrap rounded-xl px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
                val === cat.toLowerCase()
                  ? mode
                    ? "bg-neutral-100/70 text-black"
                    : "bg-black text-white"
                  : mode
                  ? "text-white bg-gray-500/70"
                  : "text-black bg-gray-300"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default TopSlider;
