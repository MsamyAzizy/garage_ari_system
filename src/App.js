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

// 🛑 NEW IMPORT: Request Service Form Component
import RequestServiceForm from './components/RequestServiceForm';

// Import CSS files
import './styles/layout.css';
import './styles/dashboard.css'; 
import './styles/drawer.css'; 
import './styles/clients.css'; 
import './styles/App.css';

// 🛑 NEW IMPORT: Global CSS for react-phone-input-2 styles
import 'react-phone-input-2/lib/style.css';
// --- COLOR DEFINITIONS FOR MODERN LIGHT THEME ---
const BACKGROUND_COLOR = '#ffffff';     // Pure white background
const PRIMARY_SPINNER_COLOR = '#3a3a37ff'; // Google Blue for a professional, vibrant look
const SHADOW_COLOR = 'rgba(66, 133, 244, 0.4)'; // Blue shadow
const SPINNER_SIZE = '50px';             // Slightly larger for better visual weight

// -----------------------------------------------------------------
// 1. SPLASH VISUAL COMPONENT 
// -----------------------------------------------------------------
const SplashVisual = () => (
    <div className="app-splash"> 
        <div className="bar-spinner-container">
            <div className="bar bar-1"></div>
            <div className="bar bar-2"></div>
            <div className="bar bar-3"></div>
            <div className="bar bar-4"></div>
            <div className="bar bar-5"></div>
        </div>
        
        <style>
            {`
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
                    color: ${PRIMARY_SPINNER_COLOR};
                    z-index: 9999;
                    font-family: 'Inter', sans-serif;
                    overflow: hidden; 
                    background-color: ${BACKGROUND_COLOR}; 
                    position: relative; 
                }
                
                .bar-spinner-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: ${SPINNER_SIZE};
                    height: ${SPINNER_SIZE};
                }

                .bar {
                    width: 5px;
                    height: 100%;
                    background-color: ${PRIMARY_SPINNER_COLOR};
                    margin: 0 2px;
                    display: inline-block;
                    animation: bar-stretch 1s infinite ease-in-out;
                    border-radius: 3px;
                    box-shadow: 0 0 5px ${SHADOW_COLOR};
                }
                
                .bar-1 { animation-delay: -1.0s; }
                .bar-2 { animation-delay: -0.8s; }
                .bar-3 { animation-delay: -0.6s; }
                .bar-4 { animation-delay: -0.4s; }
                .bar-5 { animation-delay: -0.2s; }

                @keyframes bar-stretch {
                    0%, 100% { transform: scaleY(0.1); opacity: 0.5; }
                    50% { transform: scaleY(1.0); opacity: 1; }
                }

                .splash-logo-header,
                .logo-main-text,
                .logo-sub-text,
                .loading-text,
                .dots-loader-container {
                    display: none !important;
                }
            `}
        </style>
    </div>
);

// -----------------------------------------------------------------
// 2. SPLASH LOADER COMPONENT (Handles logic)
// -----------------------------------------------------------------
const SplashLoader = ({ onLoaded }) => {
    useEffect(() => {
        if (onLoaded) { 
             const timer = setTimeout(() => {
                onLoaded(); 
            }, 3000); 
            return () => clearTimeout(timer);
        }
    }, [onLoaded]); 
    return <SplashVisual />;
};

// -----------------------------------------------------------------
// 3. MAIN APP COMPONENT (Handles Splash, Auth State, and Routing)
// -----------------------------------------------------------------
function App() {
    const { isAuthenticated, loading } = useAuth();
    const [showSplash, setShowSplash] = useState(true);

    const handleSplashLoaded = () => {
        setShowSplash(false);
    };

    if (showSplash) {
        return <SplashLoader onLoaded={handleSplashLoaded} />;
    }
    
    if (loading) {
         return <SplashLoader />; 
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route 
                    path="/login" 
                    element={
                        isAuthenticated 
                            ? <Navigate to="/dashboard" replace />
                            : <LoginPage /> 
                    } 
                />

                <Route 
                    path="/register" 
                    element={
                        isAuthenticated 
                            ? <Navigate to="/dashboard" replace />
                            : <RegisterPage />
                    } 
                />

                <Route 
                    path="/forgot-password" 
                    element={<ForgotPasswordPage />} 
                />

                {/* New Route: Request Service Form */}
                <Route 
                    path="/request-service" 
                    element={<RequestServiceForm />} 
                />

                <Route 
                    path="/*" 
                    element={
                        isAuthenticated 
                            ? <Home /> 
                            : <Navigate to="/login" replace />
                    } 
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
