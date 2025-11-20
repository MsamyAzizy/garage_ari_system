// src/components/TransactionJournal.js

import React, { useState } from 'react';
import { FaBookOpen, FaFilter, FaRedo } from 'react-icons/fa';

// Mock Data for demonstration purposes
const MOCK_JOURNAL_ENTRIES = [
    // 1. Example: Recording an Expense (e.g., Fuel Purchase)
    {
        id: 'JE-001',
        date: '2025-11-08',
        description: 'Fuel purchase for delivery van (Invoice #F987)',
        source: 'Expense: EXP-001',
        lines: [
            { accountCode: '6010', accountName: 'Fuel Expense', debit: 45000.00, credit: 0.00 },
            { accountCode: '1300', accountName: 'Input VAT (18%)', debit: 8100.00, credit: 0.00 },
            { accountCode: '1010', accountName: 'Petty Cash', debit: 0.00, credit: 53100.00 },
        ],
        totalDebit: 53100.00,
        totalCredit: 53100.00,
    },
    // 2. Example: Recording a Customer Payment on an Invoice
    {
        id: 'JE-002',
        date: '2025-11-09',
        description: 'Payment received from Customer C-012 for Invoice INV-105',
        source: 'Payment: PMT-003',
        lines: [
            { accountCode: '1020', accountName: 'CRDB Business Account', debit: 750000.00, credit: 0.00 },
            { accountCode: '1200', accountName: 'Accounts Receivable', debit: 0.00, credit: 750000.00 },
        ],
        totalDebit: 750000.00,
        totalCredit: 750000.00,
    },
    // 3. Example: Purchasing a Business Asset
    {
        id: 'JE-003',
        date: '2025-11-10',
        description: 'Purchase of new diagnostic tool (Asset ID AST-005)',
        source: 'Inventory: INV-003',
        lines: [
            { accountCode: '1700', accountName: 'Machinery & Equipment', debit: 1200000.00, credit: 0.00 },
            { accountCode: '2010', accountName: 'Supplier Payable', debit: 0.00, credit: 1200000.00 },
        ],
        totalDebit: 1200000.00,
        totalCredit: 1200000.00,
    },
];

const CURRENCY = 'TZS';

// Helper function to format money
const formatMoney = (amount) => {
    return `${CURRENCY} ${parseFloat(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

const TransactionJournal = () => {
    const [entries, setEntries] = useState(MOCK_JOURNAL_ENTRIES);
    
    // In a real application, you would implement filtering, sorting, and pagination here.
    
    return (
        <div className="journal-page-container">
            <header className="page-header">
                <h2><FaBookOpen /> Transaction Journal (General Ledger)</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn-secondary" onClick={() => alert('Filter options coming soon!')}>
                        <FaFilter style={{ marginRight: '5px' }} /> Filter
                    </button>
                    <button className="btn-secondary" onClick={() => setEntries(MOCK_JOURNAL_ENTRIES)}>
                        <FaRedo style={{ marginRight: '5px' }} /> Refresh
                    </button>
                    {/* Add button to manually create a journal entry (Advanced feature) */}
                </div>
            </header>

            <div className="journal-list-area">
                
                {entries.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No transactions found for the selected period.
                    </div>
                ) : (
                    entries.map(entry => (
                        <div key={entry.id} className="journal-entry-card">
                            
                            {/* Entry Header */}
                            <div className="entry-header">
                                <span className="entry-id">**Journal Entry #** {entry.id}</span>
                                <span className="entry-date">{entry.date}</span>
                            </div>
                            
                            {/* Entry Details */}
                            <div className="entry-details">
                                <p className="entry-description">{entry.description}</p>
                                <p className="entry-source">**Source:** *{entry.source}*</p>
                            </div>

                            {/* Entry Lines Table */}
                            <table className="entry-lines-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: '15%' }}>Code</th>
                                        <th style={{ width: '55%' }}>Account Name</th>
                                        <th className="text-right" style={{ width: '15%' }}>DEBIT ({CURRENCY})</th>
                                        <th className="text-right" style={{ width: '15%' }}>CREDIT ({CURRENCY})</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {entry.lines.map((line, index) => (
                                        <tr key={index} className={line.credit > 0 ? 'credit-line' : 'debit-line'}>
                                            <td>{line.accountCode}</td>
                                            {/* Indent the credit line for visual clarity */}
                                            <td style={{ paddingLeft: line.credit > 0 ? '30px' : '15px' }}>{line.accountName}</td>
                                            <td className="text-right debit-col">{line.debit > 0 ? formatMoney(line.debit) : ''}</td>
                                            <td className="text-right credit-col">{line.credit > 0 ? formatMoney(line.credit) : ''}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            
                            {/* Entry Footer (Totals) */}
                            <div className="entry-footer">
                                <span className="total-label">Transaction Total Check:</span>
                                <span className="total-debit">{formatMoney(entry.totalDebit)} (Dr)</span>
                                <span className="total-credit">{formatMoney(entry.totalCredit)} (Cr)</span>
                                {entry.totalDebit !== entry.totalCredit && (
                                    <span className="balance-error">**ERROR: UNBALANCED ENTRY!**</span>
                                )}
                            </div>

                        </div>
                    ))
                )}
            </div>
            
            <style jsx>{`
                .journal-page-container {
                    padding: 0 20px 20px 20px;
                }
                .journal-list-area {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .journal-entry-card {
                    background: var(--bg-white);
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }
                
                .entry-header {
                    background-color: #f7f9fc;
                    padding: 10px 15px;
                    border-bottom: 1px solid #e0e0e0;
                    display: flex;
                    justify-content: space-between;
                    font-size: 14px;
                    font-weight: 600;
                    color: var(--primary-action-color);
                }
                .entry-details {
                    padding: 10px 15px;
                    border-bottom: 1px dashed #e0e0e0;
                }
                .entry-description {
                    margin: 0 0 5px 0;
                    font-size: 15px;
                }
                .entry-source {
                    margin: 0;
                    font-size: 12px;
                    color: var(--text-muted);
                }
                
                .entry-lines-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 14px;
                }
                .entry-lines-table th, .entry-lines-table td {
                    padding: 8px 15px;
                    border: none;
                }
                .entry-lines-table th {
                    background-color: #fcfcfc;
                    font-weight: 600;
                    color: #555;
                    border-bottom: 1px solid #e0e0e0;
                }
                
                .credit-line {
                    background-color: #fefefe;
                }
                .debit-line {
                    background-color: #ffffff;
                }
                .debit-col {
                    color: var(--primary-action-color);
                    font-weight: 600;
                }
                .credit-col {
                    color: var(--error-color); /* Often red or distinct for credits */
                    font-weight: 600;
                }
                
                .entry-footer {
                    display: flex;
                    justify-content: flex-end;
                    gap: 20px;
                    padding: 10px 15px;
                    background-color: #f0f3f5;
                    border-top: 2px solid var(--primary-color);
                    font-weight: 700;
                    font-size: 15px;
                }
                .total-label {
                    margin-right: auto;
                    color: #555;
                    font-weight: 500;
                }
                .total-debit {
                    color: var(--primary-action-color);
                }
                .total-credit {
                    color: var(--primary-action-color); /* Should match debit if balanced */
                }
                .balance-error {
                    color: var(--error-color);
                }
            `}</style>
        </div>
    );
};

export default TransactionJournal;