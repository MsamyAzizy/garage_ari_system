// src/components/LaborForm.js

import React, { useState } from 'react';
import { FaArrowLeft, FaTimesCircle } from 'react-icons/fa';

const LaborForm = ({ onSave, onCancel, navigateTo }) => {
    // State to manage form data
    const [formData, setFormData] = useState({
        laborTitle: '',
        description: '',
        type: '',
        code: '',
        isFixedLabor: false, // Matches the 'not active' state in the image
        rate: 0,
        hours: 0,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' || type === 'switch' 
                ? checked : (name === 'rate' || name === 'hours' ? Number(value) : value)
        }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        console.log("Saving Labor Item:", formData);
        if (onSave) onSave(formData);
    };

    // Placeholder for "Select" button functionality
    const handleSelect = (field) => {
        alert(`Selecting value for ${field}...`);
    };

    return (
        <div className="full-page-form">
            {/* Header Area */}
            <div className="page-header" style={{ alignItems: 'flex-start', borderBottom: 'none' }}>
                {/* Back Button and Title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <FaArrowLeft 
                        onClick={() => navigateTo('/inventory')} 
                        style={{ cursor: 'pointer', fontSize: '1.5rem', color: 'var(--text-color)' }} 
                        title="Back to Inventory List"
                    />
                    <h2 style={{ paddingBottom: 0, borderBottom: 'none' }}>Add Labor</h2>
                </div>
            </div>
            
            <form onSubmit={handleSave}>
                <div className="form-card full-page-form" style={{ padding: '20px 30px' }}>
                    
                    {/* Labor Title */}
                    <div className="form-grid-1">
                        <div className="form-group">
                            <label htmlFor="laborTitle">Labor Title*</label>
                            <input
                                type="text"
                                id="laborTitle"
                                name="laborTitle"
                                value={formData.laborTitle}
                                onChange={handleChange}
                                placeholder="Enter service name"
                                required
                            />
                        </div>
                    </div>
                    
                    {/* Description */}
                    <div className="form-grid-1">
                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                rows="3"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter Description"
                            />
                        </div>
                    </div>

                    {/* Type and Code */}
                    <div className="form-grid-2">
                        <div className="form-group select-group">
                            <label htmlFor="type">Type</label>
                            <select
                                id="type"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                            >
                                <option value="">Select service type</option>
                                {/* Add real options here later */}
                            </select>
                            <button 
                                type="button" 
                                className="btn-select" 
                                onClick={() => handleSelect('Type')}
                            >
                                Select
                            </button>
                        </div>

                        <div className="form-group">
                            <label htmlFor="code">Code</label>
                            <input
                                type="text"
                                id="code"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                placeholder="Enter service code"
                            />
                        </div>
                    </div>
                    
                    {/* Fixed Labor Toggle */}
                    <div className="form-grid-1" style={{ marginBottom: '20px' }}>
                        <div className="form-group flex-group">
                            <label htmlFor="isFixedLabor" style={{ flexGrow: 1 }}>Fixed Labor (not active)</label>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    id="isFixedLabor"
                                    name="isFixedLabor"
                                    checked={formData.isFixedLabor}
                                    onChange={handleChange}
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>

                    {/* Rate / Hour and Hours */}
                    <div className="form-grid-2">
                        <div className="form-group">
                            <label htmlFor="rate">Rate / Hour ($)*</label>
                            <div className="input-with-icon">
                                {/* Note: No explicit $ icon in the image, but the field is zeroed out like the previous form */}
                                <input
                                    type="number"
                                    id="rate"
                                    name="rate"
                                    value={formData.rate}
                                    onChange={handleChange}
                                    min="0"
                                    required
                                />
                                {formData.rate > 0 && (
                                    <FaTimesCircle 
                                        className="input-action-icon" 
                                        onClick={() => setFormData(prev => ({...prev, rate: 0}))}
                                        title="Clear Rate"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="hours">Hours*</label>
                            <div className="input-with-icon">
                                <input
                                    type="number"
                                    id="hours"
                                    name="hours"
                                    value={formData.hours}
                                    onChange={handleChange}
                                    min="0"
                                    required
                                />
                                {formData.hours > 0 && (
                                    <FaTimesCircle 
                                        className="input-action-icon" 
                                        onClick={() => setFormData(prev => ({...prev, hours: 0}))}
                                        title="Clear Hours"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    
                </div>

                {/* Sticky Footer Actions */}
                <div className="form-actions page-form-actions">
                    <button 
                        type="submit" // Use type="submit" here for form submission
                        className="btn-primary-action large-btn"
                    >
                        Save
                    </button>
                    {/* Cancel button usually exists but is often hidden by the sticky save bar */}
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

export default LaborForm;