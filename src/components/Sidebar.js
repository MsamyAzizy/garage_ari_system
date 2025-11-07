// src/components/Sidebar.js - FINAL STRUCTURE (Minimized Width)

import React, { useState, useEffect, useCallback } from 'react'; 
import { 
  FaTachometerAlt, FaChartLine, FaUsers, FaCar, FaToolbox, FaFileInvoice, FaDollarSign, 
  FaCreditCard, FaCalendarAlt, FaClock, FaWrench, 
   FaAngleLeft, FaAngleRight, FaChevronDown, FaChevronUp, FaClipboardList, FaBars 
} from 'react-icons/fa'; 

const sidebarModules = [
  { name: 'Dashboard', icon: FaTachometerAlt, path: '/dashboard' },
  // NOTE: Assuming this path change should persist
  { name: 'Customer / Clients', icon: FaUsers, path: '/clients' }, 
  { name: 'Customer Vehicle', icon: FaCar, path: '/vehicles', highlight: '' }, 
  
  { name: 'Job Cards', icon: FaClipboardList, path: '/jobcards' },

  // ---------------------- INVENTORY PARENT MODULE ----------------------
  { 
    name: 'Inventory / Stock', 
    icon: FaToolbox, 
    path: '/inventory', 
    isCollapsible: true, 
    subModules: [
      { name: 'Parts', path: '/inventory/parts/add', highlight: '' }, 
      { name: 'Labor', path: '/inventory/labor/add', highlight: '' }, 
      { name: 'Tires', path: '/inventory/tires/add', highlight: '' }, 
      { name: 'Canned Jobs', path: '/inventory/canned-jobs/add', highlight: '' }, 
      { name: 'Business Asset', path: '/inventory/asset/add', highlight: '' }, 
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

  const isModuleActive = useCallback((path) => {
    // Adjusted logic from previous steps to correctly handle paths like /client/new
    const parts = currentPath.split('/');
    const currentBase = parts.length > 1 ? `/${parts[1]}` : currentPath;
    
    // Check if the current path starts with the module path (e.g., /client/new starts with /client)
    if (module.isCollapsible) {
        return currentPath.startsWith(module.path);
    }
    
    const moduleBase = `/${path.split('/')[1]}`;
    return currentBase.startsWith(moduleBase);

  }, [currentPath]); 

  const handleDropdownToggle = useCallback((path) => {
    if (openDropdown === path) {
      setOpenDropdown('');
    } else {
      setOpenDropdown(path);
    }
  }, [openDropdown]); 

  useEffect(() => {
    const activeModule = sidebarModules.find(module => 
      module.isCollapsible && isModuleActive(module.path)
    );
    if (activeModule && openDropdown === '') {
      setOpenDropdown(activeModule.path);
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
              
            // Reworked activation logic for consistency with dynamic paths like /client/new
            const basePath = `/${currentPath.split('/')[1]}`;
            const moduleBasePath = `/${module.path.split('/')[1]}`;
            const isActive = module.path === '/dashboard' ? (currentPath === '/' || currentPath === '/dashboard') : (moduleBasePath === basePath);

            const dashboardActive = module.path === '/dashboard' && (currentPath === '/' || currentPath === '/dashboard');
            const isDropdownOpen = module.path === openDropdown || (module.isCollapsible && isActive && openDropdown === '');
              
            return (
              <React.Fragment key={module.path}>
                <li 
                  className={dashboardActive || isActive ? 'active' : ''} 
                  title={isCollapsed ? module.name : ''} 
                >
                  <a 
                    href={module.path}
                    className="sidebar-link"
                    onClick={(e) => {
                      e.preventDefault(); 
                      
                      if (module.isCollapsible) {
                        handleDropdownToggle(module.path); 
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
                        ? <FaChevronUp className="dropdown-indicator" style={{marginLeft: 'auto', fontSize: '10px'}}/> 
                        : <FaChevronDown className="dropdown-indicator" style={{marginLeft: 'auto', fontSize: '10px'}}/>
                    )}
                  </a>
                </li>
                
                {/* SUB-MENU ITEMS (Dropdown) */}
                {module.isCollapsible && isDropdownOpen && (
                  <ul className="submenu-list">
                    {module.subModules.map((subModule) => (
                      <li 
                        key={subModule.path}
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
                          <span>
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
        
        /* 💡 REMINDER: Update your .main-content rules to match the new width (250px) */
        /*
        .main-content {
             padding-top: 70px; 
             margin-left: 250px; // <-- UPDATED FROM 300px
             transition: margin-left 0.3s ease;
             min-height: 100vh;
        }

        .main-content.sidebar-collapsed {
             margin-left: 80px;
        }
        */
        
        .sidebar {
          background-color: #212A38; 
          color: #ffffff;
          height: 100vh;
          /* 🚀 UPDATED: Minimized expanded width */
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
          box-shadow: 2px 0 6px rgba(0,0,0,0.1); 
        }

        .sidebar--collapsed {
          width: 80px; 
        }

        /* 🚀 HEADER STYLES (Slightly Lighter Navy Shade) */
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
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            position: relative;
            transition: background-color 0.2s;
        }

        .sidebar-header:hover {
            background-color: #38465b; 
        }
        
        .logo-icon {
            font-size: 24px;
            color: #ffffff; 
            margin-right: 10px;
        }

        .logo-text {
            font-size: 18px;
            font-weight: 600;
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


        .sidebar--collapsed .logo-text,
        .sidebar--collapsed .back-text {
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
          padding: 10px 20px; 
          text-decoration: none;
          color: #aeb8c8; 
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

        .link-icon {
          font-size: 18px;
          min-width: 30px; 
          margin-right: 15px;
          color: inherit; 
        }

        /* ----------------------------------------------------------------- */
        /* SUB-MENU STYLES */
        /* ----------------------------------------------------------------- */
        .submenu-list {
            padding: 0;
            margin: 0;
            background-color: #2c3848; 
        }

        .submenu-list li.active {
            font-weight: 600;
        }
        
        .submenu-list li.active .sidebar-link {
             background-color: #38465b; 
             color: #ffffff;
        }

        .submenu-list .sidebar-link {
            /* 🚀 ADJUSTED: Reduced padding-left to align better with reduced width */
            padding: 10px 20px 10px 55px; 
            font-size: 14px;
            color: #ffffff;
        }

        .submenu-list .sidebar-link:hover {
            background-color: #38465b;
            color: #ffffff;
        }
        
        /* ----------------------------------------------------------------- */
        /* Collapsed State Adjustments */
        /* ----------------------------------------------------------------- */
        .sidebar--collapsed .sidebar-link,
        .sidebar--collapsed .back-link-button {
            padding: 10px 25px;
            justify-content: center;
        }
        .sidebar--collapsed .link-icon,
        .sidebar--collapsed .back-icon {
            margin-right: 0;
        }

        /* Hide the collapse icon when collapsed */
        .sidebar--collapsed .header-collapse-icon {
             display: none;
        }
        
      `}</style>
    </nav>
  );
};

export default Sidebar;