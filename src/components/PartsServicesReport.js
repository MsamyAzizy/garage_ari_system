// src/components/PartsServicesReport.js

import React, { useState, useEffect, useCallback } from 'react';
import { FaArrowLeft, FaFileExport, FaListUl, FaFilter } from 'react-icons/fa';

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

// Mock data for Parts tab (no change)
const mockPartsData = [
    { 
        id: 1, invDate: '2025-11-10', invNo: 'INV-003', client: 'J. Smith', invStatus: 'Paid', 
        partId: 'P-1001', description: 'Oil Filter (Wix)', qty: 1, price: 10.00, amount: 10.00, 
        taxable: true, vendor: 'Parts Co.', paidDate: '2025-11-11' 
    },
    { 
        id: 2, invDate: '2025-11-15', invNo: 'INV-005', client: 'A. Davis', invStatus: 'Unpaid', 
        partId: 'P-1005', description: 'Brake Pads (Front)', qty: 1, price: 85.00, amount: 85.00, 
        taxable: true, vendor: 'Auto Parts Inc.', paidDate: 'N/A' 
    },
];

// Mock data for Services tab (no change)
const mockServicesData = [
    { 
        id: 1, invDate: '2025-11-10', invNo: 'INV-003', client: 'J. Smith', invStatus: 'Paid', 
        serviceCode: 'S-201', serviceName: 'Standard Oil Change', description: 'Includes filter, oil & check', 
        hrs: 1.5, rate: 100.00, amount: 150.00, 
        taxable: false, paidDate: '2025-11-11' 
    },
    { 
        id: 2, invDate: '2025-11-15', invNo: 'INV-005', client: 'A. Davis', invStatus: 'Unpaid', 
        serviceCode: 'S-205', serviceName: 'Brake Rotor Resurface', description: 'Front pair, labor only', 
        hrs: 2.0, rate: 50.00, amount: 100.00, 
        taxable: false, paidDate: 'N/A' 
    },
];

// Mock data for Sales Tax Report (New detailed structure matching screenshot)
const mockSalesTaxSummaryData = [
    { type: 'Parts', taxable: 95.00, nonTaxable: 0.00, total: 95.00 },
    { type: 'Services', taxable: 0.00, nonTaxable: 250.00, total: 250.00 },
    { type: 'Discounts', taxable: 0.00, nonTaxable: 0.00, total: 0.00 },
    { type: 'Other', taxable: 0.00, nonTaxable: 0.00, total: 0.00 },
];


const PartsServicesReport = ({ navigateTo }) => {
    // 🛑 NEW STATE: Data loading state
    const [isLoading, setIsLoading] = useState(true); 

    const [activeTab, setActiveTab] = useState('Parts');
    const [fromDate, setFromDate] = useState('2025-11-01');
    const [toDate, setToDate] = useState('2025-11-23');
    const [isPaidDateChecked, setIsPaidDateChecked] = useState(false);


    // --- Data Fetching Logic (simulated) ---
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        console.log(`Fetching report for ${activeTab} from ${fromDate} to ${toDate} (by Paid Date: ${isPaidDateChecked})`);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        
        setIsLoading(false);
    }, [fromDate, toDate, activeTab, isPaidDateChecked]); 


    // Runs on initial load, tab switch, or filter changes
    useEffect(() => {
        fetchData();
    }, [fetchData]);


    // Handler for filter button
    const handleFilterClick = () => {
        fetchData(); 
    };
    
    // Handler to set tab and trigger a fetch
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };


    // --- Calculations ---
    const totalQtyParts = mockPartsData.reduce((sum, item) => sum + item.qty, 0).toFixed(2);
    const totalAmountParts = mockPartsData.reduce((sum, item) => sum + item.amount, 0).toFixed(2);
    
    const totalHrsServices = mockServicesData.reduce((sum, item) => sum + item.hrs, 0).toFixed(2);
    const totalAmountServices = mockServicesData.reduce((sum, item) => sum + item.amount, 0).toFixed(2);

    // New Calculations for Sales Tax Summary
    const totalTaxable = mockSalesTaxSummaryData.reduce((sum, item) => sum + item.taxable, 0);
    const totalNonTaxable = mockSalesTaxSummaryData.reduce((sum, item) => sum + item.nonTaxable, 0);
    const totalTotal = mockSalesTaxSummaryData.reduce((sum, item) => sum + item.total, 0);

    const renderTableData = () => {
        if (activeTab === 'Parts') {
            const headers = [
                'Invoice Date', 'Invoice No.', 'Client Name', 'Invoice Status', 
                'Part id.', 'Description', 'Qty', 'price', 'Amount', 'Taxable', 'Vendor', 'Paid Date', '...'
            ];
            return (
                <div className="table-wrapper" style={{ padding: '20px 0' }}>
                    <table className="data-table report-table">
                        <thead>
                            <tr>
                                {headers.map((header, index) => (
                                    <th key={index} className={['Qty', 'price', 'Amount'].includes(header) ? 'financial-column' : ''}>
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {mockPartsData.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.invDate}</td>
                                    <td>{item.invNo}</td>
                                    <td>{item.client}</td>
                                    <td><span className={`status-tag status-${item.invStatus.toLowerCase()}`}>{item.invStatus}</span></td>
                                    <td>{item.partId}</td>
                                    <td>{item.description}</td>
                                    <td className="financial-column">{item.qty.toFixed(2)}</td>
                                    <td className="financial-column">$ {item.price.toFixed(2)}</td>
                                    <td className="financial-column bold">$ {item.amount.toFixed(2)}</td>
                                    <td>{item.taxable ? 'Yes' : 'No'}</td>
                                    <td>{item.vendor}</td>
                                    <td>{item.paidDate}</td>
                                    <td style={{ width: '40px' }}><button className="action-menu-btn">...</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        } else if (activeTab === 'Services') {
            // UPDATED HEADERS for Services tab
            const headers = [
                'Invoice Date', 'Invoice No.', 'Client Name', 'Invoice Status', 
                'Service Code', 'Service Name', 'Description', 'Hrs', 'Rate', 'Amount', 'Taxable', 'Paid Date', '...'
            ];
            return (
                <div className="table-wrapper" style={{ padding: '20px 0' }}>
                    <table className="data-table report-table">
                        <thead>
                            <tr>
                                {headers.map((header, index) => (
                                    <th key={index} className={['Hrs', 'Rate', 'Amount'].includes(header) ? 'financial-column' : ''}>
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {mockServicesData.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.invDate}</td>
                                    <td>{item.invNo}</td>
                                    <td>{item.client}</td>
                                    <td><span className={`status-tag status-${item.invStatus.toLowerCase()}`}>{item.invStatus}</span></td>
                                    {/* NEW FIELDS MAPPING */}
                                    <td>{item.serviceCode}</td>
                                    <td>{item.serviceName}</td>
                                    <td>{item.description}</td>
                                    <td className="financial-column">{item.hrs.toFixed(2)}</td>
                                    <td className="financial-column">$ {item.rate.toFixed(2)}</td>
                                    <td className="financial-column bold">$ {item.amount.toFixed(2)}</td>
                                    <td>{item.taxable ? 'Yes' : 'No'}</td>
                                    <td>{item.paidDate}</td>
                                    <td style={{ width: '40px' }}><button className="action-menu-btn">...</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        } else if (activeTab === 'Sales Tax report') {
            // NEW HEADERS & STRUCTURE for Sales Tax Report
            const headers = [
                'Type', 'Taxable', 'Non-Taxable', 'Total'
            ];
            return (
                <div className="table-wrapper" style={{ padding: '20px 0' }}>
                    {/* The screenshot shows an 'Export to Excel' button here */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                        <button className="btn-secondary-action">
                            <FaFileExport style={{ marginRight: '5px' }} /> Export to Excel
                        </button>
                    </div>
                    
                    <table className="data-table report-table tax-summary-table">
                        <thead>
                            <tr>
                                {headers.map((header, index) => (
                                    <th key={index} className={header !== 'Type' ? 'financial-column' : ''}>
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {mockSalesTaxSummaryData.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.type}</td>
                                    <td className="financial-column">$ {item.taxable.toFixed(2)}</td>
                                    <td className="financial-column">$ {item.nonTaxable.toFixed(2)}</td>
                                    <td className="financial-column bold">$ {item.total.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="summary-row">
                            <tr>
                                <td>**Total:**</td>
                                <td className="financial-column total-cell">$ {totalTaxable.toFixed(2)}</td>
                                <td className="financial-column total-cell">$ {totalNonTaxable.toFixed(2)}</td>
                                <td className="financial-column total-cell">$ {totalTotal.toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            );
        }
    };


    const renderSummaryBar = () => {
        if (isLoading) {
             return <p style={{ color: 'var(--text-color-muted)' }}>Fetching Totals...</p>;
        }
        
        if (activeTab === 'Parts') {
            return (
                <>
                    <div className="summary-item">
                        Qty: <span className="value">{totalQtyParts}</span>
                    </div>
                    <div className="summary-item">
                        Total: <span className="value bold">${totalAmountParts}</span>
                    </div>
                </>
            );
        } else if (activeTab === 'Services') {
            return (
                <>
                    <div className="summary-item">
                        Hrs: <span className="value">{totalHrsServices}</span>
                    </div>
                    <div className="summary-item">
                        Total: <span className="value bold">${totalAmountServices}</span>
                    </div>
                </>
            );
        } else if (activeTab === 'Sales Tax report') {
            // Summary for the Sales Tax Report now uses the calculated total total
            return (
                <div className="summary-item">
                    Total Revenue: <span className="value bold">${totalTotal.toFixed(2)}</span>
                </div>
            );
        }
        return null;
    };


    // Determine the Note text based on the active tab
    const getNoteText = () => {
        switch (activeTab) {
            case 'Parts':
                return 'This report shows all **parts** included on your invoices! The report does NOT include Voided, Written Off, or Refunded invoices nor Declined parts or services.';
            case 'Services':
                return 'This report shows all **services** included on your invoices! The report does NOT include Voided, Written Off, or Refunded invoices nor Declined parts or services.';
            case 'Sales Tax report':
                // Note text adjusted to match the screenshot for Sales Tax Report
                return 'The report does NOT include Voided, Written Off, or Refunded invoices nor Declined items.';
            default:
                return '';
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
                .filter-checkbox {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
                .filter-checkbox label {
                    font-weight: normal;
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
                    /* Standardized Note style for these reports (light blue/info tone) */
                    background-color: #f0f7ff;
                    border-left: 5px solid #3498db;
                    color: #2980b9; 
                }

                .status-tag {
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 10px;
                    font-weight: bold;
                    color: white;
                }
                .status-tag.status-paid { background-color: #2ecc71; } /* Green for Paid */
                .status-tag.status-unpaid { background-color: #f39c12; } /* Orange for Unpaid/Partial */


                /* Table Styles (Reduced font size for fit) */
                .report-table {
                    width: 100%;
                    font-size: 13px;
                }
                .report-table th {
                    font-size: 12px;
                    font-weight: 600;
                    padding: 8px 10px;
                }
                .report-table td {
                    padding: 5px 10px;
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


                /* Fixed Bottom Summary Bar */
                .bottom-summary-bar {
                    position: fixed;
                    bottom: 0;
                    left: 250px;
                    right: 0;
                    padding: 12px 40px;
                    background-color: var(--bg-card);
                    border-top: 1px solid var(--border-color);
                    display: flex;
                    justify-content: flex-end;
                    gap: 25px;
                    font-size: 14px;
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
                    font-weight: 700;
                }
            `}</style>

            {/* Header */}
            <header className="report-header">
                <h2>
                    <button onClick={() => navigateTo('/reports')} className="icon-action" style={{ marginRight: '15px' }}><FaArrowLeft /></button>
                    Parts & Services
                </h2>
                <div className="report-actions">
                    <button className="btn-secondary-action">
                        <FaListUl style={{ marginRight: '5px' }} /> View List
                    </button>
                </div>
            </header>

            {/* Tab Switcher */}
            <div className="report-tab-switch">
                <div className="tab-group-container">
                    <button 
                        className={`tab-button ${activeTab === 'Parts' ? 'active' : ''}`}
                        onClick={() => handleTabChange('Parts')}
                    >
                        Parts
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'Services' ? 'active' : ''}`}
                        onClick={() => handleTabChange('Services')}
                        style={{ borderLeft: '1px solid #ffffff33' }}
                    >
                        Services
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'Sales Tax report' ? 'active' : ''}`}
                        onClick={() => handleTabChange('Sales Tax report')}
                        style={{ borderLeft: '1px solid #ffffff33' }}
                    >
                        Sales tax report
                    </button>
                </div>
            </div>

            {/* Filters (Show for all tabs) */}
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
                <div className="filter-checkbox">
                    <input 
                        type="checkbox" 
                        id="byPaidDate" 
                        name="byPaidDate" 
                        checked={isPaidDateChecked} 
                        onChange={(e) => setIsPaidDateChecked(e.target.checked)}
                    />
                    <label htmlFor="byPaidDate">by Paid Date</label>
                </div>
                <button 
                    className="btn-secondary-action"
                    onClick={handleFilterClick}
                    disabled={isLoading}
                >
                    <FaFilter style={{ marginRight: '5px' }} /> Filter
                </button>
            </div>
            
            {/* Note */}
            <div className="note-box">
                **NOTE:** {getNoteText()}
            </div>

            {/* Table Content */}
            <div className="list-content-area" style={{ padding: '0 20px 20px', overflowX: 'auto', marginBottom: '60px' }}>
                {isLoading ? (
                    <LoaderSpinner text={`Loading ${activeTab}...`} />
                ) : (
                    renderTableData()
                )}
            </div>

            {/* Fixed Bottom Summary Bar */}
            <div className="bottom-summary-bar">
                {renderSummaryBar()}
            </div>
        </div>
    );
};

export default PartsServicesReport;