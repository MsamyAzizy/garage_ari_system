// src/components/RequestServiceForm.js

import React, { useState, useEffect } from 'react';
import { 
    FaCheckCircle, 
    FaExclamationCircle, 
    FaUser, 
    FaCar, 
    FaTools, 
    FaDollarSign,
    FaArrowLeft,
    FaSearch,
    FaClock,
    FaBolt,
    FaCog,
    FaWrench,
    FaTachometerAlt,
    FaPlus,
    FaEdit
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utils/apiClient';

// Modern color palette matching your sidebar
const COLORS = {
    primary: '#d16a33',
    primaryDark: '#b3592b',
    secondary: '#5d9cec',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    dark: '#1f2937',
    light: '#f8fafc',
    white: '#ffffff',
    gray: {
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827'
    }
};

const SERVICE_OPTIONS = [
    { value: 'emergency', label: 'Emergency Repair', icon: FaBolt, color: COLORS.danger, description: 'Critical safety issues requiring immediate attention' },
    { value: 'scheduled', label: 'Scheduled Maintenance', icon: FaClock, color: COLORS.secondary, description: 'Regular maintenance and service appointments' },
    { value: 'diagnostic', label: 'Diagnostic Service', icon: FaSearch, color: COLORS.warning, description: 'Comprehensive vehicle diagnosis and analysis' },
    { value: 'warranty', label: 'Warranty Work', color: COLORS.success, description: 'Manufacturer warranty claims and repairs' },
];

const SERVICE_CATEGORIES = [
    { value: 'engine', label: 'Engine & Transmission', icon: FaCog, color: '#ef4444' },
    { value: 'brakes', label: 'Brakes & Suspension', icon: FaTachometerAlt, color: '#8b5cf6' },
    { value: 'electrical', label: 'Electrical Systems', icon: FaBolt, color: '#f59e0b' },
    { value: 'ac', label: 'Air Conditioning', icon: '❄️', color: '#06b6d4' },
    { value: 'tires', label: 'Tire Services', icon: '🛞', color: '#84cc16' },
    { value: 'oil', label: 'Oil & Maintenance', icon: FaWrench, color: '#14b8a6' },
    { value: 'body', label: 'Body Work', icon: '🚗', color: '#f97316' },
];

const RequestServiceForm = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [customers, setCustomers] = useState([]);
    const [loadingCustomers, setLoadingCustomers] = useState(true);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customerType, setCustomerType] = useState('existing'); // 'existing' or 'new'

    const [formData, setFormData] = useState({
        // Customer Information
        customerType: 'existing',
        customerId: '',
        customerName: '',
        email: '',
        phone: '',
        preferredContact: 'phone',
        
        // Vehicle Information
        vehicleId: '',
        make: '',
        model: '',
        year: '',
        vin: '',
        mileage: '',
        licensePlate: '',
        vehicleType: '',
        
        // Service Details
        serviceType: 'scheduled',
        serviceCategory: 'oil',
        priority: 'medium',
        serviceDescription: '',
        customerConcerns: '',
        
        // Additional Info
        requestedDate: '',
        specialInstructions: '',
    });

    // Fetch customers from API
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                setLoadingCustomers(true);
                const response = await apiClient.get('/clients/');
                const customerData = response.data.results || response.data || [];
                
                const formattedCustomers = customerData.map(client => ({
                    id: client.id,
                    name: client.full_name || `${client.first_name || ''} ${client.last_name || ''}`.trim() || client.company_name || 'Unnamed Client',
                    email: client.email || '',
                    phone: client.phone_number || '',
                    clientType: client.client_type || 'Individual'
                }));
                
                setCustomers(formattedCustomers);
            } catch (error) {
                console.error('Failed to fetch customers:', error);
                setCustomers([]);
            } finally {
                setLoadingCustomers(false);
            }
        };

        fetchCustomers();
    }, []);

    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 4));
            setSubmitStatus(null);
        } else {
            setSubmitStatus('error');
        }
    };

    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCustomerTypeChange = (type) => {
        setCustomerType(type);
        setSelectedCustomer(null);
        setSearchQuery('');
        
        if (type === 'new') {
            setFormData(prev => ({
                ...prev,
                customerId: '',
                customerName: '',
                email: '',
                phone: '',
                customerType: 'new'
            }));
        }
    };

    const handleCustomerSelect = (customer) => {
        setSelectedCustomer(customer);
        setFormData(prev => ({
            ...prev,
            customerId: customer.id,
            customerName: customer.name,
            email: customer.email,
            phone: customer.phone,
            customerType: 'existing'
        }));
        setSearchQuery('');
    };

    const handleNewCustomer = () => {
        navigate('/clients/add');
    };

    const handleEditCustomer = () => {
        if (selectedCustomer) {
            navigate(`/clients/${selectedCustomer.id}`);
        }
    };

    const handleServiceTypeSelect = (serviceType) => {
        setFormData(prev => ({
            ...prev,
            serviceType,
            priority: SERVICE_OPTIONS.find(s => s.value === serviceType)?.priority || 'medium'
        }));
    };

    const handleCategorySelect = (category) => {
        setFormData(prev => ({
            ...prev,
            serviceCategory: category
        }));
    };

    const validateStep = (step) => {
        switch (step) {
            case 1:
                if (customerType === 'existing') {
                    return selectedCustomer !== null;
                } else {
                    return formData.customerName && formData.phone;
                }
            case 2:
                return formData.make && formData.model && formData.mileage;
            case 3:
                return formData.serviceDescription && formData.customerConcerns;
            case 4:
                return true;
            default:
                return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateStep(4)) {
            setSubmitStatus('error');
            return;
        }

        setIsSubmitting(true);

        try {
            // API call would go here
            await new Promise(resolve => setTimeout(resolve, 1500));
            setSubmitStatus('success');
            
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (error) {
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getFormStatusMessage = () => {
        if (submitStatus === 'success') {
            return (
                <div className="form-status success">
                    <FaCheckCircle />
                    <div>
                        <strong>Service Request Created Successfully!</strong>
                        <span>Redirecting to dashboard...</span>
                    </div>
                </div>
            );
        }
        if (submitStatus === 'error') {
            return (
                <div className="form-status error">
                    <FaExclamationCircle />
                    <div>
                        <strong>Please complete all required fields</strong>
                        <span>Check the form and try again</span>
                    </div>
                </div>
            );
        }
        return null;
    };

    const StepIndicator = () => (
        <div className="step-indicator">
            {[1, 2, 3, 4].map((step) => (
                <div key={step} className={`step ${step === currentStep ? 'active' : ''} ${step < currentStep ? 'completed' : ''}`}>
                    <div className="step-number">
                        {step < currentStep ? <FaCheckCircle /> : step}
                    </div>
                    <div className="step-label">
                        {step === 1 && 'Customer'}
                        {step === 2 && 'Vehicle'}
                        {step === 3 && 'Service'}
                        {step === 4 && 'Review'}
                    </div>
                    {step < 4 && <div className="step-connector"></div>}
                </div>
            ))}
        </div>
    );

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="step-content">
                        <div className="step-header">
                            <div className="step-icon">
                                <FaUser />
                            </div>
                            <div>
                                <h3>Customer Information</h3>
                                <p>Select customer type and provide details</p>
                            </div>
                        </div>

                        <div className="form-section">
                            {/* Customer Type Selection */}
                            <div className="customer-type-section">
                                <label className="section-label">Select Customer Type</label>
                                <div className="radio-group horizontal">
                                    <label className="radio-option">
                                        <input
                                            type="radio"
                                            name="customerType"
                                            value="existing"
                                            checked={customerType === 'existing'}
                                            onChange={() => handleCustomerTypeChange('existing')}
                                        />
                                        <span className="radio-custom"></span>
                                        <div className="radio-content">
                                            <FaUser className="radio-icon" />
                                            <div>
                                                <strong>Existing Customer</strong>
                                                <span>Select from your customer database</span>
                                            </div>
                                        </div>
                                    </label>
                                    <label className="radio-option">
                                        <input
                                            type="radio"
                                            name="customerType"
                                            value="new"
                                            checked={customerType === 'new'}
                                            onChange={() => handleCustomerTypeChange('new')}
                                        />
                                        <span className="radio-custom"></span>
                                        <div className="radio-content">
                                            <FaPlus className="radio-icon" />
                                            <div>
                                                <strong>New Customer</strong>
                                                <span>Add a new customer to the system</span>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Existing Customer Section */}
                            {customerType === 'existing' && (
                                <div className="existing-customer-section">
                                    <div className="search-section">
                                        <label>Search Existing Customers</label>
                                        <div className="search-input-wrapper">
                                            <FaSearch className="search-icon" />
                                            <input
                                                type="text"
                                                placeholder="Type to search customers by name, phone, or email..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="search-input"
                                            />
                                        </div>
                                        
                                        {/* Show search results when typing */}
                                        {searchQuery && (
                                            <div className="search-results-container">
                                                {loadingCustomers ? (
                                                    <div className="loading-customers">
                                                        <div className="spinner small"></div>
                                                        <span>Loading customers...</span>
                                                    </div>
                                                ) : filteredCustomers.length > 0 ? (
                                                    <div className="search-results">
                                                        <div className="results-header">
                                                            <span>Found {filteredCustomers.length} customer(s)</span>
                                                        </div>
                                                        {filteredCustomers.map(customer => (
                                                            <div 
                                                                key={customer.id} 
                                                                className={`customer-result ${selectedCustomer?.id === customer.id ? 'selected' : ''}`}
                                                                onClick={() => handleCustomerSelect(customer)}
                                                            >
                                                                <div className="customer-avatar">
                                                                    <FaUser />
                                                                </div>
                                                                <div className="customer-info">
                                                                    <strong>{customer.name}</strong>
                                                                    <div className="customer-contacts">
                                                                        <span>{customer.phone}</span>
                                                                        <span>{customer.email}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="customer-type-badge">
                                                                    {customer.clientType}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="no-results">
                                                        <p>No customers found matching "{searchQuery}"</p>
                                                        <button 
                                                            type="button" 
                                                            className="btn-primary outline"
                                                            onClick={() => handleCustomerTypeChange('new')}
                                                        >
                                                            <FaPlus />
                                                            Add New Customer Instead
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Selected Customer Display */}
                                        {selectedCustomer && (
                                            <div className="selected-customer-card">
                                                <div className="customer-header">
                                                    <h4>Selected Customer</h4>
                                                    <button 
                                                        type="button" 
                                                        className="btn-edit-customer"
                                                        onClick={handleEditCustomer}
                                                    >
                                                        <FaEdit />
                                                        Edit
                                                    </button>
                                                </div>
                                                <div className="customer-details">
                                                    <div className="detail-item">
                                                        <strong>Name:</strong>
                                                        <span>{selectedCustomer.name}</span>
                                                    </div>
                                                    <div className="detail-item">
                                                        <strong>Phone:</strong>
                                                        <span>{selectedCustomer.phone}</span>
                                                    </div>
                                                    <div className="detail-item">
                                                        <strong>Email:</strong>
                                                        <span>{selectedCustomer.email}</span>
                                                    </div>
                                                    <div className="detail-item">
                                                        <strong>Type:</strong>
                                                        <span className="customer-type">{selectedCustomer.clientType}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* No search - show recent customers */}
                                        {!searchQuery && !selectedCustomer && customers.length > 0 && (
                                            <div className="recent-customers">
                                                <div className="section-label">Recent Customers</div>
                                                <div className="recent-customers-grid">
                                                    {customers.slice(0, 6).map(customer => (
                                                        <div 
                                                            key={customer.id} 
                                                            className="recent-customer-card"
                                                            onClick={() => handleCustomerSelect(customer)}
                                                        >
                                                            <div className="customer-avatar small">
                                                                <FaUser />
                                                            </div>
                                                            <div className="customer-info">
                                                                <strong>{customer.name}</strong>
                                                                <span>{customer.phone}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* New Customer Section */}
                            {customerType === 'new' && (
                                <div className="new-customer-section">
                                    <div className="new-customer-header">
                                        <h4>Add New Customer Details</h4>
                                        <p>Enter information for the new customer</p>
                                    </div>
                                    <div className="form-grid">
                                        <div className="form-field">
                                            <label htmlFor="customerName">Full Name *</label>
                                            <input
                                                type="text"
                                                id="customerName"
                                                name="customerName"
                                                value={formData.customerName}
                                                onChange={handleChange}
                                                placeholder="Enter customer full name"
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
                                                placeholder="customer@example.com"
                                            />
                                        </div>

                                        <div className="form-field">
                                            <label htmlFor="phone">Phone Number *</label>
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
                                            <label htmlFor="preferredContact">Preferred Contact Method</label>
                                            <select
                                                id="preferredContact"
                                                name="preferredContact"
                                                value={formData.preferredContact}
                                                onChange={handleChange}
                                            >
                                                <option value="phone">Phone Call</option>
                                                <option value="email">Email</option>
                                                <option value="sms">Text Message</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div className="new-customer-actions">
                                        <button 
                                            type="button" 
                                            className="btn-primary large"
                                            onClick={handleNewCustomer}
                                        >
                                            <FaPlus />
                                            Open Full Customer Form
                                        </button>
                                        <p className="helper-text">
                                            Or continue with basic information above and save the customer later
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="step-content">
                        <div className="step-header">
                            <div className="step-icon">
                                <FaCar />
                            </div>
                            <div>
                                <h3>Vehicle Information</h3>
                                <p>Enter vehicle details for service</p>
                            </div>
                        </div>

                        <div className="form-section">
                            <div className="form-grid">
                                <div className="form-field">
                                    <label htmlFor="make">Vehicle Make *</label>
                                    <input
                                        type="text"
                                        id="make"
                                        name="make"
                                        value={formData.make}
                                        onChange={handleChange}
                                        placeholder="Toyota, Honda, Ford, etc."
                                        required
                                    />
                                </div>

                                <div className="form-field">
                                    <label htmlFor="model">Model *</label>
                                    <input
                                        type="text"
                                        id="model"
                                        name="model"
                                        value={formData.model}
                                        onChange={handleChange}
                                        placeholder="Camry, Civic, F-150, etc."
                                        required
                                    />
                                </div>

                                <div className="form-field">
                                    <label htmlFor="year">Year</label>
                                    <input
                                        type="number"
                                        id="year"
                                        name="year"
                                        value={formData.year}
                                        onChange={handleChange}
                                        placeholder="2023"
                                        min="1990"
                                        max={new Date().getFullYear() + 1}
                                    />
                                </div>

                                <div className="form-field">
                                    <label htmlFor="vin">VIN Number</label>
                                    <input
                                        type="text"
                                        id="vin"
                                        name="vin"
                                        value={formData.vin}
                                        onChange={handleChange}
                                        placeholder="Vehicle Identification Number"
                                    />
                                </div>

                                <div className="form-field">
                                    <label htmlFor="mileage">Current Mileage *</label>
                                    <input
                                        type="number"
                                        id="mileage"
                                        name="mileage"
                                        value={formData.mileage}
                                        onChange={handleChange}
                                        placeholder="45000"
                                        required
                                    />
                                </div>

                                <div className="form-field">
                                    <label htmlFor="licensePlate">License Plate</label>
                                    <input
                                        type="text"
                                        id="licensePlate"
                                        name="licensePlate"
                                        value={formData.licensePlate}
                                        onChange={handleChange}
                                        placeholder="State and plate number"
                                    />
                                </div>

                                <div className="form-field">
                                    <label htmlFor="vehicleType">Vehicle Type</label>
                                    <select
                                        id="vehicleType"
                                        name="vehicleType"
                                        value={formData.vehicleType}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select vehicle type</option>
                                        <option value="Sedan">Sedan</option>
                                        <option value="SUV">SUV</option>
                                        <option value="Truck">Truck</option>
                                        <option value="Van">Van</option>
                                        <option value="Coupe">Coupe</option>
                                        <option value="Hatchback">Hatchback</option>
                                        <option value="Motorcycle">Motorcycle</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="step-content">
                        <div className="step-header">
                            <div className="step-icon">
                                <FaTools />
                            </div>
                            <div>
                                <h3>Service Details</h3>
                                <p>Select service type and describe the required work</p>
                            </div>
                        </div>

                        <div className="form-section">
                            <div className="service-type-section">
                                <label>Service Type *</label>
                                <div className="service-type-grid">
                                    {SERVICE_OPTIONS.map(service => {
                                        const IconComponent = service.icon;
                                        return (
                                            <div
                                                key={service.value}
                                                className={`service-type-card ${formData.serviceType === service.value ? 'selected' : ''}`}
                                                onClick={() => handleServiceTypeSelect(service.value)}
                                            >
                                                <div className="service-icon" style={{ color: service.color }}>
                                                    <IconComponent />
                                                </div>
                                                <div className="service-info">
                                                    <strong>{service.label}</strong>
                                                    <span>{service.description}</span>
                                                </div>
                                                <div className="check-indicator">
                                                    <FaCheckCircle />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="category-section">
                                <label>Service Category *</label>
                                <div className="category-grid">
                                    {SERVICE_CATEGORIES.map(category => (
                                        <div
                                            key={category.value}
                                            className={`category-card ${formData.serviceCategory === category.value ? 'selected' : ''}`}
                                            onClick={() => handleCategorySelect(category.value)}
                                        >
                                            <div className="category-icon">
                                                {category.icon}
                                            </div>
                                            <span>{category.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="form-grid">
                                <div className="form-field full-width">
                                    <label htmlFor="serviceDescription">Service Description *</label>
                                    <textarea
                                        id="serviceDescription"
                                        name="serviceDescription"
                                        rows="3"
                                        value={formData.serviceDescription}
                                        onChange={handleChange}
                                        placeholder="Describe the service or repair needed in detail..."
                                        required
                                    />
                                </div>

                                <div className="form-field full-width">
                                    <label htmlFor="customerConcerns">Customer Concerns & Symptoms *</label>
                                    <textarea
                                        id="customerConcerns"
                                        name="customerConcerns"
                                        rows="4"
                                        value={formData.customerConcerns}
                                        onChange={handleChange}
                                        placeholder="Describe the symptoms, when they started, and any specific conditions..."
                                        required
                                    />
                                </div>

                                <div className="form-field">
                                    <label htmlFor="requestedDate">Requested Completion Date</label>
                                    <input
                                        type="date"
                                        id="requestedDate"
                                        name="requestedDate"
                                        value={formData.requestedDate}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-field full-width">
                                    <label htmlFor="specialInstructions">Special Instructions</label>
                                    <textarea
                                        id="specialInstructions"
                                        name="specialInstructions"
                                        rows="2"
                                        value={formData.specialInstructions}
                                        onChange={handleChange}
                                        placeholder="Any special requirements or customer preferences..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="step-content">
                        <div className="step-header">
                            <div className="step-icon">
                                <FaDollarSign />
                            </div>
                            <div>
                                <h3>Review & Submit</h3>
                                <p>Verify all information before creating the service request</p>
                            </div>
                        </div>

                        <div className="review-section">
                            <div className="review-grid">
                                <div className="review-card">
                                    <h4>Customer Information</h4>
                                    <div className="review-item">
                                        <span>Customer Type</span>
                                        <strong>{customerType === 'existing' ? 'Existing Customer' : 'New Customer'}</strong>
                                    </div>
                                    <div className="review-item">
                                        <span>Name</span>
                                        <strong>{formData.customerName}</strong>
                                    </div>
                                    <div className="review-item">
                                        <span>Phone</span>
                                        <strong>{formData.phone}</strong>
                                    </div>
                                    <div className="review-item">
                                        <span>Email</span>
                                        <strong>{formData.email || 'Not provided'}</strong>
                                    </div>
                                </div>

                                <div className="review-card">
                                    <h4>Vehicle Information</h4>
                                    <div className="review-item">
                                        <span>Vehicle</span>
                                        <strong>{formData.make} {formData.model}</strong>
                                    </div>
                                    <div className="review-item">
                                        <span>Year</span>
                                        <strong>{formData.year || 'Not specified'}</strong>
                                    </div>
                                    <div className="review-item">
                                        <span>Mileage</span>
                                        <strong>{formData.mileage}</strong>
                                    </div>
                                </div>

                                <div className="review-card full-width">
                                    <h4>Service Request</h4>
                                    <div className="service-review">
                                        <div className="service-type-review">
                                            <span>Service Type</span>
                                            <strong>
                                                {SERVICE_OPTIONS.find(s => s.value === formData.serviceType)?.label}
                                            </strong>
                                        </div>
                                        <div className="service-category-review">
                                            <span>Category</span>
                                            <strong>
                                                {SERVICE_CATEGORIES.find(c => c.value === formData.serviceCategory)?.label}
                                            </strong>
                                        </div>
                                        <div className="service-description">
                                            <span>Description</span>
                                            <p>{formData.serviceDescription}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="request-service-form-container">
            {/* Header */}
            <div className="page-header">
                <div className="header-content">
                    <button className="back-button" onClick={() => navigate('/dashboard')}>
                        <FaArrowLeft />
                        <span>Back to Dashboard</span>
                    </button>
                    <div className="header-title">
                        <h1>Create Service Request</h1>
                        <p>Add a new service request for customer vehicle</p>
                    </div>
                </div>
            </div>

            <div className="page-content">
                <div className="form-container">
                    {getFormStatusMessage()}
                    
                    <StepIndicator />
                    
                    <form onSubmit={handleSubmit}>
                        {renderStepContent()}

                        <div className="form-actions">
                            <div className="actions-left">
                                {currentStep > 1 && (
                                    <button type="button" className="btn-secondary" onClick={prevStep}>
                                        Previous
                                    </button>
                                )}
                            </div>
                            
                            <div className="actions-right">
                                {currentStep < 4 ? (
                                    <button 
                                        type="button" 
                                        className="btn-primary" 
                                        onClick={nextStep}
                                        disabled={!validateStep(currentStep)}
                                    >
                                        Continue
                                    </button>
                                ) : (
                                    <button 
                                        type="submit" 
                                        className="btn-primary submit-btn"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="spinner"></div>
                                                Creating Request...
                                            </>
                                        ) : (
                                            <>
                                                <FaCheckCircle />
                                                Create Service Request
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <style jsx>{`
                .request-service-form-container {
                    padding: 20px;
                    background: ${COLORS.light};
                    min-height: 100vh;
                }

                .page-header {
                    background: ${COLORS.white};
                    border-bottom: 1px solid ${COLORS.gray[200]};
                    padding: 24px;
                    border-radius: 8px;
                    margin-bottom: 24px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                }

                .header-content {
                    display: flex;
                    align-items: center;
                    gap: 24px;
                }

                .back-button {
                    background: ${COLORS.gray[100]};
                    border: 1px solid ${COLORS.gray[300]};
                    color: ${COLORS.gray[700]};
                    padding: 10px 16px;
                    border-radius: 8px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 500;
                    transition: all 0.2s;
                }

                .back-button:hover {
                    background: ${COLORS.gray[200]};
                }

                .header-title h1 {
                    margin: 0;
                    font-size: 28px;
                    font-weight: 700;
                    color: ${COLORS.dark};
                }

                .header-title p {
                    margin: 4px 0 0 0;
                    color: ${COLORS.gray[600]};
                    font-size: 14px;
                }

                .page-content {
                    width: 100%;
                }

                .form-container {
                    background: ${COLORS.white};
                    border-radius: 12px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }

                /* Step Indicator */
                .step-indicator {
                    display: flex;
                    padding: 32px 32px 0;
                    position: relative;
                }

                .step {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    flex: 1;
                    position: relative;
                }

                .step-number {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: ${COLORS.gray[200]};
                    color: ${COLORS.gray[600]};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    font-size: 14px;
                    margin-bottom: 8px;
                    border: 3px solid ${COLORS.white};
                    transition: all 0.3s ease;
                }

                .step.active .step-number {
                    background: ${COLORS.primary};
                    color: ${COLORS.white};
                    transform: scale(1.1);
                }

                .step.completed .step-number {
                    background: ${COLORS.success};
                    color: ${COLORS.white};
                }

                .step-label {
                    font-size: 12px;
                    font-weight: 600;
                    color: ${COLORS.gray[500]};
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .step.active .step-label {
                    color: ${COLORS.primary};
                }

                .step-connector {
                    position: absolute;
                    top: 20px;
                    left: 60px;
                    right: 0;
                    height: 2px;
                    background: ${COLORS.gray[200]};
                    z-index: 1;
                }

                .step.completed .step-connector {
                    background: ${COLORS.success};
                }

                /* Step Content */
                .step-content {
                    padding: 32px;
                }

                .step-header {
                    display: flex;
                    align-items: flex-start;
                    gap: 16px;
                    margin-bottom: 32px;
                    padding-bottom: 24px;
                    border-bottom: 1px solid ${COLORS.gray[100]};
                }

                .step-icon {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    background: linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark});
                    color: ${COLORS.white};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                }

                .step-header h3 {
                    margin: 0;
                    font-size: 20px;
                    font-weight: 600;
                    color: ${COLORS.dark};
                }

                .step-header p {
                    margin: 4px 0 0 0;
                    color: ${COLORS.gray[600]};
                    font-size: 14px;
                }

                /* Customer Type Radio Buttons */
                .customer-type-section {
                    margin-bottom: 32px;
                }

                .section-label {
                    display: block;
                    font-size: 14px;
                    font-weight: 600;
                    color: ${COLORS.gray[700]};
                    margin-bottom: 12px;
                }

                .radio-group.horizontal {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 16px;
                }

                .radio-option {
                    position: relative;
                    cursor: pointer;
                }

                .radio-option input[type="radio"] {
                    position: absolute;
                    opacity: 0;
                }

                .radio-custom {
                    position: absolute;
                    top: 16px;
                    left: 16px;
                    width: 20px;
                    height: 20px;
                    border: 2px solid ${COLORS.gray[300]};
                    border-radius: 50%;
                    background: ${COLORS.white};
                    transition: all 0.2s;
                }

                .radio-option input[type="radio"]:checked + .radio-custom {
                    border-color: ${COLORS.primary};
                    background: ${COLORS.primary};
                }

                .radio-option input[type="radio"]:checked + .radio-custom::after {
                    content: '';
                    position: absolute;
                    top: 4px;
                    left: 4px;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: ${COLORS.white};
                }

                .radio-content {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    padding: 16px;
                    border: 2px solid ${COLORS.gray[200]};
                    border-radius: 8px;
                    transition: all 0.2s;
                    background: ${COLORS.white};
                }

                .radio-option input[type="radio"]:checked ~ .radio-content {
                    border-color: ${COLORS.primary};
                    background: ${COLORS.primary}08;
                }

                .radio-icon {
                    font-size: 24px;
                    color: ${COLORS.gray[500]};
                    margin-top: 2px;
                }

                .radio-option input[type="radio"]:checked ~ .radio-content .radio-icon {
                    color: ${COLORS.primary};
                }

                .radio-content strong {
                    display: block;
                    font-size: 16px;
                    color: ${COLORS.dark};
                    margin-bottom: 4px;
                }

                .radio-option input[type="radio"]:checked ~ .radio-content strong {
                    color: ${COLORS.primary};
                }

                .radio-content span {
                    font-size: 12px;
                    color: ${COLORS.gray[500]};
                }

                /* Existing Customer Section */
                .search-section {
                    margin-bottom: 24px;
                }

                .search-input-wrapper {
                    position: relative;
                    margin-bottom: 8px;
                }

                .search-icon {
                    position: absolute;
                    left: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: ${COLORS.gray[400]};
                }

                .search-input {
                    padding: 12px 16px 12px 44px;
                    border: 1px solid ${COLORS.gray[300]};
                    border-radius: 8px;
                    font-size: 14px;
                    width: 100%;
                    transition: all 0.2s;
                }

                .search-input:focus {
                    outline: none;
                    border-color: ${COLORS.primary};
                    box-shadow: 0 0 0 3px rgba(209, 106, 51, 0.1);
                }

                .search-results-container {
                    margin-top: 8px;
                }

                .loading-customers {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 16px;
                    color: ${COLORS.gray[500]};
                    justify-content: center;
                }

                .spinner.small {
                    width: 16px;
                    height: 16px;
                    border: 2px solid ${COLORS.gray[300]};
                    border-top: 2px solid ${COLORS.primary};
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                .search-results {
                    border: 1px solid ${COLORS.gray[200]};
                    border-radius: 8px;
                    overflow: hidden;
                }

                .results-header {
                    padding: 12px 16px;
                    background: ${COLORS.gray[50]};
                    border-bottom: 1px solid ${COLORS.gray[200]};
                    font-size: 12px;
                    color: ${COLORS.gray[600]};
                    font-weight: 500;
                }

                .customer-result {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 16px;
                    cursor: pointer;
                    border-bottom: 1px solid ${COLORS.gray[100]};
                    transition: background-color 0.2s;
                }

                .customer-result:hover {
                    background: ${COLORS.gray[50]};
                }

                .customer-result.selected {
                    background: ${COLORS.primary}08;
                    border-left: 3px solid ${COLORS.primary};
                }

                .customer-result:last-child {
                    border-bottom: none;
                }

                .customer-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: ${COLORS.gray[200]};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: ${COLORS.gray[600]};
                    flex-shrink: 0;
                }

                .customer-avatar.small {
                    width: 32px;
                    height: 32px;
                    font-size: 12px;
                }

                .customer-info {
                    flex: 1;
                }

                .customer-info strong {
                    display: block;
                    font-size: 14px;
                    color: ${COLORS.dark};
                    margin-bottom: 2px;
                }

                .customer-contacts {
                    display: flex;
                    gap: 12px;
                }

                .customer-contacts span {
                    font-size: 12px;
                    color: ${COLORS.gray[500]};
                }

                .customer-type-badge {
                    padding: 4px 8px;
                    background: ${COLORS.gray[100]};
                    color: ${COLORS.gray[600]};
                    border-radius: 4px;
                    font-size: 10px;
                    font-weight: 600;
                    text-transform: uppercase;
                }

                .no-results {
                    text-align: center;
                    padding: 32px;
                    border: 2px dashed ${COLORS.gray[300]};
                    border-radius: 8px;
                    background: ${COLORS.gray[50]};
                }

                .no-results p {
                    margin: 0 0 16px 0;
                    color: ${COLORS.gray[600]};
                }

                .btn-primary.outline {
                    background: transparent;
                    border: 2px solid ${COLORS.primary};
                    color: ${COLORS.primary};
                }

                .btn-primary.outline:hover {
                    background: ${COLORS.primary};
                    color: ${COLORS.white};
                }

                /* Selected Customer Card */
                .selected-customer-card {
                    background: ${COLORS.success}08;
                    border: 1px solid ${COLORS.success}30;
                    border-radius: 8px;
                    padding: 20px;
                    margin-top: 16px;
                }

                .customer-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                }

                .customer-header h4 {
                    margin: 0;
                    color: ${COLORS.success};
                    font-size: 16px;
                }

                .btn-edit-customer {
                    background: ${COLORS.success};
                    color: ${COLORS.white};
                    border: none;
                    padding: 6px 12px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 12px;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    transition: background-color 0.2s;
                }

                .btn-edit-customer:hover {
                    background: ${COLORS.success}80;
                }

                .customer-details {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 12px;
                }

                .detail-item {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .detail-item strong {
                    font-size: 12px;
                    color: ${COLORS.gray[600]};
                    text-transform: uppercase;
                }

                .detail-item span {
                    font-size: 14px;
                    color: ${COLORS.dark};
                }

                .customer-type {
                    padding: 2px 6px;
                    background: ${COLORS.gray[100]};
                    color: ${COLORS.gray[600]};
                    border-radius: 4px;
                    font-size: 11px;
                    font-weight: 600;
                    text-transform: uppercase;
                    display: inline-block;
                    width: fit-content;
                }

                /* Recent Customers */
                .recent-customers {
                    margin-top: 16px;
                }

                .recent-customers-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 12px;
                    margin-top: 8px;
                }

                .recent-customer-card {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px;
                    border: 1px solid ${COLORS.gray[200]};
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                    background: ${COLORS.white};
                }

                .recent-customer-card:hover {
                    border-color: ${COLORS.primary};
                    transform: translateY(-1px);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }

                /* New Customer Section */
                .new-customer-section {
                    margin-top: 24px;
                }

                .new-customer-header {
                    margin-bottom: 24px;
                }

                .new-customer-header h4 {
                    margin: 0 0 8px 0;
                    color: ${COLORS.dark};
                    font-size: 18px;
                }

                .new-customer-header p {
                    margin: 0;
                    color: ${COLORS.gray[600]};
                    font-size: 14px;
                }

                .new-customer-actions {
                    text-align: center;
                    margin-top: 32px;
                    padding-top: 24px;
                    border-top: 1px solid ${COLORS.gray[200]};
                }

                .helper-text {
                    margin: 12px 0 0 0;
                    color: ${COLORS.gray[500]};
                    font-size: 12px;
                }

                /* Form Grid */
                .form-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 20px;
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
                    font-weight: 600;
                    color: ${COLORS.gray[700]};
                    margin-bottom: 8px;
                }

                input, select, textarea {
                    padding: 12px 16px;
                    border: 1px solid ${COLORS.gray[300]};
                    border-radius: 8px;
                    font-size: 14px;
                    transition: all 0.2s;
                    background: ${COLORS.white};
                }

                input:focus, select:focus, textarea:focus {
                    outline: none;
                    border-color: ${COLORS.primary};
                    box-shadow: 0 0 0 3px rgba(209, 106, 51, 0.1);
                }

                textarea {
                    resize: vertical;
                    min-height: 100px;
                }

                /* Service Type Grid */
                .service-type-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 16px;
                    margin-bottom: 32px;
                }

                .service-type-card {
                    border: 2px solid ${COLORS.gray[200]};
                    border-radius: 12px;
                    padding: 20px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    position: relative;
                    display: flex;
                    align-items: flex-start;
                    gap: 16px;
                }

                .service-type-card:hover {
                    border-color: ${COLORS.gray[300]};
                    transform: translateY(-2px);
                }

                .service-type-card.selected {
                    border-color: ${COLORS.primary};
                    background: linear-gradient(135deg, rgba(209, 106, 51, 0.05), rgba(209, 106, 51, 0.02));
                }

                .service-icon {
                    font-size: 24px;
                    margin-top: 4px;
                }

                .service-info {
                    flex: 1;
                }

                .service-info strong {
                    display: block;
                    font-size: 16px;
                    color: ${COLORS.dark};
                    margin-bottom: 4px;
                }

                .service-info span {
                    font-size: 12px;
                    color: ${COLORS.gray[500]};
                    line-height: 1.4;
                }

                .check-indicator {
                    color: ${COLORS.primary};
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .service-type-card.selected .check-indicator {
                    opacity: 1;
                }

                /* Category Grid */
                .category-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 12px;
                    margin-bottom: 32px;
                }

                .category-card {
                    border: 2px solid ${COLORS.gray[200]};
                    border-radius: 8px;
                    padding: 16px;
                    cursor: pointer;
                    text-align: center;
                    transition: all 0.3s ease;
                }

                .category-card:hover {
                    border-color: ${COLORS.gray[300]};
                    transform: translateY(-1px);
                }

                .category-card.selected {
                    border-color: ${COLORS.primary};
                    background: linear-gradient(135deg, rgba(209, 106, 51, 0.05), rgba(209, 106, 51, 0.02));
                }

                .category-icon {
                    font-size: 24px;
                    margin-bottom: 8px;
                }

                .category-card span {
                    font-size: 12px;
                    font-weight: 600;
                    color: ${COLORS.dark};
                }

                /* Review Section */
                .review-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 20px;
                }

                .review-card {
                    background: ${COLORS.gray[50]};
                    padding: 24px;
                    border-radius: 12px;
                    border-left: 4px solid ${COLORS.primary};
                }

                .review-card.full-width {
                    grid-column: 1 / -1;
                }

                .review-card h4 {
                    margin: 0 0 16px 0;
                    font-size: 16px;
                    font-weight: 600;
                    color: ${COLORS.dark};
                }

                .review-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 12px;
                }

                .review-item span {
                    font-size: 14px;
                    color: ${COLORS.gray[600]};
                    flex: 1;
                }

                .review-item strong {
                    font-size: 14px;
                    color: ${COLORS.dark};
                    text-align: right;
                }

                .service-review {
                    space-y: 16px;
                }

                .service-type-review, .service-category-review {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .service-description span {
                    display: block;
                    font-size: 14px;
                    color: ${COLORS.gray[600]};
                    margin-bottom: 8px;
                }

                .service-description p {
                    margin: 0;
                    font-size: 14px;
                    color: ${COLORS.dark};
                    line-height: 1.5;
                }

                /* Form Actions */
                .form-actions {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 24px 32px;
                    border-top: 1px solid ${COLORS.gray[200]};
                    background: ${COLORS.gray[50]};
                }

                .actions-left, .actions-right {
                    display: flex;
                    gap: 12px;
                }

                .btn-primary, .btn-secondary {
                    padding: 12px 24px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 14px;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .btn-primary {
                    background: ${COLORS.primary};
                    color: ${COLORS.white};
                }

                .btn-primary:hover:not(:disabled) {
                    background: ${COLORS.primaryDark};
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(209, 106, 51, 0.3);
                }

                .btn-primary:disabled {
                    background: ${COLORS.gray[400]};
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }

                .btn-secondary {
                    background: ${COLORS.gray[200]};
                    color: ${COLORS.gray[700]};
                    border: 1px solid ${COLORS.gray[300]};
                }

                .btn-secondary:hover {
                    background: ${COLORS.gray[300]};
                }

                .btn-primary.large {
                    padding: 14px 28px;
                    font-size: 16px;
                }

                .submit-btn {
                    padding: 12px 32px;
                }

                .spinner {
                    width: 16px;
                    height: 16px;
                    border: 2px solid transparent;
                    border-top: 2px solid ${COLORS.white};
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                /* Form Status */
                .form-status {
                    padding: 16px 32px;
                    border-radius: 0;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-size: 14px;
                }

                .form-status.success {
                    background: #d1fae5;
                    color: #065f46;
                    border-bottom: 1px solid #a7f3d0;
                }

                .form-status.error {
                    background: #fee2e2;
                    color: #991b1b;
                    border-bottom: 1px solid #fecaca;
                }

                .form-status div {
                    display: flex;
                    flex-direction: column;
                }

                .form-status strong {
                    font-weight: 600;
                }

                .form-status span {
                    font-size: 12px;
                    opacity: 0.8;
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .request-service-form-container {
                        padding: 15px;
                    }

                    .page-header {
                        padding: 20px;
                        margin-bottom: 20px;
                    }

                    .step-indicator {
                        padding: 24px 16px 0;
                    }

                    .step-content {
                        padding: 24px 16px;
                    }

                    .form-actions {
                        padding: 20px 16px;
                        flex-direction: column;
                        gap: 12px;
                    }

                    .actions-left, .actions-right {
                        width: 100%;
                    }

                    .btn-primary, .btn-secondary {
                        width: 100%;
                        justify-content: center;
                    }

                    .radio-group.horizontal {
                        grid-template-columns: 1fr;
                    }

                    .service-type-grid {
                        grid-template-columns: 1fr;
                    }

                    .category-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }

                    .form-grid {
                        grid-template-columns: 1fr;
                    }

                    .customer-details {
                        grid-template-columns: 1fr;
                    }

                    .recent-customers-grid {
                        grid-template-columns: 1fr;
                    }

                    .header-content {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 16px;
                    }
                }
            `}</style>
        </div>
    );
};

export default RequestServiceForm;