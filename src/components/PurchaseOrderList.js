// src/components/PurchaseOrderList.js (No changes needed, already correct from previous step)

import React from 'react';
import { 
    FaShoppingCart, 
    FaPlusCircle, 
    FaEye, 
    FaEdit, 
    FaTrashAlt 
} from 'react-icons/fa';

/**
 * Displays a list of Purchase Orders with options to view details, edit, delete, and create a new one.
 * @param {object} props - Component props.
 * @param {function} props.navigateTo - Function to handle routing.
 * @param {Array<object>} props.purchaseOrders - The list of PO data.
 * @param {function} props.onDeletePO - Handler for deleting a Purchase Order (to trigger modal).
 */
const PurchaseOrderList = ({ navigateTo, purchaseOrders, onDeletePO }) => {
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
                                <th className="action-column-header">Actions</th> 
                            </tr>
                        </thead>
                        <tbody>
                            {purchaseOrders.map((po) => (
                                <tr key={po.poId || po.poNo}> 
                                    <td>{po.poNo}</td>
                                    <td>{po.supplierName}</td>
                                    <td>{po.poDate}</td>
                                    <td>{po.expectedDeliveryDate}</td>
                                    <td>{po.status}</td>
                                    <td>{po.currency} {po.grandTotalAmount.toFixed(2)}</td>
                                    
                                    <td className="action-column-cell icon-action-container">
                                        
                                        <button 
                                            className="icon-action view" 
                                            onClick={() => navigateTo(`/purchase-orders/${po.poId}`)}
                                            title="View Details"
                                        >
                                            <FaEye />
                                        </button>
                                        
                                        <button 
                                            className="icon-action edit" 
                                            onClick={() => navigateTo(`/purchase-orders/${po.poId}/edit`)}
                                            title="Edit Purchase Order"
                                        >
                                            <FaEdit />
                                        </button>
                                        
                                        <button 
                                            className="icon-action delete" 
                                            // 🛑 This now calls the handler passed from Home.js, triggering the modal
                                            onClick={() => onDeletePO && onDeletePO(po.poId, po.poNo)} 
                                            title="Delete Purchase Order"
                                        >
                                            <FaTrashAlt />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            
            <style jsx>{`
                .icon-action-container {
                    display: flex;
                    gap: 5px;
                    justify-content: center;
                }
                .icon-action {
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 5px;
                    border-radius: 4px;
                    transition: background-color 0.2s, color 0.2s;
                    font-size: 1.1rem;
                    line-height: 1; 
                }
                .icon-action.view { color: #3498db; }
                .icon-action.edit { color: #f39c12; }
                .icon-action.delete { color: #e74c3c; }
                .icon-action:hover {
                    background-color: rgba(0, 0, 0, 0.1);
                }
                .action-column-cell {
                    text-align: center !important; 
                    width: 150px; 
                }
            `}</style>
        </div>
    );
};

export default PurchaseOrderList;