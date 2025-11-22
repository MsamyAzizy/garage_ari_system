import React, { useState, useEffect, useCallback } from 'react';
import { FaFilter, FaDownload, FaList, FaUserTie, FaSortDown, FaAngleLeft, FaCalendarAlt } from 'react-icons/fa';

// --- LOADER COMPONENT (Reused) ---
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

// --- UTILITY FUNCTIONS ---
const formatCurrency = (amount, currency = '$') => {
    if (typeof amount !== 'number' || isNaN(amount)) return `${currency} 0.00`;
    return `${currency} ${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};

// --- MOCK DATA ---
const mockVendorData = [
    {
        name: 'Auto Parts Inc.',
        address: '123 Supply Ln, Detroit, MI 48201',
        email: 'supply@autoparts.com',
        phone: '555-1000',
        taxId: 'TX-45678',
        expensesTotal: 1500.00, // Total expense records with this vendor
        purchasesTotal: 5500.50, // Total purchase order records with this vendor
        lastActivityDate: '2024-11-15' 
    },
    {
        name: 'Landlord Co.',
        address: '777 Building Blvd, Chicago, IL 60601',
        email: 'rent@landlordco.com',
        phone: '555-2000',
        taxId: 'TX-11223',
        expensesTotal: 3000.00,
        purchasesTotal: 0.00,
        lastActivityDate: '2024-11-01'
    },
    {
        name: 'Tool Supplier LLC',
        address: '400 Equipment Way, Dallas, TX 75201',
        email: 'tools@supplier.com',
        phone: '555-3000',
        taxId: 'TX-90123',
        expensesTotal: 500.00,
        purchasesTotal: 100.00,
        lastActivityDate: '2024-10-25'
    },
];

// --- VENDORS REPORT COMPONENT ---

const VendorsReport = ({ 
    onExport = () => console.log('Exporting...'), 
    onViewList = () => console.log('Viewing List...'),
    navigateTo = (path) => console.log(`Navigating to ${path}`) 
}) => {
    const [vendors, setVendors] = useState(mockVendorData);
    const [dateRange, setDateRange] = useState({ 
        from: '2024-10-01', 
        to: new Date().toISOString().split('T')[0] 
    });
    const [isLoading, setIsLoading] = useState(false);

    // Simulated Fetch/Filter function
    const handleFilter = useCallback(async () => {
        setIsLoading(true);
        console.log(`Filtering vendor activity between ${dateRange.from} and ${dateRange.to}`);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // In a real app, this is where you'd filter the data based on dateRange.
        // For now, we reset to mock data after the delay.
        setVendors(mockVendorData); 
        setIsLoading(false);
    }, [dateRange]);

    useEffect(() => {
        // Initial load on mount
        handleFilter();
    }, [handleFilter]);
    
    // --- Calculations ---
    const totalExpenses = vendors.reduce((sum, v) => sum + v.expensesTotal, 0);
    const totalPurchases = vendors.reduce((sum, v) => sum + v.purchasesTotal, 0);
    const totalPayouts = totalExpenses + totalPurchases;

    // --- Render Logic ---

    return (
        <div className="report-page-container">
            
            {/* Header */}
            <header className="page-header report-header">
                <button className="back-button" onClick={() => navigateTo('/reports')}>
                    <FaAngleLeft />
                </button>
                <h2><FaUserTie style={{ marginRight: '8px' }} /> Vendors Report</h2>
                <div className="header-actions">
                    <button className="btn-primary-action" onClick={onExport} title="Export Data" disabled={isLoading}>
                        <FaDownload /> Export
                    </button>
                    <button className="btn-secondary-action" onClick={() => navigateTo('/reports')} title="View All Reports" disabled={isLoading}>
                        <FaList /> View List
                    </button>
                </div>
            </header>

            {/* Filter Bar */}
            <div className="filter-bar">
                <span className="filter-label">From:</span>
                <div className="date-input-wrapper">
                    <input type="date" value={dateRange.from} onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))} disabled={isLoading} />
                    <FaCalendarAlt className="calendar-icon" /> {/* 🛑 FaCalendarAlt icon */}
                </div>
                
                <span className="filter-label" style={{ marginLeft: '10px' }}>To:</span>
                <div className="date-input-wrapper">
                    <input type="date" value={dateRange.to} onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))} disabled={isLoading} />
                    <FaCalendarAlt className="calendar-icon" /> {/* 🛑 FaCalendarAlt icon */}
                </div>
                
                <button 
                    className="btn-filter" 
                    onClick={handleFilter}
                    style={{ marginLeft: '10px' }} 
                    disabled={isLoading}
                >
                    <FaFilter /> Filter
                </button>
            </div>
            
            {/* Report Content Area */}
            <div className="list-content-area" style={{ padding: '20px' }}>
                <div className="report-view-content">
                    {isLoading ? (
                        <LoaderSpinner text="Fetching Vendor Data..." />
                    ) : (
                        <>
                            <p className="report-note">
                                NOTE: This report shows all vendors as well as their total expenses and purchases incurred within the selected period. Taxes are included in the report. Don't see all the Vendors? Make sure you add the exact name of the missing vendor in the Profile/Vendors section.
                            </p>
                            {vendors.length === 0 ? (
                                <div className="no-data-message">No vendor records found.</div>
                            ) : (
                                <div className="table-wrapper">
                                    <table className="data-table vendors-table">
                                        <thead>
                                            <tr>
                                                <th>Name <FaSortDown /></th>
                                                <th>Address</th>
                                                <th>Email</th>
                                                <th>Phone</th>
                                                <th>Tax ID</th>
                                                <th>Expenses Within Period</th>
                                                <th>Purchases Within Period</th>
                                                <th className="action-column-header">...</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {vendors.map((vendor, index) => (
                                                <tr key={index}>
                                                    <td>{vendor.name}</td>
                                                    <td>{vendor.address}</td>
                                                    <td>{vendor.email}</td>
                                                    <td>{vendor.phone}</td>
                                                    <td>{vendor.taxId}</td>
                                                    <td>{formatCurrency(vendor.expensesTotal)}</td>
                                                    <td>{formatCurrency(vendor.purchasesTotal)}</td>
                                                    <td className="action-column-cell">...</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Total Footer */}
            <div className="report-specific-footer">
                <span>Total Expenses: {isLoading ? '...' : formatCurrency(totalExpenses)}</span>
                <span>Total Purchases: {isLoading ? '...' : formatCurrency(totalPurchases)}</span>
                <span className="total-payouts-sum">Total Payouts: {isLoading ? '...' : formatCurrency(totalPayouts)}</span>
            </div>

            {/* CSS Styles (Injected locally for a standalone component) */}
            <style jsx global>{`
                /* General Variables */
                :root {
                    --color-primary: #5c6bc0; /* Dark Blue */
                    --color-primary-dark: #4a5aa8;
                    --color-secondary: #f39c12; /* Orange for WIP */
                    --color-unpaid: #cc0033; /* Red for Unpaid/Pending */
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
                    align-items: center;
                    padding: 15px 20px;
                    background-color: #e8eaf6; 
                    border-bottom: 1px solid var(--color-border);
                }

                .report-header h2 {
                    font-size: 1.4rem;
                    color: var(--color-text-primary);
                    flex-grow: 1; 
                }

                /* Back Button Style */
                .report-header .back-button {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    color: #5c6bc0;
                    cursor: pointer;
                    margin-right: 15px;
                    display: flex;
                    align-items: center;
                    padding: 0;
                    height: 100%;
                }
                .report-header .back-button:hover {
                    color: #4a5aa8;
                }


                .header-actions button {
                    margin-left: 10px;
                    padding: 8px 15px;
                    border-radius: 4px;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    font-weight: 500;
                    border: 1px solid var(--color-primary);
                }
                
                .btn-primary-action {
                    background-color: transparent;
                    color: var(--color-primary);
                    border: 1px solid var(--color-primary);
                }
                .btn-primary-action:hover {
                    background-color: #f0f0f5;
                }
                
                .btn-secondary-action {
                    background-color: var(--color-primary);
                    color: white;
                    border: 1px solid var(--color-primary);
                }
                .btn-secondary-action:hover {
                    background-color: var(--color-primary-dark);
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

                /* Date Input Wrapper (for FaCalendarAlt) */
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
                    -webkit-appearance: none; 
                    appearance: none; 
                    padding-right: 35px;
                }
                .date-input-wrapper input[type="date"]::-webkit-calendar-picker-indicator {
                    opacity: 0; 
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    top: 0;
                    left: 0;
                    cursor: pointer;
                }
                .date-input-wrapper .calendar-icon {
                    position: absolute;
                    right: 8px; 
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
                    background-color: var(--color-primary-dark);
                }
                
                .btn-filter:disabled,
                .header-actions button:disabled,
                .date-input-wrapper input:disabled {
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

                /* Table Styling */
                .table-wrapper {
                    overflow-x: auto;
                    max-width: 100%;
                    background-color: white;
                    border: 1px solid var(--color-border);
                    border-radius: 4px;
                }

                .data-table {
                    width: 100%;
                    min-width: 1000px; 
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
                    background-color: white; 
                    color: var(--color-text-muted);
                    font-weight: 600;
                    text-transform: none;
                    font-size: 0.85rem;
                    cursor: pointer;
                    border-bottom: 1px solid #ddd;
                }
                
                .data-table tbody tr:hover {
                    background-color: #f9f9f9;
                }

                /* Footer Styling (Matches others) */
                .report-specific-footer {
                    display: flex;
                    justify-content: flex-end;
                    gap: 20px;
                    padding: 10px 20px;
                    margin-top: 10px;
                    background-color: white; 
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: var(--color-text-primary);
                }
                .report-specific-footer .total-payouts-sum {
                    font-weight: 700;
                    color: var(--color-primary);
                }
            `}</style>
        </div>
    );
};

export default VendorsReport;