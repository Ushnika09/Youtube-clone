import React, { useContext } from "react";
import ModeContext from "../context/ModeContext";

function TopSlider() {
  const categories = [
    "All",
    "Trending",
    "Music",
    "Gaming",
    "Movies",
    "Live",
    "News",
    "Sports",
    "Learning",
    "Comedy",
    ,
    "Videoblogging",
    "Entertainment",
    "Education",
    "Classics",
    "Documentary",
    "Drama",
    "Family",
    "Foreign",
    "Horror",
    "Thriller",
    "Shorts",
    "Shows",
    "Trailers",
  ];

  const {mode}=useContext(ModeContext)

  return (
    <div className={`flex gap-3 scroll-smooth transition-all duration-300 overflow-x-auto no-scrollbar pt-[4.5rem] pl-10 ${mode ?"bg-black " :"bg-white"}`}>
      {/* no-scroolbar =>custom */}
      <div className={`  flex gap-5`}>
        {categories.map((cat) => {
            return(
                <h1 key={cat} className={`flex-nowrap rounded-xl px-4 py-1.5  text-sm font-medium  ${mode ?"text-white bg-gray-500/70" :"text-black bg-gray-300"}`}>{cat}</h1>
            )
        
      })}
      </div>
    </div>
  );
}

export default TopSlider;
