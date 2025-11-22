import React, { useState } from 'react';
import { FaDatabase, FaExchangeAlt, FaDownload, FaUpload, FaAngleLeft } from 'react-icons/fa';

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
        <p className="loading-text-spinner">{text || 'Loading Data...'}</p>
    </div>
);

// Define the selectable data sources
const dataSources = [
    'Clients',
    'Parts Sold',
    'Services Performed',
    'Invoices & Estimates',
    'Expenses',
    'Purchases',
    'Vendors',
    'Vehicles',
];

// Assuming `MapsTo` is passed via props to handle navigating back to /reports
const DataExportPage = ({ onExport = () => console.log('Exporting...'), onImport = () => console.log('Importing...'), navigateTo = (path) => console.log(`Navigating to ${path}`) }) => {
    const [selectedSource, setSelectedSource] = useState(dataSources[0]);
    const [isDataLoaded, setIsDataLoaded] = useState(false); // To toggle between placeholder and table
    const [isLoading, setIsLoading] = useState(false); // 🛑 Added loading state

    const handleGetData = async () => { // 🛑 Made async
        setIsLoading(true); // 🛑 Start loading
        setIsDataLoaded(false);

        console.log(`Getting data for: ${selectedSource}`);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // In a real application, you'd get the actual data here
        // For demonstration, we just set a flag to show simulated data is ready
        setIsDataLoaded(true);
        setIsLoading(false); // 🛑 Stop loading
    };
    
    // --- Data Preview Content ---
    const DataPreviewContent = () => {
        if (isLoading) {
            return <LoaderSpinner text={`Fetching data for "${selectedSource}"...`} />;
        }
        
        if (isDataLoaded) {
            // Simulated Data Table Content
            return (
                <div className="simulated-table-preview">
                    <h3>Data Preview: {selectedSource} (Simulated)</h3>
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Record ID</th>
                                    <th>Description</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Sample rows for visual representation */}
                                <tr><td>1</td><td>{selectedSource.substring(0, 3)}-001</td><td>Sample Data Entry 1</td><td>2024-11-20</td></tr>
                                <tr><td>2</td><td>{selectedSource.substring(0, 3)}-002</td><td>Sample Data Entry 2</td><td>2024-11-18</td></tr>
                                <tr><td>3</td><td>{selectedSource.substring(0, 3)}-003</td><td>Sample Data Entry 3</td><td>2024-11-15</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <p style={{ marginTop: '10px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                        Loaded 100+ records for {selectedSource}. Ready to export.
                    </p>
                </div>
            );
        }
        
        // Initial placeholder state
        return (
            <p style={{ textAlign: 'center', marginTop: '50px', color: 'var(--color-text-muted)' }}>
                Select a data source and click "Get Data" to load the preview table.
            </p>
        );
    }

    return (
        <div className="report-page-container">
            
            {/* Header */}
            <header className="page-header report-header">
                <button className="back-button" onClick={() => navigateTo('/reports')}>
                    <FaAngleLeft />
                </button>
                <h2><FaDatabase style={{ marginRight: '8px' }} /> Data Export</h2>
                <div className="header-actions">
                    {/* Buttons for Export and Import - disabled when loading or if no data is loaded */}
                    <button className="btn-primary-action" onClick={onExport} title="Export Data" disabled={isLoading || !isDataLoaded}>
                        <FaDownload /> Export
                    </button>
                    <button className="btn-secondary-action" onClick={onImport} title="Import Data" disabled={isLoading}>
                        <FaUpload /> Import
                    </button>
                </div>
            </header>

            {/* Content Area */}
            <div className="list-content-area" style={{ padding: '20px' }}>
                <div className="report-view-content">
                    <p className="report-note" style={{ borderLeftColor: '#d9534f', color: '#d9534f' }}>
                        <FaExchangeAlt style={{ marginRight: '8px' }} /> 
                        **NOTE:** Here you can export your data directly from ARIS database! This is useful when you want to import this data in another API account! 
                        Start by selecting the data source you want to export and click on the "Get Data" button. Once the data is loaded, you can export it to Excel or PDF.
                    </p>
                    
                    <div className="export-controls">
                        <div className="select-container">
                            <select 
                                value={selectedSource} 
                                onChange={(e) => setSelectedSource(e.target.value)}
                                disabled={isLoading} // 🛑 Disable select when loading
                            >
                                {dataSources.map(source => (
                                    <option key={source} value={source}>{source}</option>
                                ))}
                            </select>
                        </div>
                        
                        <button className="btn-get-data" onClick={handleGetData} disabled={isLoading}>
                            {isLoading ? 'Loading...' : 'Get Data'} {/* 🛑 Dynamic text */}
                        </button>
                    </div>

                    {/* Data Preview */}
                    <div className="data-preview-area">
                        <DataPreviewContent />
                    </div>

                </div>
            </div>

            {/* CSS Styles (Injected locally) */}
            <style jsx global>{`
                /* General Variables */
                :root {
                    --color-primary: #5c6bc0; /* Dark Blue */
                    --color-primary-dark: #4a5aa8;
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
                    width: 100%;
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

                /* Action Buttons */
                .header-actions {
                    display: flex;
                    align-items: center;
                }
                .header-actions button {
                    margin-left: 10px;
                    padding: 8px 15px;
                    border-radius: 4px;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    font-weight: 500;
                    transition: background-color 0.2s;
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
                
                .btn-get-data:disabled, 
                .header-actions button:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                /* Report Notes */
                .report-note {
                    background-color: #f7e6e9; 
                    color: #d9534f; 
                    padding: 10px 15px;
                    font-size: 0.9rem;
                    margin-bottom: 20px;
                    border-radius: 4px;
                    display: flex;
                    align-items: flex-start;
                    border-left: 4px solid #d9534f;
                    line-height: 1.4;
                }

                /* Export Controls (Select and Get Data button) */
                .export-controls {
                    display: flex;
                    gap: 10px;
                    align-items: center;
                    margin-bottom: 20px;
                }
                
                .select-container {
                    flex-grow: 1; 
                    max-width: 500px; 
                    border: 1px solid var(--color-border);
                    border-radius: 4px;
                    overflow: hidden;
                    background-color: white;
                }

                .select-container select {
                    width: 100%;
                    padding: 10px 15px;
                    border: none;
                    background-color: transparent;
                    font-size: 1rem;
                    color: var(--color-text-primary);
                    appearance: none; 
                    cursor: pointer;
                    height: 100%;
                }
                .select-container select:disabled {
                    cursor: not-allowed;
                    background-color: var(--color-background-light);
                }


                .btn-get-data {
                    padding: 10px 20px;
                    background-color: var(--color-primary);
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: background-color 0.2s;
                }
                .btn-get-data:hover {
                    background-color: var(--color-primary-dark);
                }

                .data-preview-area {
                    min-height: 300px;
                    border: 1px solid var(--color-border);
                    border-radius: 4px;
                    background-color: white;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;
                }
                
                /* Simulated Table Styles for Preview */
                .simulated-table-preview {
                    padding: 20px;
                    width: 100%;
                }
                .simulated-table-preview h3 {
                    margin-bottom: 15px;
                    color: var(--color-primary);
                }
                .simulated-table-preview .table-wrapper {
                    overflow-x: auto;
                    max-width: 100%;
                    border: 1px solid var(--color-border);
                    border-radius: 4px;
                }
                .simulated-table-preview .data-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .simulated-table-preview .data-table th,
                .simulated-table-preview .data-table td {
                    padding: 10px 15px;
                    border-bottom: 1px solid #f0f0f0;
                    text-align: left;
                    font-size: 0.9rem;
                }
                .simulated-table-preview .data-table th {
                    background-color: #f7f9fc;
                    color: var(--color-text-muted);
                    font-weight: 600;
                }
            `}</style>
        </div>
    );
};

export default DataExportPage;