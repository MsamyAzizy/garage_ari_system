// src/components/SplashLoader.js - Updated to use the 4-dot spinner animation

import React, { useEffect } from 'react';

// Define the main colors
const ACTIVE_COLOR = '#5d9cec'; // Primary Blue
const MUTED_COLOR = '#aeb8c8';  // A lighter/muted version for contrast
const BACKGROUND_COLOR = '#f0f4f8'; // Light background, similar to page body
const PRIMARY_TEXT_COLOR = '#2c3e50';

// -----------------------------------------------------------------
// 1. SPLASH VISUAL COMPONENT 
// -----------------------------------------------------------------
/**
 * Animated 4-dot spinner (2x2 grid) with a pulsing color animation.
 */
const SplashVisual = () => (
    <div className="app-splash"> 
        
        {/* Logo/Branding Placeholder */}
        <div className="splash-logo-header">
            <h1 className="logo-main-text">Autowork</h1> 
            <p className="logo-sub-text">Auto Repair Management System</p>
        </div>

        {/* Loader Content - The New 4-Dot Spinner */}
        <div className="dots-loader-container">
            <div className="dot dot-1"></div>
            <div className="dot dot-2"></div>
            <div className="dot dot-3"></div>
            <div className="dot dot-4"></div>
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
                    
                    /* Clean background to match the application's light theme */
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
                    color: ${ACTIVE_COLOR}; /* Primary Blue */
                    font-weight: 900; 
                    margin: 0;
                    text-shadow: 0 4px 10px rgba(93, 156, 236, 0.2);
                    transition: all 0.5s ease;
                }
                .logo-sub-text {
                    font-size: 18px;
                    margin-top: 5px;
                    color: #7f8c8d; 
                    font-weight: 500;
                }

                /* ----------------------------------------------------------------- */
                /* LOADER VISUAL STYLES (4-Dot Spinner) */
                /* ----------------------------------------------------------------- */
                .dots-loader-container {
                    width: 60px; /* Container size */
                    height: 60px;
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    grid-template-rows: repeat(2, 1fr);
                    gap: 15px; /* Spacing between dots */
                    justify-content: center;
                    align-items: center;
                    margin-bottom: 20px;
                }

                .dot {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background-color: ${MUTED_COLOR}; /* Initial color: lighter blue */
                    animation: dot-pulse 1.8s infinite ease-in-out;
                }
                
                /* Stagger animation for the 2x2 grid pattern */
                .dot-1 {
                    animation-delay: 0s;
                }
                .dot-2 {
                    animation-delay: 0.2s;
                }
                .dot-3 {
                    animation-delay: 0.4s;
                }
                .dot-4 {
                    animation-delay: 0.6s;
                }
                
                .loading-text {
                    margin-top: 30px;
                    font-size: 24px; 
                    color: ${ACTIVE_COLOR}; /* Blue text to match dots */
                    font-weight: 600;
                    letter-spacing: 0.5px;
                    /* Subtle animation on text */
                    animation: text-pulse 2s infinite ease-in-out; 
                }
                
                /* KEYFRAMES */
                
                /* Dot color change animation */
                @keyframes dot-pulse {
                    0%, 100% {
                        background-color: ${MUTED_COLOR};
                        transform: scale(0.9);
                    }
                    50% {
                        background-color: ${ACTIVE_COLOR};
                        transform: scale(1.1);
                    }
                }

                /* Subtle text pulse */
                @keyframes text-pulse {
                    0%, 100% {
                        opacity: 0.8;
                    }
                    50% {
                        opacity: 1;
                    }
                }
                
                /* HIDE LEGACY ELEMENTS (If they were present in a previous version) */
                .circular-spinner-container,
                .circular-spinner {
                    display: none !important;
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