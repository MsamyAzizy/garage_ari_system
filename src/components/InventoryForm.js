// src/components/InventoryForm.js

import React, { useState } from 'react';
import { 
    FaPlus, 
    FaBarcode, 
    FaExternalLinkAlt, // For the external actions
    FaDollarSign,
    FaBox,
    FaThList,
    FaSave, 
    FaTimes,
    FaImage 
} from 'react-icons/fa';
// NOTE: FaTruck, FaTools, FaBuilding, FaCar icons were imported but unused, 
// they have been removed from the import list for final cleanup.

const InventoryForm = ({ onSave, onCancel }) => {
    // Mock state for form inputs
    const [formData, setFormData] = useState({
        itemNumber: '',
        category: '',
        name: '',
        stockQuantity: 1,
        unit: 'pc.',
        purchaseCost: 0,
        salePrice: 0,
        status: 'in stock',
        minCriticalQuantity: 0,
        warehouseLocation: '',
        vendor: '',
        vehicleCompatibility: '',
        notes: '',
        itemImage: null, 
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setFormData(prev => ({ ...prev, itemImage: imageUrl }));
        }
    };
    
    const triggerFileInput = () => {
        document.getElementById('item-image-upload').click();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    // --- Custom Image Placeholder/Preview Component ---
    const ImagePreview = () => {
        if (formData.itemImage) {
            return (
                <div className="image-preview-wrapper large-preview" style={{ backgroundImage: `url(${formData.itemImage})` }} onClick={triggerFileInput}>
                    {/* Image is set as background in CSS */}
                </div>
            );
        }
        return (
            <div className="image-placeholder large-placeholder" onClick={triggerFileInput} title="Upload Item Image">
                <FaImage className="placeholder-icon" />
            </div>
        );
    };
    // ----------------------------------------------------


    return (
        <div className="inventory-form-container">
            <header className="page-header">
                <h2><FaPlus /> Add Item</h2>
            </header>
            
            <form onSubmit={handleSubmit} className="form-card full-page-form inventory-form">
                
                {/* HIDDEN FILE INPUT */}
                <input 
                    type="file" 
                    id="item-image-upload" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    style={{ display: 'none' }} 
                />

                {/* Top Action Buttons (Scan, Order, Import) */}
                <div className="top-action-bar">
                    <button type="button" className="btn-primary-action large-btn">
                        <FaBarcode /> Scan Part Barcode
                    </button>
                    <button type="button" className="btn-secondary-action large-btn" style={{backgroundColor: '#6c757d'}}>
                        Order from PartsTech <FaExternalLinkAlt />
                    </button>
                    <button type="button" className="btn-secondary-action large-btn" style={{backgroundColor: '#6c757d'}}>
                        Import from Ebay <FaExternalLinkAlt />
                    </button>
                </div>
                
                {/* Main Form Content Grid */}
                <div className="inventory-content-grid">
                    
                    {/* Left Column: Image */}
                    <div className="image-column">
                        <ImagePreview />
                    </div>

                    {/* Right Column: Main Fields */}
                    <div className="fields-column">
                        
                        {/* 1. Identification (2-column layout) */}
                        <div className="form-grid-2">
                            <div className="form-group">
                                <label htmlFor="itemNumber">Item Number (ID.)</label>
                                <input 
                                    type="text" 
                                    id="itemNumber" 
                                    name="itemNumber" 
                                    placeholder="Enter Item" 
                                    value={formData.itemNumber}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group select-group">
                                <label htmlFor="category">Category</label>
                                <input 
                                    type="text" 
                                    id="category" 
                                    name="category" 
                                    placeholder="Select Category" 
                                    value={formData.category}
                                    onChange={handleInputChange}
                                />
                                <button type="button" className="btn-select">Select</button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="name">Item Name (Description)*</label>
                            <input 
                                type="text" 
                                id="name" 
                                name="name" 
                                placeholder="Enter Description" 
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* 2. Stock and Unit (2-column layout) */}
                        <div className="form-grid-2">
                            <div className="form-group">
                                <label htmlFor="stockQuantity">Stock Quantity</label>
                                <input 
                                    type="number" 
                                    id="stockQuantity" 
                                    name="stockQuantity" 
                                    min="0"
                                    value={formData.stockQuantity}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="unit">Unit</label>
                                <select 
                                    id="unit" 
                                    name="unit"
                                    value={formData.unit}
                                    onChange={handleInputChange}
                                >
                                    <option value="pc.">pc.</option>
                                    <option value="l">liter</option>
                                    <option value="set">set</option>
                                </select>
                            </div>
                        </div>

                        {/* 3. Pricing (2-column layout) */}
                        <div className="form-grid-2">
                            <div className="form-group">
                                <label htmlFor="purchaseCost">Purchase Cost (optional)</label>
                                <div className="input-with-icon">
                                    <FaDollarSign className="input-icon" />
                                    <input 
                                        type="number" 
                                        id="purchaseCost" 
                                        name="purchaseCost" 
                                        min="0"
                                        placeholder="0"
                                        value={formData.purchaseCost}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="salePrice">Sale Price($)*</label>
                                <div className="input-with-action">
                                    <div className="input-with-icon">
                                        <FaDollarSign className="input-icon" />
                                        <input 
                                            type="number" 
                                            id="salePrice" 
                                            name="salePrice" 
                                            min="0"
                                            placeholder="0"
                                            value={formData.salePrice}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <button type="button" className="btn-apply-markup">Apply Markup</button>
                                </div>
                            </div>
                        </div>

                        {/* 4. Status and Critical Quantity (2-column layout) */}
                        <h4 className="form-section-title"><FaBox /> Stock Control</h4>
                        <div className="form-grid-2">
                            <div className="form-group">
                                <label htmlFor="status">Status</label>
                                <select 
                                    id="status" 
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                >
                                    <option value="in stock">in stock</option>
                                    <option value="low stock">low stock</option>
                                    <option value="out of stock">out of stock</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="minCriticalQuantity">Minimum Critical Quantity (alert when stock is equal or below this number)</label>
                                <input 
                                    type="number" 
                                    id="minCriticalQuantity" 
                                    name="minCriticalQuantity" 
                                    min="0"
                                    value={formData.minCriticalQuantity}
                                    onChange={handleInputChange}
                                />
                                <span className="input-action-icon small-icon"><FaTimes /></span>
                            </div>
                        </div>

                        {/* 5. Other Details */}
                        <h4 className="form-section-title"><FaThList /> Other</h4>
                        <div className="form-group select-group">
                            <label htmlFor="warehouseLocation">Warehouse/Location</label>
                            <input 
                                type="text" 
                                id="warehouseLocation" 
                                name="warehouseLocation" 
                                placeholder="Where is the part located" 
                                value={formData.warehouseLocation}
                                onChange={handleInputChange}
                            />
                            <button type="button" className="btn-select">Select</button>
                        </div>
                        
                        <div className="form-group select-group">
                            <label htmlFor="vendor">Vendor/Supplier</label>
                            <input 
                                type="text" 
                                id="vendor" 
                                name="vendor" 
                                placeholder="Select Vendor Name" 
                                value={formData.vendor}
                                onChange={handleInputChange}
                            />
                            <button type="button" className="btn-select">Select</button>
                        </div>

                        <div className="form-group">
                            <label htmlFor="vehicleCompatibility">This part is suitable for following vehicles (Year, Make, Model)</label>
                            <input 
                                type="text" 
                                id="vehicleCompatibility" 
                                name="vehicleCompatibility" 
                                placeholder="eg. 2012 BMW, 328i E90, 330i" 
                                value={formData.vehicleCompatibility}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="notes">Notes</label>
                            <textarea 
                                id="notes" 
                                name="notes" 
                                rows="3" 
                                placeholder="Enter your notes here"
                                value={formData.notes}
                                onChange={handleInputChange}
                            ></textarea>
                        </div>
                        
                    </div> {/* End fields-column */}
                    
                </div> {/* End inventory-content-grid */}
                
                {/* 6. Form Actions (Sticky Footer) */}
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

export default InventoryForm;