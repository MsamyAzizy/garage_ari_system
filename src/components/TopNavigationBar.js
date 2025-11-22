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
    FaCog, // Settings Cog
    // Icons for Settings Dropdown
    FaMoon, // Mode/Dark
    FaAdjust, // Contrast
    FaExchangeAlt, // Right-to-left
    FaCompressArrowsAlt, // Compact 
    FaTimes, // X close button
    FaExpand, // Fullscreen/Expand 
    FaSyncAlt // Reload/Refresh 
} from 'react-icons/fa'; 


// Define common colors
const SUCCESS_COLOR = '#2ecc71'; 
const ERROR_COLOR = '#e74c3c'; 


// -----------------------------------------------------------------
// 🏆 1. INTERNATIONALIZATION (i18n) STRINGS DICTIONARY (CORRECTED ORDER)
// -----------------------------------------------------------------

// 1a. Define the base English object first
const englishStrings = {
    settings: 'Settings',
    mode: 'Mode',
    contrast: 'Contrast',
    rightToLeft: 'Right to left',
    compact: 'Compact',
    myAccount: 'My Account Profile',
    logout: 'Logout',
    notificationToast: (langName) => `Language set to ${langName}!`,
    themeToast: (theme) => `Theme switched to ${theme} mode!`
};

// 1b. Define Swahili strings
const swahiliTZStrings = {
    settings: 'Mipangilio',
    mode: 'Hali ya Kuonekana',
    contrast: 'Ulinganuzi wa Rangi',
    rightToLeft: 'Kutoka Kulia kwenda Kushoto',
    compact: 'Muundo Mfupi',
    myAccount: 'Akaunti Yangu',
    logout: 'Toka',
    notificationToast: (langName) => `Lugha imewekwa kama ${langName}!`,
    themeToast: (theme) => `Mandhari imebadilishwa kuwa hali ya ${theme}!`
};


// 1c. Define the full dictionary using the base objects (avoids use-before-define)
const i18nStrings = {
    'en': englishStrings,
    'sw-tz': swahiliTZStrings,
    
    // Placeholder languages, now safely referencing englishStrings
    'es': { ...englishStrings, logout: 'Cerrar Sesión' },
    'fr': { ...englishStrings, logout: 'Déconnexion' },
    'de': { ...englishStrings, logout: 'Abmelden' },
    'sw-ke': { ...swahiliTZStrings, settings: 'Seti' }, // Small variation
    'sw-ug': { ...swahiliTZStrings },
    'rw': { ...englishStrings, myAccount: 'Konti Yanjye' },
    'rn': { ...englishStrings, myAccount: 'Kontere Yanje' },
};


// Function to get the current language strings
const getStrings = (langCode) => {
    // Fallback to 'en' if the specific code is not found
    return i18nStrings[langCode] || i18nStrings['en'];
};

// -----------------------------------------------------------------
// 2. TOAST NOTIFICATION COMPONENT 
// -----------------------------------------------------------------
const ToastNotification = ({ message, type, duration = 1500, onClose }) => {
    
    useEffect(() => {
        if (!message) return;

        const timer = setTimeout(() => {
            onClose();
        }, duration); 
        return () => clearTimeout(timer);
    }, [message, duration, onClose]);

    if (!message) return null; 

    const color = type === 'success' ? SUCCESS_COLOR : ERROR_COLOR;
    const icon = type === 'success' ? <FaCheckCircle /> : <FaTimesCircle />;

    return (
        <div className="toast-notification-container top-right-toast"> 
            <div className="toast-content" style={{ backgroundColor: color }}>
                {icon}
                <span className="toast-message">{message}</span>
            </div>
            <style jsx>{`
                .top-right-toast {
                    position: fixed;
                    top: 20px;
                    right: 20px; 
                    left: auto; 
                    transform: none; 
                    z-index: 10000;
                    opacity: 0;
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

                @keyframes slide-in {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes fade-out {
                    0% { opacity: 1; }
                    100% { opacity: 0; }
                }
            `}</style>
        </div>
    );
};


// -----------------------------------------------------------------
// 3. SETTINGS DROPDOWN COMPONENT (Uses dynamic text)
// -----------------------------------------------------------------

const SettingCard = ({ icon: Icon, title, isChecked, onToggle, showInfo = false }) => (
    <div className="setting-card-dropdown">
        <div className="card-header-dropdown">
            <Icon size={20} />
            <label className="toggle-switch-dark">
                <input 
                    type="checkbox" 
                    checked={isChecked} 
                    onChange={onToggle} 
                />
                <span className="slider round"></span>
            </label>
        </div>
        <div className="card-footer-dropdown">
            <span className="card-title-dropdown">{title}</span>
            {showInfo && <span className="info-icon-dropdown">ⓘ</span>}
        </div>
    </div>
);


const SettingsDropdown = ({ isOpen, onClose, onToggleTheme, currentTheme, strings }) => {
    
    // Placeholder states for other settings
    const [contrast, setContrast] = useState(false);
    const [rtl, setRtl] = useState(false);
    const [compact, setCompact] = useState(false);

    if (!isOpen) return null;
    
    // Theme toggle function
    const handleThemeToggle = () => {
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        onToggleTheme(newTheme);
    };

    return (
        <div className="settings-dropdown-container open">
            <div className="settings-dropdown-content">
                
                <div className="dropdown-header-controls">
                    <h2 className="dropdown-title">{strings.settings}</h2> 
                    <div className="dropdown-icons">
                        <FaExpand className="header-icon" title="Full Screen" /> 
                        <FaSyncAlt className="header-icon" title="Reload Settings" />
                        <FaTimes className="header-icon close-x" onClick={onClose} title="Close" />
                    </div>
                </div>

                <div className="settings-grid-dropdown">
                    
                    <SettingCard
                        icon={FaMoon}
                        title={strings.mode}
                        isChecked={currentTheme === 'dark'}
                        onToggle={handleThemeToggle}
                    />
                    <SettingCard
                        icon={FaAdjust}
                        title={strings.contrast}
                        isChecked={contrast}
                        onToggle={() => setContrast(prev => !prev)}
                    />
                    <SettingCard
                        icon={FaExchangeAlt}
                        title={strings.rightToLeft}
                        isChecked={rtl}
                        onToggle={() => setRtl(prev => !prev)}
                    />
                    <SettingCard
                        icon={FaCompressArrowsAlt}
                        title={strings.compact}
                        isChecked={compact}
                        onToggle={() => setCompact(prev => !prev)}
                        showInfo={true} 
                    />
                </div>
            </div>

            {/* STYLES FOR THE DROPDOWN */}
            <style jsx>{`
                /* DROPDOWN CONTAINER */
                .settings-dropdown-container {
                    position: absolute;
                    top: 60px; 
                    right: 20px;
                    z-index: 1000;
                    opacity: 0;
                    transform: translateY(-10px);
                    transition: opacity 0.3s ease, transform 0.3s ease;
                }
                
                .settings-dropdown-container.open {
                    opacity: 1;
                    transform: translateY(0);
                }

                /* DROPDOWN CONTENT BOX - Using the specific dark background color */
                .settings-dropdown-content {
                    background-color: #3a3a37ff; 
                    color: white;
                    border-radius: 12px;
                    padding: 20px;
                    width: 380px; 
                    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.4);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                .dropdown-header-controls {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 25px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid #4A5568; 
                }
                
                .dropdown-title {
                    font-size: 20px;
                    font-weight: 700;
                    margin: 0;
                }
                
                .dropdown-icons {
                    display: flex;
                    gap: 15px;
                }
                
                .header-icon {
                    font-size: 16px;
                    color: #A0AEC0; 
                    cursor: pointer;
                    transition: color 0.2s;
                }
                
                .header-icon:hover {
                    color: white;
                }
                
                /* SETTINGS GRID (2x2) */
                .settings-grid-dropdown {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                }

                /* SETTING CARD STYLES */
                .setting-card-dropdown {
                    background-color: #4A4A45; 
                    border-radius: 8px;
                    padding: 15px;
                    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
                    min-height: 100px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }
                
                .card-header-dropdown {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }
                
                .card-header-dropdown svg {
                    color: white;
                }
                
                .card-footer-dropdown {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                }

                .card-title-dropdown {
                    font-size: 14px;
                    font-weight: 600;
                    color: #E2E8F0;
                }
                
                .info-icon-dropdown {
                    font-size: 10px;
                    color: #A0AEC0;
                }

                /* --- Dark Mode Toggle Switch Styles --- */
                .toggle-switch-dark {
                    position: relative;
                    display: inline-block;
                    width: 45px;
                    height: 24px;
                }

                .toggle-switch-dark input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }

                .toggle-switch-dark .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #4A5568; 
                    transition: .4s;
                }

                .toggle-switch-dark .slider:before {
                    position: absolute;
                    content: "";
                    height: 16px;
                    width: 16px;
                    left: 4px;
                    bottom: 4px;
                    background-color: white;
                    transition: .4s;
                }

                .toggle-switch-dark input:checked + .slider {
                    background-color: #48BB78; 
                }

                .toggle-switch-dark input:checked + .slider:before {
                    transform: translateX(21px);
                }

                .toggle-switch-dark .slider.round {
                    border-radius: 24px;
                }

                .toggle-switch-dark .slider.round:before {
                    border-radius: 50%;
                }

            `}</style>
        </div>
    );
};


// -----------------------------------------------------------------
// 4. LANGUAGE DROPDOWN COMPONENT
// -----------------------------------------------------------------

const languages = [
    { code: 'en', name: 'English (UK)', flag: '🇬🇧' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'sw-tz', name: 'Swahili (TZ)', flag: '🇹🇿' },
    { code: 'sw-ke', name: 'Swahili (KE)', flag: '🇰🇪' },
    { code: 'sw-ug', name: 'Swahili (UG)', flag: '🇺🇬' },
    { code: 'rw', name: 'Kinyarwanda (RW)', flag: '🇷🇼' },
    { code: 'rn', name: 'Kirundi (BI)', flag: '🇧🇮' },
];

const LanguageDropdown = ({ isOpen, onClose, onLanguageChange, currentLanguageCode }) => {
    if (!isOpen) return null;

    const handleSelectLanguage = (lang) => {
        onLanguageChange(lang);
        onClose();
    };

    return (
        <div className="language-dropdown-container open">
            <div className="language-dropdown-content">
                {languages.map((lang) => (
                    <div 
                        key={lang.code}
                        className={`language-item ${currentLanguageCode === lang.code ? 'selected' : ''}`}
                        onClick={() => handleSelectLanguage(lang)}
                    >
                        <span className="language-flag">{lang.flag}</span>
                        <span className="language-name">{lang.name}</span>
                        {currentLanguageCode === lang.code && <FaCheckCircle className="selected-check" />}
                    </div>
                ))}
            </div>

            {/* STYLES FOR LANGUAGE DROPDOWN */}
            <style jsx>{`
                .language-dropdown-container {
                    position: absolute;
                    top: 60px; 
                    right: 175px; 
                    z-index: 1000;
                    opacity: 0;
                    transform: translateY(-10px);
                    transition: opacity 0.3s ease, transform 0.3s ease;
                }
                
                .language-dropdown-container.open {
                    opacity: 1;
                    transform: translateY(0);
                }

                .language-dropdown-content {
                    background-color: #3a3a37ff; 
                    border-radius: 8px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
                    padding: 8px 0;
                    min-width: 200px; 
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .language-item {
                    display: flex;
                    align-items: center;
                    padding: 10px 15px;
                    cursor: pointer;
                    color: white;
                    transition: background-color 0.2s;
                    font-size: 14px;
                }

                .language-item:hover {
                    background-color: #4A4A45; 
                }

                .language-flag {
                    font-size: 18px;
                    margin-right: 10px;
                }

                .language-name {
                    flex-grow: 1;
                }

                .selected-check {
                    color: ${SUCCESS_COLOR};
                    font-size: 14px;
                }
            `}</style>
        </div>
    );
};


// -----------------------------------------------------------------
// 5. Main TopNavigationBar Component (Uses dynamic strings and passes them)
// -----------------------------------------------------------------

const TopNavigationBar = ({ 
    shopName, 
    userName, 
    shopLocation, 
    isProfileMenuOpen,  
    toggleProfileMenu,  
    userAvatarUrl,         
    onLogout,           
    navigate          
}) => {
    
    const [toast, setToast] = useState({ message: '', type: '' });
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [currentTheme, setCurrentTheme] = useState('dark'); 
    
    // LANGUAGE STATE: Default to the first language in the updated list
    const [isLanguageOpen, setIsLanguageOpen] = useState(false);
    const [currentLanguage, setCurrentLanguage] = useState(languages[0]); 
    
    // Get the language strings for the current state
    const strings = getStrings(currentLanguage.code);


    // Handlers
    const handleProfileClick = (e) => {
        e.preventDefault();
        navigate('/profile'); 
    };

    const handleSettingsClick = (e) => {
        e.preventDefault();
        // Close other dropdowns
        if (isProfileMenuOpen) toggleProfileMenu();
        if (isLanguageOpen) setIsLanguageOpen(false); 
        setIsSettingsOpen(prev => !prev);
    };

    const handleLanguageClick = (e) => {
        e.preventDefault();
        // Close other dropdowns
        if (isProfileMenuOpen) toggleProfileMenu();
        if (isSettingsOpen) setIsSettingsOpen(false);
        setIsLanguageOpen(prev => !prev);
    };

    const handleLanguageChange = (lang) => {
        setCurrentLanguage(lang);
        // Use the new dynamic toast message function
        const updatedStrings = getStrings(lang.code);
        setToast({ message: updatedStrings.notificationToast(lang.name), type: 'success' });
    };
    
    const handleThemeToggle = (newTheme) => {
        setCurrentTheme(newTheme);
        // Use the new dynamic theme toast message function
        setToast({ message: strings.themeToast(newTheme), type: 'success' });
    };

    const handleLogoutClick = async (e) => { 
        e.preventDefault();
        toggleProfileMenu(); 
        // NOTE: Keeping this English for simplicity, but it should also be translated
        setToast({ message: 'Successfully logged out!', type: 'success' });
        await onLogout(); 
    };
    
    // Close dropdowns if user clicks outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Logic to close settings
            if (isSettingsOpen) {
                const dropdownContent = document.querySelector('.settings-dropdown-content');
                const settingsIconWrapper = document.querySelector('.icon-wrapper[title="Settings"]');

                if (dropdownContent && !dropdownContent.contains(event.target) &&
                    settingsIconWrapper && !settingsIconWrapper.contains(event.target)) {
                    setIsSettingsOpen(false);
                }
            }
            
            // Logic to close language dropdown
            if (isLanguageOpen) {
                const dropdownContent = document.querySelector('.language-dropdown-content');
                const languageIconWrapper = document.querySelector('.icon-wrapper[title="Language"]');

                if (dropdownContent && !dropdownContent.contains(event.target) &&
                    languageIconWrapper && !languageIconWrapper.contains(event.target)) {
                    setIsLanguageOpen(false);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSettingsOpen, isLanguageOpen]);
    

    return (
        <header className="top-nav-bar">
            
            {/* 🛑 RENDER TOAST HERE */}
            <ToastNotification 
                message={toast.message} 
                type={toast.type}
                onClose={() => setToast({ message: '', type: '' })}
            />
            
            {/* RENDER DROPDOWNS */}
            <SettingsDropdown 
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                onToggleTheme={handleThemeToggle}
                currentTheme={currentTheme}
                strings={strings} 
            />

            {/* RENDER LANGUAGE DROPDOWN */}
            <LanguageDropdown
                isOpen={isLanguageOpen}
                onClose={() => setIsLanguageOpen(false)}
                onLanguageChange={handleLanguageChange}
                currentLanguageCode={currentLanguage.code}
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
                
                {/* LANGUAGE ICON */}
                <div 
                    className="icon-wrapper language-icon-wrapper"
                    onClick={handleLanguageClick}
                    title="Language"
                >
                    <span className="flag-placeholder">{currentLanguage.flag}</span>
                </div>
                
                {/* SEARCH ICON PLACEHOLDER */}
                
                
                {/* SETTINGS ICON */}
                <div 
                    className="icon-wrapper"
                    onClick={handleSettingsClick}
                    title={strings.settings} 
                    style={{marginRight: '5px'}} 
                >
                    <FaCog className="icon-settings icon-action spin-icon" />
                </div>

                <div 
                    className="icon-wrapper"
                    title="Notifications"
                >
                    <FaBell className="icon-notification icon-action" />
                    <span className="notification-badge">4</span>
                </div>
                
                {/* --- User Profile Menu (Dropdown) --- */}
                <div 
                    className="user-profile-menu" 
                    onClick={toggleProfileMenu} 
                >
                    <div className="user-profile">
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

                    <div className={`dropdown-content ${isProfileMenuOpen ? 'open' : ''}`}>
                        
                        <a 
                            href="#profile" 
                            className="menu-item" 
                            onClick={handleProfileClick} 
                        >
                            <FaUser /> {strings.myAccount} 
                        </a>

                        <a 
                            href="#logout" 
                            className="menu-item logout-item" 
                            onClick={handleLogoutClick} 
                        >
                            <FaSignOutAlt /> {strings.logout} 
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
                    gap: 5px; 
                }

                /* General icon wrapper style */
                .icon-wrapper {
                    padding: 5px; 
                    border-radius: 4px;
                    cursor: pointer;
                    border: none;
                    background-color: transparent;
                    margin-right: 15px; 
                    transition: background-color 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative; /* Needed for notification badge */
                }

                .icon-wrapper:hover {
                    background-color: rgba(255, 255, 255, 0.1); 
                }
                
                .icon-action {
                    font-size: 18px;
                    color: var(--text-secondary);
                    transition: color 0.2s;
                }
                
                .icon-wrapper:hover .icon-action {
                    color: var(--text-primary);
                }
                
                /* Language Icon Styling (Flag Placeholder) */
                .flag-placeholder {
                    font-size: 20px; 
                    line-height: 1; 
                    height: 20px;
                    width: 20px;
                    display: block;
                    overflow: hidden; 
                }
                
                .language-icon-wrapper {
                     padding: 0; 
                     margin-right: 15px; 
                     height: 30px; 
                     width: 30px;
                     border-radius: 50%;
                     overflow: hidden;
                     display: flex;
                     align-items: center;
                     justify-content: center;
                     background-color: rgba(255, 255, 255, 0.1);
                }
                
                /* Notification Badge */
                .notification-badge {
                    position: absolute;
                    top: 0px;
                    right: 0px;
                    background-color: ${ERROR_COLOR}; 
                    color: white;
                    border-radius: 50%;
                    width: 16px;
                    height: 16px;
                    font-size: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    box-shadow: 0 0 0 2px var(--bg-top-nav); 
                }

                /* SPINNING ANIMATION FOR SETTINGS ICON */
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                .spin-icon {
                    animation: spin 6s linear infinite;
                }

                /* --- User Profile Dropdown --- (Standard styles) */
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

                .user-avatar-img {
                    width: 32px; 
                    height: 32px;
                    border-radius: 50%; 
                    object-fit: cover;
                    margin-right: 10px;
                    border: 2px solid var(--text-primary); 
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
                    color: white; 
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