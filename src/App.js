// src/App.js - The main application file handling Splash, Authentication, and Routing

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// 🛑 IMPORT AuthProvider and useAuth HOOK from your context file
import { useAuth } from './context/AuthContext'; 

// Import Layouts and Pages
import Home from './pages/Home';                  // Your protected layout (The Dashboard + Sidebar)
import LoginPage from './pages/LoginPage';        // The login page
import RegisterPage from './pages/RegisterPage';  
import ForgotPasswordPage from './pages/ForgotPasswordPage'; // Forgot Password Page

// Import CSS files
import './styles/layout.css';
import './styles/dashboard.css'; 
import './styles/drawer.css'; 
import './styles/clients.css'; 
import './styles/App.css';

// 🛑 NEW IMPORT: Global CSS for react-phone-input-2 styles (flags, dropdown, etc.)
import 'react-phone-input-2/lib/style.css';


// -----------------------------------------------------------------
// 1. SPLASH LOADER COMPONENT
// -----------------------------------------------------------------
/**
 * Animated colored dots loader with a glowing line on a black background.
 */
import { FaCogs } from 'react-icons/fa'; 

// Styles for the full screen overlay
const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#1E293B', 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
};

// Outer Ring Style (Slower, Clockwise, using 'spin' animation)
const outerRingStyle = {
    width: '60px',
    height: '60px',
    border: '5px solid #374151', 
    borderTop: '5px solid transparent', 
    borderRadius: '50%',
    position: 'absolute', 
    animation: 'spin 2s linear infinite', 
};

// Inner Ring Style (Faster, Counter-Clockwise, uses 'spin-reverse' and 'color-change')
const innerRingStyle = {
    width: '40px',
    height: '40px',
    border: '5px solid #1E293B', 
    borderBottom: '5px solid #6366F1', 
    borderRadius: '50%',
    position: 'absolute', 
    // ADDED: spin-reverse for rotation + color-change for dynamic color
    animation: 'spin-reverse 1.5s linear infinite, color-change 4s ease-in-out infinite alternate', 
};

// Style for the centered icon (Now rotates using 'spin-slow')
const centerIconStyle = {
    position: 'absolute',
    color: '#6366F1', 
    fontSize: '24px', 
    // ADDED: Slow, subtle rotation on the icon
    animation: 'spin-slow 5s linear infinite', 
};


const SplashLoader = () => {
  return (
    <div style={overlayStyle}>
        {/* The stacked effect: Outer Ring and Inner Ring */}
        <div style={outerRingStyle}></div>
        <div style={innerRingStyle}></div> 
        
        {/* CENTRED SETTINGS ICON with custom rotation */}
        <div style={centerIconStyle}>
            <FaCogs />
        </div>
        
        <h4 style={{ 
            color: '#D1D5DB', 
            position: 'absolute', 
            marginTop: '100px', 
            fontSize: '18px' 
        }}>
            Loading...
        </h4>
        
        {/* 🛑 REQUIRED STYLES FOR ANIMATIONS */}
        <style>
            {`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes spin-reverse {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(-360deg); }
                }
                @keyframes spin-slow {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes color-change {
                    0% { border-bottom-color: #6366F1; } /* Indigo */
                    50% { border-bottom-color: #EC4899; } /* Pink */
                    100% { border-bottom-color: #10B981; } /* Emerald */
                }
            `}
        </style>
    </div>
  );
};



// -----------------------------------------------------------------
// 2. MAIN APP COMPONENT (Handles Splash, Auth State, and Routing)
// -----------------------------------------------------------------
function App() {
    // Correctly consuming the context
    const { isAuthenticated, loading } = useAuth();
    
    // Splash State 
    const [showSplash, setShowSplash] = useState(true);

    // EFFECT: Handles the 4-second splash screen delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSplash(false); 
        }, 4000); 

        return () => clearTimeout(timer);
    }, []);

    // --- Conditional Rendering (Splash & Auth Loading) ---
    // If splash is showing, return the splash component.
    if (showSplash) {
        return <SplashLoader />;
    }
    
    // If splash is done, but AuthContext is still loading (checking tokens), 
    // we return the loading state from the context provider.
    // This is crucial for a smooth transition before authentication checks complete.
    if (loading) {
         return <SplashLoader />; 
    }

    // After splash and auth loading, route logic begins
    return (
        <BrowserRouter>
            <Routes>
                {/* Route 1: Login Page (Unprotected) */}
                <Route 
                    path="/login" 
                    element={
                        // If authenticated, navigate to dashboard
                        isAuthenticated 
                            ? <Navigate to="/dashboard" replace />
                            // If not authenticated, show the login page
                            : <LoginPage /> 
                    } 
                />

                {/* Route 2: Registration Page (Unprotected) */}
                <Route 
                    path="/register" 
                    element={
                        // If authenticated, navigate to dashboard
                        isAuthenticated 
                            ? <Navigate to="/dashboard" replace />
                            // If not authenticated, show the registration page
                            : <RegisterPage />
                    } 
                />

                {/* Route 3: Forgot Password Page (Unprotected) */}
                <Route 
                    path="/forgot-password" 
                    element={<ForgotPasswordPage />} 
                />

                {/* Route 4: Protected Routes (The Main App Layout - Home) */}
                {/* The 'path="/*"' route ensures all other paths (like /dashboard, /clients, /settings) 
                    are handled by the <Home /> component if the user is authenticated. 
                    <Home /> will contain another <Routes> block for nested views. */}
                <Route 
                    path="/*" 
                    element={
                        // If authenticated, show the main application (Home)
                        isAuthenticated 
                            ? <Home /> 
                            // If NOT authenticated, redirect any protected route attempt to /login.
                            : <Navigate to="/login" replace />
                    } 
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;