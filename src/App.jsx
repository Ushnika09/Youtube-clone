import './App.css'

import React, { useState } from 'react'
import Header from './Components/Header'
import Sidebar from './Components/Sidebar'
import { Outlet } from 'react-router-dom'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className='flex flex-col h-screen'>
      <Header onMenuClick={() => setSidebarOpen((open) => !open)} />
      <div className='flex flex-1'>
        <Sidebar open={sidebarOpen} />
        <main className='flex-1 bg-gray-50 p-4 overflow-auto'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default App