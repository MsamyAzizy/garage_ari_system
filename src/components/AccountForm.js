// src/components/AccountForm.js

import React, { useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaBookOpen, FaMoneyBillWave, FaUniversity, FaSave, FaTimes } from 'react-icons/fa';

// --- MOCK DATA (Ideally separated) ---
const ACCOUNT_CONSTANTS = {
    TYPES: ['Asset', 'Liability', 'Income', 'Expense', 'Equity'],
    CATEGORIES: ['Bank', 'Petty Cash', 'Customer Receivable', 'Supplier Payable', 'Sales Income', 'Cost of Goods Sold', 'Operating Expense', 'Fixed Asset'],
    CURRENCIES: ['TZS', 'USD', 'EUR'],
};

// --- Sub-Component for cleaner form rendering ---
const FormField = ({ label, id, children, required = false, fullWidth = false }) => (
    <div className={`form-group ${fullWidth ? 'form-group--full-width' : ''}`}>
        <label htmlFor={id}>
            **{label}**{required && <span className="required-star">*</span>}
        </label>
        {children}
    </div>
);


const AccountForm = ({ onSave, onCancel }) => {
    
    const { accountId } = useParams(); 
    const isEditMode = !!accountId;

    const [formData, setFormData] = useState({
        // 1. Basic Details
        id: isEditMode ? accountId : `ACC-${Math.floor(Math.random() * 9999) + 1}`,
        accountName: '',
        accountType: ACCOUNT_CONSTANTS.TYPES[0],
        accountCategory: ACCOUNT_CONSTANTS.CATEGORIES[0],
        accountCode: '',
        description: '',

        // 2. Financial Balances
        openingBalance: 0.00,
        currentBalance: 0.00,
        currency: ACCOUNT_CONSTANTS.CURRENCIES[0],

        // 3. Bank / Payment Information
        bankName: '',
        branchName: '',
        accountNumber: '',
        accountHolderName: '',
        swiftIban: '',
        mobileMoneyNumber: '',
        
        // 7. System Fields
        activeStatus: 'Active',
    });
    
    const { 
        accountName, accountCode, accountType, accountCategory, currency, currentBalance, activeStatus, 
        description, openingBalance, bankName, branchName, accountHolderName, accountNumber, mobileMoneyNumber, swiftIban 
    } = formData;


    // --- Effect for fetching data in Edit Mode ---
    useEffect(() => {
        if (isEditMode) {
            console.log(`Fetching Account ${accountId} for editing...`);
            // Mock data structure fill
            setFormData(prev => ({ 
                ...prev,
                id: accountId,
                accountName: 'CRDB Business Account',
                accountCode: '1020',
                accountType: 'Asset',
                accountCategory: 'Bank',
                currency: 'TZS',
                currentBalance: 125000.00,
                bankName: 'CRDB Bank Plc',
                accountNumber: '0150244795400',
                // Reset/set other fields here
            }));
        }
    }, [accountId, isEditMode]);


    // --- Handlers ---
    
    const handleChange = useCallback((e) => {
        const { name, value, type } = e.target;
        
        // Handle number conversion specifically for balance fields
        const newValue = (name.includes('Balance') && type === 'number') 
                         ? parseFloat(value) || 0 
                         : value;
                         
        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));
    }, []);
    

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!accountName || !accountCode) {
            alert("Account Name and Account Code are required.");
            return;
        }
        
        console.log("Account Data Submitted:", formData);
        onSave(formData, isEditMode);
    };

    // Determine if Bank/Payment details section should be visible
    const showBankDetails = accountCategory === 'Bank' || accountCategory === 'Petty Cash';

    return (
        <div className="form-page-container">
            <header className="page-header">
                <h2><FaBookOpen /> {isEditMode ? `Edit Account #${accountCode}` : 'Create New Account'}</h2>
                <p className="header-subtitle">Manage the ledger details, balances, and bank information for this account.</p>
            </header>
            
            <form onSubmit={handleSubmit} className="app-form">
                
                {/* ----------------------------------------------------------------- */}
                {/* 1. BASIC ACCOUNT DETAILS */}
                {/* ----------------------------------------------------------------- */}
                <section className="form-section">
                    <h3 className="section-header"><FaMoneyBillWave /> Basic Account Details</h3>
                    <div className="form-grid three-cols">
                        
                        <FormField label="Account Name" id="accountName" required>
                            <input 
                                type="text" 
                                name="accountName" 
                                value={accountName} 
                                onChange={handleChange} 
                                placeholder='e.g., Sales Income, CRDB Bank Account' 
                            />
                        </FormField>

                        <FormField label="Account Code / Ledger Code" id="accountCode" required>
                            <input 
                                type="text" 
                                name="accountCode" 
                                value={accountCode} 
                                onChange={handleChange} 
                                placeholder='e.g., 1010, 4010' 
                            />
                        </FormField>

                        <FormField label="Account Type" id="accountType" required>
                            <select name="accountType" value={accountType} onChange={handleChange}>
                                {ACCOUNT_CONSTANTS.TYPES.map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </FormField>
                        
                        <FormField label="Account Category" id="accountCategory" required>
                            <select name="accountCategory" value={accountCategory} onChange={handleChange}>
                                {ACCOUNT_CONSTANTS.CATEGORIES.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </FormField>

                        <FormField label="Currency" id="currency" required>
                            <select name="currency" value={currency} onChange={handleChange}>
                                {ACCOUNT_CONSTANTS.CURRENCIES.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </FormField>

                        <FormField label="Active Status" id="activeStatus">
                            <select name="activeStatus" value={activeStatus} onChange={handleChange}>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </FormField>
                        
                        <FormField label="Description / Purpose" id="description" fullWidth>
                            <textarea 
                                name="description" 
                                rows="3" // Increased rows for better visual balance
                                value={description} 
                                onChange={handleChange}
                                placeholder='A brief explanation of what this account is used for.'
                            ></textarea>
                        </FormField>
                    </div>
                </section>
                
                {/* ----------------------------------------------------------------- */}
                {/* 2. FINANCIAL BALANCES */}
                {/* ----------------------------------------------------------------- */}
                <section className="form-section">
                    <h3 className="section-header"><FaMoneyBillWave /> Initial & Current Balances</h3>
                    <div className="form-grid three-cols">
                        
                        <FormField label="Opening Balance (Initial Setup)" id="openingBalance">
                            <input 
                                type="number" 
                                name="openingBalance" 
                                value={openingBalance} 
                                onChange={handleChange} 
                                min="0" 
                                step="0.01" 
                                disabled={isEditMode} 
                                className={isEditMode ? 'input-disabled-field' : ''}
                            />
                        </FormField>

                         <FormField label="Current System Balance" id="currentBalance">
                            <input 
                                type="text" 
                                name="currentBalance"
                                value={`${currency} ${currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                                disabled 
                                className="input-display-value balance-value"
                            />
                        </FormField>

                         <FormField label="Balance Date (System Updated)" id="balanceDate">
                            <input 
                                type="text" 
                                value={new Date().toLocaleDateString()} 
                                disabled 
                                className="input-display-value"
                            />
                        </FormField>
                    </div>
                </section>


                {/* ----------------------------------------------------------------- */}
                {/* 3. BANK / PAYMENT INFORMATION (Conditional on Type/Category) */}
                {/* ----------------------------------------------------------------- */}
                {showBankDetails && (
                    <section className="form-section">
                        <h3 className="section-header"><FaUniversity /> Bank / Mobile Money Details</h3>
                        <div className="form-grid three-cols">
                            
                            <FormField label="Bank Name" id="bankName">
                                <input type="text" name="bankName" value={bankName} onChange={handleChange} />
                            </FormField>

                            <FormField label="Branch Name" id="branchName">
                                <input type="text" name="branchName" value={branchName} onChange={handleChange} />
                            </FormField>

                            <FormField label="Account Holder Name" id="accountHolderName">
                                <input type="text" name="accountHolderName" value={accountHolderName} onChange={handleChange} />
                            </FormField>
                            
                            <FormField label="Account Number / Till Number" id="accountNumber">
                                <input type="text" name="accountNumber" value={accountNumber} onChange={handleChange} />
                            </FormField>

                            <FormField label="Mobile Money Number (If applicable)" id="mobileMoneyNumber">
                                <input type="text" name="mobileMoneyNumber" value={mobileMoneyNumber} onChange={handleChange} />
                            </FormField>

                            <FormField label="SWIFT / IBAN Code (Optional)" id="swiftIban">
                                <input type="text" name="swiftIban" value={swiftIban} onChange={handleChange} />
                            </FormField>
                            
                        </div>
                    </section>
                )}


                {/* ----------------------------------------------------------------- */}
                {/* 4. FORM ACTIONS */}
                {/* ----------------------------------------------------------------- */}
                <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={onCancel}>
                        <FaTimes /> Cancel
                    </button>
                    <button type="submit" className="btn btn-primary-action">
                        <FaSave /> {isEditMode ? 'Update Account' : 'Create Account'}
                    </button>
                </div>
            </form>
            
            {/* --- IMPROVED CSS STYLING --- */}
            <style jsx>{`
                /* --- Layout and Structure --- */
                .form-page-container {
                    padding: 30px;
                    max-width: 1900px;
                    margin: 0 auto;
                    background: #ffffff; /* White background for the form area */
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); /* Soft shadow */
                }

                .page-header {
                    margin-bottom: 30px;
                    border-bottom: 2px solid #e0e0e0;
                    padding-bottom: 15px;
                }
                .page-header h2 {
                    color: #333;
                    font-size: 1.8em;
                    margin: 0;
                }
                .header-subtitle {
                    color: #666;
                    margin-top: 5px;
                    font-size: 0.95em;
                }

                .form-section {
                    margin-bottom: 40px;
                    padding: 20px;
                    border: 1px solid #f0f0f0;
                    border-radius: 6px;
                    background-color: #fcfcfc;
                }
                .section-header {
                    font-size: 1.25em;
                    color: #007bff; /* Primary blue for section titles */
                    margin-top: 0;
                    margin-bottom: 20px;
                    padding-bottom: 10px;
                    border-bottom: 1px dotted #e9ecef;
                }
                .section-header svg {
                    margin-right: 10px;
                    color: #007bff;
                }

                /* --- Form Grid --- */
                .form-grid {
                    display: grid;
                    gap: 20px;
                }
                .form-grid.three-cols {
                    grid-template-columns: repeat(3, 1fr);
                }
                .form-group--full-width {
                    grid-column: span 3;
                }

                /* --- Form Elements --- */
                .form-group label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: 600;
                    color: #495057;
                    font-size: 0.9em;
                }
                .required-star {
                    color: #dc3545; /* Red for required fields */
                    margin-left: 3px;
                }

                input[type="text"], 
                input[type="number"], 
                select, 
                textarea {
                    width: 100%;
                    padding: 10px 12px;
                    border: 1px solid #ced4da;
                    border-radius: 4px;
                    box-sizing: border-box;
                    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
                    font-size: 1em;
                }
                input:focus, select:focus, textarea:focus {
                    border-color: #007bff;
                    outline: 0;
                    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
                }

                /* Disabled/Display Fields */
                .input-display-value,
                .input-disabled-field {
                    background-color: #e9ecef !important;
                    color: #495057;
                    font-weight: 700;
                    border: 1px solid #adb5bd;
                }
                .balance-value {
                    font-size: 1.1em;
                    color: #28a745; /* Green for current balance */
                }

                /* --- Form Actions --- */
                .form-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 1px solid #e0e0e0;
                }

                /* Buttons */
                .btn {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 1em;
                    font-weight: 600;
                    transition: background-color 0.2s, box-shadow 0.2s;
                    display: flex;
                    align-items: center;
                }
                .btn svg {
                    margin-right: 8px;
                }
                .btn-primary-action {
                    background-color: #007bff;
                    color: white;
                }
                .btn-primary-action:hover {
                    background-color: #0056b3;
                }
                .btn-secondary {
                    background-color: #6c757d;
                    color: white;
                }
                .btn-secondary:hover {
                    background-color: #5a6268;
                }

                /* --- Responsive Adjustments --- */
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
                        flex-direction: column;
                    }
                }
            `}</style>
        </div>
    );
};

export default AccountForm;