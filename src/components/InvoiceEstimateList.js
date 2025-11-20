// src/components/InvoiceEstimateList.js

import React from 'react';
import { FaFileInvoiceDollar, FaPlusCircle, FaSearch, FaChevronRight } from 'react-icons/fa';

const InvoiceEstimateList = ({ navigateTo }) => {
    
    // Mock Data for the list
    const invoicesAndEstimates = [
        { id: 'INV-2025-001', type: 'Invoice', customer: 'John Doe', date: '2025-11-01', total: 1200000.00, currency: 'TZS', status: 'Paid' },
        { id: 'EST-2025-005', type: 'Estimate', customer: 'Jane Smith', date: '2025-11-05', total: 950000.00, currency: 'TZS', status: 'Pending' },
        { id: 'INV-2025-002', type: 'Invoice', customer: 'Azizi Bongo', date: '2025-11-10', total: 540500.00, currency: 'TZS', status: 'Draft' },
        { id: 'EST-2025-006', type: 'Estimate', customer: 'Moto Garage Ltd', date: '2025-11-12', total: 350000.00, currency: 'TZS', status: 'Accepted' },
        { id: 'INV-2025-003', type: 'Invoice', customer: 'Ally Kiba', date: '2025-11-12', total: 750000.00, currency: 'TZS', status: 'Sent' },
        { id: 'INV-2025-004', type: 'Invoice', customer: 'Hellen M.', date: '2025-11-13', total: 80000.00, currency: 'TZS', status: 'Overdue' },
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Paid': return { color: '#059669', background: '#D1FAE5' }; // Green
            case 'Pending': return { color: '#D97706', background: '#FEF3C7' }; // Amber
            case 'Sent': return { color: '#1D4ED8', background: '#DBEAFE' }; // Blue
            case 'Accepted': return { color: '#047857', background: '#D1FAE5' }; // Darker Green
            case 'Overdue': return { color: '#B91C1C', background: '#FEE2E2' }; // Red
            case 'Draft': 
            default: return { color: '#4B5563', background: '#E5E7EB' }; // Gray
        }
    };
    
    const formatCurrency = (amount, currency) => {
        return `${currency} ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    };

    return (
        <div className="list-page-container">
            
            <header className="page-header list-header">
                <h2 className="main-title"><FaFileInvoiceDollar style={{ marginRight: '10px' }}/> **Financial Documents**</h2>
                <div className="header-actions">
                    <button 
                        className="btn-primary-action btn-new" 
                        onClick={() => navigateTo('/invoices-estimates/new-invoice')} 
                    >
                        <FaPlusCircle style={{ marginRight: '8px' }} /> Create New Invoice
                    </button>
                    {/* Placeholder for future search bar */}
                    <div className="search-placeholder">
                        <FaSearch />
                    </div>
                </div>
            </header>
            
            <div className="list-content-area">
                <h3 className="section-title">All Documents ({invoicesAndEstimates.length})</h3>
                
                {invoicesAndEstimates.length === 0 ? (
                    <div className="empty-state">
                        <p>No invoices or estimates have been created yet.</p>
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th className="col-id">Number</th>
                                <th className="col-type">Type</th>
                                <th className="col-customer">Customer</th>
                                <th className="col-date">Date</th>
                                <th className="col-total">Total ({invoicesAndEstimates[0].currency})</th>
                                <th className="col-status">Status</th>
                                <th className="col-actions">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoicesAndEstimates.map((item) => {
                                const statusStyle = getStatusStyle(item.status);
                                const totalFormatted = formatCurrency(item.total, item.currency);
                                const typeClass = item.type.toLowerCase();

                                return (
                                    <tr key={item.id} className={typeClass}>
                                        <td className="col-id">**{item.id}**</td>
                                        <td className="col-type"><span className={`type-tag tag-${typeClass}`}>{item.type}</span></td>
                                        <td className="col-customer">{item.customer}</td>
                                        <td className="col-date">{item.date}</td>
                                        <td className="col-total total-cell">{totalFormatted}</td>
                                        <td className="col-status">
                                            <span 
                                                className="status-badge" 
                                                style={{ backgroundColor: statusStyle.background, color: statusStyle.color }}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="col-actions">
                                            <button 
                                                className="btn-link-action" 
                                                onClick={() => navigateTo(`/invoices-estimates/${item.type.toLowerCase()}/${item.id}`)}
                                            >
                                                View <FaChevronRight size={10} style={{ marginLeft: '5px' }}/>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* --- STYLING --- */}
            <style jsx>{`
                /* --- Layout and Structure --- */
                .list-page-container {
                    padding: 30px;
                    max-width: 1300px;
                    margin: 0 auto;
                    background: #ffffff; 
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); 
                }

                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 25px;
                    padding-bottom: 15px;
                    border-bottom: 2px solid #e0e0e0;
                }
                .main-title {
                    color: #333;
                    font-size: 1.8em;
                    margin: 0;
                    display: flex;
                    align-items: center;
                }
                .header-actions {
                    display: flex;
                    gap: 15px;
                    align-items: center;
                }
                
                .btn-primary-action {
                    background-color: #007bff; /* Primary Blue */
                    color: white;
                    border: none;
                    padding: 10px 18px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 0.95em;
                    transition: background-color 0.2s;
                    display: flex;
                    align-items: center;
                }
                .btn-primary-action:hover {
                    background-color: #0056b3;
                }

                .search-placeholder {
                    color: #adb5bd;
                    border: 1px solid #ced4da;
                    padding: 10px 15px;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    background: #f8f9fa;
                }

                .section-title {
                    font-size: 1.2em;
                    color: #495057; 
                    margin: 0 0 15px 0;
                    font-weight: 600;
                }

                .list-content-area {
                    padding: 0 10px;
                }
                
                /* --- Data Table --- */
                .data-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 0.95em;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                    border-radius: 8px;
                    overflow: hidden; /* Ensures rounded corners are applied */
                }
                .data-table th, .data-table td {
                    padding: 14px 18px;
                    text-align: left;
                    border-bottom: 1px solid #f1f1f1;
                }
                .data-table th {
                    background-color: #f8f9fa;
                    color: #495057;
                    font-weight: 700;
                    text-transform: uppercase;
                    font-size: 0.85em;
                }
                .data-table tbody tr:hover {
                    background-color: #f7faff; /* Light blue hover effect */
                }
                
                /* Specific Column Styling */
                .col-id { font-weight: 700; width: 15%; }
                .col-type { width: 10%; }
                .col-customer { width: 25%; }
                .col-date { width: 12%; }
                .col-total { width: 15%; text-align: right; font-weight: 600; color: #155724; }
                .col-status { width: 13%; }
                .col-actions { width: 10%; text-align: right; }

                .total-cell {
                    font-family: monospace;
                    font-size: 1em;
                }
                
                /* Tags and Status Badges */
                .type-tag {
                    display: inline-block;
                    padding: 3px 8px;
                    border-radius: 4px;
                    font-size: 0.8em;
                    font-weight: 700;
                }
                .tag-invoice { background-color: #e6f7ff; color: #0050b3; border: 1px solid #91d5ff;}
                .tag-estimate { background-color: #fffbe6; color: #ad8b00; border: 1px solid #ffe58f;}

                .status-badge {
                    display: inline-block;
                    padding: 5px 10px;
                    border-radius: 12px;
                    font-size: 0.85em;
                    font-weight: 700;
                    text-align: center;
                    min-width: 70px;
                }
                
                /* Action Button */
                .btn-link-action {
                    background: none;
                    border: none;
                    color: #007bff;
                    cursor: pointer;
                    font-size: 0.9em;
                    font-weight: 600;
                    padding: 0;
                    display: flex;
                    align-items: center;
                    margin-left: auto;
                    transition: color 0.2s;
                }
                .btn-link-action:hover {
                    color: #0056b3;
                }

                /* Empty State */
                .empty-state {
                    text-align: center; 
                    padding: 40px; 
                    color: #6c757d;
                    border: 1px dashed #ced4da;
                    border-radius: 4px;
                    margin-top: 20px;
                    background: #fafafa;
                }
                
                /* --- Responsive Adjustments --- */
                @media (max-width: 768px) {
                    .page-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    .header-actions {
                        margin-top: 15px;
                        width: 100%;
                        justify-content: space-between;
                    }
                    .btn-new {
                        flex-grow: 1;
                        justify-content: center;
                    }
                    .data-table {
                        display: block;
                        overflow-x: auto;
                        white-space: nowrap;
                    }
                    .data-table thead, .data-table tbody, .data-table tr {
                        display: inline-block;
                    }
                }
            `}</style>
        </div>
    );
};

export default InvoiceEstimateList;