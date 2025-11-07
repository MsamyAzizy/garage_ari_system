// src/pages/RegisterPage.js - Handles new user registration

import React, { useState } from 'react';
import { FaUserPlus, FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext'; 

/**
 * User Registration Page Component
 */
const RegisterPage = () => {
    const { register } = useAuth(); 
    const navigate = useNavigate();
    
    // Form States
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState(''); // For password confirmation
    
    // UI States
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // 🚀 NEW: State for success message
    const [showPassword, setShowPassword] = useState(false); 
    const [isLoading, setIsLoading] = useState(false); 
    
    // Assume Dark Mode for styling consistency
    const isDarkMode = true; 

    const handleSubmit = async (e) => { 
        e.preventDefault();
        setError('');
        setSuccessMessage(''); // Clear success message on new submission

        if (password !== password2) {
            setError("Passwords do not match.");
            return;
        }

        setIsLoading(true);

        try {
            // Call the register function (which now only registers, no auto-login)
            await register(email, password, firstName, lastName);
            
            // 🚀 SUCCESS LOGIC: Show message and redirect
            setSuccessMessage("Registration successful! Redirecting to login...");
            
            // Wait a moment for the user to see the success message, then navigate
            setTimeout(() => {
                navigate('/login'); 
            }, 1500); // 1.5 second delay
            
        } catch (err) {
            // 🛑 Simplified Error Handling (since auto-login is removed, the complex nested logic isn't needed)
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
                    // Fallback for unexpected structured errors (e.g., first_name required)
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
    
    // Determine the CSS class for the container
    const pageClass = isDarkMode ? 'login-page dark-mode' : 'login-page light-mode';

    return (
        <div className={pageClass}>
            
            {/* Animated Background */}
            {isDarkMode && (
                <ul className="animated-background-circles">
                    <li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li>
                </ul>
            )}
            
            <div className="login-logo-header">
                <h1 className="logo-main-text">Autowork</h1> 
                <p className="logo-sub-text">Auto Repair Management System</p>
            </div>
            
            <div className="login-box">
                <h2 className="login-title">
                    <FaUserPlus style={{ marginRight: '10px' }} />
                    Register New Account
                </h2>
                
                <form onSubmit={handleSubmit}>
                    {/* Input Fields */}
                    {/* ... (First Name, Last Name, Email, Password, Password Confirmation inputs remain the same) ... */}
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
                    {/* 🚀 NEW: Display Success Message */}
                    {successMessage && <p className="success-message">{successMessage}</p>}


                    <button 
                        type="submit" 
                        className="login-button" 
                        disabled={isLoading || successMessage} // Disable button on loading or success
                    >
                        {isLoading ? 'Registering...' : 'Complete Registration'}
                    </button>
                </form>

                <p 
                    className="forgot-link"
                    onClick={() => navigate('/login')} 
                    style={{ marginTop: '20px' }}
                >
                    Already have an account? **Login here.**
                </p>
            </div>
            
            {/* EMBEDDED CSS (Add style for success message) */}
            <style jsx="true">{`
                /* ... (Rest of existing CSS) ... */
                .login-page {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    overflow: hidden;
                }
                .login-page.dark-mode {
                    background-color: #1a1a2e; /* Dark background */
                    color: #e4e6eb;
                }
                .login-logo-header {
                    text-align: center;
                    margin-bottom: 30px;
                    z-index: 10;
                }
                .logo-main-text {
                    font-size: 3em;
                    font-weight: 700;
                    color: #00bcd4; /* Accent color */
                    letter-spacing: 2px;
                    margin-bottom: 5px;
                }
                .logo-sub-text {
                    font-size: 0.9em;
                    color: #7f8c8d;
                    text-transform: uppercase;
                }
                .login-box {
                    background: rgba(255, 255, 255, 0.05); /* Semi-transparent box */
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 15px;
                    padding: 40px;
                    width: 100%;
                    max-width: 450px;
                    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
                    z-index: 10;
                }
                .login-title {
                    text-align: center;
                    color: #00bcd4;
                    margin-bottom: 30px;
                    font-size: 1.5em;
                    font-weight: 500;
                }
                .input-group {
                    display: flex;
                    align-items: center;
                    margin-bottom: 20px;
                    position: relative;
                    background-color: rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    padding: 0 15px;
                    border: 1px solid transparent;
                    transition: border-color 0.3s;
                }
                .input-group:focus-within {
                    border-color: #00bcd4;
                }
                .input-icon {
                    color: #7f8c8d;
                    margin-right: 15px;
                }
                .input-group input {
                    flex-grow: 1;
                    padding: 15px 0;
                    background: transparent;
                    border: none;
                    color: #e4e6eb;
                    font-size: 1em;
                    outline: none;
                }
                .input-group input::placeholder {
                    color: #a0a0a0;
                }
                .password-toggle-icon {
                    color: #7f8c8d;
                    cursor: pointer;
                    padding-left: 10px;
                }
                .login-button {
                    width: 100%;
                    padding: 15px;
                    border: none;
                    border-radius: 8px;
                    background-color: #00bcd4;
                    color: #1a1a2e;
                    font-size: 1.1em;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.3s, transform 0.1s;
                    margin-top: 10px;
                }
                .login-button:hover:not(:disabled) {
                    background-color: #00a0b7;
                }
                .login-button:disabled {
                    background-color: #34495e;
                    cursor: not-allowed;
                }
                .error-message {
                    color: #e74c3c;
                    text-align: center;
                    margin-bottom: 20px;
                    background-color: rgba(231, 76, 60, 0.1);
                    padding: 10px;
                    border-radius: 5px;
                }
                /* 🚀 NEW SUCCESS MESSAGE STYLE */
                .success-message {
                    color: #27ae60;
                    text-align: center;
                    margin-bottom: 20px;
                    background-color: rgba(39, 174, 96, 0.1);
                    padding: 10px;
                    border-radius: 5px;
                }

                .forgot-link {
                    text-align: center;
                    color: #00bcd4;
                    font-size: 0.9em;
                    cursor: pointer;
                    transition: color 0.3s;
                }
                .forgot-link:hover {
                    color: #e4e6eb;
                }
                
                /* Animated Background Circles */
                .animated-background-circles {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    margin: 0;
                    padding: 0;
                    list-style: none;
                }
                .animated-background-circles li {
                    position: absolute;
                    display: block;
                    list-style: none;
                    width: 20px;
                    height: 20px;
                    background: rgba(255, 255, 255, 0.1);
                    animation: animate-circles 25s linear infinite;
                    bottom: -150px;
                }
                .animated-background-circles li:nth-child(1) { left: 25%; width: 80px; height: 80px; animation-delay: 0s; }
                .animated-background-circles li:nth-child(2) { left: 10%; width: 20px; height: 20px; animation-delay: 2s; animation-duration: 12s; }
                .animated-background-circles li:nth-child(3) { left: 70%; width: 20px; height: 20px; animation-delay: 4s; }
                .animated-background-circles li:nth-child(4) { left: 40%; width: 60px; height: 60px; animation-delay: 0s; animation-duration: 18s; }
                .animated-background-circles li:nth-child(5) { left: 65%; width: 20px; height: 20px; animation-delay: 0s; }
                .animated-background-circles li:nth-child(6) { left: 75%; width: 110px; height: 110px; animation-delay: 3s; }
                .animated-background-circles li:nth-child(7) { left: 35%; width: 150px; height: 150px; animation-delay: 7s; }
                .animated-background-circles li:nth-child(8) { left: 50%; width: 25px; height: 25px; animation-delay: 15s; animation-duration: 45s; }
                .animated-background-circles li:nth-child(9) { left: 20%; width: 15px; height: 15px; animation-delay: 2s; animation-duration: 35s; }
                .animated-background-circles li:nth-child(10) { left: 85%; width: 150px; height: 150px; animation-delay: 11s; }
                
                @keyframes animate-circles {
                    0% { transform: translateY(0) rotate(0deg); opacity: 1; border-radius: 0; }
                    100% { transform: translateY(-1000px) rotate(720deg); opacity: 0; border-radius: 50%; }
                }
            `}</style>
        </div>
    );
};

export default RegisterPage;