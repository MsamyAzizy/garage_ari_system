import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FaUser, FaTools, FaWrench, FaTags, FaClock, FaCalendarAlt, FaGasPump, FaSpinner, FaArrowLeft, FaSave, FaCar 
} from 'react-icons/fa';
//import apiClient from '../utils/apiClient';

// --- Configuration ---
// Status Choices (Must match Django's JobCard.STATUS_CHOICES)
const STATUS_CHOICES = [
    { value: 'OPEN', label: 'Open Job' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'READY_FOR_PICKUP', label: 'Ready for Pickup' },
    { value: 'PAID', label: 'Paid/Closed' },
];

const JobCardForm = ({ onCancel, isDarkMode = false }) => {
    const navigate = useNavigate();

    // Data States
    const [clients, setClients] = useState([]); 
    const [vehicles, setVehicles] = useState([]);

    // Form States
    const [selectedClientId, setSelectedClientId] = useState('');
    const [selectedVehicleId, setSelectedVehicleId] = useState('');
    const [formData, setFormData] = useState({
        date_in: new Date().toISOString().split('T')[0], 
        initial_odometer: '',
        fuel_level: 50, 
        customer_complaint: '',
        assigned_technician: '', 
        status: 'OPEN', 
    });
    
    // UI States
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingClients, setIsFetchingClients] = useState(true);
    const [isFetchingVehicles, setIsFetchingVehicles] = useState(false);
    const [error, setError] = useState(null);

    // --- 1. Fetch ALL Clients on component mount ---
    useEffect(() => {
        const fetchClients = async () => {
            setIsFetchingClients(true);
            try {
                // Mock API Call - Replace with actual when ready
                // const res = await apiClient.get('/clients/'); 
                
                // Using mock data fallback if API is not fully set up
                const mockClients = [
                    { id: 1, company_name: 'Azizi Bongo Motors', first_name: 'Azizi', last_name: 'Bongo' },
                    { id: 2, company_name: null, first_name: 'John', last_name: 'Doe' },
                ];
                // setClients(res.data.results || res.data || mockClients);
                setClients(mockClients);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch clients:", err);
                setError('Could not load clients list. Check API. (Showing mock data)');
                setClients([
                    { id: 1, company_name: 'Azizi Bongo Motors', first_name: 'Azizi', last_name: 'Bongo' },
                    { id: 2, company_name: null, first_name: 'John', last_name: 'Doe' },
                ]);
            } finally {
                setIsFetchingClients(false);
            }
        };
        fetchClients();
    }, []); 

    // --- 2. Fetch Vehicles when selectedClientId changes ---
    useEffect(() => {
        if (!selectedClientId) {
            setVehicles([]);
            setSelectedVehicleId('');
            return;
        }

        const fetchVehiclesByClient = async () => {
            setIsFetchingVehicles(true);
            setVehicles([]); // Clear previous vehicles
            setSelectedVehicleId('');
            try {
                // Mock API Call - Replace with actual when ready
                // const res = await apiClient.get(`/clients/${selectedClientId}/vehicles/`); 
                
                const clientVehicles = (selectedClientId === '1' 
                        ? [{ id: 101, license_plate: 'T 789 DFG', make: 'Nissan', model: 'Patrol' }] 
                        : [{ id: 201, license_plate: 'T 123 ABC', make: 'Toyota', model: 'Corolla' }]
                    );

                // setVehicles(res.data.results || res.data || clientVehicles);
                setVehicles(clientVehicles);
                setError(null);
            } catch (err) {
                console.error(`Failed to fetch vehicles for client ${selectedClientId}:`, err);
                setError('Could not load vehicles for the selected client. (Showing mock data)');
                setVehicles(selectedClientId === '1' 
                    ? [{ id: 101, license_plate: 'T 789 DFG', make: 'Nissan', model: 'Patrol' }] 
                    : [{ id: 201, license_plate: 'T 123 ABC', make: 'Toyota', model: 'Corolla' }]
                );
            } finally {
                setIsFetchingVehicles(false);
            }
        };

        fetchVehiclesByClient();
    }, [selectedClientId]);


    // --- Handlers ---

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleClientChange = (e) => {
        setSelectedClientId(e.target.value); 
    };

    const handleVehicleChange = (e) => {
        setSelectedVehicleId(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        if (!selectedClientId || !selectedVehicleId) {
            setError("Please select both a **Client** and a **Vehicle**.");
            setIsLoading(false);
            return;
        }

        // 1. Prepare data for API
        const apiData = {
            ...formData,
            client: parseInt(selectedClientId, 10),
            vehicle: parseInt(selectedVehicleId, 10),
            initial_odometer: parseInt(formData.initial_odometer, 10),
            fuel_level: parseInt(formData.fuel_level, 10), 
        };
        
        Object.keys(apiData).forEach(key => {
            if (apiData[key] === '' || apiData[key] === undefined) {
                delete apiData[key];
            }
        });

        try {
            // 2. POST to the JobCardViewSet endpoint
            // await apiClient.post('/jobcards/', apiData);
            
            // Mocking successful API response data
            const newJob = { 
                id: Math.floor(Math.random() * 1000) + 100, 
                job_number: `JC-${Math.floor(Math.random() * 900) + 100}`,
                vehicle: vehicles.find(v => String(v.id) === selectedVehicleId) || { license_plate: 'MOCK-VEHICLE' }
            };

            const vehiclePlate = newJob.vehicle.license_plate; 
            
            const successMessage = `Job Card **${newJob.job_number}** for ${vehiclePlate} created successfully!`;

            // 3. Navigate back to the Kanban board with a success message
            navigate('/jobcards/kanban', { 
                state: { 
                    successMessage: successMessage 
                } 
            });

        } catch (err) {
            console.error("Job Card creation failed:", err.response ? err.response.data : err.message);
            
            let displayMessage = "Failed to create Job Card. Please check data.";
            if (err.response && err.response.data && typeof err.response.data === 'object') {
                const errors = Object.values(err.response.data).flat();
                if (errors.length > 0) {
                     displayMessage = `API Error: ${errors[0]}`;
                }
            }
            
            setError(displayMessage);
            
        } finally {
            setIsLoading(false);
        }
    };

    // Base class determines the theme
    const themeClass = isDarkMode ? 'dark-mode-form' : 'light-mode-form';

    // --- Render Logic ---

    if (isFetchingClients) {
        return (
            <div className="loading-page-center">
                <FaSpinner className="spinner" size={30} />
                <p>Loading Clients and Setup Data...</p>
            </div>
        );
    }
    
    return (
        <div className={`form-page-layout ${themeClass}`}>
            
            {/* Header matches the look of the screenshots: White bar with title */}
            <header className="form-header-bar">
                <div className="header-content-wrapper">
                    <button 
                        type="button" 
                        className="back-button"
                        onClick={onCancel || (() => navigate('/jobcards/kanban'))}
                    >
                        <FaArrowLeft />
                    </button>
                    <h2 className="page-title"><FaWrench style={{ marginRight: '8px' }} /> Create New Job Card</h2>
                </div>
            </header>
            
            {/* Main Form Card Container - Wide and centered */}
            <div className="main-form-content">
                <form onSubmit={handleSubmit} className="app-form-card">
                    
                    {error && <div className="form-error-message">{error}</div>}

                    {/* 1. Client & Vehicle Selection (Matches Screenshot Section Style) */}
                    <div className="form-section-header-blue">
                        <FaUser /> Client & Vehicle Selection
                    </div>
                    
                    <div className="form-grid-2">
                        {/* Client Dropdown */}
                        <div className="form-group">
                            <label htmlFor="client">Client Name *</label>
                            <select
                                id="client"
                                value={selectedClientId}
                                onChange={handleClientChange}
                                required
                                disabled={isLoading}
                            >
                                <option value="">-- Select Client --</option>
                                {clients.map(client => (
                                    <option key={client.id} value={client.id}>
                                        {client.company_name || `${client.first_name} ${client.last_name}`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Vehicle Dropdown */}
                        <div className="form-group">
                            <label htmlFor="vehicle">Vehicle License Plate *</label>
                            <select
                                id="vehicle"
                                value={selectedVehicleId}
                                onChange={handleVehicleChange}
                                required
                                disabled={!selectedClientId || isFetchingVehicles || isLoading}
                            >
                                <option value="">
                                    {isFetchingVehicles ? 'Loading Vehicles...' : '-- Select Vehicle --'}
                                </option>
                                {vehicles.map(vehicle => (
                                    <option key={vehicle.id} value={vehicle.id}>
                                        {`${vehicle.license_plate} - ${vehicle.make} ${vehicle.model}`}
                                    </option>
                                ))}
                            </select>
                            {isFetchingVehicles && <FaSpinner className="spinner-small" />}
                        </div>
                    </div>

                    {/* 2. Job Details (New Screenshot-style Section) */}
                    <div className="form-section-header-blue">
                        <FaCar /> Vehicle Check-in Details
                    </div>

                    <div className="form-grid-4">
                        {/* Date In */}
                        <div className="form-group">
                            <label htmlFor="date_in"><FaCalendarAlt /> Check-In Date *</label>
                            <input
                                type="date"
                                id="date_in"
                                name="date_in"
                                value={formData.date_in}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        
                        {/* Odometer */}
                        <div className="form-group">
                            <label htmlFor="initial_odometer"><FaTags /> Odometer (km) *</label>
                            <input
                                type="number"
                                id="initial_odometer"
                                name="initial_odometer"
                                value={formData.initial_odometer}
                                onChange={handleChange}
                                placeholder="e.g., 150000"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        
                        {/* Status (Defaulted to OPEN) */}
                        <div className="form-group">
                            <label htmlFor="status"><FaClock /> Initial Status</label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                disabled={isLoading}
                            >
                                {STATUS_CHOICES.map(status => (
                                    <option key={status.value} value={status.value}>
                                        {status.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Fuel Level */}
                        <div className="form-group fuel-group">
                            <label htmlFor="fuel_level"><FaGasPump /> Fuel Level: **{formData.fuel_level}%**</label>
                            <input
                                type="range"
                                id="fuel_level"
                                name="fuel_level"
                                min="0"
                                max="100"
                                step="25"
                                value={formData.fuel_level}
                                onChange={handleChange}
                                className="range-slider"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {/* 3. Work Scope */}
                    <div className="form-section-header-blue">
                        <FaTools /> Work Scope & Assignment
                    </div>

                    {/* Customer Complaint */}
                    <div className="form-group full-width">
                        <label htmlFor="customer_complaint">Customer Complaint / Work Requested *</label>
                        <textarea
                            id="customer_complaint"
                            name="customer_complaint"
                            value={formData.customer_complaint}
                            onChange={handleChange}
                            rows="4"
                            placeholder="e.g., Vehicle overheating, oil change, strange noise from the rear."
                            required
                            disabled={isLoading}
                        ></textarea>
                    </div>
                    
                    {/* Technician */}
                    <div className="form-group full-width">
                        <label htmlFor="assigned_technician"><FaWrench /> Assigned Technician (Lookup)</label>
                        <input
                            type="text" 
                            id="assigned_technician"
                            name="assigned_technician"
                            value={formData.assigned_technician}
                            onChange={handleChange}
                            placeholder="Enter Technician ID (e.g., 1) or Name"
                            disabled={isLoading}
                        />
                    </div>
                </form>
            </div>
            
            {/* Form Actions (Matches Screenshot Fixed Footer) */}
            <div className="form-actions-fixed-footer">
                <button type="button" className="btn-secondary-action" onClick={onCancel || (() => navigate('/jobcards/kanban'))} disabled={isLoading}>
                    Cancel
                </button>
                <button type="submit" form="job-card-form" className="btn-primary-action save-btn" disabled={isLoading || !selectedVehicleId}>
                    <FaSave style={{ marginRight: '8px' }} /> 
                    {isLoading ? (<span><FaSpinner className="spinner-small" /> Saving...</span>) : 'Save'}
                </button>
            </div>
            
            {/* --- Form CSS (Embed for simplicity) --- */}
            <style>{`
                /* ----------------------------------------------------------------- */
                /* THEME VARIABLES - Based on light theme of screenshots */
                /* ----------------------------------------------------------------- */
                .form-page-layout {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; /* Adjusted font for clean look */
                    padding-bottom: 80px; 
                    min-height: 100vh;
                    --bg-page: #F4F6F9; /* Light grey background from screenshots */
                    --bg-card: #FFFFFF; /* Bright white card */
                    --bg-input: #FFFFFF; /* White background for inputs */
                    --primary-color: #0d6efd; /* Primary Blue for headings and buttons */
                    --text-color: #344767; /* Dark text for readability */
                    --text-muted: #6c757d;
                    --border-color: #e9ecef; /* Light border color */
                    background-color: var(--bg-page);
                    color: var(--text-color);
                }
                
                /* ----------------------------------------------------------------- */
                /* HEADER BAR (Matches Screenshot Header) */
                /* ----------------------------------------------------------------- */
                .form-header-bar {
                    padding: 20px 30px; 
                    border-bottom: 1px solid var(--border-color);
                    background-color: var(--bg-card);
                    position: sticky;
                    top: 0; 
                    margin-bottom: 20px; 
                    z-index: 50;
                    box-shadow: 0 0 10px rgba(0,0,0,0.05); /* Subtle shadow on header */
                }
                
                .header-content-wrapper {
                    display: flex; 
                    align-items: center; 
                    gap: 15px;
                }
                
                .back-button {
                    background: none;
                    border: none;
                    color: var(--text-color);
                    font-size: 20px;
                    padding: 5px; 
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .back-button:hover {
                    color: var(--primary-color);
                }

                .page-title {
                    margin: 0;
                    font-size: 24px; 
                    font-weight: 700;
                    color: var(--text-color);
                }

                /* ----------------------------------------------------------------- */
                /* MAIN CONTENT & FORM CARD */
                /* ----------------------------------------------------------------- */
                .main-form-content {
                    max-width: 1900px; /* Wider form container */
                    margin: 0 auto;
                    padding: 0 20px;
                }
                
                .app-form-card {
                    background-color: var(--bg-card);
                    padding: 30px;
                    border-radius: 12px;
                    box-shadow: 0 0 20px rgba(0,0,0,0.1); 
                    border: 1px solid var(--border-color);
                }
                
                /* Section Header Style (Matches Screenshot) */
                .form-section-header-blue {
                    font-size: 18px;
                    font-weight: 700;
                    color: var(--primary-color);
                    margin-top: 30px;
                    margin-bottom: 20px;
                    padding-bottom: 5px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    /* Removes the underline, relying on color and spacing for separation */
                }
                
                .form-grid-2 {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 30px; /* Increased gap */
                    margin-bottom: 20px;
                }
                
                .form-grid-4 {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 30px 20px; /* Slightly wider column gap */
                    margin-bottom: 20px;
                }

                .full-width {
                    grid-column: 1 / -1;
                }
                
                /* ----------------------------------------------------------------- */
                /* INPUT FIELDS & LABELS */
                /* ----------------------------------------------------------------- */
                .form-group {
                    display: flex;
                    flex-direction: column;
                    position: relative;
                }
                
                .form-group label {
                    color: var(--text-color);
                    font-weight: 600;
                    margin-bottom: 8px;
                    font-size: 15px;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }

                .app-form-card input:not([type="range"]), 
                .app-form-card select,
                .app-form-card textarea {
                    background-color: var(--bg-input);
                    border: 1px solid #ced4da; /* Slightly stronger border */
                    color: var(--text-color); 
                    padding: 12px 15px;
                    border-radius: 6px; /* Slightly less rounded than the card */
                    font-size: 16px;
                    transition: border-color 0.2s, box-shadow 0.2s;
                    width: 100%;
                    box-sizing: border-box;
                    appearance: none;
                }
                
                .app-form-card input:focus, 
                .app-form-card textarea:focus,
                .app-form-card select:focus {
                    border-color: var(--primary-color);
                    box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25); /* Bootstrap-like focus glow */
                    outline: none;
                }
                
                /* Range Slider Styling (Fuel Level) - Consistent Look */
                .range-slider {
                    -webkit-appearance: none;
                    height: 8px;
                    background: #e9ecef;
                    border-radius: 4px;
                    margin-top: 5px;
                    width: 100%;
                }
                .range-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: var(--primary-color);
                    cursor: pointer;
                    border: 2px solid var(--bg-card); 
                }
                
                /* Error Message Styling */
                .form-error-message {
                    padding: 15px;
                    margin-bottom: 20px;
                    background-color: #f8d7da;
                    color: #721c24;
                    border: 1px solid #f5c6cb;
                    border-radius: 6px;
                    font-weight: 600;
                    grid-column: 1 / -1;
                }

                /* ----------------------------------------------------------------- */
                /* FIXED FOOTER (Actions) - Matches Screenshot Footer */
                /* ----------------------------------------------------------------- */
                .form-actions-fixed-footer {
                    position: fixed;
                    bottom: 0;
                    left: 0; 
                    right: 0;
                    background-color: var(--bg-card); 
                    border-top: 1px solid var(--border-color);
                    padding: 15px 30px;
                    display: flex;
                    justify-content: flex-end;
                    gap: 15px;
                    z-index: 100;
                    box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
                }
                
                .btn-primary-action, .btn-secondary-action {
                    padding: 10px 20px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: background-color 0.2s, transform 0.1s;
                    display: flex;
                    align-items: center;
                    font-size: 15px;
                }
                
                /* Primary Button (Save) */
                .btn-primary-action {
                    background-color: var(--primary-color);
                    color: white;
                    border: none;
                }
                .btn-primary-action:hover:not(:disabled) {
                    background-color: #0b5ed7;
                }
                .btn-primary-action:disabled {
                    background-color: #adb5bd;
                    cursor: not-allowed;
                }
                
                /* Secondary Button (Cancel) */
                .btn-secondary-action {
                    background-color: #e9ecef;
                    color: var(--text-color);
                    border: 1px solid #ced4da;
                }
                .btn-secondary-action:hover:not(:disabled) {
                    background-color: #dee2e6;
                }

                /* Spinners */
                .spinner {
                    animation: spin 1s linear infinite;
                    color: var(--primary-color);
                }
                .spinner-small {
                    animation: spin 1s linear infinite;
                    font-size: 1em;
                    margin-left: 8px;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                /* Media Query for smaller screens */
                @media (max-width: 768px) {
                    .form-grid-2, .form-grid-4 {
                        grid-template-columns: 1fr;
                        gap: 20px;
                    }
                    .form-header-bar, .form-actions-fixed-footer {
                        padding-left: 15px;
                        padding-right: 15px;
                    }
                }
            `}</style>
        </div>
    );
};

export default JobCardForm;