// src/components/PurchaseOrderList.js

import React from 'react';
import { FaShoppingCart, FaPlusCircle } from 'react-icons/fa';

/**
 * Displays a list of Purchase Orders with options to view details and create a new one.
 * @param {object} props - Component props.
 * @param {function} props.navigateTo - Function to handle routing.
 * @param {Array<object>} props.purchaseOrders - The list of PO data.
 */
const PurchaseOrderList = ({ navigateTo, purchaseOrders }) => {
    return (
        <div className="list-page-container">
            <header className="page-header po-list-header">
                <h2 style={{ flexGrow: 1 }}>
                    <FaShoppingCart style={{ marginRight: '8px' }}/> 
                    Purchase Orders ({purchaseOrders.length})
                </h2>
                <button 
                    className="btn-primary-action" 
                    onClick={() => navigateTo('/purchase-orders/new')} 
                    style={{ marginLeft: 'auto' }} 
                >
                    <FaPlusCircle style={{ marginRight: '5px' }} /> Create New PO
                </button>
            </header>
            <div className="list-content-area" style={{ padding: '20px' }}>
                
                {purchaseOrders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                        <p>No purchase orders have been created.</p>
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>PO No.</th>
                                <th>Supplier</th>
                                <th>Date</th>
                                <th>Delivery Date</th>
                                <th>Status</th>
                                <th>Total</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {purchaseOrders.map((po, index) => (
                                <tr key={index}>
                                    <td>{po.poNo}</td>
                                    <td>{po.supplierName}</td>
                                    <td>{po.poDate}</td>
                                    <td>{po.expectedDeliveryDate}</td>
                                    <td>{po.status}</td>
                                    <td>{po.currency} {po.grandTotalAmount.toFixed(2)}</td>
                                    <td>
                                        <button 
                                            className="btn-link" 
                                            onClick={() => navigateTo(`/purchase-orders/${po.poId}`)}
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default PurchaseOrderList;