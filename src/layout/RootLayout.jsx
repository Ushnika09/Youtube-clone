import { Outlet } from "react-router-dom";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import { useContext, useState } from "react";
import ModeContext from '../context/ModeContext'


export default function RootLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const {mode}=useContext(ModeContext)
  return (
    <div className={` flex flex-col min-h-screen`}>
      <Header onMenuClick={() => setSidebarOpen((open) => !open)} />
      <div className='flex flex-1'>
        <Sidebar open={sidebarOpen} />
        <main className={`flex-1 bg-gray-50  overflow-auto ml-16 mt-[2.1rem]  ${mode ? "bg-black": "bg-white"}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}