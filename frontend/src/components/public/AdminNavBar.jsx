import React from "react";
import { Link } from "react-router-dom";

// --- Local Icons (Kailangang i-copy mula sa orihinal na NavBar) ---
const GlobeIcon = ({ size = 28, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

const LogOut = ({ size = 28, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);
// -----------------------------------------------------------------

const AdminNavBar = ({ user, onLogout }) => {
  return (
    <div className="fixed top-0 left-0 w-full flex justify-center z-50 pt-6"> {/* Removed px-4 */}
      {/* Increased padding (px-10, py-5) and max-w-full */}
      <nav className="bg-white/90 backdrop-blur-md text-gray-800 rounded-full shadow-2xl px-10 py-5 flex items-center justify-between w-full max-w-full border border-gray-200">
        
        {/* Logo / Brand */}
        <div className="flex items-center gap-3"> {/* Increased gap */}
           <div className="bg-red-700 p-2 rounded-full text-white">
             <GlobeIcon size={28} /> {/* Increased size */}
           </div>
           <span className="font-bold text-xl tracking-tight hidden sm:block">Admin Panel</span> {/* Increased text size */}
        </div>

        {/* Navigation Links (Admin Focus) */}
        <div className="hidden md:flex items-center gap-6 text-md font-medium"> {/* Increased text size */}
            <Link to="/home" className="hover:text-red-700 transition-colors">Dashboard</Link>
            <Link to="/admin/users" className="hover:text-red-700 transition-colors">Manage Users</Link>
            <Link to="/admin/courses" className="hover:text-red-700 transition-colors">Courses</Link>
            <Link to="/admin/settings" className="hover:text-red-700 transition-colors">Settings</Link>
        </div>

        {/* User Info and Logout */}
        <div className="flex items-center gap-6">
            {user && (
              <div className="flex items-center gap-4"> {/* Increased gap */}
                <div className="text-right hidden md:block">
                  <p className="text-md font-bold text-gray-900">{user.FirstName} {user.LastName}</p>
                  <p className="text-sm text-red-700 font-bold">{user.Role || "Admin"}</p>
                </div>
                <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center text-red-700 font-bold border border-red-300"> {/* Increased avatar size */}
                  {user.FirstName ? user.FirstName.charAt(0) : "A"}
                </div>
              </div>
            )}
            <button 
              onClick={onLogout}
              className="p-3 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-full transition-colors"
              title="Logout"
            >
              <LogOut size={28} /> {/* Increased size */}
            </button>
        </div>
      </nav>
    </div>
  );
};

export default AdminNavBar;