// src/components/Sidebar.js - FINAL STRUCTURE (Hover Dropdown for Expanded State)

import React, { useState, useEffect, useCallback } from 'react'; 
import { 
  FaTachometerAlt, FaChartLine, FaUsers, FaCar, FaToolbox, FaFileInvoice, FaDollarSign, 
  FaCreditCard, FaCalendarAlt, FaClock, FaWrench, 
  FaAngleLeft, FaAngleRight, FaChevronDown, FaChevronUp, FaClipboardList, FaBars, 
  // 🏆 NEW ICON FOR EMPLOYEE MANAGEMENT
  FaUserTie,
  // ⭐ NEW ICON FOR PURCHASE ORDER (Use FaShoppingCart for consistency with inventory flow)
  FaShoppingCart 
} from 'react-icons/fa'; 

const sidebarModules = [
  { name: 'Dashboard', icon: FaTachometerAlt, path: '/dashboard' },
  { name: 'Manage Customer', icon: FaUsers, path: '/clients' }, 
  { name: 'Customer Vehicle', icon: FaCar, path: '/vehicles', highlight: '' }, 
  
  // 🏆 NEW MODULE: EMPLOYEE MANAGEMENT 🏆
  { name: 'Manage Employees', icon: FaUserTie, path: '/employees' },
  
  // 🛑 NEW MODULE: REQUEST SERVICE 🛑
  { name: 'Request Service', icon: FaClipboardList, path: '/request-service', highlight: '' },
  // ------------------------------------
  
  // 🏆 JOB CARDS PARENT MODULE 
  { 
    // 🛑 UPDATED ICON: Changed from FaClipboardList to FaWrench for job cards parent
    name: 'Job Cards', 
    icon: FaWrench, 
    path: '/jobcards', 
    isCollapsible: true, 
    subModules: [
        { name: 'Kanban Board List', path: '/jobcards/kanban', highlight: '' }, 
        { name: 'Create New Job Card', path: '/jobcards/new', highlight: 'NEW' }, 
    ]
  },
  // ---------------------------------------------------------------------

  // ---------------------- INVENTORY PARENT MODULE ----------------------
  { 
    name: 'Inventory / Stock', 
    icon: FaToolbox, 
    path: '/inventory', 
    isCollapsible: true, 
    subModules: [
      { name: 'Parts', path: '/inventory/parts', highlight: '' }, 
      { name: 'Labor', path: '/inventory/labor', highlight: '' }, 
      { name: 'Tires', path: '/inventory/tires', highlight: '' }, 
      { name: 'Canned Jobs', path: '/inventory/canned-jobs', highlight: '' }, 
      { name: 'Business Asset', path: '/inventory/asset', highlight: '' }, 
    ]
  },
  // ---------------------------------------------------------------------

  { name: 'Invoices & Estimates', icon: FaFileInvoice, path: '/invoices-estimates' },
  { name: 'Payments', icon: FaCreditCard, path: '/payments' },
  { name: 'Accounting', icon: FaDollarSign, path: '/accounting' },
  { name: 'Appointments', icon: FaCalendarAlt, path: '/appointments/new', highlight: '' },
  { name: 'Vendors', icon: FaUsers, path: '/inventory/vendors' }, // Adjusted path to match form handler
  { name: 'Service Reminders', icon: FaClock, path: '/reminders' },
  // 🛑 FIX HERE: Changed icon to FaShoppingCart for relevance and path to '/purchase-orders'
  { name: 'Purchase Order', icon: FaShoppingCart , path: '/purchase-orders' }, 
  { name: 'Reports Analysis', icon: FaChartLine, path: '/reports' },
  // 🛑 ICON UPDATE: FaWrench is used for Job Cards and Configuration
  { name: 'Configuration', icon: FaWrench, path: '/configuration' },
];

const Sidebar = ({ currentPath, isCollapsed, toggleSidebar, navigateTo }) => { 
  
  const ToggleIcon = isCollapsed ? FaAngleRight : FaAngleLeft;
  // State for which dropdown is open 
  const [openDropdown, setOpenDropdown] = useState('');
  // State to hold the current top position of the flyout menu
  const [flyoutTop, setFlyoutTop] = useState(0); 
  // State to hold the current module path being hovered in collapsed state
  const [hoveredModulePath, setHoveredModulePath] = useState('');


  // Helper to determine if a module or its children are currently active
  const isModuleActive = useCallback((module) => {
    // 🛑 SAFETY PATCH: Use an empty string if currentPath is undefined or null
    const pathToCheck = currentPath || '';

    // Dashboard check (special case for '/')
    if (module.path === '/dashboard') {
        return pathToCheck === '/' || pathToCheck === '/dashboard';
    }

    // Check if the current path starts with the module's path
    if (module.isCollapsible) {
        // Check if any sub-module path starts with the current path
        const subModuleActive = module.subModules.some(sub => pathToCheck.startsWith(sub.path));
        // Also check if the current path starts with the PARENT path itself 
        const parentPathActive = pathToCheck.startsWith(module.path);
        
        return subModuleActive || parentPathActive;
    }
    
    // Check if the link itself is active
    // Use startsWith for base path match (e.g., /clients matches /clients/123)
    return pathToCheck.startsWith(module.path);
    
  }, [currentPath]); // Dependency array remains the same

  // Auto-open dropdown if any sub-module is currently active
  useEffect(() => {
    let shouldOpenPath = '';
    const activeModule = sidebarModules.find(module => 
      module.isCollapsible && isModuleActive(module)
    );
    
    if (activeModule) {
      shouldOpenPath = activeModule.path;
    }
    
    // Only set the openDropdown if the path is different from the current state
    setOpenDropdown(prevOpenDropdown => {
        if (prevOpenDropdown !== shouldOpenPath) {
            return shouldOpenPath;
        }
        return prevOpenDropdown;
    });
    
  }, [currentPath, isModuleActive]);


    // Handler for expanded mode (click to open/close dropdown)
    const handleToggleDropdown = useCallback((e, module) => {
        e.preventDefault();
        
        if (module.isCollapsible) {
            // Toggle openDropdown state
            setOpenDropdown(prev => (prev === module.path ? '' : module.path));
        } else {
            // Navigate directly if not collapsible
            navigateTo(module.path); 
        }
    }, [navigateTo]);

    // Handlers for mouse enter/leave when COLLAPSED (Flyout mode)
    const handleMouseEnter = useCallback((e, module) => {
        if (!isCollapsed || !module.isCollapsible) return;
        
        const rect = e.currentTarget.getBoundingClientRect();
        // Set the flyout position relative to the sidebar
        setFlyoutTop(rect.top - 10); // Adjusting the offset slightly
        setHoveredModulePath(module.path);
    }, [isCollapsed]);

    const handleMouseLeave = useCallback(() => {
        if (isCollapsed) {
            // Allow a short delay to move to the flyout menu without it closing
            setTimeout(() => {
                // If the mouse is not over the flyout area or another item, clear it
                setHoveredModulePath('');
            }, 300); 
        }
    }, [isCollapsed]);
    
    // The dropdown is open if:
    // 1. We are expanded AND it was clicked open (openDropdown state)
    // 2. We are collapsed AND we are hovering over it (hoveredModulePath state)
    // 3. It is the active module (isModuleActive)

    return (
        <nav className={`sidebar ${isCollapsed ? 'sidebar--collapsed' : ''}`}> 
        
        {/* 1. LOGO/HEADER AREA */}
        <button 
            className="sidebar-header header-toggle-button" 
            onClick={toggleSidebar}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
            <FaBars className="logo-icon" /> 
            <span className="logo-text">AUTO REPAIR SYS</span>
            
            <ToggleIcon className="header-collapse-icon" /> 
        </button>

        {/* 2. NAVIGATION LINKS */}
        <div className="nav-wrapper">
            
            {/* List of Main Navigation Items */}
            <ul>
            {sidebarModules.map((module) => {
                
                const isActive = isModuleActive(module);
                const isDropdownOpen = module.path === openDropdown && !isCollapsed; // Expanded click-based state
                const isFlyoutOpen = module.path === hoveredModulePath && isCollapsed; // Collapsed hover-based state
                
                // Determine the link's target path
                const targetPath = module.isCollapsible && module.subModules.length > 0
                                ? module.subModules[0].path
                                : module.path;
                                
                // Determine if the module link itself should be highlighted (active)
                const shouldHighlightLink = isActive; // Simplified to just use isActive

                // Handlers for mouse enter/leave when COLLAPSED (Flyout mode)
                const listHandlers = module.isCollapsible ? {
                    onMouseEnter: (e) => handleMouseEnter(e, module),
                    onMouseLeave: handleMouseLeave,
                } : {};


                return (
                <React.Fragment key={module.path}>
                    <li 
                    className={shouldHighlightLink ? 'active' : ''} 
                    title={isCollapsed ? module.name : ''} 
                    {...listHandlers}
                    >
                    <a 
                        href={targetPath}
                        // 🛑 ADD CLASS TO DIFFERENTIATE MAIN ITEM LINKS
                        className={`sidebar-link ${shouldHighlightLink ? 'active-link-wrapper' : ''}`}
                        onClick={(e) => {
                            // If expanded, click toggles the dropdown OR navigates
                            if (!isCollapsed) {
                                if (module.isCollapsible) {
                                    handleToggleDropdown(e, module);
                                } else {
                                    e.preventDefault();
                                    navigateTo(module.path);
                                }
                            } else {
                                // If collapsed, click navigates to the default path (subModule[0])
                                e.preventDefault();
                                navigateTo(targetPath);
                            }
                        }}
                    >
                        <module.icon className="link-icon" />
                        
                        <span className="link-text">{module.name}</span>
                        {module.highlight && <span className="highlight-tag">{module.highlight}</span>}
                        
                        {/* Dropdown Indicator (visible when not collapsed) */}
                        {module.isCollapsible && !isCollapsed && (
                            isDropdownOpen 
                            ? <FaChevronUp className="dropdown-indicator active" /> 
                            : <FaChevronDown className="dropdown-indicator" />
                        )}
                    </a>
                    </li>
                    
                    {/* SUB-MENU ITEMS (Dropdown / Flyout) */}
                    {module.isCollapsible && (
                    <ul 
                        className={`submenu-list ${isDropdownOpen || isFlyoutOpen ? 'open' : ''}`}
                        // Add mouse enter/leave to the flyout to keep it open when hovering over it
                        onMouseEnter={isCollapsed ? (e) => setHoveredModulePath(module.path) : undefined}
                        onMouseLeave={isCollapsed ? handleMouseLeave : undefined}
                        
                        // Inline style for smooth CSS transition (Expanded)
                        style={!isCollapsed && module.isCollapsible ? {
                            maxHeight: isDropdownOpen ? '500px' : '0',
                        } : 
                        // Inline style for Flyout positioning (Collapsed)
                        isFlyoutOpen ? {
                            top: `${flyoutTop}px`,
                        } : {}}
                    >
                        {module.subModules.map((subModule) => (
                        <li 
                            key={subModule.path}
                            // Use startsWith for active check on submodules, adding currentPath safety check
                            className={currentPath && currentPath.startsWith(subModule.path) ? 'active' : ''}
                        >
                            <a 
                            href={subModule.path}
                            className="sidebar-link sub-link" 
                            onClick={(e) => {
                                e.preventDefault();
                                navigateTo(subModule.path);
                            }}
                            >
                            <span className="sub-link-text">
                                {subModule.name}
                            </span>
                            {subModule.highlight && <span className="highlight-tag">{subModule.highlight}</span>}
                            </a>
                        </li>
                        ))}
                    </ul>
                    )}
                </React.Fragment>
                );
            })}
            </ul>
        </div>

        
        {/* ADDED STYLES */}
        <style>{`
            /* ----------------------------------------------------------------- */
            /* BASE SIDEBAR & LAYOUT STYLES (Unified Dark Colors) */
            /* ----------------------------------------------------------------- */
            
            .sidebar {
            background-color: #242421ff; 
            color: #ffffff;
            height: 100vh;
            width: 250px; 
            position: fixed;
            top: 0;
            left: 0;
            padding: 0; 
            transition: width 0.3s ease;
            display: flex;
            flex-direction: column;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            z-index: 1000; 
            box-shadow: 3px 0 10px rgba(0,0,0,0.2); 
            }

            .sidebar--collapsed {
            width: 80px; 
            }
            
            /* ----------------------------------------------------------------- */
            /* SMOOTH DROPDOWN TRANSITION FIX (Expanded Mode) */
            /* ----------------------------------------------------------------- */

            .submenu-list {
                /* Initial state for the transition */
                max-height: 0;
                overflow: hidden;
                /* 🔑 FIX: Smooth max-height transition */
                transition: max-height 0.3s ease-out; 
                padding: 0;
                margin: 0;
                background-color: #252524ff; 
                z-index: 999; 
            }

            .submenu-list.open {
                /* Target state, a large enough value to accommodate all sub-menus */
                max-height: 500px !important; 
            }


            /* ----------------------------------------------------------------- */
            /* COLLAPSED STATE ADJUSTMENTS (Flyout) */
            /* ----------------------------------------------------------------- */

            .sidebar--collapsed .link-text,
            .sidebar--collapsed .highlight-tag,
            .sidebar--collapsed .dropdown-indicator {
                display: none;
            }
            
            /* Collapsed Dropdown Overlay (Flyout - Controlled by React State/Hover) */
            .sidebar--collapsed .submenu-list {
                /* Overwrite max-height transition for collapsed flyout */
                transition: none; 
                max-height: none !important; 
                /* Initial state controlled by JS */
                display: none; 
            }
            
            /* Show flyout when collapsed and open state is set */
            .sidebar--collapsed .submenu-list.open {
                position: fixed; /* Fixed position relative to viewport */
                left: 80px; 
                width: 200px; 
                z-index: 1050; 
                border-left: 1px solid #38465b;
                box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
                display: block; /* Show instantly when openDropdown state is set */
                
                /* The 'top' property is set via inline style based on flyoutTop state */
            }
            
            /* Ensure the list item itself acts as the trigger area for the flyout */
            .sidebar--collapsed .nav-wrapper ul li {
                position: static; /* Clear relative positioning that might interfere with fixed submenu */
            }
            
            .sidebar--collapsed .submenu-list .sidebar-link {
                padding: 10px 15px 10px 15px; /* Adjust padding for the overlay menu */
            }
            
            /* --- KEEP ALL OTHER CSS STYLES THE SAME --- */

            .sidebar-header {
                background: none;
                border: none;
                cursor: pointer;
                width: 100%;
                text-align: left;
                padding: 15px 20px;
                display: flex;
                align-items: center;
                height: 60px;
                background-color: #242421ff; 
                border-bottom: 1px solid rgba(255, 255, 255, 0.15); 
                position: relative;
                transition: background-color 0.2s;
            }

            .sidebar-header:hover {
                background-color: #38465b; 
            }
            
            .logo-icon {
                font-size: 24px;
                color: #ce5616ff; /* Accent color for logo */
                margin-right: 10px;
            }

            .logo-text {
                font-size: 18px;
                font-weight: 700; 
                color: #ffffff;
                white-space: nowrap;
                overflow: hidden;
                flex-grow: 1;
            }

            .header-collapse-icon {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                right: 15px;
                font-size: 18px;
                color: #aeb8c8; 
            }


            .sidebar--collapsed .logo-text {
                display: none;
            }
            
            .sidebar--collapsed .logo-icon {
                margin: 0;
            }

            .nav-wrapper {
                flex-grow: 1;
                overflow-y: auto;
                padding: 10px 0; 
            }

            .nav-wrapper ul {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            
            /* ----------------------------------------------------------------- */
            /* LINK STYLES (Main and Sub) */
            /* ----------------------------------------------------------------- */
            .sidebar-link {
            display: flex;
            align-items: center;
            /* 🛑 Remove padding from the link itself for active state padding */
            padding: 12px 20px; 
            text-decoration: none;
            color: #c4ccd8; 
            font-size: 15px;
            transition: background-color 0.2s, color 0.2s;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            }

            .sidebar-link:hover {
            background-color: #3a3a37ff; 
            color: #ffffff;
            /* 🛑 Remove transform/border-radius on hover */
            }

            /* 🛑 NEW: Wrapper for the link when active to handle horizontal padding and margin */
            .nav-wrapper ul li.active {
                padding: 0 10px; /* Add padding to the list item horizontally */
                margin: 5px 0; /* Add vertical space between rounded links */
            }
            
            /* Active Link Styles - APPLY ROUND SHAPE AND BACKGROUND HERE */
            .sidebar li.active > .sidebar-link {
                /* 🛑 Apply background and radius to the link */
                background-color: #ce5616ff; 
                color: #ffffff; 
                font-weight: 600;
                border-radius: 8px; /* Round corners */
                /* 🛑 Re-apply necessary padding inside the rounded link */
                padding: 12px 20px; 
            }
            
            /* Highlight the icon when the link is active */
            .sidebar li.active > .sidebar-link .link-icon {
                color: #4ade80; 
            }


            .link-icon {
            font-size: 18px;
            min-width: 30px; 
            margin-right: 15px;
            color: inherit; 
            }
            
            .highlight-tag {
                background-color: #ef4444; 
                color: white;
                font-size: 10px;
                padding: 2px 6px;
                border-radius: 9999px; 
                margin-left: 10px;
                font-weight: 700;
            }
            
            .dropdown-indicator {
                margin-left: auto;
                font-size: 10px;
                transition: transform 0.2s;
                color: #aeb8c8;
            }
            
            .dropdown-indicator.active {
                transform: rotate(180deg);
            }

            /* ----------------------------------------------------------------- */
            /* SUB-MENU STYLES (Clean Nested Look - Expanded) */
            /* ----------------------------------------------------------------- */

            .submenu-list {
                /* 🛑 Override list item padding/margin for submenus */
                margin: 0 !important; 
                padding: 0 !important; 
            }
            
            /* 🛑 Reset active list item styles for submenus */
            .submenu-list li.active {
                padding: 0;
                margin: 0; 
            }
            
            .submenu-list li.active .sidebar-link {
                /* Submenu active background color */
                background-color: #2c3848; 
                color: #ffffff;
                position: relative;
                /* 🛑 Remove border radius for sub-menu items */
                border-radius: 0; 
                font-weight: 500;
            }
            
            .submenu-list li.active .sidebar-link::before {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                height: 100%;
                width: 4px;
                background-color: #4ade80; 
                border-radius: 0 4px 4px 0;
            }

            .submenu-list .sidebar-link {
                padding: 10px 20px 10px 55px; 
                font-size: 14px;
                color: #c4ccd8;
            }
            
            /* Adjust padding for collapsed state flyout */
            .sidebar--collapsed .submenu-list .sidebar-link {
                 padding: 10px 15px;
            }


            .submenu-list .sidebar-link:hover {
                background-color: #2c3848;
                color: #ffffff;
            }
            
            .sub-link-text {
                margin-left: -5px; 
            }

        `}</style>
        </nav>
    );
};

export default Sidebar;