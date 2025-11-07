// src/pages/LoginPage.js - Updated with real AuthContext and authentication logic

import React, { useState } from 'react';
import { FaUser, FaLock, FaSignInAlt, FaEye, FaEyeSlash, FaSun, FaMoon } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom'; 

//  IMPORT the useAuth hook
import { useAuth } from '../context/AuthContext'; 

/**
 * Animated four-segment spinner for use inside the login button.
 * The visual segments are created using CSS pseudo-elements.
 */
const MiniSpinner = () => <div className="button-spinner"></div>;


/**
 * Basic Login Page Component
 * Handles user authentication via AuthContext and theme toggling.
 */
const LoginPage = () => {
    // Get the login function from the Auth context
    const { login } = useAuth(); 
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false); 
    const [isLoading, setIsLoading] = useState(false); // New state for loading indicator
    
    const navigate = useNavigate(); 
    
    // State for Dark Mode (Starts as dark mode based on current theme)
    const [isDarkMode, setIsDarkMode] = useState(true);

    const handleSubmit = async (e) => { // Made function async
        e.preventDefault();
        setError('');
        setIsLoading(true); // Start loading

        try {
            //  REAL AUTHENTICATION LOGIC using AuthContext
            await login(email, password);
            
            // Success: No need to navigate here. App.js automatically detects 
            // isAuthenticated=true and navigates to /dashboard.

        } catch (err) {
            // Failure: Catch network or API error (e.g., 401 Invalid Credentials)
            // console.error("Login attempt failed:", err.response ? err.response.data : err.message);
            setError("Login failed. Please verify your email and password.");
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    const toggleDarkMode = () => {
        setIsDarkMode(prev => !prev);
    };

    // Determine the CSS class for the container
    const pageClass = isDarkMode ? 'login-page dark-mode' : 'login-page light-mode';

    return (
        <div className={pageClass}>
            
            {/* The animated background circles are hidden in light mode for simplicity */}
            {isDarkMode && (
                <ul className="animated-background-circles">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            )}

            {/* CUSTOM DARK MODE TOGGLE SWITCH (Top Left) */}
            <div className={`theme-switch ${isDarkMode ? 'dark' : 'light'}`} onClick={toggleDarkMode}>
                <div className="switch-icon sun-icon"><FaSun /></div>
                <div className="switch-handle"></div>
                <div className="switch-icon moon-icon"><FaMoon /></div>
            </div>


            {/* Logo/Branding Placeholder */}
            <div className="login-logo-header">
                <h1 className="logo-main-text">Autowork</h1> 
                <p className="logo-sub-text">Auto Repair Management System</p>
            </div>
            
            <div className="login-box">
                <h2 className="login-title">
                    <FaSignInAlt style={{ marginRight: '10px' }} />
                    Secure Sign In
                </h2>
                
                <form onSubmit={handleSubmit}>
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
                        disabled={isLoading} //  Disable during loading
                    >
                        {isLoading ? (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                <MiniSpinner /> Authenticating...
                            </span>
                        ) : (
                            'Login to Dashboard'
                        )}
                    </button>
                </form>

                <p 
                    className="forgot-link"
                    onClick={() => navigate('/forgot-password')} 
                >
                    Forgot your password?
                </p>
            </div>

            {/* CSS Styling (UPDATED with button-spinner styles) */}
            <style>{`
                /* ----------------------------------------------------------------- */
                /* GLOBAL SPLASH/LOADING BACKGROUND FIX */
                /* ----------------------------------------------------------------- */
                body {
                    /* Ensures the initial background (splash) is the same dark color */
                    background-color: #08111a !important; 
                    transition: background-color 0.5s;
                }
                
                /* ----------------------------------------------------------------- */
                /* GLOBAL STYLES & DARK MODE DEFAULTS */
                /* ----------------------------------------------------------------- */
                .login-page {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    font-family: 'Inter', sans-serif;
                    position: relative; 
                    overflow: hidden; 
                    transition: background 0.5s, color 0.5s; 
                }
                
                .dark-mode {
                    background: #08111a; 
                    color: #ecf0f1;
                }
                
                .light-mode {
                    background: #f0f4f8; 
                    color: #34495e; 
                }

                /* ----------------------------------------------------------------- */
                /* CUSTOM THEME SWITCH STYLES (NEW) */
                /* ----------------------------------------------------------------- */
                .theme-switch {
                    position: absolute;
                    top: 25px; /* Adjust as needed */
                    left: 25px; /* Adjust as needed */
                    width: 100px; /* Width of the entire switch */
                    height: 45px; /* Height of the entire switch */
                    background-color: #34495e; /* Default background for switch track */
                    border-radius: 50px; /* Pill shape */
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 5px; /* Padding for icons */
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                    z-index: 10;
                }

                /* Light mode background for the switch track */
                .theme-switch.light {
                    background-color: #d9e2ec; /* Lighter track */
                }

                /* Switch Handle */
                .switch-handle {
                    position: absolute;
                    width: 40px; /* Size of the circular handle */
                    height: 40px;
                    background-color: #00bfff; /* Active color */
                    border-radius: 50%;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                    transition: transform 0.3s ease, background-color 0.3s ease;
                    left: 5px; /* Initial position for dark mode (left side) */
                }

                /* Handle position for light mode */
                .theme-switch.light .switch-handle {
                    transform: translateX(55px); /* Move to the right (100px - 40px - 5px - 5px = 50px, add a bit more) */
                }

                /* Icons inside the switch */
                .switch-icon {
                    font-size: 20px;
                    width: 40px; /* Occupy space for centering */
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: color 0.3s ease;
                }

                /* Sun icon in dark mode (inactive/faded) */
                .theme-switch.dark .sun-icon {
                    color: rgba(255,255,255,0.4); /* Faded white */
                }
                /* Sun icon in light mode (active/bright) */
                .theme-switch.light .sun-icon {
                    color: #00bfff; /* Active blue */
                }
                /* Moon icon in dark mode (active/bright) */
                .theme-switch.dark .moon-icon {
                    color: #00bfff; /* Active blue */
                }
                /* Moon icon in light mode (inactive/faded) */
                .theme-switch.light .moon-icon {
                    color: rgba(0,0,0,0.4); /* Faded black */
                }

                /* ----------------------------------------------------------------- */
                /* ANIMATED BACKGROUND CIRCLES (Only apply in Dark Mode) */
                /* ----------------------------------------------------------------- */
                .animated-background-circles {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden;
                    margin: 0; padding: 0; list-style: none; z-index: 0; 
                }
                .animated-background-circles li {
                    position: absolute; display: block; list-style: none; width: 20px; height: 20px;
                    background: rgba(44, 62, 80, 0.1); 
                    animation: animate 25s linear infinite; bottom: -150px; border-radius: 50%;
                    box-shadow: 0 0 5px rgba(44, 62, 80, 0.5); 
                }
                /* Individual animation variations */
                .animated-background-circles li:nth-child(1) { left: 25%; width: 80px; height: 80px; animation-delay: 0s; }
                .animated-background-circles li:nth-child(2) { left: 10%; width: 20px; height: 20px; animation-delay: 2s; animation-duration: 12s; }
                .animated-background-circles li:nth-child(3) { left: 70%; width: 20px; height: 20px; animation-delay: 4s; }
                .animated-background-circles li:nth-child(4) { left: 40%; width: 60px; height: 60px; animation-delay: 0s; animation-duration: 18s; }
                .animated-background-circles li:nth-child(5) { left: 65%; width: 20px; height: 20px; animation-delay: 0s; }
                .animated-background-circles li:nth-child(6) { left: 75%; width: 110px; height: 110px; animation-delay: 3s; animation-duration: 10s; }
                .animated-background-circles li:nth-child(7) { left: 35%; width: 150px; height: 150px; animation-delay: 7s; }
                .animated-background-circles li:nth-child(8) { left: 50%; width: 25px; height: 25px; animation-delay: 15s; animation-duration: 45s; }
                .animated-background-circles li:nth-child(9) { left: 20%; width: 15px; height: 15px; animation-delay: 2s; animation-duration: 35s; }
                .animated-background-circles li:nth-child(10) { left: 85%; width: 150px; height: 150px; animation-delay: 11s; animation-duration: 11s; }

                @keyframes animate {
                    0% { transform: translateY(0) rotate(0deg); opacity: 0.8; border-radius: 0; }
                    100% { transform: translateY(-1000px) rotate(720deg); opacity: 0; border-radius: 50%; }
                }
                
                /* ----------------------------------------------------------------- */
                /* LOGIN BOX AND CONTENT STYLES (Theme Dependent) */
                /* ----------------------------------------------------------------- */
                .login-logo-header { margin-bottom: 25px; text-align: center; z-index: 1; }
                
                /* Logo Text Styling */
                .logo-main-text {
                    font-size: 38px; color: #00bfff; font-weight: 800; margin: 0;
                    text-shadow: 0 0 10px rgba(0, 191, 255, 0.3);
                }
                .logo-sub-text {
                    font-size: 15px; margin-top: 5px; transition: color 0.5s;
                }
                /* Sub-text color in Light Mode */
                .light-mode .logo-sub-text {
                    color: #55606d; 
                }
                /* Sub-text color in Dark Mode */
                .dark-mode .logo-sub-text {
                    color: #7f8c8d; 
                }


                /* Box Styles - Dark Mode */
                .dark-mode .login-box {
                    background: #18222c;
                    border: 1px solid #34495e;
                    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.05);
                }
                /* Box Styles - Light Mode */
                .light-mode .login-box {
                    background: #ffffff;
                    border: 1px solid #c9d7e5; 
                    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05);
                }

                .login-box {
                    padding: 50px 40px; border-radius: 16px; width: 400px; max-width: 90%; 
                    min-height: 400px; display: flex; flex-direction: column;
                    justify-content: center; transition: all 0.5s ease; z-index: 1; 
                }
                
                .dark-mode .login-title { color: #ecf0f1; border-bottom: 1px solid #2c3e50; }
                .light-mode .login-title { color: #2c3e50; border-bottom: 1px solid #c9d7e5; }

                .login-title { margin-bottom: 35px; font-weight: 500; font-size: 26px; padding-bottom: 15px; text-align: center; }

                /* Input Field Styling */
                .input-group { position: relative; margin-bottom: 30px; }
                .login-page .input-icon { 
                    position: absolute; left: 15px; top: 50%; transform: translateY(-50%); 
                    font-size: 18px; pointer-events: none; transition: color 0.5s; 
                }

                /* Input Styles - Dark Mode */
                .dark-mode input {
                    background-color: #0f1c2b; border: 1px solid #34495e; color: #ecf0f1; 
                }
                .dark-mode .input-icon { color: #7f8c8d; }

                /* Input Styles - Light Mode */
                .light-mode input {
                    background-color: #f7f9fb; border: 1px solid #c9d7e5; color: #2c3e50;
                }
                .light-mode .input-icon { color: #55606d; } 

                .login-page input {
                    width: 100%; padding: 16px 15px 16px 50px; border-radius: 10px;
                    font-size: 17px; box-sizing: border-box; transition: border-color 0.3s, box-shadow 0.3s, background-color 0.5s, color 0.5s;
                }
                .login-page input:focus {
                    border-color: #00bfff; box-shadow: 0 0 10px rgba(0, 191, 255, 0.5); outline: none;
                }
                
                /* Password Toggle Icon Styling */
                .password-toggle-icon {
                    position: absolute; right: 15px; top: 50%; transform: translateY(-50%); 
                    color: #7f8c8d; cursor: pointer; font-size: 18px; transition: color 0.2s ease;
                }
                .password-toggle-icon:hover { color: #00bfff; }

                /* Link and Error Styling */
                .error-message { color: #e74c3c; margin-bottom: 20px; font-size: 15px; text-align: center; }
                
                .forgot-link {
                    font-size: 14px; margin-top: 30px; cursor: pointer; text-align: center; transition: color 0.2s; 
                }

                /* Link Color Themeing */
                .dark-mode .forgot-link { color: #7f8c8d; }
                .light-mode .forgot-link { color: #55606d; }
                .forgot-link:hover { color: #00bfff; }

                /* Button Styling (Stays blue in both modes) */
                .login-button {
                    width: 100%; padding: 16px; background-color: #00bfff; color: white; border: none;
                    border-radius: 10px; font-size: 19px; font-weight: 700; cursor: pointer;
                    letter-spacing: 0.8px; transition: background-color 0.3s, transform 0.1s, box-shadow 0.3s;
                    margin-top: 25px;
                }
                .login-button:hover:not(:disabled) {
                    background-color: #0099e6; box-shadow: 0 5px 20px rgba(0, 191, 255, 0.4);
                    transform: translateY(-1px);
                }
                .login-button:disabled {
                    background-color: #0099e6; /* Slightly darker when disabled */
                    cursor: not-allowed;
                    opacity: 0.7;
                }
                
                /* ----------------------------------------------------------------- */
                /* 🌟 UPDATED: MINI SPINNER STYLES FOR BUTTON (Segmented Arcs) 🌟 */
                /* ----------------------------------------------------------------- */
                .button-spinner {
                    width: 20px; 
                    height: 20px;
                    position: relative; 
                    /* Use the main rotation keyframe name */
                    animation: spin 1.8s linear infinite; 
                }

                .button-spinner::before,
                .button-spinner::after {
                    content: '';
                    position: absolute;
                    border-radius: 50%;
                    /* Use a slightly smaller border width for the button */
                    border: 2px solid transparent; 
                    box-sizing: border-box; 
                }

                .button-spinner::before {
                    top: 0; left: 0; right: 0; bottom: 0;
                    border-top-color: #e74c3c;    /* Red arc */
                    border-left-color: #3498db;   /* Blue arc */
                    /* Re-use the keyframes or define new ones scaled for speed */
                    animation: arc-grow-shrink 2s ease-in-out infinite alternate; 
                }

                .button-spinner::after {
                    /* Smaller inner circle by inset */
                    top: 4px; left: 4px; right: 4px; bottom: 4px; 
                    border-top-color: #f39c12;    /* Yellow arc */
                    border-right-color: #1abc9c;  /* Green arc */
                    /* Re-use the keyframes or define new ones scaled for speed */
                    animation: arc-grow-shrink-reverse 2s ease-in-out infinite alternate; 
                }

                /* Keyframes for the button spinner rotation (can be the same as the main spinner's rotation) */
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                /* Keyframes for arc growing and shrinking (copied from global CSS, scaled down) */
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
            `}</style>
        </div>
    );
};

export default LoginPage;