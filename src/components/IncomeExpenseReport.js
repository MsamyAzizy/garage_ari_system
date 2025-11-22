// src/components/IncomeExpenseReport.js

import React, { useState, useEffect, useCallback } from 'react'; 
import { FaArrowLeft, FaFileExport, FaListUl, FaFilter, FaExclamationTriangle } from 'react-icons/fa'; 

// --- LOADER COMPONENT (Integrated locally) ---
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


// Mock data structure for Income (minimal for layout demonstration)
const mockIncomeData = [
    { 
        id: 1, 
        createdAt: '2025-11-05', 
        invNo: 'INV-001', 
        client: 'Azizi Bongo', 
        plate: 'T 123 ABC', 
        status: 'Paid', 
        parts: 100.00, 
        services: 250.00, 
        discount: 20.00, 
        total: 350.00, 
        paid: 350.00, 
        dueDate: 'N/A', 
        paidDate: '2025-11-05' 
    },
    // Add more mock data here if needed
];

// 🏆 NEW MOCK DATA for Expenses
const mockExpenseData = [
    { id: 1, type: 'Rent', vendor: 'Landlord Co.', poNo: 'N/A', invNo: 'E-001', date: '2025-11-01', amount: 1500.00, tax: 0.00, paid: 1500.00, due: 0.00 },
];

// 🏆 NEW MOCK DATA for Purchases
const mockPurchaseData = [
    { id: 1, poNo: 'PO-001', vendor: 'Auto Parts Inc.', invNo: 'S-045', date: '2025-11-08', items: 'Oil Filter, Brake Pads', amount: 350.00, tax: 35.00, paid: 385.00, status: 'Paid', note: 'For T 123 ABC' },
];

const IncomeExpenseReport = ({ navigateTo }) => {
    // 🛑 NEW STATE: Data loading state
    const [isLoading, setIsLoading] = useState(true); 

    // State to manage which tab is active (Income or Expenses)
    const [activeTab, setActiveTab] = useState('Expenses & Purchases'); 
    // State for filtering
    const [fromDate, setFromDate] = useState('2025-11-01');
    const [toDate, setToDate] = useState('2025-11-23');
    const [isPaidDateChecked, setIsPaidDateChecked] = useState(false);
    
    // --- Data Fetching Logic (simulated) ---
    // 🛑 FIX: Removed isPaidDateChecked from dependency array
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        console.log(`Fetching report for ${activeTab} from ${fromDate} to ${toDate}`);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        
        // In a real app, this is where you would update `mockIncomeData`, etc.
        
        setIsLoading(false);
    }, [fromDate, toDate, activeTab]); 


    // 🛑 NEW EFFECT: Runs on initial load, tab switch, or filter changes
    useEffect(() => {
        fetchData();
    }, [fetchData]);


    // --- Summary Calculations (NOTE: These still use the static mock data for display) ---
    const totalIncome = mockIncomeData.reduce((sum, item) => sum + item.total, 0).toFixed(2);
    const totalIncomePaid = mockIncomeData.reduce((sum, item) => sum + item.paid, 0).toFixed(2);
    const totalIncomeDue = mockIncomeData.reduce((sum, item) => sum + (item.total - item.paid), 0).toFixed(2);

    const expenseTotalAmountTax = mockExpenseData.reduce((sum, item) => sum + item.amount + item.tax, 0);
    const purchaseTotalAmountTax = mockPurchaseData.reduce((sum, item) => sum + item.amount + item.tax, 0);
    const totalEP_AmountTax = (expenseTotalAmountTax + purchaseTotalAmountTax).toFixed(2);
    
    const expenseTotalPaid = mockExpenseData.reduce((sum, item) => sum + item.paid, 0);
    const purchaseTotalPaid = mockPurchaseData.reduce((sum, item) => sum + item.paid, 0);
    const totalEP_Paid = (expenseTotalPaid + purchaseTotalPaid).toFixed(2);

    const expenseTotalDue = mockExpenseData.reduce((sum, item) => sum + item.due, 0);
    const purchaseTotalDue = mockPurchaseData.reduce((sum, item) => sum + (item.amount + item.tax - item.paid), 0);
    const totalEP_Due = (expenseTotalDue + purchaseTotalDue).toFixed(2);


    // Function to render data based on the active tab
    const renderTableData = () => {
        // This function will only be called when isLoading is false.
        
        if (activeTab === 'Income') {
            const data = mockIncomeData;
            // Headers setup...
            const headers = [
                'Created At', 'Inv No.', 'Client Name', 'Vehicle', 'Plate', 'Type', 'Status',
                'Parts', 'Services', 'Tax 1', 'Tax 2', 'Tax 3', 'Discount', 'Other', 'Total',
                'Paid', 'Paid Date', 'Due', '...', 
            ];
            
            // Calculate totals for the summary row 
            const totalParts = data.reduce((sum, item) => sum + item.parts, 0).toFixed(2);
            const totalServices = data.reduce((sum, item) => sum + item.services, 0).toFixed(2);
            const totalPaid = data.reduce((sum, item) => sum + item.paid, 0).toFixed(2);
            const totalDue = data.reduce((sum, item) => sum + (item.total - item.paid), 0).toFixed(2);
            
            return (
                <div className="table-wrapper">
                    <table className="data-table report-table">
                        <thead>
                            <tr>
                                {headers.map((header, index) => (
                                    <th key={index} className={header.includes('Tax') || header.includes('Other') || header.includes('Discount') ? 'financial-column' : ''}>
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.length > 0 ? data.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.createdAt}</td>
                                    <td>{item.invNo}</td>
                                    <td>{item.client}</td>
                                    <td>{item.vehicle || 'N/A'}</td>
                                    <td>{item.plate}</td>
                                    <td>{item.type || 'N/A'}</td>
                                    <td>
                                        <span className={`status-tag status-${item.status.toLowerCase()}`}>{item.status}</span>
                                    </td>
                                    
                                    {/* Financial Columns */}
                                    <td className="financial-column">$ {item.parts.toFixed(2)}</td>
                                    <td className="financial-column">$ {item.services.toFixed(2)}</td>
                                    <td className="financial-column">$ 0.00</td> 
                                    <td className="financial-column">$ 0.00</td> 
                                    <td className="financial-column">$ 0.00</td> 
                                    <td className="financial-column">$ {item.discount.toFixed(2)}</td>
                                    <td className="financial-column">$ 0.00</td> 
                                    <td className="financial-column bold">$ {item.total.toFixed(2)}</td>
                                    <td className="financial-column paid">$ {item.paid.toFixed(2)}</td>
                                    <td>{item.paidDate}</td>
                                    <td className="financial-column due">$ {(item.total - item.paid).toFixed(2)}</td>
                                    <td style={{ width: '40px' }}>
                                        {/* Action/Menu button here */}
                                        <button className="action-menu-btn">...</button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={headers.length} style={{ textAlign: 'center', padding: '20px' }}>
                                        No income records found for the selected period.
                                    </td>
                                </tr>
                            )}
                            
                            {/* Summary Row */}
                            <tr className="summary-row">
                                <td colSpan={7}></td> {/* Spacer columns */}
                                <td className="financial-column total-cell">$ {totalParts}</td>
                                <td className="financial-column total-cell">$ {totalServices}</td>
                                <td className="financial-column total-cell">$ 0.00</td>
                                <td className="financial-column total-cell">$ 0.00</td>
                                <td className="financial-column total-cell">$ 0.00</td>
                                <td colSpan={2}></td> {/* Discount, Other */}
                                <td className="financial-column total-cell">$ {(parseFloat(totalParts) + parseFloat(totalServices)).toFixed(2)}</td>
                                <td className="financial-column total-cell paid">$ {totalPaid}</td>
                                <td></td> {/* Paid Date */}
                                <td className="financial-column total-cell due">$ {totalDue}</td>
                                <td></td> {/* Action */}
                            </tr>
                        </tbody>
                    </table>
                </div>
            );
        } else {
            // EXPENSES & PURCHASES TAB LOGIC
            
            // Calculate totals for Expense Summary Row (First table)
            const expenseAmount = mockExpenseData.reduce((sum, item) => sum + item.amount, 0).toFixed(2);
            const expenseTax = mockExpenseData.reduce((sum, item) => sum + item.tax, 0).toFixed(2);
            const expensePaid = mockExpenseData.reduce((sum, item) => sum + item.paid, 0).toFixed(2);
            const expenseDue = mockExpenseData.reduce((sum, item) => sum + item.due, 0).toFixed(2);

            // Calculate totals for Purchase Summary Row (Second table)
            const purchaseAmount = mockPurchaseData.reduce((sum, item) => sum + item.amount, 0).toFixed(2);
            const purchaseTax = mockPurchaseData.reduce((sum, item) => sum + item.tax, 0).toFixed(2);
            const purchasePaid = mockPurchaseData.reduce((sum, item) => sum + item.paid, 0).toFixed(2);
            const purchaseDue = mockPurchaseData.reduce((sum, item) => sum + (item.amount + item.tax - item.paid), 0).toFixed(2);


            return (
                <div className="table-wrapper">
                    
                    {/* 1. EXPENSES TABLE */}
                    <h3 className="report-section-title">Expenses</h3>
                    <table className="data-table report-table expenses-table" style={{ marginBottom: '30px' }}>
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
                                <th style={{ width: '40px' }}>...</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockExpenseData.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.type}</td>
                                    <td>{item.vendor}</td>
                                    <td>{item.poNo}</td>
                                    <td>{item.invNo}</td>
                                    <td>{item.date}</td>
                                    <td className="financial-column">$ {item.amount.toFixed(2)}</td>
                                    <td className="financial-column">$ {item.tax.toFixed(2)}</td>
                                    <td className="financial-column">$ {item.paid.toFixed(2)}</td>
                                    <td className="financial-column due">$ {item.due.toFixed(2)}</td>
                                    <td style={{ width: '40px' }}>
                                        <button className="action-menu-btn">...</button>
                                    </td>
                                </tr>
                            ))}
                            {/* Summary Row for Expenses */}
                            <tr className="summary-row">
                                <td colSpan={5}></td> 
                                <td className="financial-column total-cell">$ {expenseAmount}</td>
                                <td className="financial-column total-cell">$ {expenseTax}</td>
                                <td className="financial-column total-cell paid">$ {expensePaid}</td>
                                <td className="financial-column total-cell due">$ {expenseDue}</td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>

                    {/* 2. PURCHASES TABLE */}
                    <h3 className="report-section-title">Purchases</h3>
                    <table className="data-table report-table purchases-table">
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
                                <th style={{ width: '40px' }}>...</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockPurchaseData.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.poNo}</td>
                                    <td>{item.vendor}</td>
                                    <td>{item.invNo}</td>
                                    <td>{item.date}</td>
                                    <td>{item.items}</td>
                                    <td className="financial-column">$ {item.amount.toFixed(2)}</td>
                                    <td className="financial-column">$ {item.tax.toFixed(2)}</td>
                                    <td className="financial-column">$ {item.paid.toFixed(2)}</td>
                                    <td className="financial-column due">$ {(item.amount + item.tax - item.paid).toFixed(2)}</td>
                                    <td><span className={`status-tag status-${item.status.toLowerCase()}`}>{item.status}</span></td>
                                    <td>{item.note}</td>
                                    <td style={{ width: '40px' }}>
                                        <button className="action-menu-btn">...</button>
                                    </td>
                                </tr>
                            ))}
                            {/* Summary Row for Purchases */}
                            <tr className="summary-row">
                                <td colSpan={5}></td> 
                                <td className="financial-column total-cell">$ {purchaseAmount}</td>
                                <td className="financial-column total-cell">$ {purchaseTax}</td>
                                <td className="financial-column total-cell paid">$ {purchasePaid}</td>
                                <td className="financial-column total-cell due">$ {purchaseDue}</td>
                                <td colSpan={2}></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            );
        }
    };

    // Handler to set tab and trigger a fetch
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        // The useEffect dependency array handles calling fetchData after state update
    };

    // Handler for filter button
    const handleFilterClick = () => {
        fetchData(); // Manually trigger fetch when Filter button is clicked
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
                
                /* Styling to match the screenshot */
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
                .date-input-group label {
                    font-weight: 500;
                    color: var(--text-color);
                }
                .date-input-group input[type="date"] {
                    padding: 8px;
                    border: 1px solid var(--border-color);
                    border-radius: 4px;
                    font-size: 14px;
                }
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
                .note-box {
                    background-color: #fef3f6; /* Light pink/red background */
                    border-left: 5px solid #e74c3c;
                    color: #c0392b;
                    padding: 5px 20px;
                    font-size: 13px;
                    margin: 0 20px 20px;
                    border-radius: 4px;
                }
                .report-section-title {
                    font-size: 18px;
                    font-weight: 600;
                    margin: 25px 0 10px 0;
                    color: var(--text-color);
                }
                .note-box.expense-note {
                    background-color: #f6f3fe; 
                    border-left: 5px solid #8e44ad; 
                    color: #4a235a;
                }
                .report-table thead th {
                    text-align: left;
                    font-size: 12px;
                    white-space: nowrap;
                }
                .report-table tbody td {
                    font-size: 13px;
                    white-space: nowrap;
                }
                .financial-column {
                    text-align: right;
                    font-weight: 500;
                }
                .financial-column.bold {
                    font-weight: 700;
                }
                .status-tag {
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 11px;
                    font-weight: bold;
                    color: white;
                }
                .status-tag.status-paid { background-color: #2ecc71; }
                .action-menu-btn {
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 16px;
                    color: var(--text-color-muted);
                }
                .summary-row {
                    background-color: #f7f7f7;
                    border-top: 2px solid #ddd;
                }
                .summary-row .total-cell {
                    font-weight: 700;
                    font-size: 14px;
                    color: var(--text-color);
                }
                .summary-row .paid {
                    color: #2ecc71; /* Green for paid */
                }
                .summary-row .due {
                    color: #e74c3c; /* Red for due */
                }
                
                /* 🏆 NEW STYLES for the Fixed Bottom Summary Bar */
                .bottom-summary-bar {
                    position: fixed;
                    bottom: 0;
                    left: 250px;
                    right: 0;;
                    padding: 15px 40px;
                    background-color: var(--bg-card); /* Should match the header background */
                    border-top: 1px solid var(--border-color);
                    display: flex;
                    justify-content: flex-end;
                    gap: 30px;
                    font-size: 15px;
                    font-weight: 600;
                    z-index: 1000;
                }
                .summary-item {
                    display: flex;
                    gap: 5px;
                    align-items: center;
                }
                .summary-item .value {
                    /* Base style for monetary values */
                }
                .summary-item .value.total {
                    color: var(--text-color);
                }
                .summary-item .value.paid {
                    color: #2ecc71; /* Green */
                }
                .summary-item .value.due {
                    color: #e74c3c; /* Red */
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
            `}</style>

            {/* Header */}
            <header className="report-header">
                <h2>
                    <button onClick={() => navigateTo('/reports')} className="icon-action" style={{ marginRight: '15px' }}><FaArrowLeft /></button>
                    Income and Expenses
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
                <button 
                    className={`tab-button ${activeTab === 'Income' ? 'active' : ''}`}
                    onClick={() => handleTabChange('Income')}
                >
                    Income
                </button>
                <button 
                    className={`tab-button ${activeTab === 'Expenses & Purchases' ? 'active' : ''}`}
                    onClick={() => handleTabChange('Expenses & Purchases')}
                    style={{ borderLeft: '1px solid #ffffff33' }}
                >
                    Expenses & Purchases
                </button>
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
                    onClick={handleFilterClick} // Call the filter handler
                    disabled={isLoading}
                >
                    <FaFilter style={{ marginRight: '5px' }} /> Filter
                </button>
                <div style={{ marginLeft: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <input type="checkbox" id="paidDateCheck" checked={isPaidDateChecked} onChange={(e) => setIsPaidDateChecked(e.target.checked)} />
                    <label htmlFor="paidDateCheck" style={{ fontWeight: 'normal' }}>by Paid Date</label>
                </div>
            </div>
            
            {/* Note */}
            {activeTab === 'Income' && (
                <div className="note-box">
                    **NOTE:** This report shows all invoices that have been created within the selected period. It does NOT include Voided, Written Off, or Refunded invoices.
                </div>
            )}
            {/* NEW NOTE for Expenses & Purchases */}
            {activeTab === 'Expenses & Purchases' && (
                <div className="note-box expense-note">
                    **NOTE:** This report shows all expenses & purchases that have been created within the selected period!
                </div>
            )}


            {/* Table Content */}
            <div className="list-content-area" style={{ padding: '0 20px 20px', overflowX: 'auto' }}>
                {isLoading ? (
                    // 🛑 Show Loader while fetching data
                    <LoaderSpinner />
                ) : (
                    // Show data when loading is complete
                    renderTableData()
                )}
            </div>

            {/* 🏆 Fixed Bottom Summary Bar */}
            {isLoading ? (
                // Show a simple loading state in the summary bar while data is fetching
                 <div className="bottom-summary-bar" style={{ justifyContent: 'center' }}>
                    <p style={{ color: 'var(--text-color-muted)' }}>Fetching Totals...</p>
                </div>
            ) : (
                activeTab === 'Income' ? (
                    // Income Tab Summary
                    <div className="bottom-summary-bar">
                        <div className="summary-item">
                            Total: <span className="value total">${totalIncome}</span>
                        </div>
                        <div className="summary-item">
                            Paid: <span className="value paid">${totalIncomePaid}</span>
                        </div>
                        <div className="summary-item">
                            Due: <span className="value due"><FaExclamationTriangle style={{ fontSize: '14px' }} /> ${totalIncomeDue}</span>
                        </div>
                    </div>
                ) : (
                    // Expenses & Purchases Tab Summary
                    <div className="bottom-summary-bar">
                        <div className="summary-item">
                            Amounts+Tax: <span className="value total">${totalEP_AmountTax}</span>
                        </div>
                        <div className="summary-item">
                            Paid: <span className="value paid">${totalEP_Paid}</span>
                        </div>
                        <div className="summary-item">
                            Due: <span className="value due"><FaExclamationTriangle style={{ fontSize: '14px' }} /> ${totalEP_Due}</span>
                        </div>
                    </div>
                )
            )}
        </div>
    );
};

export default IncomeExpenseReport;