// src/components/RequestServiceGarage.js
import React, { useState, useEffect } from 'react';
import { 
  FaCar, FaUser, FaTools, 
  FaExclamationTriangle, FaPaperclip, 
  FaCheckCircle, FaClock
} from 'react-icons/fa';
import apiClient from '../utils/apiClient';

const RequestServiceGarage = () => {
  // State for form data
  const [formData, setFormData] = useState({
    // Customer Information
    customerType: 'existing', // 'existing' or 'new'
    existingCustomerId: '',
    newCustomer: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      address: ''
    },
    
    // Vehicle Information
    vehicleType: 'existing', // 'existing' or 'new'
    existingVehicleId: '',
    newVehicle: {
      make: '',
      model: '',
      year: '',
      vin: '',
      licensePlate: '',
      mileage: '',
      color: '',
      vehicleType: 'car'
    },
    
    // Service Details
    serviceCategory: '',
    serviceType: '',
    problemDescription: '',
    urgency: 'medium', // 'low', 'medium', 'high', 'emergency'
    preferredDate: '',
    preferredTime: '',
    
    // Additional Information
    files: [],
    notes: '',
    authorization: false
  });

  // State for dropdown data
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(''); // 'success', 'error', ''

  // Fetch initial data
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch customers
      const customersResponse = await apiClient.get('/clients/');
      setCustomers(customersResponse.data.results || customersResponse.data || []);
      
      // Note: serviceCategories state removed as it wasn't being used
      // const categoriesResponse = await apiClient.get('/service-categories/');
      // setServiceCategories(categoriesResponse.data || []);
      
    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch vehicles when customer is selected
  useEffect(() => {
    if (formData.existingCustomerId) {
      fetchCustomerVehicles(formData.existingCustomerId);
    }
  }, [formData.existingCustomerId]);

  const fetchCustomerVehicles = async (customerId) => {
    try {
      const response = await apiClient.get(`/clients/${customerId}/vehicles/`);
      setVehicles(response.data.results || response.data || []);
    } catch (error) {
      console.error('Error fetching customer vehicles:', error);
    }
  };

  // Handle service category change to load service types
  const handleServiceCategoryChange = (category) => {
    setFormData(prev => ({
      ...prev,
      serviceCategory: category,
      serviceType: ''
    }));
    
    // Load service types based on category
    const types = getServiceTypesByCategory(category);
    setServiceTypes(types);
  };

  const getServiceTypesByCategory = (category) => {
    // This would typically come from your API
    const serviceTypesMap = {
      'maintenance': [
        'Oil Change',
        'Tire Rotation',
        'Brake Inspection',
        'Filter Replacement',
        'Fluid Check'
      ],
      'repair': [
        'Brake Repair',
        'Engine Repair',
        'Transmission Repair',
        'Electrical Repair',
        'Suspension Repair'
      ],
      'tires': [
        'Tire Replacement',
        'Wheel Alignment',
        'Tire Balancing',
        'Tire Repair'
      ],
      'diagnostic': [
        'Engine Diagnostic',
        'Computer Diagnostic',
        'Emissions Test',
        'General Inspection'
      ]
    };
    
    return serviceTypesMap[category] || [];
  };

  // Handle form input changes
  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...files]
    }));
  };

  // Remove uploaded file
  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  // Calculate estimated completion date
  const getEstimatedCompletion = () => {
    const urgencyDays = {
      low: 7,
      medium: 3,
      high: 1,
      emergency: 0
    };
    
    const preferredDate = new Date(formData.preferredDate);
    const estimatedDate = new Date(preferredDate);
    estimatedDate.setDate(estimatedDate.getDate() + urgencyDays[formData.urgency]);
    
    return estimatedDate.toLocaleDateString();
  };

  // Form validation
  const validateForm = () => {
    if (!formData.authorization) {
      return 'Please authorize the service request';
    }
    
    if (formData.customerType === 'existing' && !formData.existingCustomerId) {
      return 'Please select a customer';
    }
    
    if (formData.customerType === 'new') {
      if (!formData.newCustomer.firstName || !formData.newCustomer.phone) {
        return 'Please fill in required customer information';
      }
    }
    
    if (formData.vehicleType === 'existing' && !formData.existingVehicleId) {
      return 'Please select a vehicle';
    }
    
    if (formData.vehicleType === 'new') {
      if (!formData.newVehicle.make || !formData.newVehicle.model || !formData.newVehicle.year) {
        return 'Please fill in required vehicle information';
      }
    }
    
    if (!formData.serviceCategory || !formData.problemDescription) {
      return 'Please provide service details';
    }
    
    return null;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setSubmitStatus('error');
      // You might want to show this error to the user
      console.error('Validation error:', validationError);
      return;
    }
    
    setIsLoading(true);
    setSubmitStatus('');
    
    try {
      // Prepare data for API
      const requestData = {
        customer: formData.customerType === 'existing' 
          ? { id: formData.existingCustomerId }
          : formData.newCustomer,
        
        vehicle: formData.vehicleType === 'existing'
          ? { id: formData.existingVehicleId }
          : formData.newVehicle,
        
        service_details: {
          category: formData.serviceCategory,
          type: formData.serviceType,
          problem_description: formData.problemDescription,
          urgency: formData.urgency,
          preferred_date: formData.preferredDate,
          preferred_time: formData.preferredTime
        },
        
        additional_info: {
          notes: formData.notes,
          files: formData.files.map(file => file.name) // You'd upload files separately
        }
      };
      
      // Submit to API
      const response = await apiClient.post('/service-requests/', requestData);
      
      setSubmitStatus('success');
      console.log('Service request submitted successfully:', response.data);
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          customerType: 'existing',
          existingCustomerId: '',
          newCustomer: { firstName: '', lastName: '', phone: '', email: '', address: '' },
          vehicleType: 'existing',
          existingVehicleId: '',
          newVehicle: { make: '', model: '', year: '', vin: '', licensePlate: '', mileage: '', color: '', vehicleType: 'car' },
          serviceCategory: '',
          serviceType: '',
          problemDescription: '',
          urgency: 'medium',
          preferredDate: '',
          preferredTime: '',
          files: [],
          notes: '',
          authorization: false
        });
        setSubmitStatus('');
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting service request:', error);
      setSubmitStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  // Urgency options with colors
  const urgencyOptions = [
    { value: 'low', label: 'Low', color: '#28a745', description: 'Within 1 week' },
    { value: 'medium', label: 'Medium', color: '#ffc107', description: 'Within 3 days' },
    { value: 'high', label: 'High', color: '#fd7e14', description: 'Within 24 hours' },
    { value: 'emergency', label: 'Emergency', color: '#dc3545', description: 'Immediate' }
  ];

  return (
    <div className="request-service-container">
      <div className="service-header">
        <h1><FaTools /> Request Auto Service</h1>
        <p>Fill out the form below to request service for your vehicle</p>
      </div>

      <form onSubmit={handleSubmit} className="service-form">
        {/* Customer Information Section */}
        <section className="form-section">
          <h2><FaUser /> Customer Information</h2>
          
          <div className="form-group">
            <label>Customer Type</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  value="existing"
                  checked={formData.customerType === 'existing'}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerType: e.target.value }))}
                />
                Existing Customer
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  value="new"
                  checked={formData.customerType === 'new'}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerType: e.target.value }))}
                />
                New Customer
              </label>
            </div>
          </div>

          {formData.customerType === 'existing' ? (
            <div className="form-group">
              <label>Select Customer</label>
              <select
                value={formData.existingCustomerId}
                onChange={(e) => setFormData(prev => ({ ...prev, existingCustomerId: e.target.value }))}
                required
              >
                <option value="">Choose a customer...</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.first_name} {customer.last_name} - {customer.phone_number}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="new-customer-fields">
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    value={formData.newCustomer.firstName}
                    onChange={(e) => handleInputChange('newCustomer', 'firstName', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    value={formData.newCustomer.lastName}
                    onChange={(e) => handleInputChange('newCustomer', 'lastName', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.newCustomer.phone}
                    onChange={(e) => handleInputChange('newCustomer', 'phone', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.newCustomer.email}
                    onChange={(e) => handleInputChange('newCustomer', 'email', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  value={formData.newCustomer.address}
                  onChange={(e) => handleInputChange('newCustomer', 'address', e.target.value)}
                />
              </div>
            </div>
          )}
        </section>

        {/* Vehicle Information Section */}
        <section className="form-section">
          <h2><FaCar /> Vehicle Information</h2>
          
          <div className="form-group">
            <label>Vehicle Type</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  value="existing"
                  checked={formData.vehicleType === 'existing'}
                  onChange={(e) => setFormData(prev => ({ ...prev, vehicleType: e.target.value }))}
                />
                Existing Vehicle
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  value="new"
                  checked={formData.vehicleType === 'new'}
                  onChange={(e) => setFormData(prev => ({ ...prev, vehicleType: e.target.value }))}
                />
                New Vehicle
              </label>
            </div>
          </div>

          {formData.vehicleType === 'existing' ? (
            <div className="form-group">
              <label>Select Vehicle</label>
              <select
                value={formData.existingVehicleId}
                onChange={(e) => setFormData(prev => ({ ...prev, existingVehicleId: e.target.value }))}
                required
                disabled={!formData.existingCustomerId}
              >
                <option value="">{formData.existingCustomerId ? 'Choose a vehicle...' : 'Select customer first'}</option>
                {vehicles.map(vehicle => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.make} {vehicle.model} ({vehicle.year}) - {vehicle.license_plate}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="new-vehicle-fields">
              <div className="form-row">
                <div className="form-group">
                  <label>Make *</label>
                  <input
                    type="text"
                    value={formData.newVehicle.make}
                    onChange={(e) => handleInputChange('newVehicle', 'make', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Model *</label>
                  <input
                    type="text"
                    value={formData.newVehicle.model}
                    onChange={(e) => handleInputChange('newVehicle', 'model', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Year *</label>
                  <input
                    type="number"
                    min="1990"
                    max={new Date().getFullYear() + 1}
                    value={formData.newVehicle.year}
                    onChange={(e) => handleInputChange('newVehicle', 'year', e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>VIN</label>
                  <input
                    type="text"
                    value={formData.newVehicle.vin}
                    onChange={(e) => handleInputChange('newVehicle', 'vin', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>License Plate</label>
                  <input
                    type="text"
                    value={formData.newVehicle.licensePlate}
                    onChange={(e) => handleInputChange('newVehicle', 'licensePlate', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Current Mileage</label>
                  <input
                    type="number"
                    value={formData.newVehicle.mileage}
                    onChange={(e) => handleInputChange('newVehicle', 'mileage', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Color</label>
                  <input
                    type="text"
                    value={formData.newVehicle.color}
                    onChange={(e) => handleInputChange('newVehicle', 'color', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Service Details Section */}
        <section className="form-section">
          <h2><FaTools /> Service Details</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label>Service Category *</label>
              <select
                value={formData.serviceCategory}
                onChange={(e) => handleServiceCategoryChange(e.target.value)}
                required
              >
                <option value="">Select category...</option>
                <option value="maintenance">Maintenance</option>
                <option value="repair">Repair</option>
                <option value="tires">Tires & Wheels</option>
                <option value="diagnostic">Diagnostic</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Service Type</label>
              <select
                value={formData.serviceType}
                onChange={(e) => setFormData(prev => ({ ...prev, serviceType: e.target.value }))}
              >
                <option value="">Select type...</option>
                {serviceTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Problem Description *</label>
            <textarea
              value={formData.problemDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, problemDescription: e.target.value }))}
              placeholder="Please describe the issue with your vehicle..."
              rows="4"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Urgency Level</label>
              <div className="urgency-options">
                {urgencyOptions.map(option => (
                  <label 
                    key={option.value} 
                    className={`urgency-option ${formData.urgency === option.value ? 'selected' : ''}`}
                    style={{ borderColor: option.color }}
                  >
                    <input
                      type="radio"
                      value={option.value}
                      checked={formData.urgency === option.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, urgency: e.target.value }))}
                    />
                    <span className="urgency-label" style={{ color: option.color }}>
                      {option.label}
                    </span>
                    <span className="urgency-description">{option.description}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Preferred Date</label>
              <input
                type="date"
                value={formData.preferredDate}
                onChange={(e) => setFormData(prev => ({ ...prev, preferredDate: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="form-group">
              <label>Preferred Time</label>
              <select
                value={formData.preferredTime}
                onChange={(e) => setFormData(prev => ({ ...prev, preferredTime: e.target.value }))}
              >
                <option value="">Any time</option>
                <option value="08:00">8:00 AM</option>
                <option value="09:00">9:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="13:00">1:00 PM</option>
                <option value="14:00">2:00 PM</option>
                <option value="15:00">3:00 PM</option>
                <option value="16:00">4:00 PM</option>
              </select>
            </div>
          </div>

          {formData.preferredDate && (
            <div className="estimated-completion">
              <FaClock /> Estimated completion: {getEstimatedCompletion()}
            </div>
          )}
        </section>

        {/* Additional Information Section */}
        <section className="form-section">
          <h2><FaPaperclip /> Additional Information</h2>
          
          <div className="form-group">
            <label>Upload Files (Photos, Documents)</label>
            <div className="file-upload-area">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                accept="image/*,.pdf,.doc,.docx"
              />
              <div className="file-list">
                {formData.files.map((file, index) => (
                  <div key={index} className="file-item">
                    <span>{file.name}</span>
                    <button type="button" onClick={() => removeFile(index)}>×</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Additional Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any additional information or special requests..."
              rows="3"
            />
          </div>
        </section>

        {/* Authorization Section */}
        <section className="form-section authorization-section">
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.authorization}
                onChange={(e) => setFormData(prev => ({ ...prev, authorization: e.target.checked }))}
                required
              />
              <span>I authorize ARI Garage to perform the requested services and understand that additional repairs may be recommended after inspection.</span>
            </label>
          </div>
        </section>

        {/* Submit Section */}
        <section className="form-section submit-section">
          {submitStatus === 'success' && (
            <div className="success-message">
              <FaCheckCircle /> Service request submitted successfully! We'll contact you soon.
            </div>
          )}
          
          {submitStatus === 'error' && (
            <div className="error-message">
              <FaExclamationTriangle /> There was an error submitting your request. Please try again.
            </div>
          )}

          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : 'Submit Service Request'}
          </button>
        </section>
      </form>

      <style jsx>{`
        .request-service-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .service-header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #e9ecef;
          padding-bottom: 20px;
        }

        .service-header h1 {
          color: #2c3e50;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .service-header p {
          color: #6c757d;
          font-size: 1.1rem;
        }

        .form-section {
          margin-bottom: 30px;
          padding: 20px;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          background: #f8f9fa;
        }

        .form-section h2 {
          color: #2c3e50;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.3rem;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        label {
          display: block;
          margin-bottom: 5px;
          font-weight: 600;
          color: #495057;
        }

        input, select, textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 14px;
          transition: border-color 0.15s ease-in-out;
        }

        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
        }

        .radio-group {
          display: flex;
          gap: 20px;
        }

        .radio-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: normal;
          cursor: pointer;
        }

        .radio-label input {
          width: auto;
        }

        .new-customer-fields,
        .new-vehicle-fields {
          background: white;
          padding: 15px;
          border-radius: 4px;
          border: 1px solid #dee2e6;
        }

        .urgency-options {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .urgency-option {
          padding: 10px;
          border: 2px solid #e9ecef;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .urgency-option.selected {
          background-color: #f8f9fa;
          border-width: 2px;
        }

        .urgency-option input {
          width: auto;
          margin-right: 8px;
        }

        .urgency-label {
          font-weight: 600;
          margin-right: 5px;
        }

        .urgency-description {
          font-size: 12px;
          color: #6c757d;
        }

        .file-upload-area {
          border: 2px dashed #dee2e6;
          border-radius: 4px;
          padding: 20px;
          text-align: center;
        }

        .file-list {
          margin-top: 10px;
        }

        .file-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px;
          background: white;
          border: 1px solid #dee2e6;
          border-radius: 4px;
          margin-bottom: 5px;
        }

        .file-item button {
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .estimated-completion {
          background: #e7f3ff;
          border: 1px solid #b3d7ff;
          border-radius: 4px;
          padding: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #0066cc;
          font-weight: 600;
        }

        .checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-weight: normal;
          cursor: pointer;
        }

        .checkbox-label input {
          width: auto;
          margin-top: 3px;
        }

        .authorization-section {
          background: #fff3cd;
          border-color: #ffeaa7;
        }

        .submit-section {
          text-align: center;
          background: white;
        }

        .submit-button {
          background: #28a745;
          color: white;
          border: none;
          padding: 12px 30px;
          font-size: 16px;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .submit-button:hover:not(:disabled) {
          background: #218838;
        }

        .submit-button:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }

        .success-message {
          background: #d4edda;
          color: #155724;
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .error-message {
          background: #f8d7da;
          color: #721c24;
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .urgency-options {
            grid-template-columns: 1fr;
          }
          
          .radio-group {
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default RequestServiceGarage;