// src/components/PurchaseOrderForm.js

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { FaSave, FaTimes, FaPlus, FaTrash, FaClipboardList } from 'react-icons/fa';

// Mock data for dropdowns (replace with API calls later)
const mockSuppliers = [
    { id: 101, name: 'Auto Parts Inc.', taxId: 'TPI-123', currency: 'TZS', defaultTaxRate: 18 },
    { id: 102, name: 'Tool Mart Ltd.', taxId: 'TPI-456', currency: 'USD', defaultTaxRate: 0 },
    { id: 103, name: 'Local Distributor', taxId: 'TPI-789', currency: 'TZS', defaultTaxRate: 18 },
];

const PurchaseOrderForm = ({ onSave, onCancel }) => {
    const { poId } = useParams();
    const isEditMode = !!poId;
    
    const [formData, setFormData] = useState({
        poNo: '',
        poDate: new Date().toISOString().split('T')[0],
        supplierId: '',
        supplierName: '',
        supplierTaxId: '',
        expectedDeliveryDate: '',
        status: 'Draft',
        notes: '',
        currency: 'TZS',
        taxRate: 0, // Tax rate percentage applied to the entire PO
    });
    
    const [lineItems, setLineItems] = useState([
        { id: 1, partNo: '', description: '', quantity: 1, unitCost: 0, total: 0 }
    ]);
    
    const [totals, setTotals] = useState({
        subTotal: 0,
        taxAmount: 0,
        grandTotalAmount: 0,
    });
    
    // --- Mock Data Fetch (Simulate fetching PO details for edit mode) ---
    useEffect(() => {
        if (isEditMode) {
            // Mock API call to fetch existing PO data
            const mockPoData = {
                poId: poId,
                poNo: `PO-2025-${poId.slice(-3)}`,
                poDate: '2025-10-20',
                supplierId: 101,
                supplierName: 'Auto Parts Inc.',
                supplierTaxId: 'TPI-123',
                expectedDeliveryDate: '2025-10-25',
                status: 'Sent',
                notes: 'Urgent order for Job Card JC-4001.',
                currency: 'TZS',
                taxRate: 18,
            };
            
            const mockItems = [
                { id: 1, partNo: 'OIL-100', description: 'Engine Oil Filter', quantity: 2, unitCost: 35000, total: 70000 },
                { id: 2, partNo: 'BRAKE-05', description: 'Front Brake Pads Set', quantity: 1, unitCost: 180000, total: 180000 },
            ];
            
            setFormData(mockPoData);
            setLineItems(mockItems);
        } else {
            // Set initial PO number for new PO
            setFormData(prev => ({ ...prev, poNo: 'PO-NEW-001' }));
        }
    }, [isEditMode, poId]);
    
    
    // --- Calculation Logic ---
    const calculateTotals = useCallback((items, currentTaxRate) => {
        const subTotal = items.reduce((sum, item) => sum + item.total, 0);
        const taxRateDecimal = currentTaxRate / 100;
        const taxAmount = subTotal * taxRateDecimal;
        const grandTotalAmount = subTotal + taxAmount;
        
        setTotals({
            subTotal: subTotal,
            taxAmount: taxAmount,
            grandTotalAmount: grandTotalAmount,
        });
    }, []);
    
    useEffect(() => {
        calculateTotals(lineItems, formData.taxRate);
    }, [lineItems, formData.taxRate, calculateTotals]);

    
    // --- Handlers ---
    
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        
        // Handle Supplier selection
        if (name === 'supplierId') {
            const selectedSupplier = mockSuppliers.find(s => s.id === Number(value));
            if (selectedSupplier) {
                setFormData(prev => ({
                    ...prev,
                    supplierId: value,
                    supplierName: selectedSupplier.name,
                    supplierTaxId: selectedSupplier.taxId,
                    currency: selectedSupplier.currency,
                    taxRate: selectedSupplier.defaultTaxRate,
                }));
            } else {
                 setFormData(prev => ({ ...prev, supplierId: value }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleLineItemChange = (id, field, value) => {
        setLineItems(prevItems => prevItems.map(item => {
            if (item.id === id) {
                let updatedItem = { ...item, [field]: value };
                
                // Recalculate total for the line item
                if (field === 'quantity' || field === 'unitCost') {
                    const quantity = parseFloat(updatedItem.quantity) || 0;
                    const unitCost = parseFloat(updatedItem.unitCost) || 0;
                    updatedItem.total = quantity * unitCost;
                }
                return updatedItem;
            }
            return item;
        }));
    };
    
    const handleAddItem = () => {
        setLineItems(prevItems => [
            ...prevItems,
            { id: Date.now(), partNo: '', description: '', quantity: 1, unitCost: 0, total: 0 }
        ]);
    };
    
    const handleRemoveItem = (id) => {
        setLineItems(prevItems => prevItems.filter(item => item.id !== id));
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Final structure for API submission
        const finalData = {
            ...formData,
            lineItems: lineItems.filter(item => item.description), // Filter out empty lines
            ...totals,
            // Convert to a submission format suitable for the API 
            // (e.g., date formats, numeric types)
            poId: isEditMode ? poId : Date.now().toString(), // Mock ID for creation
            isEditMode: isEditMode
        };
        
        console.log('Submitting Purchase Order:', finalData);
        // Call the save handler defined in Home.js
        onSave(finalData, isEditMode);
    };
    
    
    // --- Render Logic ---

    return (
        <div className="list-page-container app-form">
            <header className="page-header po-form-header">
                <h2 style={{ flexGrow: 1 }}>
                    <FaClipboardList style={{ marginRight: '8px' }}/> 
                    {isEditMode ? `Edit Purchase Order #${formData.poNo}` : 'Create New Purchase Order'}
                </h2>
            </header>
            
            <form onSubmit={handleSubmit}>
                {/* --- Section 1: PO Header Details --- */}
                <div className="form-section-header">Order Details</div>
                <div className="form-grid">
                    
                    <div className="form-group">
                        <label>PO Number</label>
                        <input 
                            type="text" 
                            name="poNo" 
                            value={formData.poNo} 
                            onChange={handleFormChange} 
                            placeholder="Automatically generated"
                            readOnly={isEditMode} // Usually read-only in edit mode
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>PO Date *</label>
                        <input 
                            type="date" 
                            name="poDate" 
                            value={formData.poDate} 
                            onChange={handleFormChange} 
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Expected Delivery Date</label>
                        <input 
                            type="date" 
                            name="expectedDeliveryDate" 
                            value={formData.expectedDeliveryDate} 
                            onChange={handleFormChange} 
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Status</label>
                        <select 
                            name="status" 
                            value={formData.status} 
                            onChange={handleFormChange}
                        >
                            <option value="Draft">Draft</option>
                            <option value="Sent">Sent</option>
                            <option value="Received">Received</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
                
                <hr className="form-divider" />
                
                {/* --- Section 2: Supplier Details --- */}
                <div className="form-section-header">Supplier Information</div>
                <div className="form-grid">
                    
                    <div className="form-group">
                        <label>Supplier *</label>
                        <select 
                            name="supplierId" 
                            value={formData.supplierId} 
                            onChange={handleFormChange} 
                            required
                        >
                            <option value="">-- Select Supplier --</option>
                            {mockSuppliers.map(supplier => (
                                <option key={supplier.id} value={supplier.id}>
                                    {supplier.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label>Tax ID</label>
                        <input 
                            type="text" 
                            value={formData.supplierTaxId} 
                            readOnly 
                            disabled
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Currency</label>
                        <input 
                            type="text" 
                            value={formData.currency} 
                            readOnly 
                            disabled
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Tax Rate (%)</label>
                        <input 
                            type="number" 
                            name="taxRate" 
                            value={formData.taxRate} 
                            onChange={handleFormChange} 
                            min="0"
                        />
                    </div>
                </div>
                
                <hr className="form-divider" />

                {/* --- Section 3: Line Items (Table) --- */}
                <div className="form-section-header">Line Items</div>
                <div className="line-item-table-container">
                    <table className="data-table line-item-table">
                        <thead>
                            <tr>
                                <th style={{ width: '10%' }}>Part No.</th>
                                <th style={{ width: '35%' }}>Description *</th>
                                <th style={{ width: '10%', textAlign: 'right' }}>Qty *</th>
                                <th style={{ width: '15%', textAlign: 'right' }}>Unit Cost ({formData.currency})*</th>
                                <th style={{ width: '15%', textAlign: 'right' }}>Total ({formData.currency})</th>
                                <th style={{ width: '5%' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {lineItems.map((item, index) => (
                                <tr key={item.id}>
                                    <td>
                                        <input
                                            type="text"
                                            value={item.partNo}
                                            onChange={(e) => handleLineItemChange(item.id, 'partNo', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={item.description}
                                            onChange={(e) => handleLineItemChange(item.id, 'description', e.target.value)}
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => handleLineItemChange(item.id, 'quantity', e.target.value)}
                                            min="1"
                                            style={{ textAlign: 'right' }}
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={item.unitCost}
                                            onChange={(e) => handleLineItemChange(item.id, 'unitCost', e.target.value)}
                                            min="0"
                                            step="0.01"
                                            style={{ textAlign: 'right' }}
                                            required
                                        />
                                    </td>
                                    <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                        {item.total.toFixed(2)}
                                    </td>
                                    <td>
                                        <button 
                                            type="button" 
                                            className="btn-icon-danger" 
                                            onClick={() => handleRemoveItem(item.id)}
                                            aria-label="Remove item"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                <div style={{ padding: '10px 0' }}>
                    <button type="button" className="btn-secondary-action" onClick={handleAddItem}>
                        <FaPlus style={{ marginRight: '5px' }} /> Add Line Item
                    </button>
                </div>
                
                <hr className="form-divider" />

                {/* --- Section 4: Totals and Notes --- */}
                <div className="form-grid" style={{ gridTemplateColumns: '2fr 1fr', alignItems: 'flex-start' }}>
                    
                    <div className="form-group">
                        <label>Internal Notes / Comments</label>
                        <textarea 
                            name="notes" 
                            value={formData.notes} 
                            onChange={handleFormChange} 
                            rows="4" 
                            placeholder="Add internal notes for this purchase order..."
                        ></textarea>
                    </div>
                    
                    <div className="totals-summary">
                        <div className="total-row">
                            <span>Subtotal:</span>
                            <span>{formData.currency} {totals.subTotal.toFixed(2)}</span>
                        </div>
                        <div className="total-row">
                            <span>Tax ({formData.taxRate}%):</span>
                            <span>{formData.currency} {totals.taxAmount.toFixed(2)}</span>
                        </div>
                        <div className="total-row grand-total">
                            <strong>Grand Total:</strong>
                            <strong>{formData.currency} {totals.grandTotalAmount.toFixed(2)}</strong>
                        </div>
                    </div>
                </div>
                
                <hr className="form-divider" />
                
                {/* --- Form Actions --- */}
                <div className="form-actions">
                    <button type="submit" className="btn-primary-action">
                        <FaSave style={{ marginRight: '5px' }} /> {isEditMode ? 'Update PO' : 'Create PO'}
                    </button>
                    <button type="button" className="btn-secondary-action" onClick={onCancel}>
                        <FaTimes style={{ marginRight: '5px' }} /> Cancel
                    </button>
                </div>
                
            </form>
            
            {/* Component-specific Styles */}
            <style jsx>{`
                .form-section-header {
                    font-size: 16px;
                    font-weight: bold;
                    color: var(--primary-color);
                    margin-top: 25px;
                    margin-bottom: 15px;
                    padding-bottom: 5px;
                    border-bottom: 2px solid var(--border-color);
                }
                .form-divider {
                    border: 0;
                    height: 1px;
                    background: #e0e6ed;
                    margin: 30px 0;
                }
                .line-item-table-container {
                    overflow-x: auto;
                }
                .line-item-table input {
                    border: 1px solid #ddd;
                    padding: 6px;
                    border-radius: 4px;
                }
                .line-item-table td {
                    vertical-align: middle;
                }
                .btn-icon-danger {
                    background: none;
                    border: none;
                    color: var(--danger-color);
                    cursor: pointer;
                    padding: 5px;
                    border-radius: 4px;
                    transition: background-color 0.2s;
                }
                .btn-icon-danger:hover {
                    background-color: #fcebeb;
                }
                .btn-secondary-action {
                    background-color: var(--secondary-color);
                    color: white;
                    border: none;
                    padding: 10px 15px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: background-color 0.2s;
                    display: flex;
                    align-items: center;
                    margin-right: 10px;
                }
                .btn-secondary-action:hover {
                    background-color: #7f8c8d;
                }
                .form-actions {
                    padding: 20px 0;
                    border-top: 1px solid var(--border-color);
                    display: flex;
                }
                
                /* Totals Summary Styling */
                .totals-summary {
                    background-color: #f8f8f8;
                    padding: 15px;
                    border-radius: 8px;
                    border: 1px solid #eee;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    font-size: 14px;
                }
                .total-row {
                    display: flex;
                    justify-content: space-between;
                }
                .grand-total {
                    border-top: 2px dashed var(--border-color);
                    padding-top: 8px;
                    margin-top: 5px;
                    font-size: 18px;
                    color: var(--accent-color);
                }
            `}</style>
        </div>
    );
};

export default PurchaseOrderForm;