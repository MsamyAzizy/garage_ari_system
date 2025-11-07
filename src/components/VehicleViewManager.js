// src/components/VehicleViewManager.js - NEW FILE

import React, { useState } from 'react';
import VehicleForm from './VehicleForm'; // Import the form component
import { FaCar } from 'react-icons/fa';

// MOCK Component for the Vehicle List View
const VehicleList = ({ onAddNewVehicle }) => (
    <div className="list-page-container">
        <header className="page-header">
            <h2><FaCar /> Vehicle List</h2>
        </header>
        <div className="list-content-area" style={{ textAlign: 'center', padding: '50px' }}>
            <p>This is where your list of vehicles will appear.</p>
            <p>Click the button below to add a new vehicle.</p>
            <button 
                className="btn-primary-action large-btn" 
                onClick={onAddNewVehicle}
                style={{ marginTop: '20px' }}
            >
                + Add New Vehicle
            </button>
        </div>
    </div>
);


const VehicleViewManager = () => {
    // State to determine which view to show: true for form, false for list.
    const [showVehicleForm, setShowVehicleForm] = useState(true);

    const handleCancel = () => {
        console.log("Canceling Vehicle Form. Switching to List View.");
        setShowVehicleForm(false);
    };

    const handleSave = (vehicleData) => {
        console.log("Vehicle Saved:", vehicleData);
        // In a real app, you would send this to the server, then navigate back.
        setShowVehicleForm(false); 
    };

    const handleAddNewVehicle = () => {
        setShowVehicleForm(true);
    };


    if (showVehicleForm) {
        return (
            <VehicleForm 
                onSave={handleSave} 
                onCancel={handleCancel} // Connects the Cancel button to the state change
            />
        );
    }

    return (
        <VehicleList onAddNewVehicle={handleAddNewVehicle} />
    );
};

export default VehicleViewManager;