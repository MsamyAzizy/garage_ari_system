// src/components/LaborForm.js
import React, { useState } from 'react';
import { 
    FaArrowLeft, FaTimesCircle, FaEdit, FaTrash, 
   FaSort, FaSortUp, FaSortDown, FaChevronLeft, 
    FaChevronRight, FaTimes, FaCheck, FaClock,
     FaInfoCircle 
} from 'react-icons/fa';

// Labor List Component
const LaborList = ({ 
    laborItems = [], 
    onEdit, 
    onDelete, 
    selectedItems = [], 
    onSelect, 
    onSelectAll,
    isLoading = false,
    itemsPerPage = 10
}) => {
    const [sortConfig, setSortConfig] = useState({ key: 'laborTitle', direction: 'ascending' });
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        itemId: null,
        itemName: '',
        itemCode: ''
    });

    // Calculate total pages
    const totalPages = Math.ceil(laborItems.length / itemsPerPage) || 1;

    const handleSort = (key) => {
        if (isLoading) return;
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending'
        }));
    };

    const sortedItems = [...laborItems].sort((a, b) => {
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

    // Format currency
    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return '$0';
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount)) return '$0';
        
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(numAmount);
    };

    // Calculate total cost
    const calculateTotal = (rate, hours) => {
        return parseFloat(rate) * parseFloat(hours);
    };

    // Delete confirmation handlers
    const handleDeleteClick = (item) => {
        setDeleteModal({
            isOpen: true,
            itemId: item.id,
            itemName: item.laborTitle,
            itemCode: item.code || 'N/A'
        });
    };

    const handleDeleteConfirm = () => {
        if (deleteModal.itemId) {
            onDelete(deleteModal.itemId);
            setDeleteModal({
                isOpen: false,
                itemId: null,
                itemName: '',
                itemCode: ''
            });
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModal({
            isOpen: false,
            itemId: null,
            itemName: '',
            itemCode: ''
        });
    };

    // Pagination handlers
    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

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
            <div className="labor-list loading">
                <div className="table-responsive">
                    <table className="labor-table">
                        <thead>
                            <tr>
                                <th className="checkbox-cell">
                                    <div className="select-checkbox disabled"></div>
                                </th>
                                <th>Code</th>
                                <th>Labor Title</th>
                                <th>Type</th>
                                <th>Fixed Labor</th>
                                <th>Rate/Hour</th>
                                <th>Hours</th>
                                <th>Total</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan="9">
                                    <div className="loading-state">
                                        <div className="spinner"></div>
                                        <p>Loading labor items...</p>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    // Show empty state when no items
    if (laborItems.length === 0 && !isLoading) {
        return (
            <div className="empty-state">
                <FaClock size={48} />
                <h3>No Labor Items Found</h3>
                <p>Add your first labor item to get started</p>
            </div>
        );
    }

    return (
        <>
            {/* Delete Confirmation Modal */}
            {deleteModal.isOpen && (
                <div className="modal-overlay" onClick={handleDeleteCancel}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-title">
                                <FaInfoCircle size={24} />
                                <span>Confirm Deletion</span>
                            </div>
                            <button className="close-btn" onClick={handleDeleteCancel}>
                                <FaTimes size={18} />
                            </button>
                        </div>
                        
                        <div className="modal-body">
                            <div className="warning-message">
                                <div className="warning-icon">
                                    <FaInfoCircle size={24} />
                                </div>
                                <div className="warning-content">
                                    <h3>Are you sure you want to delete this labor item?</h3>
                                    <p>This action cannot be undone.</p>
                                </div>
                            </div>
                            
                            <div className="item-details">
                                <div className="item-name">{deleteModal.itemName}</div>
                                {deleteModal.itemCode && (
                                    <div className="item-code">Code: {deleteModal.itemCode}</div>
                                )}
                            </div>
                        </div>
                        
                        <div className="modal-footer">
                            <button className="cancel-btn" onClick={handleDeleteCancel}>
                                Cancel
                            </button>
                            <button className="delete-btn" onClick={handleDeleteConfirm}>
                                <FaTrash size={14} />
                                Delete Item
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="labor-list">
                <div className="table-responsive">
                    <table className="labor-table">
                        <thead>
                            <tr>
                                <th className="checkbox-cell" onClick={onSelectAll}>
                                    <div className="select-checkbox">
                                        {selectedItems.length === laborItems.length && laborItems.length > 0 ? (
                                            <FaCheck size={10} />
                                        ) : null}
                                    </div>
                                </th>
                                <th onClick={() => handleSort('code')}>
                                    <div className="sort-header">
                                        Code {getSortIcon('code')}
                                    </div>
                                </th>
                                <th onClick={() => handleSort('laborTitle')}>
                                    <div className="sort-header">
                                        Labor Title {getSortIcon('laborTitle')}
                                    </div>
                                </th>
                                <th onClick={() => handleSort('type')}>
                                    <div className="sort-header">
                                        Type {getSortIcon('type')}
                                    </div>
                                </th>
                                <th onClick={() => handleSort('isFixedLabor')}>
                                    <div className="sort-header">
                                        Fixed Labor {getSortIcon('isFixedLabor')}
                                    </div>
                                </th>
                                <th onClick={() => handleSort('rate')}>
                                    <div className="sort-header">
                                        Rate/Hour {getSortIcon('rate')}
                                    </div>
                                </th>
                                <th onClick={() => handleSort('hours')}>
                                    <div className="sort-header">
                                        Hours {getSortIcon('hours')}
                                    </div>
                                </th>
                                <th onClick={() => handleSort('total')}>
                                    <div className="sort-header">
                                        Total {getSortIcon('total')}
                                    </div>
                                </th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getPaginatedItems().map(item => (
                                <tr 
                                    key={item.id} 
                                    className={selectedItems.includes(item.id) ? 'selected' : ''}
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
                                        <strong>{item.code || 'N/A'}</strong>
                                    </td>
                                    <td>
                                        <strong>{item.laborTitle}</strong>
                                        {item.description && (
                                            <div className="item-description" title={item.description}>
                                                {item.description.substring(0, 50)}{item.description.length > 50 ? '...' : ''}
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        <span className="type-tag">{item.type || 'N/A'}</span>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${item.isFixedLabor ? 'status-active' : 'status-inactive'}`}>
                                            {item.isFixedLabor ? 'Yes' : 'No'}
                                        </span>
                                    </td>
                                    <td>
                                        {formatCurrency(item.rate)}
                                    </td>
                                    <td>
                                        {item.hours} hrs
                                    </td>
                                    <td className="total-cost">
                                        <strong>
                                            {formatCurrency(calculateTotal(item.rate, item.hours))}
                                        </strong>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button 
                                                className="action-btn btn-edit" 
                                                title="Edit Labor"
                                                onClick={() => onEdit(item)}
                                            >
                                                <FaEdit size={14} />
                                            </button>
                                            <button 
                                                className="action-btn btn-delete" 
                                                title="Delete Labor"
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
                            {Math.min(currentPage * itemsPerPage, laborItems.length)} of{' '}
                            {laborItems.length} items
                        </div>
                        
                        <div className="pagination-controls">
                            <button
                                className="pagination-btn"
                                onClick={() => goToPage(1)}
                                disabled={currentPage === 1}
                                title="First Page"
                            >
                                «
                            </button>
                            
                            <button
                                className="pagination-btn"
                                onClick={() => goToPage(currentPage - 1)}
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
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                title="Next Page"
                            >
                                <FaChevronRight size={12} />
                            </button>
                            
                            <button
                                className="pagination-btn"
                                onClick={() => goToPage(totalPages)}
                                disabled={currentPage === totalPages}
                                title="Last Page"
                            >
                                »
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

// Main LaborForm Component
const LaborForm = ({ onSave, onCancel, navigateTo, initialLaborItems = [] }) => {
    // State to manage form data
    const [formData, setFormData] = useState({
        laborTitle: '',
        description: '',
        type: '',
        code: '',
        isFixedLabor: false,
        rate: 0,
        hours: 0,
    });

    // State for labor list
    const [laborItems, setLaborItems] = useState(initialLaborItems);
    const [selectedLaborItems, setSelectedLaborItems] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' || type === 'switch' 
                ? checked : (name === 'rate' || name === 'hours' ? Number(value) : value)
        }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        
        if (!formData.laborTitle.trim()) {
            alert('Please enter a labor title');
            return;
        }

        if (formData.rate <= 0) {
            alert('Please enter a valid rate');
            return;
        }

        if (formData.hours <= 0) {
            alert('Please enter valid hours');
            return;
        }

        const newLaborItem = {
            id: isEditing ? editingId : Date.now().toString(),
            ...formData,
            createdAt: new Date().toISOString(),
            total: formData.rate * formData.hours
        };

        if (isEditing) {
            // Update existing item
            setLaborItems(prev => prev.map(item => 
                item.id === editingId ? newLaborItem : item
            ));
            setIsEditing(false);
            setEditingId(null);
        } else {
            // Add new item
            setLaborItems(prev => [...prev, newLaborItem]);
        }

        // Reset form
        setFormData({
            laborTitle: '',
            description: '',
            type: '',
            code: '',
            isFixedLabor: false,
            rate: 0,
            hours: 0,
        });

        // Call external save if provided
        if (onSave) onSave(newLaborItem);
    };

    const handleEdit = (item) => {
        setFormData({
            laborTitle: item.laborTitle,
            description: item.description,
            type: item.type,
            code: item.code,
            isFixedLabor: item.isFixedLabor,
            rate: item.rate,
            hours: item.hours,
        });
        setIsEditing(true);
        setEditingId(item.id);
    };

    const handleDelete = (itemId) => {
        setLaborItems(prev => prev.filter(item => item.id !== itemId));
        if (editingId === itemId) {
            setIsEditing(false);
            setEditingId(null);
            setFormData({
                laborTitle: '',
                description: '',
                type: '',
                code: '',
                isFixedLabor: false,
                rate: 0,
                hours: 0,
            });
        }
    };

    const handleSelect = (itemId) => {
        setSelectedLaborItems(prev => 
            prev.includes(itemId) 
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );
    };

    const handleSelectAll = () => {
        if (selectedLaborItems.length === laborItems.length) {
            setSelectedLaborItems([]);
        } else {
            setSelectedLaborItems(laborItems.map(item => item.id));
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditingId(null);
        setFormData({
            laborTitle: '',
            description: '',
            type: '',
            code: '',
            isFixedLabor: false,
            rate: 0,
            hours: 0,
        });
    };

    // Calculate total cost of all labor items
    const calculateTotalCost = () => {
        return laborItems.reduce((sum, item) => sum + (item.rate * item.hours), 0);
    };

    return (
        <div className="full-page-form">
            {/* Header Area */}
            <div className="page-header" style={{ alignItems: 'flex-start', borderBottom: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <FaArrowLeft 
                        onClick={() => navigateTo('/inventory')} 
                        style={{ cursor: 'pointer', fontSize: '1.5rem', color: 'var(--text-color)' }} 
                        title="Back to Inventory List"
                    />
                    <h2 style={{ paddingBottom: 0, borderBottom: 'none' }}>
                        {isEditing ? 'Edit Labor' : 'Add Labor'}
                    </h2>
                </div>
                
                {isEditing && (
                    <button 
                        type="button" 
                        className="btn-secondary-action"
                        onClick={handleCancelEdit}
                        style={{ marginLeft: 'auto' }}
                    >
                        Cancel Edit
                    </button>
                )}
            </div>
            
            <form onSubmit={handleSave}>
                <div className="form-card full-page-form" style={{ padding: '20px 30px' }}>
                    
                    {/* Labor Title */}
                    <div className="form-grid-1">
                        <div className="form-group">
                            <label htmlFor="laborTitle">Labor Title*</label>
                            <input
                                type="text"
                                id="laborTitle"
                                name="laborTitle"
                                value={formData.laborTitle}
                                onChange={handleChange}
                                placeholder="Enter service name"
                                required
                            />
                        </div>
                    </div>
                    
                    {/* Description */}
                    <div className="form-grid-1">
                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                rows="3"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter Description"
                            />
                        </div>
                    </div>

                    {/* Type and Code */}
                    <div className="form-grid-2">
                        <div className="form-group select-group">
                            <label htmlFor="type">Type</label>
                            <select
                                id="type"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                            >
                                <option value="">Select service type</option>
                                <option value="Mechanical">Mechanical</option>
                                <option value="Electrical">Electrical</option>
                                <option value="Body Work">Body Work</option>
                                <option value="Diagnostic">Diagnostic</option>
                                <option value="Maintenance">Maintenance</option>
                                <option value="Installation">Installation</option>
                                <option value="Repair">Repair</option>
                                <option value="Custom">Custom</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="code">Code</label>
                            <input
                                type="text"
                                id="code"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                placeholder="Enter service code"
                            />
                        </div>
                    </div>
                    
                    {/* Fixed Labor Toggle */}
                    <div className="form-grid-1" style={{ marginBottom: '20px' }}>
                        <div className="form-group flex-group">
                            <label htmlFor="isFixedLabor" style={{ flexGrow: 1 }}>Fixed Labor</label>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    id="isFixedLabor"
                                    name="isFixedLabor"
                                    checked={formData.isFixedLabor}
                                    onChange={handleChange}
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>

                    {/* Rate / Hour and Hours */}
                    <div className="form-grid-2">
                        <div className="form-group">
                            <label htmlFor="rate">Rate / Hour ($)*</label>
                            <div className="input-with-icon">
                                <input
                                    type="number"
                                    id="rate"
                                    name="rate"
                                    value={formData.rate}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    required
                                />
                                {formData.rate > 0 && (
                                    <FaTimesCircle 
                                        className="input-action-icon" 
                                        onClick={() => setFormData(prev => ({...prev, rate: 0}))}
                                        title="Clear Rate"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="hours">Hours*</label>
                            <div className="input-with-icon">
                                <input
                                    type="number"
                                    id="hours"
                                    name="hours"
                                    value={formData.hours}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.1"
                                    required
                                />
                                {formData.hours > 0 && (
                                    <FaTimesCircle 
                                        className="input-action-icon" 
                                        onClick={() => setFormData(prev => ({...prev, hours: 0}))}
                                        title="Clear Hours"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    
                </div>

                {/* Labor List Section */}
                <div className="form-section" style={{ marginTop: '30px' }}>
                    <div className="section-header">
                        <h3>Labor Items</h3>
                        <div className="total-summary">
                            <span>Total Items: {laborItems.length}</span>
                            <span>Total Cost: ${calculateTotalCost().toFixed(2)}</span>
                        </div>
                    </div>
                    
                    <LaborList
                        laborItems={laborItems}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        selectedItems={selectedLaborItems}
                        onSelect={handleSelect}
                        onSelectAll={handleSelectAll}
                    />
                </div>

                {/* Sticky Footer Actions */}
                <div className="form-actions page-form-actions">
                    <button 
                        type="submit"
                        className="btn-primary-action large-btn"
                    >
                        {isEditing ? 'Update Labor' : 'Add Labor'}
                    </button>
                    {onCancel && (
                        <button 
                            type="button" 
                            className="btn-secondary-action large-btn" 
                            onClick={onCancel} 
                            style={{ order: 0 }}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <style jsx>{`
                .full-page-form {
                    min-height: 100vh;
                    background: #f8fafc;
                    padding: 20px;
                }

                .page-header {
                    margin-bottom: 30px;
                    padding-bottom: 20px;
                    border-bottom: 2px solid #e2e8f0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .page-header h2 {
                    color: #1e293b;
                    font-size: 28px;
                    font-weight: 700;
                    margin: 0;
                }

                .form-card {
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    border: 1px solid #e2e8f0;
                    margin-bottom: 20px;
                }

                .form-grid-1, .form-grid-2 {
                    display: grid;
                    gap: 20px;
                    margin-bottom: 20px;
                }

                .form-grid-1 {
                    grid-template-columns: 1fr;
                }

                .form-grid-2 {
                    grid-template-columns: 1fr 1fr;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                }

                .form-group label {
                    margin-bottom: 8px;
                    color: #475569;
                    font-weight: 500;
                    font-size: 14px;
                }

                .form-group input,
                .form-group select,
                .form-group textarea {
                    padding: 12px;
                    border: 1px solid #cbd5e1;
                    border-radius: 8px;
                    font-size: 14px;
                    transition: all 0.2s ease;
                    width: 100%;
                    box-sizing: border-box;
                }

                .form-group input:focus,
                .form-group select:focus,
                .form-group textarea:focus {
                    outline: none;
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }

                .form-group textarea {
                    resize: vertical;
                    min-height: 80px;
                    font-family: inherit;
                }

                .select-group {
                    position: relative;
                }

                .flex-group {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 20px;
                }

                /* Switch Toggle */
                .switch {
                    position: relative;
                    display: inline-block;
                    width: 60px;
                    height: 34px;
                }

                .switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }

                .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #cbd5e1;
                    transition: .4s;
                }

                .slider:before {
                    position: absolute;
                    content: "";
                    height: 26px;
                    width: 26px;
                    left: 4px;
                    bottom: 4px;
                    background-color: white;
                    transition: .4s;
                }

                input:checked + .slider {
                    background-color: #10b981;
                }

                input:checked + .slider:before {
                    transform: translateX(26px);
                }

                .slider.round {
                    border-radius: 34px;
                }

                .slider.round:before {
                    border-radius: 50%;
                }

                /* Input with icon */
                .input-with-icon {
                    position: relative;
                }

                .input-action-icon {
                    position: absolute;
                    right: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #94a3b8;
                    cursor: pointer;
                    transition: color 0.2s ease;
                    background: none;
                    border: none;
                    padding: 0;
                    font-size: 16px;
                }

                .input-action-icon:hover {
                    color: #dc2626;
                }

                /* Form Section */
                .form-section {
                    background: white;
                    border-radius: 12px;
                    padding: 25px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    margin: 30px 0;
                }
                
                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    padding-bottom: 15px;
                    border-bottom: 2px solid #e2e8f0;
                }
                
                .section-header h3 {
                    color: #1e293b;
                    margin: 0;
                    font-size: 20px;
                    font-weight: 600;
                }
                
                .total-summary {
                    display: flex;
                    gap: 20px;
                    background: #f8fafc;
                    padding: 8px 16px;
                    border-radius: 8px;
                    border: 1px solid #e2e8f0;
                    font-size: 14px;
                    color: #475569;
                }
                
                .total-summary span {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }

                /* Form Actions */
                .form-actions {
                    position: sticky;
                    bottom: 0;
                    background: white;
                    padding: 20px;
                    border-top: 1px solid #e2e8f0;
                    display: flex;
                    justify-content: flex-end;
                    gap: 12px;
                    margin-top: 30px;
                    z-index: 100;
                }

                .large-btn {
                    padding: 14px 28px;
                    font-size: 16px;
                    font-weight: 600;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    border: none;
                }

                .btn-primary-action {
                    background: #3b82f6;
                    color: white;
                }

                .btn-primary-action:hover {
                    background: #2563eb;
                    transform: translateY(-1px);
                }

                .btn-secondary-action {
                    background: white;
                    color: #475569;
                    border: 1px solid #cbd5e1;
                }

                .btn-secondary-action:hover {
                    background: #f1f5f9;
                    border-color: #94a3b8;
                }

                /* Labor List Styles */
                .labor-list {
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    border: 1px solid #e2e8f0;
                    margin-top: 20px;
                }

                .table-responsive {
                    overflow-x: auto;
                }

                .labor-table {
                    width: 100%;
                    border-collapse: collapse;
                    min-width: 1000px;
                }

                .labor-table th {
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

                .labor-table th:hover {
                    background: #f1f5f9;
                }

                .labor-table td {
                    padding: 16px 20px;
                    border-bottom: 1px solid #f1f5f9;
                    color: #475569;
                    vertical-align: middle;
                }

                .labor-table tbody tr:hover {
                    background: #f8fafc;
                }

                .labor-table tbody tr.selected {
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

                .sort-header {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                /* Item Description */
                .item-description {
                    font-size: 12px;
                    color: #64748b;
                    margin-top: 4px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 250px;
                }

                /* Type Tag */
                .type-tag {
                    background: #e0f2fe;
                    color: #0369a1;
                    padding: 4px 12px;
                    border-radius: 16px;
                    font-size: 12px;
                    font-weight: 500;
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
                }

                .status-active {
                    background: #d1fae5;
                    color: #065f46;
                }

                .status-inactive {
                    background: #f1f5f9;
                    color: #64748b;
                }

                /* Total Cost */
                .total-cost {
                    color: #10b981;
                    font-weight: 600;
                    font-size: 15px;
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

                /* Loading State */
                .loading-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 60px 20px;
                }

                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid #f1f5f9;
                    border-top: 3px solid #3b82f6;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
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

                /* Modal Styles */
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
                }

                .modal-content {
                    background: white;
                    border-radius: 12px;
                    width: 90%;
                    max-width: 500px;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                    animation: slideUp 0.3s ease;
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

                .item-code {
                    color: #64748b;
                    font-size: 14px;
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

                /* Responsive */
                @media (max-width: 768px) {
                    .full-page-form {
                        padding: 15px;
                    }

                    .form-grid-2 {
                        grid-template-columns: 1fr;
                    }
                    
                    .form-actions {
                        flex-direction: column;
                    }
                    
                    .large-btn {
                        width: 100%;
                        padding: 12px 20px;
                    }
                    
                    .section-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 10px;
                    }
                    
                    .total-summary {
                        width: 100%;
                        justify-content: space-between;
                    }
                    
                    .labor-table th,
                    .labor-table td {
                        padding: 12px 16px;
                    }
                    
                    .action-buttons {
                        flex-direction: column;
                    }
                    
                    .pagination-container {
                        flex-direction: column;
                        gap: 12px;
                    }
                    
                    .pagination-controls {
                        flex-wrap: wrap;
                        justify-content: center;
                    }

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

                @media (max-width: 480px) {
                    .page-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 15px;
                    }
                    
                    .page-header h2 {
                        font-size: 24px;
                    }
                    
                    .form-card {
                        padding: 15px;
                    }
                    
                    .form-section {
                        padding: 15px;
                    }
                    
                    .pagination-btn {
                        padding: 6px 10px;
                        min-width: 32px;
                        font-size: 13px;
                    }
                }
            `}</style>
        </div>
    );
};

export default LaborForm;