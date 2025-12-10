import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from "../context/AuthContext"; 

// --- ProtectedRoute.js ---
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token, isAuthReady } = useAuth();
  const location = useLocation();

  // 1. Loading State Check
  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-2xl text-gray-600">Checking credentials...</h1>
      </div>
    );
  }
  
  // 2. Authentication Check
  if (!token || !user) { 
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // 3. Role Check
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user.role; // ✅ Correct property from AuthContext

    if (!userRole) {
      console.error("User object is valid but is missing the role property. Access denied.");
      return <Navigate to="/unauthorized" replace />; 
    }

    const normalizedUserRole = String(userRole).toLowerCase();
    const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase());
    
    if (!normalizedAllowedRoles.includes(normalizedUserRole)) {
      console.warn(`Access Denied: User role '${userRole}' not in [${allowedRoles}]`);
      return <Navigate to="/unauthorized" replace />; 
    }
  }

  // Access granted
  return children;
};

export default ProtectedRoute;
