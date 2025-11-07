// src/components/AppLayout.js - MODIFIED to pass navigateTo

import React, { useState, useEffect } from 'react'; 
import TopNavigationBar from './TopNavigationBar';
import Sidebar from './Sidebar';

// ACCEPT navigateTo PROP HERE
const AppLayout = ({ children, currentPath, navigateTo }) => { 
  // 1. Sidebar State: True means expanded (wide), False means collapsed (squeezed/icon view)
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true); 
  
  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  // 2. Dark Mode State: Manages the dark/light theme
  // Initialize from a saved preference or default to light
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem('theme') === 'dark' || false
  );

  // Function to toggle Dark Mode
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  // useEffect to apply the theme class to the body and save preference
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]); // Rerun whenever isDarkMode changes

  // 3. User Dropdown State: Manages the visibility of the profile menu
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Function to toggle the profile menu
  const toggleProfileMenu = () => {
      setIsProfileMenuOpen(prevOpen => !prevOpen);
  };
  
  // Placeholder for a proper logout function
  const handleLogout = () => {
      // In a real app, this would clear authentication tokens and redirect
      console.log('User logged out!');
      alert('Logging out...');
      // For now, simply close the menu
      setIsProfileMenuOpen(false);
  };

  return (
    <div className="app-container">
      
      <TopNavigationBar 
        shopName="" 
        userName="Aziz Msami" 
        shopLocation="Software Developer" 
        
        // --- EXISTING PROPS FOR TOP NAV ---
        isProfileMenuOpen={isProfileMenuOpen}
        toggleProfileMenu={toggleProfileMenu}
        
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        
        onLogout={handleLogout}
      />
      
      <div 
        className={`main-content-wrapper ${!isSidebarExpanded ? 'sidebar-collapsed' : ''}`}
      >
        <Sidebar 
          currentPath={currentPath}
          isExpanded={isSidebarExpanded} 
          onToggle={toggleSidebar}    
          navigateTo={navigateTo}  // <--- NEW PROP PASSED DOWN TO SIDEBAR
        />
        
        {/* Main content area */}
        <main className="page-content" onClick={() => isProfileMenuOpen && setIsProfileMenuOpen(false)}>
          {children} 
        </main>
      </div>
    </div>
  );
};

export default AppLayout;