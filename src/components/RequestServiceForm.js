// src/components/RequestServiceForm.js

import React, { useState } from 'react';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import apiClient from '../utils/apiClient';

// Defining the specific dark color for easy reference
const PRIMARY_DARK_COLOR = '#3a3a37'; 
const ACCENT_ORANGE = '#ff884a'; // Accent color for the Login button
const SUBMIT_COLOR = PRIMARY_DARK_COLOR; // Standardized Submit button color

const SERVICE_OPTIONS = [
    { value: 'repair', label: 'Repair' },
    { value: 'service', label: 'Service' },
    { value: 'inspection', label: 'Inspection' },
];

const RequestServiceForm = ({ onClose }) => {
    const [formData, setFormData] = useState({
        customerCompanyName: '',
        email: '',
        phone: '',
        vehicleModel: '',
        serviceType: 'repair',
        service: 'engine',
        repairIssue: '',
        reasonForRepair: '',
        listODamages: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

    const SERVICE_SPECIFIC_OPTIONS = {
        repair: [
            { value: 'engine', label: 'Engine Repair' },
            { value: 'body', label: 'Body Repair' },
            { value: 'electrical', label: 'Electrical System' },
        ],
        service: [
            { value: 'oil', label: 'Oil Change' },
            { value: 'maintenance', label: 'Routine Maintenance' },
            { value: 'tires', label: 'Tire Service' },
        ],
        inspection: [
            { value: 'full_check', label: 'Full Vehicle Check' },
            { value: 'pre_purchase', label: 'Pre-Purchase Inspection' },
        ],
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleServiceTypeChange = (e) => {
        const newServiceType = e.target.value;
        const defaultService = SERVICE_SPECIFIC_OPTIONS[newServiceType][0]?.value || '';
        setFormData(prev => ({
            ...prev,
            serviceType: newServiceType,
            service: defaultService,
        }));
    };

    const validateForm = () => {
        const requiredFields = ['customerCompanyName', 'email', 'phone', 'vehicleModel', 'repairIssue', 'reasonForRepair', 'listODamages'];
        for (const field of requiredFields) {
            if (!formData[field].trim()) {
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus(null);

        if (!validateForm()) {
            setSubmitStatus('error');
            return;
        }

        setIsSubmitting(true);

        const apiData = {
            customer_name_company: formData.customerCompanyName,
            customer_email: formData.email,
            customer_phone: formData.phone,
            vehicle_model: formData.vehicleModel,
            service_type_category: formData.serviceType,
            service_specific: formData.service,
            repair_issue: formData.repairIssue,
            reason_details: formData.reasonForRepair,
            list_of_damages: formData.listODamages,
        };

        try {
            // Placeholder API call
            await apiClient.post('/requests/submit/', apiData);
            setSubmitStatus('success');
            setFormData({
                customerCompanyName: '', email: '', phone: '', vehicleModel: '',
                serviceType: 'repair', service: SERVICE_SPECIFIC_OPTIONS.repair[0].value, repairIssue: '', reasonForRepair: '', listODamages: '',
            });

        } catch (error) {
            console.error("Service request submission failed:", error.response || error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getFormStatusMessage = () => {
        if (submitStatus === 'success') {
            return (
                <div className="form-status form-success">
                    <FaCheckCircle /> Request submitted successfully! A confirmation has been sent to your email.
                </div>
            );
        }
        if (submitStatus === 'error') {
            return (
                <div className="form-status form-error">
                    <FaExclamationCircle /> Submission failed. Please verify all required fields and try again.
                </div>
            );
        }
        return null;
    };


    return (
        <div className="service-form-page">
            <header className="page-header">
                <div className="logo-placeholder">
                    <span className="logo-text">AUTO REPAIR SYSTEM</span>
                </div>
                <nav className="header-nav">
                    <a href="/login" className="btn-login">Back To Login</a>
                </nav>
            </header>

            <div className="form-content-wrapper">
                <h1 className="main-title">Service & Repair Request Form</h1>
                <p className="form-description">Submit your vehicle details to begin the service process. All fields are required.</p>

                {getFormStatusMessage()}

                <form onSubmit={handleSubmit} className="service-form-grid">

                    {/* Row 1: Contact */}
                    <div className="form-field">
                        <label htmlFor="customerCompanyName">Customer / Company Name</label>
                        <input
                            type="text"
                            id="customerCompanyName"
                            name="customerCompanyName"
                            value={formData.customerCompanyName}
                            onChange={handleChange}
                            placeholder="Full name or Company name"
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="user@example.com"
                            required
                        />
                    </div>

                    {/* Row 2: Contact / Vehicle */}
                    <div className="form-field">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+1 (555) 000-0000"
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label htmlFor="vehicleModel">Vehicle Make & Model</label>
                        <input
                            type="text"
                            id="vehicleModel"
                            name="vehicleModel"
                            value={formData.vehicleModel}
                            onChange={handleChange}
                            placeholder="e.g., Toyota Camry"
                            required
                        />
                    </div>

                    {/* Row 3: Service Type */}
                    <div className="form-field">
                        <label htmlFor="serviceType">Service Category</label>
                        <select
                            id="serviceType"
                            name="serviceType"
                            value={formData.serviceType}
                            onChange={handleServiceTypeChange}
                        >
                            {SERVICE_OPTIONS.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-field">
                        <label htmlFor="service">Specific Service</label>
                        <select
                            id="service"
                            name="service"
                            value={formData.service}
                            onChange={handleChange}
                        >
                            {SERVICE_SPECIFIC_OPTIONS[formData.serviceType].map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Row 4: Repair Issue (Full Width) */}
                    <div className="form-field full-width">
                        <label htmlFor="repairIssue">Repair Issue Title / Summary</label>
                        <input
                            type="text"
                            id="repairIssue"
                            name="repairIssue"
                            value={formData.repairIssue}
                            onChange={handleChange}
                            placeholder="Engine light on, brake squealing, etc."
                            required
                        />
                    </div>

                    {/* Row 5: Detailed Symptoms (Full Width Textarea) */}
                    <div className="form-field full-width">
                        <label htmlFor="reasonForRepair">Detailed Symptoms</label>
                        <textarea
                            id="reasonForRepair"
                            name="reasonForRepair"
                            rows="4"
                            value={formData.reasonForRepair}
                            onChange={handleChange}
                            placeholder="Describe symptoms and when the problem started."
                            required
                        />
                    </div>

                    {/* Row 6: Existing Damages (Full Width Textarea) */}
                    <div className="form-field full-width">
                        <label htmlFor="listODamages">Existing Damages (If Applicable)</label>
                        <textarea
                            id="listODamages"
                            name="listODamages"
                            rows="4"
                            value={formData.listODamages}
                            onChange={handleChange}
                            placeholder="List existing dents, scratches, or mechanical issues."
                            required
                        />
                    </div>

                    <div className="form-actions full-width">
                        <button type="submit" className="btn-submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit Service Request'}
                        </button>
                    </div>
                </form>
            </div>

            {/* ⬅️ ADD FOOTER JSX HERE ⬅️ */}
            <footer className="page-footer">
                <p>&copy; {new Date().getFullYear()} Auto Repair System. All rights reserved.</p>
            </footer>


            {/* ------------------------- PROFESSIONAL CSS Styles (Updated) ------------------------- */}
            <style jsx>{`
                /* Primary Color: #3a3a37 (Dark Charcoal/Black) */
                
                .service-form-page {
                    min-height: 100vh;
                    background-color: #F8FAFC; 
                    font-family: 'Inter', sans-serif;
                    max-width:2000px;
                }

                /* --- Header Styling --- */
                .page-header {
                    display: flex;
                    justify-content: space-between; 
                    align-items: center;
                    padding: 18px 150px; 
                    background-color: ${PRIMARY_DARK_COLOR};
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                }
                
                /* Logo Text Styling */
                .logo-text {
                    font-size: 20px;
                    font-weight: 700;
                    color: white; 
                    letter-spacing: 1px;
                }

                /* Login Button Style */
                .btn-login {
                    text-decoration: none;
                    padding: 8px 18px; 
                    background-color: ${ACCENT_ORANGE}; 
                    color: #3a3a37ff; 
                    border: none;
                    border-radius: 4px; 
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.2s, box-shadow 0.2s;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                }
                .btn-login:hover {
                    background-color: #e67d44; 
                    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
                }


                /* --- Form Wrapper and Title --- */
                .form-content-wrapper {
                    flex-grow: 1; /* NEW: Allows the content to fill available space and push the footer down */
                    max-width: 1450px; 
                    margin: 30px auto 80px auto; 
                    padding: 40px 60px; 
                    background-color: #ffffff;
                    border-radius: 4px; 
                    border: 1px solid #E5E7EB;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05); 
                }
                
                /* ⬅️ ADD FOOTER CSS HERE ⬅️ */
                .page-footer {
                    padding: 20px 0;
                    background-color: ${PRIMARY_DARK_COLOR};
                    color: #D1D5DB; 
                    text-align: center;
                    font-size: 14px;
                    width: 100%;
                    margin-top: auto; /* Ensures it is pushed to the bottom of the flex container */
                }
                .main-title {
                    font-size: 28px;
                    font-weight: 600; 
                    color: #1F2937;
                    margin-bottom: 5px;
                    text-align: left; 
                }
                .form-description {
                    font-size: 16px;
                    color: #6B7280;
                    margin-bottom: 40px;
                    text-align: left; 
                    padding-bottom: 20px;
                    border-bottom: 1px solid #ECECEC; 
                }

                /* --- Form Grid Layout --- */
                .service-form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 30px; 
                }
                .form-field {
                    display: flex;
                    flex-direction: column;
                }
                .form-field.full-width {
                    grid-column: 1 / -1;
                }

                label {
                    font-size: 14px;
                    font-weight: 500; 
                    color: #333333; 
                    margin-bottom: 8px; 
                }
                
                input, select, textarea {
                    width: 100%;
                    padding: 12px 12px; 
                    border: 1px solid #D1D5DB;
                    border-radius: 4px; 
                    font-size: 16px;
                    color: #374151;
                    background-color: #FFFFFF;
                    transition: border-color 0.2s;
                }
                
                input:focus, select:focus, textarea:focus {
                    border-color: #AAAAAA; 
                    outline: none;
                    box-shadow: none; 
                }
                
                select {
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    appearance: none;
                    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="%236B7280" d="M4.94 6.94L8 10.06l3.06-3.06L12 7l-4 4-4-4z"/></svg>');
                    background-repeat: no-repeat;
                    background-position: right 12px center;
                }
                
                textarea {
                    min-height: 150px; 
                    resize: vertical;
                }
                
                input::placeholder, textarea::placeholder {
                    color: #9CA3AF;
                    font-style: normal; 
                    font-size: 15px;
                }

                /* --- Centering Submit Button --- */
                .form-actions {
                    grid-column: 1 / -1;
                    margin-top: 30px;
                    text-align: center; /* ALIGN BUTTON TO CENTER */
                }
                .btn-submit {
                    width: 250px; 
                    padding: 10px 20px;
                    background-color: ${SUBMIT_COLOR}; /* Uses PRIMARY_DARK_COLOR */
                    color: white;
                    border: none;
                    border-radius: 4px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.2s, box-shadow 0.2s;
                    box-shadow: none;
                }
                .btn-submit:hover:not(:disabled) {
                    background-color: #4b4b47; /* Darker hover state of PRIMARY_DARK_COLOR */
                }
                .btn-submit:disabled {
                    background-color: #D1D5DB;
                    opacity: 1;
                    cursor: not-allowed;
                    color: #6B7280;
                }

                /* Form Status Styling */
                .form-status {
                    padding: 12px;
                    border-radius: 4px;
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    font-weight: 500;
                    font-size: 15px;
                }
                .form-status svg {
                    margin-right: 10px;
                    font-size: 18px;
                }
                .form-success {
                    background-color: #D1FAE5;
                    color: #059669;
                    border: 1px solid #34D399;
                }
                .form-error {
                    background-color: #FEE2E2;
                    color: #EF4444;
                    border: 1px solid #F87171;
                }

                /* Responsive adjustments */
                @media (max-width: 1000px) {
                    .page-header {
                        padding: 15px 50px;
                    }
                    .form-content-wrapper {
                        max-width: 90%;
                        margin: 20px auto;
                        padding: 25px;
                    }
                    .service-form-grid {
                        grid-template-columns: 1fr;
                        gap: 20px;
                    }
                    .btn-submit {
                        width: 100%;
                    }
                    .main-title, .form-description {
                        text-align: left;
                    }
                    .form-actions {
                        text-align: center; 
                    }
                }
                @media (max-width: 600px) {
                    .page-header {
                        padding: 15px 15px;
                    }
                }
            `}</style>
        </div>
    );
};

export default RequestServiceForm;