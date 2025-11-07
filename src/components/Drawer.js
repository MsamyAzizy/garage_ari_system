// src/components/Drawer.js - FINALIZED with scroll lock and click behavior

import React, { useEffect } from 'react'; // <-- Import useEffect
import { FaTimes } from 'react-icons/fa';

/**
 * A reusable side panel component for displaying detailed views or forms.
 * @param {boolean} isOpen - Controls whether the drawer is visible.
 * @param {function} onClose - Function to call when the close button is clicked or the overlay is clicked.
 * @param {string} title - The title displayed at the top of the drawer.
 * @param {string} size - The width of the drawer ('small', 'medium', 'large', 'full').
 * @param {React.ReactNode} children - The content to be rendered inside the drawer.
 */
const Drawer = ({ isOpen, onClose, title, size = 'medium', children }) => {
    
    // 1. SCROLL LOCK LOGIC: Locks scrolling on the body when the drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        // Cleanup function to reset scroll when component unmounts or isOpen changes
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    // Determine the CSS class for width (mapping size prop to the CSS classes we defined)
    const drawerClass = `drawer-panel drawer-${size}`;

    return (
        // Overlay (closes drawer when clicked outside)
        <div className="drawer-overlay" onClick={onClose}>
            
            {/* Drawer Panel (stops click propagation so clicking inside doesn't close it) */}
            <div 
                className={drawerClass} 
                onClick={(e) => e.stopPropagation()} // <-- IMPORTANT: Stop clicks from hitting the overlay
            >
                <header className="drawer-header">
                    <h3>{title}</h3>
                    <button className="drawer-close-btn" onClick={onClose}>
                        <FaTimes />
                    </button>
                </header>
                
                {/* 3. Class Name Fixed: Used 'drawer-content' as per CSS */}
                <div className="drawer-content"> 
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Drawer;