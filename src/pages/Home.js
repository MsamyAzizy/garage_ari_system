// src/pages/Home.js - The main protected application layout

import React, { useState, useEffect } from 'react'; 
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'; // Added Navigate for fallback
import { FaCar, FaPlusCircle, FaPlus } from 'react-icons/fa'; 

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
    // Destructure 'user' and 'logout' from useAuth()
    const { logout, user } = useAuth();

    // State Hooks
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false); // Controls the theme
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [vehicles, setVehicles] = useState([]); // Mock vehicle list state
    
    // CRITICAL: Get the navigation function
    const navigate = useNavigate(); 
    
    // EFFECT: Apply dark-theme class to body when isDarkMode changes
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
            // Fix: Set to true to collapse the sidebar on mobile after navigation
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
     * Maps frontend data to Django API format and handles success/error navigation.
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
        // If a field is not present in the payload, Django won't try to validate it 
        // against null/blank constraints unless it's explicitly required by the serializer.
        
        if (isIndividual) {
            // For Individual: Add first_name and last_name (must not be null/blank)
            apiData = {
                ...apiData,
                first_name: formData.firstName || '', 
                last_name: formData.lastName || '',
                // Ensure company_name is explicitly excluded or set to '' if the serializer requires it
                company_name: '', 
            };
        } else {
            // For Company: Add company_name (must not be null/blank)
            apiData = {
                ...apiData,
                company_name: formData.companyName || '',
                // Ensure individual names are explicitly excluded or set to '' if the serializer requires them
                first_name: '',
                last_name: '', 
            };
        }

        // Final check: Remove any empty strings if the field is optional on the backend
        // For required fields like first_name/company_name, we must send an empty string if the user didn't fill it,
        // so we'll let the backend validation handle the 'This field may not be blank' error.

        try {
            let response;
            let successMessage;
            
            if (isEditMode) {
                // 2. EDIT MODE: Use PUT/PATCH to update existing client
                console.log(`Submitting Client UPDATE (PUT) for ID ${clientId}:`, apiData);
                response = await apiClient.put(`/clients/${clientId}/`, apiData);
                
                // Determine the name for the success message based on the type
                const clientName = isIndividual 
                    ? `${formData.firstName} ${formData.lastName}`.trim() 
                    : formData.companyName;
                
                successMessage = `Client **${clientName}** was successfully updated!`;
            } else {
                // 2. CREATE MODE: Use POST to create new client
                console.log("Submitting Client CREATE (POST):", apiData);
                response = await apiClient.post('/clients/', apiData);
                const savedClient = response.data;
                
                // Determine the name for the success message from the API response
                const clientName = (savedClient.company_name || `${savedClient.first_name || ''} ${savedClient.last_name || ''}`).trim();
                successMessage = `Client **${clientName}** was successfully created!`;
            }
            
            console.log("Client successfully saved:", response.data);
            
            // 3. Navigate back to the client list upon success
            navigate('/clients', { 
                state: { 
                    successMessage: successMessage 
                } 
            }); 

        } catch (error) {
            // Log the detailed response data (CRITICAL for debugging failed validations)
            console.error("Failed to save client:", error.response ? error.response.data : error.message);
            
            let displayMessage = "Error saving client. Please check your inputs."; // Default message

            if (error.response && error.response.data) {
                const errorData = error.response.data;
                
                // 🏆 Robust Parsing Logic for API Validation Errors 🏆
                
                // 1. Check for specific top-level field errors (e.g., 'phone_number', 'first_name', 'company_name')
                if (errorData.phone_number) {
                    displayMessage = `Phone Error: ${errorData.phone_number.join(' ')}`; 
                } else if (errorData.email) {
                    displayMessage = `Email Error: ${errorData.email.join(' ')}`; 
                } else if (errorData.first_name) {
                    // Correcting the likely error: if we send '' and the field is required, we'll see "may not be blank."
                    displayMessage = `First Name Error: ${errorData.first_name.join(' ')}`;
                } else if (errorData.company_name) {
                    displayMessage = `Company Name Error: ${errorData.company_name.join(' ')}`;
                }
                
                // 2. Fallback for generic or non-field errors
                else if (typeof errorData === 'object' && !Array.isArray(errorData)) {
                    // Collect all nested error messages from all fields
                    const allErrors = Object.entries(errorData)
                        .map(([field, messages]) => {
                            // Format field name nicely (e.g., 'first_name' -> 'First Name')
                            const cleanField = field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                            return `${cleanField}: ${Array.isArray(messages) ? messages.join(' ') : String(messages)}`;
                        })
                        .join(' | ');
                        
                    if (allErrors) {
                        displayMessage = allErrors;
                    }
                } 
                // 3. Handle list of strings (e.g., a non-field error returned as a list)
                else if (Array.isArray(errorData) && typeof errorData[0] === 'string') {
                    displayMessage = errorData.join(' | ');
                }
            }
            
            // 4. Navigate back to the client list upon FAILURE
            navigate('/clients', { 
                state: { 
                    // Pass the error message
                    errorMessage: displayMessage
                } 
            }); 
        }
    };

    const handleClientCancel = () => {
        // Simply navigate away, discarding form changes
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
        navigate('/vehicles');
    };

    const handleVehicleCancel = () => {
        navigate('/vehicles');
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
        // Navigate to the list of vendors
        navigate('/inventory/vendors');
    };

    const handleVendorCancel = () => {
        // Navigate to the list of vendors
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
        // Use the user data from context
        userName: user 
            ? `${user.first_name} ${user.last_name || ''}`.trim()
            : 'Loading User...',
        // Dynamically display the user's email address
        shopLocation: user?.email || "No Email Provided", 
    };

    // RENDER MAIN APPLICATION LAYOUT
    return (
        <div className="app-container"> 
            
            {/* Top Navigation Bar (Fixed at top) */}
            <TopNavBar 
                {...navBarProps}
                isSidebarCollapsed={isSidebarCollapsed} 
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
                isProfileMenuOpen={isProfileMenuOpen}
                toggleProfileMenu={toggleProfileMenu}
                // Pass the 'navigate' function
                navigate={navigate} 
                // Pass the real logout function to TopNavBar
                onLogout={logout} 
            />

            {/* Main Content Wrapper (Covers Sidebar and Page Content) */}
            <div className={`main-content-wrapper ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                
                {/* Sidebar (Navigation) */}
                <Sidebar 
                    isCollapsed={isSidebarCollapsed} 
                    currentPath={window.location.pathname} 
                    navigateTo={handleNavigate}
                    // NOTE: Fix function passed to toggleSidebar
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
                        <Route 
                            path="/vehicles/new" 
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
                    /* Start content right after the sidebar's default width (250px) */
                    margin-left: 220px; 
                    /* Pushes the content away from the fixed TopNavBar (60px tall, plus buffer) */
                    padding-top: 70px; 
                    flex-grow: 1;
                    min-height: 100vh; 
                    transition: margin-left 0.3s ease;
                    width: calc(100% - 250px); /* Adjust width to fit the margin */
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