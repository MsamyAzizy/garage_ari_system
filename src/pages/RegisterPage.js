// src/pages/RegisterPage.js - Updated with Split-Screen appearance and Toast Notification

import React, { useState, useEffect } from 'react'; // 🛑 Added useEffect
import { FaUserPlus, FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash, FaArrowLeft, FaCheckCircle } from 'react-icons/fa'; // 🛑 Added FaCheckCircle
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext'; 

// Define the main active colors (Based on your current input, but defining SUCCESS_COLOR)
const ACTIVE_COLOR = '#3a3a37ff'; 
const ACCENT_PANEL_COLOR = '#3a3a37ff'; 
const PRIMARY_TEXT_COLOR = '#3a3a37ff'; 
const SUCCESS_COLOR = '#2ecc71'; // Green for success toast
const ERROR_COLOR = '#e74c3c';

// -----------------------------------------------------------------
// 1. TOAST NOTIFICATION COMPONENT (Floating Pop-up)
// -----------------------------------------------------------------
const ToastNotification = ({ message, type, onClose }) => {
    
    // React Hook must be called unconditionally
    useEffect(() => {
        if (!message) return; // Exit if no message is present

        // Automatically hide after 1500ms (to match the redirect timer)
        const timer = setTimeout(() => {
            onClose();
        }, 1500); 
        return () => clearTimeout(timer);
    }, [message, onClose]); // Re-run effect when the message changes

    // Only render the JSX if a message is present
    if (!message) return null; 

    // Determine color and icon based on type 
    const color = type === 'success' ? SUCCESS_COLOR : ERROR_COLOR;
    const icon = type === 'success' ? <FaCheckCircle /> : null;

    return (
        <div className="toast-notification-container">
            <div className="toast-content" style={{ backgroundColor: color }}>
                {icon}
                <span className="toast-message">{message}</span>
            </div>
             {/* 🛑 CSS for the Toast Notification */}
            <style jsx>{`
                .toast-notification-container {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 10000;
                    opacity: 0;
                    animation: slide-in 0.5s forwards, fade-out 0.5s 1s forwards; 
                }

                .toast-content {
                    color: white;
                    padding: 12px 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-weight: 600;
                }
                
                .toast-message {
                    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
                }

                @keyframes slide-in {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                /* Start fading out 1 second (1000ms) after animation starts */
                @keyframes fade-out {
                    0% { opacity: 1; }
                    100% { opacity: 0; }
                }
            `}</style>
        </div>
    );
};


/**
 * User Registration Page Component (Split-Screen Design)
 */
const RegisterPage = () => {
    const { register } = useAuth(); 
    const navigate = useNavigate();
    
    // Form States
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState(''); 
    
    // UI States
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false); 
    const [isLoading, setIsLoading] = useState(false); 
    
    const handleSubmit = async (e) => { 
        e.preventDefault();
        setError('');
        setSuccessMessage(''); 

        if (password !== password2) {
            setError("Passwords do not match.");
            return;
        }

        setIsLoading(true);

        try {
            await register(email, password, firstName, lastName);
            
            // 🛑 Set success message, which triggers the Toast
            setSuccessMessage("Registration successful! Redirecting to login...");
            
            setTimeout(() => {
                navigate('/login'); 
            }, 1500); 
            
        } catch (err) {
            // Simplified error handling
            let errorMessage = "Registration failed. Please check your data.";
            
            if (err.response && err.response.data) {
                const data = err.response.data;
                
                if (data.email) {
                    errorMessage = `Email: ${data.email.join(' ')}`;
                } else if (data.password) {
                    errorMessage = `Password: ${data.password.join(' ')}`;
                } else if (data.detail) {
                    errorMessage = data.detail;
                } else {
                    const firstKey = Object.keys(data)[0];
                    if (Array.isArray(data[firstKey])) {
                        errorMessage = `${firstKey.replace(/_/g, ' ')}: ${data[firstKey].join(' ')}`;
                    } else {
                        errorMessage = "An unexpected server error occurred.";
                    }
                }
            }

            setError(errorMessage);
        } finally {
            setIsLoading(false); 
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };
    
    // Use the `Maps` hook for routing to the login page
    const handleLoginClick = () => {
        navigate('/login');
    };


    return (
        <div className="split-login-page">
            
            {/* 🛑 RENDER TOAST HERE */}
            <ToastNotification 
                message={successMessage} 
                type="success" 
                onClose={() => setSuccessMessage('')} 
            />
            
            <div className="split-login-container">
                
                {/* ----------------------------------------------------------------- */}
                {/* LEFT PANEL: Registration Form (White Section) */}
                {/* ----------------------------------------------------------------- */}
                <div className="split-right-panel form-panel"> 
                    <h2 className="login-title">
                        <FaUserPlus style={{ marginRight: '10px', color: ACTIVE_COLOR }} />
                        Create New Account
                    </h2>

                    <form onSubmit={handleSubmit} className="login-form">
                        
                        {/* Name Inputs */}
                        <div className="input-group">
                            <FaUser className="input-icon" />
                            <input
                                type="text"
                                placeholder="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <FaUser className="input-icon" />
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>
                        
                        {/* Email Input Group */}
                        <div className="input-group">
                            <FaEnvelope className="input-icon" />
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
                            <span 
                                className="password-toggle-icon" 
                                onClick={togglePasswordVisibility}
                                role="button"
                                tabIndex="0"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                        
                        {/* Confirm Password Input Group */}
                        <div className="input-group">
                            <FaLock className="input-icon" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Confirm Password"
                                value={password2}
                                onChange={(e) => setPassword2(e.target.value)}
                                required
                            />
                        </div>
                        
                        {error && <p className="error-message">{error}</p>}
                        {/* 🛑 successMessage removed from inline rendering */}

                        <button 
                            type="submit" 
                            className="login-button"
                            disabled={isLoading || successMessage}
                        >
                            {isLoading ? 'Registering...' : 'Complete Registration'}
                        </button>
                    </form>
                </div>
                
                {/* ----------------------------------------------------------------- */}
                {/* RIGHT PANEL: Info & Navigation to Login (Colored Section) */}
                {/* ----------------------------------------------------------------- */}
                <div className="split-left-panel panel-right">
                    
                    {/* Logo/Branding Placeholder */}
                    <div className="panel-header">
                        <h1 className="logo-main-text">Autowork</h1> 
                        <p className="logo-sub-text">Repair Management System</p>
                    </div>

                    <div className="panel-content">
                        <h2 className="welcome-title">Hello, Friend!</h2>
                        <p className="welcome-text">
                            Enter your personal details to start your journey with us.
                        </p>
                        
                        {/* Link to Login */}
                        <button 
                            className="register-link-button" 
                            onClick={handleLoginClick}
                            type="button" 
                        >
                            <FaArrowLeft /> Already have an account?
                        </button>
                    </div>
                </div>
            </div>

            {/* CSS Styling (Adopted from LoginPage) */}
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
                    border-radius: 12px; 
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15), 0 0 1px rgba(0, 0, 0, 0.05); 
                    overflow: hidden;
                    transition: transform 0.3s ease-out;
                }
                .split-login-container:hover {
                    transform: translateY(-2px); 
                }
                
                /* ----------------------------------------------------------------- */
                /* COLORED PANEL (Right Side in Register) */
                /* ----------------------------------------------------------------- */
                .split-left-panel {
                    flex: 1;
                    /* 🛑 ACCENT COLOR */
                    background-color: ${ACCENT_PANEL_COLOR}; 
                    color: white;
                    padding: 40px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    text-align: center;
                }
                
                .panel-header {
                    margin-bottom: 20px;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); 
                }

                .logo-main-text {
                    font-size: 38px;
                    color: white;
                    font-weight: 900; 
                    margin: 0;
                }
                .logo-sub-text {
                    font-size: 15px;
                    margin-top: 5px;
                    color: rgba(255, 255, 255, 0.9); 
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
                    color: rgba(255, 255, 255, 0.95); 
                }

                .register-link-button {
                    background-color: white;
                    color: ${ACCENT_PANEL_COLOR}; 
                    border: 2px solid white; 
                    padding: 12px 25px;
                    border-radius: 25px; 
                    font-size: 16px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: background-color 0.3s, transform 0.1s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    max-width: 300px;
                    margin: 0 auto;
                }

                .register-link-button:hover {
                    background-color: #f0f8ff; 
                    transform: translateY(-2px);
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                }

                /* ----------------------------------------------------------------- */
                /* FORM PANEL (Left Side in Register) */
                /* ----------------------------------------------------------------- */
                .split-right-panel {
                    flex: 1.3; 
                    padding: 40px 50px; 
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    color: ${PRIMARY_TEXT_COLOR};
                }
                
                .login-title {
                    font-weight: 600;
                    font-size: 28px;
                    margin-bottom: 30px; 
                    text-align: center;
                    color: #2c3e50;
                }

                /* Input Field Styling */
                .login-form {
                    width: 100%;
                }
                .input-group { 
                    position: relative; 
                    margin-bottom: 18px; 
                }
                .input-icon { 
                    position: absolute; 
                    left: 15px; 
                    top: 50%; 
                    transform: translateY(-50%); 
                    font-size: 18px; 
                    pointer-events: none; 
                    color: #95a5a6;
                }

                .split-right-panel input {
                    width: 100%; 
                    padding: 15px 15px 15px 50px; 
                    border-radius: 8px;
                    border: 1px solid #e0e6ed; 
                    background-color: #fcfdff; 
                    font-size: 17px; 
                    color: ${PRIMARY_TEXT_COLOR};
                    box-sizing: border-box; 
                    transition: border-color 0.3s, box-shadow 0.3s, background-color 0.3s;
                }
                .split-right-panel input:focus {
                    border-color: ${ACTIVE_COLOR}; 
                    box-shadow: 0 0 8px rgba(44, 62, 80, 0.35); /* Used ACTIVE_COLOR here */
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

                /* Link and Error/Success Styling */
                .error-message { 
                    color: #e74c3c; 
                    margin-bottom: 15px; 
                    font-size: 15px; 
                    font-weight: 600;
                    text-align: center; 
                    padding: 8px;
                    border: 1px solid rgba(231, 76, 60, 0.3);
                    border-radius: 6px;
                    background-color: #fcecec;
                }
                
                /* 🛑 SUCCESS MESSAGE IS NOW HANDLED BY TOAST */
                .success-message {
                    display: none;
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
                    margin-top: 15px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    letter-spacing: 0.5px;
                }
                .login-button:hover:not(:disabled) {
                    /* Changed hover color to a slightly lighter version of the dark blue */
                    background-color: #34495e; 
                    box-shadow: 0 5px 15px rgba(44, 62, 80, 0.5);
                    transform: translateY(-2px); 
                }
                .login-button:disabled {
                    background-color: #34495e; 
                    cursor: not-allowed;
                    opacity: 0.8;
                }

                /* ----------------------------------------------------------------- */
                /* RESPONSIVENESS */
                /* ----------------------------------------------------------------- */
                @media (max-width: 992px) {
                    .split-login-container {
                        min-height: 450px;
                        max-width: 500px;
                        flex-direction: column-reverse; /* Put form on top on mobile */
                    }

                    .split-left-panel {
                        flex: 0 0 120px; /* Make the blue panel shorter */
                        padding: 20px;
                    }
                    
                    .split-left-panel .panel-header {
                        display: none; /* Hide main header on small screen */
                    }
                    
                    .split-left-panel .panel-content {
                        justify-content: center;
                    }
                    
                    .welcome-title, .welcome-text {
                        display: none; /* Hide large text */
                    }
                    
                    .register-link-button {
                         max-width: 100%;
                    }

                    .split-right-panel {
                        flex: 1;
                        padding: 30px 30px;
                    }
                }
            `}</style>
        </div>
    );
};

export default RegisterPage;