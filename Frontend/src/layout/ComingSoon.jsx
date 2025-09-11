import React, { useContext } from "react";
import { FaYoutube } from "react-icons/fa";
import ModeContext from "../context/ModeContext"

function ComingSoon({ feature }) {
  const {mode}=useContext(ModeContext)
  return (
    <div className={`flex flex-col items-center justify-center h-screen w-full text-center px-4 ${mode ? "bg-black text-white" :"bg-white text-black"}`}>
      <FaYoutube className="text-red-600 text-9xl mb-6 animate-bounce" />
      <h1 className="text-4xl font-bold mb-4">Coming Soon!</h1>
      <p className="text-lg text-gray-500">
        The <span className="font-semibold">{feature}</span> feature is under development.
      </p>
      <p className="text-sm text-gray-400 mt-2">Stay tuned and check back later!</p>
    </div>
  );
}

export default ComingSoon;
