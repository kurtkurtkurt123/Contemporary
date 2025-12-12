import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NavBar from "../components/public/NavBar";
import GlobeImage from '../assets/images/globe.png'; // Gagamitin natin ito
import ShowcaseImage from '../assets/images/showcase.png'; // Gagamitin natin ito

// IDAGDAG ITO: Mini-component para sa Feature Cards
const FeatureCard = ({ title, description, icon }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center">
        <img src={icon} alt={title} className="w-20 h-20 mb-4" />
        <h3 className="text-xl font-bold mb-2 text-[#3C467B]">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
    </div>
);

const Home = () => {
    const navigate = useNavigate();
    const { user, logout, isAuthenticated, isAuthReady } = useAuth(); 

    const renderNavBar = () => {
        if (!user) return null;
        return <NavBar user={user} onLogout={logout} />;    
    };
    

    if (!isAuthenticated || !user || !isAuthReady) { 
         // Kung hindi pa ready, magpakita ng loading screen
         return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <h1 className="text-2xl font-semibold text-gray-600">Preparing Dashboard...</h1>
            </div>
        ); 
    }
    
    // Normalize user data (kailangan para sa Welcome message)
    const firstName = user?.user_fn || '';
    const roleDisplay = (user?.role || '').toLowerCase() === 'student' ? 'Student' : 'Admin/Staff';

    return (
        <> 
        {renderNavBar()}

        {/* --- MAIN PAGE CONTAINER --- */}
        <div className="min-h-screen bg-gray-100 text-gray-800">
            
            {/* 1. HERO SECTION (WITH BACKGROUND IMAGE) */}
            <div 
                className="pt-32 pb-24 px-6 text-white bg-[#3C467B] bg-cover bg-center shadow-2xl"
                style={{ 
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${ShowcaseImage})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover'
                }}
            >
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-5xl font-extrabold mb-4 animate-fade-in">
                        Welcome, {firstName}!
                    </h1>
                    <p className="text-xl font-light opacity-90 mb-6 animate-fade-in delay-200">
                        You are logged in as a **{roleDisplay}**. This is your global learning hub.
                    </p>
                    <button onClick={logout} className="mt-4 bg-white text-[#3C467B] px-8 py-3 rounded-full hover:bg-gray-200 transition font-semibold shadow-lg">
                        {roleDisplay === 'Student' ? 'Continue Learning' : 'Start Managing'}
                    </button>
                </div>
            </div>
            
            {/* 2. MAIN CONTENT (Overview & Features) */}
            <main className="max-w-7xl mx-auto p-6 -mt-12 relative z-10">
                
                {/* OVERVIEW SECTION (White Card) */}
                <div className="bg-white rounded-2xl shadow-2xl p-10 mb-10 border border-gray-100">
                    <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">
                        🌎 What is the Contemporary World?
                    </h2>
                    <p className="text-center text-gray-600 max-w-4xl mx-auto mb-8">
                        The Contemporary World is a comprehensive study of globalization and its profound impact on societies, economies, politics, and culture. It examines current global issues, interconnectivity, and the complex challenges facing humanity today.
                    </p>
                    
                    {/* KEY TAKEAWAYS */}
                    <div className="grid md:grid-cols-2 gap-6 text-left">
                        <div>
                            <h3 className="text-xl font-semibold mb-2 text-[#4A56A3]">Overview: The Globalized Era</h3>
                            <ul className="list-disc list-inside text-gray-600 space-y-2 pl-4">
                                <li>Focuses on events from the late 20th century to the present.</li>
                                <li>Examines rapid technological and digital transformation.</li>
                                <li>Explores the rise of transnational corporations and global governance.</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-2 text-[#4A56A3]">Key Areas of Study</h3>
                            <ul className="list-disc list-inside text-gray-600 space-y-2 pl-4">
                                <li>**Global Economy:** Trade, finance, and inequality.</li>
                                <li>**Global Politics:** International relations, conflicts, and cooperation.</li>
                                <li>**Cultural Flows:** Migration, media, and identity.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* FEATURE CARDS */}
                <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
                    What You Will Do Here
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FeatureCard 
                        title="Learn" 
                        description="Access comprehensive modules, video lessons, and reading materials on globalization and global challenges." 
                        icon={GlobeImage} 
                    />
                    <FeatureCard 
                        title="Explore" 
                        description="Check out your personalized dashboard, course progress, and upcoming deadlines for quizzes and assignments." 
                        icon={GlobeImage} 
                    />
                    <FeatureCard 
                        title="Enjoy" 
                        description="Participate in engaging activities and discussions designed to deepen your understanding of the globalized world." 
                        icon={GlobeImage} 
                    />
                </div>
            </main>
        </div>
        </>
    );
};

export default Home;