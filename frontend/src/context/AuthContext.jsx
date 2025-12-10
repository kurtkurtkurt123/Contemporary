import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // ==========================
  // Restore session from localStorage on app load
  // ==========================
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setIsAuthReady(true); // Mark auth check as done
  }, []);

  // ==========================
  // LOGIN via Express API
  // ==========================
  const login = async (identifier, password) => {
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");

      // Save JWT token and user info
      setToken(data.token);
      const userData = { role: data.role, identifier };
      setUser(userData);
      console.log("User data:", userData);
      // Persist in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(userData));

      setIsAuthReady(true);

      toast.success("Login successful!");
      navigate("/home");
      return true;
    } catch (err) {
      console.error("Login Error:", err.message);
      toast.error(err.message || "Login failed");
      return false;
    }
  };

  // ==========================
  // LOGOUT
  // ==========================
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthReady(true); // Auth check done
    toast.success("Logged out");
    navigate("/login");
  };

  // ==========================
  // REGISTER via Express API
  // ==========================
  const register = async (userData) => {
    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Registration failed");

      toast.success("Registration successful! Your code: " + data.user_code);
      return true;
    } catch (err) {
      console.error("Registration Error:", err.message);
      toast.error(err.message || "Registration failed");
      return false;
    }
  };

  const value = {
    token,
    user,
    login,
    logout,
    register,
    isAuthenticated: !!token,
    isAuthReady,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook
export const useAuth = () => useContext(AuthContext);
