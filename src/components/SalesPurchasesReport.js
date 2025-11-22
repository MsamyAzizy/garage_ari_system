// src/components/SalesPurchasesReport.js

import React, { useState, useEffect, useCallback } from 'react'; // 🛑 ADD useEffect and useCallback here
import { FaArrowLeft, FaFileExport, FaListUl, FaFilter, FaExclamationTriangle } from 'react-icons/fa'; // Added FaExclamationTriangle for consistency

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


// Mock data structure for Sales (Parts/Services added to invoices)
const mockSalesData = [
    { 
        id: 1, 
        invNo: 'INV-001', 
        invDate: '2025-11-05', 
        invStatus: 'Paid', 
        partId: 'P-123', 
        description: 'Oil Filter', 
        price: 10.00, 
        qty: 1, 
        amount: 10.00, 
        taxable: true, 
        vendor: 'N/A', 
        paidDate: '2025-11-05' 
    },
    { 
        id: 2, 
        invNo: 'INV-001', 
        invDate: '2025-11-05', 
        invStatus: 'Paid', 
        partId: 'S-456', 
        description: 'Brake Service', 
        price: 250.00, 
        qty: 1, 
        amount: 250.00, 
        taxable: true, 
        vendor: 'N/A', 
        paidDate: '2025-11-05' 
    },
];

// Mock data structure for Purchases 
const mockPurchasesData = [
    { id: 1, poNo: 'PO-001', vendor: 'Auto Parts Inc.', invNo: 'S-045', date: '2025-11-08', items: 'Oil Filter, Brake Pads', amount: 350.00, tax: 35.00, paid: 385.00, status: 'Paid', note: 'For T 123 ABC' },
];

const SalesPurchasesReport = ({ navigateTo }) => {
    // 🛑 NEW STATE: Data loading state
    const [isLoading, setIsLoading] = useState(true); 

    // Start on Sales tab to match the screenshot
    const [activeTab, setActiveTab] = useState('Sales'); 
    const [fromDate, setFromDate] = useState('2025-11-01');
    const [toDate, setToDate] = useState('2025-11-23');
    const [isPaidDateChecked, setIsPaidDateChecked] = useState(false);
    
    // --- Data Fetching Logic (simulated) ---
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        console.log(`Fetching report for ${activeTab} from ${fromDate} to ${toDate}`);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        
        setIsLoading(false);
    }, [fromDate, toDate, activeTab]); 


    // 🛑 NEW EFFECT: Runs on initial load, tab switch, or filter changes
    useEffect(() => {
        fetchData();
    }, [fetchData]);


    // Calculate Sales Summary values (for the bottom bar on Sales tab)
    const totalSalesQty = mockSalesData.reduce((sum, item) => sum + item.qty, 0);
    const totalSalesAmount = mockSalesData.reduce((sum, item) => sum + item.amount, 0).toFixed(2);
    
    // Calculate Purchase Summary values (for the bottom bar on Purchases tab, for completeness)
    const totalPurchaseAmount = mockPurchasesData.reduce((sum, item) => sum + (item.amount + item.tax), 0).toFixed(2);
    
    // Purchase Paid and Due calculation
    const totalPurchasePaid = mockPurchasesData.reduce((sum, item) => sum + item.paid, 0).toFixed(2);
    const totalPurchaseDue = mockPurchasesData.reduce((sum, item) => sum + (item.amount + item.tax - item.paid), 0).toFixed(2);


    // Handler to set tab and trigger a fetch
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        // The useEffect dependency array handles calling fetchData after state update
    };

    // Handler for filter button
    const handleFilterClick = () => {
        fetchData(); // Manually trigger fetch when Filter button is clicked
    };


    
    const renderTableData = () => {
        if (activeTab === 'Sales') {
            const data = mockSalesData;
            const headers = [
                'Invoice No.', 'Invoice Date', 'Invoice Status', 'Part id.', 'Description', 
                'Price', 'Qty', 'Amount', 'Taxable', 'Vendor', 'Paid Date', '...',
            ];
            
            return (
                <div className="table-wrapper">
                    <table className="data-table report-table sales-table">
                        <thead>
                            <tr>
                                {headers.map((header, index) => (
                                    <th key={index} className={header === 'Amount' || header === 'Price' || header === 'Qty' ? 'financial-column' : ''}>
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.length > 0 ? data.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.invNo}</td>
                                    <td>{item.invDate}</td>
                                    <td>
                                        <span className={`status-tag status-${item.invStatus.toLowerCase()}`}>{item.invStatus}</span>
                                    </td>
                                    <td>{item.partId}</td>
                                    <td>{item.description}</td>
                                    <td className="financial-column">$ {item.price.toFixed(2)}</td>
                                    <td className="financial-column">{item.qty}</td>
                                    <td className="financial-column bold">$ {item.amount.toFixed(2)}</td>
                                    <td>{item.taxable ? 'Yes' : 'No'}</td>
                                    <td>{item.vendor}</td>
                                    <td>{item.paidDate}</td>
                                    <td style={{ width: '40px' }}>
                                        <button className="action-menu-btn">...</button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={headers.length} style={{ textAlign: 'center', padding: '20px' }}>
                                        No sales records found for the selected period.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            );
        } else {
            // PURCHASES TAB LOGIC (Table based on previous IncomeExpenseReport structure)
            const headers = [
                'Purchase No.', 'Vendor Name', 'Invoice Number', 'Purchase Date', 'Items', 
                'Amount', 'Tax', 'Paid', 'Due', 'Status', 'Note', '...',
            ];

            return (
                <div className="table-wrapper">
                    <table className="data-table report-table purchases-table">
                        <thead>
                            <tr>
                                {headers.map((header, index) => (
                                    <th key={index} className={header === 'Amount' || header === 'Tax' || header === 'Paid' || header === 'Due' ? 'financial-column' : ''}>
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {mockPurchasesData.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.poNo}</td>
                                    <td>{item.vendor}</td>
                                    <td>{item.invNo}</td>
                                    <td>{item.date}</td>
                                    <td>{item.items}</td>
                                    <td className="financial-column">$ {item.amount.toFixed(2)}</td>
                                    <td className="financial-column">$ {item.tax.toFixed(2)}</td>
                                    <td className="financial-column paid">$ {item.paid.toFixed(2)}</td>
                                    <td className="financial-column due">$ {(item.amount + item.tax - item.paid).toFixed(2)}</td>
                                    <td><span className={`status-tag status-${item.status.toLowerCase()}`}>{item.status}</span></td>
                                    <td>{item.note}</td>
                                    <td style={{ width: '40px' }}>
                                        <button className="action-menu-btn">...</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        {/* Summary Row for Purchases */}
                        <tfoot className="summary-row">
                            <tr>
                                <td colSpan={5}></td> 
                                <td className="financial-column total-cell">$ {mockPurchasesData.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}</td>
                                <td className="financial-column total-cell">$ {mockPurchasesData.reduce((sum, item) => sum + item.tax, 0).toFixed(2)}</td>
                                <td className="financial-column total-cell paid">$ {totalPurchasePaid}</td>
                                <td className="financial-column total-cell due">$ {totalPurchaseDue}</td>
                                <td colSpan={2}></td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
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
                
                /* Shared Styles */
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
                    background-color: #fef3f6;
                    border-left: 5px solid #e74c3c;
                    color: #c0392b;
                    padding: 5px 20px;
                    font-size: 13px;
                    margin: 0 20px 20px;
                    border-radius: 4px;
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
                /* Footer Summary row styling */
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


                /* Sales & Purchases Specific Styles */
                .bottom-summary-bar {
                    position: fixed;
                    bottom: 0;
                    left: 250px;
                    right: 0;
                    padding: 15px 40px;
                    background-color: var(--bg-card);
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
                    color: var(--text-color);
                }
                .summary-item .value.paid {
                    color: #2ecc71; 
                }
                .summary-item .value.due {
                    color: #e74c3c;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
                .sales-note {
                    background-color: #f6f3fe; /* Light purple/blue background */
                    border-left: 5px solid #3498db;
                    color: #2980b9;
                }
            `}</style>

            {/* Header */}
            <header className="report-header">
                <h2>
                    <button onClick={() => navigateTo('/reports')} className="icon-action" style={{ marginRight: '15px' }}><FaArrowLeft /></button>
                    Sales and Purchases
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
                    className={`tab-button ${activeTab === 'Sales' ? 'active' : ''}`}
                    onClick={() => handleTabChange('Sales')}
                >
                    Sales
                </button>
                <button 
                    className={`tab-button ${activeTab === 'Purchases' ? 'active' : ''}`}
                    onClick={() => handleTabChange('Purchases')}
                    style={{ borderLeft: '1px solid #ffffff33' }}
                >
                    Purchases
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
                    onClick={handleFilterClick}
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
            {activeTab === 'Sales' && (
                <div className="note-box sales-note">
                    **NOTE:** The report includes all the **Parts** added to invoices created within the selected period. This report does **NOT** include Voided, Written Off, or Refunded invoices nor declined parts.
                </div>
            )}
            {activeTab === 'Purchases' && (
                <div className="note-box">
                    **NOTE:** This report shows all purchase records created within the selected period!
                </div>
            )}


            {/* Table Content */}
            <div className="list-content-area" style={{ padding: '0 20px 20px', overflowX: 'auto', marginBottom: '60px' }}>
                {isLoading ? (
                    <LoaderSpinner />
                ) : (
                    renderTableData()
                )}
            </div>

            {/* Fixed Bottom Summary Bar */}
            {isLoading ? (
                 <div className="bottom-summary-bar" style={{ justifyContent: 'center' }}>
                    <p style={{ color: 'var(--text-color-muted)' }}>Fetching Totals...</p>
                </div>
            ) : (
                activeTab === 'Sales' && (
                    <div className="bottom-summary-bar">
                        <div className="summary-item">
                            Qty: <span className="value">{totalSalesQty}</span>
                        </div>
                        <div className="summary-item">
                            Total: <span className="value total">${totalSalesAmount}</span>
                        </div>
                    </div>
                )
            )}
            {!isLoading && activeTab === 'Purchases' && (
                <div className="bottom-summary-bar">
                    <div className="summary-item">
                        Amounts+Tax: <span className="value total">${totalPurchaseAmount}</span>
                    </div>
                    <div className="summary-item">
                        Paid: <span className="value paid">${totalPurchasePaid}</span>
                    </div>
                    <div className="summary-item">
                        Due: <span className="value due"><FaExclamationTriangle style={{ fontSize: '14px' }} /> ${totalPurchaseDue}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SalesPurchasesReport;