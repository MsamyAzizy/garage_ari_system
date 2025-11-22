import React, { useState, useEffect, useCallback } from 'react';
import { FaFilter, FaDownload, FaList, FaCar, FaSortDown, FaAngleLeft, FaCalendarAlt } from 'react-icons/fa';

// --- LOADER COMPONENT (Reused from Tax Report) ---
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

// --- MOCK DATA ---
const mockVehicleData = [
    {
        date: '2023-01-15', type: 'Car', make: 'Toyota', model: 'Camry', year: 2020, transmission: 'Automatic',
        driveWheels: 'FWD', doors: 4, category: 'Sedan', engine: '2.5L I4', color: 'Silver',
        mileage: 45000, plate: 'XYZ-789', vin: 'JTEBC123456789012', unitNumber: 'V001', labels: 'Customer',
        notes: 'Regular maintenance, no issues.'
    },
    {
        date: '2023-02-01', type: 'Truck', make: 'Ford', model: 'F-150', year: 2018, transmission: 'Automatic',
        driveWheels: '4x4', doors: 4, category: 'Pickup', engine: '3.5L V6', color: 'Black',
        mileage: 72000, plate: 'ABC-123', vin: '1FTFW123456789012', unitNumber: 'V002', labels: 'Service',
        notes: 'Used for hauling, minor dents on bed.'
    },
    {
        date: '2023-03-10', type: 'Motorcycle', make: 'Honda', model: 'CBR500R', year: 2022, transmission: 'Manual',
        driveWheels: 'RWD', doors: 0, category: 'Sportbike', engine: '471cc Parallel-Twin', color: 'Red',
        mileage: 8500, plate: 'MOTO-456', vin: 'JH2PC6200PK123456', unitNumber: 'V003', labels: 'Personal',
        notes: 'Excellent condition, garaged.'
    },
    {
        date: '2023-04-05', type: 'SUV', make: 'Jeep', model: 'Grand Cherokee', year: 2021, transmission: 'Automatic',
        driveWheels: '4x4', doors: 5, category: 'SUV', engine: '3.6L V6', color: 'White',
        mileage: 28000, plate: 'SUV-007', vin: '1C4PJ123456789012', unitNumber: 'V004', labels: 'Customer',
        notes: 'Off-road package, new tires.'
    },
    {
        date: '2023-05-20', type: 'Van', make: 'Mercedes-Benz', model: 'Sprinter', year: 2019, transmission: 'Automatic',
        driveWheels: 'RWD', doors: 3, category: 'Cargo Van', engine: '2.1L Diesel', color: 'Gray',
        mileage: 110000, plate: 'VAN-555', vin: 'WDA01234567890123', unitNumber: 'V005', labels: 'Fleet',
        notes: 'Commercial use, high mileage, needs oil change.'
    },
];

// --- VEHICLES REPORT COMPONENT ---

const VehiclesReport = ({ 
    onExport = () => console.log('Exporting...'), 
    onViewList = () => console.log('Viewing List...'),
    navigateTo = (path) => console.log(`Navigating to ${path}`)
}) => {
    const [vehicles, setVehicles] = useState(mockVehicleData);
    const [dateRange, setDateRange] = useState({ 
        from: '2023-01-01', 
        to: new Date().toISOString().split('T')[0] 
    });
    const [isLoading, setIsLoading] = useState(false);

    // Simulated Fetch/Filter function
    const handleFilter = useCallback(async () => {
        setIsLoading(true);
        console.log(`Filtering vehicles by date registered between ${dateRange.from} and ${dateRange.to}`);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // Simple filter based on registration date
        const filteredVehicles = mockVehicleData.filter(vehicle => 
            vehicle.date >= dateRange.from && vehicle.date <= dateRange.to
        );

        setVehicles(filteredVehicles);
        setIsLoading(false);
    }, [dateRange]);

    useEffect(() => {
        // Initial load on mount
        handleFilter();
    }, [handleFilter]);
    
    // --- Render Logic ---

    // 🛑 Replaced the simple loading-state div with the LoaderSpinner component
    // if (isLoading) return <div className="loading-state">Loading Vehicles Data...</div>;

    return (
        <div className="report-page-container">
            
            {/* Header */}
            <header className="page-header report-header">
                <button className="back-button" onClick={() => navigateTo('/reports')}>
                    <FaAngleLeft />
                </button>
                <h2><FaCar style={{ marginRight: '8px' }} /> Vehicles Report</h2>
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
                    <FaCalendarAlt className="calendar-icon" /> {/* 🛑 FaCalendarAlt icon */}
                </div>
                
                <span className="filter-label" style={{ marginLeft: '10px' }}>To:</span>
                <div className="date-input-wrapper">
                    <input type="date" value={dateRange.to} onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))} />
                    <FaCalendarAlt className="calendar-icon" /> {/* 🛑 FaCalendarAlt icon */}
                </div>
                
                <button 
                    className="btn-filter" 
                    onClick={handleFilter}
                    style={{ marginLeft: '10px' }} 
                    disabled={isLoading} // 🛑 DISABLE FILTER WHEN LOADING
                >
                    <FaFilter /> Filter
                </button>
            </div>
            
            {/* Report Content Area */}
            <div className="list-content-area" style={{ padding: '20px' }}>
                <div className="report-view-content">
                    {isLoading ? ( // 🛑 Show Loader when loading
                        <LoaderSpinner text="Fetching vehicle list..." />
                    ) : (
                        <>
                            <p className="report-note">
                                NOTE: This report lists all vehicles in your database, based on their registration date within the selected period.
                            </p>
                            {vehicles.length === 0 ? (
                                <div className="no-data-message">No vehicle records found.</div>
                            ) : (
                                <div className="table-wrapper">
                                    <table className="data-table vehicles-table">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Type</th>
                                                <th>Make <FaSortDown /></th>
                                                <th>Model</th>
                                                <th>Year</th>
                                                <th>Transmission</th>
                                                <th>Drive Wheels</th>
                                                <th>Doors</th>
                                                <th>Category</th>
                                                <th>Engine</th>
                                                <th>Color</th>
                                                <th>Mileage</th>
                                                <th>Plate</th>
                                                <th>VIN</th>
                                                <th>Unit Number</th>
                                                <th>Labels</th>
                                                <th className="action-column-header">...</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {vehicles.map((vehicle, index) => (
                                                <tr key={index}>
                                                    <td>{vehicle.date}</td>
                                                    <td>{vehicle.type}</td>
                                                    <td>{vehicle.make}</td>
                                                    <td>{vehicle.model}</td>
                                                    <td>{vehicle.year}</td>
                                                    <td>{vehicle.transmission}</td>
                                                    <td>{vehicle.driveWheels}</td>
                                                    <td>{vehicle.doors}</td>
                                                    <td>{vehicle.category}</td>
                                                    <td>{vehicle.engine}</td>
                                                    <td>{vehicle.color}</td>
                                                    <td>{vehicle.mileage}</td>
                                                    <td>{vehicle.plate}</td>
                                                    <td>{vehicle.vin}</td>
                                                    <td>{vehicle.unitNumber}</td>
                                                    <td>{vehicle.labels}</td>
                                                    <td className="action-column-cell">...</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            <div className="report-specific-footer">
                                <span>Total Vehicles: {vehicles.length}</span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* CSS Styles (Injected locally for a standalone component) */}
            <style jsx global>{`
                /* General Variables (Ensure these are defined once, preferably in a global CSS file or theme) */
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
                    background-color: #e8eaf6; /* Light Purple background like the header in the screenshot */
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
                
                .btn-filter:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
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
                    min-width: 1600px; 
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

                /* Footer Styling */
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
            `}</style>
        </div>
    );
};

export default VehiclesReport;