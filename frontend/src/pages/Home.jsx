;
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NavBar from "../components/public/NavBar";
import Unauthorized from "./Unauthorized.jsx";

const Home = () => {
    const navigate = useNavigate();
    const { user, logout, isAuthenticated, isAuthReady } = useAuth(); 

    // --- FUNCTION 1: CONDITIONAL NAVBAR RENDERING ---
    const renderNavBar = () => {
        if (!user) return null;
        return <NavBar user={user} onLogout={logout} />;    
    };
    

    if (!isAuthenticated || !user || !isAuthReady) { 
         // Kung hindi pa ready, magpakita ng loading screen
         return (
            <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-2xl font-semibold">Preparing Dashboard...</h1>
            </div>
        ); 
    }

    return (
        <> 
        {renderNavBar()}

        <div className="min-h-screen bg-gray-100 text-gray-800">
            <div className="pt-32 px-6 max-w-6xl mx-auto">
                {/* Welcome Section */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-10 border border-gray-200">
                    <h1 className="text-3xl font-extrabold mb-2">
                        Welcome back, <span className="text-black">{user.FirstName}</span>
                    </h1>
                    <p className="text-gray-500">
                        You are logged in as a **{user.user_role}**. This is your personalized dashboard.
                    </p>
                    <button onClick={logout} className="mt-6 bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition">
                        {user.user_role === 'student' ? 'Continue Learning' : 'Start Managing'}
                    </button>
                </div>
            </div>
        </div>
        </>
    );
};

export default Home;