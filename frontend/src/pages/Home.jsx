import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// ✅ Import Auth: UMAKTYAT NG ISA (galing /pages/ papuntang /src/)
import { useAuth } from "../context/AuthContext"; 

// --- Navbar Imports ---
// ✅ Student: Tiyakin na ang file name ay NavBar.jsx at tama ang export
import StudentNavBar from "../components/public/NavBar"; 
import InstructorNavBar from "../components/public/InstructorNavBar"; 
import AdminNavBar from "../components/public/AdminNavBar"; 

// --- Dashboard Content Imports ---
// ✅ CONTENT PATH: UMAKTYAT NG ISA (galing /pages/ papuntang /src/components/dashboard)
import StudentContent from "../components/dashboard/StudentContent"; 
import InstructorContent from "../components/dashboard/InstructorContent";
import AdminContent from "../components/dashboard/AdminContent"; 

const Home = () => {
    const navigate = useNavigate();
    const { user, logout, isAuthenticated, isAuthReady } = useAuth(); 

    // --- FUNCTION 1: CONDITIONAL NAVBAR RENDERING ---
    const renderNavBar = () => {
        if (!user) return null;
        
        switch (user.Role) {
            case 'Admin':
                return <AdminNavBar user={user} onLogout={logout} />;
            case 'Instructor':
                return <InstructorNavBar user={user} onLogout={logout} />;
            case 'Student':
            default:
                // Tiyakin na ang NavBar.jsx ay nag-e-export ng default NavBar
                return <StudentNavBar user={user} onLogout={logout} />; 
        }
    };
    
    // --- FUNCTION 2: CONDITIONAL DASHBOARD CONTENT RENDERING ---
    const renderDashboardContent = () => {
        if (!user) return <h1>Loading user content...</h1>;

        switch (user.Role) {
            case 'Admin':
                return <AdminContent />;
            case 'Instructor':
                return <InstructorContent />;
            case 'Student':
            default:
                return <StudentContent />; 
        }
    };


    // ✅ Tiyakin na naka-login na at may user object
    if (!isAuthenticated || !user || !isAuthReady) { 
         // Kung hindi pa ready, magpakita ng loading screen
         return (
            <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-2xl font-semibold">Preparing Dashboard...</h1>
            </div>
        ); 
    }

    return (
        // 🌈 FIX: Changed background from bg-gray-100 to a light teal
        <div className="min-h-screen bg-teal-50 text-gray-800">

            {renderNavBar()}

            {/* 🛠️ FIX: Content is now wider (max-w-7xl) and uses less padding (px-4) */}
            <div className="pt-32 px-4 max-w-7xl mx-auto">
                {/* Welcome Section */}
                {/* 🛠️ FIX: Using p-7 for padding (compromise between p-5 and p-8) */}
                <div className="bg-white rounded-2xl shadow-xl p-7 mb-10 border border-gray-200">
                    <h1 className="text-3xl font-extrabold mb-2">
                        Welcome back, <span className="text-black">{user.FirstName}</span>
                    </h1>
                    <p className="text-gray-500">
                        You are logged in as a **{user.Role}**. This is your personalized dashboard.
                    </p>
                    <button onClick={logout} className="mt-6 bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition">
                        {user.Role === 'Student' ? 'Continue Learning' : 'Start Managing'}
                    </button>
                </div>

                {/* Dashboard Content */}
                {renderDashboardContent()}

            </div>
        </div>
    );
};

export default Home;