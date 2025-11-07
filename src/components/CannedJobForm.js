// src/components/CannedJobForm.js - FINAL (Unused setJobItems removed)

import React, { useState } from 'react';
import { FaArrowLeft, FaPlusCircle, FaRedoAlt } from 'react-icons/fa';

// Placeholder data structure for items added to the Canned Job
const initialItems = [
    // Example structure if data existed
    // { id: 1, type: 'Part', serviceName: 'Oil Filter', description: 'Engine oil filter', price: 15.00, quantity: 1, rate: null, hours: null, total: 15.00 },
    // { id: 2, type: 'Labor', serviceName: 'Oil Change', description: 'Standard labor', price: 0, quantity: null, rate: 85.00, hours: 0.5, total: 42.50 },
];

const CannedJobForm = ({ onSave, onCancel, navigateTo }) => {
    // State to manage form header data
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });
    // State to manage the list of parts and labor items. setJobItems removed.
    const [jobItems] = useState(initialItems); 
    // State to manage the calculated total
    const [grandTotal, setGrandTotal] = useState(0);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        console.log("Saving Canned Job:", { ...formData, jobItems, grandTotal });
        if (onSave) onSave({ ...formData, jobItems, grandTotal });
    };

    const handleAddItem = (type) => {
        // Placeholder for opening a modal or side panel to select/add a Part or Labor item
        alert(`Adding new ${type} item...`);
        // If we were implementing item addition, this is where setJobItems would be used:
        // setJobItems(prevItems => [...prevItems, newItem]);
    };

    const calculateTotal = () => {
        // Simple placeholder calculation logic: sum of total fields in jobItems
        const newTotal = jobItems.reduce((sum, item) => sum + (item.total || 0), 0);
        setGrandTotal(newTotal);
        console.log("Total updated:", newTotal);
    };

    const isDataAvailable = jobItems.length > 0;
    
    // Structure for the table columns
    const tableHeaders = ['Type', 'Service Name', 'Description', 'Price', 'Quantity', 'Rate', 'Hours', 'Total'];


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
                    <h2 style={{ paddingBottom: 0, borderBottom: 'none' }}>Canned Job</h2>
                </div>
            </div>
            
            <form onSubmit={handleSave}>
                <div className="form-card full-page-form" style={{ padding: '20px 30px' }}>
                    
                    {/* Name */}
                    <div className="form-grid-1">
                        <div className="form-group">
                            <label htmlFor="name">Name*</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter package name"
                                required
                            />
                        </div>
                    </div>
                    
                    {/* Description */}
                    <div className="form-grid-1" style={{ marginBottom: '20px' }}>
                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                rows="3"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter package description"
                            />
                        </div>
                    </div>

                    {/* Add Parts / Add Labor Buttons */}
                    <div className="form-grid-2" style={{ gap: '10px', marginBottom: '30px' }}>
                        <button 
                            type="button" 
                            className="btn-secondary-action large-btn" 
                            onClick={() => handleAddItem('Part')}
                            style={{ 
                                background: 'white', 
                                color: 'var(--primary-color)', 
                                border: '1px solid #73b754' // Green border
                            }}
                        >
                            <FaPlusCircle style={{ marginRight: '8px', color: '#73b754' }}/> Add parts
                        </button>
                        <button 
                            type="button" 
                            className="btn-secondary-action large-btn" 
                            onClick={() => handleAddItem('Labor')}
                            style={{ 
                                background: 'white', 
                                color: 'var(--primary-color)', 
                                border: '1px solid #9471f5' // Purple border
                            }}
                        >
                            <FaPlusCircle style={{ marginRight: '8px', color: '#9471f5' }}/> Add labor
                        </button>
                    </div>

                    {/* Parts & Labor Table */}
                    <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>Parts & Labor*</h3>

                    <div className="table-responsive" style={{ minHeight: '150px' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    {tableHeaders.map(header => (
                                        <th key={header}>{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {!isDataAvailable ? (
                                    <tr>
                                        <td colSpan={tableHeaders.length} style={{ textAlign: 'center', padding: '50px' }}>
                                            No data available
                                        </td>
                                    </tr>
                                ) : (
                                    // Render jobItems here if available
                                    jobItems.map(item => (
                                        <tr key={item.id}>
                                            <td>{item.type}</td>
                                            <td>{item.serviceName}</td>
                                            <td>{item.description}</td>
                                            <td>${item.price.toFixed(2)}</td>
                                            <td>{item.quantity}</td>
                                            <td>{item.rate ? `$${item.rate.toFixed(2)}` : 'N/A'}</td>
                                            <td>{item.hours || 'N/A'}</td>
                                            <td>${item.total.toFixed(2)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                            
                        </table>
                    </div>
                    
                    {/* Grand Total Footer */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '15px 0' }}>
                        <h4 style={{ margin: 0, fontWeight: 'bold' }}>
                            Grand Total: ${grandTotal.toFixed(2)}
                        </h4>
                        <button 
                            type="button" 
                            className="btn-secondary-action" 
                            onClick={calculateTotal}
                            style={{ 
                                marginLeft: '15px', 
                                padding: '5px 15px',
                                background: 'white', 
                                color: 'var(--primary-color)',
                                border: '1px solid var(--primary-color)'
                            }}
                        >
                            <FaRedoAlt style={{ marginRight: '5px' }} /> Update Total
                        </button>
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

export default CannedJobForm;