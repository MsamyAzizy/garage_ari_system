// src/components/ClientForm.js - Fetches client data from the Django API 

import React, { useState, useEffect, useCallback } from 'react'; 
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
    FaTools,
    FaDollarSign, 
    FaPercent, 
    FaCar, 
    FaPlusCircle // Added for 'Add Vehicle' button
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
const SUCCESS_GREEN = '#2ecc71'; 
//const EDIT_ORANGE = '#ffa726'; // Defined a color for consistent button styling

// --- CITY OPTIONS FOR TANZANIA (Curated List) ---
// --- CITY OPTIONS FOR TANZANIA (Curated List) ---
const TANZANIA_CITIES = [
    "Dar es Salaam", "Mwanza", "Dodoma", "Arusha", "Mbeya", "Morogoro", 
    "Tanga", "Kahama", "Tabora", "Zanzibar City", "Kigoma", "Sumbawanga", 
    "Kasulu", "Songea", "Moshi", "Musoma", "Shinyanga", "Iringa", "Singida", 
    "Njombe", "Bukoba", "Kibaha", "Mtwara", "Mpanda", "Tunduma", "Makambako", 
    "Babati", "Handeni", "Lindi", "Korogwe"
];

// 💰 CUSTOM PAYMENT TERMS OPTIONS (Defined as requested)
const PAYMENT_TERMS_OPTIONS = [
    "Immediately payment",
    "15 Days Payment",
    "30 Days of Payment",
    "7 Days of payment",
];

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
// Toggle Switch Component
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
        // 🚀 NEW CUSTOM FIELDS
        customLaborRate: '',
        customMarkupPercentage: '',
        customPaymentTerms: '',
    };
    
    // Client Settings State (Booleans)
    const initialSettings = {
        isTaxExempt: false,
        applyDiscount: false,
        laborRateOverride: false,
        partsMarkupOverride: false,
        paymentTermsOverride: false,
    };

    const [formData, setFormData] = useState(initialFormData);
    const [clientSettings, setClientSettings] = useState(initialSettings); 
    const [isLoading, setIsLoading] = useState(isEditMode);
    const [error, setError] = useState(null); 
    
    const [nameMode, setNameMode] = useState(MODE_INDIVIDUAL); 
    const [countryCode, setCountryCode] = useState('tz'); // Default to Tanzania
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
            
            // Utility function to safely parse DecimalFields (which might come as strings or numbers)
            const safeDecimal = (val) => (val === null || val === undefined || val === '') ? '' : String(val);

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
                // 🚀 FETCHING NEW CUSTOM FIELDS
                customLaborRate: safeDecimal(clientData.custom_labor_rate),
                customMarkupPercentage: safeDecimal(clientData.custom_markup_percentage),
                customPaymentTerms: clientData.custom_payment_terms || '',
            });
            
            setClientSettings({
                isTaxExempt: clientData.is_tax_exempt || false,
                applyDiscount: clientData.apply_discount || false,
                laborRateOverride: clientData.labor_rate_override || false,
                partsMarkupOverride: clientData.parts_markup_override || false,
                paymentTermsOverride: clientData.payment_terms_override || false,
            });
            
            if (phone_number.length > 0) {
                // Determine country code from phone number if possible, default to saved or 'tz'
                const phoneWithoutPlus = phone_number.replace('+', '');
                // Simple deduction: if it starts with '255', assume TZ (not robust, but helps initialize)
                const deducedCountry = phoneWithoutPlus.startsWith('255') ? 'tz' : (clientData.country || '').toLowerCase() || 'tz'; 
                setCountryCode(deducedCountry);
            }
            setIsLoading(false);
        } catch (err) {
            console.error("Failed to fetch client data:", err);
            // NOTE: Keep error notification here for fetch failures
            //showToastNotification("Failed to load client data. Please try again.", 'error'); 
            setIsLoading(false);
        }
    }, [clientId, isEditMode]); 
    
    useEffect(() => {
        fetchClient();
    }, [fetchClient]);


    // Handle change for standard and custom inputs
  // Handle change for standard and custom inputs
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        // Handle input for custom fields (ensure correct type conversion for API if needed later)
        if (name.startsWith('custom')) {
            // Only Labor Rate and Markup are numeric/decimal fields, Terms is a string (from select)
            if (name === 'customLaborRate' || name === 'customMarkupPercentage') {
                // For decimal inputs, allow empty string but ensure valid characters
                const cleanedValue = value.replace(/[^0-9.]/g, ''); 
                setFormData(prev => ({
                    ...prev,
                    [name]: cleanedValue,
                }));
            } else {
                 setFormData(prev => ({
                    ...prev,
                    [name]: value, // Terms is a string (from the select dropdown)
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value,
            }));
        }
    };
    // Handle change for the toggle switches (update boolean state)
   // Handle change for the toggle switches (update boolean state)
    const handleSettingsChange = (e) => {
        const { id, checked } = e.target;
        
        setClientSettings(prev => ({
            ...prev,
            [id]: checked,
        }));
        
        // Reset custom field value if the toggle is turned OFF
        if (!checked) {
            if (id === 'laborRateOverride') {
                setFormData(prev => ({ ...prev, customLaborRate: '' }));
            } else if (id === 'partsMarkupOverride') {
                setFormData(prev => ({ ...prev, customMarkupPercentage: '' }));
            } else if (id === 'paymentTermsOverride') {
                setFormData(prev => ({ ...prev, customPaymentTerms: '' })); // Reset selection
            }
        }
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

    // 🚩 UPDATED: Enforce that the phone number must be provided and not just the country code.
    const isPhoneValid = (value, country) => {
        const MIN_LOCAL_DIGITS = 6; 
        const MAX_TOTAL_DIGITS = 15; 
        
        // 1. Check for required field
        if (!value || value.length <= country.dialCode.length) {
            setPhoneError('Primary Phone Number is required.'); // Set error for required
            return 'Primary Phone Number is required.';
        }

        const localNumber = value.slice(country.dialCode.length);
        
        // Basic check for leading zero in local number (common requirement in TZ)
        if (localNumber.length > 0 && localNumber.startsWith('0')) {
            // Allow this to pass to let the backend validate if this is truly an error in the API schema.
            // For now, only check length.
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
    
    // Helper function to convert empty string to null for API
    const formatValueForApi = (value) => value.trim() === '' ? null : value.trim();


    // API Submission and Error Handling Logic
    const handleSubmit = async (e) => { 
        e.preventDefault();
        
        // Check 1: Phone number client-side validation
        // We use isPhoneValid to check if the current state of formData.phone is valid
        // Check 1: Phone number client-side validation
        const cleanPhoneNumber = String(formData.phone || '').replace('+', '');

        if (isPhoneValid(cleanPhoneNumber, { dialCode: countryCode, countryCode: countryCode }) !== true) {
            // isPhoneValid already set the error state
            showToastNotification("Please correct the **Primary Phone Number** field.", 'error');
            return; 
        }
        
        // Final sanity check for required fields based on mode
        let validationError = null;
        
        if (nameMode === MODE_INDIVIDUAL && (!formData.firstName || !formData.lastName)) {
            validationError = "First Name and Last Name are required for an Individual client.";
        } else if (nameMode === MODE_COMPANY && !formData.companyName) {
            validationError = "Company Name is required for a Company client.";
        } 
        
       if (!formData.email || formData.email.trim() === '') {
             validationError = validationError ? 
                               `${validationError} Also, Email Address is required.` : 
                               "Email Address is required.";
        }
        
        // 💰 Check if Custom Payment Terms are overridden but not selected
        if (clientSettings.paymentTermsOverride && !formData.customPaymentTerms) {
            validationError = validationError ? 
                               `${validationError} Also, a Custom Payment Term must be selected.` : 
                               "A Custom Payment Term must be selected when the override is active.";
        }
        
        if (validationError) {
            // NOTE: Keep error notification here for client-side validation failures
            showToastNotification(validationError, 'error'); 
            return;
        } 
        
        setIsLoading(true);
        setError(null);
        
        // Prepare data for API (Merged formData and clientSettings)
        const dataToSend = {
            ...(formData.id && { id: formData.id }),
            // Identity
            first_name: formData.clientType === 'Individual' ? formatValueForApi(formData.firstName) : null,
            last_name: formData.clientType === 'Individual' ? formatValueForApi(formData.lastName) : null,
            company_name: formData.clientType === 'Company' ? formatValueForApi(formData.companyName) : null,
            
            // Contact
            phone_number: formatValueForApi(formData.phone),
            email: formatValueForApi(formData.email), 
            
            // Address
            address: formatValueForApi(formData.addressLine1), 
            city: formatValueForApi(formData.city),
            state: formatValueForApi(formData.state),
            zip_code: formatValueForApi(formData.zip), 
            
            // Segmentation
            client_type: formData.clientType, 
            tax_id: formatValueForApi(formData.taxId), 
            notes: formatValueForApi(formData.notes),
            
            // Settings (Booleans)
            is_tax_exempt: clientSettings.isTaxExempt,
            apply_discount: clientSettings.applyDiscount,
            labor_rate_override: clientSettings.laborRateOverride,
            parts_markup_override: clientSettings.partsMarkupOverride,
            payment_terms_override: clientSettings.paymentTermsOverride,
            
            // 🚀 NEW CUSTOM VALUE FIELDS (Only send if the toggle is ON, otherwise send null or let backend clean)
            custom_labor_rate: clientSettings.laborRateOverride 
                ? formatValueForApi(formData.customLaborRate) : null,
                
            custom_markup_percentage: clientSettings.partsMarkupOverride
                ? formatValueForApi(formData.customMarkupPercentage) : null,
                
            custom_payment_terms: clientSettings.paymentTermsOverride
                ? formatValueForApi(formData.customPaymentTerms) : null,
        };
        
        // Ensure decimal fields are sent as null if they are empty strings
        if (dataToSend.custom_labor_rate === '') dataToSend.custom_labor_rate = null;
        if (dataToSend.custom_markup_percentage === '') dataToSend.custom_markup_percentage = null;

        const isEdit = !!formData.id;
        const url = isEdit ? `/clients/${formData.id}/` : '/clients/';
        const method = isEdit ? 'put' : 'post'; 

        try {
            // API Call Attempt
            const response = await apiClient({
                method: method,
                url: url,
                data: dataToSend,
            });

            // SUCCESS BLOCK
            const savedClientData = response.data;
            const successMessage = isEdit 
                ? `Successfully updated client: **${getClientName(savedClientData)}**.`
                : `Successfully added new client: **${getClientName(savedClientData)}**!`;
            
            // 🚨 SUCCESS NOTIFICATION REMOVED FROM HERE
            // The notification logic is now only passed to the next route via state
            navigate('/clients', { state: { successMessage: successMessage } }); 

        } catch (err) {
            // ERROR BLOCK
            const errorData = err.response?.data;
            let errorMessage = "An unknown error occurred while saving the client.";

            console.error("API Validation Error Response:", errorData); 

            if (err.response && err.response.status === 400 && errorData) {
                // Handle specific field errors returned by the backend
                if (typeof errorData === 'object' && Object.keys(errorData).length > 0) {
                    // Try to extract the most relevant error
                    const firstKey = Object.keys(errorData)[0];
                    const firstError = Array.isArray(errorData[firstKey]) ? errorData[firstKey][0] : errorData[firstKey];
                    
                    if (firstKey) {
                        // Attempt to map snake_case keys back to user-friendly names
                        let fieldName = firstKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                        
                        // Check for specific override errors and adjust message
                        if (firstKey === 'custom_labor_rate' && clientSettings.laborRateOverride) {
                            fieldName = 'Custom Labor Rate';
                        } else if (firstKey === 'custom_markup_percentage' && clientSettings.partsMarkupOverride) {
                            fieldName = 'Custom Markup Percentage';
                        } else if (firstKey === 'custom_payment_terms' && clientSettings.paymentTermsOverride) {
                            fieldName = 'Custom Payment Terms';
                        } else if (firstKey === 'email') {
                            fieldName = 'Email';
                        } else if (firstKey === 'phone_number') {
                             fieldName = 'Phone Number';
                        }
                        
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

            // NOTE: Keep error notification here for API failures
            showToastNotification(errorMessage, 'error'); 
            
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCancel = () => {
        navigate('/clients');
    };
    
    // 🚗 NEW HANDLER: Directs to the Vehicle Form
    const handleAddVehicleClick = (e) => {
        e.preventDefault();
        
        // Check 1: Must be in edit mode (client must already exist and have an ID)
        if (isEditMode && clientId) {
            // Navigate to the vehicle creation form, passing the client ID via the URL
            navigate(`/vehicles/new/${clientId}`);
        } else {
             // NOTE: Keep error notification here for user action requirement
             showToastNotification("Please save the client details before adding a vehicle.", 'error'); 
        }
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

    // 🏆 UPDATED TITLE LOGIC FOR BETTER TEXT
    const formTitle = isEditMode 
        ? `Edit Client: ${nameMode === MODE_COMPANY ? formData.companyName : `${formData.firstName} ${formData.lastName}`}` 
        : 'New client';

    return (
        <div className="client-form-container">
            {/* Notification Toast (Only shows for errors/warnings in this component) */}
            {notification.show && (
                <div className={`toast-notification ${notification.type}`}>
                    {notification.type === 'success' ? <FaCheckCircle /> : <FaExclamationTriangle />}
                    <span>{notification.message}</span>
                </div>
            )}
            
            <header className="page-header">
                <h2>{formTitle}</h2>
                {/* 🚗 ADD VEHICLE BUTTON (Only visible in Edit Mode) */}
                {isEditMode && (
                    <button 
                        className="btn-primary-action" 
                        onClick={handleAddVehicleClick}
                        style={{ marginLeft: 'auto', backgroundColor: SUCCESS_GREEN }} 
                        title="Add Vehicle to this Client"
                    >
                        <FaCar style={{ marginRight: '5px' }}/> 
                        <FaPlusCircle style={{ position: 'absolute', top: 0, right: 0, fontSize: '0.8em', color: 'white', backgroundColor: SUCCESS_GREEN, borderRadius: '50%' }}/>
                        Add Vehicle
                    </button>
                )}
            </header>
            
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
                        <label htmlFor="phone">Primary Phone *</label> {/* 🚩 REQUIRED LABEL ADDED */}
                        <PhoneInput
                            country={countryCode} 
                            value={formData.phone ? formData.phone.slice(1) : ''}
                            onChange={handlePhoneChange} 
                            isValid={isPhoneValid}
                            inputProps={{
                                name: 'phone',
                                required: true, // 🚩 SET REQUIRED TRUE HERE
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
                    {/* CITY DROPDOWN */}
                    <div className="form-group">
                        <label htmlFor="city">City</label>
                        <select 
                            id="city" 
                            name="city" 
                            onChange={handleChange} 
                            value={formData.city || ''} 
                            style={{ direction: 'ltr' }} 
                        >
                            <option value="">-- Select City (Optional) --</option>
                            {TANZANIA_CITIES.map(city => (
                                <option key={city} value={city}>
                                    {city}
                                </option>
                            ))}
                        </select>
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
                
                
                {/* 4. Pricing & Payment Settings */}
                <h4 className="form-section-title"><FaTools /> Custom Client Settings</h4>
                
                <div className="form-grid-1">
                    <div className="form-group notes-group">
                        <label htmlFor="notes"><FaFileAlt /> Internal Notes</label>
                        <textarea 
                            id="notes" 
                            name="notes" 
                            rows="3" 
                            placeholder="Add internal notes about this client (e.g., preferred contact method, pricing agreements, historical details)."
                            onChange={handleChange} 
                            value={formData.notes}
                        ></textarea>
                    </div>
                </div>
                
                <div className="settings-grid">
                    {/* --- TOGGLES --- */}
                    <div className="settings-toggles">
                        <ToggleSwitch
                            id="isTaxExempt"
                            label="Tax Exempt Status"
                            description="Toggle if this client should not be charged sales tax on parts or labor."
                            checked={clientSettings.isTaxExempt}
                            onChange={handleSettingsChange}
                        />
                        <ToggleSwitch
                            id="applyDiscount"
                            label="Apply Default Discount"
                            description="Apply a system-wide default discount to this client's invoices."
                            checked={clientSettings.applyDiscount}
                            onChange={handleSettingsChange}
                        />
                        <ToggleSwitch
                            id="laborRateOverride"
                            label="Override Labor Rate"
                            description="Use a specific, custom labor rate for this client."
                            checked={clientSettings.laborRateOverride}
                            onChange={handleSettingsChange}
                        />
                        <ToggleSwitch
                            id="partsMarkupOverride"
                            label="Override Parts Markup"
                            description="Use a specific, custom percentage markup for parts."
                            checked={clientSettings.partsMarkupOverride}
                            onChange={handleSettingsChange}
                        />
                        <ToggleSwitch
                            id="paymentTermsOverride"
                            label="Override Payment Terms"
                            description="Set custom payment terms (e.g., Net 7, Net 30) for this client."
                            checked={clientSettings.paymentTermsOverride}
                            onChange={handleSettingsChange}
                        />
                    </div>
                    
                    {/* --- CUSTOM VALUE INPUTS (CONDITIONAL) --- */}
                    <div className="custom-value-inputs">
                        {/* Custom Labor Rate Input */}
                        <div className={`form-group ${clientSettings.laborRateOverride ? 'active' : 'inactive'}`}>
                            <label htmlFor="customLaborRate">
                                <FaDollarSign /> Custom Labor Rate (per hour)
                            </label>
                            <input
                                type="text" 
                                id="customLaborRate"
                                name="customLaborRate" 
                                placeholder="e.g., 50.00"
                                onChange={handleChange}
                                value={formData.customLaborRate}
                                disabled={!clientSettings.laborRateOverride}
                                required={clientSettings.laborRateOverride}
                                style={{ 
                                    opacity: clientSettings.laborRateOverride ? 1 : 0.5,
                                    transition: 'opacity 0.3s'
                                }}
                            />
                        </div>

                        {/* Custom Markup Percentage Input */}
                        <div className={`form-group ${clientSettings.partsMarkupOverride ? 'active' : 'inactive'}`}>
                            <label htmlFor="customMarkupPercentage">
                                <FaPercent /> Custom Markup Percentage 
                            </label>
                            <input
                                type="text" 
                                id="customMarkupPercentage"
                                name="customMarkupPercentage" 
                                placeholder="e.g., 10"
                                onChange={handleChange}
                                value={formData.customMarkupPercentage}
                                disabled={!clientSettings.partsMarkupOverride}
                                required={clientSettings.partsMarkupOverride}
                                style={{ 
                                    opacity: clientSettings.partsMarkupOverride ? 1 : 0.5,
                                    transition: 'opacity 0.3s'
                                }}
                            />
                        </div>
                        
                        {/* Custom Payment Terms Dropdown */}
                        <div className={`form-group ${clientSettings.paymentTermsOverride ? 'active' : 'inactive'}`}>
                            <label htmlFor="customPaymentTerms">
                                <FaTags /> Custom Payment Terms *
                            </label>
                            <select
                                id="customPaymentTerms"
                                name="customPaymentTerms"
                                onChange={handleChange}
                                value={formData.customPaymentTerms}
                                disabled={!clientSettings.paymentTermsOverride}
                                required={clientSettings.paymentTermsOverride}
                                style={{ 
                                    opacity: clientSettings.paymentTermsOverride ? 1 : 0.5,
                                    transition: 'opacity 0.3s'
                                }}
                            >
                                <option value="">-- Select Terms --</option>
                                {PAYMENT_TERMS_OPTIONS.map(term => (
                                    <option key={term} value={term}>{term}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                
                {/* --- Form Actions --- */}
                <footer className="form-actions">
                    <button 
                        type="button" 
                        onClick={handleCancel} 
                        className="btn-cancel" 
                        disabled={isLoading}
                    >
                        <FaTimes style={{ marginRight: '5px' }} /> Cancel
                    </button>
                    <button 
                        type="submit" 
                        className="btn-save" 
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <FaSpinner className="spinner-icon" /> Saving...
                            </>
                        ) : (
                            <>
                                <FaSave style={{ marginRight: '5px' }} /> 
                                {isEditMode ? 'Update Client' : 'Save Client'}
                            </>
                        )}
                    </button>
                </footer>
            </form>
            
            
            {/* --- STYLES INTEGRATED FOR A SMART, MODERN LOOK --- */}
            <style jsx>{`
                /* ----------------------------------------------------------------- */
                /* Base Styles & Typography */
                /* ----------------------------------------------------------------- */
                
                .client-form-container {
                    max-width: 1900px;
                    margin: 20px auto;
                    padding: 0 20px;
                    font-family: 'Inter', 'Roboto', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
                }
                
                .page-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 0 15px 0;
                    border-bottom: 1px solid #e0e0e0;
                    margin-bottom: 25px;
                }
                .page-header h2 {
                    font-size: 24px; 
                    font-weight: 700; 
                    color: #333333;
                }
                body.dark-theme .page-header {
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                }
                body.dark-theme .page-header h2 {
                    color: ${TEXT_PRIMARY_DARK};
                }
                
                .form-card {
                    background-color: #ffffff;
                    padding: 30px;
                    border-radius: 12px; 
                    box-shadow: 0 6px 20px rgba(0,0,0,0.08); 
                    border: 1px solid #e0e0e0;
                }
                body.dark-theme .form-card {
                    background-color: ${BG_CARD_DARK};
                    box-shadow: 0 6px 20px rgba(0,0,0,0.3);
                    border: 1px solid ${INPUT_BORDER_DARK};
                }

                .form-section-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: ${PRIMARY_BLUE};
                    margin-top: 30px;
                    margin-bottom: 15px;
                    padding-bottom: 5px;
                    border-bottom: 2px solid ${PRIMARY_BLUE}10;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                body.dark-theme .form-section-title {
                    color: ${PRIMARY_BLUE};
                    border-bottom: 2px solid ${PRIMARY_BLUE}30;
                }
                
                .form-grid-1, .form-grid-2, .form-grid-3 {
                    display: grid;
                    gap: 20px;
                    margin-bottom: 20px;
                }
                .form-grid-1 { grid-template-columns: 1fr; }
                .form-grid-2 { grid-template-columns: 1fr 1fr; }
                .form-grid-3 { grid-template-columns: repeat(3, 1fr); }
                
                @media (max-width: 768px) {
                    .form-grid-2, .form-grid-3 {
                        grid-template-columns: 1fr;
                    }
                }
                
                .form-group label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 500;
                    color: #555555;
                    font-size: 14px;
                }
                body.dark-theme .form-group label {
                    color: ${TEXT_MUTED_DARK};
                }

                .form-group input, .form-group select, .form-group textarea {
                    width: 100%;
                    padding: 10px 12px;
                    border: 1px solid #dddddd;
                    border-radius: 6px;
                    font-size: 15px;
                    box-sizing: border-box;
                    transition: border-color 0.2s, box-shadow 0.2s;
                }
                
                body.dark-theme .form-group input, 
                body.dark-theme .form-group select, 
                body.dark-theme .form-group textarea {
                    background-color: ${TOP_NAV_COLOR};
                    border: 1px solid ${INPUT_BORDER_DARK};
                    color: ${TEXT_PRIMARY_DARK};
                }
                
                .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
                    border-color: ${PRIMARY_BLUE};
                    box-shadow: 0 0 0 3px ${PRIMARY_BLUE}30;
                    outline: none;
                }
                
                /* Phone Input specific styling adjustments */
                .phone-validation-error {
                    color: ${DANGER_RED};
                    font-size: 13px;
                    margin-top: 5px;
                    font-weight: 500;
                }
                
                /* Name Mode Selector */
                .name-mode-selector select {
                    background-color: #f7f9fa;
                }
                body.dark-theme .name-mode-selector select {
                    background-color: #38465b;
                }
                .mode-description {
                    font-size: 13px;
                    color: #888;
                    margin-top: 5px;
                }
                body.dark-theme .mode-description {
                    color: ${TEXT_MUTED_DARK};
                }
                
                /* Form Actions */
                .form-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 15px;
                    padding-top: 30px;
                    border-top: 1px solid #eee;
                    margin-top: 30px;
                }
                body.dark-theme .form-actions {
                    border-top: 1px solid ${INPUT_BORDER_DARK};
                }

                .btn-save, .btn-cancel {
                    padding: 10px 20px;
                    border-radius: 6px;
                    font-weight: 600;
                    font-size: 15px;
                    cursor: pointer;
                    transition: background-color 0.2s;
                    display: flex;
                    align-items: center;
                }

                .btn-save {
                    background-color: ${PRIMARY_BLUE};
                    color: white;
                    border: 1px solid ${PRIMARY_BLUE};
                }
                .btn-save:hover {
                    background-color: #4a8ad8;
                    border-color: #4a8ad8;
                }

                .btn-cancel {
                    background-color: #f0f0f0;
                    color: #555;
                    border: 1px solid #ccc;
                }
                .btn-cancel:hover {
                    background-color: #e0e0e0;
                }
                body.dark-theme .btn-cancel {
                    background-color: ${INPUT_BORDER_DARK};
                    color: ${TEXT_MUTED_DARK};
                    border-color: ${INPUT_BORDER_DARK};
                }

                .spinner-icon {
                    animation: spin 1s linear infinite;
                    margin-right: 5px;
                }
                
                /* ----------------------------------------------------------------- */
                /* Toggle Switch & Settings Grid Styles */
                /* ----------------------------------------------------------------- */
                
                .settings-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 40px;
                    margin-top: 20px;
                }
                
                @media (max-width: 992px) {
                    .settings-grid {
                        grid-template-columns: 1fr;
                        gap: 20px;
                    }
                }
                
                .settings-toggles {
                    border-right: 1px solid #f0f0f0;
                    padding-right: 40px;
                }
                @media (max-width: 992px) {
                    .settings-toggles {
                        border-right: none;
                        border-bottom: 1px solid #f0f0f0;
                        padding-right: 0;
                        padding-bottom: 20px;
                    }
                }
                body.dark-theme .settings-toggles,
                @media (max-width: 992px) {
                    body.dark-theme .settings-toggles {
                        border-color: ${INPUT_BORDER_DARK};
                    }
                }

                .toggle-setting-item {
                    margin-bottom: 15px;
                    border-bottom: 1px solid #f9f9f9;
                    padding-bottom: 15px;
                }
                .toggle-setting-item:last-child {
                    border-bottom: none;
                }
                body.dark-theme .toggle-setting-item {
                    border-color: ${INPUT_BORDER_DARK};
                }

                .toggle-label {
                    display: flex;
                    align-items: flex-start;
                    cursor: pointer;
                    user-select: none;
                }

                .toggle-switch-wrap {
                    position: relative;
                    min-width: 50px;
                    height: 24px;
                    margin-right: 15px;
                    flex-shrink: 0;
                }

                .toggle-checkbox {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }

                .toggle-slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #ccc;
                    transition: .4s;
                    border-radius: 34px;
                }

                .toggle-slider:before {
                    position: absolute;
                    content: "";
                    height: 16px;
                    width: 16px;
                    left: 4px;
                    bottom: 4px;
                    background-color: white;
                    transition: .4s;
                    border-radius: 50%;
                }
                
                .toggle-checkbox:checked + .toggle-slider {
                    background-color: ${PRIMARY_BLUE};
                }

                .toggle-checkbox:checked + .toggle-slider:before {
                    transform: translateX(26px);
                }

                .toggle-text-content {
                    flex-grow: 1;
                }

                .toggle-title {
                    font-weight: 600;
                    color: #333;
                    font-size: 15px;
                    display: block;
                    line-height: 24px; 
                }
                body.dark-theme .toggle-title {
                    color: ${TEXT_PRIMARY_DARK};
                }

                .toggle-description {
                    font-size: 13px;
                    color: #777;
                    margin: 0;
                }
                body.dark-theme .toggle-description {
                    color: ${TEXT_MUTED_DARK};
                }

                .custom-value-inputs {
                    padding-left: 20px;
                }
                @media (max-width: 992px) {
                    .custom-value-inputs {
                        padding-left: 0;
                    }
                }
                
                .custom-value-inputs .form-group {
                    margin-bottom: 25px;
                    transition: opacity 0.3s;
                }
                
                .custom-value-inputs .form-group.inactive {
                    opacity: 0.5;
                    pointer-events: none; /* Disable interaction when inactive */
                }
                
                /* Add Vehicle Button Specific Styling */
                .btn-primary-action {
                    position: relative; /* For the small plus icon positioning */
                    padding-right: 25px; /* Added padding to accommodate the plus icon */
                }


                /* ----------------------------------------------------------------- */
                /* Toast Notification Styles (Top Right) */
                /* ----------------------------------------------------------------- */
                .toast-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 15px 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    color: white;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-weight: 600;
                    font-size: 15px;
                    z-index: 1050;
                    animation: slideInRight 0.5s ease-out, fadeOut 0.5s ease-in 3.5s forwards;
                }

                .toast-notification.success {
                    background-color: ${SUCCESS_GREEN};
                }

                .toast-notification.error {
                    background-color: ${DANGER_RED};
                }

                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default ClientForm;