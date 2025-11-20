// src/components/InvoiceEstimateLanding.js

import React from 'react';
import { FaFileInvoice, FaClipboardList, FaFileContract, FaPlusCircle, FaArrowRight } from 'react-icons/fa';

const InvoiceEstimateLanding = ({ navigateTo }) => {
    
    // Mock data for lists (Updated to include currency for better display)
    const mockEstimates = [
        { id: 'QUO-001', client: 'John Doe', total: 450000.00, currency: 'TZS', date: '2025-11-01', status: 'Approved' },
        { id: 'QUO-002', client: 'Acme Corp', total: 1200500.00, currency: 'TZS', date: '2025-11-05', status: 'Sent' },
        { id: 'QUO-003', client: 'Bongo Motors', total: 60000.00, currency: 'TZS', date: '2025-11-10', status: 'Draft' },
    ];
    const mockInvoices = [
        { id: 'INV-001', client: 'Jane Smith', total: 300000.00, currency: 'TZS', date: '2025-10-25', status: 'Paid' },
        { id: 'INV-002', client: 'Global Motors', total: 780000.00, currency: 'TZS', date: '2025-11-08', status: 'Unpaid' },
        { id: 'INV-003', client: 'Tech Solutions', total: 150000.00, currency: 'TZS', date: '2025-11-12', status: 'Overdue' },
    ];

    const getStatusStyle = (status) => {
        const normalizedStatus = status.toLowerCase().replace(/\s/g, '');
        switch (normalizedStatus) {
            case 'approved': return { color: '#059669', background: '#D1FAE5' }; // Green
            case 'paid': return { color: '#059669', background: '#D1FAE5' };
            case 'sent': return { color: '#1D4ED8', background: '#DBEAFE' }; // Blue
            case 'unpaid': return { color: '#F59E0B', background: '#FEF3C7' }; // Amber
            case 'overdue': return { color: '#B91C1C', background: '#FEE2E2' }; // Red
            case 'draft': 
            default: return { color: '#4B5563', background: '#E5E7EB' }; // Gray
        }
    };
    
    const formatCurrency = (amount, currency) => {
        return `${currency} ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    };

    const renderTable = (docs, type) => (
        <table className="data-table small-table">
            <thead>
                <tr>
                    <th className="col-id">ID</th>
                    <th className="col-client">Client</th>
                    <th className="col-total">Total</th>
                    <th className="col-status">Status</th>
                    <th className="col-action">Action</th>
                </tr>
            </thead>
            <tbody>
                {docs.map(doc => {
                    const statusStyle = getStatusStyle(doc.status);
                    return (
                        <tr key={doc.id} className={doc.status.toLowerCase()}>
                            <td className="col-id">**{doc.id}**</td>
                            <td className="col-client">{doc.client}</td>
                            <td className="col-total total-cell">{formatCurrency(doc.total, doc.currency)}</td>
                            <td className="col-status">
                                <span 
                                    className="status-badge" 
                                    style={{ backgroundColor: statusStyle.background, color: statusStyle.color }}
                                >
                                    {doc.status}
                                </span>
                            </td>
                            <td className="col-action">
                                <button 
                                    className="btn-link-action" 
                                    onClick={() => navigateTo(`/invoices-estimates/${type.toLowerCase()}/${doc.id}`)}
                                >
                                    View
                                </button>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );

    return (
        <div className="list-page-container">
            <header className="page-header">
                <h2 className="main-title"><FaFileInvoice style={{ marginRight: '10px' }}/> Financial Management</h2>
                <div className="header-actions">
                    <button 
                        className="btn-secondary action-estimate" 
                        onClick={() => navigateTo('/invoices-estimates/estimate/new')}
                    >
                        <FaFileContract style={{ marginRight: '5px' }} /> New Estimate
                    </button>
                    <button 
                        className="btn-primary-action action-invoice" 
                        onClick={() => navigateTo('/invoices-estimates/invoice/new')}
                    >
                        <FaPlusCircle style={{ marginRight: '5px' }} /> New Invoice
                    </button>
                </div>
            </header>
            
            <hr className="divider"/>

            <div className="section-overview-grid">
                
                {/* Estimates Section */}
                <div className="list-section estimate-section">
                    <h3 className="section-title-card">
                        <FaClipboardList style={{ color: '#f39c12' }} /> Recent Estimates ({mockEstimates.length})
                    </h3>
                    
                    <div className="card-content-table">
                        {renderTable(mockEstimates, 'estimate')}
                    </div>
                    
                    <div className="section-footer">
                        <button 
                            className="btn-full-width view-all-btn btn-estimate-view" 
                            onClick={() => navigateTo('/invoices-estimates/list?type=estimate')}
                        >
                            View All Estimates <FaArrowRight style={{ marginLeft: '8px' }}/>
                        </button>
                    </div>
                </div>

                {/* Invoices Section */}
                <div className="list-section invoice-section">
                    <h3 className="section-title-card">
                        <FaFileInvoice style={{ color: '#007bff' }} /> Recent Invoices ({mockInvoices.length})
                    </h3>
                    
                    <div className="card-content-table">
                        {renderTable(mockInvoices, 'invoice')}
                    </div>

                    <div className="section-footer">
                        <button 
                            className="btn-full-width view-all-btn btn-invoice-view" 
                            onClick={() => navigateTo('/invoices-estimates/list?type=invoice')}
                        >
                            View All Invoices <FaArrowRight style={{ marginLeft: '8px' }}/>
                        </button>
                    </div>
                </div>
            </div>

            {/* --- STYLING --- */}
            <style jsx>{`
                /* --- Layout and Structure --- */
                .list-page-container {
                    padding: 30px;
                    /* Increased max-width for wider screens, keeping content centered */
                    max-width: 1900px; 
                    margin: 0 auto;
                    background: #f7f9fc; /* Light background for the page */
                    min-height: 90vh;
                }
                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }
                .main-title {
                    color: #1f2937;
                    font-size: 2.2em; /* Increased */
                    margin: 0;
                    display: flex;
                    align-items: center;
                }
                .header-actions {
                    display: flex;
                    gap: 15px;
                }
                .divider {
                    border: 0;
                    border-top: 1px solid #e5e7eb;
                    margin: 15px 0 30px 0;
                }

                /* --- Buttons (Primary/Secondary) --- */
                .btn-primary-action, .btn-secondary {
                    padding: 10px 18px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 1em; /* Increased */
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    border: 1px solid;
                }
                .action-invoice {
                    background-color: #007bff; /* Primary Blue */
                    color: white;
                    border-color: #007bff;
                }
                .action-invoice:hover {
                    background-color: #0056b3;
                    border-color: #0056b3;
                }
                .action-estimate {
                    background-color: #f39c12; /* Orange for Estimate */
                    color: white;
                    border-color: #f39c12;
                }
                .action-estimate:hover {
                    background-color: #d68910;
                    border-color: #d68910;
                }
                
                /* --- Grid and Card Layout --- */
                .section-overview-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                    gap: 30px;
                }
                .list-section {
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    background: white;
                    box-shadow: 0 6px 15px rgba(0,0,0,0.05);
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }
                .section-title-card {
                    padding: 15px 20px;
                    margin: 0;
                    font-size: 1.4em; /* Increased */
                    background-color: #fbfdff; /* Very light background for card header */
                    border-bottom: 1px solid #e5e7eb;
                    display: flex;
                    align-items: center;
                    color: #1f2937;
                    gap: 10px;
                }
                
                .card-content-table {
                    padding: 10px 0;
                    flex-grow: 1;
                }

                /* --- Table Styling --- */
                .small-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 0;
                }
                .small-table th, .small-table td {
                    padding: 12px 20px;
                    text-align: left;
                    font-size: 1em; /* Increased (main content) */
                    border-bottom: 1px solid #f1f1f1;
                }
                .small-table th {
                    background-color: #fcfcfc;
                    color: #6b7280;
                    font-weight: 700;
                    text-transform: uppercase;
                    font-size: 0.85em; /* Increased */
                }
                .small-table tbody tr:last-child td {
                    border-bottom: none;
                }
                .col-total { text-align: right; font-weight: 600; }
                .total-cell { font-family: monospace; color: #155724; }

                /* Status Badges */
                .status-badge {
                    display: inline-block;
                    padding: 5px 12px; /* Adjusted padding with larger font */
                    border-radius: 16px; /* Pill shape */
                    font-size: 0.85em; /* Increased slightly */
                    font-weight: 700;
                    min-width: 60px;
                    text-align: center;
                }
                
                /* Action Button in Table */
                .btn-link-action {
                    background: none;
                    border: none;
                    color: #007bff;
                    cursor: pointer;
                    font-size: 1em; /* Increased */
                    font-weight: 600;
                    padding: 0;
                    transition: color 0.2s;
                }
                .btn-link-action:hover {
                    color: #0056b3;
                }

                /* --- Footer and View All Button --- */
                .section-footer {
                    padding: 15px 20px;
                    border-top: 1px solid #e5e7eb;
                    text-align: center;
                    margin-top: auto;
                    background-color: #fcfcfc;
                }
                .view-all-btn {
                    background: #ffffff;
                    color: #007bff;
                    border: 2px solid #007bff;
                    padding: 12px 18px; /* Increased padding */
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 1.05em; /* Increased */
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    transition: all 0.3s;
                }
                .view-all-btn:hover {
                    background: #e6f7ff;
                    color: #0056b3;
                    border-color: #0056b3;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 8px rgba(0, 123, 255, 0.1);
                }

                /* Specific color hints for view all buttons */
                .btn-estimate-view {
                    color: #f39c12;
                    border-color: #f39c12;
                }
                .btn-estimate-view:hover {
                    background: #fff8e1;
                    color: #d68910;
                    border-color: #d68910;
                }


                @media (max-width: 950px) {
                    .section-overview-grid {
                        grid-template-columns: 1fr;
                    }
                }
                @media (max-width: 600px) {
                    .page-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    .header-actions {
                        margin-top: 15px;
                        width: 100%;
                        justify-content: space-between;
                    }
                    .btn-primary-action, .btn-secondary {
                        flex-grow: 1;
                        justify-content: center;
                    }
                }
            `}</style>
        </div>
    );
};

export default InvoiceEstimateLanding;