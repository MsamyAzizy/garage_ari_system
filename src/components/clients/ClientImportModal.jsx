import React, { useState } from 'react';
import api from '../../api/apiClient'; // 👈 Adjust this path to your API client

function ClientImportModal({ onClose, onSuccess }) {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);

    const handleFileChange = (event) => {
        // Get the first file selected by the user
        setFile(event.target.files[0]);
        setMessage('');
        setError(null);
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a CSV file first.');
            return;
        }

        setLoading(true);
        setError(null);
        setMessage('');

        // 1. Create the file upload container
        const formData = new FormData();
        
        // 2. 🚨 CRITICAL FIX: Attach the file using the key 'file' 
        //    This matches what the Django backend expects (request.data['file'])
        formData.append('file', file); 

        try {
            const response = await api.post('/clients/import/', formData, {
                // The browser typically sets the correct Content-Type: multipart/form-data
                // automatically when using FormData, but it can be specified if needed.
            });

            // Handle successful import
            setMessage(response.data.message || 'Clients imported successfully!');
            onSuccess(); // Call a function to refresh the client list
            
        } catch (err) {
            // Handle errors from the Django backend
            const responseData = err.response?.data;
            
            if (responseData && responseData.message) {
                // Display the specific error message from the backend (e.g., validation errors)
                setError(responseData.message);
                // You might also display detailed_errors if they exist
                console.error("Detailed Import Errors:", responseData.detailed_errors);
            } else {
                setError('An unexpected error occurred during upload.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="import-modal-container">
            <h3>Import Clients from CSV</h3>
            
            <input 
                type="file" 
                accept=".csv" 
                onChange={handleFileChange} 
                disabled={loading}
            />

            <button onClick={handleUpload} disabled={loading || !file}>
                {loading ? 'Uploading...' : 'Import Data'}
            </button>
            
            <button onClick={onClose} disabled={loading}>
                Close
            </button>

            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">Error: {error}</p>}
            
            <p className="note">
                Please ensure your CSV headers match the exported format (e.g., "First Name", "Email").
            </p>
        </div>
    );
}

export default ClientImportModal;