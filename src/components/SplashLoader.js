// src/components/SplashLoader.js - Updated to use the minimalist circular spinner from the image

import React, { useEffect } from 'react';


// -----------------------------------------------------------------
// 1. SPLASH VISUAL COMPONENT 
// -----------------------------------------------------------------
/**
 * Animated circular spinner with four colored segments on a dark background.
 */
const SplashVisual = () => (
    <div className="app-splash"> 
        {/* Animated Background Circles (kept for structure, but hidden by CSS) */}
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

        {/* Loader Content - The Spinner */}
        <div className="circular-spinner-container">
            <div className="circular-spinner">
                {/* Pure CSS creates the spinning segments */}
            </div>
        </div>
        
        {/* Other elements (dots, text, line) kept for structure, but hidden by CSS */}
        <div className="dots-loader-container"></div>
        <p className="loading-text"></p>
        <div className="glowing-line"></div>
        
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
                    color: #ffffff;
                    z-index: 9999;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    overflow: hidden; 
                    
                    /* Simple dark background to match the image */
                    background-color: #242424; 
                    position: relative; 
                }
                
                /* ----------------------------------------------------------------- */
                /* HIDE UNNEEDED ELEMENTS AND ANIMATED CIRCLES */
                /* ----------------------------------------------------------------- */
                .animated-background-circles,
                .animated-background-circles li, /* Hide bubbles */
                .glowing-line,
                .loading-text,
                .dots-loader-container {
                    display: none;
                }
                
                /* ----------------------------------------------------------------- */
                /* LOADER VISUAL STYLES (Circular Spinner) */
                /* ----------------------------------------------------------------- */
                .circular-spinner-container {
                    z-index: 1;
                }

                .circular-spinner {
                    width: 50px; 
                    height: 50px;
                    border: 3px solid transparent; /* Base transparent border */
                    border-radius: 50%;
                    
                    /* Define the four colored arcs/segments based on the image */
                    border-top: 3px solid #e74c3c;    /* Red segment */
                    border-right: 3px solid #3498db;  /* Blue segment */
                    border-bottom: 3px solid #f39c12; /* Yellow segment */
                    border-left: 3px solid #1abc9c;   /* Green segment */
                    
                    /* The animation for rotation */
                    animation: spin 1.2s cubic-bezier(0.5, 0.2, 0.5, 0.8) infinite;
                }
                
                /* KEYFRAMES */
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                /* Original keyframes removed as they are no longer used by the new spinner */
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