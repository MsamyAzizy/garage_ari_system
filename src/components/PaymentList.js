// src/components/PaymentList.js

import React from 'react';
// Importing necessary icons for the header and actions
import { FaMoneyBillWave, FaPlusCircle, FaEye, FaEdit, FaTrash } from 'react-icons/fa'; 

// Temporary CSS for table actions is included here for easy implementation.
// It is recommended to move this to your main CSS file (e.g., App.css) later.
const actionStyles = `
/* --- CSS for the Action Icons in the Table --- */
.table-actions {
    display: flex;
    gap: 10px; /* Space out the icons */
    align-items: center;
    justify-content: flex-start; /* Align actions to the left */
}

.btn-icon-action {
    background: none;
    border: none;
    cursor: pointer;
    padding: 5px;
    font-size: 1.1rem; /* Slightly larger for visibility */
    transition: color 0.2s, opacity 0.2s;
    opacity: 0.8; /* Slightly muted by default */
}

.btn-icon-action:hover {
    opacity: 1; /* Fully visible on hover */
}

.btn-icon-action.view-action {
    color: #3498db; /* Blue */
}

.btn-icon-action.edit-action {
    color: #f39c12; /* Orange/Yellow */
}

.btn-icon-action.delete-action {
    color: #e74c3c; /* Red */
}
`;


// 🏆 FIX 1: Destructure `payments` and `onDeletePayment` from props
const PaymentList = ({ navigateTo, payments, onDeletePayment }) => {
    
    // 🛑 REMOVED: Mock Data is now passed via props from Home.js
    // const payments = [ ... ];

    // Dummy handler for demonstration
    const handleEdit = (id) => {
        console.log('Editing payment:', id);
        // navigateTo(`/payments/edit/${id}`); 
    };

    // 🛑 REMOVED: Old handleDelete is no longer needed (resolves no-unused-vars warning)
    // const handleDelete = (id) => {
    //     if (window.confirm(`Are you sure you want to delete payment ${id}?`)) {
    //         console.log('Deleting payment:', id);
    //         // Logic to delete payment goes here
    //     }
    // };
    
    // Ensure payments exists before getting length
    const paymentCount = payments ? payments.length : 0;

    return (
        <div className="list-page-container">
            {/* Inject the CSS styles */}
            <style>{actionStyles}</style> 
            
            <header className="page-header list-header">
                {/* 🏆 FIX: Use paymentCount */}
                <h2 style={{ flexGrow: 1 }}><FaMoneyBillWave style={{ marginRight: '8px' }}/> Payments Received ({paymentCount})</h2>
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
                                
                                {/* ACTIONS COLUMN: All actions on a single line */}
                                <td className="table-actions">
                                    {/* 1. View Icon */}
                                    <button 
                                        className="btn-icon-action view-action" 
                                        title="View Payment Details"
                                        onClick={() => navigateTo(`/payments/${p.id}`)}
                                    >
                                        <FaEye />
                                    </button>
                                    
                                    {/* 2. Edit Icon Button */}
                                    <button 
                                        className="btn-icon-action edit-action"
                                        title="Edit Payment"
                                        onClick={() => handleEdit(p.id)}
                                    >
                                        <FaEdit />
                                    </button>

                                    {/* 3. Delete Icon Button */}
                                    <button 
                                        className="btn-icon-action delete-action"
                                        title="Delete Payment"
                                        // This line is now correctly referencing the prop
                                        onClick={() => onDeletePayment(p.id, p.invoice)} 
                                    >
                                        <FaTrash />
                                    </button>
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