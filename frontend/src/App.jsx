import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Auth
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import Unauthorized from "./pages/Unauthorized.jsx";
import Home from "./pages/Home.jsx";


// Placeholder Components



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

// Wrapper for auth initialization
function AppContent() {
  const { isAuthReady } = useAuth();

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-semibold">
          Loading Application and Checking Credentials...
        </h1>
      </div>
    );
  }

  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
    

      {/* PROTECTED GENERAL ROUTE */}
      <Route
        path="/home"
        element={
          <ProtectedRoute allowedRoles={["admin", "staff", "uo_staff", "student"]} >
            <Home />
          </ProtectedRoute>
        }
      />

      {/* ADMIN ROUTES */}
      <Route
        path="/admin/users"
      />

      {/* 404 */}
      <Route path="*" element={<h1>404 Page Not Found</h1>} />
    </Routes>
  );
}

export default App;
