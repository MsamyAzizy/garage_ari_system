// src/components/ServiceReminderForm.js

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FaClock, FaUsers, FaCar, FaCalendarAlt, FaBell, FaSync, FaSave, FaArrowLeft, FaSpinner 
} from 'react-icons/fa';
// 🛑 FIX 1: Removed unused FaTools
// 🛑 FIX 2: Removed unused apiClient import

// --- Configuration ---
const REMINDER_TYPES = ['Service Reminder', 'Oil Change', 'Insurance Renewal', 'Inspection', 'Tyre Rotation', 'Other'];
const STATUS_CHOICES = ['Active', 'Sent', 'Completed', 'Overdue', 'Cancelled'];
const CONTACT_METHODS = ['SMS', 'WhatsApp', 'Email', 'Call'];
const NOTIFICATION_METHODS = ['SMS', 'WhatsApp', 'Email', 'Push Notification'];
const REPEAT_FREQUENCY_OPTIONS = [
    'One-time', 'Monthly', 'Quarterly', 'Semi-Annually', 'Annually', 'Every 5000 km', 'Every 10000 km'
];

const ServiceReminderForm = ({ onCancel, isDarkMode = false }) => {
    const navigate = useNavigate();

    // Data States (Mocking Client/Vehicle Data Fetch)
    const [clients, setClients] = useState([]); 
    const [vehicles, setVehicles] = useState([]);

    // Form States
    const [selectedClientId, setSelectedClientId] = useState('');
    const [selectedVehicleId, setSelectedVehicleId] = useState('');
    const [formData, setFormData] = useState({
        // 1. Basic Details
        reminder_type: REMINDER_TYPES[0],
        reminder_title: '',
        reminder_description: '',
        reminder_status: STATUS_CHOICES[0],
        
        // 2. Customer Info (Will be auto-populated on client/vehicle selection, but included for API)
        customer_id: '',
        customer_name: '', // Placeholder for display
        phone_number: '', // Placeholder for display
        email_address: '', // Placeholder for display
        preferred_contact_method: CONTACT_METHODS[0],
        
        // 3. Vehicle Info
        current_mileage: '',
        last_service_mileage: '',
        next_service_mileage: '',
        last_service_date: new Date().toISOString().split('T')[0],
        next_service_due_date: '',
        
        // 4. Schedule
        reminder_start_date: new Date().toISOString().split('T')[0],
        reminder_send_date: '',
        repeat_frequency: REPEAT_FREQUENCY_OPTIONS[0],
        next_reminder_date: '', // Calculated
        // overdue_days: (Calculated/Read-only in API)
        
        // 5. Communication
        notification_method: NOTIFICATION_METHODS[0],
        // notification_status: (Read-only in API)
        message_content_template: "Dear {CustomerName}, your car {PlateNo} is due for service on {Date}.",
        // sent_by: (System/Employee ID)
        // number_of_reminders_sent: 0 (Read-only in API)
    });

    // UI States
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingClients, setIsFetchingClients] = useState(true);
    const [isFetchingVehicles, setIsFetchingVehicles] = useState(false);
    const [error, setError] = useState(null);

    // --- Data Fetching (Mocked) ---
    useEffect(() => {
        // Mock data fetch for clients
        const mockClients = [
            { id: 1, company_name: 'Azizi Motors', first_name: 'Azizi', last_name: 'Bongo', phone: '555-1001', email: 'azizi@test.com' },
            { id: 2, company_name: null, first_name: 'John', last_name: 'Doe', phone: '555-2002', email: 'john@test.com' },
        ];
        setClients(mockClients);
        setIsFetchingClients(false);
    }, []);

    const fetchVehiclesByClient = useCallback((clientId) => {
        setIsFetchingVehicles(true);
        setVehicles([]);
        setSelectedVehicleId('');
        
        const clientVehicles = (clientId === '1' 
            ? [{ id: 101, plate: 'T 789 DFG', make: 'Nissan', model: 'Patrol', vin: 'NISSANXYZ101', mileage: 150000 }] 
            : [{ id: 201, plate: 'T 123 ABC', make: 'Toyota', model: 'Corolla', vin: 'TOYOTAXYZ201', mileage: 90000 }]
        );
        
        setVehicles(clientVehicles);
        setIsFetchingVehicles(false);
    }, []);

    // 1. Handle Client Change
    const handleClientChange = (e) => {
        const id = e.target.value;
        setSelectedClientId(id);
        
        if (id) {
            const client = clients.find(c => String(c.id) === id);
            setFormData(prev => ({ 
                ...prev, 
                customer_id: client.id,
                customer_name: client.company_name || `${client.first_name} ${client.last_name}`,
                phone_number: client.phone,
                email_address: client.email,
            }));
            fetchVehiclesByClient(id);
        } else {
            setFormData(prev => ({ 
                ...prev, 
                customer_id: '', customer_name: '', phone_number: '', email_address: '' 
            }));
            setVehicles([]);
        }
    };

    // 2. Handle Vehicle Change
    const handleVehicleChange = (e) => {
        const id = e.target.value;
        setSelectedVehicleId(id);
        
        if (id) {
            const vehicle = vehicles.find(v => String(v.id) === id);
            setFormData(prev => ({ 
                ...prev, 
                current_mileage: vehicle.mileage, 
                // We typically need to fetch last service details from history, but here we mock it
                last_service_mileage: vehicle.mileage - 10000, 
                next_service_mileage: vehicle.mileage + 10000,
            }));
        } else {
            setFormData(prev => ({ 
                ...prev, 
                current_mileage: '', 
                last_service_mileage: '', 
                next_service_mileage: '' 
            }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        if (!selectedClientId || !selectedVehicleId || !formData.reminder_title || !formData.next_service_due_date) {
            setError("Please fill in **Client**, **Vehicle**, **Title**, and **Next Due Date**.");
            setIsLoading(false);
            return;
        }

        // 🛑 FIX 3: Removed the assignment to 'apiData' as it is currently unused 
        // until the API call is uncommented.
        /*
        const apiData = { 
            ...formData,
            client_id: parseInt(selectedClientId, 10),
            vehicle_id: parseInt(selectedVehicleId, 10),
            // Map keys for API submission (if necessary)
        };
        */
        
        try {
            // Mocking API POST
            // const response = await apiClient.post('/reminders/', apiData);
            
            const successMessage = `Service Reminder for ${formData.customer_name}'s vehicle created successfully!`;

            navigate('/reminders', { 
                state: { successMessage } 
            });

        } catch (err) {
            // Using a generic error message since the API call is mocked
            console.error("Reminder creation failed:", err.response ? err.response.data : err.message);
            setError("Failed to create Service Reminder. Check form data and API connection.");
            
        } finally {
            setIsLoading(false);
        }
    };

    const themeClass = isDarkMode ? 'dark-mode-form' : 'light-mode-form';

    if (isFetchingClients) {
        return (
            <div className="loading-page-center">
                <FaSpinner className="spinner" size={30} />
                <p>Loading Setup Data...</p>
            </div>
        );
    }

    return (
        <div className={`form-page-layout ${themeClass}`}>
            
            {/* Header */}
            <header className="form-header-bar">
                <div className="header-content-wrapper">
                    <button 
                        type="button" 
                        className="back-button"
                        onClick={onCancel || (() => navigate('/reminders'))}
                    >
                        <FaArrowLeft />
                    </button>
                    <h2 className="page-title"><FaBell style={{ marginRight: '8px' }} /> Create New Service Reminder</h2>
                </div>
            </header>
            
            {/* Main Form Card Container */}
            <div className="main-form-content">
                <form id="reminder-form" onSubmit={handleSubmit} className="app-form-card">
                    
                    {error && <div className="form-error-message">{error}</div>}

                    {/* 2. Customer & Vehicle Selection */}
                    <div className="form-section-header-blue">
                        <FaUsers /> Customer & Vehicle Selection
                    </div>
                    
                    <div className="form-grid-3">
                        {/* Client Dropdown */}
                        <div className="form-group">
                            <label htmlFor="client">Customer Name *</label>
                            <select
                                id="client"
                                value={selectedClientId}
                                onChange={handleClientChange}
                                required
                                disabled={isLoading}
                            >
                                <option value="">-- Select Customer --</option>
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
                                        {`${vehicle.plate} - ${vehicle.make} ${vehicle.model}`}
                                    </option>
                                ))}
                            </select>
                            {isFetchingVehicles && <FaSpinner className="spinner-small" />}
                        </div>
                        
                        {/* Preferred Contact */}
                        <div className="form-group">
                            <label htmlFor="preferred_contact_method">Preferred Contact</label>
                            <select
                                id="preferred_contact_method"
                                name="preferred_contact_method"
                                value={formData.preferred_contact_method}
                                onChange={handleChange}
                                disabled={isLoading}
                            >
                                {CONTACT_METHODS.map(method => (
                                    <option key={method} value={method}>
                                        {method}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <div className="form-grid-2">
                        <div className="form-group">
                            <label>Customer Contact (Auto-populated)</label>
                            <input type="text" value={formData.phone_number || 'N/A'} readOnly disabled />
                        </div>
                        <div className="form-group">
                            <label>Vehicle VIN / Chassis</label>
                            <input type="text" value={vehicles.find(v => String(v.id) === selectedVehicleId)?.vin || 'N/A'} readOnly disabled />
                        </div>
                    </div>

                    {/* 1. Basic Reminder Details */}
                    <div className="form-section-header-blue">
                        <FaClock /> Basic Reminder Details
                    </div>

                    <div className="form-grid-3">
                        <div className="form-group">
                            <label htmlFor="reminder_type">Reminder Type *</label>
                            <select
                                id="reminder_type"
                                name="reminder_type"
                                value={formData.reminder_type}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            >
                                {REMINDER_TYPES.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="form-group full-width-sm">
                            <label htmlFor="reminder_title">Reminder Title *</label>
                            <input
                                type="text"
                                id="reminder_title"
                                name="reminder_title"
                                value={formData.reminder_title}
                                onChange={handleChange}
                                placeholder="e.g., Engine Oil Replacement"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="reminder_status">Status</label>
                            <select
                                id="reminder_status"
                                name="reminder_status"
                                value={formData.reminder_status}
                                onChange={handleChange}
                                disabled={isLoading}
                            >
                                {STATUS_CHOICES.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>
                        
                    </div>
                    
                    <div className="form-group full-width">
                        <label htmlFor="reminder_description">Reminder Description</label>
                        <textarea
                            id="reminder_description"
                            name="reminder_description"
                            value={formData.reminder_description}
                            onChange={handleChange}
                            rows="2"
                            placeholder="Detailed description of the service that is due."
                            disabled={isLoading}
                        ></textarea>
                    </div>

                    {/* 3. Vehicle Mileage & Service History */}
                    <div className="form-section-header-blue">
                        <FaCar /> Service & Mileage Tracking
                    </div>

                    <div className="form-grid-4">
                        <div className="form-group">
                            <label>Current Mileage (km)</label>
                            <input 
                                type="number"
                                value={formData.current_mileage || 'N/A'} 
                                readOnly disabled 
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="last_service_mileage">Last Service Mileage (km)</label>
                            <input
                                type="number"
                                id="last_service_mileage"
                                name="last_service_mileage"
                                value={formData.last_service_mileage}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="last_service_date">Last Service Date</label>
                            <input
                                type="date"
                                id="last_service_date"
                                name="last_service_date"
                                value={formData.last_service_date}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="form-group required-field">
                            <label htmlFor="next_service_due_date">Next Service Due Date *</label>
                            <input
                                type="date"
                                id="next_service_due_date"
                                name="next_service_due_date"
                                value={formData.next_service_due_date}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="form-group full-width-sm">
                            <label htmlFor="next_service_mileage">Predicted Next Service Mileage (km)</label>
                            <input
                                type="number"
                                id="next_service_mileage"
                                name="next_service_mileage"
                                value={formData.next_service_mileage}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>
                    </div>


                    {/* 4. Reminder Schedule */}
                    <div className="form-section-header-blue">
                        <FaCalendarAlt /> Reminder Schedule
                    </div>

                    <div className="form-grid-3">
                        <div className="form-group">
                            <label htmlFor="reminder_start_date">Reminder Start Date</label>
                            <input
                                type="date"
                                id="reminder_start_date"
                                name="reminder_start_date"
                                value={formData.reminder_start_date}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="reminder_send_date">Initial Send Date</label>
                            <input
                                type="date"
                                id="reminder_send_date"
                                name="reminder_send_date"
                                value={formData.reminder_send_date}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="repeat_frequency">Repeat Frequency</label>
                            <select
                                id="repeat_frequency"
                                name="repeat_frequency"
                                value={formData.repeat_frequency}
                                onChange={handleChange}
                                disabled={isLoading}
                            >
                                {REPEAT_FREQUENCY_OPTIONS.map(freq => (
                                    <option key={freq} value={freq}>{freq}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    {/* 5. Notification & Communication */}
                    <div className="form-section-header-blue">
                        <FaSync /> Notification & Templates
                    </div>
                    
                    <div className="form-grid-2">
                        <div className="form-group">
                            <label htmlFor="notification_method">Notification Method</label>
                            <select
                                id="notification_method"
                                name="notification_method"
                                value={formData.notification_method}
                                onChange={handleChange}
                                disabled={isLoading}
                            >
                                {NOTIFICATION_METHODS.map(method => (
                                    <option key={method} value={method}>{method}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Number of Reminders Sent</label>
                            <input type="text" value="0 (New Reminder)" readOnly disabled />
                        </div>
                    </div>
                    
                    <div className="form-group full-width">
                        <label htmlFor="message_content_template">Message Content / Template Used</label>
                        <textarea
                            id="message_content_template"
                            name="message_content_template"
                            value={formData.message_content_template}
                            onChange={handleChange}
                            rows="3"
                            disabled={isLoading}
                        ></textarea>
                        <small style={{ color: '#6c757d', marginTop: '5px' }}>
                            Use placeholders like **{'{CustomerName}'}**, **{'{PlateNo}'}**, **{'{Date}'}**
                        </small>
                    </div>
                    
                </form>
            </div>
            
            {/* Form Actions (Fixed Footer) */}
            <div className="form-actions-fixed-footer">
                <button type="button" className="btn-secondary-action" onClick={onCancel || (() => navigate('/reminders'))} disabled={isLoading}>
                    Cancel
                </button>
                <button type="submit" form="reminder-form" className="btn-primary-action save-btn" disabled={isLoading || !selectedVehicleId}>
                    <FaSave style={{ marginRight: '8px' }} /> 
                    {isLoading ? (<span><FaSpinner className="spinner-small" /> Saving...</span>) : 'Save Reminder'}
                </button>
            </div>
            
            {/* --- Form CSS (Reusing JobCardForm styles for consistency) --- */}
            <style>{`
                /* CSS from JobCardForm/AppFormCard is used here for consistency. 
                   Ensure these styles are either global or included here:
                   .form-page-layout, .form-header-bar, .main-form-content, .app-form-card,
                   .form-section-header-blue, .form-grid-2, .form-grid-3, .form-grid-4,
                   .form-group, .full-width, .btn-primary-action, .form-actions-fixed-footer, etc.
                */
                .form-page-layout {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                    padding-bottom: 80px; 
                    min-height: 100vh;
                    --bg-page: #F4F6F9; 
                    --bg-card: #FFFFFF; 
                    --bg-input: #FFFFFF; 
                    --primary-color: #0d6efd; 
                    --text-color: #344767; 
                    --text-muted: #6c757d;
                    --border-color: #e9ecef; 
                    background-color: var(--bg-page);
                    color: var(--text-color);
                }
                .form-header-bar {
                    padding: 20px 30px; 
                    border-bottom: 1px solid var(--border-color);
                    background-color: var(--bg-card);
                    position: sticky;
                    top: 0; 
                    margin-bottom: 20px; 
                    z-index: 50;
                    box-shadow: 0 0 10px rgba(0,0,0,0.05);
                    display: flex;
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
                .main-form-content {
                    max-width: 1900px; 
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
                }
                .form-grid-2 {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 30px; 
                    margin-bottom: 20px;
                }
                .form-grid-3 {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 30px 20px; 
                    margin-bottom: 20px;
                }
                .form-grid-4 {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 30px 20px; 
                    margin-bottom: 20px;
                }
                .full-width {
                    grid-column: 1 / -1;
                }
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
                    border: 1px solid #ced4da; 
                    color: var(--text-color); 
                    padding: 12px 15px;
                    border-radius: 6px; 
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
                    box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25); 
                    outline: none;
                }
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
                .btn-secondary-action {
                    background-color: #e9ecef;
                    color: var(--text-color);
                    border: 1px solid #ced4da;
                }
                .btn-secondary-action:hover:not(:disabled) {
                    background-color: #dee2e6;
                }
                .spinner {
                    animation: spin 1s linear infinite;
                }
                .spinner-small {
                    animation: spin 1s linear infinite;
                    font-size: 12px;
                    margin-left: 5px;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                @media (max-width: 900px) {
                    .form-grid-4, .form-grid-3 {
                        grid-template-columns: 1fr 1fr;
                    }
                    .full-width-sm {
                        grid-column: 1 / -1;
                    }
                }
                @media (max-width: 600px) {
                    .form-grid-4, .form-grid-3, .form-grid-2 {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default ServiceReminderForm;