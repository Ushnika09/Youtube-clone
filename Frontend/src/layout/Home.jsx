import React, { useContext, useEffect, Suspense } from "react";
import { useData } from "../context/DataContext";
import ModeContext from "../context/ModeContext";
import TopSlider from "../Components/TopSlider";
import { TbLoader } from "react-icons/tb";

const Videocard = React.lazy(() => import("../Components/Videocard"));

function Home() {
  const { data, loading } = useData();
  const { mode } = useContext(ModeContext);
  

  return (
    <div className="transition-all duration-300">
      {!loading ? (
        <div className="flex flex-col">
          <TopSlider />
          <Suspense
            fallback={
              <div className="h-60 flex justify-center items-center col-span-full">
                <TbLoader className="text-2xl animate-spin text-green-600" />
              </div>
            }
          >
            <div
              className={`grid pl-10 pt-[2rem] lg:grid-cols-3 md:grid-cols-3 grid-cols-1 gap-x-5 gap-y-7 pr-2 ${
                mode ? "bg-black" : "bg-white"
              }`}
            >
              {data.map((video) => (
                
                <Videocard key={video.videoId} video={video} mode={mode} />
              ))}
            </div>
          </Suspense>
        </div>
      ) : (
        <div
          className={`h-screen flex justify-center items-center ${
            mode ? "bg-black" : "bg-white"
          }`}
        >
          <TbLoader className="text-3xl animate-spin text-green-600" />
        </div>
      )}
    </div>
  );
}

export default Home;
