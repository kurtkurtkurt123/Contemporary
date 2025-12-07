import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// ✅ TAMA NA ANG PATH NA ITO
import { AuthProvider, useAuth } from "./context/AuthContext"; 
import ProtectedRoute from "./components/ProtectedRoute"; 

// Imports ng Pages - KELANGAN TUMUGMA SA FILE NAME (CASE-SENSITIVE!)
import Login from "./pages/LoginPage.jsx";       
import Register from "./pages/register.jsx"; // ✅ FIX: Assumes file is renamed to RegisterPage.jsx
import Unauthorized from "./pages/Unauthorized.jsx"; 
import Home from "./pages/Home.jsx"; 
import AboutPage from "./pages/AboutPage.jsx"; 
import LessonPage from "./pages/LessonPage.jsx"; 
// Note: Syllabus removed

// Placeholder Components
const AdminDashboard = () => <h1>Admin Dashboard Placeholder</h1>;
const InstructorDashboard = () => <h1>InstructorDashboard Placeholder</h1>;


function App() {
  return (
    <BrowserRouter>
      {/* 1. Wrap ang lahat sa AuthProvider */}
      <AuthProvider>
        {/* 2. Gagamitin ang AppContent para i-handle ang loading state */}
        <AppContent /> 
      </AuthProvider>
    </BrowserRouter>
  );
}

// Wrapper component para i-handle ang initial loading at routing
function AppContent() {
    const { isAuthReady } = useAuth(); // Kinuha ang isAuthReady state

    // 🚨 Critical Check: Haharangin ang Routes hangga't hindi pa ready ang Auth
    if (!isAuthReady) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <h1 className="text-2xl font-semibold">Loading Application and Checking Credentials...</h1>
            </div>
        );
    }

    return (
        <Routes>
            {/* --- PUBLIC ROUTES --- */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<AboutPage />} /> 

            {/* --- PROTECTED HUB ROUTE (CRITICAL) --- */}
            <Route 
                path="/home" 
                element={<ProtectedRoute allowedRoles={['Admin', 'Instructor', 'Student']}><Home /></ProtectedRoute>} 
            />

            {/* --- PROTECTED SPECIFIC ROUTES --- */}
            <Route path="/lessons" element={<ProtectedRoute allowedRoles={['Student']}><LessonPage /></ProtectedRoute>} />
            {/* Note: Syllabus route removed */}

            {/* Admin Specific Routes */}
            <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['Admin']}><AdminDashboard /></ProtectedRoute>} /> 
            
            {/* Instructor Specific Routes */}
            <Route path="/instructor/grading" element={<ProtectedRoute allowedRoles={['Instructor']}><InstructorDashboard /></ProtectedRoute>} /> 
            
            {/* Catch all - 404 */}
            <Route path="*" element={<h1>404 Page Not Found</h1>} />

        </Routes>
    );
}

export default App;