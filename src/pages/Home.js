// src/pages/Home.js - The main protected application layout

import React, { useState, useEffect } from 'react'; 
// 🛑 Added useLocation to read state from navigation
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom'; 
import { FaCar, FaPlusCircle, FaPlus, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // 🛑 Added icons

// 🛑 IMPORTANT: Import the apiClient instance
import apiClient from '../utils/apiClient';
// 🛑 IMPORT the useAuth hook to get the logout function AND THE USER OBJECT
import { useAuth } from '../context/AuthContext'; 

// Import Layout Components
import TopNavBar from '../components/TopNavigationBar'; 
import Sidebar from '../components/Sidebar';             

// Import Page Components
import Dashboard from '../components/Dashboard';         
import ClientsList from '../components/ClientsList';     
import ClientForm from '../components/ClientDetailForm';   
// Importing all sub-components
import VehicleForm from '../components/VehicleForm'; 
import InventoryForm from '../components/InventoryForm'; 
import TireForm from '../components/TireForm'; 
import LaborForm from '../components/LaborForm'; 
import CannedJobForm from '../components/CannedJobForm'; 
import BusinessAssetList from '../components/BusinessAssetList'; 
import BusinessAssetForm from '../components/BusinessAssetForm'; 
import VendorForm from '../components/VendorForm';
import AppointmentForm from '../components/AppointmentForm';
// 🏆 NEW: Import the Footer component
import Footer from '../components/Footer';


// Define common colors for the Toast
const SUCCESS_COLOR = '#2ecc71'; 
const ERROR_COLOR = '#e74c3c'; 


// -----------------------------------------------------------------
// 1. TOAST NOTIFICATION COMPONENT (Defined for Home.js for App-Wide use)
// -----------------------------------------------------------------
const ToastNotification = ({ message, type, duration = 2000, onClose }) => {
    
    useEffect(() => {
        if (!message) return;

        const timer = setTimeout(() => {
            onClose();
        }, duration); 
        return () => clearTimeout(timer);
    }, [message, duration, onClose]);

    if (!message) return null; 

    // Determine color and icon
    const color = type === 'success' ? SUCCESS_COLOR : ERROR_COLOR;
    const icon = type === 'success' ? <FaCheckCircle /> : <FaTimesCircle />;

    return (
        <div className="app-toast-notification-container">
            <div className="toast-content" style={{ backgroundColor: color }}>
                {icon}
                <span className="toast-message">{message}</span>
            </div>
             {/* CSS for the Toast Notification (Top Right) */}
            <style jsx>{`
                .app-toast-notification-container {
                    position: fixed;
                    top: 80px; /* Below the 60px TopNavBar + 20px buffer */
                    right: 20px;
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
// MOCK VEHICLE LIST COMPONENT (Defined internally for Home.js) 
// -----------------------------------------------------------------
const VehicleList = ({ navigateTo, vehicles }) => (
    <div className="list-page-container">
        <header className="page-header vehicle-list-header">
            <h2 style={{ flexGrow: 1 }}><FaCar style={{ marginRight: '8px' }}/> Vehicle List ({vehicles.length})</h2>
            <button 
                className="btn-primary-action" 
                onClick={() => navigateTo('/vehicles/new')}
                style={{ marginLeft: 'auto' }} 
            >
                <FaPlusCircle style={{ marginRight: '5px' }} /> Add New Vehicle
            </button>
        </header>
        <div className="list-content-area" style={{ padding: '20px' }}>
            
            {vehicles.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    <p>No vehicles have been added yet.</p>
                </div>
            ) : (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>VIN</th>
                            <th>License Plate</th>
                            <th>Make/Model</th>
                            <th>Year</th>
                            <th>ODO</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vehicles.map((v, index) => (
                            <tr key={index}>
                                <td>{v.vin}</td>
                                <td>{v.licensePlate}</td>
                                <td>{v.make} / {v.model}</td>
                                <td>{v.year}</td>
                                <td>{v.odoReading}</td>
                                <td><button className="btn-link" onClick={() => navigateTo(`/vehicles/${v.vin}`)}>View</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    </div>
);


// -----------------------------------------------------------------
// HOME COMPONENT (MAIN APPLICATION LAYOUT)
// -----------------------------------------------------------------
const Home = () => { 
    const { logout, user } = useAuth();
    const navigate = useNavigate(); 
    const location = useLocation(); // 🛑 Hook to read navigation state

    // State Hooks
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false); 
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [vehicles, setVehicles] = useState([]); 
    
    // 🛑 NEW: Toast state for application-wide messages
    const [appToast, setAppToast] = useState({ message: '', type: '' });
    
    // EFFECT: Read and display success/error message from navigation state
    useEffect(() => {
        if (location.state?.successMessage) {
            setAppToast({ message: location.state.successMessage, type: 'success' });
            // Clear the state so the message doesn't reappear on subsequent visits
            // This requires modifying the history state manually
            navigate(location.pathname, { replace: true, state: {} });
        } else if (location.state?.errorMessage) {
            setAppToast({ message: location.state.errorMessage, type: 'error' });
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, location.pathname, navigate]);


    // EFFECT: Apply dark-theme class to body when isDarkMode changes (remains the same)
    useEffect(() => {
        // Load theme preference from localStorage on mount
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setIsDarkMode(true);
        } else if (savedTheme === 'light') {
            setIsDarkMode(false);
        }
        
        // Apply theme class based on current state
        if (isDarkMode) {
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.add('light-theme');
            document.body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);
    
    // --- Navigation & UI Handlers ---
    
    const handleNavigate = (path) => {
        navigate(path);
        setIsProfileMenuOpen(false); 
        // Auto-close sidebar on mobile devices for better UX
        if (window.innerWidth < 768) { 
            setIsSidebarCollapsed(true); 
        }
    };
    
    const toggleDarkMode = () => {
        setIsDarkMode(prev => !prev);
    };

    const toggleProfileMenu = () => {
        setIsProfileMenuOpen(prev => !prev);
    };
    
    // --- Form Handlers ---
    
    /**
     * Handles the submission (POST or PUT/PATCH) for the ClientForm.
     */
    const handleClientSave = async (formData) => {
        const isEditMode = !!formData.id;
        const clientId = formData.id;
        const isIndividual = formData.clientType === 'Individual';
        
        // 1. Start with common fields
        let apiData = {
            client_type: formData.clientType || 'Individual',
            tax_id: formData.taxId || '', 
            notes: formData.notes || '',
            email: formData.email || '',
            phone_number: formData.phone || '',       
            address: formData.addressLine1 || '',     
            city: formData.city || '',
            state: formData.state || '',              
            zip_code: formData.zip || '',             
        };

        // 🛑 CRITICAL FIX: Conditionally add name fields.
        if (isIndividual) {
            apiData = {
                ...apiData,
                first_name: formData.firstName || '', 
                last_name: formData.lastName || '',
                company_name: '', 
            };
        } else {
            apiData = {
                ...apiData,
                company_name: formData.companyName || '',
                first_name: '',
                last_name: '', 
            };
        }

        try {
            let response;
            let successMessage;
            let savedClient;
            
            if (isEditMode) {
                // 2. EDIT MODE
                console.log(`Submitting Client UPDATE (PUT) for ID ${clientId}:`, apiData);
                response = await apiClient.put(`/clients/${clientId}/`, apiData);
                savedClient = response.data;
                
                const clientName = isIndividual 
                    ? `${formData.firstName} ${formData.lastName}`.trim() 
                    : formData.companyName;
                
                successMessage = `Client **${clientName}** was successfully updated!`;
            } else {
                // 2. CREATE MODE
                console.log("Submitting Client CREATE (POST):", apiData);
                response = await apiClient.post('/clients/', apiData);
                savedClient = response.data;
                
                const clientName = (savedClient.company_name || `${savedClient.first_name || ''} ${savedClient.last_name || ''}`).trim();
                successMessage = `Client **${clientName}** was successfully created!`;
            }
            
            console.log("Client successfully saved:", savedClient);
            
            // 3. Navigate to a new route upon successful creation, allowing the user to add a vehicle
            if (!isEditMode && savedClient.id) {
                 // 🏆 NEW FEATURE: Navigate to the Add Vehicle page for the new client
                 navigate(`/vehicles/new/${savedClient.id}`);
            } else {
                // 3. Navigate back to the client list upon success (Edit Mode)
                navigate('/clients', { 
                    state: { 
                        successMessage: successMessage 
                    } 
                }); 
            }

        } catch (error) {
            // Log the detailed response data (CRITICAL for debugging failed validations)
            console.error("Failed to save client:", error.response ? error.response.data : error.message);
            
            let displayMessage = "Error saving client. Please check your inputs."; // Default message

            if (error.response && error.response.data) {
                const errorData = error.response.data;
                
                // 🏆 Robust Parsing Logic for API Validation Errors 🏆
                
                // 1. Check for specific top-level field errors
                if (errorData.phone_number) {
                    displayMessage = `Phone Error: ${errorData.phone_number.join(' ')}`; 
                } else if (errorData.email) {
                    displayMessage = `Email Error: ${errorData.email.join(' ')}`; 
                } else if (errorData.first_name) {
                    displayMessage = `First Name Error: ${errorData.first_name.join(' ')}`;
                } else if (errorData.company_name) {
                    displayMessage = `Company Name Error: ${errorData.company_name.join(' ')}`;
                }
                
                // 2. Fallback for generic or non-field errors
                else if (typeof errorData === 'object' && !Array.isArray(errorData)) {
                    const allErrors = Object.entries(errorData)
                        .map(([field, messages]) => {
                            const cleanField = field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                            return `${cleanField}: ${Array.isArray(messages) ? messages.join(' ') : String(messages)}`;
                        })
                        .join(' | ');
                        
                    if (allErrors) {
                        displayMessage = allErrors;
                    }
                } 
                // 3. Handle list of strings
                else if (Array.isArray(errorData) && typeof errorData[0] === 'string') {
                    displayMessage = errorData.join(' | ');
                }
            }
            
            // 4. Navigate back to the client list upon FAILURE
            navigate('/clients', { 
                state: { 
                    errorMessage: displayMessage
                } 
            }); 
        }
    };

    const handleClientCancel = () => {
        navigate('/clients');
    };
    // ---------------------------------
    
    const handleVehicleSave = (data) => {
        // Mocking the required fields from VehicleForm
        const newVehicle = {
            vin: data.vin || 'N/A',
            licensePlate: data.licensePlate || 'N/A',
            make: data.make || 'Mock Make', 
            model: data.model || 'Mock Model',
            year: data.year || 'N/A',
            odoReading: data.odoReading || 'N/A'
        };
        // In a real project, this would be api.post('/vehicles/', newVehicle)
        setVehicles(prevVehicles => [...prevVehicles, newVehicle]);
        
        // 🛑 Navigate to the client list with a success message
        navigate('/clients', { 
            state: { 
                successMessage: `Vehicle **${newVehicle.make} ${newVehicle.model}** added successfully!` 
            } 
        });
    };

    const handleVehicleCancel = () => {
        // Safe navigation back to the client list
        navigate('/clients');
    };

    const handleGenericInventorySave = (data) => {
        console.log("Inventory Item Saved!", data);
        navigate('/inventory'); 
    };

    const handleGenericInventoryCancel = () => {
        navigate('/inventory'); 
    };

    const handleAssetSave = (data) => {
        console.log("Business Asset Saved!", data);
        navigate('/inventory/asset');
    };
    
    const handleAssetCancel = () => {
        navigate('/inventory/asset');
    };

    const handleVendorSave = (data) => {
        console.log("Vendor Saved!", data);
        navigate('/inventory/vendors');
    };

    const handleVendorCancel = () => {
        navigate('/inventory/vendors');
    };
    
    const handleAppointmentSave = (data) => {
        console.log("Appointment Saved!", data);
        navigate('/appointments'); 
    };

    const handleAppointmentCancel = () => {
        navigate('/appointments'); 
    };


    // Dynamic Props for TopNavBar
    const navBarProps = {
        shopName: "Autowork Garage", 
        userName: user 
            ? `${user.first_name} ${user.last_name || ''}`.trim()
            : 'Loading User...',
        shopLocation: user?.email || "No Email Provided", 
    };

    // RENDER MAIN APPLICATION LAYOUT
    return (
        <div className="app-container"> 
            
            {/* 🛑 RENDER APPLICATION-WIDE TOAST HERE */}
            <ToastNotification 
                message={appToast.message} 
                type={appToast.type}
                onClose={() => setAppToast({ message: '', type: '' })}
            />
            
            {/* Top Navigation Bar (Fixed at top) */}
            <TopNavBar 
                {...navBarProps}
                isSidebarCollapsed={isSidebarCollapsed} 
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
                isProfileMenuOpen={isProfileMenuOpen}
                toggleProfileMenu={toggleProfileMenu}
                navigate={navigate} 
                onLogout={logout} 
            />

            {/* Main Content Wrapper (Covers Sidebar and Page Content) */}
            <div className={`main-content-wrapper ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                
                {/* Sidebar (Navigation) */}
                <Sidebar 
                    isCollapsed={isSidebarCollapsed} 
                    currentPath={window.location.pathname} 
                    navigateTo={handleNavigate}
                    toggleSidebar={() => setIsSidebarCollapsed(prev => !prev)} 
                />

                {/* Page Content Area (Scrollable area for pages) */}
                <main className="page-content">
                    <Routes>
                        {/* Landing/Fallback Route: Redirects / to /dashboard */}
                        <Route path="/" element={<Navigate to="/dashboard" replace />} /> 
                        
                        {/* CORE ROUTES */}
                        <Route path="/dashboard" element={<Dashboard />} /> 
                        
                        {/* APPOINTMENT ROUTES */}
                        <Route 
                            path="/appointments" 
                            element={
                                <div className="list-page-container">
                                    <header className="page-header"><h2>Appointment Calendar/List</h2>
                                    <button className="btn-primary-action" onClick={() => navigate('/appointments/new')}><FaPlus style={{ marginRight: '5px' }} /> New Appointment</button>
                                    </header>
                                    <p style={{padding: '20px'}}>Appointment List Placeholder.</p>
                                </div>
                            } 
                        />
                        <Route 
                            path="/appointments/new" 
                            element={<AppointmentForm onSave={handleAppointmentSave} onCancel={handleAppointmentCancel} />} 
                        />
                        
                        {/* JOB CARDS ROUTE */}
                        <Route 
                            path="/jobcards" 
                            element={
                                <div className="list-page-container">
                                    <header className="page-header"><h2>Job Card List</h2></header>
                                    <p style={{padding: '20px'}}>Job Card List Page Content Placeholder - Will integrate with Django API soon.</p>
                                </div>
                            } 
                        />

                        {/* Clients Routes */}
                        <Route path="/clients" element={<ClientsList />} />
                        
                        {/* 🛑 CRITICAL: Route for editing a specific client (must come BEFORE /clients/add) */}
                        <Route 
                            path="/clients/:clientId" 
                            element={<ClientForm onSave={handleClientSave} onCancel={handleClientCancel} />} 
                        />
                        
                        {/* Route for adding new client */}
                        <Route 
                            path="/clients/add" 
                            element={<ClientForm onSave={handleClientSave} onCancel={handleClientCancel} />} 
                        />
                        
                        {/* VEHICLES ROUTES */}
                        <Route 
                            path="/vehicles" 
                            element={<VehicleList navigateTo={handleNavigate} vehicles={vehicles} />} 
                        />
                        {/* 🎯 UPDATED: Route for adding a new vehicle, now accepts an optional clientId */}
                        <Route 
                            path="/vehicles/new/:clientId?" 
                            element={<VehicleForm onSave={handleVehicleSave} onCancel={handleVehicleCancel} />} 
                        />
                        {/* Route for viewing/editing a specific vehicle */}
                        <Route path="/vehicles/:vin" element={<VehicleForm onSave={handleVehicleSave} onCancel={handleVehicleCancel} />} />
                        
                        {/* Inventory Base Path */}
                        <Route 
                            path="/inventory" 
                            element={
                                <div className="list-page-container">
                                    <header className="page-header"><h2>Inventory Overview</h2></header>
                                    <p style={{padding: '20px'}}>Inventory List Page Content (Shows linkable tables for Parts, Labor, Tires, Canned Jobs, Vendors, and Assets).</p>
                                </div>
                            }
                        />
                        
                        {/* INVENTORY SUB-ROUTES (Adding Items) */}
                        <Route 
                            path="/inventory/parts/add" 
                            element={<InventoryForm onSave={handleGenericInventorySave} onCancel={handleGenericInventoryCancel} />} 
                        />
                        <Route 
                            path="/inventory/labor/add" 
                            element={<LaborForm onSave={handleGenericInventorySave} onCancel={handleGenericInventoryCancel} navigateTo={handleNavigate} />} 
                        />
                        <Route 
                            path="/inventory/tires/add" 
                            element={<TireForm onSave={handleGenericInventorySave} onCancel={handleGenericInventoryCancel} navigateTo={handleNavigate} />} 
                        />
                        <Route 
                            path="/inventory/canned-jobs/add" 
                            element={<CannedJobForm onSave={handleGenericInventorySave} onCancel={handleGenericInventoryCancel} navigateTo={handleNavigate} />} 
                        />
                        
                        {/* Business Asset Routes */}
                        <Route 
                            path="/inventory/asset" 
                            element={<BusinessAssetList navigateTo={handleNavigate} />} 
                        />
                        <Route 
                            path="/inventory/asset/add" 
                            element={<BusinessAssetForm onSave={handleAssetSave} onCancel={handleAssetCancel} navigateTo={handleNavigate} />} 
                        />
                        
                        {/* Vendor Routes */}
                        <Route 
                            path="/inventory/vendors" 
                            element={
                                <div className="list-page-container">
                                    <header className="page-header"><h2>Vendor List</h2></header>
                                    <p style={{padding: '20px'}}>Vendor List Page Content.</p>
                                </div>
                            }
                        />
                        <Route 
                            path="/vendors/add" 
                            element={<VendorForm onSave={handleVendorSave} onCancel={handleVendorCancel} />} 
                        />
                        
                        
                        {/* Other Placeholder Routes */}
                        <Route path="/invoices" element={<div className="list-page-container"><header className="page-header"><h2>Invoices</h2></header></div>} />
                        <Route path="/reports" element={<div className="list-page-container"><header className="page-header"><h2>Reports</h2></header></div>} />
                        <Route path="/settings" element={<div className="list-page-container"><header className="page-header"><h2>Settings</h2></header></div>} />
                        
                        {/* 🛑 Fallback Route (Catch-all for mistyped paths) */}
                        <Route path="*" element={<Navigate to="/dashboard" replace />} /> 
                        
                    </Routes>
                </main>
                
                {/* 🏆 NEW: Footer Component Rendered After Main Content */}
                <Footer />
            </div>
            
            {/* 🚀 CSS for Theme Colors and Layout Fix */}
            <style jsx>{`
                /* --- Color Variables --- */
                :root {
                    /* Sidebar: #212A38 (Dark Navy) */
                    --bg-sidebar: #212A38;
                    /* Main Page Background (Light Mode) - Light Gray */
                    --bg-page-light: #f5f7fa; 
                    /* Dark Mode: Main Page Background matches Sidebar background */
                    --bg-page-dark: var(--bg-sidebar); 
                    --text-primary-dark: #ffffff;
                }
                
                /* Apply default Light Theme colors to the body */
                body.light-theme {
                    background-color: var(--bg-page-light);
                }

                /* Apply Dark Theme colors to the body */
                body.dark-theme {
                    background-color: var(--bg-page-dark);
                    color: var(--text-primary-dark);
                }
                
                /* Ensure the whole application container spans the screen */
                .app-container {
                    min-height: 100vh;
                    display: flex; 
                }

                /* ----------------------------------------------------------------- */
                /* CRITICAL LAYOUT FIX (Main Content Positioning) */
                /* ----------------------------------------------------------------- */
                .main-content-wrapper {
                    /* Start content right after the sidebar's default width (220px) */
                    margin-left: 220px; 
                    /* Pushes the content away from the fixed TopNavBar (60px tall, plus buffer) */
                    padding-top: 70px; 
                    flex-grow: 1;
                    min-height: 100vh; 
                    transition: margin-left 0.3s ease;
                    width: calc(100% - 220px); /* Adjust width to fit the margin */
                    box-sizing: border-box;

                    /* 🏆 STICKY FOOTER FIX: Make wrapper a flex container */
                    display: flex;
                    flex-direction: column;
                }

                /* Layout adjustment when sidebar is collapsed (80px wide) */
                .main-content-wrapper.sidebar-collapsed {
                    margin-left: 80px; 
                    width: calc(100% - 80px); /* Adjust width */
                }

                /* Page Content area uses the background color applied to the body */
                .page-content {
                    padding: 20px; /* Default internal padding for pages */
                    /* 🏆 STICKY FOOTER FIX: Push content to fill remaining space */
                    flex-grow: 1; 
                }
                
                /* Basic dark mode style for internal elements */
                body.dark-theme .data-table th,
                body.dark-theme .data-table td {
                    color: var(--text-primary-dark);
                }
                /* Button styling for primary action */
                .btn-primary-action {
                    background-color: #5d9cec; /* Primary Blue */
                    color: #ffffff;
                    border: none;
                    padding: 8px 15px;
                    border-radius: 4px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    font-size: 14px;
                    font-weight: 600;
                    transition: background-color 0.2s;
                }
                .btn-primary-action:hover {
                    background-color: #4a82c4;
                }
                .page-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 0 15px 0;
                    border-bottom: 1px solid rgba(0,0,0,0.1);
                    margin-bottom: 20px;
                }
                body.dark-theme .page-header {
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                }
            `}</style>
        </div>
    );
};

export default Home;