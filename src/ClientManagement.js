// src/ClientManagement.js

import React, { useState } from 'react';
// Import the components we just worked on
import ClientForm from './components/ClientDetailForm';
import ClientList from './components/ClientList';

// Import the mock data
import initialClients from './mockClientData';

// Generate a simple unique ID (for frontend simulation)
const generateId = () => {
    return 'c' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

const ClientManagement = () => {
    // State to hold the list of all clients
    const [clients, setClients] = useState(initialClients);
    // State to control which view is visible (list or form)
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'form'

    const handleSaveClient = (newClientData) => {
        const newClient = {
            ...newClientData,
            id: generateId(),
            // Ensure fields like city are present even if state is empty
            address: `${newClientData.addressLine1}${newClientData.city ? ', ' + newClientData.city : ''}`,
        };

        // 1. Update the state (simulating adding to the database)
        setClients(prevClients => [newClient, ...prevClients]); 

        // 2. Switch back to the list view
        setViewMode('list'); 
    };

    const handleCancelForm = () => {
        setViewMode('list');
    };
    
    // Logic to toggle between the form and the list
    const renderContent = () => {
        if (viewMode === 'form') {
            return (
                <ClientForm 
                    onSave={handleSaveClient} 
                    onCancel={handleCancelForm} 
                />
            );
        }
        
        return (
            <>
                <div className="list-page-header">
                    <h2>Client Directory</h2>
                    <button 
                        onClick={() => setViewMode('form')}
                        className="btn-primary-action"
                    >
                        + Add New Client
                    </button>
                </div>
                <ClientList clients={clients} />
            </>
        );
    };

    return (
        <div className="client-management-dashboard">
            {renderContent()}
            
            <style jsx global>{`
                /* Global layout adjustments for the Client Management page */
                .client-management-dashboard {
                    padding: 20px;
                }
                .list-page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }
                .list-page-header h2 {
                    font-size: 24px;
                    font-weight: 700;
                    color: #333333;
                }
                body.dark-theme .list-page-header h2 {
                    color: #ffffff;
                }
            `}</style>
        </div>
    );
};

export default ClientManagement;