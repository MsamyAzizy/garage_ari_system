import React, { useState, useEffect, useCallback } from 'react';
// 🛑 IMPORT FaCalendarAlt
import { FaArrowLeft, FaFileExport, FaListUl, FaFilter, FaMoneyBillWave, FaClock, FaCalendarAlt } from 'react-icons/fa';

// --- LOADER COMPONENT (Copied from previous file) ---
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

// Mock data for Work assigned tab (kept as provided by user)
const mockWorkAssignedData = [
    {
        id: 1, date: '2025-11-10', employee: 'J. Smith', type: 'Part', 
        serviceName: 'Oil Filter (Wix)', description: 'P-1001', 
        hrs: 'N/A', qty: 1, amount: 5.00, reference: 'INV-003'
    },
    {
        id: 2, date: '2025-11-10', employee: 'J. Smith', type: 'Service', 
        serviceName: 'Oil Change', description: 'S-001', 
        hrs: 1.0, qty: 'N/A', amount: 40.00, reference: 'INV-003'
    },
    {
        id: 3, date: '2025-11-15', employee: 'A. Davis', type: 'Service', 
        serviceName: 'Brake Replacement', description: 'S-005', 
        hrs: 2.5, qty: 'N/A', amount: 125.00, reference: 'INV-005'
    },
    {
        id: 4, date: '2025-11-15', employee: 'A. Davis', type: 'Part', 
        serviceName: 'Brake Pads (Front)', description: 'P-1005', 
        hrs: 'N/A', qty: 1, amount: 35.00, reference: 'INV-005'
    },
];

// Mock data for Time Tracked tab
const mockTimeTrackedData = [
    { id: 101, employeeName: 'Technician 1', activity: 'Engine Repair (JC-1001)', clockIn: '2025-12-10 08:00', clockOut: '2025-12-10 16:30', duration: 8.5, note: 'Job started quickly.' },
    { id: 102, employeeName: 'Technician 1', activity: 'Brake Service (JC-1002)', clockIn: '2025-12-11 09:00', clockOut: '2025-12-11 16:30', duration: 7.5, note: 'Standard service duration.' },
    { id: 103, employeeName: 'Service Advisor', activity: 'Customer Check-in (JC-1001)', clockIn: '2025-12-10 09:30', clockOut: '2025-12-10 13:30', duration: 4.0, note: 'Morning consultations.' },
    { id: 104, employeeName: 'Warehouse Manager', activity: 'Inventory Audit', clockIn: '2025-12-10 10:00', clockOut: '2025-12-10 16:00', duration: 6.0, note: 'Monthly stock check.' },
];

// Mock data for Salaries Paid tab, UPDATED to match screenshot columns (Date, Type, Employee Name, Amount, Tax, Paid, Due)
const mockSalariesPaidData = [
    { id: 201, date: '2025-11-01', type: 'Monthly Salary', employeeName: 'Technician 1', amount: 450000, tax: 20000, paid: 450000, due: 0, currency: 'TZS' },
    { id: 202, date: '2025-11-01', type: 'Monthly Salary', employeeName: 'Service Advisor', amount: 500000, tax: 25000, paid: 400000, due: 100000, currency: 'TZS' },
    { id: 203, date: '2025-11-15', type: 'Bonus', employeeName: 'Warehouse Manager', amount: 50000, tax: 0, paid: 50000, due: 0, currency: 'TZS' },
];


const EmployeesAndSalariesReport = ({ navigateTo }) => {
    // --- STATE & CONSTANTS ---
    const [isLoading, setIsLoading] = useState(true); // 🛑 NEW LOADING STATE
    const [activeTab, setActiveTab] = useState('Salaries paid'); 
    const [fromDate, setFromDate] = useState('2025-11-01');
    const [toDate, setToDate] = useState('2025-11-23');

    // --- Data Fetching Logic (simulated) ---
    const fetchData = useCallback(async (tabOverride) => {
        setIsLoading(true);
        const tabToFetch = tabOverride || activeTab;
        console.log(`Fetching report for ${tabToFetch} from ${fromDate} to ${toDate}`);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1200)); 
        
        setIsLoading(false);
    }, [fromDate, toDate, activeTab]); 

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
        // We call fetchData immediately and pass the new tab state to prevent race conditions
        fetchData(tab); 
    };


    // --- WORK ASSIGNED Calculations ---
    const totalAmount = mockWorkAssignedData.reduce((sum, item) => sum + item.amount, 0);
    const totalHours = mockWorkAssignedData.filter(item => typeof item.hrs === 'number').reduce((sum, item) => sum + item.hrs, 0);
    
    // --- TIME TRACKED Calculations ---
    const totalTimeTrackedHours = mockTimeTrackedData.reduce((sum, item) => sum + item.duration, 0);

    // --- SALARIES PAID Calculations ---
    const totalSalariesAmount = mockSalariesPaidData.reduce((sum, item) => sum + item.amount, 0);
    const totalSalariesPaid = mockSalariesPaidData.reduce((sum, item) => sum + item.paid, 0);
    const totalSalariesDue = mockSalariesPaidData.reduce((sum, item) => sum + item.due, 0);
    
    const formatCurrency = (amount, currency = 'TZS') => {
        // TZS is used as the base currency based on previous context, but will format as $ for simplicity unless TZS is required
        if (currency === 'TZS') {
            // Use correct formatting for large numbers
            return `${amount.toLocaleString('en-US')} TZS`;
        }
        return `$ ${amount.toFixed(2)}`;
    };
    
    // Helper to format hours into HH:MM (e.g., 8.5 -> 08:30)
    const formatDuration = (hours) => {
        const h = Math.floor(hours);
        const m = Math.round((hours - h) * 60);
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} hours`;
    };

    // --- RENDER FUNCTIONS ---

    const renderTableData = () => {
        // 🛑 LOADER CHECK
        if (isLoading) {
             return <LoaderSpinner text={`Loading ${activeTab}...`} />;
        }

        // --- Work Assigned Tab ---
        if (activeTab === 'Work assigned') {
            const headers = [
                'Date', 'Employee Name', 'Type', 'Service Name', 'Description', 
                'Hrs', 'Qty', 'Amount', 'Reference', '...'
            ];
            return (
                <div className="table-wrapper" style={{ padding: '20px 0' }}>
                    <table className="data-table report-table">
                        <thead>
                            <tr>
                                {headers.map((header, index) => (
                                    <th key={index} className={['Hrs', 'Qty', 'Amount'].includes(header) ? 'financial-column' : ''}>
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {mockWorkAssignedData.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.date}</td>
                                    <td>{item.employee}</td>
                                    <td>{item.type}</td>
                                    <td>{item.serviceName}</td>
                                    <td>{item.description}</td>
                                    <td className="financial-column">{typeof item.hrs === 'number' ? item.hrs.toFixed(2) : item.hrs}</td>
                                    <td className="financial-column">{item.qty}</td>
                                    <td className="financial-column bold">$ {item.amount.toFixed(2)}</td>
                                    <td>{item.reference}</td>
                                    <td style={{ width: '40px' }}><button className="action-menu-btn">...</button></td>
                                </tr>
                            ))}
                        </tbody>
                         <tfoot className="summary-row">
                            <tr>
                                <td colSpan="5">**Total:**</td>
                                <td className="financial-column total-cell">{totalHours.toFixed(2)}</td>
                                <td className="financial-column total-cell"></td>
                                <td className="financial-column total-cell">$ {totalAmount.toFixed(2)}</td>
                                <td colSpan="2"></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            );
        } 
        
        // --- Time Tracked Tab ---
        else if (activeTab === 'Time Tracked') {
             const headers = [
                'Employee Name', 'Activity', 'Clock In', 'Clock Out', 'Duration', 'Note'
            ];
            return (
                <div className="table-wrapper" style={{ padding: '20px 0' }}>
                    <table className="data-table report-table">
                        <thead>
                            <tr>
                                {headers.map((header, index) => (
                                    <th key={index} className={['Duration'].includes(header) ? 'financial-column' : ''}>
                                        {header}
                                    </th>
                                ))}
                                <th style={{ width: '40px' }}>...</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockTimeTrackedData.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.employeeName}</td>
                                    <td>{item.activity}</td>
                                    <td>{item.clockIn.split(' ')[1]}</td>
                                    <td>{item.clockOut.split(' ')[1]}</td>
                                    <td className="financial-column bold">{formatDuration(item.duration)}</td>
                                    <td>{item.note}</td>
                                    <td style={{ width: '40px' }}><button className="action-menu-btn">...</button></td>
                                </tr>
                            ))}
                        </tbody>
                         <tfoot className="summary-row">
                            <tr>
                                <td colSpan="4">**Total Time Tracked:**</td>
                                <td className="financial-column total-cell">{formatDuration(totalTimeTrackedHours)}</td>
                                <td colSpan="2"></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            );
        } 
        
        // --- Salaries Paid Tab (UPDATED to match screenshot) ---
        else if (activeTab === 'Salaries paid') {
             const headers = [
                'Date', 'Type', 'Employee Name', 'Amount', 'Tax', 'Paid', 'Due'
            ];
            return (
                <div className="table-wrapper" style={{ padding: '20px 0' }}>
                    <table className="data-table report-table">
                         <thead>
                            <tr>
                                {headers.map((header, index) => (
                                    <th key={index} className={['Amount', 'Tax', 'Paid', 'Due'].includes(header) ? 'financial-column' : ''}>
                                        {header}
                                    </th>
                                ))}
                                <th style={{ width: '40px' }}>...</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockSalariesPaidData.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.date}</td>
                                    <td>{item.type}</td>
                                    <td>{item.employeeName}</td>
                                    <td className="financial-column">{formatCurrency(item.amount, item.currency)}</td>
                                    <td className="financial-column">{formatCurrency(item.tax, item.currency)}</td>
                                    <td className="financial-column bold">{formatCurrency(item.paid, item.currency)}</td>
                                    <td className="financial-column">{formatCurrency(item.due, item.currency)}</td>
                                    <td style={{ width: '40px' }}><button className="action-menu-btn">...</button></td>
                                </tr>
                            ))}
                        </tbody>
                         <tfoot className="summary-row">
                            <tr>
                                <td colSpan="3">**Total:**</td>
                                <td className="financial-column total-cell">{formatCurrency(totalSalariesAmount, 'TZS')}</td>
                                <td className="financial-column total-cell"></td>
                                <td className="financial-column total-cell">{formatCurrency(totalSalariesPaid, 'TZS')}</td>
                                <td className="financial-column total-cell">{formatCurrency(totalSalariesDue, 'TZS')}</td>
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
         if (isLoading) {
             return <p style={{ color: 'var(--text-color-muted)' }}>Fetching Totals...</p>;
        }
        // --- Work Assigned Summary ---
        if (activeTab === 'Work assigned') {
            return (
                <>
                    <div className="summary-item">
                        <FaClock style={{ color: 'var(--color-primary)' }}/> Hrs: <span className="value bold">{totalHours.toFixed(2)}</span>
                    </div>
                    <div className="summary-item">
                        <FaMoneyBillWave style={{ color: 'var(--color-primary)' }}/> Total: <span className="value bold">$ {totalAmount.toFixed(2)}</span>
                    </div>
                </>
            );
        }
        // --- Time Tracked Summary ---
        if (activeTab === 'Time Tracked') {
             return (
                <>
                    <div className="summary-item">
                        <FaClock style={{ color: 'var(--color-primary)' }}/> Total Time Tracked: <span className="value bold">{formatDuration(totalTimeTrackedHours)}</span>
                    </div>
                </>
            );
        }
        // --- Salaries Paid Summary (Updated) ---
        if (activeTab === 'Salaries paid') {
             return (
                <>
                    <div className="summary-item">
                        <FaMoneyBillWave style={{ color: 'var(--color-primary)' }}/> Paid: <span className="value bold">{formatCurrency(totalSalariesPaid, 'TZS')}</span>
                    </div>
                    <div className="summary-item">
                        <FaMoneyBillWave style={{ color: '#e74c3c' }}/> Due: <span className="value bold" style={{ color: '#e74c3c' }}>{formatCurrency(totalSalariesDue, 'TZS')}</span>
                    </div>
                </>
            );
        }
        return null;
    };


    const getNoteText = () => {
        switch (activeTab) {
            case 'Work assigned':
                return 'The report shows all **parts and labor assigned** to an employee within a selected timeframe.';
            case 'Time Tracked':
                return 'Report shows all **activity and time logs** within the selected dates.';
            case 'Salaries paid':
                return 'Report shows all **expenses type Salary** for the selected period and employee.';
            default:
                return '';
        }
    };

    return (
        <div className="report-page-container">
            <style jsx>{`
                /* 🛑 LOADER STYLES (Copied from Inventory Report) */
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
                .report-page-container {
                    /* Ensures content below fixed elements is visible */
                    padding-bottom: 60px; 
                }
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
                .btn-primary-action {
                    padding: 8px 15px;
                    border-radius: 4px;
                    font-weight: 600;
                    border: none;
                    cursor: pointer;
                    background-color: var(--color-primary);
                    color: white;
                }
                .btn-secondary-action {
                     padding: 8px 15px;
                    border-radius: 4px;
                    font-weight: 600;
                    cursor: pointer;
                    background-color: var(--bg-light);
                    border: 1px solid var(--border-color);
                    color: var(--text-color);
                }
                .report-filters {
                    padding: 20px;
                    background-color: var(--bg-light);
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    border-bottom: 1px solid var(--border-color);
                }
                /* 🛑 DATE INPUT STYLES (Copied from Inventory Report) */
                .date-input-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    position: relative; 
                }
                .date-input-group {
                    position: relative;
                    display: flex;
                    align-items: center;
                }
                .report-filters input[type="date"] {
                    padding: 8px 30px 8px 8px; /* Extra padding for the icon */
                    border: 1px solid var(--border-color);
                    border-radius: 4px;
                    font-size: 14px;
                    color: var(--text-color);
                    -webkit-appearance: none;
                    appearance: none;
                }
                .report-filters input[type="date"]::-webkit-calendar-picker-indicator {
                    opacity: 0; 
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    top: 0;
                    left: 0;
                    cursor: pointer;
                }
                .calendar-icon {
                    position: absolute;
                    right: 8px;
                    pointer-events: none; 
                    color: var(--text-color-muted);
                    font-size: 16px;
                }
                /* END DATE INPUT STYLES */
                
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

                /* Notes */
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

                /* Table Styles */
                .report-table {
                    width: 100%;
                    font-size: 13px;
                }
                .report-table th {
                    font-size: 12px;
                    font-weight: 600;
                    padding: 8px 10px;
                    text-align: left; /* Default alignment */
                }
                .report-table td {
                    padding: 5px 10px;
                    white-space: nowrap;
                    text-align: left; /* Default alignment */
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
                .summary-row td {
                    font-weight: 700;
                }
                .summary-row .total-cell {
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
                    color: var(--text-color-muted);
                }
                .summary-item .value {
                    color: var(--text-color);
                    font-weight: 700;
                }
                .select-employee-container {
                    display: flex;
                    align-items: center;
                    margin-left: auto;
                    gap: 10px;
                }
                .select-employee-container input[type="text"] {
                    padding: 8px;
                    border: 1px solid var(--border-color);
                    border-radius: 4px;
                    font-size: 14px;
                }
                .select-employee-container button.btn-primary {
                    background-color: var(--color-primary);
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 600;
                }
                .select-employee-container button.btn-danger {
                    background-color: #e74c3c;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 600;
                }
                
                /* Icon/Action Button */
                 .icon-action {
                    background: none;
                    border: none;
                    color: var(--text-color);
                    cursor: pointer;
                    font-size: 1.2em;
                }
            `}</style>

            {/* Header */}
            <header className="report-header">
                <h2>
                    <button onClick={() => navigateTo('/reports')} className="icon-action" style={{ marginRight: '15px' }}><FaArrowLeft /></button>
                    Employees & Salaries
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
                        className={`tab-button ${activeTab === 'Work assigned' ? 'active' : ''}`}
                        onClick={() => handleTabChange('Work assigned')}
                    >
                        Work assigned
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'Time Tracked' ? 'active' : ''}`}
                        onClick={() => handleTabChange('Time Tracked')}
                    >
                        Time Tracked
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'Salaries paid' ? 'active' : ''}`}
                        onClick={() => handleTabChange('Salaries paid')}
                    >
                        Salaries paid
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="report-filters">
                {/* 🛑 FROM DATE INPUT */}
                <div className="date-input-wrapper">
                    <label htmlFor="fromDate">From:</label>
                    <div className="date-input-group">
                        <input type="date" id="fromDate" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                        <FaCalendarAlt className="calendar-icon" />
                    </div>
                </div>
                {/* 🛑 TO DATE INPUT */}
                <div className="date-input-wrapper">
                    <label htmlFor="toDate">To:</label>
                    <div className="date-input-group">
                        <input type="date" id="toDate" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                        <FaCalendarAlt className="calendar-icon" />
                    </div>
                </div>

                <button 
                    className="btn-primary-action"
                    onClick={handleFilterClick}
                    disabled={isLoading} // 🛑 DISABLE FILTER WHEN LOADING
                >
                    <FaFilter style={{ marginRight: '5px' }} /> Filter
                </button>
                
                {/* Employee Select */}
                {(activeTab === 'Work assigned' || activeTab === 'Time Tracked' || activeTab === 'Salaries paid') && (
                    <div className="select-employee-container">
                        <input 
                            type="text" 
                            placeholder="Select employee" 
                        />
                        <button className="btn-primary" style={{ padding: '8px 15px' }}>Select</button>
                        <button className="btn-danger" style={{ padding: '8px 15px' }}>X</button>
                    </div>
                )}
            </div>
            
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

export default EmployeesAndSalariesReport;