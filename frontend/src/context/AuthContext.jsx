import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import toast, { Toaster } from "react-hot-toast";

const AuthContext = createContext(null);

// =====================================================
//  INITIAL STATE FROM LOCAL STORAGE
// =====================================================
const getInitialState = () => {
    const storedToken = localStorage.getItem("authToken");

    if (!storedToken) {
        return { token: null, user: null, isAuthReady: true };
    }

    try {
        const decoded = jwtDecode(storedToken);
        return { token: storedToken, user: decoded, isAuthReady: true };
    } catch (error) {
        console.error("Invalid stored token → clearing it.");
        localStorage.removeItem("authToken");
        return { token: null, user: null, isAuthReady: true };
    }
};

// =====================================================
//  PROVIDER
// =====================================================
export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const initial = getInitialState();

    const [token, setToken] = useState(initial.token);
    const [user, setUser] = useState(initial.user);
    const [isAuthReady] = useState(initial.isAuthReady);

    // ----------------------------------------------------
    // Sync token → decode user → store in localStorage
    // ----------------------------------------------------
    useEffect(() => {
        if (!token) {
            setUser(null);
            localStorage.removeItem("authToken");
            return;
        }

        try {
            const decoded = jwtDecode(token);
            setUser(decoded);
            localStorage.setItem("authToken", token);
        } catch (err) {
            console.error("Token decode error:", err);
            localStorage.removeItem("authToken");
            setToken(null);
            setUser(null);
        }
    }, [token]);

    // =====================================================
    //  LOGIN
    // =====================================================
    const login = async (identifier, password) => {
        try {
            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier, password }),
            });

            const data = await response.json();
            console.log(data);

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            // store token
            setToken(data.token);

            toast.success("Login successful!");

            // ensure navigation works AFTER token is saved
            setTimeout(() => navigate("/home"), 300);

            return true;
        } catch (error) {
            console.error("Login error:", error);
            toast.error(error.message || "Server error");
            return false;
        }
    };

    // =====================================================
    //  LOGOUT
    // =====================================================
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("authToken");
        toast.success("Logged out");

        // delay to let the toast show smoothly
        setTimeout(() => navigate("/login"), 200);
    };

    const value = {
        token,
        user,
        login,
        logout,
        isAuthenticated: !!token,
        isAuthReady,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// =====================================================
//  CUSTOM HOOK
// =====================================================
export const useAuth = () => useContext(AuthContext);

