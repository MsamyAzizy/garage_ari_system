// src/App.js - The main application file handling Splash, Authentication, and Routing

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {  } from 'react-icons/fa'; 

// 🛑 IMPORT AuthProvider and useAuth HOOK from your context file
import { useAuth } from './context/AuthContext'; 

// Import Layouts and Pages
import Home from './pages/Home';                  
import LoginPage from './pages/LoginPage';        
import RegisterPage from './pages/RegisterPage';  
import ForgotPasswordPage from './pages/ForgotPasswordPage'; 

// Import CSS files
import './styles/layout.css';
import './styles/dashboard.css'; 
import './styles/drawer.css'; 
import './styles/clients.css'; 
import './styles/App.css';

// 🛑 NEW IMPORT: Global CSS for react-phone-input-2 styles
import 'react-phone-input-2/lib/style.css';

// Define the main colors (consistent with Login/Register)
const ACTIVE_COLOR = '#00bfff'; // Sky Blue
const BACKGROUND_COLOR = '#f0f4f8'; // Light background
const PRIMARY_TEXT_COLOR = '#2c3e50';


// -----------------------------------------------------------------
// 1. SPLASH LOADER COMPONENT (Updated with BEST Sky Blue Theme)
// -----------------------------------------------------------------
const SplashLoader = () => {
    return (
        <div className="app-splash"> 
            
            {/* Logo/Branding Placeholder */}
            <div className="splash-logo-header">
                <h1 className="logo-main-text">Autowork</h1> 
                <p className="logo-sub-text">Auto Repair Management System</p>
            </div>

            {/* Loader Content - The Enhanced Spinner */}
            <div className="circular-spinner-container">
                <div className="circular-spinner">
                    {/* Pure CSS creates the spinning segments */}
                </div>
            </div>
            
            {/* Loading Text */}
            <p className="loading-text">Loading Application...</p>
            
            {/* CSS for the custom UI loader */}
            <style>
                {`
                    /* Splash Screen Container */
                    .app-splash {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        color: ${PRIMARY_TEXT_COLOR};
                        z-index: 9999;
                        font-family: 'Inter', sans-serif;
                        overflow: hidden; 
                        background-color: ${BACKGROUND_COLOR}; 
                        position: relative; 
                    }
                    
                    /* BRANDING STYLES */
                    .splash-logo-header {
                        text-align: center;
                        margin-bottom: 40px;
                    }
                    .logo-main-text {
                        font-size: 56px;
                        color: ${ACTIVE_COLOR}; 
                        font-weight: 900; 
                        margin: 0;
                        text-shadow: 0 4px 10px rgba(0, 191, 255, 0.2);
                        transition: all 0.5s ease;
                    }
                    .logo-sub-text {
                        font-size: 18px;
                        margin-top: 5px;
                        color: #7f8c8d; 
                        font-weight: 500;
                    }

                    /* LOADER VISUAL STYLES (Circular Spinner - Enhanced) */
                    .circular-spinner-container {
                        z-index: 1;
                        animation: pulse 2s infinite ease-in-out;
                    }

                    .circular-spinner {
                        width: 70px; 
                        height: 70px;
                        position: relative;
                        animation: spin 1.5s cubic-bezier(0.5, 0.2, 0.5, 0.8) infinite;
                    }

                    .circular-spinner::before,
                    .circular-spinner::after {
                        content: '';
                        position: absolute;
                        border-radius: 50%;
                        border: 5px solid transparent; 
                        box-sizing: border-box; 
                    }

                    /* Outer Segment (Red and Blue) */
                    .circular-spinner::before {
                        top: 0; left: 0; right: 0; bottom: 0;
                        border-top-color: #e74c3c;    
                        border-right-color: ${ACTIVE_COLOR};  
                        animation: dash-expand 3s ease-in-out infinite alternate;
                    }
                    
                    /* Inner Segment (Yellow and Green) */
                    .circular-spinner::after {
                        top: 10px; left: 10px; right: 10px; bottom: 10px; 
                        border-bottom-color: #f39c12; 
                        border-left-color: #2ecc71;   
                        animation: spin-reverse 2.5s cubic-bezier(0.5, 0.2, 0.5, 0.8) infinite;
                    }
                    
                    .loading-text {
                        margin-top: 30px;
                        font-size: 18px;
                        color: #55606d;
                        font-weight: 600;
                        letter-spacing: 1px;
                    }
                    
                    /* KEYFRAMES */
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }

                    @keyframes spin-reverse {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(-360deg); }
                    }
                    
                    @keyframes pulse {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.02); }
                        100% { transform: scale(1); }
                    }

                    @keyframes dash-expand {
                        0% { border-width: 5px; opacity: 1; }
                        50% { border-width: 6px; opacity: 0.9; }
                        100% { border-width: 5px; opacity: 1; }
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
    // we return the splash loader for a clean visual hold.
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