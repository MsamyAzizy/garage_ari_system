// src/components/TopNavigationBar.js - FULL CODE

import React, { useState, useEffect } from 'react'; 
// Import all necessary icons
import { 
    FaCar,          
    FaBell, 
    FaUser,         
    FaSignOutAlt, 
    FaMoon, 
    FaSun,
    FaCheckCircle, 
    FaTimesCircle  
} from 'react-icons/fa'; 


// Define common colors
const SUCCESS_COLOR = '#2ecc71'; 
const ERROR_COLOR = '#e74c3c'; 


// -----------------------------------------------------------------
// 1. TOAST NOTIFICATION COMPONENT (Floating Pop-up - Top Right)
// -----------------------------------------------------------------
// This component must manage its own display and lifetime
const ToastNotification = ({ message, type, duration = 1500, onClose }) => {
    
    // Use useEffect unconditionally
    useEffect(() => {
        if (!message) return;

        const timer = setTimeout(() => {
            onClose();
        }, duration); 
        return () => clearTimeout(timer);
    }, [message, duration, onClose]);

    if (!message) return null; 

    // Determine color and icon
    const color = type === 'success' ? SUCCESS_COLOR : ERROR_COLOR;
    const icon = type === 'success' ? <FaCheckCircle /> : <FaTimesCircle />;

    return (
        // 🛑 Renamed class for clarity: 'top-right-toast'
        <div className="toast-notification-container top-right-toast"> 
            <div className="toast-content" style={{ backgroundColor: color }}>
                {icon}
                <span className="toast-message">{message}</span>
            </div>
             {/* 🛑 UPDATED CSS for the Toast Notification (Top Right) */}
            <style jsx>{`
                .top-right-toast {
                    position: fixed;
                    /* 🛑 New Positioning: Top Right */
                    top: 20px;
                    right: 20px; 
                    left: auto; /* Ensure 'left' is unset */
                    transform: none; /* Reset transform */
                    z-index: 10000;
                    opacity: 0;
                    /* 🛑 Updated animation to slide-in from the right */
                    animation: slide-in 0.5s forwards, fade-out 0.5s ${duration/1000 - 0.5}s forwards; 
                }

                .toast-content {
                    color: white;
                    padding: 12px 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-weight: 600;
                }
                
                .toast-message {
                    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
                }

                /* 🛑 New animation keyframes for sliding in from the right */
                @keyframes slide-in {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                /* Start fading out */
                @keyframes fade-out {
                    0% { opacity: 1; }
                    100% { opacity: 0; }
                }
            `}</style>
        </div>
    );
};


// --- Custom ToggleSwitch Component ---
const ToggleSwitch = ({ checked, onChange }) => (
    <label className="switch">
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className="slider"></span> 
        <div className="icons">
            <FaSun className="icon-sun" />
            <FaMoon className="icon-moon" />
        </div>
    </label>
);


const TopNavigationBar = ({ 
    shopName, 
    userName, 
    shopLocation, 
    isProfileMenuOpen,  
    toggleProfileMenu,  
    isDarkMode,         
    toggleDarkMode,     
    onLogout,           
    navigate          
}) => {
    
    // 🛑 State to manage the toast notification
    const [toast, setToast] = useState({ message: '', type: '' });
    
    const handleProfileClick = (e) => {
        e.preventDefault();
        navigate('/profile'); 
    };
    
    const handleLogoutClick = async (e) => { 
        e.preventDefault();
        toggleProfileMenu(); // Close the dropdown immediately

        // 1. Show the toast notification
        setToast({ message: 'Successfully logged out!', type: 'success' });

        // 2. Execute onLogout
        await onLogout(); 
    };
    

    return (
        <header className="top-nav-bar">
            
            {/* 🛑 RENDER TOAST HERE */}
            <ToastNotification 
                message={toast.message} 
                type={toast.type}
                onClose={() => setToast({ message: '', type: '' })}
            />

            {/* 1. Left Section: Logo and Shop Name */}
            <div className="logo-section">
                <FaCar className="logo-icon" /> 
                <span className="shop-name">{shopName}</span>
            </div>

            {/* 2. Central Empty Space */}
            <div style={{ flexGrow: 1 }}></div>

            {/* 3. Right Section: Action and User Profile */}
            <div className="action-section">
                
                <FaBell className="icon-notification icon-action" />
                
                {/* --- User Profile Menu (Dropdown) --- */}
                <div 
                    className="user-profile-menu" 
                    onClick={toggleProfileMenu} 
                >
                    <div className="user-profile">
                        <FaUser className="user-icon" /> 
                        <div className="user-info">
                            <span className="user-name">{userName}</span>
                            <span className="shop-location">{shopLocation}</span>
                        </div>
                    </div>

                    <div className={`dropdown-content ${isProfileMenuOpen ? 'open' : ''}`}>
                        
                        <a 
                            href="#profile" 
                            className="menu-item" 
                            onClick={handleProfileClick} 
                        >
                            <FaUser /> My Account Profile
                        </a>

                        <div className="menu-item dark-mode-toggle" onClick={(e) => {
                            e.stopPropagation();
                        }}>
                            <span><FaMoon /> Dark Mode:</span>
                            <ToggleSwitch 
                                checked={isDarkMode} 
                                onChange={toggleDarkMode} 
                            />
                        </div>

                        <a 
                            href="#logout" 
                            className="menu-item logout-item" 
                            onClick={handleLogoutClick} // 🛑 Calls the function that triggers the toast
                        >
                            <FaSignOutAlt /> Logout
                        </a>
                    </div>
                </div>
                {/* --- END User Profile Menu --- */}

            </div>
            
            {/* ----------------------------------------------------------------- */}
            {/* STYLES FOR LAYOUT AND DARK MODE TOGGLE (No Change in Core Styling) */}
            {/* ----------------------------------------------------------------- */}
            <style jsx>{`
                /* Color Variables for Top Nav (from previous steps) */
                :root {
                    --bg-top-nav: #2c3848;
                    --text-primary: #ffffff;
                    --text-secondary: #aeb8c8;
                    --bg-sidebar: #212A38;
                }
                
                /* Main Header Layout */
                .top-nav-bar {
                    height: 60px;
                    background-color: var(--bg-top-nav); 
                    color: var(--text-primary);
                    width: 100%;
                    position: fixed;
                    top: 0;
                    left: 0;
                    z-index: 999; 
                    display: flex;
                    align-items: center;
                    /* Ensure content starts after the sidebar, this is handled by Home.js's main-content-wrapper */
                    padding: 0 20px 0 270px; 
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    transition: padding-left 0.3s ease;
                }
                
                /* --- 1. Left Section (Logo/Name) --- */
                .logo-section {
                    display: flex;
                    align-items: center;
                    white-space: nowrap;
                    margin-right: 20px;
                }

                .logo-icon {
                    font-size: 20px;
                    margin-right: 10px;
                }

                .shop-name {
                    font-size: 16px;
                    font-weight: 600;
                }

                /* --- 3. Right Section (Actions/User) --- */
                .action-section {
                    display: flex;
                    align-items: center;
                    gap: 25px; 
                }
                
                .icon-action {
                    font-size: 18px;
                    cursor: pointer;
                    color: var(--text-secondary);
                    transition: color 0.2s;
                }
                
                .icon-action:hover {
                    color: var(--text-primary);
                }

                /* --- User Profile Dropdown --- (Styles remain the same) */
                .user-profile-menu {
                    position: relative;
                    cursor: pointer;
                }

                .user-profile {
                    display: flex;
                    align-items: center;
                    padding: 5px 10px;
                    border-radius: 4px;
                    transition: background-color 0.2s;
                }

                .user-profile:hover {
                    background-color: rgba(255, 255, 255, 0.1);
                }

                .user-icon {
                    font-size: 24px;
                    margin-right: 10px;
                }

                .user-info {
                    display: flex;
                    flex-direction: column;
                    line-height: 1.2;
                }

                .user-name {
                    font-size: 14px;
                    font-weight: 600;
                    color: var(--text-primary);
                }

                .shop-location {
                    font-size: 10px;
                    color: var(--text-secondary);
                }

                .dropdown-content {
                    position: absolute;
                    top: 100%; 
                    right: 0;
                    min-width: 240px;
                    background-color: var(--bg-sidebar);
                    border-radius: 4px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                    padding: 8px 0;
                    margin-top: 10px;
                    z-index: 1001;
                    display: none;
                    opacity: 0;
                    transform: translateY(-10px);
                    transition: opacity 0.2s ease, transform 0.2s ease;
                }

                .dropdown-content.open {
                    display: block;
                    opacity: 1;
                    transform: translateY(0);
                }

                .menu-item {
                    display: flex;
                    align-items: center;
                    padding: 10px 15px;
                    color: var(--text-secondary);
                    text-decoration: none;
                    font-size: 14px;
                    transition: background-color 0.2s, color 0.2s;
                }
                
                .menu-item > svg {
                    margin-right: 10px;
                    font-size: 16px;
                }

                .menu-item:hover {
                    background-color: #38465b;
                    color: var(--text-primary);
                }
                
                .logout-item {
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    margin-top: 5px;
                    padding-top: 10px;
                }


                /* --- Toggle Switch CSS --- */
                .dark-mode-toggle {
                    justify-content: space-between;
                    cursor: default;
                }
                
                .dark-mode-toggle span {
                    display: flex;
                    align-items: center;
                }

                /* The switch - container */
                .switch {
                    position: relative;
                    display: inline-block;
                    width: 50px;
                    height: 24px;
                }

                /* Hide default checkbox */
                .switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }

                /* The slider - round */
                .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #ccc;
                    transition: .4s;
                    border-radius: 24px;
                }

                .slider:before {
                    position: absolute;
                    content: "";
                    height: 18px;
                    width: 18px;
                    left: 3px;
                    bottom: 3px;
                    background-color: white;
                    transition: .4s;
                    border-radius: 50%;
                }

                input:checked + .slider {
                    background-color: #5d9cec;
                }

                input:checked + .slider:before {
                    transform: translateX(26px);
                }
                
                .icons {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    padding: 0 5px;
                    pointer-events: none;
                }

                .icon-sun, .icon-moon {
                    font-size: 12px;
                    transition: opacity 0.4s;
                }

                .icon-sun {
                    color: white;
                    opacity: 0;
                }

                .icon-moon {
                    color: #2c3848;
                    opacity: 1;
                }

                input:checked ~ .icons .icon-sun {
                    opacity: 1;
                }

                input:checked ~ .icons .icon-moon {
                    opacity: 0;
                }

            `}</style>
        </header>
    );
};

export default TopNavigationBar;