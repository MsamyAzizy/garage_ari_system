// src/components/AddClient.js (Example component for saving a new client)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utils/apiClient'; // Assuming you use apiClient for POST requests

const DANGER_RED = '#ff4d4f'; 

const AddClient = () => {
    const [formData, setFormData] = useState({ 
        first_name: '', 
        last_name: '', 
        email: '', 
        phone_number: '',
        address: '',
        client_type: 'Individual' // Default type
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            // 🛑 1. Perform the POST request to create the client
            const response = await apiClient.post('/clients/', formData);

            const savedClient = response.data;
            const clientName = (savedClient.full_name || `${savedClient.first_name} ${savedClient.last_name}`).trim();

            // ✅ 2. Navigate back to the Clients list, passing the success message in the state
            navigate('/clients', { 
                state: { 
                    successMessage: `Client **${clientName}** was successfully saved!` 
                } 
            });

        } catch (err) {
            console.error("Client save error:", err.response ? err.response.data : err.message);
            setError("Failed to save client. Please check the form data and server status.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="form-page-container">
            <h2>Add New Client</h2>
            
            {error && (
                <div style={{ padding: '10px', backgroundColor: '#fdd', color: DANGER_RED, borderRadius: '4px', marginBottom: '20px' }}>
                    Error: {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="client-form-card">
                <div className="form-group">
                    <label>First Name</label>
                    <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
                </div>
                {/* ... other form fields (last_name, email, etc.) ... */}
                
                <button type="submit" disabled={saving} className="btn-save">
                    {saving ? 'Saving Client...' : 'Save Client'}
                </button>
            </form>
            
            {/* Note: You would include your styles here */}
        </div>
    );
};

export default AddClient;