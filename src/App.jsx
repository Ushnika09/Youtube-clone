import { useState,useEffect } from "react";
import "./App.css";
import RootLayout from "./layout/RootLayout";
import ModeContext from "./context/ModeContext";
import { useData } from "./context/DataContext";

function App() {
  const [mode, setMode] = useState(false);
  const {loading,data}=useData()
  console.log(loading);
  console.log(data);

  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      <div className={`flex flex-col h-screen `}>
        <RootLayout />
      </div>
    </ModeContext.Provider>
  );
}

export default App;
