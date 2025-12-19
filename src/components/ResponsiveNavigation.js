// src/components/ResponsiveNavigation.jsx
import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import Sidebar from './Sidebar';
import TopNavigationBar from './TopNavigationBar';

const ResponsiveNavigation = ({ 
    currentPath, 
    navigateTo, 
    shopName, 
    userName, 
    shopLocation, 
    onLogout,
    children 
}) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Detect screen size
    useEffect(() => {
        const checkScreenSize = () => {
            const mobile = window.innerWidth <= 992;
            setIsMobile(mobile);
            
            // Auto-close mobile sidebar when switching to desktop
            if (!mobile && isMobileOpen) {
                setIsMobileOpen(false);
            }
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        
        return () => window.removeEventListener('resize', checkScreenSize);
    }, [isMobileOpen]);

    const toggleSidebar = () => {
        if (isMobile) {
            setIsMobileOpen(!isMobileOpen);
        } else {
            setIsSidebarCollapsed(!isSidebarCollapsed);
        }
    };

    const closeMobileSidebar = () => {
        if (isMobile) {
            setIsMobileOpen(false);
        }
    };

    // Handle navigation - close mobile sidebar when navigating
    const handleNavigate = (path) => {
        if (isMobile) {
            setIsMobileOpen(false);
        }
        navigateTo(path);
    };

    return (
        <div className="responsive-navigation-container">
            {/* Top Navigation Bar */}
            <TopNavigationBar 
                shopName={shopName}
                userName={userName}
                shopLocation={shopLocation}
                onLogout={onLogout}
                navigate={handleNavigate}
                onMobileMenuToggle={toggleSidebar}
                isMobile={isMobile}
            />

            {/* Mobile Menu Toggle Button - Only show on mobile */}
            {isMobile && (
                <button 
                    className="mobile-menu-toggle"
                    onClick={toggleSidebar}
                >
                    {isMobileOpen ? <FaTimes /> : <FaBars />}
                </button>
            )}

            {/* Sidebar */}
            <Sidebar 
                currentPath={currentPath}
                isCollapsed={isSidebarCollapsed}
                toggleSidebar={toggleSidebar}
                navigateTo={handleNavigate}
                isOpenMobile={isMobileOpen}
            />

            {/* Main Content */}
            <main 
                className={`main-content ${
                    isSidebarCollapsed && !isMobile ? 'sidebar-collapsed' : ''
                } ${isMobile ? 'mobile-view' : ''}`}
                onClick={closeMobileSidebar}
            >
                {children}
            </main>

            {/* Mobile Overlay */}
            {isMobile && isMobileOpen && (
                <div 
                    className="mobile-overlay"
                    onClick={closeMobileSidebar}
                />
            )}

            <style jsx>{`
                .responsive-navigation-container {
                    min-height: 100vh;
                    position: relative;
                    background-color: #f5f5f5;
                }

                /* Mobile Menu Toggle Button */
                .mobile-menu-toggle {
                    position: fixed;
                    top: 70px;
                    left: 15px;
                    z-index: 1001;
                    background: #ce5616ff;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    cursor: pointer;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                }

                /* Main Content Area */
                .main-content {
                    margin-left: 250px;
                    padding: 80px 20px 20px 20px;
                    transition: margin-left 0.3s ease;
                    min-height: calc(100vh - 60px);
                    background-color: #f5f5f5;
                }

                .main-content.sidebar-collapsed {
                    margin-left: 80px;
                }

                .main-content.mobile-view {
                    margin-left: 0;
                    padding-top: 70px;
                }

                /* Mobile Overlay */
                .mobile-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 998;
                }

                /* Adjust for dark theme */
                body.dark-theme .responsive-navigation-container {
                    background-color: #1a202c;
                }

                body.dark-theme .main-content {
                    background-color: #1a202c;
                    color: white;
                }

                @media (max-width: 992px) {
                    .main-content {
                        padding-top: 80px;
                    }
                }
            `}</style>
        </div>
    );
};

export default ResponsiveNavigation;