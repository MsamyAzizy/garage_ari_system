// src/components/ClientForm.js - Fetches client data from the Django API 

import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import { useParams, useNavigate } from 'react-router-dom'; 
import { 
    FaSave, 
    FaUser, 
    FaMapMarkerAlt, 
    FaEnvelope, 
    FaTimes, 
    FaTags, 
    FaSpinner, 
    FaFileAlt, 
    FaIdCard,
    FaBuilding,
    FaCheckCircle, 
    FaExclamationTriangle,
    FaTools // Icon for Settings
} from 'react-icons/fa'; 

import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'; 

import apiClient from '../utils/apiClient';

// Define theme colors for consistency
const PRIMARY_BLUE = '#5d9cec';
const TOP_NAV_COLOR = '#2c3848';      
const BG_CARD_DARK = '#2c3848';       
const TEXT_PRIMARY_DARK = '#ffffff';
const TEXT_MUTED_DARK = '#aeb8c8';
const INPUT_BORDER_DARK = '#38465b';  
const DANGER_RED = '#ff4d4f'; 
const SUCCESS_GREEN = '#2ecc71'; // Added for toast consistency

// Helper function to extract name for messages
const getClientName = (client) => {
    if (!client) return 'Client';
    if (client.client_type === 'Company' && client.company_name) {
        return client.company_name;
    }
    return (client.first_name && client.last_name) 
        ? `${client.first_name} ${client.last_name}` 
        : 'Client';
};

// -----------------------------------------------------------------
// 🚀 NEW COMPONENT: Toggle Switch (Replicating image style)
// -----------------------------------------------------------------

const ToggleSwitch = ({ id, label, description, checked, onChange }) => (
    <div className="toggle-setting-item">
        <label className="toggle-label" htmlFor={id}>
            <div className="toggle-switch-wrap">
                <input
                    type="checkbox"
                    id={id}
                    checked={checked}
                    onChange={onChange}
                    className="toggle-checkbox"
                />
                <span className="toggle-slider"></span>
            </div>
            <div className="toggle-text-content">
                <span className="toggle-title">{label}</span>
                <p className="toggle-description">{description}</p>
            </div>
        </label>
    </div>
);


/**
 * Client Detail Form Component.
 * Handles client creation, editing, API submission, and error handling.
 */
const ClientForm = () => {
    // 1. Setup Routing Hooks
    const { clientId } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!clientId; 
    
    const MODE_INDIVIDUAL = 'Individual';
    const MODE_COMPANY = 'Company';

    const initialFormData = {
        id: null, 
        firstName: '',
        lastName: '',
        companyName: '',
        phone: '', 
        email: '',
        addressLine1: '', 
        city: '',
        state: '',
        zip: '', 
        clientType: MODE_INDIVIDUAL,
        taxId: '', 
        notes: '',
    };
    
    // 🏆 NEW STATE: Client Settings (Matching the screenshot image)
    const initialSettings = {
        isTaxExempt: false,
        applyDiscount: false,
        laborRateOverride: false,
        partsMarkupOverride: false,
        paymentTermsOverride: false,
    };

    const [formData, setFormData] = useState(initialFormData);
    const [clientSettings, setClientSettings] = useState(initialSettings); // NEW
    const [isLoading, setIsLoading] = useState(isEditMode);
    const [error, setError] = useState(null); // Form-level validation error
    
    const [nameMode, setNameMode] = useState(MODE_INDIVIDUAL); 
    const [countryCode, setCountryCode] = useState('us'); 
    const [phoneError, setPhoneError] = useState('');
    
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    const showToastNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 4000);
    };


    // 2. Fetch Client Data on Mount if in Edit Mode
    const fetchClient = useCallback(async () => {
        if (!isEditMode) {
            setIsLoading(false);
            return;
        }
        
        try {
            const response = await apiClient.get(`/clients/${clientId}/`);
            const clientData = response.data;
            const phone_number = clientData.phone_number || '';
            
            const clientType = clientData.client_type || MODE_INDIVIDUAL;
            const currentMode = (clientType === MODE_COMPANY || clientData.company_name) 
                                ? MODE_COMPANY 
                                : MODE_INDIVIDUAL;
                                
            setNameMode(currentMode);

            setFormData({
                id: clientData.id,
                firstName: clientData.first_name || '',
                lastName: clientData.last_name || '',
                companyName: clientData.company_name || '',
                phone: phone_number,
                email: clientData.email || '',
                addressLine1: clientData.address || '', 
                city: clientData.city || '',
                state: clientData.state || '',
                zip: clientData.zip_code || '', 
                clientType: clientType,
                taxId: clientData.tax_id || '', 
                notes: clientData.notes || '',
            });
            
            // 💡 Placeholder: Populate client settings from API response (assuming fields exist)
            setClientSettings({
                isTaxExempt: clientData.is_tax_exempt || false,
                applyDiscount: clientData.apply_discount || false,
                laborRateOverride: clientData.labor_rate_override || false,
                partsMarkupOverride: clientData.parts_markup_override || false,
                paymentTermsOverride: clientData.payment_terms_override || false,
            });
            
            if (phone_number.length > 0) {
                const deducedCountry = (clientData.country || '').toLowerCase(); 
                if (deducedCountry) setCountryCode(deducedCountry);
            }
            setIsLoading(false);
        } catch (err) {
            console.error("Failed to fetch client data:", err);
            showToastNotification("Failed to load client data. Please try again.", 'error');
            setIsLoading(false);
        }
    }, [clientId, isEditMode]); 
    
    useEffect(() => {
        fetchClient();
    }, [fetchClient]);


    // Handle change for standard inputs
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };
    
    // 🏆 NEW: Handle change for the toggle switches
    const handleSettingsChange = (e) => {
        const { id, checked } = e.target;
        setClientSettings(prev => ({
            ...prev,
            [id]: checked,
        }));
    };
    
    const handleModeChange = (e) => {
        const newMode = e.target.value;
        setNameMode(newMode);
        
        setFormData(prev => ({
            ...prev,
            firstName: newMode === MODE_INDIVIDUAL ? prev.firstName : '',
            lastName: newMode === MODE_INDIVIDUAL ? prev.lastName : '',
            companyName: newMode === MODE_COMPANY ? prev.companyName : '',
            clientType: newMode,
        }));
    };


    const handlePhoneChange = (value, country) => {
        setPhoneError('');
        
        setFormData(prev => ({
            ...prev,
            // Ensure the value is prepended with '+' for E.164 format if it's not empty
            phone: value ? `+${value}` : '', 
        }));
        setCountryCode(country.countryCode);
    };

    const isPhoneValid = (value, country) => {
        const MIN_LOCAL_DIGITS = 6; 
        const MAX_TOTAL_DIGITS = 15; 

        if (!value || value.length === country.dialCode.length) {
            setPhoneError('');
            return true;
        }

        const localNumber = value.slice(country.dialCode.length);
        
        if (localNumber.length > 0 && localNumber.startsWith('0')) {
            const errorMessage = 'Local number part cannot start with zero.';
            setPhoneError(errorMessage);
            return errorMessage; 
        }
        
        if (localNumber.length > 0 && localNumber.length < MIN_LOCAL_DIGITS) {
            const errorMessage = `Number seems too short. Please enter at least ${MIN_LOCAL_DIGITS} digits after the country code, or leave the field blank.`;
            setPhoneError(errorMessage);
            return errorMessage;
        }
        
        if (value.length > MAX_TOTAL_DIGITS) {
             const errorMessage = `The phone number is too long (Max ${MAX_TOTAL_DIGITS} digits total).`;
            setPhoneError(errorMessage);
            return errorMessage;
        }
        
        setPhoneError('');
        return true;
    };


    // 🏆 CRITICAL UPDATE: API Submission and Error Handling Logic
    const handleSubmit = async (e) => { 
        e.preventDefault();
        
        // Block submission if client-side phone error exists.
        if (phoneError) {
            showToastNotification("Please fix the client-side error in the phone number field.", 'error');
            return; 
        }
        
        // Final sanity check for required fields based on mode
        let validationError = null;
        
        // 🛑 VALIDATION 1: Check conditional name fields
        if (nameMode === MODE_INDIVIDUAL && (!formData.firstName || !formData.lastName)) {
            validationError = "First Name and Last Name are required for an Individual client.";
        } else if (nameMode === MODE_COMPANY && !formData.companyName) {
            validationError = "Company Name is required for a Company client.";
        } 
        
        // 🛑 VALIDATION 2: Check required email field
        if (!formData.email || formData.email.trim() === '') {
             validationError = validationError ? 
                               `${validationError} Also, Email Address is required.` : 
                               "Email Address is required.";
        }
        
        if (validationError) {
            showToastNotification(validationError, 'error');
            return;
        } 
        
        setIsLoading(true);
        setError(null);
        
        // 3. Prepare data for API (Merged formData and clientSettings)
        const dataToSend = {
            ...(formData.id && { id: formData.id }),
            // Identity
            first_name: formData.clientType === 'Individual' ? formData.firstName.trim() || null : null,
            last_name: formData.clientType === 'Individual' ? formData.lastName.trim() || null : null,
            company_name: formData.clientType === 'Company' ? formData.companyName.trim() || null : null,
            
            // Contact
            phone_number: formData.phone || null,
            email: formData.email.trim() || null, 
            
            // Address
            address: formData.addressLine1.trim() || null, 
            city: formData.city.trim() || null,
            state: formData.state.trim() || null,
            zip_code: formData.zip.trim() || null, 
            
            // Segmentation
            client_type: formData.clientType, 
            tax_id: formData.taxId.trim() || null, 
            notes: formData.notes.trim() || null,
            
            // 🏆 NEW: Send Settings to API (Assuming these fields exist on the backend model)
            is_tax_exempt: clientSettings.isTaxExempt,
            apply_discount: clientSettings.applyDiscount,
            labor_rate_override: clientSettings.laborRateOverride,
            parts_markup_override: clientSettings.partsMarkupOverride,
            payment_terms_override: clientSettings.paymentTermsOverride,
        };

        const isEdit = !!formData.id;
        const url = isEdit ? `/clients/${formData.id}/` : '/clients/';
        const method = isEdit ? 'put' : 'post'; 

        try {
            // 4. API Call Attempt
            const response = await apiClient({
                method: method,
                url: url,
                data: dataToSend,
            });

            // 🏆 SUCCESS BLOCK: API call successful. NOW WE REDIRECT.
            const savedClientData = response.data;
            const successMessage = isEdit 
                ? `Successfully updated client: ${getClientName(savedClientData)}.`
                : `Successfully added new client: ${getClientName(savedClientData)}.`;
            
            // Navigate back to the list page with a success message
            navigate('/clients', { state: { successMessage: successMessage } });

        } catch (err) {
            // 🛑 ERROR BLOCK: Handle API Errors
            const errorData = err.response?.data;
            let errorMessage = "An unknown error occurred while saving the client.";

            console.error("API Validation Error Response:", errorData); 

            if (err.response && err.response.status === 400 && errorData) {
                
                if (errorData.phone_number) {
                    errorMessage = `**Phone Number Error:** ${Array.isArray(errorData.phone_number) ? errorData.phone_number.join(' ') : errorData.phone_number}`;
                } else if (errorData.email) {
                    errorMessage = `**Email Error:** ${Array.isArray(errorData.email) ? errorData.email.join(' ') : errorData.email}`;
                } else if (errorData.first_name || errorData.last_name || errorData.company_name) {
                    const nameErrors = [
                        ...(errorData.first_name || []), 
                        ...(errorData.last_name || []), 
                        ...(errorData.company_name || [])
                    ].join(' ');
                    errorMessage = `**Name Validation Error:** ${nameErrors.trim() || "Required name field is missing."}`;
                }
                
                else if (typeof errorData === 'object' && Object.keys(errorData).length > 0) {
                    const firstKey = Object.keys(errorData)[0];
                    const firstError = Array.isArray(errorData[firstKey]) ? errorData[firstKey][0] : errorData[firstKey];
                    
                    if (firstKey) {
                        const fieldName = firstKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                        errorMessage = `**Validation Error in ${fieldName}:** ${firstError}`;
                    } else {
                        errorMessage = "Validation failed. Please check all highlighted or required fields.";
                    }
                } 
                else if (typeof errorData === 'string') {
                    errorMessage = errorData;
                }
                
            } else if (err.message) {
                errorMessage = `Network Error: ${err.message}`;
            }

            // Show the error message toast
            showToastNotification(errorMessage, 'error');
            
        } finally {
            setIsLoading(false);
        }
    };
    
    // Placeholder for the cancel action
    const handleCancel = () => {
        // Just go back to the clients list
        navigate('/clients');
    };

    // --- Render Logic ---

    if (isLoading && isEditMode) {
        return (
            <div className="client-form-container loading-state">
                <FaSpinner className="spinner" size={30} color={PRIMARY_BLUE} />
                <p>Loading client details...</p>
                <style jsx>{`
                    .loading-state {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        min-height: 200px;
                        color: ${TEXT_MUTED_DARK};
                    }
                    .spinner {
                        animation: spin 1s linear infinite;
                        margin-bottom: 10px;
                    }
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }
    
    // If a generic error occurred during initial fetch
    if (error) {
        return (
            <div className="client-form-container error-state">
                <header className="page-header"><h2>Error</h2></header>
                <div style={{ padding: '20px', color: DANGER_RED, border: `1px solid ${DANGER_RED}40`, borderRadius: '4px', backgroundColor: '#fdd' }}>
                    **Error:** {error}
                </div>
            </div>
        );
    }


    const formTitle = isEditMode 
        ? `Edit Client: ${nameMode === MODE_COMPANY ? formData.companyName : `${formData.firstName} ${formData.lastName}`}` 
        : 'Create New Client';

    return (
        <div className="client-form-container">
            <header className="page-header">
                <h2>{formTitle}</h2>
            </header>
            
            {/* The main form area */}
            <form onSubmit={handleSubmit} className="form-card">
                
                {/* 1. Client Identity & Contact Information */}
                <h4 className="form-section-title"><FaUser /> Client Identity & Contact Info</h4>
                
                {/* NAME MODE SELECTOR */}
                <div className="form-grid-1">
                    <div className="form-group name-mode-selector">
                        <label htmlFor="nameMode">Client Name Format *</label>
                        <select 
                            id="nameMode" 
                            name="nameMode" 
                            required 
                            onChange={handleModeChange} 
                            value={nameMode} 
                        >
                            <option value={MODE_INDIVIDUAL}>Customer name</option>
                            <option value={MODE_COMPANY}>Company name / Business name</option>
                        </select>
                        <p className="mode-description">
                            The client type will automatically be set to **{nameMode}**.
                        </p>
                    </div>
                </div>
                
                {/* CONDITIONAL NAME INPUTS */}
                {nameMode === MODE_INDIVIDUAL ? (
                    <div className="form-grid-2">
                        <div className="form-group">
                            <label htmlFor="firstName">First Name *</label>
                            <input type="text" id="firstName" name="firstName" required onChange={handleChange} value={formData.firstName} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName">Last Name *</label>
                            <input type="text" id="lastName" name="lastName" required onChange={handleChange} value={formData.lastName} />
                        </div>
                    </div>
                ) : (
                    <div className="form-grid-1">
                         <div className="form-group">
                            <label htmlFor="companyName"><FaBuilding /> Company Name *</label>
                            <input type="text" id="companyName" name="companyName" required onChange={handleChange} value={formData.companyName} />
                        </div>
                    </div>
                )}
                
                {/* Phone and Email - Always visible */}
                <div className="form-grid-2">
                    {/* PHONE INPUT */}
                    <div className="form-group">
                        <label htmlFor="phone">Primary Phone</label> 
                        <PhoneInput
                            country={countryCode} 
                            value={formData.phone ? formData.phone.slice(1) : ''}
                            onChange={handlePhoneChange} 
                            isValid={isPhoneValid}
                            inputProps={{
                                name: 'phone',
                                required: false, 
                                autoFocus: false,
                            }}
                            inputStyle={{
                                width: '100%',
                                padding: '10px 12px 10px 50px', 
                                backgroundColor: document.body.classList.contains('dark-theme') ? TOP_NAV_COLOR : '#ffffff',
                                borderColor: phoneError ? DANGER_RED : (document.body.classList.contains('dark-theme') ? INPUT_BORDER_DARK : '#dddddd'), 
                                color: document.body.classList.contains('dark-theme') ? TEXT_PRIMARY_DARK : '#333333',
                            }}
                            buttonStyle={{
                                borderColor: phoneError ? DANGER_RED : (document.body.classList.contains('dark-theme') ? INPUT_BORDER_DARK : '#dddddd'),
                                backgroundColor: document.body.classList.contains('dark-theme') ? TOP_NAV_COLOR : '#ffffff',
                                color: document.body.classList.contains('dark-theme') ? TEXT_PRIMARY_DARK : '#333333',
                            }}
                        />
                        {/* Display the error message if validation fails */}
                        {phoneError && (
                            <p className="phone-validation-error">{phoneError}</p>
                        )}
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="email"><FaEnvelope /> Email Address *</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            placeholder="name@example.com" 
                            required 
                            onChange={handleChange} 
                            value={formData.email} 
                        />
                    </div>
                </div>

                {/* 2. Client Segmentation */}
                <h4 className="form-section-title"><FaTags /> Client Segmentation</h4>
                <div className="form-grid-2">
                    <div className="form-group">
                        <label>Client Type (Auto-set)</label>
                        <input type="text" readOnly value={formData.clientType} style={{ color: PRIMARY_BLUE, fontWeight: 'bold' }}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="taxId"><FaIdCard /> Tax ID (TIN/VAT)</label>
                        <input 
                            type="text" 
                            id="taxId" 
                            name="taxId" 
                            placeholder="Optional Tax Identification Number" 
                            onChange={handleChange} 
                            value={formData.taxId} 
                        />
                    </div>
                </div>

                
                {/* 3. Address Information */}
                <h4 className="form-section-title"><FaMapMarkerAlt /> Address</h4>
                <div className="form-grid-1">
                    <div className="form-group">
                        <label htmlFor="addressLine1">Address Line 1</label>
                        <input type="text" id="addressLine1" name="addressLine1" onChange={handleChange} value={formData.addressLine1} />
                    </div>
                </div>
                <div className="form-grid-3">
                    <div className="form-group">
                        <label htmlFor="city">City</label>
                        <input type="text" id="city" name="city" onChange={handleChange} value={formData.city} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="state">State/Province</label>
                        <input type="text" id="state" name="state" onChange={handleChange} value={formData.state} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="zip">Zip/Postal Code</label>
                        <input type="text" id="zip" name="zip" onChange={handleChange} value={formData.zip} />
                    </div>
                </div>
                
                {/* 4. Internal Notes */}
                <h4 className="form-section-title"><FaFileAlt /> Internal Notes</h4>
                <div className="form-grid-1">
                    <div className="form-group">
                        <label htmlFor="notes">Client Notes</label>
                        <textarea
                            id="notes"
                            name="notes"
                            rows="4" 
                            placeholder="Add any internal notes or special instructions for this client."
                            onChange={handleChange} 
                            value={formData.notes}
                        ></textarea>
                    </div>
                </div>
                
                {/* 🏆 5. Client Settings & Configuration (New Section) 🏆 */}
                <h4 className="form-section-title"><FaTools /> Client Settings & Configuration</h4>
                <div className="detail-card-section settings-section">
                    
                    <ToggleSwitch 
                        id="isTaxExempt"
                        label="Tax Exempt"
                        description="If activated, no taxes will be added to this client's future invoices."
                        checked={clientSettings.isTaxExempt}
                        onChange={handleSettingsChange}
                    />

                    <ToggleSwitch 
                        id="applyDiscount"
                        label="Apply Discount"
                        description="If activated, a discount will be applied to all future invoices."
                        checked={clientSettings.applyDiscount}
                        onChange={handleSettingsChange}
                    />
                    
                    <ToggleSwitch 
                        id="laborRateOverride"
                        label="Labor Rate Override"
                        description="If activated, a different labor rate will be applied when creating an invoice."
                        checked={clientSettings.laborRateOverride}
                        onChange={handleSettingsChange}
                    />
                    
                    <ToggleSwitch 
                        id="partsMarkupOverride"
                        label="Parts Markup Override"
                        description="If activated, a different price markup will be applied to this client on future invoices."
                        checked={clientSettings.partsMarkupOverride}
                        onChange={handleSettingsChange}
                    />
                    
                    <ToggleSwitch 
                        id="paymentTermsOverride"
                        label="Payment Terms Override"
                        description="This option will define the Due Date date on your invoices. Default is 30 Days!"
                        checked={clientSettings.paymentTermsOverride}
                        onChange={handleSettingsChange}
                    />

                </div>


                {/* 6. Vehicle Association (Placeholder) */}
                <h4 className="form-section-title">Registered Vehicles</h4>
                <div className="detail-card-section placeholder-section">
                    <p>
                        No vehicles registered yet. 
                        <a 
                            href="#add-vehicle" 
                            onClick={(e) => { e.preventDefault(); console.log('Add Vehicle clicked!'); }}
                        >
                            Click to add a vehicle to this client.
                        </a>
                    </p>
                </div>
                
                {/* 7. Form Actions (Footer) */}
                <div className="form-actions page-form-actions">
                    {/* Secondary action (Cancel) */}
                    <button type="button" onClick={handleCancel} className="btn-secondary">
                        <FaTimes /> Cancel
                    </button>
                    {/* Primary action (Save) - Disabled if phone has a client-side error */}
                    <button type="submit" className="btn-primary-action" disabled={!!phoneError || isLoading}>
                        {isLoading ? <FaSpinner className="spinner-icon" /> : <FaSave />} {isEditMode ? 'Update Client' : 'Save Client'} 
                    </button>
                </div>
            </form>
            
            {/* TOAST NOTIFICATION COMPONENT */}
            {notification.show && (
                <div className={`toast-notification ${notification.type}`}>
                    {notification.type === 'success' ? 
                        <FaCheckCircle style={{ marginRight: '10px' }} /> : 
                        <FaExclamationTriangle style={{ marginRight: '10px' }} />
                    }
                    {notification.message}
                </div>
            )}
            
            {/* 🚀 STYLES FOR THE FORM */}
            <style jsx>{`
                /* --- BASE FONT STYLING --- */
                .client-form-container, .form-card, h2, h4, label, input, textarea, select, button {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
                }
                
                /* Container and Card */
                .client-form-container {
                    padding: 0 20px 40px 20px;
                    max-width: 1900px;
                    margin-left: -10px; 
                }
                
                /* Page Header (H2) */
                .page-header h2 {
                    font-size: 24px;
                    font-weight: 700;
                    color: #333333;
                }
                body.dark-theme .page-header h2 {
                    color: ${TEXT_PRIMARY_DARK};
                }
                .page-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 0 15px 0;
                    border-bottom: 1px solid #e0e0e0;
                    margin-bottom: 20px;
                }
                body.dark-theme .page-header {
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                }

                .form-card {
                    background-color: #ffffff;
                    padding: 30px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }

                /* Dark Theme Card Adaptation */
                body.dark-theme .form-card {
                    background-color: ${BG_CARD_DARK};
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                }

                /* Section Titles (H4) */
                .form-section-title {
                    color: ${PRIMARY_BLUE};
                    font-size: 18px;
                    font-weight: 600;
                    margin-top: 30px;
                    margin-bottom: 15px;
                    padding-bottom: 5px;
                    border-bottom: 1px solid rgba(0,0,0,0.1);
                    display: flex;
                    align-items: center;
                }
                .form-section-title > svg {
                    margin-right: 8px;
                    font-size: 20px;
                }
                body.dark-theme .form-section-title {
                    border-bottom-color: rgba(255,255,255,0.1);
                }

                /* Grid Layouts (no change) */
                .form-grid-1 {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 20px;
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
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 20px;
                    margin-bottom: 20px;
                }
                
                /* Detail Card Section (for toggles, vehicles, etc.) */
                .detail-card-section {
                    padding: 10px 0;
                }
                .placeholder-section {
                    background-color: #f7f7f7;
                    padding: 15px 20px;
                    border-radius: 6px;
                    border: 1px dashed #cccccc;
                    color: #777;
                }
                body.dark-theme .placeholder-section {
                    background-color: #334050;
                    border-color: #4a5d77;
                    color: ${TEXT_MUTED_DARK};
                }


                /* Form Group and Inputs */
                .form-group {
                    display: flex;
                    flex-direction: column;
                }

                .form-group label {
                    font-size: 14px;
                    font-weight: 500;
                    margin-bottom: 5px;
                    color: #555555;
                    display: flex;
                    align-items: center;
                }
                .form-group label > svg {
                    margin-right: 5px;
                    color: #999999;
                }

                /* Dark Theme Label/Text */
                body.dark-theme .form-group label {
                    color: ${TEXT_MUTED_DARK};
                }
                body.dark-theme .form-group label > svg {
                    color: ${TEXT_MUTED_DARK};
                }

                input[type="text"],
                input[type="email"],
                textarea,
                select {
                    padding: 10px 12px;
                    border: 1px solid #dddddd;
                    border-radius: 4px;
                    font-size: 15px;
                    transition: border-color 0.2s, box-shadow 0.2s;
                    background-color: #ffffff;
                    color: #333333;
                }
                
                input:focus,
                textarea:focus,
                select:focus {
                    border-color: ${PRIMARY_BLUE};
                    outline: none;
                    box-shadow: 0 0 0 1px ${PRIMARY_BLUE};
                }

                /* Dark Theme Inputs */
                body.dark-theme input,
                body.dark-theme textarea,
                body.dark-theme select {
                    background-color: ${TOP_NAV_COLOR}; 
                    border-color: ${INPUT_BORDER_DARK};
                    color: ${TEXT_PRIMARY_DARK};
                }
                body.dark-theme input::placeholder,
                body.dark-theme textarea::placeholder {
                    color: ${TEXT_MUTED_DARK};
                }
                
                /* Textarea specific styling */
                textarea {
                    resize: vertical;
                    min-height: 100px;
                }
                
                /* Phone Validation Error Styling */
                .phone-validation-error {
                    color: ${DANGER_RED};
                    font-size: 13px;
                    margin-top: 5px;
                    font-weight: 500;
                }
                
                /* Mode Description Styling */
                .mode-description {
                    font-size: 13px;
                    color: #777;
                    margin-top: 5px;
                }
                body.dark-theme .mode-description {
                    color: ${TEXT_MUTED_DARK};
                }

                /* --- Form Actions (Footer Buttons) --- */
                .page-form-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 15px;
                    padding-top: 25px;
                    margin-top: 30px;
                    border-top: 1px solid #e0e0e0;
                }
                body.dark-theme .page-form-actions {
                    border-top: 1px solid rgba(255,255,255,0.1);
                }

                .btn-primary-action, .btn-secondary {
                    padding: 10px 20px;
                    border-radius: 8px;
                    font-size: 16px;
                    cursor: pointer;
                    font-weight: 600;
                    display: inline-flex;
                    align-items: center;
                    transition: background-color 0.2s, transform 0.1s, opacity 0.2s;
                }
                .btn-primary-action {
                    background-color: ${PRIMARY_BLUE};
                    color: white;
                    border: none;
                }
                .btn-primary-action:hover:not(:disabled) {
                    background-color: #4a90e2;
                }
                .btn-secondary {
                    background-color: #f1f1f1;
                    color: #333;
                    border: 1px solid #dddddd;
                }
                .btn-secondary:hover {
                    background-color: #e0e0e0;
                }
                body.dark-theme .btn-secondary {
                    background-color: #38465b;
                    color: ${TEXT_PRIMARY_DARK};
                    border-color: #4a5d77;
                }
                body.dark-theme .btn-secondary:hover {
                    background-color: #4a5d77;
                }
                .btn-primary-action:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                .spinner-icon {
                    animation: spin 1s linear infinite;
                    margin-right: 5px;
                }


                /* ----------------------------------------------------------------- */
                /* 🏆 TOGGLE SWITCH STYLES (Based on Image) 🏆 */
                /* ----------------------------------------------------------------- */
                .settings-section {
                    display: flex;
                    flex-direction: column;
                    gap: 15px; 
                }

                .toggle-setting-item {
                    border-bottom: 1px solid #eee;
                    padding-bottom: 15px;
                }
                .toggle-setting-item:last-child {
                    border-bottom: none; 
                    padding-bottom: 0;
                }
                body.dark-theme .toggle-setting-item {
                    border-bottom: 1px solid #38465b;
                }


                .toggle-label {
                    display: flex;
                    align-items: flex-start; /* Align switch and text vertically */
                    cursor: pointer;
                    user-select: none; 
                    padding: 5px 0;
                }
                
                .toggle-switch-wrap {
                    position: relative;
                    width: 50px; /* Width of the track */
                    height: 26px; /* Height of the track */
                    flex-shrink: 0;
                    margin-right: 15px;
                }

                .toggle-checkbox {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }

                .toggle-slider {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #ccc; /* Off-state track color */
                    border-radius: 34px; /* Pill shape */
                    transition: .4s;
                    box-shadow: 0 0 1px rgba(0,0,0,0.1) inset;
                }

                .toggle-slider:before {
                    position: absolute;
                    content: "";
                    height: 18px; /* Height of the thumb */
                    width: 18px; /* Width of the thumb */
                    left: 4px;
                    bottom: 4px;
                    background-color: white; /* Thumb color */
                    border-radius: 50%;
                    transition: .4s;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.4); 
                }

                /* Checked State */
                .toggle-checkbox:checked + .toggle-slider {
                    background-color: ${PRIMARY_BLUE}; /* On-state track color */
                }

                .toggle-checkbox:checked + .toggle-slider:before {
                    transform: translateX(24px); /* Move thumb to the right (50-4-4-18 = 24) */
                }

                /* Focus State (Accessibility) */
                .toggle-checkbox:focus + .toggle-slider {
                    box-shadow: 0 0 1px ${PRIMARY_BLUE};
                }

                /* Text Content */
                .toggle-text-content {
                    display: flex;
                    flex-direction: column;
                }
                .toggle-title {
                    font-size: 16px; 
                    font-weight: 500; 
                    color: #333;
                    line-height: 1.2;
                }
                body.dark-theme .toggle-title {
                    color: ${TEXT_PRIMARY_DARK};
                }
                .toggle-description {
                    font-size: 13px;
                    color: #777;
                    margin: 0;
                    margin-top: 3px;
                    line-height: 1.4;
                }
                body.dark-theme .toggle-description {
                    color: ${TEXT_MUTED_DARK};
                }
                
                /* Dark Mode Toggles */
                body.dark-theme .toggle-slider {
                    background-color: #555; /* Darker off-state track */
                }
                body.dark-theme .toggle-slider:before {
                    background-color: #cccccc; /* Lighter thumb */
                }
                body.dark-theme .toggle-checkbox:checked + .toggle-slider {
                    background-color: ${PRIMARY_BLUE}; 
                }

                /* ----------------------------------------------------------------- */
                /* TOAST NOTIFICATION STYLES */
                /* ----------------------------------------------------------------- */
                .toast-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 15px 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    font-size: 15px;
                    font-weight: 600;
                    z-index: 1001;
                    display: flex;
                    align-items: center;
                    animation: slideIn 0.3s ease-out;
                }
                
                .toast-notification.success {
                    background-color: ${SUCCESS_GREEN};
                    color: white;
                }
                .toast-notification.error {
                    background-color: ${DANGER_RED};
                    color: white;
                }
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                /* --- Media Queries --- */
                @media (max-width: 900px) {
                    .form-grid-2 {
                        grid-template-columns: 1fr;
                    }
                    .form-grid-3 {
                        grid-template-columns: 1fr 1fr;
                    }
                }

                @media (max-width: 600px) {
                    .form-grid-3 {
                        grid-template-columns: 1fr;
                    }
                    .page-form-actions {
                        flex-direction: column-reverse;
                    }
                }
            `}</style>
        </div>
    );
};

export default ClientForm;