import { Outlet } from "react-router-dom";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import { useState } from "react";


export default function RootLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <div className="app flex flex-col min-h-screen">
      <Header onMenuClick={() => setSidebarOpen((open) => !open)} />
      <div className='flex flex-1'>
        <Sidebar open={sidebarOpen} />
        <main className='flex-1 bg-gray-50 p-4 overflow-auto'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}