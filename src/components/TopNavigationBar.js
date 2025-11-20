// src/components/TopNavigationBar.js - FULL CODE

import React, { useState, useEffect } from 'react'; 
// Import all necessary icons
import { 
    FaCar,          
    FaBell, 
    FaUser,         
    FaSignOutAlt, 
    FaCheckCircle, 
    FaTimesCircle,
    FaCog 
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


const TopNavigationBar = ({ 
    shopName, 
    userName, 
    shopLocation, 
    isProfileMenuOpen,  
    toggleProfileMenu,  
    // 🛑 NEW PROP: URL for the user's profile image
    userAvatarUrl,         
    onLogout,           
    navigate          
}) => {
    
    // 🛑 State to manage the toast notification
    const [toast, setToast] = useState({ message: '', type: '' });
    
    const handleProfileClick = (e) => {
        e.preventDefault();
        // 🛑 UPDATED: This correctly navigates to the /profile route defined in Home.js
        navigate('/profile'); 
    };

    // 🏆 NEW HANDLER: For the settings icon
    const handleSettingsClick = (e) => {
        e.preventDefault();
        // Placeholder for future navigation, e.g., navigate('/settings');
        // For now, we'll just show a test toast.
        setToast({ message: 'Settings clicked (Navigation coming soon!)', type: 'success' });
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
                
                {/* 🏆 WRAPPED ICONS IN DIVS TO REMOVE INHERITED BORDER STYLE */}
                <div 
                    className="icon-wrapper"
                    onClick={handleSettingsClick}
                    title="Settings"
                >
                    <FaCog className="icon-settings icon-action" />
                </div>

                <div 
                    className="icon-wrapper"
                    title="Notifications"
                >
                    <FaBell className="icon-notification icon-action" />
                </div>
                
                {/* --- User Profile Menu (Dropdown) --- */}
                <div 
                    className="user-profile-menu" 
                    onClick={toggleProfileMenu} 
                >
                    <div className="user-profile">
                        {/* 🛑 MODIFIED: Display <img> if userAvatarUrl exists, otherwise use FaUser */}
                        {userAvatarUrl ? (
                            <img 
                                src={userAvatarUrl} 
                                alt="User Avatar" 
                                className="user-avatar-img" 
                            />
                        ) : (
                            <FaUser className="user-icon" />
                        )}
                        <div className="user-info">
                            <span className="user-name">{userName}</span>
                            <span className="shop-location">{shopLocation}</span>
                        </div>
                    </div>
                    {/* ... rest of dropdown content ... */}

                    <div className={`dropdown-content ${isProfileMenuOpen ? 'open' : ''}`}>
                        
                        <a 
                            href="#profile" 
                            className="menu-item" 
                            onClick={handleProfileClick} // 🛑 Uses the navigate('/profile') handler
                        >
                            <FaUser /> My Account Profile
                        </a>

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
            {/* STYLES FOR LAYOUT */}
            {/* ----------------------------------------------------------------- */}
            <style jsx>{`
                /* Color Variables for Top Nav (from previous steps) */
                :root {
                    --bg-top-nav: #242421ff;
                    --text-primary: #ffffff; /* WHITE */
                    --text-secondary: #aeb8c8;
                    --bg-sidebar: #242421ff;
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
                    /* 🏆 UPDATED: Reduced gap to rely on icon-wrapper margin */
                    gap: 5px; 
                }

                /* 🏆 NEW STYLE: Wrapper for the icons to control spacing and fix borders */
                .icon-wrapper {
                    padding: 5px; /* Added minor padding for click area */
                    border-radius: 4px;
                    cursor: pointer;
                    /* Explicitly removed border/background */
                    border: none;
                    background-color: transparent;
                    margin-right: 15px; /* Space out the icons from each other and the profile menu */
                    transition: background-color 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .icon-wrapper:hover {
                    background-color: rgba(255, 255, 255, 0.1); /* Optional subtle hover effect */
                }
                
                .icon-action {
                    font-size: 18px;
                    /* 🏆 REMOVED: cursor: pointer; (moved to wrapper) */
                    color: var(--text-secondary);
                    transition: color 0.2s;
                }
                
                /* Icon color change on wrapper hover */
                .icon-wrapper:hover .icon-action {
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

                /* 🛑 NEW: Style for the actual image (avatar) */
                .user-avatar-img {
                    width: 32px; /* Define the size of the avatar */
                    height: 32px;
                    border-radius: 50%; /* Makes it circular */
                    object-fit: cover;
                    margin-right: 10px;
                    border: 2px solid var(--text-primary); /* Optional border for flair */
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

                /* 🏆 FIX APPLIED HERE: Ensure user-name explicitly uses the white primary text color */
                .user-name {
                    font-size: 14px;
                    font-weight: 600;
                    color: white; /* Set explicitly to White */
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
                    background-color: #242421ff;
                    color: var(--text-primary);
                }
                
                .logout-item {
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    margin-top: 5px;
                    padding-top: 10px;
                }

            `}</style>
        </header>
    );
};

export default TopNavigationBar;