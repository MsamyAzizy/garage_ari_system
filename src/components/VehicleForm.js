// src/components/VehicleForm.js - FINAL CLEAN CODE

import React, { useState } from 'react';
import { 
    FaCar, 
    FaCamera, 
    FaRulerHorizontal, 
    FaTag, 
    FaPaintBrush, 
    FaSave,
    FaTimes,
    FaImage 
} from 'react-icons/fa';

const VehicleForm = ({ onSave, onCancel }) => {
    // State to hold the selected image file URL
    const [vehicleImage, setVehicleImage] = useState(null);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real application, collect and validate form data, including the image file
        const vehicleData = { vin: 'MOCKVIN123', licensePlate: 'MOCKPLATE', image: vehicleImage };
        onSave(vehicleData);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Create a URL for the image file to display a preview
            const imageUrl = URL.createObjectURL(file);
            setVehicleImage(imageUrl);
        }
    };
    
    // Function to trigger the hidden file input click
    const triggerFileInput = () => {
        document.getElementById('vehicle-image-upload').click();
    };

    // --- Custom Image Placeholder/Preview ---
    const ImagePreview = () => {
        if (vehicleImage) {
            return (
                <div className="image-preview-wrapper" style={{ backgroundImage: `url(${vehicleImage})` }}>
                    {/* The image is set as background for better cropping/cover */}
                </div>
            );
        }
        // Original placeholder structure when no image is selected
        return (
            <div className="image-placeholder" onClick={triggerFileInput} title="Upload Vehicle Image">
                {/* Image placeholder content (defined in layout.css using ::before) */}
            </div>
        );
    };
    // ----------------------------------------


    return (
        <div className="vehicle-form-container">
            <header className="page-header vehicle-header">
                <h2><FaCar /> New Vehicle</h2>
            </header>
            
            <form onSubmit={handleSubmit} className="form-card full-page-form vehicle-form">
                
                {/* HIDDEN FILE INPUT */}
                <input 
                    type="file" 
                    id="vehicle-image-upload" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    style={{ display: 'none' }} 
                />

                {/* Image & Label Section (Top Bar) */}
                <div className="vehicle-header-actions">
                    
                    {/* Image Preview / Placeholder Component */}
                    <ImagePreview /> 

                    <button type="button" className="btn-secondary-action small-btn">
                        <FaTag /> Add Label
                    </button>
                    
                    {/* Primary Image Upload Button */}
                    <button type="button" className="btn-primary-action small-btn" onClick={triggerFileInput}>
                        <FaImage /> Upload Image
                    </button>

                    {/* Secondary Action Icons */}
                    <div className="icon-group">
                        <FaCamera className="icon-btn-form" title="Take Photo (Future feature)" />
                        <FaRulerHorizontal className="icon-btn-form" title="Measure" />
                    </div>
                </div>

                {/* 1. Primary Identifiers */}
                <h4 className="form-section-title"><FaCar /> Vehicle Details</h4>
                <div className="form-grid-1">
                    <div className="form-group">
                        <label htmlFor="vin">VIN / Serial Number</label>
                        <input type="text" id="vin" name="vin" placeholder="ENTER VIN OR SN" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="licensePlate">License Plate</label>
                        <input type="text" id="licensePlate" name="licensePlate" placeholder="STATE & PLATE NUMBER EG: GAETNB642" />
                    </div>
                </div>

                {/* 2. Vehicle Specifications (3-column layout) */}
                <div className="form-grid-3">
                    <div className="form-group">
                        <label htmlFor="vehicleType">Vehicle Type</label>
                        <select id="vehicleType" name="vehicleType">
                            <option value="">select vehicle type</option>
                            <option>SUV</option>
                            <option>Harrier Anaconda</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="year">Year</label>
                        <select id="year" name="year">
                            <option value="">select vehicle year</option>
                            <option>2020</option>
                            <option>2019</option>
                            <option>2018</option>
                            <option>2017</option>
                            <option>2016</option>
                            <option>2015</option>
                            <option>2014</option>
                            <option>2013</option>
                            <option>2012</option>
                            <option>2011</option>
                            <option>2010</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="make">Make</label>
                        <select id="make" name="make">
                            <option value="">select vehicle make</option>
                        </select>
                    </div>
                </div>

                <div className="form-grid-3">
                    <div className="form-group">
                        <label htmlFor="model">Model</label>
                        <select id="model" name="model">
                            <option value="">select vehicle model</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="trim">Trim Option</label>
                        <select id="trim" name="trim">
                            <option value="">select vehicle trim</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="transmission">Transmission Type</label>
                        <select id="transmission" name="transmission">
                            <option value="">select vehicle transmission</option>
                            <option>Automatic Transmission - ATM</option>
                            <option>Manual Transmission - MTM</option>
                            <option>Automatic - Manual Transmission - AMTM</option>

                        </select>
                    </div>
                </div>

                <div className="form-grid-3">
                    <div className="form-group">
                        <label htmlFor="drivetrain">Driven Wheels</label>
                        <select id="drivetrain" name="drivetrain">
                            <option value="">select vehicle drivetrain</option>
                            <option>Front left-wheel</option>
                            <option>Front right-wheel</option>
                        </select>
                    </div>
                    <div className="form-group full-span">
                        <label htmlFor="engine">Engine</label>
                        <select id="engine" name="enginee">
                            <option value="">select engine</option>
                            <option>12-cylinder</option>
                            <option>06-cylinder</option>
                            <option>04-cylinder</option>
                            <option>03-cylinder</option>
                        </select>                        
                    </div>
                    {/* Placeholder to align grid */}
                    <div className="form-group"></div>
                </div>


                {/* 3. Condition & Other Details */}
                <h4 className="form-section-title"><FaPaintBrush /> Condition & Notes</h4>
                <div className="form-grid-3">
                    <div className="form-group reading-group">
                        <label htmlFor="odoReading">Current ODO reading</label>
                        <div className="input-with-select">
                            <input type="number" id="odoReading" name="odoReading" placeholder="eg. 8000" />
                            <select name="odoUnit" className="unit-select">
                                <option>miles</option>
                                <option>km</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="color">Color</label>
                        <input type="text" id="color" name="color" placeholder="eg. red" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="unitNumber">Unit Number</label>
                        <input type="text" id="unitNumber" name="unitNumber" placeholder="input unit number" />
                    </div>
                </div>
                
                <div className="form-group">
                    <label htmlFor="notes">Notes</label>
                    <textarea id="notes" name="notes" rows="3" placeholder="enter notes"></textarea>
                    <p className="note-text">Internal notes, cannot be seen by the client and won't show up on invoices</p>
                </div>

                {/* 4. More Info Placeholder */}
                <h4 className="form-section-title">More info</h4>
                <div className="placeholder-section">
                    <p>Check the options below to find more info about this vehicle. Make sure you enter a valid VIN!</p>
                </div>
                
                {/* 5. Form Actions (Sticky Footer) */}
                <div className="form-actions page-form-actions">
                    <button type="button" onClick={onCancel} className="btn-secondary-action">
                        <FaTimes /> Cancel
                    </button>
                    <button type="submit" className="btn-primary-action">
                        <FaSave /> Save
                    </button>
                </div>
            </form>
        </div>
    );
};

export default VehicleForm;