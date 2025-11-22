// src/components/ExpenseForm.js

import React, { useState, useCallback, useMemo } from 'react';
import {  FaSave, FaTimes, FaReceipt, FaCalculator, FaPlusCircle } from 'react-icons/fa';

// Constants
const VAT_RATE = 0.18; // 18% VAT for Tanzania (TZS)
const CURRENCY = 'TZS';

// Mock Data for Lookups (Section 5: Expense Tracking)
const EXPENSE_CATEGORIES = [
    'Fuel', 'Spare Parts', 'Salaries', 'Utilities', 'Rent', 'Maintenance', 'Tools & Equipment', 'Office Supplies', 'Marketing'
];

// Mock Payment Accounts (From the Chart of Accounts - Section 3)
const PAYMENT_ACCOUNTS = [
    { id: '1010', name: 'Petty Cash (Asset)' },
    { id: '1020', name: 'CRDB Business Account (Asset)' },
    { id: '2010', name: 'Supplier Payable (Liability)' } // Used if payment is recorded later
];
const VENDORS = [
    { id: 'V001', name: 'TotalEnergies' },
    { id: 'V002', name: 'ABC Parts Distributor' },
    { id: 'V003', name: 'TTCL' }
];

const ExpenseForm = ({ onSave, onCancel }) => {
    
    // Initial State
    const [formData, setFormData] = useState({
        // 5. Expense Tracking Fields
        expenseId: `EXP-${Math.floor(Math.random() * 99999) + 1}`,
        expenseDate: new Date().toISOString().substring(0, 10),
        expenseCategory: EXPENSE_CATEGORIES[0],
        vendorId: VENDORS[0].id,
        receiptInvoiceNumber: '',
        
        // Financials
        amountPaidGross: 0.00, // Amount Paid (Gross - Including VAT)
        paymentMethod: PAYMENT_ACCOUNTS[0].id,
        
        expenseNotes: '',
    });

    // --- VAT & SUBTOTAL Calculation ---
    
    // Calculates VAT and Subtotal based on the gross amount entered by the user
    const { subtotal, vatAmount } = useMemo(() => {
        const gross = parseFloat(formData.amountPaidGross) || 0;
        
        if (gross <= 0) {
            return { subtotal: 0, vatAmount: 0 };
        }
        
        // Back-calculate Subtotal (Price before VAT): Subtotal = Gross / (1 + VAT_RATE)
        const subtotalCalc = gross / (1 + VAT_RATE);
        
        // Calculate VAT amount: VAT = Gross - Subtotal
        const vatAmountCalc = gross - subtotalCalc;
        
        return {
            subtotal: subtotalCalc,
            vatAmount: vatAmountCalc
        };
    }, [formData.amountPaidGross]);


    // --- Handlers ---
    
    const handleChange = useCallback((e) => {
        const { name, value, type } = e.target;
        
        let newValue = value;
        if (type === 'number') {
            // Convert to float, defaulting to 0 if invalid
            newValue = parseFloat(value);
            // Ensure display is controlled, allowing empty string for user input
            newValue = isNaN(newValue) ? '' : value; 
        }
        
        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));
    }, []);
    

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Use parsed float for validation
        const grossAmountFloat = parseFloat(formData.amountPaidGross);
        
        if (grossAmountFloat <= 0 || !formData.expenseCategory) {
            alert("Please enter a valid amount and select an expense category.");
            return;
        }
        
        // Consolidate final data for the save function
        const dataToSave = {
            ...formData,
            subtotal: subtotal.toFixed(2),
            vatRate: VAT_RATE,
            vatAmount: vatAmount.toFixed(2),
            currency: CURRENCY,
            paymentAccountID: formData.paymentMethod, 
        };
        
        console.log("Expense Data Submitted:", dataToSave);
        onSave(dataToSave);
    };

    return (
        <div className="form-page-container">
            <header className="page-header">
                <h2><FaReceipt /> Record New Business Expense</h2>
                <button className="btn-secondary" onClick={onCancel}>
                    <FaTimes style={{ marginRight: '5px' }} /> Back to List
                </button>
            </header>
            
            <form onSubmit={handleSubmit} className="app-form">
                
                {/* ----------------------------------------------------------------- */}
                {/* 1. EXPENSE DETAILS */}
                {/* ----------------------------------------------------------------- */}
                <div className="form-section card-style">
                    <h3 className="section-header">Expense Details</h3>
                    <div className="form-grid three-cols">
                        
                        <div className="form-group">
                            <label htmlFor="expenseDate">Expense Date</label>
                            <input type="date" id="expenseDate" name="expenseDate" value={formData.expenseDate} onChange={handleChange} required />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="expenseCategory">Expense Category</label>
                            <select id="expenseCategory" name="expenseCategory" value={formData.expenseCategory} onChange={handleChange} required>
                                {EXPENSE_CATEGORIES.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="vendorId">Vendor / Supplier</label>
                            <div className="input-group-with-button">
                                <select id="vendorId" name="vendorId" value={formData.vendorId} onChange={handleChange}>
                                    {VENDORS.map(v => (
                                        <option key={v.id} value={v.id}>{v.name}</option>
                                    ))}
                                </select>
                                <button type="button" className="btn-icon-secondary" title="Add New Vendor" onClick={() => alert('Navigate to Vendor Form')}>
                                    <FaPlusCircle />
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="receiptInvoiceNumber">Receipt / Invoice Number</label>
                            <input type="text" id="receiptInvoiceNumber" name="receiptInvoiceNumber" value={formData.receiptInvoiceNumber} onChange={handleChange} placeholder='Optional reference number' />
                        </div>
                        
                        <div className="form-group form-group--full-width">
                            <label htmlFor="expenseNotes">Expense Notes / Description</label>
                            <textarea id="expenseNotes" name="expenseNotes" rows="2" value={formData.expenseNotes} onChange={handleChange}></textarea>
                        </div>
                    </div>
                </div>
                
                {/* ----------------------------------------------------------------- */}
                {/* 2. FINANCIALS & PAYMENT */}
                {/* ----------------------------------------------------------------- */}
                <div className="form-section card-style">
                    <h3 className="section-header"><FaCalculator /> Payment & VAT ({CURRENCY})</h3>
                    <div className="form-grid three-cols">
                        
                        <div className="form-group">
                            <label htmlFor="amountPaidGross">Amount Paid (Gross)</label>
                            <input 
                                type="number" 
                                id="amountPaidGross" 
                                name="amountPaidGross" 
                                value={formData.amountPaidGross} 
                                onChange={handleChange} 
                                required 
                                min="0" 
                                step="0.01" 
                                className="input-large-value"
                                placeholder="0.00"
                            />
                            <small className="form-help-text">This amount should **include** {VAT_RATE * 100}% VAT.</small>
                        </div>
                        
                        <div className="form-group">
                            <label>Payment Account (Cash/Bank)</label>
                            <select id="paymentMethod" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} required>
                                {PAYMENT_ACCOUNTS.map(a => (
                                    <option key={a.id} value={a.id}>{a.name}</option>
                                ))}
                            </select>
                        </div>
                        
                        {/* VAT Calculation Display (Modernized) */}
                        <div className="form-group vat-breakdown-display">
                            <label>VAT Breakdown (VAT Rate: {VAT_RATE * 100}%)</label>
                            <div className="breakdown-card">
                                <p><span>Subtotal (Excl. VAT):</span> <span className="value-label success-text">{CURRENCY} {subtotal.toFixed(2)}</span></p>
                                <p><span>VAT Amount:</span> <span className="value-label danger-text">{CURRENCY} {vatAmount.toFixed(2)}</span></p>
                            </div>
                        </div>

                    </div>
                </div>


                {/* ----------------------------------------------------------------- */}
                {/* 3. FORM ACTIONS (Aligned Right) */}
                {/* ----------------------------------------------------------------- */}
                <div className="form-actions form-actions-right">
                    <button type="button" className="btn-secondary" onClick={onCancel}>
                        <FaTimes style={{ marginRight: '5px' }} /> Cancel
                    </button>
                    <button type="submit" className="btn-primary-action">
                        <FaSave style={{ marginRight: '5px' }} /> Record Expense
                    </button>
                </div>
            </form>
            
            <style jsx>{`
                /* General form action styling */
                .form-actions {
                    padding: 20px 0;
                    display: flex;
                    gap: 15px;
                }
                
                /* Alignment for right-side buttons */
                .form-actions-right {
                    justify-content: flex-end;
                }

                /* Input group for Vendor select + Add button */
                .input-group-with-button {
                    display: flex;
                    gap: 5px;
                }
                .input-group-with-button select {
                    flex-grow: 1;
                }
                .btn-icon-secondary {
                    background-color: var(--secondary-color);
                    color: white;
                    border: none;
                    border-radius: 4px;
                    padding: 0 10px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                }
                
                /* Styling for the large financial input */
                .input-large-value {
                    font-size: 1.4em !important;
                    font-weight: bold;
                    color: var(--primary-color) !important;
                }

                /* VAT Breakdown Display */
                .vat-breakdown-display .breakdown-card {
                    padding: 15px;
                    background-color: var(--card-bg); /* Use theme card background */
                    border: 1px solid var(--border-color);
                    border-radius: 6px;
                    box-shadow: var(--card-shadow-light);
                }
                .vat-breakdown-display p {
                    display: flex;
                    justify-content: space-between;
                    margin: 5px 0;
                    font-size: 0.95rem;
                }
                .vat-breakdown-display .value-label {
                    font-weight: bold;
                }
                .success-text {
                    color: var(--success-color); /* Usually green */
                }
                .danger-text {
                    color: var(--danger-color); /* Usually red */
                }

                /* Responsive Grid Layout */
                .form-grid.three-cols {
                    display: grid;
                    gap: 20px;
                    grid-template-columns: repeat(3, 1fr);
                }
                .form-group--full-width {
                    grid-column: span 3;
                }
                
                @media (max-width: 1200px) {
                    .form-grid.three-cols {
                        grid-template-columns: repeat(2, 1fr);
                    }
                    .form-group--full-width {
                        grid-column: span 2;
                    }
                }
                @media (max-width: 768px) {
                    .form-grid.three-cols {
                        grid-template-columns: 1fr;
                    }
                    .form-group--full-width {
                        grid-column: span 1;
                    }
                    .form-actions {
                        flex-direction: column-reverse; /* Put save on top on mobile */
                        align-items: stretch;
                    }
                    .form-actions button {
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
};

export default ExpenseForm;