// src/components/InventoryForm.js

import React, { useState } from 'react';
import { 
    FaPlus, 
    FaBarcode, 
    FaExternalLinkAlt,
    FaMoneyBill,
    FaBox,
    FaThList,
    FaSave, 
    FaTimes,
    FaImage,
   // FaSearch,
    //FaPercent,
    FaWarehouse,
    FaTruck,
    //FaEdit,
   // FaTrash,
   // FaEye,
    FaExclamationTriangle,
    //FaSort,
   // FaSortUp,
   // FaSortDown,
    FaCamera,
    FaTag,
    FaUser,
    FaCar,
    FaMapMarkerAlt,
    FaCalculator
} from 'react-icons/fa';

const InventoryForm = ({ onSave, onCancel, initialData = null, isEditing = false }) => {
    // Initialize form data with initialData if provided (for editing)
    const [formData, setFormData] = useState(initialData || {
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

    const [markupPercentage, setMarkupPercentage] = useState(30);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showVendorDropdown, setShowVendorDropdown] = useState(false);
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);

    // Sample categories, vendors, and locations
    const categories = ['Brakes', 'Engine', 'Transmission', 'Suspension', 'Electrical', 'Body Parts', 'Interior', 'Tools'];
    const vendors = ['AutoZone', 'NAPA', 'OReilly', 'Dealership', 'Local Supplier', 'Online Store'];
    const locations = ['Main Warehouse', 'Shop Shelf A', 'Shop Shelf B', 'Storage Room', 'Tool Cabinet'];

    // Format currency to Tsh
    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return '0';
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount)) return '0';
        
        return new Intl.NumberFormat('en-TZ', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(numAmount);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: name === 'purchaseCost' || name === 'salePrice' || name === 'stockQuantity' 
                ? parseFloat(value) || 0 
                : value 
        }));
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
        
        // Generate item number if not provided
        const finalData = {
            ...formData,
            itemNumber: formData.itemNumber || `ITEM-${Date.now().toString().slice(-6)}`,
            id: initialData?.id || Date.now(),
            lastUpdated: new Date().toISOString(),
            created: initialData?.created || new Date().toISOString()
        };
        
        onSave(finalData);
        
        // Reset form if not editing
        if (!isEditing) {
            setFormData({
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
        }
    };

    const applyMarkup = () => {
        if (formData.purchaseCost > 0) {
            const markupAmount = (formData.purchaseCost * markupPercentage) / 100;
            const newSalePrice = formData.purchaseCost + markupAmount;
            setFormData(prev => ({ ...prev, salePrice: parseFloat(newSalePrice.toFixed(0)) }));
        }
    };

    const handleCategorySelect = (category) => {
        setFormData(prev => ({ ...prev, category }));
        setShowCategoryDropdown(false);
    };

    const handleVendorSelect = (vendor) => {
        setFormData(prev => ({ ...prev, vendor }));
        setShowVendorDropdown(false);
    };

    const handleLocationSelect = (location) => {
        setFormData(prev => ({ ...prev, warehouseLocation: location }));
        setShowLocationDropdown(false);
    };

    // --- Custom Image Preview Component ---
    const ImagePreview = () => {
        return (
            <div className="image-upload-section">
                <div 
                    className={`image-preview-container ${formData.itemImage ? 'has-image' : ''}`}
                    onClick={triggerFileInput}
                >
                    {formData.itemImage ? (
                        <div 
                            className="image-preview" 
                            style={{ backgroundImage: `url(${formData.itemImage})` }}
                        >
                            <div className="image-overlay">
                                <FaCamera size={24} />
                                <span>Change Image</span>
                            </div>
                        </div>
                    ) : (
                        <div className="image-placeholder">
                            <FaImage size={32} className="placeholder-icon" />
                            <span>Upload Item Image</span>
                            <span className="placeholder-subtext">Click to browse or drag & drop</span>
                        </div>
                    )}
                </div>
                
                {formData.itemImage && (
                    <button 
                        type="button" 
                        className="btn-remove-image"
                        onClick={(e) => {
                            e.stopPropagation();
                            setFormData(prev => ({ ...prev, itemImage: null }));
                        }}
                    >
                        Remove Image
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="inventory-form-container">
            <style jsx>{`
                /* ----------------------------------------------------------------- */
                /* INVENTORY FORM STYLES */
                /* ----------------------------------------------------------------- */
                .inventory-form-container {
                    max-width: 1900px;
                    margin: 0 auto;
                    padding: 24px;
                    background: #f8fafc;
                    min-height: 100vh;
                }

                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                    padding-bottom: 20px;
                    border-bottom: 2px solid #e2e8f0;
                }

                .page-header h2 {
                    font-size: 28px;
                    font-weight: 700;
                    color: #1e293b;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin: 0;
                }

                .form-card {
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    overflow: hidden;
                    border: 1px solid #e2e8f0;
                }

                /* Top Action Bar */
                .top-action-bar {
                    display: flex;
                    gap: 16px;
                    padding: 24px;
                    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                    border-bottom: 1px solid #e2e8f0;
                }

                .btn-primary-action, .btn-secondary-action {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 14px 24px;
                    border: none;
                    border-radius: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 15px;
                }

                .btn-primary-action {
                    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                    color: white;
                    box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);
                }

                .btn-primary-action:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 12px rgba(59, 130, 246, 0.4);
                }

                .btn-secondary-action {
                    background: #64748b;
                    color: white;
                    box-shadow: 0 4px 6px rgba(100, 116, 139, 0.3);
                }

                .btn-secondary-action:hover {
                    background: #475569;
                    transform: translateY(-2px);
                }

                .large-btn {
                    flex: 1;
                    justify-content: center;
                }

                /* Main Content Grid */
                .inventory-content-grid {
                    display: grid;
                    grid-template-columns: 300px 1fr;
                    gap: 30px;
                    padding: 30px;
                }

                /* Image Column */
                .image-upload-section {
                    position: sticky;
                    top: 30px;
                }

                .image-preview-container {
                    width: 100%;
                    height: 300px;
                    border: 2px dashed #cbd5e1;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    overflow: hidden;
                    position: relative;
                }

                .image-preview-container:hover {
                    border-color: #3b82f6;
                    transform: translateY(-2px);
                }

                .image-preview-container.has-image {
                    border-style: solid;
                }

                .image-preview {
                    width: 100%;
                    height: 100%;
                    background-size: cover;
                    background-position: center;
                    position: relative;
                }

                .image-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.6);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .image-preview:hover .image-overlay {
                    opacity: 1;
                }

                .image-placeholder {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: #64748b;
                    text-align: center;
                    padding: 20px;
                }

                .placeholder-icon {
                    margin-bottom: 16px;
                    color: #94a3b8;
                }

                .placeholder-subtext {
                    font-size: 12px;
                    color: #94a3b8;
                    margin-top: 8px;
                }

                .btn-remove-image {
                    margin-top: 12px;
                    padding: 8px 16px;
                    background: #fef2f2;
                    color: #dc2626;
                    border: 1px solid #fecaca;
                    border-radius: 8px;
                    font-size: 14px;
                    cursor: pointer;
                    width: 100%;
                }

                .btn-remove-image:hover {
                    background: #fee2e2;
                }

                /* Fields Column */
                .fields-column {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                }

                .form-section-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: #1e293b;
                    margin: 20px 0 10px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .form-grid-2 {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }

                .form-group {
                    margin-bottom: 20px;
                }

                .form-group label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 500;
                    color: #475569;
                    font-size: 14px;
                }

                .form-group input,
                .form-group select,
                .form-group textarea {
                    width: 100%;
                    padding: 12px 16px;
                    border: 1px solid #cbd5e1;
                    border-radius: 8px;
                    font-size: 15px;
                    color: #1e293b;
                    background: white;
                    transition: all 0.2s ease;
                }

                .form-group input:focus,
                .form-group select:focus,
                .form-group textarea:focus {
                    outline: none;
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }

                .form-group input::placeholder,
                .form-group textarea::placeholder {
                    color: #94a3b8;
                }

                /* Select Groups with Dropdown */
                .select-group {
                    position: relative;
                }

                .select-group input {
                    padding-right: 100px;
                }

                .btn-select {
                    position: absolute;
                    right: 4px;
                    top: 36px;
                    padding: 10px 16px;
                    background: #e2e8f0;
                    border: none;
                    border-radius: 6px;
                    color: #475569;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background 0.2s ease;
                }

                .btn-select:hover {
                    background: #cbd5e1;
                }

                /* Dropdown Menus */
                .dropdown-menu {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    z-index: 1000;
                    max-height: 200px;
                    overflow-y: auto;
                    margin-top: 4px;
                }

                .dropdown-item {
                    padding: 12px 16px;
                    cursor: pointer;
                    transition: background 0.2s ease;
                    color: #475569;
                }

                .dropdown-item:hover {
                    background: #f1f5f9;
                }

                /* Input with Icon */
                .input-with-icon {
                    position: relative;
                }

                .input-with-icon .input-icon {
                    position: absolute;
                    left: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #64748b;
                }

                .input-with-icon input {
                    padding-left: 42px;
                }

                /* Tsh Currency Input */
                .input-with-tsh {
                    position: relative;
                }

                .input-with-tsh input {
                    padding-left: 42px;
                    padding-right: 60px;
                }

                .tsh-icon {
                    position: absolute;
                    left: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #64748b;
                }

                .tsh-label {
                    position: absolute;
                    right: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #64748b;
                    font-weight: 600;
                    font-size: 14px;
                }

                /* Input with Action */
                .input-with-action {
                    display: flex;
                    gap: 10px;
                }

                .input-with-action .input-with-tsh {
                    flex: 1;
                }

                .btn-apply-markup {
                    padding: 12px 20px;
                    background: #10b981;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    white-space: nowrap;
                    transition: background 0.2s ease;
                }

                .btn-apply-markup:hover {
                    background: #059669;
                }

                .markup-control {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-top: 10px;
                }

                .markup-control input {
                    width: 80px;
                    padding: 8px 12px;
                }

                /* Input Action Icon */
                .input-action-icon {
                    position: absolute;
                    right: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #94a3b8;
                    cursor: pointer;
                    padding: 4px;
                }

                .input-action-icon:hover {
                    color: #64748b;
                }

                /* Form Actions */
                .form-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 16px;
                    padding: 24px;
                    background: #f8fafc;
                    border-top: 1px solid #e2e8f0;
                    position: sticky;
                    bottom: 0;
                }

                .form-actions button {
                    min-width: 120px;
                }

                /* Textarea */
                .form-group textarea {
                    resize: vertical;
                    min-height: 100px;
                    font-family: inherit;
                }

                /* Status Indicators */
                .status-indicator {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                    margin-left: 10px;
                }

                .status-in-stock {
                    background: #d1fae5;
                    color: #065f46;
                }

                .status-low-stock {
                    background: #fef3c7;
                    color: #92400e;
                }

                .status-out-of-stock {
                    background: #fee2e2;
                    color: #991b1b;
                }

                /* Required Field Indicator */
                .required::after {
                    content: "*";
                    color: #ef4444;
                    margin-left: 4px;
                }

                /* Currency Display */
                .currency-display {
                    background: #f1f5f9;
                    border: 1px solid #cbd5e1;
                    border-radius: 8px;
                    padding: 12px 16px;
                    margin-top: 8px;
                    font-size: 14px;
                    color: #475569;
                }

                .currency-display strong {
                    color: #1e293b;
                }

                /* Responsive Design */
                @media (max-width: 1024px) {
                    .inventory-content-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .image-upload-section {
                        position: static;
                    }
                    
                    .image-preview-container {
                        height: 250px;
                    }
                }

                @media (max-width: 768px) {
                    .inventory-form-container {
                        padding: 16px;
                    }
                    
                    .form-grid-2 {
                        grid-template-columns: 1fr;
                        gap: 16px;
                    }
                    
                    .top-action-bar {
                        flex-direction: column;
                    }
                    
                    .form-actions {
                        flex-direction: column-reverse;
                    }
                    
                    .form-actions button {
                        width: 100%;
                    }
                }

                @media (max-width: 480px) {
                    .input-with-action {
                        flex-direction: column;
                    }
                    
                    .btn-apply-markup {
                        width: 100%;
                    }
                }

                /* Animations */
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .form-card {
                    animation: fadeIn 0.3s ease-out;
                }

                /* Utility Classes */
                .mt-4 { margin-top: 1rem; }
                .mb-4 { margin-bottom: 1rem; }
                .text-sm { font-size: 14px; }
                .text-muted { color: #64748b; }
                .font-bold { font-weight: 600; }

                /* Scrollbar Styling */
                ::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }

                ::-webkit-scrollbar-track {
                    background: #f1f5f9;
                    border-radius: 4px;
                }

                ::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 4px;
                }

                ::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            `}</style>
            
            <header className="page-header">
                <h2><FaPlus /> {isEditing ? 'Edit Item' : 'Add New Item'}</h2>
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

                {/* Top Action Buttons */}
                <div className="top-action-bar">
                    <button type="button" className="btn-primary-action large-btn">
                        <FaBarcode /> Scan Part Barcode
                    </button>
                    <button type="button" className="btn-secondary-action large-btn">
                        Order from PartsTech <FaExternalLinkAlt />
                    </button>
                    <button type="button" className="btn-secondary-action large-btn">
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
                        
                        {/* 1. Identification */}
                        <div className="form-grid-2">
                            <div className="form-group">
                                <label htmlFor="itemNumber">
                                    Item Number (ID.)
                                </label>
                                <input 
                                    type="text" 
                                    id="itemNumber" 
                                    name="itemNumber" 
                                    placeholder="Auto-generated if empty" 
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
                                    onFocus={() => setShowCategoryDropdown(true)}
                                />
                                <button 
                                    type="button" 
                                    className="btn-select"
                                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                >
                                    <FaTag /> Select
                                </button>
                                
                                {showCategoryDropdown && (
                                    <div className="dropdown-menu">
                                        {categories.map(category => (
                                            <div 
                                                key={category}
                                                className="dropdown-item"
                                                onClick={() => handleCategorySelect(category)}
                                            >
                                                {category}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="name" className="required">
                                Item Name (Description)
                            </label>
                            <input 
                                type="text" 
                                id="name" 
                                name="name" 
                                placeholder="Enter item description" 
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {/* 2. Stock and Unit */}
                        <div className="form-grid-2">
                            <div className="form-group">
                                <label htmlFor="stockQuantity" className="required">
                                    Stock Quantity
                                </label>
                                <input 
                                    type="number" 
                                    id="stockQuantity" 
                                    name="stockQuantity" 
                                    min="0"
                                    step="0.01"
                                    value={formData.stockQuantity}
                                    onChange={handleInputChange}
                                    required
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
                                    <option value="pc.">Piece (pc.)</option>
                                    <option value="l">Liter (l)</option>
                                    <option value="set">Set</option>
                                    <option value="kg">Kilogram (kg)</option>
                                    <option value="box">Box</option>
                                    <option value="pair">Pair</option>
                                </select>
                            </div>
                        </div>

                        {/* 3. Pricing */}
                        <div className="form-grid-2">
                            <div className="form-group">
                                <label htmlFor="purchaseCost">
                                    Purchase Cost
                                </label>
                                <div className="input-with-tsh">
                                    <FaMoneyBill className="tsh-icon" />
                                    <input 
                                        type="number" 
                                        id="purchaseCost" 
                                        name="purchaseCost" 
                                        min="0"
                                        step="1"
                                        placeholder="0"
                                        value={formData.purchaseCost}
                                        onChange={handleInputChange}
                                    />
                                    <span className="tsh-label">Tsh</span>
                                </div>
                                <div className="currency-display">
                                    Cost from supplier: <strong>{formatCurrency(formData.purchaseCost)} Tsh</strong>
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="salePrice" className="required">
                                    Sale Price
                                </label>
                                <div className="input-with-action">
                                    <div className="input-with-tsh">
                                        <FaMoneyBill className="tsh-icon" />
                                        <input 
                                            type="number" 
                                            id="salePrice" 
                                            name="salePrice" 
                                            min="0"
                                            step="1"
                                            placeholder="0"
                                            value={formData.salePrice}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <span className="tsh-label">Tsh</span>
                                    </div>
                                    <button 
                                        type="button" 
                                        className="btn-apply-markup"
                                        onClick={applyMarkup}
                                    >
                                        <FaCalculator /> Apply Markup
                                    </button>
                                </div>
                                <div className="markup-control">
                                    <span className="text-sm">Markup:</span>
                                    <input 
                                        type="number"
                                        value={markupPercentage}
                                        onChange={(e) => setMarkupPercentage(parseFloat(e.target.value) || 0)}
                                        min="0"
                                        max="500"
                                        step="5"
                                    />
                                    <span className="text-sm">%</span>
                                </div>
                                <div className="currency-display">
                                    Sale Price: <strong>{formatCurrency(formData.salePrice)} Tsh</strong>
                                </div>
                            </div>
                        </div>

                        {/* 4. Stock Control */}
                        <h4 className="form-section-title"><FaBox /> Stock Control</h4>
                        <div className="form-grid-2">
                            <div className="form-group">
                                <label htmlFor="status">
                                    Status
                                    {formData.status && (
                                        <span className={`status-indicator status-${formData.status.replace(' ', '-')}`}>
                                            {formData.status === 'in stock' && '✓'}
                                            {formData.status === 'low stock' && '⚠'}
                                            {formData.status === 'out of stock' && '✗'}
                                        </span>
                                    )}
                                </label>
                                <select 
                                    id="status" 
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                >
                                    <option value="in stock">In Stock</option>
                                    <option value="low stock">Low Stock</option>
                                    <option value="out of stock">Out of Stock</option>
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="minCriticalQuantity">
                                    Minimum Critical Quantity
                                    {formData.minCriticalQuantity > 0 && formData.stockQuantity <= formData.minCriticalQuantity && (
                                        <span className="status-indicator status-low-stock">
                                            <FaExclamationTriangle /> Alert Active
                                        </span>
                                    )}
                                </label>
                                <div className="input-with-icon">
                                    <FaExclamationTriangle className="input-icon" />
                                    <input 
                                        type="number" 
                                        id="minCriticalQuantity" 
                                        name="minCriticalQuantity" 
                                        min="0"
                                        value={formData.minCriticalQuantity}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <span className="text-sm text-muted">Alert when stock ≤ this number</span>
                            </div>
                        </div>

                        {/* 5. Other Details */}
                        <h4 className="form-section-title"><FaThList /> Additional Details</h4>
                        
                        <div className="form-group select-group">
                            <label htmlFor="warehouseLocation">
                                <FaWarehouse /> Warehouse/Location
                            </label>
                            <input 
                                type="text" 
                                id="warehouseLocation" 
                                name="warehouseLocation" 
                                placeholder="Where is the part located" 
                                value={formData.warehouseLocation}
                                onChange={handleInputChange}
                                onFocus={() => setShowLocationDropdown(true)}
                            />
                            <button 
                                type="button" 
                                className="btn-select"
                                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                            >
                                <FaMapMarkerAlt /> Select
                            </button>
                            
                            {showLocationDropdown && (
                                <div className="dropdown-menu">
                                    {locations.map(location => (
                                        <div 
                                            key={location}
                                            className="dropdown-item"
                                            onClick={() => handleLocationSelect(location)}
                                        >
                                            {location}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        <div className="form-group select-group">
                            <label htmlFor="vendor">
                                <FaUser /> Vendor/Supplier
                            </label>
                            <input 
                                type="text" 
                                id="vendor" 
                                name="vendor" 
                                placeholder="Select Vendor Name" 
                                value={formData.vendor}
                                onChange={handleInputChange}
                                onFocus={() => setShowVendorDropdown(true)}
                            />
                            <button 
                                type="button" 
                                className="btn-select"
                                onClick={() => setShowVendorDropdown(!showVendorDropdown)}
                            >
                                <FaTruck /> Select
                            </button>
                            
                            {showVendorDropdown && (
                                <div className="dropdown-menu">
                                    {vendors.map(vendor => (
                                        <div 
                                            key={vendor}
                                            className="dropdown-item"
                                            onClick={() => handleVendorSelect(vendor)}
                                        >
                                            {vendor}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="vehicleCompatibility">
                                <FaCar /> Vehicle Compatibility
                            </label>
                            <input 
                                type="text" 
                                id="vehicleCompatibility" 
                                name="vehicleCompatibility" 
                                placeholder="eg. 2012 BMW 328i E90, 330i" 
                                value={formData.vehicleCompatibility}
                                onChange={handleInputChange}
                            />
                            <span className="text-sm text-muted">Year, Make, Model separated by commas</span>
                        </div>

                        <div className="form-group">
                            <label htmlFor="notes">
                                Notes & Additional Information
                            </label>
                            <textarea 
                                id="notes" 
                                name="notes" 
                                rows="3" 
                                placeholder="Enter any additional notes, specifications, or special instructions..."
                                value={formData.notes}
                                onChange={handleInputChange}
                            ></textarea>
                        </div>
                        
                    </div> {/* End fields-column */}
                    
                </div> {/* End inventory-content-grid */}
                
                {/* Form Actions */}
                <div className="form-actions page-form-actions">
                    <button 
                        type="button" 
                        onClick={onCancel} 
                        className="btn-secondary-action"
                    >
                        <FaTimes /> Cancel
                    </button>
                    <button 
                        type="submit" 
                        className="btn-primary-action"
                    >
                        <FaSave /> {isEditing ? 'Update Item' : 'Save Item'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default InventoryForm;