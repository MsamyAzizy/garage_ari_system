// src/components/InventoryAndProfitReport.js

import React, { useState, useEffect, useCallback } from 'react';
import { FaArrowLeft, FaFileExport, FaListUl, FaFilter, FaInfoCircle } from 'react-icons/fa';

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

// Mock data for Inventory tab
const mockInventoryData = [
    { 
        id: 1, desc: 'Oil Filter (Wix)', stock: 50, unit: 'pcs', cost: 5.00, 
        price: 10.00, status: 'In Stock', stockValue: 250.00, category: 'Filters' 
    },
    { 
        id: 2, desc: 'Brake Pads (Front)', stock: 15, unit: 'sets', cost: 50.00, 
        price: 85.00, status: 'Low Stock', stockValue: 750.00, category: 'Brakes' 
    },
    { 
        id: 3, desc: 'Synthetic Oil 5W-30', stock: 100, unit: 'qt', cost: 7.00, 
        price: 15.00, status: 'In Stock', stockValue: 700.00, category: 'Fluids' 
    },
];

// Mock data for Parts Profit tab
const mockPartsProfitData = [
    { 
        id: 1, invDate: '2025-11-10', invNo: 'INV-003', status: 'Paid', vendor: 'AutoSupply',
        partId: 'P-1001', description: 'Oil Filter (Wix)', qty: 1, 
        cost: 5.00, price: 10.00, amount: 10.00, profit: 5.00, taxable: 'Yes', paidDate: '2025-11-10'
    },
    { 
        id: 2, invDate: '2025-11-15', invNo: 'INV-005', status: 'Due', vendor: 'BrakeCorp',
        partId: 'P-1005', description: 'Brake Pads (Front)', qty: 1, 
        cost: 50.00, price: 85.00, amount: 85.00, profit: 35.00, taxable: 'Yes', paidDate: '-'
    },
    { 
        id: 3, invDate: '2025-11-15', invNo: 'INV-005', status: 'Due', vendor: 'WiperWorld',
        partId: 'P-1002', description: 'Wiper Blades', qty: 2, 
        cost: 16.00, price: 30.00, amount: 60.00, profit: 28.00, taxable: 'Yes', paidDate: '-'
    },
];

// Mock data for Labor Profit tab
const mockLaborProfitData = [
    {
        id: 1, invNo: 'INV-003', invDate: '2025-11-10', status: 'Paid', 
        serviceCode: 'S-001', serviceName: 'Oil Change', hrs: 1.0, rate: 80.00, 
        amount: 80.00, profit: 40.00, taxable: 'Yes', paidDate: '2025-11-10'
    },
    {
        id: 2, invNo: 'INV-005', invDate: '2025-11-15', status: 'Due', 
        serviceCode: 'S-005', serviceName: 'Brake Replacement', hrs: 2.5, rate: 100.00, 
        amount: 250.00, profit: 125.00, taxable: 'Yes', paidDate: '-'
    },
    {
        id: 3, invNo: 'INV-005', invDate: '2025-11-15', status: 'Due', 
        serviceCode: 'S-010', serviceName: 'Diagnostic', hrs: 0.5, rate: 120.00, 
        amount: 60.00, profit: 30.00, taxable: 'Yes', paidDate: '-'
    },
];

// Mock data for Net Profit tab (NEW)
const mockNetProfitData = [
    {
        id: 1, createdAt: '2025-11-10 09:00', invNo: 'INV-003', status: 'Paid',
        partsProfit: 5.00, laborProfit: 40.00, discount: 0.00, netProfit: 45.00,
        client: 'J. Smith', vehicle: 'Toyota Camry', jobCardStatus: 'Completed',
        completedAt: '2025-11-10 12:00', paidDate: '2025-11-10'
    },
    {
        id: 2, createdAt: '2025-11-15 11:30', invNo: 'INV-005', status: 'Due',
        partsProfit: 63.00, laborProfit: 155.00, discount: 10.00, netProfit: 208.00,
        client: 'A. Davis', vehicle: 'Honda CRV', jobCardStatus: 'Completed',
        completedAt: '2025-11-15 16:30', paidDate: '-'
    },
];


const InventoryAndProfitReport = ({ navigateTo }) => {
    // 🛑 NEW STATE: Data loading state
    const [isLoading, setIsLoading] = useState(true); 
    const [activeTab, setActiveTab] = useState('Net Profit');
    const [fromDate, setFromDate] = useState('2025-11-01');
    const [toDate, setToDate] = useState('2025-11-23');
    const [isPaidDateChecked, setIsPaidDateChecked] = useState(false);


    // --- Data Fetching Logic (simulated) ---
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        console.log(`Fetching report for ${activeTab} from ${fromDate} to ${toDate} (by Paid Date: ${activeTab === 'Inventory' ? 'N/A' : isPaidDateChecked})`);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, activeTab === 'Inventory' ? 500 : 1500)); 
        
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
    const totalStock = mockInventoryData.reduce((sum, item) => sum + item.stock, 0);
    const totalCost = mockInventoryData.reduce((sum, item) => sum + (item.cost * item.stock), 0);
    const totalStockValue = mockInventoryData.reduce((sum, item) => sum + item.stockValue, 0);
    
    // Parts Profit Calculations
    const totalQtySold = mockPartsProfitData.reduce((sum, item) => sum + item.qty, 0);
    const totalAmountParts = mockPartsProfitData.reduce((sum, item) => sum + item.amount, 0);
    const totalCostParts = mockPartsProfitData.reduce((sum, item) => sum + (item.cost * item.qty), 0);
    const totalProfitParts = mockPartsProfitData.reduce((sum, item) => sum + item.profit, 0);
    
    // Labor Profit Calculations
    const totalHours = mockLaborProfitData.reduce((sum, item) => sum + item.hrs, 0);
    const totalAmountLabor = mockLaborProfitData.reduce((sum, item) => sum + item.amount, 0);
    const totalProfitLabor = mockLaborProfitData.reduce((sum, item) => sum + item.profit, 0);
    
    // Net Profit Calculations (NEW)
    const totalPartsProfit = mockNetProfitData.reduce((sum, item) => sum + item.partsProfit, 0);
    const totalLaborProfit = mockNetProfitData.reduce((sum, item) => sum + item.laborProfit, 0);
    const totalDiscount = mockNetProfitData.reduce((sum, item) => sum + item.discount, 0);
    const totalNetProfit = mockNetProfitData.reduce((sum, item) => sum + item.netProfit, 0);
    

    const renderTableData = () => {
        if (isLoading) {
             return <LoaderSpinner text={`Loading ${activeTab}...`} />;
        }
        
        if (activeTab === 'Inventory') {
            const headers = [
                'Id.', 'Descr', 'Stock', 'Unit', 'Cost', 
                'Price', 'Status', 'Stock Value', 'Category', '...'
            ];
            return (
                <div className="table-wrapper" style={{ padding: '20px 0' }}>
                    <p className="section-title">
                        **NOTE:** The report shows all parts in your inventory!
                    </p>
                    <table className="data-table report-table">
                        <thead>
                            <tr>
                                {headers.map((header, index) => (
                                    <th key={index} className={['Stock Value', 'Cost', 'Price'].includes(header) ? 'financial-column' : ''}>
                                        {header} {header === 'Descr' && <span style={{fontSize: '10px'}}>↑</span>}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {mockInventoryData.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.desc}</td>
                                    <td className="financial-column">{item.stock}</td>
                                    <td>{item.unit}</td>
                                    <td className="financial-column">$ {item.cost.toFixed(2)}</td>
                                    <td className="financial-column">$ {item.price.toFixed(2)}</td>
                                    <td><span className={`status-tag status-${item.status.replace(/\s/g, '').toLowerCase()}`}>{item.status}</span></td>
                                    <td className="financial-column bold">$ {item.stockValue.toFixed(2)}</td>
                                    <td>{item.category}</td>
                                    <td style={{ width: '40px' }}><button className="action-menu-btn">...</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        } else if (activeTab === 'Parts profit') {
            const headers = [
                'Invoice No.', 'Invoice Date', 'Invoice Status', 'Part id.', 'Description', 
                'Qty', 'Cost', 'Price', 'Amount', 'Profit', 'Taxable', 'Vendor', 'Paid Date', '...'
            ];
             return (
                <div className="table-wrapper" style={{ padding: '20px 0' }}>
                    <table className="data-table report-table">
                        <thead>
                            <tr>
                                {headers.map((header, index) => (
                                    <th key={index} className={['Qty', 'Cost', 'Price', 'Amount', 'Profit'].includes(header) ? 'financial-column' : ''}>
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {mockPartsProfitData.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.invNo}</td>
                                    <td>{item.invDate}</td>
                                    <td>{item.status}</td>
                                    <td>{item.partId}</td>
                                    <td>{item.description}</td>
                                    <td className="financial-column">{item.qty}</td>
                                    <td className="financial-column">$ {item.cost.toFixed(2)}</td>
                                    <td className="financial-column">$ {item.price.toFixed(2)}</td>
                                    <td className="financial-column">$ {item.amount.toFixed(2)}</td>
                                    <td className="financial-column bold paid">$ {item.profit.toFixed(2)}</td>
                                    <td>{item.taxable}</td>
                                    <td>{item.vendor}</td>
                                    <td>{item.paidDate}</td>
                                    <td style={{ width: '40px' }}><button className="action-menu-btn">...</button></td>
                                </tr>
                            ))}
                        </tbody>
                         <tfoot className="summary-row">
                            <tr>
                                <td>**Total:**</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td className="financial-column total-cell">{totalQtySold}</td>
                                <td className="financial-column total-cell"></td>
                                <td className="financial-column total-cell"></td>
                                <td className="financial-column total-cell">$ {totalAmountParts.toFixed(2)}</td>
                                <td className="financial-column total-cell paid">$ {totalProfitParts.toFixed(2)}</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            );
        } else if (activeTab === 'Labor profit') {
            const headers = [
                'Invoice No.', 'Invoice Date', 'Invoice Status', 'Service Code', 'Service Name', 
                'Hrs', 'rate', 'Amount', 'Profit', 'Taxable', 'Paid Date', '...'
            ];
            return (
                <div className="table-wrapper" style={{ padding: '20px 0' }}>
                    <table className="data-table report-table">
                        <thead>
                            <tr>
                                {headers.map((header, index) => (
                                    <th key={index} className={['Hrs', 'rate', 'Amount', 'Profit'].includes(header) ? 'financial-column' : ''}>
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {mockLaborProfitData.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.invNo}</td>
                                    <td>{item.invDate}</td>
                                    <td>{item.status}</td>
                                    <td>{item.serviceCode}</td>
                                    <td>{item.serviceName}</td>
                                    <td className="financial-column">{item.hrs.toFixed(2)}</td>
                                    <td className="financial-column">$ {item.rate.toFixed(2)}</td>
                                    <td className="financial-column">$ {item.amount.toFixed(2)}</td>
                                    <td className="financial-column bold paid">$ {item.profit.toFixed(2)}</td>
                                    <td>{item.taxable}</td>
                                    <td>{item.paidDate}</td>
                                    <td style={{ width: '40px' }}><button className="action-menu-btn">...</button></td>
                                </tr>
                            ))}
                        </tbody>
                         <tfoot className="summary-row">
                            <tr>
                                <td>**Total:**</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td className="financial-column total-cell">{totalHours.toFixed(2)}</td>
                                <td className="financial-column total-cell"></td>
                                <td className="financial-column total-cell">$ {totalAmountLabor.toFixed(2)}</td>
                                <td className="financial-column total-cell paid">$ {totalProfitLabor.toFixed(2)}</td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            );
        } else if (activeTab === 'Net Profit') {
             // Net Profit Implementation (NEW)
            const headers = [
                'Created At', 'Invoice No.', 'Invoice Status', 'Parts Profit', 
                'Labor Profit', 'Discount', 'Net Profit', 'Client', 'Vehicle', 
                'jobCardStatus', 'Completed At', 'Paid Date', '...'
            ];
            return (
                <div className="table-wrapper" style={{ padding: '20px 0' }}>
                    <table className="data-table report-table">
                        <thead>
                            <tr>
                                {headers.map((header, index) => (
                                    <th key={index} className={['Parts Profit', 'Labor Profit', 'Discount', 'Net Profit'].includes(header) ? 'financial-column' : ''}>
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {mockNetProfitData.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.createdAt}</td>
                                    <td>{item.invNo}</td>
                                    <td>{item.status}</td>
                                    <td className="financial-column paid">$ {item.partsProfit.toFixed(2)}</td>
                                    <td className="financial-column paid">$ {item.laborProfit.toFixed(2)}</td>
                                    <td className="financial-column">$ {item.discount.toFixed(2)}</td>
                                    <td className="financial-column bold paid">$ {item.netProfit.toFixed(2)}</td>
                                    <td>{item.client}</td>
                                    <td>{item.vehicle}</td>
                                    <td>{item.jobCardStatus}</td>
                                    <td>{item.completedAt}</td>
                                    <td>{item.paidDate}</td>
                                    <td style={{ width: '40px' }}><button className="action-menu-btn">...</button></td>
                                </tr>
                            ))}
                        </tbody>
                         <tfoot className="summary-row">
                            <tr>
                                <td>**Total:**</td>
                                <td></td>
                                <td></td>
                                <td className="financial-column total-cell paid">$ {totalPartsProfit.toFixed(2)}</td>
                                <td className="financial-column total-cell paid">$ {totalLaborProfit.toFixed(2)}</td>
                                <td className="financial-column total-cell">$ {totalDiscount.toFixed(2)}</td>
                                <td className="financial-column total-cell paid">$ {totalNetProfit.toFixed(2)}</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            );
        }
        return null;
    };


    const renderSummaryBar = () => {
        if (activeTab === 'Inventory') {
            // Totals are instantly calculated from mock data, no loader needed here
            return (
                <>
                    <div className="summary-item">
                        In Stock: <span className="value">{totalStock.toFixed(2)}</span>
                    </div>
                    <div className="summary-item">
                        Total Cost: <span className="value bold">${totalCost.toFixed(2)}</span>
                    </div>
                    <div className="summary-item">
                        Stock Value: <span className="value bold">${totalStockValue.toFixed(2)}</span>
                        <FaInfoCircle style={{ marginLeft: '5px', color: 'var(--text-color-muted)' }} />
                    </div>
                </>
            );
        } else if (isLoading) {
             return <p style={{ color: 'var(--text-color-muted)' }}>Fetching Totals...</p>;
        } else if (activeTab === 'Parts profit') {
             return (
                <>
                    <div className="summary-item">
                        Total Cost: <span className="value bold">${totalCostParts.toFixed(2)}</span>
                    </div>
                    <div className="summary-item">
                        Total Amount: <span className="value bold">${totalAmountParts.toFixed(2)}</span>
                    </div>
                    <div className="summary-item">
                        **Net Profit:** <span className="value bold paid">${totalProfitParts.toFixed(2)}</span>
                    </div>
                </>
            );
        } else if (activeTab === 'Labor profit') {
             return (
                <>
                    <div className="summary-item">
                        Total Hours: <span className="value bold">{totalHours.toFixed(2)}</span>
                    </div>
                    <div className="summary-item">
                        Total Amount: <span className="value bold">${totalAmountLabor.toFixed(2)}</span>
                    </div>
                    <div className="summary-item">
                        **Net Profit:** <span className="value bold paid">${totalProfitLabor.toFixed(2)}</span>
                    </div>
                </>
            );
        } else if (activeTab === 'Net Profit') {
             // Net Profit Summary Bar (NEW)
             return (
                <>
                    <div className="summary-item">
                        Parts Profit: <span className="value bold paid">${totalPartsProfit.toFixed(2)}</span>
                    </div>
                    <div className="summary-item">
                        Labor Profit: <span className="value bold paid">${totalLaborProfit.toFixed(2)}</span>
                    </div>
                    <div className="summary-item">
                        **Net Profit:** <span className="value bold paid">${totalNetProfit.toFixed(2)}</span>
                    </div>
                </>
            );
        }
        return null;
    };


    // Determine the Note text based on the active tab
    const getNoteText = () => {
        switch (activeTab) {
            case 'Inventory':
                return 'The report shows all **parts** in your inventory!';
            case 'Parts profit':
                return 'This report shows the profit made for each part sold within the selected timeframe! Profit is calculated as (price-cost)*qty. The report does NOT include parts from Voided, Written Off, or Refunded invoices nor Declined items. Estimates are NOT included in this report.';
            case 'Labor profit':
                return 'This report shows the profit made for each Labor performed within the selected timeframe! The profit is calculated as (rate-profit_share/hours, where profit_share is the value setup in your Profile/Labor Markup. The report does NOT include labor from Voided, Written Off, or Refunded invoices nor Declined items nor Estimates.';
            case 'Net Profit':
                // Note updated to match screenshot
                return 'Net Profit is calculated as (Parts Profit + Labor Profit) - Discount This report does NOT include Voided, Written Off, or Refunded invoices';
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


                /* General Styles */
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
                .report-filters input[type="date"] {
                    padding: 8px;
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
                .tab-group-container {
                    display: flex;
                    border-radius: 6px;
                    overflow: hidden;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
                }
                .tab-button {
                    padding: 10px 20px;
                    border: none;
                    cursor: pointer;
                    font-weight: 500;
                    background-color: var(--bg-light);
                    color: var(--text-color-muted);
                    transition: all 0.2s;
                    border-radius: 0; 
                    border-left: 1px solid #ffffff33;
                }
                .tab-button:first-child {
                    border-radius: 6px 0 0 6px;
                    border-left: none;
                }
                .tab-button:last-child {
                    border-radius: 0 6px 6px 0;
                }
                .tab-button.active {
                    background-color: var(--color-primary);
                    color: white;
                    font-weight: bold;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                }

                /* Notes and Status Tags */
                .note-box {
                    padding: 5px 20px;
                    font-size: 13px;
                    margin: 0 20px 20px;
                    border-radius: 4px;
                    font-weight: 500;
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
                .status-tag.status-instock { background-color: #2ecc71; } /* Green */
                .status-tag.status-lowstock { background-color: #f39c12; } /* Orange */
                .status-tag.status-outofstock { background-color: #e74c3c; } /* Red */


                /* Table Styles */
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
                
                .section-title {
                    font-size: 16px;
                    font-weight: 600;
                    color: var(--text-color);
                    margin: 0 20px 10px;
                    display: none; /* Hide standard title, use the Note box for consistency */
                }
                .financial-column {
                    text-align: right;
                    font-weight: 500;
                }
                .financial-column.bold {
                    font-weight: 700;
                }
                .financial-column.paid { color: #2ecc71; } 
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
                .summary-item .paid {
                    color: #2ecc71;
                    font-weight: 700;
                }
            `}</style>

            {/* Header */}
            <header className="report-header">
                <h2>
                    <button onClick={() => navigateTo('/reports')} className="icon-action" style={{ marginRight: '15px' }}><FaArrowLeft /></button>
                    Inventory & Profit
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
                        className={`tab-button ${activeTab === 'Inventory' ? 'active' : ''}`}
                        onClick={() => handleTabChange('Inventory')}
                    >
                        Inventory
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'Parts profit' ? 'active' : ''}`}
                        onClick={() => handleTabChange('Parts profit')}
                    >
                        Parts profit
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'Labor profit' ? 'active' : ''}`}
                        onClick={() => handleTabChange('Labor profit')}
                    >
                        Labor profit
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'Net Profit' ? 'active' : ''}`}
                        onClick={() => handleTabChange('Net Profit')}
                    >
                        Net Profit
                    </button>
                </div>
            </div>

            {/* Filters (Only show date filters for profit reports, not for Inventory) */}
            {activeTab !== 'Inventory' && (
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
                    {/* Add Paid Date Checkbox based on screenshot */}
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
            )}
            
            {/* Note */}
            <div className="note-box">
                **NOTE:** {getNoteText()}
            </div>

            {/* Table Content */}
            <div className="list-content-area" style={{ padding: '0 20px 20px', overflowX: 'auto', marginBottom: '60px' }}>
                {renderTableData()}
            </div>

            {/* Fixed Bottom Summary Bar */}
            <div className="bottom-summary-bar">
                {renderSummaryBar()}
            </div>
        </div>
    );
};

export default InventoryAndProfitReport;