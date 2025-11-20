// src/components/AccountList.js

import React from 'react';
import { FaBook, FaPlusCircle, FaMoneyCheckAlt, FaClipboardList, FaFileInvoiceDollar, FaEdit } from 'react-icons/fa';

// --- MOCK DATA (Ideally separated) ---
const MOCK_ACCOUNTS = [
    { id: 'A001', code: '1010', name: 'Petty Cash', type: 'Asset', balance: 500.00, currency: 'TZS', active: true },
    { id: 'A002', code: '1020', name: 'CRDB Business Account', type: 'Asset', balance: 125000.00, currency: 'TZS', active: true },
    { id: 'A003', code: '4010', name: 'Repair Service Income', type: 'Income', balance: 350000.00, currency: 'TZS', active: true },
    { id: 'A004', code: '5010', name: 'Parts Cost of Goods Sold', type: 'Expense', balance: 80000.00, currency: 'TZS', active: true },
    { id: 'A005', code: '2010', name: 'Supplier Payable', type: 'Liability', balance: 45000.00, currency: 'TZS', active: true },
];

const AccountList = ({ navigateTo }) => {

    const getTotalBalance = () => {
        // Simple aggregation assuming TZS is the primary currency. 
        // In a real app, this would require multi-currency conversion.
        return MOCK_ACCOUNTS.reduce((sum, account) => {
            // Only sum Asset/Liability/Equity for a Balance Sheet view
            if (['Asset', 'Liability', 'Equity'].includes(account.type)) {
                // Simplified: Liabilities subtract from balance
                const value = account.type === 'Liability' ? -account.balance : account.balance;
                return sum + value;
            }
            return sum;
        }, 0);
    };

    const formatCurrency = (amount, currency) => {
        return `${currency} ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    };

    const totalBalance = getTotalBalance();
    const primaryCurrency = 'TZS'; // Assumption

    return (
        <div className="list-page-container">
            <header className="page-header">
                <h2><FaBook style={{ marginRight: '8px' }}/> Accounting Overview</h2>
                <p className="header-subtitle">Chart of Accounts and quick access to core financial tools.</p>
            </header>
            
            {/* Quick Actions / Navigation Links */}
            <section className="quick-actions-section">
                <h3> Accounting Tools</h3>
                <div className="action-buttons-group">
                    
                    {/* View Transaction Journal */}
                    <button 
                        className="btn action-btn-blue" 
                        onClick={() => navigateTo('/accounting/journal')}
                    >
                        <FaFileInvoiceDollar /> View Transaction Journal
                    </button>
                    
                    {/* Record Expense */}
                    <button 
                        className="btn action-btn-orange" 
                        onClick={() => navigateTo('/accounting/expenses')}
                    >
                        <FaMoneyCheckAlt /> Record Expense
                    </button>
                    
                    {/* Add New Account */}
                    <button 
                        className="btn action-btn-green" 
                        onClick={() => navigateTo('/accounting/accounts/new')}
                    >
                        <FaPlusCircle /> Add New Account
                    </button>
                </div>
            </section>
            
            <hr className="divider" />
            
            {/* Chart of Accounts Display */}
            <section className="chart-of-accounts-section">
                <div className="section-header-row">
                    <h3 className="section-title"><FaClipboardList /> Chart of Accounts ({MOCK_ACCOUNTS.length})</h3>
                    <div className={`total-balance-indicator ${totalBalance < 0 ? 'negative' : 'positive'}`}>
                        Net Equity/Balance: **{formatCurrency(totalBalance, primaryCurrency)}**
                    </div>
                </div>

                {MOCK_ACCOUNTS.length === 0 ? (
                    <div className="empty-state">
                        <p>No accounts have been defined yet. Start by adding a Bank or Cash Account.</p>
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th className="col-code">Code</th>
                                <th className="col-name">Account Name</th>
                                <th className="col-type">Type</th>
                                <th className="col-balance">Balance ({primaryCurrency})</th>
                                <th className="col-status">Status</th>
                                <th className="col-actions">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_ACCOUNTS.map((a) => (
                                <tr key={a.id} className={!a.active ? 'inactive-row' : ''}>
                                    <td className="col-code">**{a.code}**</td>
                                    <td className="col-name">{a.name}</td>
                                    <td className="col-type"><span className={`type-tag tag-${a.type.toLowerCase()}`}>{a.type}</span></td>
                                    <td className="col-balance balance-cell">{formatCurrency(a.balance, a.currency)}</td>
                                    <td className="col-status"><span className={a.active ? 'status-active' : 'status-inactive'}>{a.active ? 'Active' : 'Inactive'}</span></td>
                                    <td className="col-actions">
                                        <button 
                                            className="btn-link-action" 
                                            onClick={() => navigateTo(`/accounting/accounts/${a.id}`)}
                                        >
                                            <FaEdit /> View/Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>

            {/* --- IMPROVED CSS STYLING --- */}
            <style jsx>{`
                /* --- Layout and Structure --- */
                .list-page-container {
                    padding: 30px;
                    max-width: 1830px;
                    margin: 0 auto;
                    background: #ffffff; 
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); 
                }

                .page-header {
                    margin-bottom: 20px;
                    padding-bottom: 15px;
                    border-bottom: 2px solid #e0e0e0;
                }
                .page-header h2 {
                    color: #333;
                    font-size: 1.8em;
                    margin: 0;
                }
                .header-subtitle {
                    color: #666;
                    margin-top: 5px;
                    font-size: 0.95em;
                }
                .divider {
                    border: 0;
                    border-top: 1px dashed #ced4da;
                    margin: 30px 0;
                }

                /* --- Section Titles & Headers --- */
                .section-title {
                    font-size: 1.25em;
                    color: #495057; 
                    margin-top: 0;
                    display: flex;
                    align-items: center;
                }
                .section-title svg {
                    margin-right: 8px;
                    color: #007bff;
                }
                .section-header-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }

                /* --- Quick Actions --- */
                .quick-actions-section {
                    padding: 0 0 10px 0;
                }
                .action-buttons-group {
                    display: flex;
                    gap: 15px;
                    flex-wrap: wrap;
                    margin-top: 15px;
                }
                .btn {
                    padding: 10px 18px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 0.95em;
                    font-weight: 600;
                    transition: background-color 0.2s, box-shadow 0.2s;
                    display: flex;
                    align-items: center;
                    color: white;
                }
                .btn svg {
                    margin-right: 8px;
                }

                .action-btn-blue { background-color: #2980b9; } /* Journal */
                .action-btn-blue:hover { background-color: #205b82; }
                .action-btn-orange { background-color: #e67e22; } /* Expense */
                .action-btn-orange:hover { background-color: #c9671b; }
                .action-btn-green { background-color: #2ecc71; } /* Add Account */
                .action-btn-green:hover { background-color: #25a25a; }

                /* --- Data Table --- */
                .data-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 10px;
                    font-size: 0.95em;
                }
                .data-table th, .data-table td {
                    padding: 12px 15px;
                    text-align: left;
                    border-bottom: 1px solid #dee2e6;
                }
                .data-table th {
                    background-color: #f8f9fa;
                    color: #495057;
                    font-weight: 700;
                    text-transform: uppercase;
                }
                .data-table tbody tr:hover {
                    background-color: #f2f7ff; /* Light blue hover effect */
                }
                
                /* Specific Column Widths/Styles */
                .col-code { width: 10%; font-weight: bold; }
                .col-type { width: 15%; }
                .col-balance { width: 20%; font-weight: bold; color: #28a745; }
                .col-actions { width: 10%; text-align: right; }
                .balance-cell { text-align: right; font-family: monospace; }
                
                .inactive-row {
                    opacity: 0.6;
                    font-style: italic;
                }

                /* Tags and Status */
                .type-tag {
                    display: inline-block;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 0.85em;
                    font-weight: 600;
                    text-align: center;
                    min-width: 65px;
                }
                .tag-asset { background-color: #d4edda; color: #155724; }
                .tag-liability { background-color: #f8d7da; color: #721c24; }
                .tag-income { background-color: #cce5ff; color: #004085; }
                .tag-expense { background-color: #fff3cd; color: #856404; }
                .tag-equity { background-color: #e2e3e5; color: #383d41; }
                
                .status-active { color: #28a745; }
                .status-inactive { color: #dc3545; }
                
                .btn-link-action {
                    background: none;
                    border: none;
                    color: #007bff;
                    cursor: pointer;
                    text-decoration: underline;
                    font-size: 0.9em;
                    padding: 0;
                    display: flex;
                    align-items: center;
                    margin-left: auto;
                }
                .btn-link-action svg {
                    margin-right: 5px;
                }

                /* Total Balance Indicator */
                .total-balance-indicator {
                    padding: 10px 15px;
                    border-radius: 6px;
                    font-size: 1.1em;
                    font-weight: 500;
                    border: 1px solid;
                }
                .total-balance-indicator.positive {
                    background-color: #d4edda; 
                    color: #155724;
                    border-color: #c3e6cb;
                }
                .total-balance-indicator.negative {
                    background-color: #f8d7da; 
                    color: #721c24;
                    border-color: #f5c6cb;
                }

                /* Empty State */
                .empty-state {
                    text-align: center; 
                    padding: 30px; 
                    color: #6c757d;
                    border: 1px dashed #ced4da;
                    border-radius: 4px;
                    margin-top: 20px;
                }
                
                /* --- Responsive Adjustments --- */
                @media (max-width: 768px) {
                    .action-buttons-group {
                        flex-direction: column;
                        gap: 10px;
                    }
                    .section-header-row {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 15px;
                    }
                    .total-balance-indicator {
                        width: 100%;
                        text-align: center;
                    }
                    .data-table, .data-table thead, .data-table tbody, .data-table th, .data-table td, .data-table tr { 
                        display: block; 
                    }
                    .data-table thead tr { 
                        position: absolute;
                        top: -9999px;
                        left: -9999px;
                    }
                    .data-table td { 
                        border: none;
                        border-bottom: 1px solid #eee; 
                        position: relative;
                        padding-left: 50%; 
                        text-align: right;
                    }
                    .data-table td:before {
                        content: attr(data-label);
                        position: absolute;
                        left: 0;
                        width: 45%;
                        padding-left: 15px;
                        font-weight: bold;
                        text-align: left;
                    }
                    /* Redefine pseudo-content for small screen */
                    .data-table tr td:nth-of-type(1):before { content: "Code"; }
                    .data-table tr td:nth-of-type(2):before { content: "Account Name"; }
                    .data-table tr td:nth-of-type(3):before { content: "Type"; }
                    .data-table tr td:nth-of-type(4):before { content: "Balance"; }
                    .data-table tr td:nth-of-type(5):before { content: "Status"; }
                    .data-table tr td:nth-of-type(6):before { content: "Actions"; }
                    
                    .col-actions {
                        text-align: left;
                        padding-left: 15px !important; 
                    }
                }
            `}</style>
        </div>
    );
};

export default AccountList;