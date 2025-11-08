// src/components/Sidebar.js - FINAL STRUCTURE (With Collapsed Dropdown Overlay Fix)

import React, { useState, useEffect, useCallback } from 'react'; 
import { 
  FaTachometerAlt, FaChartLine, FaUsers, FaCar, FaToolbox, FaFileInvoice, FaDollarSign, 
  FaCreditCard, FaCalendarAlt, FaClock, FaWrench, 
   FaAngleLeft, FaAngleRight, FaChevronDown, FaChevronUp, FaClipboardList, FaBars 
} from 'react-icons/fa'; 

const sidebarModules = [
  { name: 'Dashboard', icon: FaTachometerAlt, path: '/dashboard' },
  { name: 'Customer / Clients', icon: FaUsers, path: '/clients' }, 
  { name: 'Customer Vehicle', icon: FaCar, path: '/vehicles', highlight: '' }, 
  
  // 🏆 JOB CARDS PARENT MODULE 
  { 
    name: 'Job Cards', 
    icon: FaClipboardList, 
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
      // Paths corrected for consistency
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
  { name: 'Vendors', icon: FaUsers, path: '/vendors/add' }, 
  { name: 'Service Reminders', icon: FaClock, path: '/reminders' },
  { name: 'Purchase Order', icon:FaCreditCard , path: '/purchaseorder' },
  { name: 'Reports Analysis', icon: FaChartLine, path: '/reports' },
  { name: 'Configuration', icon: FaWrench, path: '/configuration' },
];

const Sidebar = ({ currentPath, isCollapsed, toggleSidebar, navigateTo }) => { 
  
  const ToggleIcon = isCollapsed ? FaAngleRight : FaAngleLeft;
  const [openDropdown, setOpenDropdown] = useState('');

  // Helper to determine if a module or its children are currently active
  const isModuleActive = useCallback((module) => {
    // Dashboard check (special case for '/')
    if (module.path === '/dashboard') {
        return currentPath === '/' || currentPath === '/dashboard';
    }

    // Check if the current path starts with the module's path
    if (module.isCollapsible) {
        // Use a more specific check for collapsible items
        return module.subModules.some(sub => currentPath.startsWith(sub.path));
    }
    
    // Check if the link itself is active
    const moduleBase = `/${module.path.split('/')[1]}`;
    const currentBase = `/${currentPath.split('/')[1]}`;
    return moduleBase === currentBase;
    
  }, [currentPath]); 

  const handleDropdownToggle = useCallback((path) => {
    setOpenDropdown(prev => prev === path ? '' : path);
  }, []); 

  // Auto-open dropdown if any sub-module is currently active
  useEffect(() => {
    let shouldOpenPath = '';
    const activeModule = sidebarModules.find(module => 
      module.isCollapsible && isModuleActive(module)
    );
    
    if (activeModule) {
      shouldOpenPath = activeModule.path;
    }
    
    // 🐛 FIX: Added 'openDropdown' dependency
    if (openDropdown !== shouldOpenPath) {
      setOpenDropdown(shouldOpenPath);
    }
    
  }, [currentPath, isModuleActive, openDropdown]); 


  return (
    <nav className={`sidebar ${isCollapsed ? 'sidebar--collapsed' : ''}`}> 
      
      {/* 1. LOGO/HEADER AREA - Now functions as the main Toggle button */}
      <button 
        className="sidebar-header header-toggle-button" 
        onClick={toggleSidebar}
        title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
      >
        <FaBars className="logo-icon" /> 
        <span className="logo-text">AUTO REPAIR SYS</span>
        
        {/* The Toggle button icon is now inside the header, replacing the old separate button */}
        <ToggleIcon className="header-collapse-icon" /> 
      </button>

      {/* 2. NAVIGATION LINKS */}
      <div className="nav-wrapper">
        
        {/* List of Main Navigation Items */}
        <ul>
          {sidebarModules.map((module) => {
              
            const isActive = isModuleActive(module);
            const isDropdownOpen = module.path === openDropdown;
            
            // Determine the link's target path
            const targetPath = module.isCollapsible && module.subModules.length > 0
                               ? module.subModules[0].path
                               : module.path;
                               
            // Determine if the module link itself should be highlighted (active)
            const shouldHighlightLink = module.isCollapsible ? isActive : (currentPath === module.path || isActive);

            return (
              <React.Fragment key={module.path}>
                <li 
                  className={shouldHighlightLink ? 'active' : ''} 
                  title={isCollapsed ? module.name : ''} 
                >
                  <a 
                    href={targetPath}
                    className="sidebar-link"
                    onClick={(e) => {
                      e.preventDefault(); 
                      
                      if (module.isCollapsible) {
                        // Toggle the dropdown
                        handleDropdownToggle(module.path); 
                        
                        // If the dropdown is closed or we are collapsing it, navigate to the default path
                        if (!isDropdownOpen) {
                             navigateTo(targetPath);
                        }
                      } else {
                        navigateTo(module.path); 
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
                
                {/* SUB-MENU ITEMS (Dropdown) */}
                {module.isCollapsible && isDropdownOpen && (
                  <ul className="submenu-list">
                    {module.subModules.map((subModule) => (
                      <li 
                        key={subModule.path}
                        // Use startsWith for active check on submodules
                        className={currentPath.startsWith(subModule.path) ? 'active' : ''}
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
          background-color: #212A38; 
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
          /* 🔑 Z-INDEX: High z-index for the main sidebar */
          z-index: 1000; 
          box-shadow: 3px 0 10px rgba(0,0,0,0.2); 
        }

        .sidebar--collapsed {
          width: 80px; 
        }

        /* 🚀 HEADER STYLES */
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
            background-color: #2c3848; 
            border-bottom: 1px solid rgba(255, 255, 255, 0.15); 
            position: relative;
            transition: background-color 0.2s;
        }

        .sidebar-header:hover {
            background-color: #38465b; 
        }
        
        .logo-icon {
            font-size: 24px;
            color: #4ade80; /* Accent color for logo */
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
        
        /* 🔑 Positioning context for dropdown overlay */
        .nav-wrapper ul li {
             position: relative;
        }


        /* ----------------------------------------------------------------- */
        /* LINK STYLES (Main and Sub) */
        /* ----------------------------------------------------------------- */
        .sidebar-link {
          display: flex;
          align-items: center;
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
          background-color: #2c3848; 
          color: #ffffff;
        }

        /* Active Link Styles */
        .sidebar li.active > .sidebar-link {
          background-color: #38465b; 
          color: #ffffff; 
          font-weight: 600;
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
            padding: 0;
            margin: 0;
            background-color: #1e2632; 
        }

        .submenu-list li.active .sidebar-link {
             background-color: #2c3848; 
             color: #ffffff;
             position: relative;
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

        .submenu-list .sidebar-link:hover {
            background-color: #2c3848;
            color: #ffffff;
        }
        
        .sub-link-text {
            margin-left: -5px; 
        }
        
        /* ----------------------------------------------------------------- */
        /* COLLAPSED STATE ADJUSTMENTS & DROPDOWN OVERLAY FIX */
        /* ----------------------------------------------------------------- */

        .sidebar--collapsed .link-text,
        .sidebar--collapsed .highlight-tag,
        .sidebar--collapsed .dropdown-indicator {
            display: none;
        }
        
        .sidebar--collapsed .sidebar-link {
            padding: 12px 25px;
            justify-content: center;
        }

        .sidebar--collapsed .link-icon {
            margin-right: 0;
        }
        
        /* Collapsed Dropdown Overlay (Smart Fix) */
        .sidebar--collapsed .submenu-list {
            /* Position absolutely relative to the parent LI */
            position: absolute;
            /* Start just outside the 80px collapsed sidebar */
            left: 80px; 
            top: 0;
            width: 200px; 
            /* 🔑 Z-INDEX: Higher than the main sidebar to float over content */
            z-index: 1050; 
            border-left: 1px solid #38465b;
            box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.4);
            display: none; /* Hide by default in collapsed state */
        }
        
        /* Show the submenu list when the collapsed parent <li> is active (clicked/open) */
        .sidebar--collapsed li.active > .submenu-list {
            display: block; 
        }
        
        /* Optional: Show on hover (if you want hover-to-open functionality) */
        /*
        .sidebar--collapsed li:hover > .submenu-list {
            display: block; 
        }
        */

        .sidebar--collapsed .submenu-list .sidebar-link {
            padding: 10px 15px 10px 15px; /* Adjust padding for the overlay menu */
        }
        
        .sidebar--collapsed .submenu-list li.active .sidebar-link::before {
            background-color: #4ade80; 
        }
      `}</style>
    </nav>
  );
};

export default Sidebar;