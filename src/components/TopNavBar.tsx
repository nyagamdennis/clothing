import React, { useState } from 'react';
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon, MagnifyingGlassIcon, EnvelopeIcon, BellIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import profile from '../assets/images/user.png';

interface TopNavBarProps {
    isCollapsed: boolean;
    toggleSidebar: () => void;
}

const TopNavBar: React.FC<TopNavBarProps> = ({ isCollapsed, toggleSidebar }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <div className="bg-white shadow-md p-4 flex items-center top-0 sticky">
            <div className="flex items-center">
                <button
                    onClick={toggleSidebar}
                    className="p-2 bg-gray-300 hover:bg-gray-400 rounded-full transition duration-300"
                >
                    {isCollapsed ? (
                        <ChevronDoubleRightIcon className="h-6 w-6" />
                    ) : (
                        <ChevronDoubleLeftIcon className="h-6 w-6" />
                    )}
                </button>
            </div>

            <div className="flex items-center w-full relative mx-4">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />

                <input
                    type="text"
                    placeholder="Search..."
                    className="border bg-gray-100 rounded-xl pl-10 pr-4 py-2 w-full focus:outline-none focus:border-purple-800"
                />

                <div className="relative ml-4">
                    <div className="bg-gray-200 p-2 rounded-full cursor-pointer">
                        <EnvelopeIcon className="h-6 w-6 text-gray-700" />
                    </div>
                    <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs">3</span>
                </div>

                <div className="relative ml-4">
                    <div className="bg-gray-200 p-2 rounded-full cursor-pointer">
                        <BellIcon className="h-6 w-6 text-gray-700" />
                    </div>
                    <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs">3</span>
                </div>

                <div className="relative flex items-center ml-9 cursor-pointer" onClick={toggleDropdown}>
                    <div className='w-10 h-10'>
                        <img src={profile} alt="profile" className="w-full h-full rounded-full object-cover" />
                    </div>


                    <div className="whitespace-nowrap ml-2">
                        <h4 className="text-sm font-bold">John Doe</h4>
                        <h4 className="text-xs text-gray-400 font-light">Admin</h4>
                    </div>

                    <ChevronDownIcon className="h-5 w-5 text-gray-700 flex-shrink-0 ml-3" />
                </div>

                {dropdownOpen && (
                    <div className="absolute right-10 mt-48 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"> {/* Adjusted margin-top to 2 */}
                        <ul className="py-2">
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Settings</li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Logout</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>


    );
};

export default TopNavBar;
