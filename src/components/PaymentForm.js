// src/components/PaymentForm.js

import React, { useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
    FaCreditCard, FaExchangeAlt, FaTags, FaLink, FaSave, FaTimes, FaDollarSign 
} from 'react-icons/fa';

// Mock Data for Lookups
const MOCK_INVOICES = [
    { id: 'INV-002', client: 'Global Motors', total: 780.00, balance: 780.00, currency: 'TZS' },
    { id: 'INV-003', client: 'Acme Corp', total: 1200.50, balance: 100.50, currency: 'USD' },
    { id: 'INV-005', client: 'Jane Doe', total: 300.00, balance: 300.00, currency: 'TZS' },
];

const PAYMENT_METHODS = ['Cash', 'Bank Transfer', 'Mobile Money', 'Credit Card', 'Cheque', 'Other'];
const MOBILE_CHANNELS = ['M-Pesa', 'Airtel Money', 'Tigo Pesa'];
const BANK_CHANNELS = ['CRDB Bank', 'NMB Bank', 'Equity Bank', 'Standard Chartered'];
const CARD_CHANNELS = ['POS Terminal', 'Online Gateway'];

const PaymentForm = ({ onSave, onCancel }) => {
    
    // Check for invoiceId in URL parameters (e.g., /payments/new/INV-005)
    const { invoiceId, paymentId } = useParams(); 
    
    const isEditMode = !!paymentId;
    
    const [formData, setFormData] = useState({
        // 1. Basic Details
        id: isEditMode ? paymentId : `PAY-${Math.floor(Math.random() * 9999) + 1}`,
        invoiceId: invoiceId || '',
        customerId: '',
        date: new Date().toISOString().slice(0, 10),
        time: new Date().toTimeString().slice(0, 5),
        status: 'Completed',

        // 2. Amount Details (Will be pre-filled from Invoice Lookup)
        invoiceTotalAmount: 0.00,
        amountPaid: 0.00,
        remainingBalance: 0.00, 
        discountApplied: 0.00,
        taxAmount: 0.00,
        currency: 'TZS',

        // 3. Method & Channel
        paymentMethod: PAYMENT_METHODS[0],
        paymentChannel: '',
        transactionRef: '',
        chequeNumber: '',
        bankName: '',
        senderNumber: '',
        receiverTillNumber: '123456 (Business Till)',

        // 4. Linked Entities
        workOrderId: '',
        estimateId: '',
        collectedBy: 'MOCK_EMP_001',
        branchLocation: 'Main Workshop',

        // 5. Receipt
        receiptNumber: isEditMode ? 'RCPT-XXX' : `RCPT-${Math.floor(Math.random() * 9999) + 1}`,
        receiptDate: new Date().toISOString().slice(0, 10),
        receiptStatus: 'Yes',
        
        // 6. Additional Info
        notes: '',
    });
    
    const [invoiceData, setInvoiceData] = useState(null);

    // --- Effects & Lookups ---

    // 1. Look up Invoice Data if invoiceId is present
    useEffect(() => {
        if (formData.invoiceId) {
            const invoice = MOCK_INVOICES.find(inv => inv.id === formData.invoiceId);
            if (invoice) {
                setInvoiceData(invoice);
                // Pre-fill fields from the invoice
                setFormData(prev => ({
                    ...prev,
                    customerId: invoice.client, // Mocking: using client name as ID for simplicity
                    invoiceTotalAmount: invoice.total,
                    remainingBalance: invoice.balance,
                    currency: invoice.currency,
                    // Suggest amount to pay (the balance)
                    amountPaid: invoice.balance, 
                }));
            } else {
                setInvoiceData(null);
                // Clear related fields if invoice not found
                setFormData(prev => ({
                    ...prev,
                    invoiceTotalAmount: 0.00, remainingBalance: 0.00, amountPaid: 0.00, currency: 'TZS'
                }));
            }
        } else {
             setInvoiceData(null);
        }
    }, [formData.invoiceId]);
    
    // 2. Calculate remaining balance whenever amountPaid or discount changes
    useEffect(() => {
        const total = formData.invoiceTotalAmount || 0;
        const paid = formData.amountPaid || 0;
        const discount = formData.discountApplied || 0;
        
        const newBalance = total - paid - discount;
        
        setFormData(prev => ({
            ...prev,
            remainingBalance: parseFloat(newBalance.toFixed(2))
        }));
    }, [formData.invoiceTotalAmount, formData.amountPaid, formData.discountApplied]);


    // --- Handlers ---
    
    const handleChange = useCallback((e) => {
        const { name, value, type } = e.target;
        
        // Handle numeric fields
        const newValue = (name.includes('Amount') || name.includes('discount')) && type === 'number' 
                         ? parseFloat(value) || 0 
                         : value;
                         
        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));
    }, []);
    
    // Filter payment channels based on selected method
    const getChannels = (method) => {
        switch (method) {
            case 'Mobile Money':
                return MOBILE_CHANNELS;
            case 'Bank Transfer':
                return BANK_CHANNELS;
            case 'Credit Card':
                return CARD_CHANNELS;
            default:
                return [];
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (formData.amountPaid <= 0) {
            alert("Payment amount must be greater than zero.");
            return;
        }
        
        // Final check on remaining balance
        const finalData = { 
            ...formData, 
            status: formData.remainingBalance <= 0 ? 'Completed' : 'Partially Paid' 
        };
        
        console.log("Payment Data Submitted:", finalData);
        onSave(finalData);
    };

    return (
        <div className="form-page-container">
            <header className="page-header">
                <h2><FaCreditCard /> {isEditMode ? `Edit Payment #${formData.id}` : 'Record New Payment'}</h2>
                {/* Display invoice info prominently if linked */}
                {invoiceData && (
                    <p className="invoice-summary">
                        Invoice **{invoiceData.id}** for **{invoiceData.client}** (Total: **{invoiceData.currency} {invoiceData.total.toFixed(2)}**). 
                        Original Balance: **{invoiceData.currency} {MOCK_INVOICES.find(i => i.id === invoiceData.id).balance.toFixed(2)}**.
                    </p>
                )}
            </header>
            
            <form onSubmit={handleSubmit} className="payment-app-form">
                
                {/* ----------------------------------------------------------------- */}
                {/* 2. PAYMENT AMOUNT DETAILS - MOVED UP AND WIDER FOR FOCUS */}
                {/* ----------------------------------------------------------------- */}
                <div className="form-section amount-details-section">
                    <h3 className="section-header"><FaDollarSign /> Amount & Currency Details</h3>
                    <div className="form-grid amount-cols">
                        
                        {/* 1. INVOICE TOTAL (Disabled context) */}
                        <div className="form-group">
                            <label htmlFor="invoiceTotalAmount">Invoice Total Billed</label>
                            <input 
                                type="number" 
                                id="invoiceTotalAmount" 
                                name="invoiceTotalAmount" 
                                value={formData.invoiceTotalAmount} 
                                disabled={true} 
                            />
                        </div>
                        
                        {/* 2. CURRENCY */}
                        <div className="form-group">
                            <label htmlFor="currency">Currency</label>
                            <select id="currency" name="currency" value={formData.currency} onChange={handleChange} disabled={!!invoiceData}>
                                <option value="TZS">TZS</option>
                                <option value="USD">USD</option>
                            </select>
                        </div>
                        
                        {/* 3. AMOUNT PAID (Primary Action Field) */}
                        <div className="form-group highlight-group">
                            <label htmlFor="amountPaid">**Amount Paid**</label>
                            <input 
                                type="number" 
                                id="amountPaid" 
                                name="amountPaid" 
                                value={formData.amountPaid} 
                                onChange={handleChange} 
                                min="0" 
                                step="0.01" 
                                required 
                            />
                        </div>
                        
                        {/* 4. REMAINING BALANCE (Primary Feedback Field) */}
                         <div className="form-group highlight-group">
                            <label htmlFor="remainingBalance">**Remaining Balance**</label>
                            <input 
                                type="text" 
                                id="remainingBalance" 
                                value={`${formData.currency} ${formData.remainingBalance.toFixed(2)}`} 
                                disabled 
                            />
                        </div>

                        {/* DISCOUNT & TAX - Smaller fields */}
                        <div className="form-group">
                            <label htmlFor="discountApplied">Discount Applied</label>
                            <input type="number" id="discountApplied" name="discountApplied" value={formData.discountApplied} onChange={handleChange} min="0" step="0.01" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="taxAmount">Tax/VAT (Portion of payment)</label>
                            <input type="number" id="taxAmount" name="taxAmount" value={formData.taxAmount} onChange={handleChange} min="0" step="0.01" />
                        </div>
                    </div>
                </div>
                
                {/* ----------------------------------------------------------------- */}
                {/* 3. PAYMENT METHOD & CHANNEL */}
                {/* ----------------------------------------------------------------- */}
                <div className="form-section">
                    <h3 className="section-header"><FaExchangeAlt /> Method & Transaction Details</h3>
                    <div className="form-grid three-cols">
                        
                        <div className="form-group">
                            <label htmlFor="paymentMethod">Payment Method</label>
                            <select id="paymentMethod" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} required>
                                {PAYMENT_METHODS.map(m => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="paymentChannel">Payment Channel</label>
                            <select id="paymentChannel" name="paymentChannel" value={formData.paymentChannel} onChange={handleChange}>
                                <option value="">--- Select Channel ---</option>
                                {getChannels(formData.paymentMethod).map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="transactionRef">Transaction Reference Number</label>
                            <input type="text" id="transactionRef" name="transactionRef" value={formData.transactionRef} onChange={handleChange} placeholder="e.g., K98J2..." />
                        </div>
                        
                        {(formData.paymentMethod === 'Mobile Money' || formData.paymentMethod === 'Bank Transfer') && (
                            <div className="form-group">
                                <label htmlFor="senderNumber">Sender Mobile/Account No.</label>
                                <input type="text" id="senderNumber" name="senderNumber" value={formData.senderNumber} onChange={handleChange} placeholder="Optional for traceability" />
                            </div>
                        )}
                        
                        {formData.paymentMethod === 'Bank Transfer' && (
                            <div className="form-group">
                                <label htmlFor="bankName">Sending Bank Name</label>
                                <input type="text" id="bankName" name="bankName" value={formData.bankName} onChange={handleChange} />
                            </div>
                        )}
                        
                        {formData.paymentMethod === 'Cheque' && (
                            <div className="form-group">
                                <label htmlFor="chequeNumber">Cheque Number</label>
                                <input type="text" id="chequeNumber" name="chequeNumber" value={formData.chequeNumber} onChange={handleChange} required />
                            </div>
                        )}
                        
                        <div className="form-group">
                            <label htmlFor="receiverTillNumber">Receiver Account / Till Number</label>
                            <input type="text" id="receiverTillNumber" name="receiverTillNumber" value={formData.receiverTillNumber} onChange={handleChange} />
                        </div>

                        <div className="form-group form-group--full-width">
                            <label htmlFor="notes">Payment Notes / Remarks</label>
                            <textarea id="notes" name="notes" rows="2" value={formData.notes} onChange={handleChange}></textarea>
                        </div>
                    </div>
                </div>

                {/* ----------------------------------------------------------------- */}
                {/* 1. BASIC & LINKED DETAILS - MOVED DOWN */}
                {/* ----------------------------------------------------------------- */}
                <div className="form-section">
                    <h3 className="section-header"><FaLink /> Document Links & Basic Info</h3>
                    <div className="form-grid four-cols">
                        
                        <div className="form-group">
                            <label htmlFor="id">Payment ID / Number</label>
                            <input type="text" id="id" name="id" value={formData.id} disabled />
                        </div>
                        <div className="form-group required-field">
                            <label htmlFor="invoiceId">Invoice ID / Reference *</label>
                            <input type="text" id="invoiceId" name="invoiceId" value={formData.invoiceId} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="customerId">Customer ID</label>
                            <input type="text" id="customerId" name="customerId" value={formData.customerId} onChange={handleChange} disabled={!!invoiceData} />
                            <small className="text-muted">Auto-filled: {invoiceData ? invoiceData.client : 'N/A'}</small>
                        </div>
                        <div className="form-group">
                            <label htmlFor="status">Payment Status</label>
                            <select id="status" name="status" value={formData.status} onChange={handleChange} required>
                                {['Pending', 'Completed', 'Failed', 'Refunded', 'Cancelled'].map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="date">Payment Date</label>
                            <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="time">Payment Time</label>
                            <input type="time" id="time" name="time" value={formData.time} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label htmlFor="collectedBy">Recorded By (Employee)</label>
                            <input type="text" id="collectedBy" name="collectedBy" value={formData.collectedBy} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="branchLocation">Branch Location</label>
                            <input type="text" id="branchLocation" name="branchLocation" value={formData.branchLocation} onChange={handleChange} />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="workOrderId">Work Order / Job Card ID</label>
                            <input type="text" id="workOrderId" name="workOrderId" value={formData.workOrderId} onChange={handleChange} placeholder="JC-XXXX" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="estimateId">Estimate ID</label>
                            <input type="text" id="estimateId" name="estimateId" value={formData.estimateId} onChange={handleChange} placeholder="EST-XXXX" />
                        </div>
                        
                    </div>
                </div>

                {/* ----------------------------------------------------------------- */}
                {/* 4. RECEIPT & DOCUMENTATION */}
                {/* ----------------------------------------------------------------- */}
                <div className="form-section">
                    <h3 className="section-header"><FaTags /> Receipt & Documentation</h3>
                    <div className="form-grid three-cols">
                        
                        <div className="form-group">
                            <label htmlFor="receiptNumber">Receipt Number</label>
                            <input type="text" id="receiptNumber" name="receiptNumber" value={formData.receiptNumber} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="receiptDate">Receipt Date Issued</label>
                            <input type="date" id="receiptDate" name="receiptDate" value={formData.receiptDate} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="receiptStatus">Printed / E-Receipt Status</label>
                            <select id="receiptStatus" name="receiptStatus" value={formData.receiptStatus} onChange={handleChange}>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                        
                        <div className="form-group form-group--full-width">
                             <label htmlFor="paymentProof">Payment Proof Attachment (Upload)</label>
                             <input type="file" id="paymentProof" name="paymentProof" />
                             <small className="text-muted">Max file size 5MB (e.g., M-Pesa screenshot, bank slip).</small>
                        </div>
                    </div>
                </div>

                {/* ----------------------------------------------------------------- */}
                {/* 5. FORM ACTIONS */}
                {/* ----------------------------------------------------------------- */}
                <div className="page-form-actions">
                    <button type="button" className="btn-secondary" onClick={onCancel}>
                        <FaTimes style={{ marginRight: '5px' }} /> Cancel
                    </button>
                    <button type="submit" className="btn-primary-action">
                        <FaSave style={{ marginRight: '5px' }} /> {isEditMode ? 'Update Payment' : 'Record Payment'}
                    </button>
                </div>
            </form>
            
            <style jsx>{`
                /* General Form Styling */
                .form-page-container {
                    max-width: 1900px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f4f7f9;
                }

                /* Header */
                .page-header {
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                }
                .page-header h2 {
                    margin: 0;
                    color: #2c3e50;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .invoice-summary {
                    margin-top: 10px;
                    padding: 10px 15px;
                    background-color: #ecf0f1;
                    border-left: 4px solid #3498db;
                    font-size: 14px;
                    color: #34495e;
                }

                /* Form Structure */
                .payment-app-form {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                /* Sections */
                .form-section {
                    background-color: #ffffff;
                    padding: 25px;
                    border-radius: 8px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
                }
                .section-header {
                    border-bottom: 2px solid #ecf0f1;
                    padding-bottom: 10px;
                    margin-bottom: 20px;
                    color: #34495e;
                    font-size: 1.2em;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                /* Grid Layouts */
                .form-grid {
                    display: grid;
                    gap: 20px;
                }
                .four-cols {
                    grid-template-columns: repeat(4, 1fr);
                }
                .three-cols {
                    grid-template-columns: repeat(3, 1fr);
                }
                
                /* Amount Section Specific Grid */
                .amount-cols {
                    grid-template-columns: 1fr 1fr 1.5fr 1.5fr; /* Gives more space to Amount & Balance */
                }
                .amount-details-section {
                    border: 1px solid #3498db; /* Blue border for emphasis */
                    background-color: #f7fbfe;
                }
                
                /* Input Groups */
                .form-group label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: 600;
                    color: #34495e;
                    font-size: 0.95em;
                }
                .form-group input, .form-group select, .form-group textarea {
                    width: 100%;
                    padding: 10px 12px;
                    border: 1px solid #bdc3c7;
                    border-radius: 4px;
                    box-sizing: border-box;
                    font-size: 15px;
                    transition: border-color 0.2s, box-shadow 0.2s;
                }
                .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
                    border-color: #3498db;
                    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
                    outline: none;
                }
                
                /* Highlighted Inputs (Amount Paid & Remaining Balance) */
                .highlight-group input {
                    font-weight: bold;
                    font-size: 1.2em !important;
                    padding: 15px 12px;
                    color: #2c3e50;
                }

                /* Remaining Balance Color Coding */
                #remainingBalance {
                    background-color: ${formData.remainingBalance > 0 ? '#fdecea' : '#eaf9e9'} !important;
                    color: ${formData.remainingBalance > 0 ? '#c0392b' : '#27ae60'} !important;
                }
                
                /* Full Width Elements */
                .form-group--full-width {
                    grid-column: span 4; /* Default to 4 columns */
                }

                /* Small Text */
                .text-muted {
                    font-size: 12px;
                    color: #7f8c8d;
                    margin-top: 5px;
                    display: block;
                }
                
                /* Form Actions */
                .form-actions-sticky {
                    position: sticky;
                    bottom: 0;
                    padding: 15px 25px;
                    background-color: #ffffff;
                    border-top: 1px solid #ecf0f1;
                    display: flex;
                    justify-content: flex-end;
                    gap: 15px;
                    border-radius: 0 0 8px 8px;
                    box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.05);
                    margin: -20px -20px 0; /* Adjusts sticky footer to edge of container */
                }

                .btn-secondary, .btn-primary-action {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: background-color 0.2s;
                }
                .btn-secondary {
                    background-color: #ecf0f1;
                    color: #34495e;
                }
                .btn-secondary:hover {
                    background-color: #dcdfe1;
                }
                .btn-primary-action {
                    background-color: #2ecc71; /* Green for save/record */
                    color: #ffffff;
                }
                .btn-primary-action:hover {
                    background-color: #27ad60;
                }

                /* Responsive Adjustments */
                @media (max-width: 1200px) {
                    .four-cols, .amount-cols {
                        grid-template-columns: repeat(3, 1fr);
                    }
                    .form-group--full-width {
                        grid-column: span 3;
                    }
                    .three-cols {
                        grid-template-columns: repeat(2, 1fr);
                    }
                    .amount-cols {
                        grid-template-columns: 1fr 1fr; /* On tablet, stack Invoice Total/Currency, Amount/Balance */
                    }
                    .amount-cols > .form-group:nth-child(1), .amount-cols > .form-group:nth-child(2) {
                        grid-column: span 1;
                    }
                    .amount-cols > .form-group:nth-child(3), .amount-cols > .form-group:nth-child(4) {
                        grid-column: span 1;
                    }
                }
                @media (max-width: 768px) {
                    .four-cols, .three-cols, .amount-cols {
                        grid-template-columns: 1fr;
                    }
                    .form-group--full-width {
                        grid-column: span 1;
                    }
                    .form-actions-sticky {
                        flex-direction: column;
                        gap: 10px;
                    }
                }
            `}</style>
        </div>
    );
};

export default PaymentForm;