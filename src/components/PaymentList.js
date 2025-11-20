// src/components/PaymentList.js

import React from 'react';
import { FaMoneyBillWave, FaPlusCircle } from 'react-icons/fa';

const PaymentList = ({ navigateTo }) => {
    
    // Mock Data for the list
    const payments = [
        { id: 101, invoice: 'INV-2025-001', date: '2025-11-01', amount: '1,200,000 TZS', method: 'Bank Transfer', collectedBy: 'SA Jane' },
        { id: 102, invoice: 'INV-2025-003', date: '2025-11-05', amount: '450,000 TZS', method: 'Cash', collectedBy: 'SA John' },
        { id: 103, invoice: 'INV-2025-004', date: '2025-11-10', amount: '200,000 TZS', method: 'Mobile Money', collectedBy: 'SA Jane' },
    ];

    return (
        <div className="list-page-container">
            <header className="page-header list-header">
                <h2 style={{ flexGrow: 1 }}><FaMoneyBillWave style={{ marginRight: '8px' }}/> Payments Received ({payments.length})</h2>
                <button 
                    className="btn-primary-action" 
                    onClick={() => navigateTo('/payments/new')} 
                >
                    <FaPlusCircle style={{ marginRight: '5px' }} /> Record New Payment
                </button>
            </header>
            <div className="list-content-area" style={{ padding: '20px' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Invoice #</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Method</th>
                            <th>Collected By</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((p) => (
                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td>{p.invoice}</td>
                                <td>{p.date}</td>
                                <td>{p.amount}</td>
                                <td>{p.method}</td>
                                <td>{p.collectedBy}</td>
                                <td>
                                    <button className="btn-link" onClick={() => navigateTo(`/payments/${p.id}`)}>View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaymentList;