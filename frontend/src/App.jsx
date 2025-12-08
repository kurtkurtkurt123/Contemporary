import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
// ✅ TAMA NA ANG PATH NA ITO
import { AuthProvider, useAuth } from "./context/AuthContext"; 
import ProtectedRoute from "./components/ProtectedRoute"; 

// Imports ng Pages
import Login from "./pages/login.jsx";       
import Register from "./pages/register.jsx"; 
import Unauthorized from "./pages/Unauthorized.jsx";
import Home from "./pages/Home.jsx";


// Placeholder Components
const AdminDashboard = () => <h1>Admin Dashboard Placeholder</h1>;
const InstructorDashboard = () => <h1>Instructor Dashboard Placeholder</h1>;


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-center" />
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
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
          
            {/* --- PROTECTED HUB ROUTE (CRITICAL) --- */}
            <Route 
                path="/home" 
                element={<ProtectedRoute allowedRoles={['Admin', 'Instructor', 'student']}><Home /></ProtectedRoute>} 
            />

        
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