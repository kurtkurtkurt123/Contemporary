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
      <nav className="bg-white/90 backdrop-blur-md text-gray-800 rounded-full shadow-2xl px-6 py-3 flex items-center justify-between w-full max-w-5xl border border-gray-200">
        <div className="flex items-center gap-2">
           <div className="bg-blue-600 p-2 rounded-full text-white">
             <GlobeIcon size={20} />
           </div>
           <span className="font-bold text-lg tracking-tight hidden sm:block">Contemporary World</span>
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