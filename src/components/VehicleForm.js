// src/components/VehicleForm.js - UPDATED WITH REAL API INTEGRATION

import React, { useState, useMemo, useEffect, useRef } from 'react'; // 🛑 ADD useRef
import {
    FaCar,
    FaCamera,
    FaRulerHorizontal,
    FaTag,
    FaPaintBrush,
    FaSave,
    FaTimes,
    FaImage,
    FaUserFriends,
    FaArrowLeft
} from 'react-icons/fa';
import apiClient from '../utils/apiClient';

// ----------------------------------------------------------------------
// 1. DATA DEFINITIONS & UTILITIES
// ----------------------------------------------------------------------

const vehicleBodyTypes = [
    'car', 'bus',
    // --- Passenger Vehicles (P-segment) ---
    'Sedan (4-door)', 'Coupe (2-door)', 'Hatchback', 'Wagon (Station Wagon)', 'Convertible / Cabriolet', 'Roadster / Spyder (2-seat)', 'Microcar / City Car',
    // --- Utility & Crossovers (S-segment) ---
    'Crossover (CUV) - Compact', 'SUV (Sport Utility Vehicle) - Mid-size', 'SUV (Sport Utility Vehicle) - Full-size', 'Minivan / Multi-purpose Vehicle (MPV)',
    // --- Light/Medium Duty Trucks & Vans (T-segment) ---
    'Pickup Truck (Half-ton / Light Duty)', 'Pickup Truck (Three-quarter Ton)', 'Pickup Truck (One-ton / Heavy Duty)', 'Cargo Van / Panel Van', 'Passenger Van (12/15 seat)', 'Cutaway Van / Chassis Cab', 'Step Van / Delivery Van (Short/Long)', 'Small Bus / Shuttle Bus',
    // --- Heavy Duty Trucks (H-segment) ---
    'Tractor Truck (Semi) - Day Cab', 'Tractor Truck (Semi) - Sleeper Cab', 'Straight Truck (Box Truck)', 'Dump Truck (Single Axle)', 'Dump Truck (Tandem/Tri-Axle)', 'Flatbed Truck (Heavy Duty)', 'Roll-off Truck', 'Crane Truck', 'Tanker Truck (Fuel/Liquid)', 'Cement Mixer Truck', 'Garbage / Refuse Truck', 'Service / Utility Truck', 'Fire Truck / Emergency Vehicle', 'Tow Truck / Wrecker - Light Duty', 'Tow Truck / Wrecker - Heavy Duty',
    // --- Trailers (Separate Asset Management) ---
    'Box Trailer (Dry Van) - 53ft', 'Box Trailer (Dry Van) - 48ft', 'Reefer Trailer (Refrigerated)', 'Flatbed Trailer (Standard)', 'Step Deck Trailer', 'Lowboy Trailer / Detachable Gooseneck (RGN)', 'Tank Trailer (Liquid/Gas)', 'Hopper Trailer (Grain/Powder)', 'Livestock Trailer', 'Car Hauler Trailer (Open)', 'Car Hauler Trailer (Enclosed)', 'Utility Trailer (Small)', 'Equipment Trailer (Gooseneck)', 'Specialized Trailer (Oil Field, Logging, etc.)',
    // --- Heavy Equipment & Industrial (I-segment) ---
    'Excavator (Standard)', 'Mini Excavator', 'Skid Steer / Compact Loader', 'Backhoe Loader', 'Wheel Loader', 'Forklift (Warehouse)', 'Telehandler / Boom Lift', 'Scissor Lift / Aerial Platform', 'Dozer / Bulldozer', 'Grader / Motor Grader', 'Roller / Compactor', 'Agricultural / Farm Tractor', 'Combine Harvester',
    // --- Specialty & Recreational (R-segment) ---
    'Motorcycle / Scooter', 'ATV / Quad', 'UTV / Side-by-Side', 'RV / Motorhome (Class A)', 'RV / Motorhome (Class B/C)', 'Travel Trailer / Fifth Wheel', 'Snowmobile', 'Boat / Marine Vessel (Inboard/Outboard)', 'Golf Cart / Utility Cart',
    // --- Default/Catch-all ---
    'Other / Unknown Equipment', 'Chassis Only'
].sort((a, b) => a.localeCompare(b));

const rawMakeModelData = {
    // Passenger/Luxury Makes
    'Acura': ['MDX', 'RDX', 'TLX', 'Integra', 'NSX'].sort(),
    'Audi': ['A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q3', 'Q5', 'Q7', 'Q8', 'e-tron'].sort(),
    'BMW': ['1 Series', '2 Series', '3 Series', '4 Series', '5 Series', '6 Series', '7 Series', 'X1', 'X3', 'X5', 'X7'].sort(),
    'Ford': ['F-150', 'Mustang', 'Explorer', 'Escape', 'Focus', 'Transit Van'].sort(),
    'Honda': ['CR-V', 'Civic', 'Accord', 'Pilot', 'Odyssey', 'Ridgeline'].sort(),
    'Toyota': ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Tacoma', 'Tundra', '4Runner'].sort(),
    'Mercedes-Benz': ['A-Class', 'C-Class', 'E-Class', 'S-Class', 'GLA', 'GLC', 'GLE', 'GLS'].sort(),
    // Add other makes as needed...
};

const makeModelData = rawMakeModelData;
const vehicleMakes = Object.keys(makeModelData).sort();
const transmissionOptions = [
    'Manual Transmission - MT',
    'Automatic Transmission - AT',
    'Automated Manual Transmission - AMT',
    'Continuously Variable Transmission - CVT'
].sort();

const engineOptions = [
    'Gasoline (Petrol)',
    'Diesel',
    'Flex Fuel (E85/Gas)',
    'Electric (EV)',
    'Hybrid (HEV)',
    'Plug-in Hybrid (PHEV)',
    'Other Fuel (CNG/LPG/Hydrogen)'
].sort();

const mockTrimOptions = [
    'Base',
    'Sport (S)',
    'Luxury (L)',
    'Grand Touring (GT)',
    'Limited',
    'Platinum / Denali'
].sort();

/**
 * 🏆 REAL HOOK: Fetches clients from the actual API endpoint.
 */
const useFetchClients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                console.log('🔄 Fetching clients from API...');
                const response = await apiClient.get('/clients/');
                
                // Handle both paginated and non-paginated responses
                const clientData = response.data.results || response.data || [];
                
                // Transform API data to match frontend format
                const formattedClients = clientData.map(client => ({
                    id: client.id,
                    name: client.full_name || `${client.first_name || ''} ${client.last_name || ''}`.trim() || client.company_name || 'Unnamed Client'
                }));
                
                console.log('✅ Clients fetched successfully:', formattedClients);
                setClients(formattedClients);
            } catch (err) {
                console.error('❌ Failed to fetch clients:', err);
                setError('Failed to load clients. Please try again.');
                setClients([]); // Fallback to empty array
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, []);

    return { clients, loading, error };
};

// ----------------------------------------------------------------------
// 2. REACT COMPONENT
// ----------------------------------------------------------------------

const VehicleForm = ({ onSave, onCancel, vehicleData, clientId: propClientId }) => {
    // 🛑 DEBUG: Log when component renders
    console.log('🎯 VehicleForm RENDERED - propClientId:', propClientId);
    
    const isEditMode = !!vehicleData?.id;
    const [vehicleImage, setVehicleImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { clients, loading: loadingClients, error: clientsError } = useFetchClients();

    // 🛑 Add submission tracking
    const submissionRef = useRef(false);

    // 🛑 FIX: Use propClientId directly as the effective client ID
    const effectiveClientId = propClientId;

    // --- State to hold form values ---
    const [formData, setFormData] = useState({
        clientId: effectiveClientId || '',
        vin: '',
        licensePlate: '',
        vehicleType: '',
        year: '',
        make: '',
        model: '',
        trim: '',
        transmission: '',
        drivetrain: '',
        engine: '',
        odoReading: '',
        odoUnit: 'miles',
        color: '',
        unitNumber: '',
        notes: ''
    });

    // 🏆 Load vehicle data when in edit mode
    useEffect(() => {
        if (vehicleData && isEditMode) {
            console.log('🎯 Loading vehicle data into form:', vehicleData);
            setFormData({
                clientId: vehicleData.clientId || vehicleData.client_id || effectiveClientId || '',
                vin: vehicleData.vin || '',
                licensePlate: vehicleData.licensePlate || vehicleData.license_plate || '',
                vehicleType: vehicleData.vehicleType || vehicleData.vehicle_type || '',
                year: vehicleData.year || '',
                make: vehicleData.make || '',
                model: vehicleData.model || '',
                trim: vehicleData.trim || '',
                transmission: vehicleData.transmission || '',
                drivetrain: vehicleData.drivetrain || '',
                engine: vehicleData.engine || '',
                odoReading: vehicleData.odoReading || vehicleData.odo_reading || '',
                odoUnit: vehicleData.odoUnit || vehicleData.odo_unit || 'miles',
                color: vehicleData.color || '',
                unitNumber: vehicleData.unitNumber || vehicleData.unit_number || '',
                notes: vehicleData.notes || ''
            });
            
            if (vehicleData.image) {
                setVehicleImage(vehicleData.image);
            }
        }
    }, [vehicleData, isEditMode, effectiveClientId]);

    // 🏆 HELPER: Find the name of the selected client for display
    const selectedClientName = useMemo(() => {
        if (!formData.clientId) return '';
        const client = clients.find(c => String(c.id) === String(formData.clientId));
        return client ? client.name : '';
    }, [formData.clientId, clients]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'make') {
            setFormData(prev => ({
                ...prev,
                make: value,
                model: '',
                trim: ''
            }));
        }
        else if (name === 'model') {
            setFormData(prev => ({
                ...prev,
                model: value,
                trim: ''
            }));
        }
        else if (name === 'year') {
             setFormData(prev => ({
                ...prev,
                year: value,
                ...(value === '' && { make: '', model: '', trim: '' })
            }));
        }
        else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleMakeFocus = (e) => {
        if (!formData.year) {
            e.preventDefault();
            alert("Please select the Vehicle Year first before choosing the Make/Brand.");
            document.getElementById('year').focus();
        }
    };

    const handleTrimFocus = (e) => {
        if (!formData.model) {
            e.preventDefault();
            alert("Please select the Vehicle Model first before choosing the Trim Option.");
            document.getElementById('model').focus();
        }
    };

    // 🏆 FIXED SUBMISSION HANDLER
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 🛑 PREVENT DOUBLE SUBMISSION with multiple methods
        if (isSubmitting || submissionRef.current) {
            console.log('🛑 Form already submitting, ignoring duplicate submit');
            return;
        }

        console.log('🛑 SUBMIT TRIGGERED - Client ID:', effectiveClientId);
        console.trace('📞 SUBMIT STACK TRACE');

        // 🛑 Mark as submitting
        submissionRef.current = true;
        setIsSubmitting(true);

        // 🛑 FIX: Use the effectiveClientId (which is propClientId) consistently
        const finalClientId = effectiveClientId || formData.clientId;
        
        // 🛑 FIX: Better validation for client ID
        if (!finalClientId || finalClientId === 'undefined' || finalClientId === undefined || finalClientId === '') {
            alert("Please select a client first.");
            submissionRef.current = false;
            setIsSubmitting(false);
            return;
        }

        // 🛑 FIX: Ensure client ID is a number
        const clientIdNum = parseInt(finalClientId);
        if (isNaN(clientIdNum)) {
            alert("Invalid client selection. Please select a client again.");
            submissionRef.current = false;
            setIsSubmitting(false);
            return;
        }

        if (!formData.year || !formData.make || !formData.model) {
            alert("Please complete the Year, Make, and Model fields.");
            submissionRef.current = false;
            setIsSubmitting(false);
            return;
        }

        try {
            console.log('🚀 Submitting vehicle data - Client ID:', clientIdNum);
            
            // Prepare data for backend (matching serializer fields)
            const dataToSend = {
                vin: formData.vin || '',
                license_plate: formData.licensePlate || '',
                vehicle_type: formData.vehicleType || '',
                year: formData.year,
                make: formData.make,
                model: formData.model,
                trim: formData.trim || '',
                transmission: formData.transmission || '',
                drivetrain: formData.drivetrain || '',
                engine: formData.engine || '',
                odo_reading: formData.odoReading || '',
                odo_unit: formData.odoUnit || 'miles',
                color: formData.color || '',
                unit_number: formData.unitNumber || '',
                notes: formData.notes || ''
            };

            console.log('🌐 Making SINGLE API request to:', `/clients/${clientIdNum}/vehicles/`);

            // 🛑 FIX: Use the validated clientIdNum in the API call
            const response = await apiClient.post(`/clients/${clientIdNum}/vehicles/`, dataToSend);
            
            console.log('✅ Vehicle saved successfully:', response.data);

            // Call the parent onSave handler
            if (onSave) {
                await onSave(response.data, isEditMode);
            }

        } catch (error) {
            console.error('❌ Failed to save vehicle:', error);
            
            let errorMessage = 'Failed to save vehicle. Please try again.';
            
            if (error.response?.data) {
                const errorData = error.response.data;
                
                // Handle validation errors from backend
                if (typeof errorData === 'object') {
                    const errorDetails = Object.entries(errorData)
                        .map(([field, messages]) => {
                            const cleanField = field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                            return `${cleanField}: ${Array.isArray(messages) ? messages.join(' ') : String(messages)}`;
                        })
                        .join('\n');
                    errorMessage = `Validation errors:\n${errorDetails}`;
                } else if (typeof errorData === 'string') {
                    errorMessage = errorData;
                }
            } else if (error.response?.status === 400) {
                errorMessage = 'Bad request. Please check your input data.';
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            alert(`Error saving vehicle: ${errorMessage}`);
        } finally {
            // 🛑 Reset submission state
            submissionRef.current = false;
            setIsSubmitting(false);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setVehicleImage(imageUrl);
        }
    };

    const triggerFileInput = () => {
        document.getElementById('vehicle-image-upload').click();
    };

    const mockYears = useMemo(() => {
        const startYear = 2050;
        const endYear = 1980;
        const years = [];
        for (let i = startYear; i >= endYear; i--) {
            years.push(i);
        }
        return years;
    }, []);

    const currentModels = useMemo(() => {
        const selectedMake = formData.make;
        return makeModelData[selectedMake] || [];
    }, [formData.make]);

    const ImagePreview = () => {
        if (vehicleImage) {
            return (
                <div className="image-preview-wrapper" style={{ backgroundImage: `url(${vehicleImage})` }}>
                </div>
            );
        }
        return (
            <div className="image-placeholder" onClick={triggerFileInput} title="Upload Vehicle Image">
            </div>
        );
    };

    return (
        <div className="vehicle-form-container">
            {/* 🏆 UPDATED HEADER */}
            <header className="page-header">
                <h2><FaCar /> {isEditMode ? 'Edit Vehicle' : 'New Vehicle'}</h2>
                <button 
                    type="button" 
                    className="btn-back-to-list" 
                    onClick={onCancel}
                >
                    <FaArrowLeft style={{ marginRight: '5px' }} /> Back to List
                </button>
            </header>

            {/* DEBUG INFO - Enhanced */}
            <div style={{ 
                background: '#fff3cd', 
                padding: '10px', 
                marginBottom: '20px', 
                borderRadius: '4px',
                border: '1px solid #ffeaa7',
                fontSize: '0.9rem'
            }}>
                <strong>Debug Info:</strong><br />
                Mode: {isEditMode ? 'EDIT' : 'CREATE'} | 
                Prop Client ID: <strong>{propClientId || 'NOT IN PROPS'}</strong> |
                Effective Client ID: <strong>{effectiveClientId || 'NOT FOUND'}</strong> |
                Form Client ID: <strong>{formData.clientId || 'NOT IN FORM'}</strong> | 
                Selected Client: {selectedClientName || 'None'}<br />
                Year: {formData.year || 'Not set'} | 
                Make: {formData.make || 'Not set'} | 
                Model: {formData.model || 'Not set'}<br />
                VIN: {formData.vin || 'Empty'}
            </div>

            {/* Clients Error Display */}
            {clientsError && (
                <div style={{ 
                    background: '#f8d7da', 
                    color: '#721c24', 
                    padding: '10px', 
                    marginBottom: '20px', 
                    borderRadius: '4px',
                    border: '1px solid #f5c6cb'
                }}>
                    <strong>Warning:</strong> {clientsError} Using fallback empty client list.
                </div>
            )}

            <form onSubmit={handleSubmit} className="form-card full-page-form vehicle-form">

                <input
                    type="file"
                    id="vehicle-image-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                />

                {/* Image & Label Section */}
                <div className="vehicle-header-actions">
                    <ImagePreview />
                    <button type="button" onClick={() => alert("Add Label function not yet implemented")} className="btn-secondary-action small-btn">
                        <FaTag /> Add Label
                    </button>
                    <button type="button" className="btn-primary-action small-btn" onClick={triggerFileInput}>
                        <FaImage /> Upload Image
                    </button>
                    <div className="icon-group">
                        <FaCamera className="icon-btn-form" title="Take Photo (Future feature)" />
                        <FaRulerHorizontal className="icon-btn-form" title="Measure" />
                    </div>
                </div>
                
                {/* Client Assignment Section */}
                <h4 className="form-section-title"><FaUserFriends /> Client Assignment</h4>
                <div className="form-grid-1">
                    <div className="form-group">
                        <label htmlFor="clientId">Client Name</label>
                        <select 
                            id="clientId" 
                            name="clientId" 
                            onChange={handleChange} 
                            value={formData.clientId}
                            disabled={loadingClients || !!effectiveClientId} // 🛑 Disable if we have a prop clientId
                        >
                            <option value="">
                                {loadingClients ? 'Loading clients from database...' : 
                                 effectiveClientId ? `Client ID: ${effectiveClientId} (pre-selected)` : 
                                 'Select client to assign vehicle'}
                            </option>
                            {clients.map(client => (
                                <option key={client.id} value={client.id}>
                                    {client.name}
                                </option>
                            ))}
                        </select>
                        {effectiveClientId && (
                            <small style={{ marginTop: '5px', display: 'block', color: '#28a745', fontSize: '12px' }}>
                                ✅ Client pre-selected from navigation
                            </small>
                        )}
                        {selectedClientName && (
                            <small style={{ marginTop: '5px', display: 'block', color: '#5d9cec', fontSize: '12px' }}>
                                Vehicle will be assigned to: <strong>{selectedClientName}</strong>
                            </small>
                        )}
                        {clients.length === 0 && !loadingClients && (
                            <small style={{ marginTop: '5px', display: 'block', color: '#dc3545', fontSize: '12px' }}>
                                No clients found. Please create a client first.
                            </small>
                        )}
                    </div>
                </div>

                {/* Vehicle Details */}
                <h4 className="form-section-title"><FaCar /> Vehicle Details</h4>
                <div className="form-grid-1">
                    <div className="form-group">
                        <label htmlFor="vin">VIN / Serial Number (Optional)</label>
                        <input 
                            type="text" 
                            id="vin" 
                            name="vin" 
                            placeholder="ENTER VIN OR SN (Optional)" 
                            onChange={handleChange} 
                            value={formData.vin} 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="licensePlate">License Plate</label>
                        <input type="text" id="licensePlate" name="licensePlate" placeholder="STATE & PLATE NUMBER EG: GAETNB642" onChange={handleChange} value={formData.licensePlate} />
                    </div>
                </div>

                {/* Vehicle Specifications */}
                <div className="form-grid-3">
                    <div className="form-group">
                        <label htmlFor="vehicleType">Vehicle Type</label>
                        <select id="vehicleType" name="vehicleType" onChange={handleChange} value={formData.vehicleType}>
                            <option value="">select vehicle type</option>
                            {vehicleBodyTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="year">Year</label>
                        <select id="year" name="year" onChange={handleChange} value={formData.year}>
                            <option value="">select vehicle year</option>
                            {mockYears.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="make">Make/Brand</label>
                        <select
                            id="make"
                            name="make"
                            onChange={handleChange}
                            value={formData.make}
                            disabled={!formData.year && formData.make === ''}
                            onFocus={handleMakeFocus}
                        >
                            <option
                                value=""
                                style={!formData.year ? { color: 'red', fontWeight: 'bold' } : {}}
                            >
                                {formData.year ? 'select vehicle make' : 'Please! Choose "Year" first'}
                            </option>
                            {vehicleMakes.map(make => (
                                <option key={make} value={make}>{make}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-grid-3">
                    <div className="form-group">
                        <label htmlFor="model">Model</label>
                        <select
                            id="model"
                            name="model"
                            onChange={handleChange}
                            value={formData.model}
                            disabled={!formData.make}
                        >
                            <option
                                value=""
                                style={!formData.make ? { color: 'red', fontWeight: 'bold' } : {}}
                            >
                                {formData.make ? 'select vehicle model' : 'Please! Choose "Make option" first'}
                            </option>
                            {currentModels.map(model => (
                                <option key={model} value={model}>{model}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="trim">Trim Option</label>
                        <select
                            id="trim"
                            name="trim"
                            onChange={handleChange}
                            value={formData.trim}
                            disabled={!formData.model}
                            onFocus={handleTrimFocus}
                        >
                            <option
                                value=""
                                style={!formData.model ? { color: 'red', fontWeight: 'bold' } : {}}
                            >
                                {formData.model ? 'select vehicle trim' : 'Please! Choose "Model" first'}
                            </option>
                            {mockTrimOptions.map(trim => (
                                <option key={trim} value={trim}>{trim}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="transmission">Transmission Type</label>
                        <select id="transmission" name="transmission" onChange={handleChange} value={formData.transmission}>
                            <option value="">select vehicle transmission</option>
                            {transmissionOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Color & Powertrain */}
                <h4 className="form-section-title"><FaPaintBrush /> Color & Powertrain</h4>
                <div className="form-grid-3">
                    <div className="form-group">
                        <label htmlFor="color">Exterior Color</label>
                        <input type="text" id="color" name="color" placeholder="Red, White, Black, etc." onChange={handleChange} value={formData.color} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="engine">Engine / Power Source</label>
                        <select id="engine" name="engine" onChange={handleChange} value={formData.engine}>
                            <option value="">select engine type/fuel</option>
                            {engineOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="drivetrain">Drivetrain</label>
                        <select id="drivetrain" name="drivetrain" onChange={handleChange} value={formData.drivetrain}>
                            <option value="">select drivetrain</option>
                            <option value="FWD">Front-Wheel Drive (FWD)</option>
                            <option value="RWD">Rear-Wheel Drive (RWD)</option>
                            <option value="AWD">All-Wheel Drive (AWD)</option>
                            <option value="4x4/4WD">4x4 / Four-Wheel Drive (4WD)</option>
                        </select>
                    </div>
                </div>
                
                {/* Mileage & Internal ID */}
                <h4 className="form-section-title"><FaRulerHorizontal /> Mileage & Internal ID</h4>
                <div className="form-grid-3">
                    <div className="form-group">
                        <label htmlFor="odoReading">Odometer Reading (Start)</label>
                        <input type="number" id="odoReading" name="odoReading" placeholder="0" onChange={handleChange} value={formData.odoReading} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="odoUnit">Odometer Unit</label>
                        <select id="odoUnit" name="odoUnit" onChange={handleChange} value={formData.odoUnit}>
                            <option value="miles">Miles</option>
                            <option value="kilometers">Kilometers</option>
                            <option value="hours">Hours (for equipment)</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="unitNumber">Internal Unit Number</label>
                        <input type="text" id="unitNumber" name="unitNumber" placeholder="U0001 or 12345" onChange={handleChange} value={formData.unitNumber} />
                    </div>
                </div>

                {/* Notes */}
                <div className="form-group full-width-group">
                    <label htmlFor="notes">Notes/Description</label>
                    <textarea 
                        id="notes" 
                        name="notes" 
                        rows="3" 
                        placeholder="Add internal notes, damage description, or special instructions." 
                        onChange={handleChange} 
                        value={formData.notes}
                    ></textarea>
                </div>

                {/* FORM ACTIONS */}
                <div className="page-form-actions">
                    <button type="button" onClick={onCancel} className="btn-secondary-action large-btn action-cancel-style" disabled={isSubmitting}>
                        <FaTimes style={{ marginRight: '8px' }} /> Cancel
                    </button>
                    <button type="submit" className="btn-primary-action large-btn action-save-style" disabled={isSubmitting}>
                        <FaSave style={{ marginRight: '8px' }} /> 
                        {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Vehicle' : 'Save Vehicle')}
                    </button>
                </div>
            </form>

            {/* COMPLETE STYLES */}
            <style jsx>{`
                .vehicle-form-container {
                    background-color: #f7f9fc;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                    max-width: 1900px;
                    margin: 20px auto;
                }
                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 2px solid #e0e0e0;
                    padding-bottom: 15px;
                    margin-bottom: 20px;
                }
                .page-header h2 {
                    margin: 0;
                    color: #333;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .btn-back-to-list {
                    background-color: #6c757d;
                    color: white;
                    border: none;
                    padding: 10px 15px;
                    border-radius: 6px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    transition: background-color 0.2s;
                }
                .btn-back-to-list:hover {
                    background-color: #5a6268;
                }
                .form-card {
                    background-color: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                    padding: 20px;
                }
                .full-page-form {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .vehicle-header-actions {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding: 15px;
                    background-color: #f8f9fa;
                    border-radius: 8px;
                    border: 1px solid #e9ecef;
                }
                .image-preview-wrapper {
                    width: 120px;
                    height: 80px;
                    border-radius: 6px;
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                    border: 2px solid #dee2e6;
                }
                .image-placeholder {
                    width: 120px;
                    height: 80px;
                    border-radius: 6px;
                    background-color: #e9ecef;
                    border: 2px dashed #adb5bd;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                .image-placeholder:hover {
                    background-color: #dee2e6;
                }
                .btn-secondary-action, .btn-primary-action {
                    padding: 8px 15px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: background-color 0.2s;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
                .btn-secondary-action {
                    background-color: #6c757d;
                    color: white;
                }
                .btn-secondary-action:hover {
                    background-color: #5a6268;
                }
                .btn-primary-action {
                    background-color: #007bff;
                    color: white;
                }
                .btn-primary-action:hover {
                    background-color: #0056b3;
                }
                .small-btn {
                    padding: 6px 12px;
                    font-size: 0.875rem;
                }
                .large-btn {
                    padding: 10px 20px;
                    font-size: 1rem;
                }
                .icon-group {
                    display: flex;
                    gap: 10px;
                    margin-left: auto;
                }
                .icon-btn-form {
                    font-size: 1.2rem;
                    color: #6c757d;
                    cursor: pointer;
                    transition: color 0.2s;
                }
                .icon-btn-form:hover {
                    color: #495057;
                }
                .form-section-title {
                    color: #007bff;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 10px;
                    margin-bottom: 15px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .form-grid-1 {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 15px;
                }
                .form-grid-3 {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 15px 20px;
                }
                .form-group {
                    display: flex;
                    flex-direction: column;
                }
                .full-width-group {
                    grid-column: 1 / -1;
                }
                .form-group label {
                    margin-bottom: 5px;
                    font-weight: 600;
                    color: #555;
                }
                .form-group input,
                .form-group select,
                .form-group textarea {
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 1em;
                    width: 100%;
                    box-sizing: border-box;
                    transition: border-color 0.2s;
                }
                .form-group input:focus,
                .form-group select:focus,
                .form-group textarea:focus {
                    outline: none;
                    border-color: #007bff;
                    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
                }
                .form-group textarea {
                    resize: vertical;
                    min-height: 80px;
                }
                .page-form-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    padding-top: 20px;
                    border-top: 1px solid #e9ecef;
                }
                .action-cancel-style {
                    background-color: #dc3545;
                }
                .action-cancel-style:hover {
                    background-color: #c82333;
                }
                .action-save-style {
                    background-color: #28a745;
                }
                .action-save-style:hover {
                    background-color: #218838;
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .vehicle-form-container {
                        padding: 10px;
                        margin: 10px;
                    }
                    .form-grid-3 {
                        grid-template-columns: 1fr;
                    }
                    .vehicle-header-actions {
                        flex-wrap: wrap;
                        justify-content: center;
                    }
                    .page-form-actions {
                        flex-direction: column;
                        gap: 10px;
                        align-items: stretch;
                    }
                    .page-form-actions button {
                        width: 100%;
                    }
                    .btn-back-to-list {
                        width: auto;
                    }
                }
            `}</style>
        </div>
    );
};

export default VehicleForm;