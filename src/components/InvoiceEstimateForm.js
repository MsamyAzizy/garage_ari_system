// src/components/InvoiceEstimateForm.js

import React, { useState, useCallback } from 'react';
import { 
    FaFileInvoice, FaUser, FaCar, FaTools, FaMoneyBillAlt, 
    FaSave, FaTimes, FaPlus, FaMinus, FaTags 
} from 'react-icons/fa';

// Mock data for dropdowns/lookups
const MOCK_CUSTOMER_LOOKUP = [
    { id: 'CUST-001', name: 'John Doe', phone: '255712345678', email: 'john@example.com', address: '123 Garage St' },
    { id: 'CUST-002', name: 'Jane Smith', phone: '255758123456', email: 'jane@corp.com', address: '456 Tech Ave' },
];
const MOCK_VEHICLE_LOOKUP = [
    { id: 'V-001', make: 'Toyota', model: 'Corolla', plate: 'T123ABC', vin: 'A1B2C3D4E5F6G7H8I', mileage: 120000, fuel: 'Petrol' },
    { id: 'V-002', make: 'Nissan', model: 'Patrol', plate: 'T789XYZ', vin: 'J9K0L1M2N3P4Q5R6S', mileage: 75000, fuel: 'Diesel' },
];

const ITEM_TYPES = ['Service', 'Part', 'Other'];
const STATUS_ESTIMATE = ['Draft', 'Sent', 'Approved', 'Rejected', 'Converted to Invoice'];
const STATUS_INVOICE = ['Unpaid', 'Paid', 'Partially Paid', 'Cancelled'];

// Structure for a single line item
const initialLineItem = { 
    type: 'Service', 
    description: '', 
    partNumber: '', 
    quantity: 1, 
    unitCost: 0.00, 
    laborHours: 0, 
    laborRate: 50.00, 
    subtotal: 0.00 
};


const InvoiceEstimateForm = ({ type = 'Invoice', onSave, onCancel, documentData }) => {
    
    const isEstimate = type === 'Estimate';
    const isEditMode = !!documentData?.id; 

    // Initialize state with sensible defaults
    const [formData, setFormData] = useState(documentData || {
        // Doc Details
        id: isEditMode ? documentData.id : `${isEstimate ? 'QUO' : 'INV'}-${Math.floor(Math.random() * 999) + 1}`,
        date: new Date().toISOString().slice(0, 10),
        expiryDate: isEstimate ? '' : null,
        dueDate: !isEstimate ? '' : null,
        status: isEstimate ? STATUS_ESTIMATE[0] : STATUS_INVOICE[0],
        reference: '', // Estimate Reference / Job Card ID
        preparedBy: 'MOCK_EMP_001',

        // Customer
        customerId: '',
        customerName: '',
        phone: '',
        email: '',
        address: '',
        vehicleOwner: '',

        // Vehicle
        vehicleId: '',
        make: '',
        model: '',
        plate: '',
        vin: '',
        mileage: '',
        
        // Pricing Summary
        lineItems: [initialLineItem],
        discount: 0, // as percentage
        taxRate: 18, // as percentage
        otherCharges: 0,
        amountPaid: 0, // only for invoice
        paymentMethod: '',
        paymentRef: '',
        currency: 'TZS',

        // Notes
        remarks: '',
        technician: '',
        terms: isEstimate ? 'Quote valid for 30 days.' : 'Payment due within 7 days.'
    });

    // --- State Calculation ---

    const calculateSubtotals = useCallback((items) => {
        return items.map(item => {
            const partCost = (item.quantity * item.unitCost) || 0;
            const laborCost = (item.laborHours * item.laborRate) || 0;
            const subtotal = partCost + laborCost;
            return { ...item, subtotal: parseFloat(subtotal.toFixed(2)) };
        });
    }, []);

    const totals = useCallback(() => {
        const lineItemsWithSubtotals = calculateSubtotals(formData.lineItems);
        const subtotalItems = lineItemsWithSubtotals.reduce((sum, item) => sum + item.subtotal, 0);
        
        // 1. Discount calculation
        const discountAmount = subtotalItems * (formData.discount / 100);
        const totalBeforeTax = subtotalItems - discountAmount;

        // 2. Tax calculation (applied after discount)
        const taxAmount = totalBeforeTax * (formData.taxRate / 100);
        
        // 3. Grand Total
        const grandTotal = totalBeforeTax + taxAmount + (formData.otherCharges || 0);
        
        // 4. Balance Due (Invoice only)
        const balanceDue = grandTotal - (formData.amountPaid || 0);

        return {
            lineItemsWithSubtotals,
            subtotalItems: parseFloat(subtotalItems.toFixed(2)),
            discountAmount: parseFloat(discountAmount.toFixed(2)),
            totalBeforeTax: parseFloat(totalBeforeTax.toFixed(2)),
            taxAmount: parseFloat(taxAmount.toFixed(2)),
            grandTotal: parseFloat(grandTotal.toFixed(2)),
            balanceDue: parseFloat(balanceDue.toFixed(2)),
        };
    }, [formData.lineItems, formData.discount, formData.taxRate, formData.otherCharges, formData.amountPaid, calculateSubtotals]);

    // Update form data and line items whenever totals change (for display)
    const currentTotals = totals();
    
    // --- Handlers ---
    
    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    }, []);

    const handleLineItemChange = useCallback((index, e) => {
        const { name, value } = e.target;
        const newValue = name === 'quantity' || name === 'unitCost' || name === 'laborHours' || name === 'laborRate' 
                         ? parseFloat(value) || 0 
                         : value;
                         
        setFormData(prev => {
            const newItems = prev.lineItems.map((item, i) => {
                if (i === index) {
                    // Update the item value
                    const updatedItem = { ...item, [name]: newValue };
                    // Calculate subtotal immediately for the next render
                    const partCost = (updatedItem.quantity * updatedItem.unitCost) || 0;
                    const laborCost = (updatedItem.laborHours * updatedItem.laborRate) || 0;
                    updatedItem.subtotal = parseFloat((partCost + laborCost).toFixed(2));
                    return updatedItem;
                }
                return item;
            });
            return { ...prev, lineItems: newItems };
        });
    }, []);

    const handleAddItem = () => {
        setFormData(prev => ({
            ...prev,
            lineItems: [...prev.lineItems, { ...initialLineItem }]
        }));
    };

    const handleRemoveItem = (index) => {
        setFormData(prev => ({
            ...prev,
            lineItems: prev.lineItems.filter((_, i) => i !== index)
        }));
    };
    
    // Mock Customer/Vehicle Lookup Handler
    const handleCustomerLookup = (customerId) => {
        const customer = MOCK_CUSTOMER_LOOKUP.find(c => c.id === customerId);
        if (customer) {
            setFormData(prev => ({
                ...prev,
                customerName: customer.name,
                phone: customer.phone,
                email: customer.email,
                address: customer.address,
            }));
        } else {
             // Clear fields if lookup fails
             setFormData(prev => ({
                ...prev, customerName: '', phone: '', email: '', address: ''
            }));
        }
    };
    
    const handleVehicleLookup = (vehicleId) => {
        const vehicle = MOCK_VEHICLE_LOOKUP.find(v => v.id === vehicleId);
        if (vehicle) {
            setFormData(prev => ({
                ...prev,
                make: vehicle.make,
                model: vehicle.model,
                plate: vehicle.plate,
                vin: vehicle.vin,
                mileage: vehicle.mileage,
                fuelType: vehicle.fuel
            }));
        } else {
            // Clear fields if lookup fails
             setFormData(prev => ({
                ...prev, make: '', model: '', plate: '', vin: '', mileage: '', fuelType: ''
            }));
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        // Package the data for saving, including calculated totals
        const dataToSave = { ...formData, ...currentTotals };
        console.log(`${type} Data Submitted:`, dataToSave);
        onSave(dataToSave, type);
    };

    return (
        <div className="form-page-container">
            <header className="page-header">
                <h2>{isEditMode ? `Edit ${type} #${formData.id}` : `New ${type}`}</h2>
            </header>
            
            <form onSubmit={handleSubmit} className="app-form">
                
                {/* ----------------------------------------------------------------- */}
                {/* 1. DOCUMENT DETAILS */}
                {/* ----------------------------------------------------------------- */}
                <div className="form-section">
                    <h3 className="section-header"><FaFileInvoice /> {type} Details</h3>
                    <div className="form-grid four-cols">
                        
                        <div className="form-group">
                            <label htmlFor="id">{type} ID / Number</label>
                            <input type="text" id="id" name="id" value={formData.id} onChange={handleChange} required disabled={isEditMode} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="date">{type} Date</label>
                            <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required />
                        </div>
                        
                        {isEstimate && (
                            <div className="form-group">
                                <label htmlFor="expiryDate">Expiry Date</label>
                                <input type="date" id="expiryDate" name="expiryDate" value={formData.expiryDate} onChange={handleChange} />
                            </div>
                        )}
                        {!isEstimate && (
                             <div className="form-group">
                                <label htmlFor="dueDate">Due Date</label>
                                <input type="date" id="dueDate" name="dueDate" value={formData.dueDate} onChange={handleChange} />
                            </div>
                        )}
                        
                        <div className="form-group">
                            <label htmlFor="status">Status</label>
                            <select id="status" name="status" value={formData.status} onChange={handleChange}>
                                {(isEstimate ? STATUS_ESTIMATE : STATUS_INVOICE).map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="preparedBy">Prepared By (Employee ID)</label>
                            <input type="text" id="preparedBy" name="preparedBy" value={formData.preparedBy} onChange={handleChange} />
                        </div>
                        
                         {!isEstimate && (
                            <div className="form-group">
                                <label htmlFor="reference">Job Card ID / Work Order ID</label>
                                <input type="text" id="reference" name="reference" value={formData.reference} onChange={handleChange} placeholder="JC-XXXX or QUO-XXXX" />
                            </div>
                        )}
                        
                        {isEstimate && (
                            <div className="form-group">
                                <label htmlFor="reference">Estimate Reference (for tracking)</label>
                                <input type="text" id="reference" name="reference" value={formData.reference} onChange={handleChange} />
                            </div>
                        )}
                        
                    </div>
                </div>
                
                {/* ----------------------------------------------------------------- */}
                {/* 2. CUSTOMER & VEHICLE INFORMATION */}
                {/* ----------------------------------------------------------------- */}
                <div className="form-section">
                    <h3 className="section-header"><FaUser /> Customer Information</h3>
                    <div className="form-grid four-cols">
                        
                        {/* Customer Lookup/Details */}
                        <div className="form-group">
                            <label htmlFor="customerId">Customer ID (Lookup)</label>
                            <input type="text" id="customerId" name="customerId" value={formData.customerId} onChange={(e) => { handleChange(e); handleCustomerLookup(e.target.value); }} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="customerName">Customer Name</label>
                            <input type="text" id="customerName" name="customerName" value={formData.customerName} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Phone Number</label>
                            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
                        </div>
                        <div className="form-group form-group--full-width">
                            <label htmlFor="address">Address</label>
                            <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} />
                        </div>
                        <div className="form-group form-group--full-width">
                            <label htmlFor="vehicleOwner">Vehicle Owner (if different from customer)</label>
                            <input type="text" id="vehicleOwner" name="vehicleOwner" value={formData.vehicleOwner} onChange={handleChange} />
                        </div>
                    </div>
                    
                    <h3 className="section-header vehicle-header"><FaCar /> Vehicle Information</h3>
                    <div className="form-grid four-cols">
                        
                        {/* Vehicle Lookup/Details */}
                        <div className="form-group">
                            <label htmlFor="vehicleId">Vehicle ID (Lookup)</label>
                            <input type="text" id="vehicleId" name="vehicleId" value={formData.vehicleId} onChange={(e) => { handleChange(e); handleVehicleLookup(e.target.value); }} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="plate">Registration Number / Plate No</label>
                            <input type="text" id="plate" name="plate" value={formData.plate} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="make">Make</label>
                            <input type="text" id="make" name="make" value={formData.make} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="model">Model</label>
                            <input type="text" id="model" name="model" value={formData.model} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="vin">VIN / Chassis Number</label>
                            <input type="text" id="vin" name="vin" value={formData.vin} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="mileage">Mileage</label>
                            <input type="number" id="mileage" name="mileage" value={formData.mileage} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="fuelType">Fuel Type</label>
                            <input type="text" id="fuelType" name="fuelType" value={formData.fuelType} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="transmissionType">Transmission Type</label>
                            <input type="text" id="transmissionType" name="transmissionType" value={formData.transmissionType} onChange={handleChange} />
                        </div>
                    </div>
                </div>

                {/* ----------------------------------------------------------------- */}
                {/* 3. SERVICE & PARTS DETAILS (LINE ITEMS) */}
                {/* ----------------------------------------------------------------- */}
                <div className="form-section">
                    <h3 className="section-header"><FaTools /> Services & Parts Details</h3>
                    <div className="line-item-grid-container">
                        
                        <div className="line-item-header">
                            <div>Type</div>
                            <div style={{gridColumn: 'span 3'}}>Description / Part Name & Number</div>
                            <div>Qty</div>
                            <div>Unit Cost</div>
                            <div>Labor Hrs</div>
                            <div>Labor Rate</div>
                            <div>Subtotal ({formData.currency})</div>
                            <div>Action</div>
                        </div>

                        {currentTotals.lineItemsWithSubtotals.map((item, index) => (
                            <div key={index} className="line-item-row">
                                {/* Type */}
                                <select name="type" value={item.type} onChange={(e) => handleLineItemChange(index, e)}>
                                    {ITEM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                                
                                {/* Description / Part Name & Number */}
                                <div style={{gridColumn: 'span 3', display: 'flex', flexDirection: 'column', gap: '5px'}}>
                                    <input type="text" name="description" value={item.description} onChange={(e) => handleLineItemChange(index, e)} placeholder="Service description..." required />
                                    {item.type === 'Part' && (
                                        <input type="text" name="partNumber" value={item.partNumber} onChange={(e) => handleLineItemChange(index, e)} placeholder="Part Number" />
                                    )}
                                </div>
                                
                                {/* Qty */}
                                <input type="number" name="quantity" value={item.quantity} onChange={(e) => handleLineItemChange(index, e)} min="1" step="any" style={{textAlign: 'right'}} />
                                
                                {/* Unit Cost */}
                                <input type="number" name="unitCost" value={item.unitCost} onChange={(e) => handleLineItemChange(index, e)} min="0" step="0.01" style={{textAlign: 'right'}} />
                                
                                {/* Labor Hours */}
                                <input type="number" name="laborHours" value={item.laborHours} onChange={(e) => handleLineItemChange(index, e)} min="0" step="0.5" style={{textAlign: 'right'}} />
                                
                                {/* Labor Rate */}
                                <input type="number" name="laborRate" value={item.laborRate} onChange={(e) => handleLineItemChange(index, e)} min="0" step="0.01" style={{textAlign: 'right'}} />
                                
                                {/* Subtotal (Display only) */}
                                <div className="subtotal-display">{item.subtotal.toFixed(2)}</div>

                                {/* Action */}
                                <button type="button" onClick={() => handleRemoveItem(index)} className="btn-remove" disabled={formData.lineItems.length === 1}>
                                    <FaMinus />
                                </button>
                            </div>
                        ))}

                        <div className="item-actions-row">
                            <button type="button" onClick={handleAddItem} className="btn-secondary" style={{ width: '200px' }}>
                                <FaPlus style={{ marginRight: '5px' }} /> Add Line Item
                            </button>
                        </div>
                    </div>
                </div>

                {/* ----------------------------------------------------------------- */}
                {/* 4. PRICING SUMMARY & BILLING */}
                {/* ----------------------------------------------------------------- */}
                <div className="form-section">
                    <h3 className="section-header"><FaMoneyBillAlt /> Pricing & Billing Summary</h3>
                    <div className="pricing-grid">
                        
                        {/* Summary Totals (Left Side - Read Only) */}
                        <div className="summary-section">
                            <div className="summary-row"><span>Subtotal (Items)</span> <strong>{formData.currency} {currentTotals.subtotalItems.toFixed(2)}</strong></div>
                            <div className="summary-row"><span>Discount Amount ({formData.discount}%)</span> <strong>{formData.currency} -{currentTotals.discountAmount.toFixed(2)}</strong></div>
                            <div className="summary-row subtotal-row"><span>Total Before Tax</span> <strong>{formData.currency} {currentTotals.totalBeforeTax.toFixed(2)}</strong></div>
                            <div className="summary-row"><span>Tax / VAT ({formData.taxRate}%)</span> <strong>{formData.currency} +{currentTotals.taxAmount.toFixed(2)}</strong></div>
                            
                            {!isEstimate && (
                                <div className="summary-row">
                                    <span>Other Charges (e.g., Towing)</span>
                                    <strong>{formData.currency} {parseFloat(formData.otherCharges).toFixed(2)}</strong>
                                </div>
                            )}

                            <div className="summary-row grand-total-row"><span>{isEstimate ? 'Grand Estimate Total' : 'Grand Total Due'}</span> <strong>{formData.currency} {currentTotals.grandTotal.toFixed(2)}</strong></div>
                        </div>

                        {/* Input Fields (Right Side - Editable) */}
                        <div className="input-section form-grid two-cols">
                            
                            <div className="form-group">
                                <label htmlFor="discount">Discount (%)</label>
                                <input type="number" id="discount" name="discount" value={formData.discount} onChange={handleChange} min="0" max="100" step="0.5" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="taxRate">Tax / VAT (%)</label>
                                <input type="number" id="taxRate" name="taxRate" value={formData.taxRate} onChange={handleChange} min="0" step="0.1" />
                            </div>
                            
                            {!isEstimate && (
                                <>
                                    <div className="form-group">
                                        <label htmlFor="otherCharges">Other Charges</label>
                                        <input type="number" id="otherCharges" name="otherCharges" value={formData.otherCharges} onChange={handleChange} min="0" step="0.01" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="amountPaid">Amount Paid</label>
                                        <input type="number" id="amountPaid" name="amountPaid" value={formData.amountPaid} onChange={handleChange} min="0" step="0.01" max={currentTotals.grandTotal} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="paymentMethod">Payment Method</label>
                                        <input type="text" id="paymentMethod" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="paymentRef">Payment Reference</label>
                                        <input type="text" id="paymentRef" name="paymentRef" value={formData.paymentRef} onChange={handleChange} />
                                    </div>
                                </>
                            )}
                            
                            <div className="form-group">
                                <label htmlFor="currency">Currency</label>
                                <select id="currency" name="currency" value={formData.currency} onChange={handleChange}>
                                    <option value="TZS">TZS</option>
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                </select>
                            </div>

                             {!isEstimate && (
                                <div className="form-group">
                                    <label>Balance Due</label>
                                    <div className="balance-due-display">{formData.currency} {currentTotals.balanceDue.toFixed(2)}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* ----------------------------------------------------------------- */}
                {/* 5. NOTES & APPROVAL */}
                {/* ----------------------------------------------------------------- */}
                <div className="form-section">
                    <h3 className="section-header"><FaTags /> Notes & Terms</h3>
                    <div className="form-grid two-cols">
                        
                        <div className="form-group">
                            <label htmlFor="technician">Technician / Mechanic Name</label>
                            <input type="text" id="technician" name="technician" value={formData.technician} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="authorizedBy">Authorized By (Invoice only)</label>
                            <input type="text" id="authorizedBy" name="authorizedBy" value={formData.authorizedBy} onChange={handleChange} disabled={isEstimate} />
                        </div>

                        <div className="form-group form-group--full-width">
                            <label htmlFor="remarks">Remarks / Notes</label>
                            <textarea id="remarks" name="remarks" rows="3" value={formData.remarks} onChange={handleChange}></textarea>
                        </div>
                         <div className="form-group form-group--full-width">
                            <label htmlFor="terms">Terms & Conditions</label>
                            <textarea id="terms" name="terms" rows="3" value={formData.terms} onChange={handleChange}></textarea>
                        </div>
                    </div>
                </div>

                {/* ----------------------------------------------------------------- */}
                {/* 6. FORM ACTIONS */}
                {/* ----------------------------------------------------------------- */}
                <div className="form-actions">
                    <button type="button" className="btn-secondary" onClick={onCancel}>
                        <FaTimes style={{ marginRight: '5px' }} /> Cancel
                    </button>
                    <button type="submit" className="btn-primary-action">
                        <FaSave style={{ marginRight: '5px' }} /> {isEditMode ? `Update ${type}` : `Save ${type}`}
                    </button>
                </div>
            </form>

            <style jsx>{`
                /* Basic structure styling (similar to EmployeeForm.js) */
                .form-page-container {
                    background-color: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                    padding-bottom: 20px;
                }
                .page-header {
                    padding: 15px 20px;
                    border-bottom: 1px solid #eee;
                }
                .page-header h2 {
                    margin: 0;
                    font-size: 20px;
                    color: #333;
                }
                .app-form {
                    padding: 20px;
                }
                .form-section {
                    margin-bottom: 30px;
                    border: 1px solid #e0e6ed;
                    border-radius: 6px;
                    overflow: hidden;
                }
                .section-header {
                    background-color: #f7f9fc;
                    color: #4a69bd; 
                    padding: 10px 15px;
                    margin: 0;
                    font-size: 16px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    border-bottom: 2px solid #5d9cec; 
                }
                .form-grid {
                    display: grid;
                    gap: 20px;
                    padding: 20px;
                }
                .form-grid.four-cols {
                     grid-template-columns: repeat(4, 1fr);
                }
                .form-grid.two-cols {
                    grid-template-columns: repeat(2, 1fr);
                }
                .form-group {
                    display: flex;
                    flex-direction: column;
                }
                .form-group--full-width {
                    grid-column: span 4;
                }
                .form-group label {
                    font-size: 13px;
                    color: #555;
                    margin-bottom: 5px;
                    font-weight: 500;
                }
                .form-group input, .form-group select, .form-group textarea {
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 14px;
                    width: 100%;
                    box-sizing: border-box;
                }
                .form-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    margin-top: 30px;
                    padding: 0 20px;
                }
                
                /* --- Specific Styling for Line Items --- */
                .line-item-grid-container {
                    padding: 20px;
                    overflow-x: auto;
                    min-width: 800px; /* Ensure wide enough for items */
                }
                .line-item-header, .line-item-row {
                    display: grid;
                    /* Layout for 10 columns: Type(1), Description(3), Qty(1), UnitCost(1), LaborHrs(1), LaborRate(1), Subtotal(1), Action(1) */
                    grid-template-columns: 1fr 2fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 0.5fr; 
                    gap: 10px;
                    align-items: center;
                    margin-bottom: 10px;
                }
                .line-item-header {
                    font-weight: 600;
                    color: #4a69bd;
                    border-bottom: 2px solid #5d9cec;
                    padding-bottom: 5px;
                    margin-bottom: 15px;
                    font-size: 13px;
                }
                .line-item-row input, .line-item-row select {
                    padding: 8px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 13px;
                }
                .line-item-row input[name="quantity"],
                .line-item-row input[name="unitCost"],
                .line-item-row input[name="laborHours"],
                .line-item-row input[name="laborRate"] {
                    max-width: 100px; /* Constrain numeric inputs */
                }
                .subtotal-display {
                    font-weight: 600;
                    text-align: right;
                    padding: 8px;
                    background-color: #f0f8ff;
                    border-radius: 4px;
                    white-space: nowrap;
                }
                .btn-remove {
                    background-color: #e74c3c;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    padding: 8px;
                    cursor: pointer;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .item-actions-row {
                    grid-column: span 10;
                    margin-top: 15px;
                }

                /* --- Specific Styling for Pricing Summary --- */
                .pricing-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    padding: 20px;
                    gap: 30px;
                }
                .summary-section {
                    background-color: #f7f9fc;
                    padding: 20px;
                    border-radius: 6px;
                }
                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 0;
                    border-bottom: 1px dashed #eee;
                    font-size: 15px;
                }
                .subtotal-row {
                    font-weight: 500;
                    margin-top: 10px;
                    border-top: 1px solid #ccc;
                    border-bottom: none;
                    padding-top: 10px;
                }
                .grand-total-row {
                    font-size: 18px;
                    font-weight: bold;
                    color: #2ecc71; /* Green for total */
                    border-top: 2px solid #2ecc71;
                    padding-top: 10px;
                    margin-top: 15px;
                }
                .balance-due-display {
                    font-size: 16px;
                    font-weight: bold;
                    padding: 10px;
                    background-color: #ffe0b2; /* Light orange for attention */
                    border-radius: 4px;
                    text-align: center;
                }

                /* Responsive Adjustments */
                @media (max-width: 1200px) {
                    .form-grid.four-cols {
                        grid-template-columns: repeat(3, 1fr);
                    }
                    .form-group--full-width {
                        grid-column: span 3;
                    }
                    .pricing-grid {
                        grid-template-columns: 1fr;
                    }
                }
                @media (max-width: 768px) {
                    .form-grid.four-cols, .form-grid.two-cols {
                        grid-template-columns: 1fr;
                    }
                    .form-group--full-width {
                        grid-column: span 1;
                    }
                    .line-item-grid-container {
                        min-width: 100%;
                        overflow-x: scroll;
                    }
                }
            `}</style>
        </div>
    );
};

export default InvoiceEstimateForm;