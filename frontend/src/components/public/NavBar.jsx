import React from "react";

// --- Local Icons for NavBar ---
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

const NavBar = ({ user, onLogout }) => {
  return (
    <div className="fixed top-0 left-0 w-full flex justify-center z-50 pt-6 px-4">
      {/* 🛠️ Increased padding (px-8, py-4) and max width (max-w-6xl) */}
      <nav className="bg-white/90 backdrop-blur-md text-gray-800 rounded-full shadow-2xl px-10 py-5 flex items-center justify-between w-full max-w-7xl border border-gray-200">
        <div className="flex items-center gap-10"> {/* Increased gap for better spacing */}
           <div className="bg-blue-600 p-2 rounded-full text-white">
             <GlobeIcon size={24} /> {/* Increased icon size to match overall scale */}
           </div>
           <span className="font-bold text-xl tracking-tight hidden sm:block">Contemporary World</span> {/* Increased text size */}
        </div>

        <div className="flex items-center gap-6">
           {user && (
             <div className="flex items-center gap-3">
               <div className="text-right hidden md:block">
                 <p className="text-sm font-bold text-gray-900">{user.FirstName} {user.LastName}</p>
                 <p className="text-xs text-gray-500">Student</p>
               </div>
               <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold border border-gray-200">
                  {user.FirstName ? user.FirstName.charAt(0) : "U"}
               </div>
             </div>
           )}
           <button 
             onClick={onLogout}
             className="p-3 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-full transition-colors" /* Increased logout button padding */
             title="Logout"
           >
             <LogOut size={24} /> {/* Increased icon size to match overall scale */}
           </button>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;