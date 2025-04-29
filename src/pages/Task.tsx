import React from 'react'
import LeftNav from '../components/LeftNav'
import TopNavBar from '../components/TopNavBar'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { toggleSidebar } from '../features/sidebar/sidebarSlice';


const Task = () => {
    const dispatch = useAppDispatch();
    const isCollapsed = useAppSelector((state) => state.sidebar.isCollapsed);

    const handleToggleSidebar = () => {
        dispatch(toggleSidebar());
      };

    return (
        <div className='flex h-screen'>
            <LeftNav isCollapsed={isCollapsed} />
            <div className="flex-1 bg-gray-100">
                <TopNavBar isCollapsed={isCollapsed} toggleSidebar={handleToggleSidebar} />
                <div className="p-6">
                    <h1>Helo</h1>
                </div>
            </div>
        </div>
    )
}

export default Task