// src/components/BusinessAssetForm.js

import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';

const BusinessAssetForm = ({ onSave, onCancel, navigateTo }) => {
    // State for basic asset fields
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        serialNumber: '',
        value: 0,
        dateAcquired: '',
        note: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'value' ? Number(value) : value
        }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        console.log("Saving Business Asset:", formData);
        if (onSave) onSave(formData);
    };

    return (
        <div className="full-page-form">
            {/* Header Area */}
            <div className="page-header" style={{ alignItems: 'flex-start', borderBottom: 'none' }}>
                {/* Back Button and Title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <FaArrowLeft 
                        onClick={() => navigateTo('/inventory/asset')} 
                        style={{ cursor: 'pointer', fontSize: '1.5rem', color: 'var(--text-color)' }} 
                        title="Back to Asset List"
                    />
                    <h2 style={{ paddingBottom: 0, borderBottom: 'none' }}>Add Business Asset</h2>
                </div>
            </div>
            
            <form onSubmit={handleSave}>
                <div className="form-card full-page-form" style={{ padding: '20px 30px' }}>
                    
                    {/* Name and Category */}
                    <div className="form-grid-2">
                        <div className="form-group">
                            <label htmlFor="name">Asset Name*</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="eg. Diagnostic Scanner"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="category">Category</label>
                            <input
                                type="text"
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                placeholder="eg. Tooling or Equipment"
                            />
                        </div>
                    </div>

                    {/* Serial Number and Value */}
                    <div className="form-grid-2">
                        <div className="form-group">
                            <label htmlFor="serialNumber">Serial/Model Number</label>
                            <input
                                type="text"
                                id="serialNumber"
                                name="serialNumber"
                                value={formData.serialNumber}
                                onChange={handleChange}
                                placeholder="Enter serial or model number"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="value">Purchase Value ($)*</label>
                            <input
                                type="number"
                                id="value"
                                name="value"
                                value={formData.value}
                                onChange={handleChange}
                                min="0"
                                required
                            />
                        </div>
                    </div>
                    
                    {/* Date Acquired */}
                    <div className="form-grid-2">
                        <div className="form-group">
                            <label htmlFor="dateAcquired">Date Acquired</label>
                            <input
                                type="date"
                                id="dateAcquired"
                                name="dateAcquired"
                                value={formData.dateAcquired}
                                onChange={handleChange}
                            />
                        </div>
                        <div></div> {/* Placeholder for alignment */}
                    </div>

                    {/* Note Area */}
                    <div className="form-grid-1">
                        <div className="form-group">
                            <label htmlFor="note">Note</label>
                            <textarea
                                id="note"
                                name="note"
                                rows="3"
                                value={formData.note}
                                onChange={handleChange}
                                placeholder="Any details about the asset..."
                            />
                        </div>
                    </div>

                </div>

                {/* Sticky Footer Actions */}
                <div className="form-actions page-form-actions">
                    <button 
                        type="submit" 
                        className="btn-primary-action large-btn"
                    >
                        Save
                    </button>
                    {onCancel && (
                        <button 
                            type="button" 
                            className="btn-secondary-action large-btn" 
                            onClick={onCancel} 
                            style={{ order: 0 }}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default BusinessAssetForm;