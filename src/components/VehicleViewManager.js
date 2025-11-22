// src/components/VehicleViewManager.js - NO LOGIC CHANGES NEEDED

import React, { useState } from 'react';
import VehicleForm from './VehicleForm'; // Import the form component
import { FaCar, FaTag, FaRulerHorizontal } from 'react-icons/fa';

// MOCK Component for the Vehicle List View
const VehicleList = ({ onAddNewVehicle }) => (
    <div className="list-page-container">
        <header className="page-header">
            <h2><FaCar /> Vehicle List</h2>
            <button 
                className="btn-primary-action large-btn" 
                onClick={onAddNewVehicle}
                style={{ marginTop: '0' }}
            >
                + Add New Vehicle
            </button>
        </header>

        <div className="list-content-area" style={{ padding: '20px 0' }}>
            <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
                <p>This is where your list of vehicles will appear, showing key information from the form:</p>
                <ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: '15px 0' }}>
                    <li><FaTag /> **Make & Model:** [Toyota Camry]</li>
                    <li><FaRulerHorizontal /> **Year:** [2022]</li>
                    <li><FaCar /> **VIN:** [1234567890ABCDEF]</li>
                    <li><FaRulerHorizontal /> **Odometer:** [55,000 miles]</li>
                    <li>**Unit #:** [FLT-001]</li>
                    <li>**License Plate:** [GAETNB642]</li>
                </ul>
                <p>Use this structure as a foundation to fetch and display actual vehicle data.</p>
            </div>
        </div>
    </div>
);


const VehicleViewManager = () => {
    // State to determine which view to show: true for form, false for list.
    const [showVehicleForm, setShowVehicleForm] = useState(false); // Changed initial state to false (list view)

    const handleCancel = () => {
        // This switches the state to false, which renders the VehicleList
        console.log("Canceling Vehicle Form. Switching to List View.");
        setShowVehicleForm(false);
    };

    const handleSave = (vehicleData) => {
        console.log("Vehicle Saved:", vehicleData);
        // After save, return to the list view.
        setShowVehicleForm(false); 
    };

    const handleAddNewVehicle = () => {
        // Opens the VehicleForm
        setShowVehicleForm(true);
    };


    if (showVehicleForm) {
        return (
            <VehicleForm 
                onSave={handleSave} 
                onCancel={handleCancel} // Connects the Cancel button to the list view switch
            />
        );
    }

    // Renders the VehicleList when showVehicleForm is false
    return (
        <VehicleList onAddNewVehicle={handleAddNewVehicle} />
    );
};

export default VehicleViewManager;