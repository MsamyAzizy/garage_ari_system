// src/components/ClientsReport.js

import React, { useState, useEffect, useCallback } from 'react';
import { FaFilter, FaDownload, FaList, FaUsers, FaSortDown, FaAngleLeft } from 'react-icons/fa';

// --- LOADER COMPONENT (Integrated locally) ---
const LOADER_COLOR = '#3a3a37ff'; // Matches your primary color
const LoaderSpinner = () => (
    <div className="loader-container">
        <div className="bar-spinner-container">
            <div className="bar bar-1"></div>
            <div className="bar bar-2"></div>
            <div className="bar bar-3"></div>
            <div className="bar bar-4"></div>
            <div className="bar bar-5"></div>
        </div>
        <p className="loading-text-spinner">Loading Client Data...</p>
    </div>
);


// --- MOCK DATA ---
const mockClientData = [
    { date: '2024-01-10', name: 'James T. Kirk', company: 'Starfleet', address: '1 Enterprise Ave', city: 'San Fran', state: 'CA', zip: '94129', phone: '555-1212', email: 'kirk@starfleet.com', notes: 'Active, high-value client.', labels: 'VIP, Service', taxExempt: 'No' },
    { date: '2024-03-15', name: 'Spock', company: 'Vulcan Corp', address: '2 Logic Ln', city: 'Palo Alto', state: 'CA', zip: '94301', phone: '555-0000', email: 'spock@vulcan.com', notes: 'Only takes logic seriously.', labels: 'Standard', taxExempt: 'Yes' },
    { date: '2024-05-20', name: 'Leonard McCoy', company: 'Dr. Bones', address: '3 Med Bay St', city: 'Atlanta', state: 'GA', zip: '30303', phone: '555-3333', email: 'mccoy@bones.com', notes: 'Hates modern technology.', labels: 'New', taxExempt: 'No' },
    { date: '2024-06-01', name: 'Nyota Uhura', company: 'Comm Systems', address: '4 Antenna Rd', city: 'New York', state: 'NY', zip: '10001', phone: '555-7777', email: 'uhura@comm.com', notes: 'Excellent communicator.', labels: 'VIP', taxExempt: 'No' },
    { date: '2024-08-12', name: 'Montgomery Scott', company: 'Engineering Dept', address: '5 Engine Bay', city: 'Glasgow', state: 'GA', zip: '30303', phone: '555-8888', email: 'scott@eng.com', notes: 'Loves a challenge.', labels: 'Standard', taxExempt: 'No' },
];


// --- CLIENTS REPORT COMPONENT ---

const ClientsReport = ({ 
    onExport = () => console.log('Exporting...'), 
    onViewList = () => console.log('Viewing List...'),
    navigateTo = (path) => console.log(`Navigating to ${path}`) 
}) => {
    const [clients, setClients] = useState(mockClientData);
    const [dateRange, setDateRange] = useState({ 
        from: '2024-01-01', 
        to: new Date().toISOString().split('T')[0] 
    });
    const [isLoading, setIsLoading] = useState(false);

    // Simulated Fetch/Filter function
    const handleFilter = useCallback(async () => {
        setIsLoading(true);
        console.log(`Filtering clients between ${dateRange.from} and ${dateRange.to}`);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500)); // Increased delay for visual effect
        
        // Simple filter based on join date
        const filteredClients = mockClientData.filter(client => 
            client.date >= dateRange.from && client.date <= dateRange.to
        );

        setClients(filteredClients);
        setIsLoading(false);
    }, [dateRange]);

    useEffect(() => {
        // Initial load on mount
        handleFilter();
    }, [handleFilter]);
    
    // --- Render Logic ---
    
    // 🛑 Conditional Rendering based on isLoading state
    // We now skip the text-only return and manage the loader inside the main return block

    return (
        <div className="report-page-container">
            
            {/* Header (Mimics style of other reports) */}
            <header className="page-header report-header">
                {/* 👈 ADDED BACK BUTTON */}
                <button className="back-button" onClick={() => navigateTo('/reports')}>
                    <FaAngleLeft />
                </button>
                <h2><FaUsers style={{ marginRight: '8px' }} /> Clients Report</h2>
                <div className="header-actions">
                    <button className="btn-primary-action" onClick={onExport} title="Export Data">
                        <FaDownload /> Export
                    </button>
                    <button className="btn-secondary-action" onClick={() => navigateTo('/reports')} title="View All Reports">
                        <FaList /> View List
                    </button>
                </div>
            </header>

            {/* Filter Bar */}
            <div className="filter-bar">
                <span className="filter-label">From:</span>
                <div className="date-input-wrapper">
                    <input type="date" value={dateRange.from} onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))} />
                    <span className="calendar-icon">&#128197;</span>
                </div>
                
                <span className="filter-label" style={{ marginLeft: '10px' }}>To:</span>
                <div className="date-input-wrapper">
                    <input type="date" value={dateRange.to} onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))} />
                    <span className="calendar-icon">&#128197;</span>
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
                    {/* 🛑 Conditional rendering of Loader or Content */}
                    {isLoading ? (
                        <LoaderSpinner />
                    ) : (
                        <>
                            <p className="report-note">
                                NOTE: This report lists all clients and their associated contact and tax information, based on their creation date within the selected period.
                            </p>
                            {clients.length === 0 ? (
                                <div className="no-data-message">No client records found.</div>
                            ) : (
                                <div className="table-wrapper">
                                    <table className="data-table clients-table">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Name <FaSortDown /></th>
                                                <th>Company</th>
                                                <th>Address</th>
                                                <th>City</th>
                                                <th>State</th>
                                                <th>ZIP</th>
                                                <th>Phone</th>
                                                <th>Email</th>
                                                <th>Notes</th>
                                                <th>Labels</th>
                                                <th>Tax Exempt</th>
                                                <th className="action-column-header">...</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {clients.map((client, index) => (
                                                <tr key={index}>
                                                    <td>{client.date}</td>
                                                    <td>{client.name}</td>
                                                    <td>{client.company}</td>
                                                    <td>{client.address}</td>
                                                    <td>{client.city}</td>
                                                    <td>{client.state}</td>
                                                    <td>{client.zip}</td>
                                                    <td>{client.phone}</td>
                                                    <td>{client.email}</td>
                                                    <td>{client.notes}</td>
                                                    <td>{client.labels}</td>
                                                    <td>{client.taxExempt}</td>
                                                    <td className="action-column-cell">...</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            <div className="report-specific-footer">
                                <span>Total Clients: {clients.length}</span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* CSS Styles (Injected locally for a standalone component) */}
            <style jsx global>{`
                /* General Variables */
                :root {
                    --color-primary: #5c6bc0; /* Dark Blue */
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
                    align-items: center; /* Ensures button and text align */
                    padding: 15px 20px;
                    background-color: #e8eaf6; 
                    border-bottom: 1px solid var(--color-border);
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

                .report-header h2 {
                    font-size: 1.4rem;
                    color: var(--color-text-primary);
                    flex-grow: 1; /* Allows the title to take available space */
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
                    background-color: #4a5aa8;
                }

                /* Filter Bar (Matches Tax Report style) */
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
                    min-width: 1400px; /* Ensures all columns fit based on screenshot */
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
                    background-color: white; /* White background for header row as shown in screenshot */
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

                /* Footer Styling (Mimics others) */
                .report-specific-footer {
                    display: flex;
                    justify-content: flex-end;
                    gap: 20px;
                    padding: 10px 20px;
                    margin-top: 10px;
                    background-color: white; 
                    border: 1px solid #ddd;
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: var(--color-text-primary);
                }
                
                .no-data-message {
                    padding: 50px;
                    text-align: center;
                    font-size: 1.1rem;
                    color: var(--color-text-muted);
                    background-color: white;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    margin-top: 15px;
                }
            `}</style>
        </div>
    );
};

export default ClientsReport;