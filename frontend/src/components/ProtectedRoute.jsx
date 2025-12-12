import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from "../context/AuthContext"; 

// --- ProtectedRoute Component ---
const ProtectedRoute = ({ children, allowedRoles }) => {
  // Kunin ang authentication state at user data
  const { user, token, isAuthReady } = useAuth();
  const location = useLocation();

  // 1. Loading State Check (Una dapat itong tumakbo)
  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-2xl text-gray-600">Checking credentials...</h1>
      </div>
    );
  }

  // 2. Authentication Check (Kung walang token/user, redirect sa login)
  if (!token || !user) { 
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Role Check (Tiyakin na may karapatan ang user sa page na ito)
  if (allowedRoles && allowedRoles.length > 0) {
    
    // Hanapin ang role ng user (sinama ang iba't ibang posibleng property name)
    const userRole = user.role || user.Role || user.user_role || user.UserType; 

    if (!userRole) {
      console.error("User object is valid but is missing the role property. Access denied.");
      return <Navigate to="/unauthorized" replace />; 
    }

    // Normalization (gawing lowercase) para sa tamang pag-compare
    const normalizedUserRole = String(userRole).toLowerCase();
    const normalizedAllowedRoles = allowedRoles.map(r => String(r).toLowerCase());
    
    // Kung ang role ng user ay WALA sa listahan ng allowed roles
    if (!normalizedAllowedRoles.includes(normalizedUserRole)) {
      console.warn(`Access Denied: User role '${userRole}' not in [${allowedRoles.join(', ')}]`);
      return <Navigate to="/unauthorized" replace />; 
    }
  }

  // 4. Access Granted
  return children;
};

export default ProtectedRoute;