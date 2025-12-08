import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from "../context/AuthContext"; 

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token, isAuthReady } = useAuth();
  const location = useLocation();

  if (!isAuthReady) {
    return <div className="p-4">Checking credentials...</div>;
  }
  
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user) {
    console.error("Token exists but user payload is missing.");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (allowedRoles) {
    
    const userRole =  user.user_role; 
  //  console.log("User Role:", userRole);

    // Guard: If the role property itself is missing from the JWT
    if (!userRole) {
         console.error("JWT is missing the role property (Role, role, or userType). Access denied.");
         return <Navigate to="/unauthorized" replace />; 
    }

    const normalizedUserRole = String(userRole).toLowerCase();
    const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase());

    if (!normalizedAllowedRoles.includes(normalizedUserRole)) {
      console.warn(`Access Denied: User role '${userRole}' not in [${allowedRoles}]`);
      return <Navigate to="/unauthorized" replace />; 
    }
  }

  return children;
};

export default ProtectedRoute;