// src/components/SplashLoader.js - Updated to use the premium Sky Blue theme and consolidated styles

import React, { useEffect } from 'react';

// Define the main colors
const ACTIVE_COLOR = '#00bfff'; // Sky Blue
const BACKGROUND_COLOR = '#f0f4f8'; // Light background, similar to page body
const PRIMARY_TEXT_COLOR = '#2c3e50';

// -----------------------------------------------------------------
// 1. SPLASH VISUAL COMPONENT 
// -----------------------------------------------------------------
/**
 * Animated circular spinner with four colored segments on a clean background.
 */
const SplashVisual = () => (
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
                    
                    /* Clean background to match the new app aesthetic */
                    background-color: ${BACKGROUND_COLOR}; 
                    position: relative; 
                }
                
                /* ----------------------------------------------------------------- */
                /* BRANDING STYLES */
                /* ----------------------------------------------------------------- */
                .splash-logo-header {
                    text-align: center;
                    margin-bottom: 40px;
                }
                .logo-main-text {
                    font-size: 56px;
                    color: ${ACTIVE_COLOR}; /* Sky Blue */
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

                /* ----------------------------------------------------------------- */
                /* LOADER VISUAL STYLES (Circular Spinner - Enhanced) */
                /* ----------------------------------------------------------------- */
                .circular-spinner-container {
                    z-index: 1;
                    /* Apply subtle pulse animation to the container */
                    animation: pulse 2s infinite ease-in-out;
                }

                .circular-spinner {
                    width: 70px; /* Larger spinner */
                    height: 70px;
                    position: relative;
                    /* Base rotation */
                    animation: spin 1.5s cubic-bezier(0.5, 0.2, 0.5, 0.8) infinite;
                }

                /* Create two overlapping segments for a complex look */
                .circular-spinner::before,
                .circular-spinner::after {
                    content: '';
                    position: absolute;
                    border-radius: 50%;
                    border: 5px solid transparent; /* Thicker border */
                    box-sizing: border-box; 
                }

                /* Outer Segment (Red and Blue) */
                .circular-spinner::before {
                    top: 0; left: 0; right: 0; bottom: 0;
                    border-top-color: #e74c3c;    /* Red segment */
                    border-right-color: ${ACTIVE_COLOR};  /* Blue segment */
                    /* Separate animation for subtle effect */
                    animation: dash-expand 3s ease-in-out infinite alternate;
                }
                
                /* Inner Segment (Yellow and Green) */
                .circular-spinner::after {
                    top: 10px; left: 10px; right: 10px; bottom: 10px; /* Smaller inner ring */
                    border-bottom-color: #f39c12; /* Yellow segment */
                    border-left-color: #2ecc71;   /* Green segment */
                    /* Rotate opposite to the main spin for dynamism */
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

                /* HIDE ALL UNNEEDED/LEGACY ELEMENTS */
                .animated-background-circles,
                .animated-background-circles li,
                .glowing-line,
                .dots-loader-container {
                    display: none;
                }
            `}
        </style>
    </div>
);


// -----------------------------------------------------------------
// 2. SPLASH LOADER COMPONENT (Handles logic)
// -----------------------------------------------------------------
/**
 * SplashLoader Component handles the mandatory 4-second delay.
 * * @param {Object} props
 * @param {function} props.onLoaded - Callback to run after the delay is complete.
 */
const SplashLoader = ({ onLoaded }) => {
    
    useEffect(() => {
        // Keeping the original 4-second timer
        const timer = setTimeout(() => {
            // After the delay, call the function passed by the parent (App.js)
            onLoaded(); 
        }, 4000); 

        // Cleanup function
        return () => clearTimeout(timer);
    }, [onLoaded]); // Dependency array includes onLoaded

    // Always show the visual component while this component is mounted
    return <SplashVisual />;
};

export default SplashLoader;