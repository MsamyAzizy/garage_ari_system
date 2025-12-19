// src/components/InventoryList.js
import React, { useState, useEffect } from 'react';
import { 
    FaEdit, FaTrash, FaEye, FaBox, FaExclamationTriangle, 
    FaCheck, FaSort, FaSortUp, FaSortDown,
    FaChevronLeft, FaChevronRight,
    FaTimes, FaExclamationCircle,
    FaWarehouse, FaTruck, FaCar, FaTag, FaInfoCircle,
    FaCalendarAlt, FaMoneyBill,FaBarcode
} from 'react-icons/fa';

// -----------------------------------------------------------------
// SPLASH LOADER COMPONENT (Same as App.js but miniaturized)
// -----------------------------------------------------------------
const SplashLoader = ({ size = 'small' }) => {
    const spinnerSize = size === 'large' ? '40px' : '30px';
    const barCount = size === 'large' ? 5 : 5;
    
    return (
        <div className="inventory-loader">
            <div className="bar-spinner-container" style={{ width: spinnerSize, height: spinnerSize }}>
                {[...Array(barCount)].map((_, i) => (
                    <div 
                        key={i} 
                        className="bar" 
                        style={{ 
                            animationDelay: `-${(barCount - i - 1) * 0.2}s`,
                            backgroundColor: '#3a3a37ff'
                        }}
                    />
                ))}
            </div>
            
            <style jsx>{`
                .inventory-loader {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    height: 200px;
                    position: relative;
                    overflow: hidden; 
                    background: transparent;
                }
                
                .bar-spinner-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .bar {
                    width: 4px;
                    height: 100%;
                    background-color: #3a3a37ff;
                    margin: 0 1.5px;
                    display: inline-block;
                    animation: bar-stretch 1s infinite ease-in-out;
                    border-radius: 2px;
                    box-shadow: 0 0 3px rgba(66, 133, 244, 0.4);
                }
                
                @keyframes bar-stretch {
                    0%, 100% { transform: scaleY(0.1); opacity: 0.5; }
                    50% { transform: scaleY(1.0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

// 🆕 Item Details View Modal Component
const ItemDetailsModal = ({ 
    isOpen, 
    onClose, 
    item
}) => {
    if (!isOpen || !item) return null;

    // Format currency to Tsh
    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return '0 Tsh';
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount)) return '0 Tsh';
        
        return new Intl.NumberFormat('en-TZ', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(numAmount) + ' Tsh';
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Calculate markup percentage
    const calculateMarkup = () => {
        if (!item.purchaseCost || item.purchaseCost === 0) return 'N/A';
        const markup = ((item.salePrice - item.purchaseCost) / item.purchaseCost) * 100;
        return `${markup.toFixed(1)}%`;
    };

    return (
        <>
            <style jsx>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2000;
                    animation: fadeIn 0.2s ease;
                    padding: 20px;
                }

                .modal-content {
                    background: white;
                    border-radius: 16px;
                    width: 90%;
                    max-width: 800px;
                    max-height: 90vh;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                    animation: slideUp 0.3s ease;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }

                .modal-header {
                    padding: 24px 32px;
                    border-bottom: 1px solid #e2e8f0;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                }

                .modal-title {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    color: #1e293b;
                }

                .modal-title h2 {
                    margin: 0;
                    font-size: 24px;
                    font-weight: 700;
                    color: #1e293b;
                }

                .item-id {
                    background: #3b82f6;
                    color: white;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .close-btn {
                    background: none;
                    border: none;
                    color: #64748b;
                    cursor: pointer;
                    padding: 10px;
                    border-radius: 8px;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .close-btn:hover {
                    background: #e2e8f0;
                    color: #1e293b;
                }

                .modal-body {
                    padding: 0;
                    overflow-y: auto;
                    flex: 1;
                }

                .modal-content-grid {
                    display: grid;
                    grid-template-columns: 300px 1fr;
                    gap: 0;
                    min-height: 500px;
                }

                /* Image Section */
                .image-section {
                    background: #f8fafc;
                    padding: 32px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    border-right: 1px solid #e2e8f0;
                }

                .item-image-container {
                    width: 250px;
                    height: 250px;
                    border-radius: 12px;
                    overflow: hidden;
                    border: 2px solid #e2e8f0;
                    background: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 24px;
                }

                .item-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .no-image {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: #94a3b8;
                    background: #f1f5f9;
                }

                .no-image-icon {
                    margin-bottom: 12px;
                }

                .stock-alert {
                    background: ${item.stockQuantity <= item.minCriticalQuantity ? '#fee2e2' : '#d1fae5'};
                    color: ${item.stockQuantity <= item.minCriticalQuantity ? '#991b1b' : '#065f46'};
                    padding: 12px 20px;
                    border-radius: 8px;
                    text-align: center;
                    width: 100%;
                    font-weight: 600;
                    margin-top: 16px;
                }

                /* Details Section */
                .details-section {
                    padding: 32px;
                }

                .section-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: #1e293b;
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding-bottom: 12px;
                    border-bottom: 2px solid #e2e8f0;
                }

                .details-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 24px;
                    margin-bottom: 32px;
                }

                .detail-item {
                    margin-bottom: 16px;
                }

                .detail-label {
                    display: block;
                    font-size: 13px;
                    color: #64748b;
                    margin-bottom: 6px;
                    font-weight: 500;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .detail-value {
                    font-size: 16px;
                    color: #1e293b;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .status-badge {
                    display: inline-block;
                    padding: 6px 16px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .status-in-stock {
                    background: #d1fae5;
                    color: #065f46;
                }

                .status-low-stock {
                    background: #fef3c7;
                    color: #92400e;
                }

                .status-out-of-stock {
                    background: #fee2e2;
                    color: #991b1b;
                }

                .currency-value {
                    color: #10b981;
                    font-weight: 700;
                }

                /* Notes Section */
                .notes-section {
                    background: #f8fafc;
                    border-radius: 8px;
                    padding: 20px;
                    margin-top: 24px;
                }

                .notes-content {
                    color: #475569;
                    line-height: 1.6;
                    font-size: 14px;
                    white-space: pre-wrap;
                }

                .empty-notes {
                    color: #94a3b8;
                    font-style: italic;
                }

                /* Metadata */
                .metadata {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 32px;
                    padding-top: 20px;
                    border-top: 1px solid #e2e8f0;
                    color: #64748b;
                    font-size: 13px;
                }

                .metadata-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .modal-footer {
                    padding: 20px 32px;
                    border-top: 1px solid #e2e8f0;
                    display: flex;
                    justify-content: flex-end;
                    gap: 12px;
                    background: #f8fafc;
                }

                .modal-btn {
                    padding: 12px 24px;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 14px;
                }

                .close-modal-btn {
                    background: #64748b;
                    color: white;
                }

                .close-modal-btn:hover {
                    background: #475569;
                }

                .edit-btn {
                    background: #3b82f6;
                    color: white;
                }

                .edit-btn:hover {
                    background: #2563eb;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slideUp {
                    from { 
                        opacity: 0; 
                        transform: translateY(20px); 
                    }
                    to { 
                        opacity: 1; 
                        transform: translateY(0); 
                    }
                }

                @media (max-width: 768px) {
                    .modal-content-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .image-section {
                        border-right: none;
                        border-bottom: 1px solid #e2e8f0;
                        padding: 24px;
                    }
                    
                    .item-image-container {
                        width: 200px;
                        height: 200px;
                    }
                    
                    .details-grid {
                        grid-template-columns: 1fr;
                        gap: 16px;
                    }
                    
                    .modal-header {
                        padding: 20px 24px;
                    }
                    
                    .details-section {
                        padding: 24px;
                    }
                    
                    .modal-footer {
                        flex-direction: column;
                    }
                    
                    .modal-btn {
                        width: 100%;
                        justify-content: center;
                    }
                }

                @media (max-width: 480px) {
                    .modal-content {
                        width: 95%;
                        margin: 0;
                    }
                    
                    .modal-title h2 {
                        font-size: 20px;
                    }
                    
                    .item-image-container {
                        width: 180px;
                        height: 180px;
                    }
                }
            `}</style>

            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <div className="modal-title">
                            <FaInfoCircle size={28} />
                            <div>
                                <h2>{item.name}</h2>
                                <div className="item-id">
                                    <FaBarcode size={10} />
                                    {item.itemNumber || 'N/A'}
                                </div>
                            </div>
                        </div>
                        <button className="close-btn" onClick={onClose}>
                            <FaTimes size={20} />
                        </button>
                    </div>
                    
                    <div className="modal-body">
                        <div className="modal-content-grid">
                            {/* Left: Image Section */}
                            <div className="image-section">
                                <div className="item-image-container">
                                    {item.itemImage ? (
                                        <img 
                                            src={item.itemImage} 
                                            alt={item.name} 
                                            className="item-image"
                                        />
                                    ) : (
                                        <div className="no-image">
                                            <FaBox size={48} className="no-image-icon" />
                                            <span>No Image Available</span>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="stock-alert">
                                    {item.stockQuantity <= item.minCriticalQuantity ? (
                                        <>
                                            <FaExclamationTriangle /> CRITICAL STOCK: {item.stockQuantity} {item.unit} remaining
                                        </>
                                    ) : (
                                        <>
                                            ✅ In Stock: {item.stockQuantity} {item.unit}
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Right: Details Section */}
                            <div className="details-section">
                                <div className="section-title">
                                    <FaInfoCircle /> Item Details
                                </div>
                                
                                <div className="details-grid">
                                    <div className="detail-item">
                                        <span className="detail-label">Category</span>
                                        <div className="detail-value">
                                            <FaTag size={14} />
                                            {item.category || 'N/A'}
                                        </div>
                                    </div>
                                    
                                    <div className="detail-item">
                                        <span className="detail-label">Status</span>
                                        <div className="detail-value">
                                            <span className={`status-badge status-${item.status?.replace(' ', '-') || 'in-stock'}`}>
                                                {item.status || 'In Stock'}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="detail-item">
                                        <span className="detail-label">Stock Quantity</span>
                                        <div className="detail-value">
                                            {item.stockQuantity || 0} {item.unit || 'pc.'}
                                        </div>
                                    </div>
                                    
                                    <div className="detail-item">
                                        <span className="detail-label">Min Critical Qty</span>
                                        <div className="detail-value">
                                            {item.minCriticalQuantity || 0}
                                        </div>
                                    </div>
                                    
                                    <div className="detail-item">
                                        <span className="detail-label">Purchase Cost</span>
                                        <div className="detail-value currency-value">
                                            <FaMoneyBill size={14} />
                                            {formatCurrency(item.purchaseCost)}
                                        </div>
                                    </div>
                                    
                                    <div className="detail-item">
                                        <span className="detail-label">Sale Price</span>
                                        <div className="detail-value currency-value">
                                            <FaMoneyBill size={14} />
                                            {formatCurrency(item.salePrice)}
                                        </div>
                                    </div>
                                    
                                    <div className="detail-item">
                                        <span className="detail-label">Markup</span>
                                        <div className="detail-value">
                                            {calculateMarkup()}
                                        </div>
                                    </div>
                                    
                                    <div className="detail-item">
                                        <span className="detail-label">Warehouse Location</span>
                                        <div className="detail-value">
                                            <FaWarehouse size={14} />
                                            {item.warehouseLocation || 'N/A'}
                                        </div>
                                    </div>
                                    
                                    <div className="detail-item">
                                        <span className="detail-label">Vendor</span>
                                        <div className="detail-value">
                                            <FaTruck size={14} />
                                            {item.vendor || 'N/A'}
                                        </div>
                                    </div>
                                    
                                    <div className="detail-item">
                                        <span className="detail-label">Vehicle Compatibility</span>
                                        <div className="detail-value">
                                            <FaCar size={14} />
                                            {item.vehicleCompatibility || 'N/A'}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Notes Section */}
                                <div className="section-title">
                                    <FaInfoCircle /> Notes
                                </div>
                                
                                <div className="notes-section">
                                    {item.notes ? (
                                        <div className="notes-content">{item.notes}</div>
                                    ) : (
                                        <div className="notes-content empty-notes">No additional notes provided.</div>
                                    )}
                                </div>
                                
                                {/* Metadata */}
                                <div className="metadata">
                                    <div className="metadata-item">
                                        <FaCalendarAlt size={12} />
                                        Created: {formatDate(item.created)}
                                    </div>
                                    <div className="metadata-item">
                                        <FaCalendarAlt size={12} />
                                        Last Updated: {formatDate(item.lastUpdated || item.created)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="modal-footer">
                        <button className="modal-btn close-modal-btn" onClick={onClose}>
                            <FaTimes /> Close
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

// 🆕 Delete Confirmation Modal Component
const DeleteConfirmationModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    itemName,
    itemNumber
}) => {
    if (!isOpen) return null;

    return (
        <>
            <style jsx>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    animation: fadeIn 0.2s ease;
                }

                .modal-content {
                    background: white;
                    border-radius: 12px;
                    width: 90%;
                    max-width: 500px;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                    animation: slideUp 0.3s ease;
                    overflow: hidden;
                }

                .modal-header {
                    padding: 20px 24px;
                    border-bottom: 1px solid #e2e8f0;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    background: #fef2f2;
                }

                .modal-title {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    color: #dc2626;
                    font-size: 18px;
                    font-weight: 600;
                }

                .close-btn {
                    background: none;
                    border: none;
                    color: #94a3b8;
                    cursor: pointer;
                    padding: 8px;
                    border-radius: 6px;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .close-btn:hover {
                    background: #fee2e2;
                    color: #dc2626;
                }

                .modal-body {
                    padding: 24px;
                }

                .warning-message {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    margin-bottom: 20px;
                }

                .warning-icon {
                    color: #dc2626;
                    flex-shrink: 0;
                    margin-top: 2px;
                }

                .warning-content h3 {
                    color: #1e293b;
                    margin-bottom: 8px;
                    font-size: 16px;
                    font-weight: 600;
                }

                .warning-content p {
                    color: #64748b;
                    line-height: 1.5;
                }

                .item-details {
                    background: #f8fafc;
                    border-radius: 8px;
                    padding: 16px;
                    margin: 20px 0;
                    border-left: 4px solid #dc2626;
                }

                .item-name {
                    color: #1e293b;
                    font-weight: 600;
                    font-size: 16px;
                    margin-bottom: 4px;
                }

                .item-number {
                    color: #64748b;
                    font-size: 14px;
                }

                .caution-note {
                    background: #fffbeb;
                    border: 1px solid #fde68a;
                    border-radius: 6px;
                    padding: 12px;
                    margin-top: 16px;
                    font-size: 13px;
                    color: #92400e;
                }

                .modal-footer {
                    padding: 20px 24px;
                    border-top: 1px solid #e2e8f0;
                    display: flex;
                    justify-content: flex-end;
                    gap: 12px;
                }

                .cancel-btn {
                    padding: 10px 20px;
                    border: 1px solid #cbd5e1;
                    background: white;
                    color: #475569;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.2s ease;
                }

                .cancel-btn:hover {
                    background: #f8fafc;
                    border-color: #94a3b8;
                }

                .delete-btn {
                    padding: 10px 20px;
                    border: none;
                    background: #dc2626;
                    color: white;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .delete-btn:hover {
                    background: #b91c1c;
                }

                .delete-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slideUp {
                    from { 
                        opacity: 0; 
                        transform: translateY(20px); 
                    }
                    to { 
                        opacity: 1; 
                        transform: translateY(0); 
                    }
                }

                @media (max-width: 480px) {
                    .modal-content {
                        width: 95%;
                        margin: 0 10px;
                    }
                    
                    .modal-footer {
                        flex-direction: column;
                    }
                    
                    .cancel-btn, .delete-btn {
                        width: 100%;
                        justify-content: center;
                    }
                }
            `}</style>

            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <div className="modal-title">
                            <FaExclamationCircle size={24} />
                            <span>Confirm Deletion</span>
                        </div>
                        <button className="close-btn" onClick={onClose}>
                            <FaTimes size={18} />
                        </button>
                    </div>
                    
                    <div className="modal-body">
                        <div className="warning-message">
                            <div className="warning-icon">
                                <FaExclamationTriangle size={24} />
                            </div>
                            <div className="warning-content">
                                <h3>Are you sure you want to delete this item?</h3>
                                <p>This action cannot be undone. The item will be permanently removed from your inventory.</p>
                            </div>
                        </div>
                        
                        <div className="item-details">
                            <div className="item-name">{itemName}</div>
                            {itemNumber && (
                                <div className="item-number">Item #: {itemNumber}</div>
                            )}
                        </div>
                        
                        <div className="caution-note">
                            <strong>Caution:</strong> This will remove all associated data including stock history and pricing information.
                        </div>
                    </div>
                    
                    <div className="modal-footer">
                        <button className="cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button className="delete-btn" onClick={onConfirm}>
                            <FaTrash size={14} />
                            Delete Item
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

const InventoryList = ({ 
    items, 
    onEdit, 
    onDelete, 
    selectedItems = [], 
    onSelect, 
    onSelectAll,
    isLoading = false,
    loadingMessage = 'Loading inventory items...',
    itemsPerPage = 10
}) => {
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        itemId: null,
        itemName: '',
        itemNumber: ''
    });
    const [viewModal, setViewModal] = useState({
        isOpen: false,
        item: null
    });

    // Calculate total pages when items change
    useEffect(() => {
        const totalPages = Math.ceil(items.length / itemsPerPage);
        setTotalPages(totalPages > 0 ? totalPages : 1);
        
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1);
        }
    }, [items, itemsPerPage, currentPage]);

    const handleSort = (key) => {
        if (isLoading) return;
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending'
        }));
    };

    const sortedItems = [...items].sort((a, b) => {
        if (!sortConfig.key) return 0;
        
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
    });

    // Get paginated items
    const getPaginatedItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return sortedItems.slice(startIndex, endIndex);
    };

    const getSortIcon = (key) => {
        if (isLoading) return null;
        if (sortConfig.key !== key) return <FaSort />;
        return sortConfig.direction === 'ascending' ? <FaSortUp /> : <FaSortDown />;
    };

    // Format currency to Tsh with comma separators
    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return '0 Tsh';
        
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount)) return '0 Tsh';
        
        // Format with comma separators for thousands
        const formatted = new Intl.NumberFormat('en-TZ', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(numAmount);
        
        return `${formatted} Tsh`;
    };

    // View details handler
    const handleViewClick = (item) => {
        setViewModal({
            isOpen: true,
            item: item
        });
    };

    const handleViewClose = () => {
        setViewModal({
            isOpen: false,
            item: null
        });
    };

    // Delete confirmation handlers
    const handleDeleteClick = (item) => {
        setDeleteModal({
            isOpen: true,
            itemId: item.id,
            itemName: item.name,
            itemNumber: item.itemNumber || 'N/A'
        });
    };

    const handleDeleteConfirm = () => {
        if (deleteModal.itemId) {
            onDelete(deleteModal.itemId);
            setDeleteModal({
                isOpen: false,
                itemId: null,
                itemName: '',
                itemNumber: ''
            });
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModal({
            isOpen: false,
            itemId: null,
            itemName: '',
            itemNumber: ''
        });
    };

    // Pagination handlers
    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const goToFirstPage = () => goToPage(1);
    const goToLastPage = () => goToPage(totalPages);
    const goToNextPage = () => goToPage(currentPage + 1);
    const goToPrevPage = () => goToPage(currentPage - 1);

    // Generate page numbers for display
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            let startPage = Math.max(2, currentPage - 1);
            let endPage = Math.min(totalPages - 1, currentPage + 1);
            
            if (currentPage <= 3) {
                startPage = 2;
                endPage = 4;
            }
            
            if (currentPage >= totalPages - 2) {
                startPage = totalPages - 3;
                endPage = totalPages - 1;
            }
            
            pages.push(1);
            
            if (startPage > 2) {
                pages.push('...');
            }
            
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }
            
            if (endPage < totalPages - 1) {
                pages.push('...');
            }
            
            if (totalPages > 1) {
                pages.push(totalPages);
            }
        }
        
        return pages;
    };

    // Show loader when loading
    if (isLoading) {
        return (
            <div className="inventory-list loading">
                <div className="table-responsive">
                    <table className="inventory-table">
                        <thead>
                            <tr>
                                <th className="checkbox-cell">
                                    <div className="select-checkbox disabled"></div>
                                </th>
                                <th>Image</th>
                                <th>
                                    <div className="sort-header">
                                        Item # 
                                    </div>
                                </th>
                                <th>
                                    <div className="sort-header">
                                        Name 
                                    </div>
                                </th>
                                <th>
                                    <div className="sort-header">
                                        Category 
                                    </div>
                                </th>
                                <th>
                                    <div className="sort-header">
                                        Stock 
                                    </div>
                                </th>
                                <th>
                                    <div className="sort-header">
                                        Status 
                                    </div>
                                </th>
                                <th>
                                    <div className="sort-header">
                                        Cost (Tsh) 
                                    </div>
                                </th>
                                <th>
                                    <div className="sort-header">
                                        Price (Tsh) 
                                    </div>
                                </th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan="10">
                                    <div className="loading-state">
                                        <SplashLoader size="large" />
                                        <p className="loading-text">{loadingMessage}</p>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <style jsx>{`
                    .inventory-list.loading .inventory-table {
                        opacity: 0.7;
                    }
                    
                    .select-checkbox.disabled {
                        opacity: 0.5;
                        cursor: not-allowed;
                    }
                    
                    .loading-state {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        padding: 60px 20px;
                        text-align: center;
                    }
                    
                    .loading-text {
                        margin-top: 16px;
                        color: #64748b;
                        font-size: 14px;
                        font-weight: 500;
                    }
                `}</style>
            </div>
        );
    }

    // Show empty state when no items
    if (items.length === 0 && !isLoading) {
        return (
            <div className="empty-state">
                <FaBox size={48} />
                <h3>No Inventory Items Found</h3>
                <p>Add your first inventory item to get started</p>
            </div>
        );
    }

    return (
        <>
            <ItemDetailsModal
                isOpen={viewModal.isOpen}
                onClose={handleViewClose}
                item={viewModal.item}
            />

            <DeleteConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                itemName={deleteModal.itemName}
                itemNumber={deleteModal.itemNumber}
            />

            <style jsx>{`
                .inventory-list {
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    border: 1px solid #e2e8f0;
                }

                .table-responsive {
                    overflow-x: auto;
                }

                .inventory-table {
                    width: 100%;
                    border-collapse: collapse;
                    min-width: 1200px;
                }

                .inventory-table th {
                    background: #f8fafc;
                    padding: 16px 20px;
                    text-align: left;
                    font-weight: 600;
                    color: #475569;
                    font-size: 14px;
                    border-bottom: 2px solid #e2e8f0;
                    cursor: pointer;
                    user-select: none;
                    white-space: nowrap;
                    transition: background-color 0.2s ease;
                }

                .inventory-table th:hover {
                    background: #f1f5f9;
                }

                .inventory-table th.disabled {
                    cursor: default;
                    opacity: 0.5;
                }

                .inventory-table th.disabled:hover {
                    background: #f8fafc;
                }

                .sort-header {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .inventory-table td {
                    padding: 16px 20px;
                    border-bottom: 1px solid #f1f5f9;
                    color: #475569;
                    vertical-align: middle;
                }

                .inventory-table tbody tr:hover {
                    background: #f8fafc;
                }

                .inventory-table tbody tr.selected {
                    background: #e0f2fe;
                }

                /* Checkbox Cell */
                .checkbox-cell {
                    width: 40px;
                    text-align: center;
                }

                .select-checkbox {
                    width: 18px;
                    height: 18px;
                    border-radius: 4px;
                    border: 2px solid #cbd5e1;
                    background: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }

                .select-checkbox:hover {
                    border-color: #94a3b8;
                }

                .select-checkbox.selected {
                    background: #3b82f6;
                    border-color: #3b82f6;
                    color: white;
                }

                .select-checkbox.disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                /* Image Cell */
                .item-thumbnail {
                    width: 50px;
                    height: 50px;
                    object-fit: cover;
                    border-radius: 8px;
                    border: 1px solid #e2e8f0;
                    transition: transform 0.2s ease;
                }

                .item-thumbnail:hover {
                    transform: scale(1.05);
                }

                .no-image-placeholder {
                    width: 50px;
                    height: 50px;
                    background: #f1f5f9;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #94a3b8;
                    transition: background-color 0.2s ease;
                }

                .no-image-placeholder:hover {
                    background: #e2e8f0;
                }

                /* Item Name */
                .item-name {
                    max-width: 250px;
                }

                .item-name strong {
                display: block;
                color: #1e293b;
                margin-bottom: 4px;
                font-weight: normal; /* ← Change this line */
}

                .item-notes {
                    font-size: 12px;
                    color: #64748b;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 200px;
                }

                /* Stock Info */
                .stock-info {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .quantity {
                    font-weight: 600;
                    color: #1e293b;
                }

                .critical-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    padding: 2px 8px;
                    background: #fee2e2;
                    color: #dc2626;
                    border-radius: 12px;
                    font-size: 11px;
                    font-weight: 600;
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }

                /* Status Badges */
                .status-badge {
                    display: inline-block;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    transition: transform 0.2s ease;
                }

                .status-badge:hover {
                    transform: translateY(-1px);
                }

                .status-in-stock {
                    background: #d1fae5;
                    color: #065f46;
                }

                .status-low-stock {
                    background: #fef3c7;
                    color: #92400e;
                }

                .status-out-of-stock {
                    background: #fee2e2;
                    color: #991b1b;
                }

                /* Price Cells */
                .cost-cell {
                    color: #64748b;
                }

                .price-cell {
                    color: #10b981;
                    font-weight: 600;
                }

                /* Action Buttons */
                .action-buttons {
                    display: flex;
                    gap: 8px;
                }

                .action-btn {
                    padding: 8px;
                    border: none;
                    border-radius: 8px;
                    background: #f8fafc;
                    color: #64748b;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .action-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }

                .action-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }

                .btn-view:hover {
                    background: #dbeafe;
                    color: #3b82f6;
                }

                .btn-edit:hover {
                    background: #fef3c7;
                    color: #f59e0b;
                }

                .btn-delete:hover {
                    background: #fee2e2;
                    color: #dc2626;
                }

                /* Empty State */
                .empty-state {
                    text-align: center;
                    padding: 60px 20px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    border: 1px solid #e2e8f0;
                    animation: fadeIn 0.5s ease;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .empty-state h3 {
                    margin: 20px 0 10px;
                    color: #1e293b;
                    font-size: 20px;
                }

                .empty-state p {
                    color: #64748b;
                    font-size: 15px;
                }

                /* Pagination Styles */
                .pagination-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px 20px;
                    background: #f8fafc;
                    border-top: 1px solid #e2e8f0;
                }

                .pagination-info {
                    font-size: 14px;
                    color: #64748b;
                }

                .pagination-controls {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .pagination-btn {
                    padding: 8px 12px;
                    border: 1px solid #cbd5e1;
                    background: white;
                    color: #475569;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    min-width: 36px;
                }

                .pagination-btn:hover:not(:disabled) {
                    background: #f1f5f9;
                    border-color: #94a3b8;
                }

                .pagination-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .pagination-btn.active {
                    background: #3b82f6;
                    color: white;
                    border-color: #3b82f6;
                }

                .page-ellipsis {
                    padding: 8px;
                    color: #94a3b8;
                    user-select: none;
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .inventory-table th,
                    .inventory-table td {
                        padding: 12px 16px;
                    }
                    
                    .action-buttons {
                        flex-direction: column;
                    }
                    
                    .item-name {
                        max-width: 200px;
                    }
                    
                    .loading-text {
                        font-size: 13px;
                    }
                    
                    /* Responsive Pagination */
                    .pagination-container {
                        flex-direction: column;
                        gap: 12px;
                        align-items: stretch;
                    }
                    
                    .pagination-controls {
                        justify-content: center;
                    }
                    
                    .pagination-info {
                        text-align: center;
                    }
                }

                @media (max-width: 480px) {
                    .pagination-controls {
                        flex-wrap: wrap;
                        justify-content: center;
                    }
                    
                    .pagination-btn {
                        padding: 6px 10px;
                        min-width: 32px;
                        font-size: 13px;
                    }
                }

                /* Skeleton Loading Effect */
                .skeleton-row {
                    animation: skeleton-loading 1.5s infinite ease-in-out;
                }

                .skeleton-cell {
                    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                    background-size: 200% 100%;
                    border-radius: 4px;
                    height: 20px;
                    margin: 5px 0;
                }

                @keyframes skeleton-loading {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>

            <div className="inventory-list">
                <div className="table-responsive">
                    <table className="inventory-table">
                        <thead>
                            <tr>
                                <th className="checkbox-cell" onClick={onSelectAll}>
                                    <div className="select-checkbox">
                                        {selectedItems.length === items.length && items.length > 0 ? (
                                            <FaCheck size={10} />
                                        ) : null}
                                    </div>
                                </th>
                                <th>Image</th>
                                <th onClick={() => handleSort('itemNumber')}>
                                    <div className="sort-header">
                                        Item # {getSortIcon('itemNumber')}
                                    </div>
                                </th>
                                <th onClick={() => handleSort('name')}>
                                    <div className="sort-header">
                                        Name {getSortIcon('name')}
                                    </div>
                                </th>
                                <th onClick={() => handleSort('category')}>
                                    <div className="sort-header">
                                        Category {getSortIcon('category')}
                                    </div>
                                </th>
                                <th onClick={() => handleSort('stockQuantity')}>
                                    <div className="sort-header">
                                        Stock {getSortIcon('stockQuantity')}
                                    </div>
                                </th>
                                <th onClick={() => handleSort('status')}>
                                    <div className="sort-header">
                                        Status {getSortIcon('status')}
                                    </div>
                                </th>
                                <th onClick={() => handleSort('purchaseCost')}>
                                    <div className="sort-header">
                                        Cost (Tsh) {getSortIcon('purchaseCost')}
                                    </div>
                                </th>
                                <th onClick={() => handleSort('salePrice')}>
                                    <div className="sort-header">
                                        Price (Tsh) {getSortIcon('salePrice')}
                                    </div>
                                </th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getPaginatedItems().map(item => (
                                <tr 
                                    key={item.id} 
                                    className={`
                                        ${item.status === 'low stock' ? 'low-stock' : ''}
                                        ${selectedItems.includes(item.id) ? 'selected' : ''}
                                    `}
                                >
                                    <td className="checkbox-cell">
                                        <div 
                                            className={`select-checkbox ${selectedItems.includes(item.id) ? 'selected' : ''}`}
                                            onClick={() => onSelect(item.id)}
                                        >
                                            {selectedItems.includes(item.id) && (
                                                <FaCheck size={10} />
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        {item.itemImage ? (
                                            <img 
                                                src={item.itemImage} 
                                                alt={item.name} 
                                                className="item-thumbnail" 
                                            />
                                        ) : (
                                            <div className="no-image-placeholder">
                                                <FaBox />
                                            </div>
                                        )}
                                    </td>
                                    <td className="item-number">
                                        <strong>{item.itemNumber || 'N/A'}</strong>
                                    </td>
                                    <td className="item-name">
                                        <strong>{item.name}</strong>
                                        {item.notes && (
                                            <div className="item-notes" title={item.notes}>
                                                {item.notes}
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        <span className="category-tag">{item.category}</span>
                                    </td>
                                    <td>
                                        <div className="stock-info">
                                            <span className="quantity">
                                                {item.stockQuantity} {item.unit}
                                            </span>
                                            {item.minCriticalQuantity > 0 && 
                                             item.stockQuantity <= item.minCriticalQuantity && (
                                                <span className="critical-badge">
                                                    <FaExclamationTriangle /> Critical
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-badge status-${item.status.replace(' ', '-')}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="cost-cell">
                                        {formatCurrency(item.purchaseCost)}
                                    </td>
                                    <td className="price-cell">
                                        <strong>
                                            {formatCurrency(item.salePrice)}
                                        </strong>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button 
                                                className="action-btn btn-view" 
                                                title="View Details"
                                                onClick={() => handleViewClick(item)}
                                            >
                                                <FaEye size={14} />
                                            </button>
                                            <button 
                                                className="action-btn btn-edit" 
                                                title="Edit Item"
                                                onClick={() => onEdit(item)}
                                            >
                                                <FaEdit size={14} />
                                            </button>
                                            <button 
                                                className="action-btn btn-delete" 
                                                title="Delete Item"
                                                onClick={() => handleDeleteClick(item)}
                                            >
                                                <FaTrash size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="pagination-container">
                        <div className="pagination-info">
                            Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
                            {Math.min(currentPage * itemsPerPage, items.length)} of{' '}
                            {items.length} items
                        </div>
                        
                        <div className="pagination-controls">
                            <button
                                className="pagination-btn"
                                onClick={goToFirstPage}
                                disabled={currentPage === 1}
                                title="First Page"
                            >
                                
                            </button>
                            
                            <button
                                className="pagination-btn"
                                onClick={goToPrevPage}
                                disabled={currentPage === 1}
                                title="Previous Page"
                            >
                                <FaChevronLeft size={12} />
                            </button>
                            
                            {getPageNumbers().map((page, index) => (
                                page === '...' ? (
                                    <span key={`ellipsis-${index}`} className="page-ellipsis">
                                        ...
                                    </span>
                                ) : (
                                    <button
                                        key={page}
                                        className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                                        onClick={() => goToPage(page)}
                                    >
                                        {page}
                                    </button>
                                )
                            ))}
                            
                            <button
                                className="pagination-btn"
                                onClick={goToNextPage}
                                disabled={currentPage === totalPages}
                                title="Next Page"
                            >
                                <FaChevronRight size={12} />
                            </button>
                            
                            <button
                                className="pagination-btn"
                                onClick={goToLastPage}
                                disabled={currentPage === totalPages}
                                title="Last Page"
                            >
                               
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default InventoryList;