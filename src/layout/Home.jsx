import React, { useContext, useEffect } from "react";
import Videocard from "../Components/Videocard";
import { useData } from "../context/DataContext";
import ModeContext from "../context/ModeContext";
import TopSlider from "../Components/TopSlider";

function Home() {
  const { data, loading } = useData();
  const { mode } = useContext(ModeContext);
  console.log(data,"home");

  useEffect(() => {
    setTimeout(() => {}, 3000);
  }, [loading]);
  return (
    <div className="transition-all duration-300 ">
      {!loading ? (
        <div className="flex flex-col">
          <TopSlider />
          <div
            className={`grid pl-10 pt-[2rem] lg:grid-cols-3 md:grid-cols-3 grid-cols-1 gap-x-5 gap-y-7 pr-2   ${
              mode ? "bg-black" : "bg-white"
            }`}
          >
            {data
              .filter((item) => item.type == "video")
              .map((item, ind) => {
                return <Videocard key={ind} video={item} />;
              })}
          </div>
        </div>
      ) : (
        <div
          className={`h-screen flex justify-center items-center  ${
            mode ? "bg-black" : "bg-white"
          }`}
        >
          <h1 className="text-2xl font-semibold text-green-700">
            Loading videos
          </h1>
        </div>
      )}
    </div>
  );
}

export default Home;
