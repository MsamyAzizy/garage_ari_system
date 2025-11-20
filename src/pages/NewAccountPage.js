// src/pages/NewAccountPage.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import AccountForm from '../components/AccountForm'; // Import the form we've been working on

const NewAccountPage = () => {
    const navigate = useNavigate();

    /**
     * Handles the saving of the new account data.
     * @param {object} data - The form data object.
     */
    const handleSaveNewAccount = (data) => {
        console.log("Attempting to create new account:", data);
        
        // --- REAL WORLD SCENARIO ---
        // 1. Call API: axios.post('/api/accounts', data)
        // 2. Handle success/error messages

        alert(`Successfully created Account: ${data.accountName} (${data.accountCode})`);
        
        // After successful save, navigate back to the list view or to the new account's view
        navigate('/accounting/accounts'); 
    };

    /**
     * Handles cancellation and navigates the user back to the list.
     */
    const handleCancel = () => {
        navigate('/accounting/accounts'); 
    };

    return (
        <div className="page-wrapper">
            {/* The AccountForm handles its own layout and heading */}
            <AccountForm 
                onSave={handleSaveNewAccount} 
                onCancel={handleCancel} 
            />
        </div>
    );
};

export default NewAccountPage;