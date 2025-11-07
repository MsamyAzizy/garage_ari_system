// src/pages/ForgotPasswordPage.js - FINAL CODE WITH LOGIN APPEARANCE

import React, { useState } from 'react';
import { FaArrowLeft, FaEnvelope, FaLockOpen, FaSun, FaMoon } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    // NOTE: If your main app context manages dark mode, you should fetch this state from context.
    // Keeping local state for isolated testing:
    const [isDarkMode, setIsDarkMode] = useState(true); 
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!email.includes('@')) {
            setError('Please enter a valid email address.');
            return;
        }

        // --- MOCK API CALL ---
        console.log("Password reset requested for:", email);
        
        // Simulate API delay and success response
        setTimeout(() => {
            setMessage(`A password reset link has been sent to ${email}. Check your inbox!`);
            setEmail(''); 
        }, 1500);
    };

    const toggleDarkMode = () => {
        // This will toggle the .dark-theme class on the body (if implemented globally)
        // or just update this page's theme.
        setIsDarkMode(prev => {
            const newMode = !prev;
            // Best practice: Toggle global theme class on the body element
            document.body.classList.toggle('dark-theme', newMode);
            return newMode;
        });
    };
    
    // Use the class to set the page theme and apply the auth styles from App.css
    // We add the 'auth-page' class to hook into the new global auth styles.
    const pageClass = isDarkMode 
        ? 'forgot-password-page dark-theme auth-page' 
        : 'forgot-password-page auth-page';

    return (
        <div className={pageClass}>
            
            {/* CUSTOM DARK MODE TOGGLE SWITCH (Top Left) */}
            <div className={`theme-switch ${isDarkMode ? 'dark' : 'light'}`} onClick={toggleDarkMode}>
                <div className="switch-icon sun-icon"><FaSun /></div>
                <div className="switch-handle"></div>
                <div className="switch-icon moon-icon"><FaMoon /></div>
            </div>

            {/* Animated Background Circles (Only visible in Dark Mode) */}
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

            {/* login-box and input-group classes now use styles from App.css */}
            <div className="login-box forgot-box">
                <h2 className="forgot-title">
                    <FaLockOpen style={{ marginRight: '10px' }} />
                    Reset Password
                </h2>
                
                <p className="forgot-instruction">
                    Enter the email address associated with your account and we'll send you a link to reset your password.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <FaEnvelope className="input-icon" />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={!!message} 
                        />
                    </div>
                    
                    {/* error-message and success-message are still locally styled */}
                    {error && <p className="error-message">{error}</p>}
                    {message && <p className="success-message">{message}</p>}

                    <button 
                        type="submit" 
                        className="login-button" 
                        disabled={!!message} 
                    >
                        Send Reset Link
                    </button>
                </form>

                <p className="back-link" onClick={() => navigate('/login')}>
                    <FaArrowLeft style={{ marginRight: '5px' }} /> Back to Login
                </p>
            </div>

            {/* CSS Styling (REDUCED TO ONLY ESSENTIAL LOCAL STYLES) */}
            <style>{`
                /* ----------------------------------------------------------------- */
                /* LOCAL VARIABLES (Error/Success) & PAGE CONTAINERS */
                /* ----------------------------------------------------------------- */
                
                :root {
                    --primary-color-auth: #00bfff; /* Local color for primary elements */
                    --error-color: #e74c3c;
                    --success-color: #2ecc71;
                }
                
                .forgot-password-page {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    font-family: 'Inter', sans-serif;
                    position: relative; 
                    overflow: hidden;
                    /* Page background and text color are now inherited from App.css body/dark-theme */
                    background-color: var(--background-secondary, #08111a); 
                    color: var(--text-color, #ecf0f1);
                    transition: background 0.5s, color 0.5s; 
                }
                
                /* Title Styles - Using Global App.css variables for consistency */
                .forgot-title {
                    color: var(--primary-color-auth); 
                    margin-bottom: 20px; font-weight: 500; font-size: 26px; padding-bottom: 15px;
                    text-align: center;
                }
                .dark-theme .forgot-title { border-bottom: 1px solid var(--border-color); }
                .light-mode .forgot-title { border-bottom: 1px solid var(--border-color); }
                
                /* Instruction Styles */
                .forgot-instruction {
                    font-size: 15px; text-align: center; margin-bottom: 30px; line-height: 1.5;
                    color: var(--text-muted);
                }

                .success-message {
                    color: var(--success-color); 
                    margin-bottom: 20px; font-size: 15px; text-align: center; font-weight: 600;
                }
                .error-message { 
                    color: var(--error-color); 
                    margin-bottom: 20px; 
                    font-size: 15px; 
                    text-align: center; 
                }
                
                /* Link Color Themeing */
                .back-link {
                    font-size: 14px; margin-top: 30px; cursor: pointer; text-align: center;
                    transition: color 0.2s;
                    color: var(--text-muted);
                }
                .back-link:hover { color: var(--primary-color-auth); }


                /* ----------------------------------------------------------------- */
                /* CUSTOM THEME SWITCH STYLES (Retained locally for complexity) */
                /* ----------------------------------------------------------------- */
                .theme-switch {
                    position: absolute; top: 25px; left: 25px; width: 100px; height: 45px; 
                    background-color: var(--border-color-darker); border-radius: 50px; display: flex;
                    align-items: center; justify-content: space-between; padding: 5px; 
                    cursor: pointer; transition: background-color 0.3s ease;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2); z-index: 10;
                }

                .theme-switch.light { background-color: var(--border-color); }

                .switch-handle {
                    position: absolute; width: 40px; height: 40px; background-color: var(--primary-color-auth); 
                    border-radius: 50%; box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                    transition: transform 0.3s ease, background-color 0.3s ease; left: 5px; 
                }

                .theme-switch.light .switch-handle { transform: translateX(55px); }

                .switch-icon {
                    font-size: 20px; width: 40px; height: 40px; display: flex;
                    align-items: center; justify-content: center; transition: color 0.3s ease;
                }
                /* Icon Colors - Dark Mode */
                .theme-switch.dark .sun-icon { color: rgba(255,255,255,0.4); }
                .theme-switch.dark .moon-icon { color: var(--primary-color-auth); }
                /* Icon Colors - Light Mode */
                .theme-switch.light .sun-icon { color: var(--primary-color-auth); }
                .theme-switch.light .moon-icon { color: rgba(0,0,0,0.4); }


                /* ----------------------------------------------------------------- */
                /* ANIMATED BACKGROUND STYLES (Retained locally) */
                /* ----------------------------------------------------------------- */
                .animated-background-circles {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden;
                    margin: 0; padding: 0; list-style: none; z-index: 0; 
                }
                .light-mode .animated-background-circles { display: none; }
                .animated-background-circles li {
                    position: absolute; display: block; list-style: none; width: 20px; height: 20px;
                    background: rgba(44, 62, 80, 0.1); animation: animate 25s linear infinite; 
                    bottom: -150px; border-radius: 50%; box-shadow: 0 0 5px rgba(44, 62, 80, 0.5); 
                }
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

            `}</style>
        </div>
    );
};

export default ForgotPasswordPage;