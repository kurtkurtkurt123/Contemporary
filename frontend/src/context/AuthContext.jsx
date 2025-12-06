import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 
import toast, { Toaster } from 'react-hot-toast';

const AuthContext = createContext(null);

const getInitialState = () => {
    const storedToken = localStorage.getItem('authToken');
    let decodedUser = null;
    if (storedToken) {
        try {
            decodedUser = jwtDecode(storedToken);
        } catch (error) {
            localStorage.removeItem('authToken');
        }
    }
    return {
        token: storedToken,
        user: decodedUser,
        isAuthReady: true,
    };
};

export const AuthProvider = ({ children }) => {
    
    const initialState = getInitialState();

    const [token, setToken] = useState(initialState.token);
    const [user, setUser] = useState(initialState.user);
    const [isAuthReady, setIsAuthReady] = useState(initialState.isAuthReady);
    
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            try {
                const decodedUser = jwtDecode(token);
                setUser(decodedUser);
                localStorage.setItem('authToken', token);
            } catch (error) {
                console.error("JWT Decoding Failed During Sync:", error); 
                localStorage.removeItem('authToken');
                setToken(null);
                setUser(null);
            }
        } else {
            setUser(null);
        }
    }, [token]);

    const login = async (identifier, password) => { 
        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            setToken(data.token); 
            toast.success('Login Successful! Redirecting...');
            
            // ✅ CRITICAL FIX: I-force ang navigation sa /home para hindi mag-blank screen
            navigate('/home'); 
            
            return true;

        } catch (error) {
            console.error("Login attempt error:", error);
            toast.error(error.message || 'Server Error'); 
            return false;
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('authToken');
        toast.success('Logged out');
        navigate('/login');
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
            <Toaster position="top-right" /> 
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};