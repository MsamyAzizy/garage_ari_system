// src/pages/LoginPage.js - Updated with real AuthContext and new split-screen appearance

import React, { useState } from 'react';
import { FaUser, FaLock, FaSignInAlt, FaEye, FaEyeSlash, FaArrowRight } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom'; 

// IMPORT the useAuth hook
import { useAuth } from '../context/AuthContext'; 

// Define the main active color
const ACTIVE_COLOR = '#2c3e50'; // Sky Blue (Used for buttons, icons, focus)
const LEFT_PANEL_COLOR = '#2c3e50'; // New Dark Blue Accent
const PRIMARY_TEXT_COLOR = '#2c3e50'; 

/**
 * Animated four-segment spinner for use inside the login button.
 */
const MiniSpinner = () => <div className="button-spinner"></div>;


/**
 * Basic Login Page Component (Split-Screen Design)
 * Handles user authentication via AuthContext.
 */
const LoginPage = () => {
    // Get the login function from the Auth context
    const { login } = useAuth(); 
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false); 
    const [isLoading, setIsLoading] = useState(false); 
    
    const navigate = useNavigate(); 
    
    // NOTE: Dark mode logic and state are removed as requested.

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true); 

        try {
            // REAL AUTHENTICATION LOGIC using AuthContext
            await login(email, password);
            
            // Success: App.js handles navigation to /dashboard.

        } catch (err) {
            // Failure: Catch network or API error (e.g., 401 Invalid Credentials)
            setError("Login failed. Please verify your email and password.");
        } finally {
            setIsLoading(false); 
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    // Use the `Maps` hook for routing to the registration page
    const handleRegisterClick = () => {
        navigate('/register');
    };

    // Use the `Maps` hook for routing to the forgot password page
    const handleForgotClick = () => {
        navigate('/forgot-password');
    };

    return (
        <div className="split-login-page">
            
            <div className="split-login-container">
                
                {/* ----------------------------------------------------------------- */}
                {/* LEFT PANEL: Branding & Navigation to Register (Colored Section) */}
                {/* ----------------------------------------------------------------- */}
                <div className="split-left-panel">
                    
                    {/* Logo/Branding Placeholder */}
                    <div className="panel-header">
                        {/* The logo text remains white as the background is now dark */}
                        <h1 className="logo-main-text">Autowork</h1> 
                        <p className="logo-sub-text">Repair Management System</p>
                    </div>

                    <div className="panel-content">
                        <h2 className="welcome-title">Welcome Back!</h2>
                        <p className="welcome-text">
                            To keep connected with us, please sign in with your account credentials.
                        </p>
                        
                        {/* Link to Registration */}
                        <button 
                            className="register-link-button" 
                            onClick={handleRegisterClick}
                            type="button" // Important for forms
                        >
                            Create New Account <FaArrowRight />
                        </button>
                    </div>
                </div>

                {/* ----------------------------------------------------------------- */}
                {/* RIGHT PANEL: Login Form (White Section) */}
                {/* ----------------------------------------------------------------- */}
                <div className="split-right-panel">
                    <h2 className="login-title">
                        <FaSignInAlt style={{ marginRight: '10px', color: ACTIVE_COLOR }} />
                        Secure Sign In
                    </h2>

                    <form onSubmit={handleSubmit} className="login-form">
                        
                        {/* Email Input Group */}
                        <div className="input-group">
                            <FaUser className="input-icon" />
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        
                        {/* Password Input Group */}
                        <div className="input-group">
                            <FaLock className="input-icon" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            {/* The Toggle Icon */}
                            <span 
                                className="password-toggle-icon" 
                                onClick={togglePasswordVisibility}
                                role="button"
                                tabIndex="0"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                        
                        {error && <p className="error-message">{error}</p>}

                        <button 
                            type="submit" 
                            className="login-button"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="loading-content">
                                    <MiniSpinner /> Authenticating...
                                
                                </span>
                            ) : (
                                'Login to Dashboard'
                            )}
                        </button>
                        
                        <p 
                            className="forgot-link"
                            onClick={handleForgotClick} 
                        >
                            Forgot your password?
                        </p>
                    </form>
                </div>
            </div>

            {/* CSS Styling (UPDATED for BEST Appearance) */}
            <style>{`
                /* ----------------------------------------------------------------- */
                /* GLOBAL PAGE STYLES */
                /* ----------------------------------------------------------------- */
                body {
                    background-color: #f0f4f8 !important; 
                    transition: background-color 0.5s;
                }

                .split-login-page {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    font-family: 'Inter', sans-serif;
                    background-color: #f0f4f8; 
                }

                /* ----------------------------------------------------------------- */
                /* SPLIT CONTAINER STYLES (Improved Shadow) */
                /* ----------------------------------------------------------------- */
                .split-login-container {
                    display: flex;
                    width: 900px;
                    max-width: 90%;
                    min-height: 550px;
                    background: #ffffff;
                    border-radius: 12px; /* Slightly smaller radius */
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15), 0 0 1px rgba(0, 0, 0, 0.05); /* Softer, deeper shadow */
                    overflow: hidden;
                    transition: transform 0.3s ease-out;
                }
                .split-login-container:hover {
                    /* Subtle lift on hover */
                    transform: translateY(-2px); 
                }

                /* ----------------------------------------------------------------- */
                /* LEFT PANEL (Dark Blue Section - Sharper look) */
                /* ----------------------------------------------------------------- */
                .split-left-panel {
                    flex: 1;
                    /* 🛑 UPDATED COLOR HERE */
                    background-color: ${LEFT_PANEL_COLOR}; 
                    color: white;
                    padding: 40px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    text-align: center;
                }
                
                .panel-header {
                    margin-bottom: 20px;
                    /* Ensure logo is very clear */
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); 
                }

                .logo-main-text {
                    font-size: 38px;
                    color: white;
                    font-weight: 900; /* Bolder */
                    margin: 0;
                }
                .logo-sub-text {
                    font-size: 15px;
                    margin-top: 5px;
                    color: rgba(255, 255, 255, 0.9); /* Sharper white */
                }
                
                .panel-content {
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                .welcome-title {
                    font-size: 36px;
                    font-weight: 700;
                    margin-bottom: 15px;
                }
                .welcome-text {
                    font-size: 16px;
                    line-height: 1.6;
                    margin-bottom: 30px;
                    color: rgba(255, 255, 255, 0.95); /* Better contrast */
                }

                .register-link-button {
                    background-color: white;
                    color: ${LEFT_PANEL_COLOR}; // Button text color matches the background color now
                    border: 2px solid white; /* Added border for definition */
                    padding: 12px 25px;
                    border-radius: 25px; /* Pill shape for secondary action */
                    font-size: 16px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: background-color 0.3s, transform 0.1s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    max-width: 250px;
                    margin: 0 auto;
                }

                .register-link-button:hover {
                    background-color: #f0f8ff; /* Very light hover */
                    transform: translateY(-2px);
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                }

                /* ----------------------------------------------------------------- */
                /* RIGHT PANEL (Login Form Section) */
                /* ----------------------------------------------------------------- */
                .split-right-panel {
                    flex: 1.2; 
                    padding: 50px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    color: ${PRIMARY_TEXT_COLOR};
                }

                .login-title {
                    font-weight: 600;
                    font-size: 28px;
                    margin-bottom: 40px;
                    text-align: center;
                    color: #2c3e50;
                }

                /* Input Field Styling */
                .login-form {
                    width: 100%;
                }
                .input-group { 
                    position: relative; 
                    margin-bottom: 25px; 
                }
                .input-icon { 
                    position: absolute; 
                    left: 15px; 
                    top: 50%; 
                    transform: translateY(-50%); 
                    font-size: 18px; 
                    pointer-events: none; 
                    color: #95a5a6; /* Softer gray icon */
                }

                .split-right-panel input {
                    width: 100%; 
                    padding: 15px 15px 15px 50px; 
                    border-radius: 8px;
                    border: 1px solid #e0e6ed; /* Lighter border */
                    background-color: #fcfdff; /* Off-white background */
                    font-size: 17px; 
                    color: ${PRIMARY_TEXT_COLOR};
                    box-sizing: border-box; 
                    transition: border-color 0.3s, box-shadow 0.3s, background-color 0.3s;
                }
                .split-right-panel input:focus {
                    border-color: ${ACTIVE_COLOR}; 
                    box-shadow: 0 0 8px rgba(0, 191, 255, 0.35); /* Brighter glow */
                    outline: none;
                    background-color: white;
                }
                
                /* Password Toggle Icon Styling */
                .password-toggle-icon {
                    position: absolute; 
                    right: 15px; 
                    top: 50%; 
                    transform: translateY(-50%); 
                    color: #95a5a6; 
                    cursor: pointer; 
                    font-size: 18px; 
                    transition: color 0.2s ease;
                }
                .password-toggle-icon:hover { 
                    color: ${ACTIVE_COLOR}; 
                }

                /* Link and Error Styling */
                .error-message { 
                    color: #e74c3c; 
                    margin-bottom: 20px; 
                    font-size: 15px; 
                    font-weight: 600;
                    text-align: center; 
                }
                
                .forgot-link {
                    font-size: 15px; 
                    margin-top: 20px; 
                    cursor: pointer; 
                    text-align: center; 
                    transition: color 0.2s; 
                    color: #7f8c8d; /* Muted link color */
                }
                .forgot-link:hover { 
                    color: ${ACTIVE_COLOR}; 
                    text-decoration: underline;
                }

                /* Button Styling */
                .login-button {
                    width: 100%; 
                    padding: 16px; 
                    background-color: ${ACTIVE_COLOR}; 
                    color: white; 
                    border: none;
                    border-radius: 8px; 
                    font-size: 18px; 
                    font-weight: 700; 
                    cursor: pointer;
                    transition: background-color 0.3s, transform 0.1s, box-shadow 0.3s;
                    margin-top: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    letter-spacing: 0.5px;
                }
                .login-button:hover:not(:disabled) {
                    background-color: #00a3e6; 
                    box-shadow: 0 5px 15px rgba(0, 191, 255, 0.5);
                    transform: translateY(-2px); /* Slightly stronger lift */
                }
                .login-button:disabled {
                    background-color: #00a3e6; 
                    cursor: not-allowed;
                    opacity: 0.8;
                }
                .loading-content {
                    display: flex; 
                    align-items: center; 
                    gap: 10px;
                }
                
                /* ----------------------------------------------------------------- */
                /* MINI SPINNER STYLES FOR BUTTON (No Change) */
                /* ----------------------------------------------------------------- */
                .button-spinner {
                    width: 20px; 
                    height: 20px;
                    position: relative; 
                    animation: spin 1.8s linear infinite; 
                }

                .button-spinner::before,
                .button-spinner::after {
                    content: '';
                    position: absolute;
                    border-radius: 50%;
                    border: 2px solid transparent; 
                    box-sizing: border-box; 
                }

                .button-spinner::before {
                    top: 0; left: 0; right: 0; bottom: 0;
                    border-top-color: #e74c3c;
                    border-left-color: #f1c40f; 
                    animation: arc-grow-shrink 2s ease-in-out infinite alternate; 
                }

                .button-spinner::after {
                    top: 4px; left: 4px; right: 4px; bottom: 4px; 
                    border-bottom-color: #2ecc71;
                    border-right-color: #3498db;
                    animation: arc-grow-shrink-reverse 2s ease-in-out infinite alternate; 
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                @keyframes arc-grow-shrink {
                    0% { border-width: 2px; transform: scale(1); opacity: 1; }
                    50% { border-width: 3px; transform: scale(0.9); opacity: 0.8; }
                    100% { border-width: 2px; transform: scale(1); opacity: 1; }
                }

                @keyframes arc-grow-shrink-reverse {
                    0% { border-width: 2px; transform: scale(1); opacity: 1; }
                    50% { border-width: 3px; transform: scale(1.1); opacity: 0.8; }
                    100% { border-width: 2px; transform: scale(1); opacity: 1; }
                }

                /* ----------------------------------------------------------------- */
                /* RESPONSIVENESS */
                /* ----------------------------------------------------------------- */
                @media (max-width: 992px) {
                    .split-login-container {
                        min-height: 450px;
                        max-width: 500px;
                        flex-direction: column;
                    }

                    .split-left-panel {
                        display: none; 
                    }
                    
                    .split-right-panel {
                        flex: 1;
                        padding: 40px 30px;
                    }
                }
            `}</style>
        </div>
    );
};

export default LoginPage;