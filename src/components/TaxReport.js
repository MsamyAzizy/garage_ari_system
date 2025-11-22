import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FaFileInvoiceDollar, FaFilter, FaList, FaDownload, FaTable, FaSortUp, FaSortDown, FaCalendarAlt } from 'react-icons/fa';

// --- LOADER COMPONENT ---
const LOADER_COLOR = '#3a3a37ff'; // Primary color for consistency (Dark Blue)
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

// --- 1. UTILITY FUNCTIONS ---

/*
 * Formats a number as currency.
 * @param {number} amount - The amount to format.
 * @param {string} currency - The currency symbol.
 */
const formatCurrency = (amount, currency = '$') => {
    if (typeof amount !== 'number' || isNaN(amount)) return `${currency} 0.00`;
    return `${currency} ${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};

// --- 2. MOCK DATA (Simulates API Responses) ---

const mockInvoiceTaxData = [
    { 
        invNo: 'INV-001', created: '2025-11-05', clientName: 'Azizi Bongo', type: 'Repair', 
        status: 'Paid', tax1: 50.00, tax2: 0.00, tax3: 0.00, subTotal: 450.00, total: 500.00,
        paidDate: '2025-11-10', completedAt: '2025-11-09', vehicle: 'T 123 ABC'
    },
    { 
        invNo: 'INV-002', created: '2025-11-12', clientName: 'John Doe', type: 'Service', 
        status: 'Pending', tax1: 75.00, tax2: 15.00, tax3: 0.00, subTotal: 750.00, total: 840.00, 
        paidDate: 'N/A', completedAt: 'N/A', vehicle: 'T 456 XYZ'
    },
    { 
        invNo: 'INV-003', created: '2025-11-18', clientName: 'Sarah Connor', type: 'Repair', 
        status: 'Invoiced', tax1: 120.00, tax2: 0.00, tax3: 30.00, subTotal: 1200.00, total: 1350.00,
        paidDate: 'N/A', completedAt: '2025-11-19', vehicle: 'C 800 TD'
    },
];

const mockExpensesTaxData = [
    { expenseDate: '2025-11-02', type: 'Rent', vendor: 'Landlord Co.', poNumber: 'N/A', invoiceNumber: 'E-001', tax: 10.00 },
    { expenseDate: '2025-11-15', type: 'Utilities', vendor: 'PowerCo', poNumber: 'PO-200', invoiceNumber: 'UTL-50', tax: 5.50 },
];

const mockPurchasesTaxData = [
    { purchaseDate: '2025-11-08', purchaseNo: 'PO-001', status: 'Paid', vendor: 'Auto Parts Inc.', tax: 35.00 },
];

const mockSalesTaxSummaryData = [
    { type: 'Parts', taxable: 1500.00, nonTaxable: 50.00, total: 1550.00 },
    { type: 'Services', taxable: 800.00, nonTaxable: 200.00, total: 1000.00 },
    { type: 'Discounts', taxable: -50.00, nonTaxable: 0.00, total: -50.00 },
    { type: 'Other', taxable: 10.00, nonTaxable: 0.00, total: 10.00 },
];


// --- 3. SUB-COMPONENTS (Report Views) ---

/*
 * Renders the Invoice Tax details table. 
 */
const InvoiceTax = ({ data, isLoading }) => {
    const invoices = data && data.length > 0 ? data : mockInvoiceTaxData; 

    // Calculation for the footer of this specific report
    const totals = invoices.reduce((acc, item) => {
        acc.tax1 += item.tax1 || 0;
        acc.tax2 += item.tax2 || 0;
        acc.tax3 += item.tax3 || 0;
        acc.subTotal += item.subTotal || 0;
        return acc;
    }, { tax1: 0, tax2: 0, tax3: 0, subTotal: 0 });

    if (isLoading) return <LoaderSpinner text="Loading Invoice Tax Details..." />;

    return (
        <div className="report-view-content">
            <p className="report-note">
                <FaTable style={{ marginRight: '5px' }} /> 
                NOTE:This report shows the total tax amount for each invoice. It does NOT include Voided, Written Off, or Refunded invoices.
            </p>
            
            {invoices.length === 0 ? (
                <div className="no-data-message">No invoice tax records found.</div>
            ) : (
                <div className="table-wrapper">
                    <table className="data-table detailed-tax-table">
                        <thead>
                            <tr>
                                <th>Inv No.</th><th>Created</th><th>Client Name</th><th>Type</th><th>Status</th>
                                <th style={{ textAlign: 'right' }}>Tax1 <FaSortUp /></th>
                                <th style={{ textAlign: 'right' }}>Tax2</th>
                                <th style={{ textAlign: 'right' }}>Tax3</th>
                                <th style={{ textAlign: 'right' }}>SubTotal</th>
                                <th style={{ textAlign: 'right' }}>Total</th>
                                <th>Paid Date</th>
                                <th>Completed At</th><th>Vehicle</th>
                                <th className="action-column-header">...</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map((inv, index) => (
                                <tr key={inv.invNo || index}>
                                    <td>{inv.invNo}</td><td>{inv.created}</td><td>{inv.clientName}</td><td>{inv.type}</td>
                                    <td><span className={`status-badge status-${inv.status.toLowerCase()}`}>{inv.status}</span></td>
                                    <td style={{ textAlign: 'right' }}>{formatCurrency(inv.tax1)}</td>
                                    <td style={{ textAlign: 'right' }}>{formatCurrency(inv.tax2)}</td>
                                    <td style={{ textAlign: 'right' }}>{formatCurrency(inv.tax3)}</td>
                                    <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{formatCurrency(inv.subTotal)}</td>
                                    <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{formatCurrency(inv.total)}</td>
                                    <td>{inv.paidDate}</td>
                                    <td>{inv.completedAt}</td><td>{inv.vehicle}</td>
                                    <td className="action-column-cell">...</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            
            {/* Footer mirroring the screenshot, using a neutral color */}
            <div className="report-specific-footer">
                <span>Tax1: {formatCurrency(totals.tax1)}</span> 
                <span>Tax2: {formatCurrency(totals.tax2)}</span> 
                <span>Tax3: {formatCurrency(totals.tax3)}</span> 
                <span>Subtotals: {formatCurrency(totals.subTotal)}</span>
            </div>
        </div>
    );
};

/*
 * Renders the Expenses Tax details table. 
 */
const ExpensesTax = ({ data, isLoading }) => {
    const expenses = data && data.length > 0 ? data : mockExpensesTaxData; 
    const totalTax = expenses.reduce((sum, item) => sum + (item.tax || 0), 0);

    if (isLoading) return <LoaderSpinner text="Loading Expenses Tax Details..." />;

    return (
        <div className="report-view-content">
            <p className="report-note">
                NOTE: This report shows all tax associated with expenses in the selected period.
            </p>
            {expenses.length === 0 ? (
                <div className="no-data-message">No expense tax records found.</div>
            ) : (
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Expense Date <FaSortDown /></th><th>Type</th><th>Vendor</th><th>PO Number</th><th>Invoice Number</th>
                                <th style={{ textAlign: 'right' }}>Tax</th>
                                <th className="action-column-header">...</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((exp, index) => (
                                <tr key={index}>
                                    <td>{exp.expenseDate}</td><td>{exp.type}</td><td>{exp.vendor}</td><td>{exp.poNumber}</td><td>{exp.invoiceNumber}</td>
                                    <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{formatCurrency(exp.tax)}</td>
                                    <td className="action-column-cell">...</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <div className="report-specific-footer">
                <span>Total Tax: {formatCurrency(totalTax)}</span>
            </div>
        </div>
    );
};

/**
 * Renders the Purchases Tax details table. 
 */
const PurchasesTax = ({ data, isLoading }) => {
    const purchases = data && data.length > 0 ? data : mockPurchasesTaxData; 
    const totalTax = purchases.reduce((sum, item) => sum + (item.tax || 0), 0);

    if (isLoading) return <LoaderSpinner text="Loading Purchases Tax Details..." />;

    return (
        <div className="report-view-content">
            <p className="report-note">
                NOTE: This report shows all tax associated with purchases in the selected period.
            </p>
            {purchases.length === 0 ? (
                <div className="no-data-message">No purchase tax records found.</div>
            ) : (
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Purchase Date <FaSortUp /></th><th>Purchase No.</th><th>Status</th><th>Vendor</th>
                                <th style={{ textAlign: 'right' }}>Tax</th>
                                <th className="action-column-header">...</th>
                            </tr>
                        </thead>
                        <tbody>
                            {purchases.map((pur, index) => (
                                <tr key={index}>
                                    <td>{pur.purchaseDate}</td><td>{pur.purchaseNo}</td>
                                    <td><span className={`status-badge status-${pur.status.toLowerCase()}`}>{pur.status}</span></td>
                                    <td>{pur.vendor}</td>
                                    <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{formatCurrency(pur.tax)}</td>
                                    <td className="action-column-cell">...</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <div className="report-specific-footer">
                <span>Total Tax: {formatCurrency(totalTax)}</span>
            </div>
        </div>
    );
};

/*
 * Renders the Sales Tax Summary table. 
 */
const SalesTaxSummary = ({ data, isLoading }) => {
    const summary = data && data.length > 0 ? data : mockSalesTaxSummaryData; 

    // Calculate Grand Totals
    const grandTotals = summary.reduce((acc, item) => {
        acc.taxable += item.taxable || 0;
        acc.nonTaxable += item.nonTaxable || 0;
        acc.total += item.total || 0;
        return acc;
    }, { taxable: 0, nonTaxable: 0, total: 0 });


    if (isLoading) return <LoaderSpinner text="Loading Sales Tax Summary..." />;

    return (
        <div className="report-view-content">
             <p className="report-note">
                NOTE: This report displays the total amounts from all invoices within the selected period, categorized by item type (parts, service, discounts, other) and their tax status (taxable/non-taxable). Please note that it does NOT include Voided, Written Off, Refunded invoices, or Declined items.
            </p>
            {summary.length === 0 ? (
                <div className="no-data-message">No sales tax summary data found.</div>
            ) : (
                <div className="table-wrapper">
                    <table className="data-table summary-table">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th style={{ textAlign: 'right' }}>Taxable</th>
                                <th style={{ textAlign: 'right' }}>Non-Taxable</th>
                                <th style={{ textAlign: 'right' }}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {summary.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.type}</td>
                                    <td style={{ textAlign: 'right' }}>{formatCurrency(item.taxable)}</td>
                                    <td style={{ textAlign: 'right' }}>{formatCurrency(item.nonTaxable)}</td>
                                    <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{formatCurrency(item.total)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td>Total</td>
                                <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{formatCurrency(grandTotals.taxable)}</td>
                                <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{formatCurrency(grandTotals.nonTaxable)}</td>
                                <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{formatCurrency(grandTotals.total)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}
        </div>
    );
};


// --- 4. MAIN TAX REPORT COMPONENT ---

const TaxReport = ({ onExport = () => console.log('Exporting...'), onViewList = () => console.log('Viewing List...') }) => {
    const [activeReport, setActiveReport] = useState('InvoiceTax');
    const [dateRange, setDateRange] = useState({ 
        from: '2025-11-01', 
        to: '2025-11-23' 
    });
    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const tabMap = useMemo(() => ([
        { label: 'Invoice Tax', key: 'InvoiceTax', Component: InvoiceTax },
        { label: 'Expenses Tax', key: 'ExpensesTax', Component: ExpensesTax },
        { label: 'Purchases Tax', key: 'PurchasesTax', Component: PurchasesTax },
        { label: 'Sales Tax Report', key: 'SalesTaxReport', Component: SalesTaxSummary },
    ]), []);

    const fetchData = useCallback(async (reportType, dates) => {
        setIsLoading(true);
        console.log(`Fetching data for: ${reportType} between ${dates.from} and ${dates.to}`);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1200)); 
        let mockDataResult = [];
        switch (reportType) {
            case 'InvoiceTax': mockDataResult = mockInvoiceTaxData; break;
            case 'ExpensesTax': mockDataResult = mockExpensesTaxData; break;
            case 'PurchasesTax': mockDataResult = mockPurchasesTaxData; break;
            case 'SalesTaxReport': mockDataResult = mockSalesTaxSummaryData; break;
            default: mockDataResult = [];
        }
        
        setData(prev => ({ ...prev, [reportType]: mockDataResult }));
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchData(activeReport, dateRange);
    }, [activeReport, dateRange, fetchData]);


    // Handler for tab switch
    const handleTabChange = (tabKey) => {
        setActiveReport(tabKey);
        fetchData(tabKey, dateRange); 
    }

    // Handler for filter button
    const handleFilterClick = () => {
        fetchData(activeReport, dateRange);
    }

    const calculateGrandTotalTax = () => {
        // We calculate this based on the mock data, assuming a complete view across all tabs
        let total = 0;
        
        mockInvoiceTaxData.forEach(item => {
            total += (item.tax1 || 0) + (item.tax2 || 0) + (item.tax3 || 0);
        });

        mockExpensesTaxData.forEach(item => {
            total += (item.tax || 0);
        });

        mockPurchasesTaxData.forEach(item => {
            total += (item.tax || 0);
        });
        
        return total;
    };


    const CurrentComponent = tabMap.find(t => t.key === activeReport)?.Component;
    const currentData = data[activeReport];
    const totalTax = calculateGrandTotalTax();

    return (
        <div className="report-page-container">
            {/* Header */}
            <header className="page-header report-header">
                <h2><FaFileInvoiceDollar style={{ marginRight: '8px' }} /> Tax Report</h2>
                <div className="header-actions">
                    <button className="btn-secondary-action" onClick={onExport} title="Export Data">
                        <FaDownload /> Export
                    </button>
                    <button className="btn-secondary-action" onClick={onViewList} title="View All Reports">
                        <FaList /> View List
                    </button>
                </div>
            </header>

            {/* Tab Navigation */}
            <div className="report-tabs">
                {tabMap.map(tab => (
                    <button
                        key={tab.key}
                        className={`tab-button ${activeReport === tab.key ? 'active' : ''}`}
                        onClick={() => handleTabChange(tab.key)}
                        disabled={isLoading} // 🛑 DISABLE TABS WHILE LOADING
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Date Picker and Filter (UPDATED to match Image 2 and use FaCalendarAlt) */}
            <div className="filter-bar">
                <span className="filter-label">From:</span>
                <div className="date-input-wrapper">
                    <input type="date" value={dateRange.from} onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))} />
                    <FaCalendarAlt className="calendar-icon" /> {/* 🛑 Use FaCalendarAlt */}
                </div>
                
                <span className="filter-label" style={{ marginLeft: '10px' }}>To:</span>
                <div className="date-input-wrapper">
                    <input type="date" value={dateRange.to} onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))} />
                    <FaCalendarAlt className="calendar-icon" /> {/* 🛑 Use FaCalendarAlt */}
                </div>
                
                <label style={{marginLeft: '10px', display: 'flex', alignItems: 'center'}}>
                    <input type="checkbox" style={{ marginRight: '5px' }} /> by Paid Date
                </label>
                
                <button 
                    className="btn-filter" 
                    onClick={handleFilterClick}
                    disabled={isLoading} // 🛑 DISABLE FILTER WHEN LOADING
                    style={{ marginLeft: '10px' }} 
                >
                    <FaFilter /> Filter
                </button>
            </div>
            
            {/* Report Content Area */}
            <div className="list-content-area" style={{ padding: '20px' }}>
                {CurrentComponent ? (
                    <CurrentComponent data={currentData} isLoading={isLoading} />
                ) : (
                    <div className="no-data-message">Report component not found.</div>
                )}
            </div>

            {/* Main Footer Summary (Always visible at the bottom) */}
            <footer className="report-footer main-tax-footer">
                <p>Total Tax: {isLoading ? 'Fetching Totals...' : formatCurrency(totalTax)}</p>
            </footer>

            {/* CSS Styles for this component */}
            <style jsx global>{`
                /* General Variables */
                :root {
                    --color-primary: #5c6bc0; /* Dark Blue */
                    --color-secondary: #f39c12; /* Orange for WIP */
                    --color-success: #2ecc71; /* Green for Paid */
                    --color-paid-neutral: #555; /* Neutral Dark Grey for Paid status (as per previous request) */
                    --color-unpaid: #cc0033; /* Red for Unpaid/Pending */
                    --color-invoiced: #5c6bc0; /* Primary Blue for Invoiced */
                    --color-border: #eee;
                    --color-background-light: #f5f7fa;
                    --color-text-primary: #333;
                    --color-text-muted: #777;
                }

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
                /* END LOADER STYLES */


                /* Page and Header Layout */
                .report-page-container {
                    padding: 0;
                    background-color: var(--color-background-light);
                    min-height: 100vh;
                    display: flex; 
                    flex-direction: column;
                }

                .report-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px 20px;
                    background-color: white;
                    border-bottom: 1px solid var(--color-border);
                }

                .report-header h2 {
                    font-size: 1.4rem;
                    color: var(--color-text-primary);
                }

                .header-actions button {
                    margin-left: 10px;
                    background-color: transparent;
                    border: 1px solid var(--color-border);
                    color: var(--color-primary);
                    padding: 8px 15px;
                    border-radius: 4px;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    font-weight: 500;
                }
                .header-actions button:hover {
                    background-color: var(--color-background-light);
                }

                /* Tab Navigation */
                .report-tabs {
                    display: flex;
                    padding: 10px 20px 0;
                    gap: 5px;
                    background-color: white;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                    z-index: 10;
                }

                .tab-button {
                    padding: 8px 15px;
                    border: none;
                    background-color: transparent;
                    color: var(--color-text-muted);
                    font-weight: 500;
                    cursor: pointer;
                    border-bottom: 3px solid transparent;
                    transition: all 0.2s;
                    font-size: 0.95rem;
                }

                .tab-button.active {
                    color: var(--color-primary);
                    border-bottom: 3px solid var(--color-primary);
                    font-weight: 600;
                }
                .tab-button:disabled {
                    cursor: not-allowed;
                    opacity: 0.7;
                }

                /* Filter Bar */
                .filter-bar {
                    display: flex;
                    align-items: center;
                    padding: 15px 20px;
                    background-color: white;
                    border-bottom: 1px solid var(--color-border);
                    box-shadow: 0 1px 3px rgba(0,0,0,0.02);
                    flex-wrap: wrap; 
                }

                .filter-bar .filter-label {
                    color: var(--color-text-primary);
                    font-weight: 500;
                    margin-right: 5px; 
                }

                /* Wrapper for date input and calendar icon (UPDATED to match FaCalendarAlt usage) */
                .date-input-wrapper {
                    position: relative;
                    display: inline-flex;
                    align-items: center;
                    border: 1px solid var(--color-border);
                    border-radius: 4px;
                    padding: 0; 
                    background-color: white;
                    margin-right: 15px; 
                }

                .date-input-wrapper input[type="date"] {
                    padding: 8px;
                    border: none; 
                    background: transparent;
                    font-size: 0.9rem;
                    color: var(--color-text-primary);
                    cursor: pointer;
                    flex-grow: 1; 
                    -webkit-appearance: none; /* Hide default calendar icon on Chrome/Safari */
                    appearance: none; /* Hide default calendar icon */
                    padding-right: 35px; /* Make space for the icon */
                }
                .date-input-wrapper input[type="date"]::-webkit-calendar-picker-indicator {
                    opacity: 0; /* Hide default calendar icon visual */
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    top: 0;
                    left: 0;
                    cursor: pointer;
                }

                .date-input-wrapper .calendar-icon {
                    position: absolute;
                    right: 8px; /* Position the FaCalendarAlt icon */
                    color: var(--color-text-muted);
                    font-size: 1rem;
                    pointer-events: none; 
                }

                .btn-filter {
                    padding: 8px 15px;
                    background-color: var(--color-primary);
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: background-color 0.2s;
                }
                .btn-filter:hover {
                    background-color: #4a5aa8;
                }
                .btn-filter:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
                
                /* Report Notes */
                .report-note {
                    background-color: #f7e6e9; 
                    color: #cc0033; 
                    padding: 10px 15px;
                    font-size: 0.9rem;
                    margin-bottom: 15px;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    border-left: 4px solid #cc0033;
                }

                /* Table Styling (Inherited from previous updates for cleanliness) */
                .table-wrapper {
                    overflow-x: auto;
                    max-width: 100%;
                    background-color: white;
                }

                .data-table {
                    width: 100%;
                    min-width: 1200px;
                    border-collapse: collapse;
                }

                .data-table th, .data-table td {
                    padding: 12px 15px;
                    border-bottom: 1px solid #f0f0f0;
                    text-align: left;
                    white-space: nowrap;
                    font-size: 0.9rem;
                    color: var(--color-text-primary);
                }

                .data-table th {
                    background-color: transparent;
                    color: var(--color-text-muted);
                    font-weight: 600;
                    text-transform: none;
                    font-size: 0.85rem;
                    cursor: pointer;
                    border-bottom: 2px solid #ddd;
                }
                
                .data-table tbody tr:hover {
                    background-color: #f9f9f9;
                }

                .data-table tfoot td {
                    background-color: #f5f5f5;
                    font-size: 1rem;
                    border-top: 1px solid #ccc;
                    color: var(--color-text-primary);
                }
                
                /* Status Badges */
                .status-badge {
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: white;
                }
                .status-paid { background-color: var(--color-paid-neutral); }
                .status-pending, .status-unpaid { background-color: var(--color-unpaid); }
                .status-wip { background-color: var(--color-secondary); }
                .status-invoiced { background-color: var(--color-invoiced); }

                /* Footer Styling */
                .report-specific-footer {
                    display: flex;
                    justify-content: flex-end;
                    gap: 20px;
                    padding: 10px 20px;
                    margin-top: 0;
                    background-color: white; 
                    border-top: 1px solid #ddd;
                    border-bottom: 1px solid #ddd;
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: var(--color-text-primary);
                }
                
                /* Main Page Footer */
                .report-footer.main-tax-footer {
                    position: fixed;
                    bottom: 0;
                    left: 250px; 
                    right: 0;
                    width: calc(100% - 250px); 
                    padding: 10px 20px;
                    background-color: white;
                    border-top: 1px solid #ddd;
                    color: var(--color-text-primary);
                    font-weight: 700;
                    text-align: right;
                    z-index: 1000;
                    box-shadow: 0 -2px 5px rgba(0,0,0,0.05);
                }
                .report-footer.main-tax-footer p {
                    margin: 0;
                    font-size: 1rem;
                }

                /* Mobile/Small screen adjustments for fixed footer */
                @media (max-width: 768px) {
                    .report-footer.main-tax-footer {
                        left: 0;
                        width: 100%;
                    }
                    .filter-bar {
                        flex-direction: column; 
                        align-items: flex-start;
                    }
                    .filter-bar .date-input-wrapper,
                    .filter-bar .filter-label,
                    .filter-bar label {
                        margin-bottom: 10px; 
                    }
                    .filter-bar .date-input-wrapper {
                        margin-right: 0; 
                    }
                }
            `}</style>
        </div>
    );
};

export default TaxReport;