// @ts-nocheck

import React from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { toggleSidebar } from '../features/sidebar/sidebarSlice';
import LeftNav from '../components/LeftNav';
import TopNavBar from '../components/TopNavBar';

const Expenses = () => {

    const dispatch = useAppDispatch();
  const isCollapsed = useAppSelector((state) => state.sidebar.isCollapsed);

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };


  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <LeftNav isCollapsed={isCollapsed} />

      {/* Main Content Area */}
      <div className="flex-1 bg-gray-100">
        {/* Top Navbar */}
        <TopNavBar isCollapsed={isCollapsed} toggleSidebar={handleToggleSidebar} />

        {/* Main Content */}
        <div className="p-6 max-h-[550px] overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-4">Main Content Area of expenses</h2>
          <p>This is where your main dashboard content will go.</p>
        </div>
      </div>
    </div>
  )
}

export default Expenses