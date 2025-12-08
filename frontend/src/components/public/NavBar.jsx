import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {
    ChevronDownIcon, ChevronUpIcon, UserCircleIcon, PowerIcon, GlobeAltIcon,
    HomeIcon, BriefcaseIcon, CheckCircleIcon, UsersIcon, BookOpenIcon, Cog6ToothIcon,
    Bars3Icon, XMarkIcon // Icons for the Mobile Menu toggle
} from '@heroicons/react/24/outline';


// =======================================================
// HELPER COMPONENT: User Dropdown (No responsive change needed)
// =======================================================
const UserDropdown = ({ user, logout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        setIsOpen(false);
        logout();
    };

    const handleViewProfile = () => {
        setIsOpen(false);
        navigate('/profile');
    };
    
    const roleDisplay = (user?.user_role || user?.Role)?.toLowerCase() === 'uo_staff'
        ? 'Unofficial Staff'
        : user?.user_role || user?.Role || 'Guest';

    // Safely get name initials for the avatar
    const userInitials = (user?.user_fn || 'U').charAt(0) + (user?.user_ln || 'L').charAt(0).toUpperCase();

    return (
        <div className="relative z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 py-2 px-3 bg-gray-200 rounded-full hover:bg-gray-300 transition"
            >
                <div className="flex items-center justify-center h-8 w-8 bg-black text-white rounded-full text-sm font-semibold">
                    {userInitials}
                </div>
                {/* Name is hidden on mobile to save space, but visible in the dropdown */}
                <span className="text-gray-800 font-medium hidden md:inline">{user?.user_fn}</span> 
                
                {isOpen ? (
                    <ChevronUpIcon className="h-5 w-5 text-gray-600" />
                ) : (
                    <ChevronDownIcon className="h-5 w-5 text-gray-600" />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                    <div className="p-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900 truncate mb-2">{user?.user_fn + ', ' + user?.user_ln || 'User'}</p>
                        <p className="text-xs text-gray-500 capitalize">{roleDisplay}</p>
                        <p className='text-xs text-gray-300 truncate'>{user?.user_code}</p>
                    </div>

                    <button
                        onClick={handleViewProfile}
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                        <UserCircleIcon className="h-5 w-5 mr-3 text-gray-500" />
                        View Profile
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition"
                    >
                        <PowerIcon className="h-5 w-5 mr-3 text-red-400" />
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};


// =======================================================
// MAIN COMPONENT: Role-Based NavBar (Responsive)
// =======================================================
const NavBar = () => {
    const { user, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // New state for mobile menu

    const role = (user?.Role || user?.role || user?.user_role || '').toLowerCase();

    const getNavLinks = () => {
        const baseLinks = [];
        baseLinks.push({ to: '/home', label: 'Home', icon: HomeIcon });

        if (['student', 'staff', 'uo_staff'].includes(role)) {
            baseLinks.push({ to: '/activities', label: 'Activity', icon: BriefcaseIcon });
        }

        if (role === 'admin') {
            baseLinks.push({ to: '/dashboard', label: 'Admin Dashboard', icon: Cog6ToothIcon });
        }

        if (role === 'staff' || role === 'admin') {
            baseLinks.push({ to: '/staff/check-activity', label: 'Check Activity', icon: CheckCircleIcon });
        }

        if (role === 'admin') {
            baseLinks.push({ to: '/admin/students', label: 'Students', icon: UsersIcon });
            baseLinks.push({ to: '/admin/materials', label: 'Materials', icon: BookOpenIcon });
        }

        return baseLinks;
    };

    const navLinks = getNavLinks();

    return (
        <nav className="fixed top-4 left-0 right-0 z-50 font-poppins">
            {/* Inner DIV: This is the container that controls the width and appearance of the bar */}
            <div className="max-w-7xl rounded-3xl z-40 bg-white border border-gray-200 drop-shadow-md shadow-lg mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">

                    {/* Left Side: Logo and Title */}
                    <div className="flex items-center">
                        <GlobeAltIcon className="h-10 w-10 text-[#3C467B] mr-2" />
                        <span className="text-xl font-extrabold text-[#3C467B] tracking-wide sm:text-2xl">
                            SOCSCI 3 LMS
                        </span>
                    </div>

                    {/* Center (Desktop) Navigation Links */}
                    <div className="hidden lg:flex space-x-6">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) =>
                                    `flex items-center px-3 py-2 text-sm font-medium transition duration-150 ease-in-out
                                     ${isActive ? 'text-black border-b-2 border-black font-bold' : 'text-gray-500 hover:text-gray-800'}`
                                }
                            >
                                <link.icon className="h-5 w-5 mr-1" />
                                {link.label}
                            </NavLink>
                        ))}
                    </div>

                    {/* Right Side: User Dropdown & Mobile Menu Button */}
                    <div className="flex items-center space-x-4">
                        <UserDropdown user={user} logout={logout} />

                        {/* Mobile Menu Button (Visible on small screens, hidden on large screens) */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
                            aria-label="Toggle navigation menu"
                        >
                            {isMobileMenuOpen ? (
                                <XMarkIcon className="h-6 w-6" />
                            ) : (
                                <Bars3Icon className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Content (Vertical, Full Width) */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-t border-gray-200 shadow-lg pb-2">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                // Close the menu when a link is clicked
                                onClick={() => setIsMobileMenuOpen(false)} 
                                className={({ isActive }) =>
                                    `flex items-center w-full px-4 py-3 text-base font-medium transition duration-150 ease-in-out
                                     ${isActive ? 'bg-gray-100 text-black font-bold' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`
                                }
                            >
                                <link.icon className="h-6 w-6 mr-3" />
                                {link.label}
                            </NavLink>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default NavBar;