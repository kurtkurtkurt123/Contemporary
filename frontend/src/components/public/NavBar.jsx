import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ChevronDownIcon, ChevronUpIcon, UsersIcon, BookOpenIcon, Cog6ToothIcon,
  UserCircleIcon, HomeIcon, BriefcaseIcon, AcademicCapIcon, PowerIcon,
  GlobeAltIcon, CheckCircleIcon
} from '@heroicons/react/24/outline';

// =======================================================
// HELPER COMPONENT: User Dropdown (Profile & Logout)
// =======================================================
const UserDropdown = ({ user, logout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  // Function to navigate to the profile page (assuming '/profile')
  const handleViewProfile = () => {
    setIsOpen(false);
    navigate('/profile');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 py-2 px-3 bg-gray-200 rounded-full hover:bg-gray-300 transition"
      >
        <div className="flex items-center justify-center h-8 w-8 bg-black text-white rounded-full text-sm font-semibold">
          {/* Display user's first initial, fallback to 'U' */}
          {(user?.FirstName || 'U').charAt(0).toUpperCase()}
        </div>
        <span className="text-gray-800 font-medium">{user?.user_fn + ' ' + user?.user_ln || 'User'}</span>
        {isOpen ? (
          <ChevronUpIcon className="h-5 w-5 text-gray-600" />
        ) : (
          <ChevronDownIcon className="h-5 w-5 text-gray-600" />
        )}
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
          <div className="p-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900 truncate">{user?.FirstName} {user?.LastName}</p>
            <p className='"text-xs text-gray-500 truncate'>{(user?.user_code)}</p>
            <p className="text-xs text-gray-500 capitalize">
              {/* Check user?.user_role or user?.Role, depending on your JWT payload key */}
              {(user?.user_role || user?.Role)?.toLowerCase() === 'uo_staff'
                ? 'Unofficial Staff'
                : user?.user_role || user?.Role || 'Guest'
              }
            </p>
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
// MAIN COMPONENT: Role-Based NavBar
// =======================================================
const NavBar = () => {
  const { user, logout } = useAuth();

  // Normalize role to lowercase for reliable comparison
  const role = (user?.user_role || '').toLowerCase();

  // Define links based on roles
  const getNavLinks = () => {
    const baseLinks = [];

    // --- LINKS FOR ALL AUTHENTICATED USERS ---
    // Home/Dashboard is the default for everyone
    // Icon: HomeIcon
    baseLinks.push({ to: '/home', label: 'Home', icon: HomeIcon });

    // Activity link is shared by Students and Staff, but not Admins by default (can be adjusted)
    // Icon: BriefcaseIcon (Suitable for tasks/activities)
    if (['student', 'staff', 'uo_staff'].includes(role)) {
      baseLinks.push({ to: '/activities', label: 'Activity', icon: BriefcaseIcon });
    }

    // Admin Specific Links (Dashboard)
    // Icon: Cog6ToothIcon (Represents administration/control panel)
    if (role === 'admin') {
      baseLinks.push({ to: '/', label: 'Dashboard', icon: Cog6ToothIcon });
    }

    // --- ROLE SPECIFIC LINKS ---
    // Check Activity link (for Staff/Admin)
    // Icon: CheckCircleIcon (Represents checking/reviewing)
    if (role === 'staff' || role === 'admin') {
      baseLinks.push({ to: '/staff/check-activity', label: 'Check Activity', icon: CheckCircleIcon });
    }

    // Admin Specific Links
    if (role === 'admin') {
      // Students link
      // Icon: UsersIcon (Represents a group of people/users)
      baseLinks.push({ to: '/', label: 'Students', icon: UsersIcon });

      // Materials link
      // Icon: BookOpenIcon (Represents learning materials/content)
      baseLinks.push({ to: '/', label: 'Materials', icon: BookOpenIcon });
    }

    return baseLinks;
  };

  const navLinks = getNavLinks();

  return (
    <nav className="fixed top-4 mx-auto w-full z-40 ">
      {/* The width of the content is controlled here. 
        Change 'max-w-6xl' to your desired size (e.g., max-w-[1400px], max-w-full) 
    */}
      <div className="max-w-[1600px] mx-auto bg-white rounded-xl shadow-lg px-[5%] sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Left Side: Logo and Title */}
          <div className="flex items-center">
            <GlobeAltIcon className="h-10 w-10 text-[#3C467B] mr-2" />
            <span className="text-2xl font-extrabold text-[#3C467B] tracking-wide">
              SOCSCI 3 LMS
            </span>
          </div>

          {/* Center: Navigation Links (Conditional) */}
          <div className="flex space-x-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                // Custom styling for active link
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

          {/* Right Side: User Dropdown */}
          <div className="flex items-center">
            <UserDropdown user={user} logout={logout} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;