// src/components/AppointmentForm.js - UPDATED: Main page background (--bg-page) is now forced to white/light gray in both dark and light modes.

import React from 'react';
import { FaUser, FaCarSide, FaCalendarAlt, FaSave, FaSms, FaEnvelope, FaPhone, FaArrowLeft } from 'react-icons/fa';

const AppointmentForm = ({ onSave, isDarkMode = true, toggleDarkMode = () => {} }) => {

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, collect and validate the form data
        const appointmentData = {
            client: "Selected Client Name",
            vehicle: "Selected Vehicle Details",
            date: "10/19/2025",
            isConfirmed: true,
            // ... other fields
        };
        console.log("Saving new appointment:", appointmentData);
        onSave(appointmentData);
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
                        onClick={() => console.log('Go Back')} // Placeholder action
                    >
                        <FaArrowLeft />
                    </button>
                    <h2 className="page-title">Add New Appointment</h2>
                </div>
            </header>
            
            <form onSubmit={handleSubmit} className="form-card appointment-form">
                
                {/* General Information */}
                <h3 className="section-title">General Information</h3>
                <div className="form-grid-2">
                    {/* Select Client Button */}
                    <button type="button" className="large-action-btn primary-action-btn">
                        <FaUser style={{ marginRight: '8px' }} /> Select Client
                    </button>
                    
                    {/* Select Vehicle Button */}
                    <button type="button" className="large-action-btn primary-action-btn">
                        <FaCarSide style={{ marginRight: '8px' }} /> Select Vehicle
                    </button>
                </div>

                {/* Schedule Date */}
                <h3 className="section-title">Schedule Date</h3>
                <div className="form-grid-2">
                    {/* From Date/Time */}
                    <div className="form-group">
                        <label htmlFor="scheduleFrom">From:</label>
                        <input type="datetime-local" id="scheduleFrom" defaultValue="2025-10-19T10:00" required />
                    </div>
                    
                    {/* To Date/Time */}
                    <div className="form-group">
                        <label htmlFor="scheduleTo">To:</label>
                        <input type="datetime-local" id="scheduleTo" defaultValue="2025-10-19T12:00" required />
                    </div>
                </div>
                
                <p className="booking-duration-text">
                    Booking Duration: 2 hours 0 minutes
                </p>

                {/* Appointment Info */}
                <h3 className="section-title">Appointment Details</h3>
                <div className="form-group">
                    <textarea 
                        id="appointmentDetails" 
                        rows="4" 
                        placeholder="e.g., Oil change, tire rotation, check brake fluid..."
                    ></textarea>
                </div>

                {/* Confirm Appointment */}
                <h3 className="section-title">Confirmation & Contact</h3>
                <p className="section-description">
                    Use these links to contact the client and confirm the appointment details.
                </p>
                
                <div className="form-grid-3 contact-grid">
                    <button type="button" className="contact-btn call-btn">
                        <FaPhone /> Call
                    </button>
                    <button type="button" className="contact-btn email-btn">
                        <FaEnvelope /> Email
                    </button>
                    <button type="button" className="contact-btn sms-btn">
                        <FaSms /> SMS
                    </button>
                </div>

                {/* Confirmation Toggle and Calendar */}
                <div className="confirmation-actions">
                    <div className="form-group-inline">
                        <input type="checkbox" id="confirmedToggle" defaultChecked />
                        <label htmlFor="confirmedToggle">
                            Confirmed (booked in your calendar)
                        </label>
                    </div>
                    <button type="button" className="btn-secondary-action calendar-btn">
                        <FaCalendarAlt style={{ marginRight: '8px' }} /> Add to Calendar
                    </button>
                </div>

                {/* Automatic Reminders */}
                <h3 className="section-title">Automatic Reminders</h3>
                <p className="section-description">
                    ARI can send automatic email/SMS reminders to the client one day before this appointment.
                </p>
                <div className="form-group-inline">
                    <input type="checkbox" id="emailReminder" defaultChecked />
                    <label htmlFor="emailReminder">Send Email reminder</label>
                </div>
                <div className="form-group-inline">
                    <input type="checkbox" id="smsReminder" />
                    <label htmlFor="smsReminder">Send SMS reminder</label>
                </div>

                {/* Change Appointment Color */}
                <h3 className="section-title">Appointment Color Tag</h3>
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
                <div className="form-actions fixed-footer">
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
                    gap: 15px;
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
                }

                .appointment-form input[type="text"], 
                .appointment-form input[type="datetime-local"], 
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
                }

                .appointment-form input:focus, 
                .appointment-form textarea:focus {
                    border-color: var(--primary-color);
                    box-shadow: 0 0 5px rgba(0, 191, 255, 0.5);
                    outline: none;
                }
                
                /* Dark Mode Fix for datetime-local icons/text */
                .dark-mode-form .appointment-form input[type="datetime-local"] {
                    color-scheme: dark; 
                }
                
                .light-mode-form .appointment-form input[type="datetime-local"] {
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
                    left: 270px; 
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