// src/pages/LoginPage.js

import React, { useState } from 'react';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaArrowRight, FaCopyright, FaWhatsapp, FaEnvelope } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom'; 
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import { useAuth } from '../context/AuthContext'; 

// Define the main active colors
const ACTIVE_COLOR = '#3a3a37ff'; // Dark Blue (Used for focus, icons, and button text)
const LEFT_PANEL_COLOR = '#3a3a37ff'; // Dark Blue Accent (Kept for the left panel)
const PRIMARY_TEXT_COLOR = '#3a3a37ff'; 

// --- 🔶 Navbar Colors ---
const NAV_BACKGROUND_COLOR = '#252524ff'; // Very Dark Grey/Black for Navbar/Footer
const NAV_BUTTON_COLOR = '#ff884a'; // Bright orange for CTA
const NAV_TEXT_COLOR = '#f0f4f8'; // Light color for links and text
// -----------------------------

// --- 📞 Appointment Configuration ---
const WHATSAPP_NUMBER = '255762292250';
const SUPPORT_EMAIL = 'azizomary99@gmail.com'; // Your specified email
const DEFAULT_WHATSAPP_MESSAGE = 'Hello, I would like to schedule an appointment for service. Can you assist me?';
const DEFAULT_EMAIL_SUBJECT = 'Service Appointment Request';
// ----------------------------------


/**
 * Animated four-segment spinner for use inside the login button.
 */
const MiniSpinner = () => <div className="button-spinner"></div>;


// -------------------------------------------------------------------------
// 🚀 GLOBAL COMPONENT: Global Navbar
// -------------------------------------------------------------------------
const GlobalNavbar = () => {
    const navigate = useNavigate();
    // 🛑 STATE to control the visibility of the WhatsApp/Email options
    const [showOptions, setShowOptions] = useState(false); 

    // Define handlers for the new buttons
    const handleRequestService = () => {
        navigate('/request-service');
        setShowOptions(false); 
    };
    
    // Toggles the display of the WhatsApp/Email options
    const handleMakeAppointmentClick = () => {
        setShowOptions(prev => !prev);
    };

    // Handles WhatsApp link
    const handleWhatsApp = () => {
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_WHATSAPP_MESSAGE)}`;
        window.open(whatsappUrl, '_blank'); 
        setShowOptions(false);
    };

    // 🛑 UPDATED FUNCTION: Copies the full Gmail URL string to the clipboard
    const handleEmail = async () => {
        setShowOptions(false);

        // This is the full, functional Gmail Compose URL string
        const gmailComposeUrl = `https://mail.google.com/mail/u/0/?view=cm&fs=1&to=${SUPPORT_EMAIL}&su=${encodeURIComponent(DEFAULT_EMAIL_SUBJECT)}&body=${encodeURIComponent(DEFAULT_WHATSAPP_MESSAGE)}`;
        
        // 1. Attempt to copy the full URL string to clipboard
        try {
            await navigator.clipboard.writeText(gmailComposeUrl);
            
            // 🛑 CRITICAL CHANGE: Generic message that refers only to the 'link'
            toast.success('Gmail Compose Link copied! Paste it in your browser address bar to compose the pre-filled email.', {
                position: "top-center", 
                autoClose: 5000,
            });

        } catch (err) {
            // 2. Fallback: If clipboard fails, show an alert with the URL
            window.alert(`Could not automatically copy the Gmail link. Please manually copy this URL and paste it in your browser: ${gmailComposeUrl}`);
            
            // Show warning toast
            toast.warn('Copy failed. Link shown in the pop-up alert.', {
                position: "top-center", 
                autoClose: 5000,
            });
        }
    };


    return (
        <nav className="global-navbar">
            {/* Logo/Title */}
            <div className="navbar-logo-text" onClick={() => navigate('/')}>
                <span className="navbar-title">AUTO REPAIR SYSTEM</span>
            </div>

            {/* Links section intentionally left empty */}
            <div className="navbar-links">
            </div>

            {/* Actions: Request Service and Make Appointment */}
            <div className="navbar-actions">
                <button 
                    className="nav-service-btn primary-cta-btn" 
                    onClick={handleRequestService}
                    type="button" 
                >
                    Request Service
                </button>
                
                {/* Conditional rendering for options */}
                {showOptions ? (
                    <>
                        <button 
                            className="nav-whatsapp-btn contact-option-btn whatsapp-btn"
                            onClick={handleWhatsApp}
                            type="button"
                        >
                            <FaWhatsapp /> WhatsApp
                        </button>
                        {/* The Email button now explicitly copies the link */}
                        <button 
                            className="nav-email-btn contact-option-btn email-btn"
                            onClick={handleEmail}
                            type="button"
                        >
                            <FaEnvelope /> Email (Copy Link)
                        </button>
                    </>
                ) : null}

                {/* The main button that toggles the options */}
                <button 
                    className="nav-appointment-btn secondary-cta-btn"
                    onClick={handleMakeAppointmentClick}
                    type="button"
                >
                    {showOptions ? 'Close Options' : 'Make Appointment'}
                </button>
            </div>
        </nav>
    );
}

// -------------------------------------------------------------------------
// 🛑 NEW COMPONENT: Global Footer
// -------------------------------------------------------------------------
const GlobalFooter = () => {
    return (
        <footer className="global-footer">
            <div className="footer-content">
                <p className="footer-copyright">
                    <FaCopyright style={{ marginRight: '5px' }} /> 
                    {new Date().getFullYear()} beytechnologie. All rights reserved.
                </p>
                
            </div>
        </footer>
    );
};


// -------------------------------------------------------------------------
// 📌 MAIN COMPONENT: Login Page Content
// -------------------------------------------------------------------------
/**
 * Basic Login Page Component (Split-Screen Design)
 * Handles user authentication via AuthContext.
 */
const LoginFormContent = () => {
    // Get the login function from the Auth context
    // NOTE: Ensure useAuth provides a functional login method
    // eslint-disable-next-line
    const { login } = useAuth(); 
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false); 
    const [isLoading, setIsLoading] = useState(false); 
    
    const navigate = useNavigate(); 
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true); 

        try {
            // Placeholder/simulated authentication. Replace with real logic if needed.
            if (login) {
                await login(email, password);
            } else {
                 // Simulate successful login if context is mocked or unavailable
                 await new Promise(resolve => setTimeout(resolve, 1500)); 
            }
            
            toast.success("Login successful! Redirecting to Dashboard...", {
                position: "top-right", 
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            
        } catch (err) {
            const errorMessage = "Login failed. Please verify your email and password.";
            setError(errorMessage);
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 5000,
            });
        } finally {
            setIsLoading(false); 
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    const handleRegisterClick = () => {
        navigate('/register');
    };

    const handleForgotClick = () => {
        navigate('/forgot-password');
    };

    return (
        <div className="split-login-container">
            {/* ----------------------------------------------------------------- */}
            {/* LEFT PANEL: Branding & Navigation to Register (Colored Section) */}
            {/* ----------------------------------------------------------------- */}
            <div className="split-left-panel">
                
                <div className="panel-header">
                    <h1 className="logo-main-text">Autowork</h1> 
                    <p className="logo-sub-text">Repair Management System</p>
                </div>

                <div className="panel-content">
                    <h2 className="welcome-title">Welcome Back!</h2>
                    <p className="welcome-text">
                        To keep connected with us, please sign in with your account credentials.
                    </p>
                    
                    <button 
                        className="register-link-button" 
                        onClick={handleRegisterClick}
                        type="button" 
                    >
                        Create New Account <FaArrowRight />
                    </button>
                </div>
            </div>

            {/* ----------------------------------------------------------------- */}
            {/* RIGHT PANEL: Login Form (White Section) */}
            {/* ----------------------------------------------------------------- */}
            <div className="split-right-panel">
                
                <div className="login-logo-container">
                    {/* Placeholder for logo image */}
                    <img src="/Main-Logo-01.png" alt="Autowork Logo" className="login-content-logo" /> 
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    
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
    );
};


// -------------------------------------------------------------------------
// 🖼️ MAIN EXPORT COMPONENT: Wraps Navbar, Login Form, and NEW Footer
// -------------------------------------------------------------------------

const LoginPage = () => (
    <>
        <GlobalNavbar />
        <ToastContainer />
        <div className="main-content-wrapper"> 
            <LoginFormContent />
        </div>
        
        {/* 🛑 NEW FOOTER COMPONENT */}
        <GlobalFooter /> 

        {/* CSS Styling (No major changes here, just for completeness) */}
        <style>{`
            /* ----------------------------------------------------------------- */
            /* GLOBAL PAGE STYLES (Adjusted for Navbar & Footer) */
            /* ----------------------------------------------------------------- */
            body {
                background-color: #f0f4f8 !important; 
                transition: background-color 0.5s;
                margin: 0; 
                /* 🛑 Important: Set height 100% and flex layout on body/html */
                height: 100vh;
                display: flex;
                flex-direction: column;
            }

            /* The content wrapper must take up the remaining space */
            .main-content-wrapper {
                display: flex;
                justify-content: center;
                align-items: center;
                flex-grow: 1; /* Allows it to fill the vertical space */
                min-height: calc(100vh - 70px - 50px); /* Total height minus navbar and footer height */
                font-family: 'Inter', sans-serif;
                background-color: #f0f4f8; 
                padding-top: 20px; 
                padding-bottom: 20px;
                box-sizing: border-box; /* Include padding in the height calculation */
            }

            /* ----------------------------------------------------------------- */
            /* 🛑 GLOBAL NAVBAR STYLES (Simplified Header) */
            /* ----------------------------------------------------------------- */
            .global-navbar {
                height: 70px;
                background-color: ${NAV_BACKGROUND_COLOR}; /* Dark Background */
                display: flex;
                justify-content: space-between; 
                align-items: center;
                padding: 0 40px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4); 
                z-index: 100;
            }
            
            /* 🛑 Simple text logo/title */
            .navbar-logo-text {
                display: flex;
                align-items: center;
                height: 100%;
                cursor: pointer; 
                color: ${NAV_TEXT_COLOR};
            }
            .navbar-title {
                font-size: 24px;
                font-weight: 800;
                letter-spacing: 1px;
                color: ${NAV_TEXT_COLOR}; 
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
            }

            .navbar-links {
                /* Intentionally empty */
            }
            

            .navbar-actions {
                display: flex;
                gap: 15px;
            }

            .nav-service-btn,
            .nav-appointment-btn,
            .contact-option-btn { /* Added new class for styling uniformity */
                padding: 10px 20px;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                transition: background-color 0.3s, opacity 0.3s, transform 0.1s;
                font-size: 16px;
                display: flex;
                align-items: center;
                white-space: nowrap; /* Prevent text wrapping */
                gap: 8px; /* Gap for icon and text */
            }

            /* 🛑 Request Service Button (Primary CTA - Orange fill) */
            .primary-cta-btn {
                background-color: ${NAV_BUTTON_COLOR}; /* Orange fill */
                color: ${NAV_BACKGROUND_COLOR}; /* Dark text */
                border: none;
            }

            .primary-cta-btn:hover {
                opacity: 0.9;
                transform: translateY(-1px);
                box-shadow: 0 4px 10px rgba(255, 136, 74, 0.4);
            }

            /* 🛑 Make Appointment Button (Secondary CTA - Transparent/Bordered) */
            .secondary-cta-btn {
                background-color: transparent;
                color: ${NAV_TEXT_COLOR}; /* White text */
                border: 1px solid ${NAV_TEXT_COLOR}; /* White border */
            }

            .secondary-cta-btn:hover {
                background-color: rgba(255, 255, 255, 0.1);
                border-color: ${NAV_BUTTON_COLOR};
                color: ${NAV_BUTTON_COLOR};
            }
            
            /* 🛑 NEW STYLES for Contact Options */
            .contact-option-btn {
                border: none;
                font-weight: 700;
                color: ${NAV_BACKGROUND_COLOR};
            }

            .whatsapp-btn {
                background-color: #25D366; /* WhatsApp Green */
                color: white;
            }
            .whatsapp-btn:hover {
                background-color: #1DA851; 
            }

            .email-btn {
                background-color: #ffffff; /* White/Light Background */
                color: ${NAV_BACKGROUND_COLOR};
                border: 1px solid #ddd;
            }
            .email-btn:hover {
                background-color: #f0f4f8; 
            }


            /* ----------------------------------------------------------------- */
            /* 🛑 GLOBAL FOOTER STYLES */
            /* ----------------------------------------------------------------- */
            .global-footer {
                height: 50px; /* Define a fixed height for the footer */
                width: 100%;
                background-color: ${NAV_BACKGROUND_COLOR}; /* Match Navbar color */
                color: ${NAV_TEXT_COLOR};
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 14px;
                box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.4); 
            }

            .footer-content {
                display: flex;
                align-items: center;
                gap: 30px;
            }
            
            .footer-copyright,
            .footer-developer {
                margin: 0;
                color: rgba(255, 255, 255, 0.7);
            }

            /* ----------------------------------------------------------------- */
            /* SPLIT CONTAINER STYLES (No Change) */
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

            /* LEFT PANEL (Dark Blue Section - No Change) */
            .split-left-panel {
                flex: 1;
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
        color: ${LEFT_PANEL_COLOR}; 
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
        max-width: 250px;
        margin: 0 auto;
    }

    .register-link-button:hover {
        background-color: #f0f8ff; 
        transform: translateY(-2px);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }

    /* ----------------------------------------------------------------- */
    /* RIGHT PANEL (Login Form Section - Logo Size Increased) */
    /* ----------------------------------------------------------------- */
    .split-right-panel {
        flex: 1.2; 
        padding: 50px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        color: ${PRIMARY_TEXT_COLOR};
    }

    .login-logo-container {
        text-align: center;
        margin-bottom: 30px; 
    }
    .login-content-logo {
        height: 80px; 
        width: auto;
    }

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
        box-shadow: 0 0 8px rgba(0, 191, 255, 0.35); 
        outline: none;
        background-color: white;
    }
    
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
        color: #7f8c8d; 
    }
    .forgot-link:hover { 
        color: ${ACTIVE_COLOR}; 
        text-decoration: underline;
    }

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
        background-color: #3a3a37ff; 
        box-shadow: 0 5px 15px rgba(0, 191, 255, 0.5);
        transform: translateY(-2px); 
    }
    .login-button:disabled {
        background-color: #3a3a37ff; 
        cursor: not-allowed;
        opacity: 0.8;
    }
    .loading-content {
        display: flex; 
        align-items: center; 
        gap: 10px;
    }
    
    /* MINI SPINNER STYLES */
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

    /* RESPONSIVENESS */
    @media (max-width: 992px) {
        .global-navbar {
            padding: 0 20px;
        }
        .navbar-actions {
            /* Change to flex-wrap to handle three buttons */
            display: flex;
            flex-wrap: wrap; 
            justify-content: flex-end;
            gap: 10px;
        }
        
        .navbar-links {
            display: none; 
        }

        .split-login-container {
            min-height: 450px;
            max-width: 400px;
            flex-direction: column;
        }

        .split-left-panel {
            display: none; 
        }
        
        .split-right-panel {
            flex: 1;
            padding: 40px 30px;
        }
        
        /* Adjust wrapper height for small screens */
        .main-content-wrapper {
            min-height: calc(100vh - 70px - 50px); 
            padding: 20px 0; 
        }
        
        /* Hide footer content on very small screens if necessary, though keeping it is usually fine */
        .footer-developer {
            display: none;
        }
        
        .footer-content {
            gap: 15px;
        }
    }
        `}</style>
    </>
);

export default LoginPage;
