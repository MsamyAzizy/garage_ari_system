// src/components/DebitCreditReport.js

import React, { useState, useEffect, useCallback } from 'react';
import { FaArrowLeft, FaFileExport, FaListUl, FaFilter, FaExclamationTriangle } from 'react-icons/fa';

// --- LOADER COMPONENT ---
const LOADER_COLOR = '#3a3a37ff'; // Theme primary color for consistency
const LoaderSpinner = ({ text }) => (
    <div className="loader-container">
        <div className="bar-spinner-container">
            <div className="bar bar-1"></div>
            <div className="bar bar-2"></div>
            <div className="bar bar-3"></div>
            <div className="bar bar-4"></div>
            <div className="bar bar-5"></div>
        </div>
        <p className="loading-text-spinner">{text || 'Loading Report Data...'}</p>
    </div>
);


// --- MOCK DATA ---
const mockDebitData = [
    { 
        id: 1, invNo: 'INV-003', invDate: '2025-11-10', client: 'J. Smith', vehicle: 'Mazda', plate: 'ABC 123', 
        type: 'Repair', status: 'Unpaid', 
        parts: 100.00, services: 150.00, tax1: 15.00, tax2: 0.00, tax3: 0.00, discount: 5.00, other: 10.00, 
        total: 270.00, paid: 100.00, due: 170.00, paidDate: 'N/A' 
    },
    { 
        id: 2, invNo: 'INV-005', invDate: '2025-11-15', client: 'A. Davis', vehicle: 'Honda', plate: 'DEF 456', 
        type: 'Service', status: 'Unpaid', 
        parts: 0.00, services: 150.00, tax1: 15.00, tax2: 0.00, tax3: 0.00, discount: 0.00, other: 0.00, 
        total: 165.00, paid: 0.00, due: 165.00, paidDate: 'N/A' 
    },
];

const mockExpenseData = [
    { id: 1, type: 'Office Supplies', vendor: 'Office Depot', poNo: 'PO-101', invNo: 'INV-007', date: '2025-11-01', amount: 50.00, tax: 5.00, paid: 55.00, due: 0.00 },
    { id: 2, type: 'Rent', vendor: 'Landlord Inc.', poNo: 'N/A', invNo: 'RENT-11', date: '2025-11-01', amount: 1500.00, tax: 0.00, paid: 0.00, due: 1500.00 },
];

const mockPurchasesData = [
    { id: 1, purchaseNo: 'P-901', vendor: 'Auto Parts Inc.', invNo: 'AP-555', date: '2025-11-08', items: 'Oil Filters', amount: 350.00, tax: 35.00, paid: 300.00, due: 85.00, status: 'Partial', note: 'Bulk order' },
];

const DebitCreditReport = ({ navigateTo }) => {
    // 🛑 NEW STATE: Data loading state
    const [isLoading, setIsLoading] = useState(true); 
    
    const [activeTab, setActiveTab] = useState('Debit');
    const [fromDate, setFromDate] = useState('2025-11-01');
    const [toDate, setToDate] = useState('2025-11-23');

    // --- Data Fetching Logic (simulated) ---
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        console.log(`Fetching report for ${activeTab} from ${fromDate} to ${toDate}`);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        
        setIsLoading(false);
    }, [fromDate, toDate, activeTab]); 


    // Runs on initial load, tab switch, or filter changes
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- Calculations (These still use the static mock data for display) ---
    const totalDebitTotal = mockDebitData.reduce((sum, item) => sum + item.total, 0).toFixed(2);
    const totalDebitPaid = mockDebitData.reduce((sum, item) => sum + item.paid, 0).toFixed(2);
    const totalDebitDue = mockDebitData.reduce((sum, item) => sum + item.due, 0).toFixed(2);
    
    // Credit Calculations (Expenses + Purchases combined)
    const totalCreditAmountTax = [...mockExpenseData, ...mockPurchasesData]
        .reduce((sum, item) => sum + item.amount + item.tax, 0)
        .toFixed(2);
    
    const totalCreditPaid = [...mockExpenseData, ...mockPurchasesData]
        .reduce((sum, item) => sum + item.paid, 0)
        .toFixed(2);
        
    const totalCreditDue = [...mockExpenseData, ...mockPurchasesData]
        .reduce((sum, item) => sum + item.due, 0)
        .toFixed(2);

    // Handler for filter button
    const handleFilterClick = () => {
        fetchData(); 
    };
    
    // Handler to set tab and trigger a fetch
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };


    const renderTableData = () => {
        if (activeTab === 'Debit') {
            // DEBIT (Accounts Receivable - Money You Expect to Receive) - Matches Income Report Table Structure
            const headers = [
                'Created At', 'Inv No.', 'Client Name', 'Vehicle', 'Plate', 'Type', 'Status', 
                'Parts', 'Services', 'Tax 1', 'Tax 2', 'Tax 3', 'Discount', 'Other', 
                'Total', 'Paid', 'Paid Date', 'Due', '...'
            ];
            return (
                <div className="table-wrapper debit-table-wrapper" style={{ padding: '20px 0' }}>
                    <table className="data-table report-table">
                        <thead>
                            <tr>
                                {headers.map((header, index) => (
                                    <th key={index} className={['Total', 'Paid', 'Due', 'Parts', 'Services', 'Tax 1', 'Tax 2', 'Tax 3', 'Discount', 'Other'].includes(header) ? 'financial-column' : ''}>
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {mockDebitData.length > 0 ? mockDebitData.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.invDate}</td>
                                    <td>{item.invNo}</td>
                                    <td>{item.client}</td>
                                    <td>{item.vehicle}</td>
                                    <td>{item.plate}</td>
                                    <td>{item.type}</td>
                                    <td><span className={`status-tag status-due`}>{item.status}</span></td>
                                    {/* Financial Columns */}
                                    <td className="financial-column">$ {item.parts.toFixed(2)}</td>
                                    <td className="financial-column">$ {item.services.toFixed(2)}</td>
                                    <td className="financial-column">$ {item.tax1.toFixed(2)}</td>
                                    <td className="financial-column">$ {item.tax2.toFixed(2)}</td>
                                    <td className="financial-column">$ {item.tax3.toFixed(2)}</td>
                                    <td className="financial-column">$ {item.discount.toFixed(2)}</td>
                                    <td className="financial-column">$ {item.other.toFixed(2)}</td>
                                    <td className="financial-column bold">$ {item.total.toFixed(2)}</td>
                                    <td className="financial-column paid">$ {item.paid.toFixed(2)}</td>
                                    <td>{item.paidDate}</td>
                                    <td className="financial-column due bold">$ {item.due.toFixed(2)}</td>
                                    <td style={{ width: '40px' }}><button className="action-menu-btn">...</button></td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={headers.length} style={{ textAlign: 'center', padding: '20px' }}>
                                        No outstanding invoices found for the selected period.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            );
        } else {
            // CREDIT (Accounts Payable - Money You Expect to Pay)
            return (
                <div className="credit-tables-container" style={{ padding: '20px 0' }}>
                    
                    {/* EXPENSES Table */}
                    <p className="section-title">Expenses</p>
                    <div className="table-wrapper expense-table-wrapper">
                        <table className="data-table report-table">
                            <thead>
                                <tr>
                                    <th>Expense Type</th>
                                    <th>Vendor Name</th>
                                    <th>PO Number</th>
                                    <th>Invoice Number</th>
                                    <th>Expense Date</th>
                                    <th className="financial-column">Amount</th>
                                    <th className="financial-column">Tax</th>
                                    <th className="financial-column">Paid</th>
                                    <th className="financial-column">Due</th>
                                    <th>...</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Rows for Expenses */}
                                {mockExpenseData.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.type}</td>
                                        <td>{item.vendor}</td>
                                        <td>{item.poNo}</td>
                                        <td>{item.invNo}</td>
                                        <td>{item.date}</td>
                                        <td className="financial-column">$ {item.amount.toFixed(2)}</td>
                                        <td className="financial-column">$ {item.tax.toFixed(2)}</td>
                                        <td className="financial-column paid">$ {item.paid.toFixed(2)}</td>
                                        <td className="financial-column due bold">$ {item.due.toFixed(2)}</td>
                                        <td style={{ width: '40px' }}><button className="action-menu-btn">...</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* PURCHASES Table */}
                    <p className="section-title" style={{ marginTop: '30px' }}>Purchases</p>
                    <div className="table-wrapper purchase-table-wrapper">
                        <table className="data-table report-table">
                            <thead>
                                <tr>
                                    <th>Purchase No.</th>
                                    <th>Vendor Name</th>
                                    <th>Invoice Number</th>
                                    <th>Purchase Date</th>
                                    <th>Items</th>
                                    <th className="financial-column">Amount</th>
                                    <th className="financial-column">Tax</th>
                                    <th className="financial-column">Paid</th>
                                    <th className="financial-column">Due</th>
                                    <th>Status</th>
                                    <th>Note</th>
                                    <th>...</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Rows for Purchases */}
                                {mockPurchasesData.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.purchaseNo}</td>
                                        <td>{item.vendor}</td>
                                        <td>{item.invNo}</td>
                                        <td>{item.date}</td>
                                        <td>{item.items}</td>
                                        <td className="financial-column">$ {item.amount.toFixed(2)}</td>
                                        <td className="financial-column">$ {item.tax.toFixed(2)}</td>
                                        <td className="financial-column paid">$ {item.paid.toFixed(2)}</td>
                                        <td className="financial-column due bold">$ {item.due.toFixed(2)}</td>
                                        <td><span className={`status-tag status-${item.status.toLowerCase()}`}>{item.status}</span></td>
                                        <td>{item.note}</td>
                                        <td style={{ width: '40px' }}><button className="action-menu-btn">...</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }
    };


    return (
        <div className="report-page-container">
            <style jsx>{`
                /* 🛑 LOADER STYLES */
                .loader-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 80px 0;
                    background-color: transparent; 
                    min-height: 250px;
                }
                .loading-text-spinner {
                    margin-top: 15px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: ${LOADER_COLOR};
                }
                
                .bar-spinner-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 50px; 
                    height: 40px;
                }

                .bar {
                    width: 5px;
                    height: 100%;
                    background-color: ${LOADER_COLOR};
                    margin: 0 2px;
                    display: inline-block;
                    animation: bar-stretch 1s infinite ease-in-out;
                    border-radius: 3px;
                }
                
                .bar-1 { animation-delay: -1.0s; }
                .bar-2 { animation-delay: -0.8s; }
                .bar-3 { animation-delay: -0.6s; }
                .bar-4 { animation-delay: -0.4s; }
                .bar-5 { animation-delay: -0.2s; }

                @keyframes bar-stretch {
                    0%, 100% { transform: scaleY(0.1); opacity: 0.5; }
                    50% { transform: scaleY(1.0); opacity: 1; }
                }

                /* General Styles (Keep consistent with other reports) */
                .report-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px 20px;
                    background-color: var(--bg-card);
                    border-bottom: 1px solid var(--border-color);
                }
                .report-header h2 {
                    display: flex;
                    align-items: center;
                    margin: 0;
                    font-size: 22px;
                }
                .report-actions {
                    display: flex;
                    gap: 10px;
                }
                .report-filters {
                    padding: 20px;
                    background-color: var(--bg-light);
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    border-bottom: 1px solid var(--border-color);
                }
                .date-input-group {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
                /* 🛑 Key date input style for internal calendar icon */
                .report-filters input[type="date"] {
                    padding: 8px 10px; 
                    border: 1px solid var(--border-color);
                    border-radius: 4px;
                    font-size: 14px;
                    color: var(--text-color);
                }
                /* Tab Switcher */
                .report-tab-switch {
                    display: flex;
                    margin-bottom: 20px;
                    margin-top: 10px;
                    padding: 0 20px;
                }
                .tab-button {
                    padding: 10px 20px;
                    border: none;
                    cursor: pointer;
                    font-weight: 500;
                    background-color: var(--bg-light);
                    color: var(--text-color-muted);
                    transition: all 0.2s;
                    border-radius: 6px 6px 0 0;
                }
                .tab-button.active {
                    background-color: var(--color-primary);
                    color: white;
                    font-weight: bold;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                }
                .tab-group-container {
                    display: flex;
                    border-radius: 6px;
                    overflow: hidden;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
                }

                /* Notes and Status Tags */
                .note-box {
                    padding: 5px 20px;
                    font-size: 13px;
                    margin: 0 20px 20px;
                    border-radius: 4px;
                    font-weight: 500;
                }
                .note-box.debit-note {
                    background-color: #f0f7ff;
                    border-left: 5px solid #3498db;
                    color: #2980b9; 
                }
                .note-box.credit-note {
                    background-color: #fff0f0;
                    border-left: 5px solid #e74c3c;
                    color: #c0392b; 
                }

                .status-tag {
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 10px; /* Slightly smaller for status tags */
                    font-weight: bold;
                    color: white;
                }
                .status-tag.status-unpaid, .status-tag.status-partial { background-color: #f39c12; }
                .status-tag.status-due { background-color: #e74c3c; }

                /* Table Styles */
                .report-table {
                    width: 100%;
                    font-size: 12px; /* Decreased default table font size */
                }
                .report-table th {
                    font-size: 12px; /* Smaller header size */
                    font-weight: 600;
                    padding: 8px 10px; /* Reduced vertical padding */
                }
                .report-table td {
                    padding: 5px 10px; /* Reduced vertical padding for data cells */
                    white-space: nowrap; /* Ensures data stays on a single line */
                }
                
                .section-title {
                    font-size: 16px;
                    font-weight: 600;
                    color: var(--text-color);
                    margin: 0 20px 10px;
                }
                .financial-column {
                    text-align: right;
                    font-weight: 500;
                }
                .financial-column.bold {
                    font-weight: 700;
                }
                .financial-column.paid { color: #2ecc71; }
                .financial-column.due { color: #e74c3c; }

                /* Fixed Bottom Summary Bar */
                .bottom-summary-bar {
                    position: fixed;
                    bottom: 0;
                    left: 250px;
                    right: 0;
                    padding: 12px 40px; /* Reduced padding */
                    background-color: var(--bg-card);
                    border-top: 1px solid var(--border-color);
                    display: flex;
                    justify-content: flex-end;
                    gap: 25px; /* Reduced gap */
                    font-size: 14px; /* Slightly smaller font size */
                    font-weight: 600;
                    z-index: 1000;
                }
                .summary-item {
                    display: flex;
                    gap: 5px;
                    align-items: center;
                }
                .summary-item .value {
                    color: var(--text-color);
                }
                .summary-item .paid-value {
                    color: #2ecc71;
                }
                .summary-item .due-value {
                    color: #e74c3c;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
            `}</style>

            {/* Header */}
            <header className="report-header">
                <h2>
                    <button onClick={() => navigateTo('/reports')} className="icon-action" style={{ marginRight: '15px' }}><FaArrowLeft /></button>
                    Debit and Credit
                </h2>
                <div className="report-actions">
                    <button className="btn-secondary-action">
                        <FaFileExport style={{ marginRight: '5px' }} /> Export
                    </button>
                    <button className="btn-secondary-action">
                        <FaListUl style={{ marginRight: '5px' }} /> View List
                    </button>
                </div>
            </header>

            {/* Tab Switcher */}
            <div className="report-tab-switch">
                <div className="tab-group-container">
                    <button 
                        className={`tab-button ${activeTab === 'Debit' ? 'active' : ''}`}
                        onClick={() => handleTabChange('Debit')}
                    >
                        Debit (You Expect to Receive)
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'Credit' ? 'active' : ''}`}
                        onClick={() => handleTabChange('Credit')}
                        style={{ borderLeft: '1px solid #ffffff33' }}
                    >
                        Credit (Expected of You to Pay)
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="report-filters">
                <div className="date-input-group">
                    <label htmlFor="fromDate">From:</label>
                    <input type="date" id="fromDate" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                                                            <span className="calendar-icon">&#128197;</span>

                </div>
                <div className="date-input-group">
                    <label htmlFor="toDate">To:</label>
                    <input type="date" id="toDate" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                                                            <span className="calendar-icon">&#128197;</span>

                </div>
                <button 
                    className="btn-secondary-action"
                    onClick={handleFilterClick}
                    disabled={isLoading}
                >
                    <FaFilter style={{ marginRight: '5px' }} /> Filter
                </button>
            </div>
            
            {/* Note - Uses new CSS classes for better look */}
            <div className={`note-box ${activeTab === 'Debit' ? 'debit-note' : 'credit-note'}`}>
                **NOTE:** This report shows all {activeTab === 'Debit' ? '**unpaid invoices**' : '**expenses & purchases**'} that have been created within the selected period! ONLY **DUE** records are shown.
            </div>

            {/* Table Content */}
            <div className="list-content-area" style={{ padding: '0 20px 20px', overflowX: 'auto', marginBottom: '60px' }}>
                {isLoading ? (
                    <LoaderSpinner />
                ) : (
                    renderTableData()
                )}
            </div>

            {/* Fixed Bottom Summary Bar */}
            <div className="bottom-summary-bar">
                {isLoading ? (
                    <p style={{ color: 'var(--text-color-muted)' }}>Fetching Totals...</p>
                ) : (
                    activeTab === 'Debit' ? (
                        <>
                            <div className="summary-item">
                                Total: <span className="value total">${totalDebitTotal}</span>
                            </div>
                            <div className="summary-item">
                                Paid: <span className="paid-value">${totalDebitPaid}</span>
                            </div>
                            <div className="summary-item">
                                <span className="due-value"><FaExclamationTriangle style={{ fontSize: '14px' }} /> Due: ${totalDebitDue}</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="summary-item">
                                Amounts+Tax: <span className="value total">${totalCreditAmountTax}</span>
                            </div>
                            <div className="summary-item">
                                Paid: <span className="paid-value">${totalCreditPaid}</span>
                            </div>
                            <div className="summary-item">
                                <span className="due-value"><FaExclamationTriangle style={{ fontSize: '14px' }} /> Due: ${totalCreditDue}</span>
                            </div>
                        </>
                    )
                )}
            </div>
        </div>
    );
};

export default DebitCreditReport;