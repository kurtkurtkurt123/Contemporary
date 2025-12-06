import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
// ✅ FINAL PATH: Umakyat ng isang folder galing /components/ para makita ang /context/
import { useAuth } from "../context/AuthContext"; 

const ProtectedRoute = ({ children, allowedRoles }) => {
  // Kunin ang lahat ng state na kailangan
  const { user, token, isAuthReady } = useAuth();
  const location = useLocation();

  // 1. Loading State: Haharangin ang rendering habang nagche-check ng token
  if (!isAuthReady) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <h1 className="text-2xl text-gray-600">Checking credentials...</h1>
        </div>
    );
  }
  
  // 2. Check kung naka-login
  if (!token) {
    // Kung walang token, balik sa Login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Role Check
  // Tiyakin na ang spelling at casing ng Role ay tugma sa JWT payload ('Admin', 'Student', etc.)
  if (user && allowedRoles && !allowedRoles.includes(user.Role)) {
    // Kung mali ang role, redirect sa Unauthorized
    return <Navigate to="/unauthorized" replace />; 
  }

  // 4. Access granted
  return children;
};

export default ProtectedRoute;