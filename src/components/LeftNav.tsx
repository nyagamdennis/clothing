import React from 'react';
import { UserIcon, CogIcon,UserPlusIcon, BriefcaseIcon, ChartBarIcon, PowerIcon, ShoppingBagIcon, ArchiveBoxIcon, ClipboardDocumentCheckIcon, BuildingStorefrontIcon, ShareIcon, AcademicCapIcon, LifebuoyIcon } from '@heroicons/react/24/outline';
import Logo from '../assets/images/logo.jpg';
import { NavLink } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { getOrderCount } from '../features/orders/cartSlice';

interface LeftNavProps {
    isCollapsed: boolean;
}

const LeftNav: React.FC<LeftNavProps> = ({ isCollapsed }) => {
    
    const orders = useAppSelector(getOrderCount);

    return (
        <nav className={`  bg-white text-black transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-52'} h-screen`}>
            {/* Logo and Name Container with Bottom Border */}
            <div className={`p-4 mb-3 transition-all duration-300 flex items-center border-b-2 ${isCollapsed ? '' : 'flex items-center'}`}>
                <div className={` pb-2 mb-2 border-gray-300 border rounded-full ${isCollapsed ? 'w-16 h-16' : 'w-16 h-16'}`}>
                    <img src={Logo} alt='logo' className='h-full w-full rounded-full cursor-pointer object-contain' />
                </div>
                <h2 className={`font-extrabold ms-3 transition-all duration-300 text-xl ${isCollapsed ? 'hidden' : 'block'}`}>
                    Esterita
                </h2>
            </div>

            {/* Navigation Links */}
            <ul>
                <li className="mb-4">
                    <NavLink
                        to="/"
                        className={({ isActive }) => 
                            `flex items-center px-4 py-2 ${isActive ? 'bg-red-100 text-amber-700' : ''}`
                        }
                    >
                        <ShoppingBagIcon className="h-6 w-6" />
                        {!isCollapsed && <span className={`ml-4`}>Stock</span>}
                    </NavLink>
                </li>
                <li className="mb-4">
                    <NavLink
                        to="/stock"
                        className={({ isActive }) => 
                            `flex items-center px-4 py-2 ${isActive ? 'bg-red-100 text-amber-700' : ''}`
                        }
                    >
                        <ArchiveBoxIcon className="h-6 w-6" />
                        {!isCollapsed && <span className={`ml-4`}>Store</span>}
                    </NavLink>
                </li>
                <li className="mb-4">
                    <NavLink
                        to="/orders"
                        className={({ isActive }) => 
                            `flex items-center px-4 py-2 ${isActive ? 'bg-red-100 text-amber-700' : ''}`
                        }
                    >
                        <ClipboardDocumentCheckIcon className="h-6 w-6" />
                        {!isCollapsed && <span className={`ml-4`}>Order <span className='bg-red-600 px-3 text-sm rounded-full text-white ms-10'>{orders}</span></span>}
                    </NavLink>
                </li>
                
                <li className="mb-4">
                    <NavLink
                        to="/customers"
                        className={({ isActive }) => 
                            `flex items-center px-4 py-2 ${isActive ? 'bg-red-100 text-amber-700' : ''}`
                        }
                    >
                        <LifebuoyIcon className="h-6 w-6" />
                        {!isCollapsed && <span className={`ml-4`}>Customers</span>}
                    </NavLink>
                </li>
                <li className="mb-4">
                    <NavLink
                        to="/analytics"
                        className={({ isActive }) => 
                            `flex items-center px-4 py-2 ${isActive ? 'bg-red-100 text-amber-700' : ''}`
                        }
                    >
                        <ChartBarIcon className="h-6 w-6" />
                        {!isCollapsed && <span className={`ml-4`}>Analytics</span>}
                    </NavLink>
                </li>
                <li className="mb-4">
                    <NavLink
                        to="/roles"
                        className={({ isActive }) => 
                            `flex items-center px-4 py-2 ${isActive ? 'bg-red-100 text-amber-700' : ''}`
                        }
                    >
                        <BriefcaseIcon className="h-6 w-6" />
                        {!isCollapsed && <span className={`ml-4`}>Workspace</span>}
                    </NavLink>
                </li>
                <li className=' mb-4'>
                    <NavLink
                        to="/employees"
                        className={({ isActive }) => 
                            `flex items-center px-4 py-2 ${isActive ? 'bg-red-100 text-amber-700' : ''}`
                        }
                    >
                        <UserPlusIcon className="h-6 w-6" />
                        {!isCollapsed && <span className={`ml-4`}>Employees</span>}
                    </NavLink>
                </li>
                <li className=''>
                    <NavLink
                        to="/store"
                        className={({ isActive }) => 
                            `flex items-center px-4 py-2 ${isActive ? 'bg-red-100 text-amber-700' : ''}`
                        }
                    >
                        <BuildingStorefrontIcon className="h-6 w-6" />
                        {!isCollapsed && <span className={`ml-4`}>Online Store</span>}
                    </NavLink>
                </li>
                <li className=''>
                    <NavLink
                        to="/social"
                        className={({ isActive }) => 
                            `flex items-center px-4 py-2 ${isActive ? 'bg-red-100 text-amber-700' : ''}`
                        }
                    >
                        <ShareIcon className="h-6 w-6" />
                        {!isCollapsed && <span className={`ml-4`}>Social Media</span>}
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default LeftNav;
