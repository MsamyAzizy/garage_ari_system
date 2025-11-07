// src/components/TireForm.js - FINAL (Unused Import Removed)

import React, { useState } from 'react';
// ⚠️ FaRedoAlt removed from imports as it was unused
import { FaArrowLeft, FaDollarSign, FaTimesCircle } from 'react-icons/fa'; 

const TireForm = ({ onSave, onCancel, navigateTo }) => {
    // State to manage form data (minimal example)
    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        seasonality: 'All Seasons',
        vendor: '',
        size: '',
        itemNumber: '',
        quantity: 1,
        purchaseCost: 0,
        salePrice: 0,
        warehouseLocation: '',
        note: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'quantity' || name === 'purchaseCost' || name === 'salePrice' 
                ? Number(value) : value
        }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        console.log("Saving Tire Inventory:", formData);
        // Simulate save operation and call the prop
        if (onSave) onSave(formData);
    };

    const handleApplyMarkup = () => {
        // Simple logic: apply a 50% markup to the cost
        const newPrice = formData.purchaseCost * 1.5;
        setFormData(prev => ({ ...prev, salePrice: Math.ceil(newPrice) }));
    };

    const handleClearCost = () => {
        setFormData(prev => ({ ...prev, purchaseCost: 0 }));
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
                    <h2 style={{ paddingBottom: 0, borderBottom: 'none' }}>Tire</h2>
                </div>
                
                {/* Scan Button */}
                <button className="btn-secondary-action large-btn" style={{ background: '#28a745' }}>
                    Scan Tire
                </button>
            </div>
            
            <form onSubmit={handleSave}>
                <div className="form-card full-page-form" style={{ padding: '20px 30px' }}>
                    {/* First Row: Brand and Model (3-column layout) */}
                    <div className="form-grid-2">
                        <div className="form-group select-group">
                            <label htmlFor="brand">Brand*</label>
                            <input
                                type="text"
                                id="brand"
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                placeholder="eg. Pirelli"
                                required
                            />
                            <button 
                                type="button" 
                                className="btn-select" 
                                onClick={() => handleSelect('Brand')}
                            >
                                Select
                            </button>
                        </div>

                        <div className="form-group select-group">
                            <label htmlFor="model">Model*</label>
                            <input
                                type="text"
                                id="model"
                                name="model"
                                value={formData.model}
                                onChange={handleChange}
                                placeholder="eg. Super Slick"
                                required
                            />
                            <button 
                                type="button" 
                                className="btn-select" 
                                onClick={() => handleSelect('Model')}
                            >
                                Select
                            </button>
                        </div>
                    </div>

                    {/* Second Row: Seasonality and Vendor (3-column layout) */}
                    <div className="form-grid-2">
                        <div className="form-group">
                            <label htmlFor="seasonality">Seasonality*</label>
                            <select
                                id="seasonality"
                                name="seasonality"
                                value={formData.seasonality}
                                onChange={handleChange}
                                required
                            >
                                <option value="All Seasons">All Seasons</option>
                                <option value="Summer">Summer</option>
                                <option value="Winter">Winter</option>
                            </select>
                        </div>
                        
                        <div className="form-group select-group">
                            <label htmlFor="vendor">Vendor</label>
                            <input
                                type="text"
                                id="vendor"
                                name="vendor"
                                value={formData.vendor}
                                onChange={handleChange}
                                placeholder="Select a vendor"
                            />
                            <button 
                                type="button" 
                                className="btn-select" 
                                onClick={() => handleSelect('Vendor')}
                            >
                                Select
                            </button>
                        </div>
                    </div>

                    {/* Third Row: Size and Blank Space */}
                    <div className="form-grid-2">
                        <div className="form-group select-group">
                            <label htmlFor="size">Size*</label>
                            <input
                                type="text"
                                id="size"
                                name="size"
                                value={formData.size}
                                onChange={handleChange}
                                placeholder="eg. 235/45 R18 88H"
                                required
                            />
                             <button 
                                type="button" 
                                className="btn-select" 
                                onClick={() => handleSelect('Size')}
                            >
                                Select
                            </button>
                        </div>
                        {/* Empty placeholder for alignment */}
                        <div></div> 
                    </div>

                    {/* Fourth Row: Item Number and Quantity in Stock */}
                    <div className="form-grid-2">
                        <div className="form-group">
                            <label htmlFor="itemNumber">Item Number</label>
                            <input
                                type="text"
                                id="itemNumber"
                                name="itemNumber"
                                value={formData.itemNumber}
                                onChange={handleChange}
                                placeholder="Enter item SKU"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="quantity">Quantity in Stock</label>
                            <input
                                type="number"
                                id="quantity"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                min="0"
                            />
                        </div>
                    </div>

                    {/* Fifth Row: Purchase Cost and Sale Price */}
                    <div className="form-grid-2">
                        <div className="form-group">
                            <label htmlFor="purchaseCost">Purchase Cost ($)</label>
                            <div className="input-with-icon">
                                <FaDollarSign className="input-icon" />
                                <input
                                    type="number"
                                    id="purchaseCost"
                                    name="purchaseCost"
                                    value={formData.purchaseCost}
                                    onChange={handleChange}
                                    min="0"
                                />
                                {formData.purchaseCost > 0 && (
                                    <FaTimesCircle 
                                        className="input-action-icon" 
                                        onClick={handleClearCost}
                                        title="Clear Cost"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="salePrice">Sale Price ($)*</label>
                            <div className="input-with-action">
                                <div className="input-with-icon">
                                    <FaDollarSign className="input-icon" />
                                    <input
                                        type="number"
                                        id="salePrice"
                                        name="salePrice"
                                        value={formData.salePrice}
                                        onChange={handleChange}
                                        min="0"
                                        required
                                    />
                                </div>
                                <button 
                                    type="button" 
                                    className="btn-apply-markup" 
                                    onClick={handleApplyMarkup}
                                >
                                    Apply markup
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sixth Row: Warehouse Location */}
                    <div className="form-grid-2">
                        <div className="form-group select-group">
                            <label htmlFor="warehouseLocation">Warehouse/Location</label>
                            <input
                                type="text"
                                id="warehouseLocation"
                                name="warehouseLocation"
                                value={formData.warehouseLocation}
                                onChange={handleChange}
                                placeholder="Where is the part located"
                            />
                            <button 
                                type="button" 
                                className="btn-select" 
                                onClick={() => handleSelect('Location')}
                            >
                                Select
                            </button>
                        </div>
                        {/* Empty placeholder for alignment */}
                        <div></div> 
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
                                placeholder="Enter note"
                            />
                            <p className="note-text" style={{ marginTop: '10px' }}>
                                🚫 These Notes cannot be seen by the client and will NOT show up on invoices
                            </p>
                        </div>
                    </div>

                </div>

                {/* Sticky Footer Actions */}
                <div className="form-actions page-form-actions">
                    <button 
                        type="button" 
                        className="btn-primary-action large-btn"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                    {/* Assuming you want a Cancel button, though not visible in the sticky bar image */}
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

export default TireForm;