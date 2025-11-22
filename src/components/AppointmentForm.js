// src/components/AppointmentForm.js - UPDATED: Main page background (--bg-page) is now forced to white/light gray in both dark and light modes.

import React, { useState } from 'react';
import { 
    FaUser, FaCarSide, FaCalendarAlt, FaSave, FaSms, FaEnvelope, FaPhone, 
    FaArrowLeft, FaTag, FaWrench, FaMapMarkerAlt, FaBell 
} from 'react-icons/fa';

// Mock data for dropdowns (in a real app, this would come from an API)
const MOCK_TECHNICIANS = [
    { id: 'T001', name: 'James K. (Lead Mech)' },
    { id: 'T002', name: 'Mercy D. (Tech)' },
];
const MOCK_BAYS = ['Bay 1 - Lift 1', 'Bay 2 - Lift 2', 'Diagnostic Bay', 'Tire Bay'];

const AppointmentForm = ({ onSave, onCancel, isDarkMode = false, toggleDarkMode = () => {} }) => {
    // 🏆 New State: Initialize form data based on the requested fields
    const [formData, setFormData] = useState({
        appointmentDate: new Date().toISOString().substring(0, 10),
        appointmentTime: '09:00',
        checkInDateTime: '',
        status: 'Pending',
        priority: 'Normal',
        appointmentType: 'Repair',
        customerID: '',
        customerName: 'Placeholder: Select Customer',
        vehicleID: '',
        vehicleMake: 'Placeholder: Select Vehicle',
        requestedServices: '',
        problemDescription: '',
        estimatedDuration: '1.5', // Default 1.5 hours
        estimatedCost: '',
        assignedTechnicianID: '',
        workshopBay: MOCK_BAYS[0],
        preferredContactMethod: 'Call',
        sendReminder: true,
        confirmationStatus: 'Not Confirmed',
        notes: '',
    });

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // 🏆 In a real app, you would package the full formData for API submission.
        console.log("Saving new appointment with full details:", formData);
        
        // Pass a summary back to Home.js for the toast message
        onSave(formData);
    };
    
    // Base class determines the theme
    const themeClass = isDarkMode ? 'dark-mode-form' : 'light-mode-form';

    return (
        <div className={`form-container appointment-form-wrapper ${themeClass}`}>
            
            {/* Page Header - STICKY at the top */}
            <header className="page-header back-link-header">
                <div className="header-content-wrapper">
                    <button 
                        type="button" 
                        className="back-button"
                        onClick={onCancel} // Use onCancel prop for navigation back
                    >
                        <FaArrowLeft />
                    </button>
                    <h2 className="page-title">Book New Appointment</h2>
                </div>
            </header>
            
            <form onSubmit={handleSubmit} className="form-card appointment-form">
                
                {/* 1. Basic Appointment Details */}
                <h3 className="section-title"><FaCalendarAlt /> Appointment Scheduling</h3>
                <div className="form-grid-3">
                    <div className="form-group">
                        <label htmlFor="appointmentDate">Appointment Date</label>
                        <input 
                            type="date" 
                            id="appointmentDate" 
                            value={formData.appointmentDate}
                            onChange={handleChange}
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="appointmentTime">Time Slot</label>
                        <input 
                            type="time" 
                            id="appointmentTime" 
                            value={formData.appointmentTime}
                            onChange={handleChange}
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="priority">Priority</label>
                        <select id="priority" value={formData.priority} onChange={handleChange} required>
                            <option value="Normal">Normal</option>
                            <option value="Urgent">Urgent</option>
                            <option value="VIP">VIP</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select id="status" value={formData.status} onChange={handleChange} required>
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="No Show">No Show</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="appointmentType">Appointment Type</label>
                        <select id="appointmentType" value={formData.appointmentType} onChange={handleChange} required>
                            <option value="Repair">Repair</option>
                            <option value="Maintenance">Maintenance</option>
                            <option value="Inspection">Inspection</option>
                            <option value="Diagnostic">Diagnostic</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="checkInDateTime">Check-in Date/Time (Optional)</label>
                        <input 
                            type="datetime-local" 
                            id="checkInDateTime" 
                            value={formData.checkInDateTime}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* 2. Customer Information (Uses Action Buttons for Lookup) */}
                <h3 className="section-title"><FaUser /> Customer & Contact</h3>
                <div className="form-grid-2">
                    {/* Select Client Button */}
                    <button type="button" className="large-action-btn primary-action-btn">
                        <FaUser style={{ marginRight: '8px' }} /> Select Customer ({formData.customerID ? 'Selected' : 'Required'})
                    </button>
                    {/* Display/Placeholder for Customer Name */}
                    <div className="form-group">
                        <label>Customer Name</label>
                        <input type="text" readOnly value={formData.customerName} />
                    </div>
                </div>

                <div className="form-grid-3">
                    <div className="form-group">
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <input type="text" id="phoneNumber" readOnly value={'555-1234'} placeholder="From Customer Record" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="emailAddress">Email Address</label>
                        <input type="email" id="emailAddress" readOnly value={'client@example.com'} placeholder="From Customer Record" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="preferredContactMethod">Preferred Contact</label>
                        <select id="preferredContactMethod" value={formData.preferredContactMethod} onChange={handleChange}>
                            <option value="Call">Call</option>
                            <option value="SMS">SMS</option>
                            <option value="WhatsApp">WhatsApp</option>
                            <option value="Email">Email</option>
                        </select>
                    </div>
                </div>
                
                <h3 className="section-title">Communication Helpers</h3>
                <div className="form-grid-3 contact-grid">
                    <button type="button" className="contact-btn call-btn">
                        <FaPhone /> Call
                    </button>
                    <button type="button" className="contact-btn email-btn">
                        <FaEnvelope /> Email
                    </button>
                    <button type="button" className="contact-btn sms-btn">
                        <FaSms /> SMS / WhatsApp
                    </button>
                </div>


                {/* 3. Vehicle Information (Uses Action Buttons for Lookup) */}
                <h3 className="section-title"><FaCarSide /> Vehicle Details</h3>
                <div className="form-grid-2">
                    {/* Select Vehicle Button */}
                    <button type="button" className="large-action-btn primary-action-btn">
                        <FaCarSide style={{ marginRight: '8px' }} /> Select Vehicle ({formData.vehicleID ? 'Selected' : 'Required'})
                    </button>
                    {/* Display/Placeholder for Vehicle Make/Model */}
                    <div className="form-group">
                        <label>Vehicle Make/Model</label>
                        <input type="text" readOnly value={formData.vehicleMake} />
                    </div>
                </div>
                
                {/* Mock Vehicle Details (Read-Only from lookup) */}
                <div className="form-grid-4">
                    <div className="form-group">
                        <label>Plate No</label>
                        <input type="text" readOnly value={'T 123 ABC'} />
                    </div>
                    <div className="form-group">
                        <label>Mileage (km)</label>
                        <input type="text" readOnly value={'125,000'} />
                    </div>
                    <div className="form-group">
                        <label>VIN / Chassis</label>
                        <input type="text" readOnly value={'ABC...123'} />
                    </div>
                    <div className="form-group">
                        <label>Transmission</label>
                        <input type="text" readOnly value={'Automatic'} />
                    </div>
                </div>

                {/* 4. Service Request Details */}
                <h3 className="section-title"><FaWrench /> Service Request</h3>
                <div className="form-grid-2">
                    <div className="form-group">
                        <label htmlFor="serviceCategory">Service Category</label>
                        <select id="serviceCategory" value={formData.serviceCategory} onChange={handleChange} required>
                            <option value="Mechanical">Mechanical</option>
                            <option value="Electrical">Electrical</option>
                            <option value="Body">Body/Panel</option>
                            <option value="Diagnostic">Diagnostic</option>
                            <option value="Tire">Tire Service</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="estimatedDuration">Estimated Duration (Hours)</label>
                        <input 
                            type="number" 
                            id="estimatedDuration" 
                            value={formData.estimatedDuration}
                            onChange={handleChange}
                            min="0.5"
                            step="0.5"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="problemDescription">Customer's Problem Description</label>
                    <textarea 
                        id="problemDescription" 
                        rows="3" 
                        value={formData.problemDescription}
                        onChange={handleChange}
                        placeholder="e.g., Engine light is on, making a grinding noise when braking..."
                    ></textarea>
                </div>
                
                <div className="form-group">
                    <label htmlFor="requestedServices">Requested Services (Internal Notes / Preliminary Job List)</label>
                    <textarea 
                        id="requestedServices" 
                        rows="3" 
                        value={formData.requestedServices}
                        onChange={handleChange}
                        placeholder="List of known tasks (Oil Change, Brake Pad replacement, etc.)"
                    ></textarea>
                </div>
                
                <div className="form-group">
                    <label htmlFor="estimatedCost">Estimated Cost (Optional Before Approval)</label>
                    <input 
                        type="text" 
                        id="estimatedCost" 
                        value={formData.estimatedCost}
                        onChange={handleChange}
                        placeholder="e.g., TZS 150,000 (Internal use)"
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="notes">Notes / Remarks (Additional Details)</label>
                    <textarea 
                        id="notes" 
                        rows="2" 
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Any special customer requests or internal remarks."
                    ></textarea>
                </div>
                

                {/* 5. Workshop & Technician Assignment */}
                <h3 className="section-title"><FaMapMarkerAlt /> Workshop Assignment</h3>
                <div className="form-grid-3">
                    <div className="form-group">
                        <label htmlFor="assignedTechnicianID">Assigned Technician</label>
                        <select id="assignedTechnicianID" value={formData.assignedTechnicianID} onChange={handleChange}>
                            <option value="">-- Unassigned --</option>
                            {MOCK_TECHNICIANS.map(tech => (
                                <option key={tech.id} value={tech.id}>{tech.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="workshopBay">Workshop Bay / Area</label>
                        <select id="workshopBay" value={formData.workshopBay} onChange={handleChange}>
                            {MOCK_BAYS.map(bay => (
                                <option key={bay} value={bay}>{bay}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="serviceAdvisor">Service Advisor</label>
                        <input type="text" id="serviceAdvisor" readOnly value={MOCK_TECHNICIANS[0].name} placeholder="Supervisor/Advisor" />
                    </div>
                </div>

                {/* 6. Communication & Notification */}
                <h3 className="section-title"><FaBell /> Reminders & Confirmation</h3>
                <div className="form-grid-2">
                    <div className="form-group-inline">
                        <input 
                            type="checkbox" 
                            id="sendReminder" 
                            checked={formData.sendReminder}
                            onChange={handleChange}
                        />
                        <label htmlFor="sendReminder">Send Automatic Reminder?</label>
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmationStatus">Confirmation Status</label>
                        <select id="confirmationStatus" value={formData.confirmationStatus} onChange={handleChange}>
                            <option value="Not Confirmed">Not Confirmed</option>
                            <option value="Confirmed by Customer">Confirmed by Customer</option>
                            <option value="Auto Confirmed">Auto Confirmed</option>
                        </select>
                    </div>
                </div>
                
                {/* Old fields retained for visual reference/style: */}
                <h3 className="section-title"><FaTag /> Calendar Color Tag</h3>
                <p className="section-description">
                    Select a color to easily identify this appointment type on your calendar.
                </p>
                <div className="color-picker-grid">
                    {['#e74c3c', '#2ecc71', '#3498db', '#f39c12', '#9b59b6', '#34495e', '#1abc9c'].map((color, index) => (
                        <div 
                            key={color} 
                            className="color-swatch"
                            style={{ backgroundColor: color }} 
                            data-selected={index === 2 ? 'true' : 'false'} // Blue selected
                        />
                    ))}
                </div>


                {/* Form Actions (Fixed Footer) */}
                <div className="page-form-actions">
                    <button type="submit" className="btn-primary-action save-btn">
                        <FaSave style={{ marginRight: '8px' }} /> Save Appointment
                    </button>
                </div>
            </form>

            <style>{`
                /* ----------------------------------------------------------------- */
                /* THEME VARIABLES (Dark and Light Mode) */
                /* ----------------------------------------------------------------- */
                .appointment-form-wrapper {
                    font-family: 'Inter', sans-serif;
                    padding-bottom: 80px; 
                    min-height: 100vh;
                    transition: background-color 0.3s;
                }

                /* DARK MODE VARIABLES & DEFAULTS */
                .dark-mode-form {
                    /* Main page background is set to white/light gray */
                    --bg-page: #f0f4f8; 
                    
                    /* Card, Input, Text, and Border still use Dark Mode colors */
                    --bg-card: #18222c;
                    --bg-input: #0f1c2b;
                    --primary-color: #00bfff;
                    --text-color: #ecf0f1;
                    --text-muted: #7f8c8d;
                    --border-color: #3f5469;
                    background-color: var(--bg-page);
                    color: var(--text-color);
                }

                /* LIGHT MODE VARIABLES */
                .light-mode-form {
                    --bg-page: #f0f4f8; /* Forced to light gray/white */
                    --bg-card: #ffffff;
                    --bg-input: #f7f9fb;
                    --primary-color: #00bfff;
                    --text-color: #2c3e50;
                    --text-muted: #7f8c8d;
                    --border-color: #c9d7e5;
                    background-color: var(--bg-page);
                    color: var(--text-color);
                }

                /* ----------------------------------------------------------------- */
                /* HEADER AND BACK BUTTON (Sticky Header) */
                /* ----------------------------------------------------------------- */
                .page-header {
                    padding: 15px 30px; 
                    border-bottom: 1px solid var(--border-color);
                    background-color: var(--bg-card);
                    position: sticky;
                    top: 0; 
                    margin-bottom: 15px; 
                    z-index: 50;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .header-content-wrapper {
                    display: flex; 
                    align-items: center; 
                    gap: 15px;
                }
                
                .back-button {
                    background: none;
                    border: 1px solid var(--border-color);
                    color: var(--primary-color);
                    font-size: 18px;
                    padding: 8px; 
                    border-radius: 8px;
                    cursor: pointer;
                    transition: background-color 0.2s, border-color 0.2s;
                }
                .back-button:hover {
                    background-color: #2c3e50;
                    border-color: var(--primary-color);
                }
                .light-mode-form .back-button:hover {
                    background-color: #e8ecf1;
                }


                .page-title {
                    margin: 0;
                    font-size: 22px; 
                    font-weight: 600;
                    color: var(--text-color);
                }

                /* ----------------------------------------------------------------- */
                /* FORM CONTAINER & LAYOUT */
                /* ----------------------------------------------------------------- */
                .appointment-form {
                    background-color: var(--bg-card);
                    padding: 30px;
                    border-radius: 12px;
                    max-width: 1600px; 
                    margin: 0 auto 20px auto;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.4);
                    border: 1px solid var(--border-color);
                }

                /* Adjust shadow for light mode */
                .light-mode-form .appointment-form {
                    box-shadow: 0 5px 20px rgba(0,0,0,0.15);
                }

                .section-title {
                    color: var(--primary-color);
                    font-size: 18px;
                    font-weight: 700;
                    margin-top: 35px;
                    margin-bottom: 15px;
                    padding-bottom: 5px;
                    border-bottom: 2px solid var(--border-color);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .section-description {
                    color: var(--text-muted);
                    font-size: 14px;
                    margin-bottom: 20px;
                }
                
                .form-grid-2 {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    margin-bottom: 20px;
                }
                
                .form-grid-3 {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 20px; /* Increased gap for better spacing */
                    margin-bottom: 20px;
                }
                .form-grid-4 {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 20px;
                    margin-bottom: 20px;
                }

                /* ----------------------------------------------------------------- */
                /* INPUT FIELDS & LABELS */
                /* ----------------------------------------------------------------- */
                .form-group {
                    display: flex;
                    flex-direction: column;
                }
                
                .form-group label {
                    color: var(--text-color);
                    font-weight: 500;
                    margin-bottom: 8px;
                    font-size: 15px; /* Slightly smaller font */
                }

                .appointment-form input[type="text"], 
                .appointment-form input[type="datetime-local"], 
                .appointment-form input[type="date"], 
                .appointment-form input[type="time"], 
                .appointment-form input[type="email"], 
                .appointment-form input[type="number"], 
                .appointment-form select, 
                .appointment-form textarea {
                    background-color: var(--bg-input);
                    border: 1px solid var(--border-color);
                    color: var(--text-color); 
                    padding: 12px 15px;
                    border-radius: 8px;
                    font-size: 16px;
                    transition: border-color 0.2s, box-shadow 0.2s, background-color 0.3s, color 0.3s;
                    width: 100%;
                    box-sizing: border-box;
                    appearance: none; /* Helps with select styling */
                }
                .appointment-form select {
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23${isDarkMode ? 'ecf0f1' : '2c3e50'}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 10px center;
                    padding-right: 30px;
                }


                .appointment-form input:focus, 
                .appointment-form textarea:focus,
                .appointment-form select:focus {
                    border-color: var(--primary-color);
                    box-shadow: 0 0 5px rgba(0, 191, 255, 0.5);
                    outline: none;
                }
                
                /* Dark Mode Fix for datetime-local icons/text */
                .dark-mode-form .appointment-form input[type="datetime-local"],
                .dark-mode-form .appointment-form input[type="date"],
                .dark-mode-form .appointment-form input[type="time"] {
                    color-scheme: dark; 
                }
                
                .light-mode-form .appointment-form input[type="datetime-local"],
                .light-mode-form .appointment-form input[type="date"],
                .light-mode-form .appointment-form input[type="time"] {
                    color-scheme: light; 
                }
                
                .booking-duration-text {
                    color: var(--text-muted);
                    margin-top: -10px;
                    font-size: 14px;
                }

                /* ----------------------------------------------------------------- */
                /* BUTTONS */
                /* ----------------------------------------------------------------- */
                .large-action-btn {
                    padding: 15px 20px;
                    font-size: 17px;
                    font-weight: 600;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background-color 0.2s, transform 0.1s;
                }
                
                .primary-action-btn {
                    background-color: var(--primary-color);
                    color: var(--bg-card); 
                }
                
                .primary-action-btn:hover {
                    background-color: #0099e6;
                    transform: translateY(-1px);
                }

                /* Contact Buttons (Call, Email, SMS) */
                .contact-btn {
                    padding: 12px;
                    font-size: 15px;
                    font-weight: 600;
                    border: none;
                    border-radius: 8px;
                    color: #fff; 
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: opacity 0.2s;
                }
                
                .contact-btn svg {
                    margin-right: 8px;
                }

                .call-btn { background-color: #2ecc71; } 
                .email-btn { background-color: #f39c12; } 
                .sms-btn { background-color: #3498db; } 

                .contact-btn:hover { opacity: 0.9; }
                
                .btn-secondary-action {
                    background-color: var(--bg-input);
                    color: var(--text-color);
                    border: 1px solid var(--border-color);
                    padding: 10px 15px;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                .btn-secondary-action:hover {
                    background-color: #2c3e50;
                }
                .light-mode-form .btn-secondary-action:hover {
                    background-color: #e0e6ec; 
                }

                /* ----------------------------------------------------------------- */
                /* TOGGLES AND CHECKBOXES */
                /* ----------------------------------------------------------------- */
                .form-group-inline {
                    display: flex;
                    align-items: center;
                    margin-bottom: 15px;
                }
                
                .form-group-inline label {
                    margin-bottom: 0;
                    font-weight: 400;
                    color: var(--text-color);
                    font-size: 15px;
                    cursor: pointer;
                }
                
                .form-group-inline input[type="checkbox"] {
                    width: 20px;
                    height: 20px;
                    margin-right: 10px;
                    accent-color: var(--primary-color); 
                }
                
                .confirmation-actions {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 15px 0;
                    border-top: 1px solid var(--border-color);
                    border-bottom: 1px solid var(--border-color);
                    margin-bottom: 20px;
                }
                
                /* ----------------------------------------------------------------- */
                /* COLOR PICKER */
                /* ----------------------------------------------------------------- */
                .color-picker-grid {
                    display: flex; 
                    gap: 15px; 
                    margin-bottom: 40px;
                }

                .color-swatch {
                    width: 30px; 
                    height: 30px; 
                    border-radius: 50%; 
                    cursor: pointer; 
                    transition: transform 0.2s, box-shadow 0.2s;
                    border: 3px solid transparent;
                }
                
                .color-swatch:hover {
                    transform: scale(1.1);
                    box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
                }
                
                .color-swatch[data-selected="true"] {
                    border: 3px solid var(--text-color); 
                    box-shadow: 0 0 10px rgba(0, 191, 255, 0.7);
                }

                /* ----------------------------------------------------------------- */
                /* FIXED FOOTER */
                /* ----------------------------------------------------------------- */
                .form-actions.fixed-footer {
                    position: fixed;
                    bottom: 0;
                    left: 270px; /* Adjust for non-collapsed sidebar */
                    right: 0;
                    background-color: var(--bg-card); 
                    border-top: 1px solid var(--border-color);
                    padding: 15px 30px;
                    display: flex;
                    justify-content: flex-end;
                    z-index: 100;
                    box-shadow: 0 -2px 10px rgba(0,0,0,0.5);
                }
                
                .light-mode-form .form-actions.fixed-footer {
                    box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
                }
                
                .save-btn {
                    padding: 14px 25px;
                    font-size: 17px;
                    font-weight: 700;
                    border-radius: 10px;
                }
                
                .form-actions .btn-primary-action {
                    background-color: var(--primary-color);
                    color: var(--bg-card);
                    border: none;
                    transition: background-color 0.2s;
                }
                .form-actions .btn-primary-action:hover {
                    background-color: #0099e6;
                }
            `}</style>
        </div>
    );
};

export default AppointmentForm;