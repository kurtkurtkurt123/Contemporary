import React from "react";
import { Link } from "react-router-dom";

// --- Local Icons (Kailangang i-copy mula sa orihinal na NavBar) ---
const GlobeIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

const LogOut = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);
// -----------------------------------------------------------------

const InstructorNavBar = ({ user, onLogout }) => {
  return (
    <div className="fixed top-0 left-0 w-full flex justify-center z-50 pt-6 px-4">
      <nav className="bg-white/90 backdrop-blur-md text-gray-800 rounded-full shadow-2xl px-6 py-3 flex items-center justify-between w-full max-w-5xl border border-gray-200">
        
        {/* Logo / Brand */}
        <div className="flex items-center gap-2">
           <div className="bg-purple-600 p-2 rounded-full text-white">
             <GlobeIcon size={20} />
           </div>
           <span className="font-bold text-lg tracking-tight hidden sm:block">Instructor Portal</span>
        </div>

        {/* Navigation Links (Instructor Focus) */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/home" className="hover:text-purple-600 transition-colors">Dashboard</Link>
            <Link to="/instructor/classes" className="hover:text-purple-600 transition-colors">My Classes</Link>
            <Link to="/instructor/grading" className="hover:text-purple-600 transition-colors">Grading Queue</Link>
            <Link to="/instructor/reports" className="hover:text-purple-600 transition-colors">Reports</Link>
        </div>

        {/* User Info and Logout */}
        <div className="flex items-center gap-6">
            {user && (
              <div className="flex items-center gap-3">
                <div className="text-right hidden md:block">
                  {/* Assuming user has FirstName, LastName, and Role */}
                  <p className="text-sm font-bold text-gray-900">{user.FirstName} {user.LastName}</p>
                  <p className="text-xs text-gray-500">{user.Role || "Instructor"}</p>
                </div>
                <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold border border-purple-300">
                  {user.FirstName ? user.FirstName.charAt(0) : "I"}
                </div>
              </div>
            )}
            <button 
              onClick={onLogout}
              className="p-2 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-full transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
        </div>
      </nav>
    </div>
  );
};

export default InstructorNavBar;