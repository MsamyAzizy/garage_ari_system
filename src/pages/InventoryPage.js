// src/pages/InventoryPage.js
import React, { useState, useEffect } from 'react';
import InventoryForm from '../components/InventoryForm';
import InventoryList from '../components/InventoryList';
import { 
    FaPlus, 
    FaSearch, 
    FaFilter, 
    FaDownload, 
    FaPrint, 
    //FaRefresh,
    FaBarcode,
    FaChartBar,
    FaBell,
    //FaEye,
    //FaEdit,
    FaTrash,
    FaTimes,
    FaCheck
} from 'react-icons/fa';

const InventoryPage = () => {
    const [inventoryItems, setInventoryItems] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [selectedItems, setSelectedItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState(null);

    // Load initial data
    useEffect(() => {
        loadInventoryData();
    }, []);

    const loadInventoryData = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            const savedItems = localStorage.getItem('inventoryItems');
            if (savedItems) {
                setInventoryItems(JSON.parse(savedItems));
            } else {
                // Sample data
                const sampleItems = [
                    {
                        id: 1,
                        itemNumber: 'BRK-001',
                        name: 'Brake Pads Set',
                        category: 'Brakes',
                        stockQuantity: 15,
                        unit: 'set',
                        purchaseCost: 45.00,
                        salePrice: 89.99,
                        status: 'in stock',
                        minCriticalQuantity: 5,
                        warehouseLocation: 'Main Warehouse',
                        vendor: 'AutoZone',
                        vehicleCompatibility: 'Toyota Camry 2015-2020',
                        notes: 'Premium ceramic brake pads',
                        itemImage: null,
                        created: '2024-01-15T10:30:00Z',
                        lastUpdated: '2024-01-15T10:30:00Z'
                    },
                    {
                        id: 2,
                        itemNumber: 'OIL-002',
                        name: 'Synthetic Engine Oil 5W-30',
                        category: 'Engine',
                        stockQuantity: 3,
                        unit: 'l',
                        purchaseCost: 8.50,
                        salePrice: 14.99,
                        status: 'low stock',
                        minCriticalQuantity: 5,
                        warehouseLocation: 'Shop Shelf A',
                        vendor: 'NAPA',
                        vehicleCompatibility: 'Most 4-cylinder engines',
                        notes: 'Full synthetic, 1L bottles',
                        itemImage: null,
                        created: '2024-01-10T14:20:00Z',
                        lastUpdated: '2024-01-12T09:15:00Z'
                    },
                    {
                        id: 3,
                        itemNumber: 'FIL-003',
                        name: 'Oil Filter',
                        category: 'Engine',
                        stockQuantity: 0,
                        unit: 'pc.',
                        purchaseCost: 6.00,
                        salePrice: 12.50,
                        status: 'out of stock',
                        minCriticalQuantity: 10,
                        warehouseLocation: 'Main Warehouse',
                        vendor: 'OReilly',
                        vehicleCompatibility: 'Honda Civic 2010-2015',
                        notes: 'Needs restock urgently',
                        itemImage: null,
                        created: '2024-01-05T11:45:00Z',
                        lastUpdated: '2024-01-18T16:30:00Z'
                    },
                    {
                        id: 4,
                        itemNumber: 'SPK-004',
                        name: 'Spark Plugs',
                        category: 'Engine',
                        stockQuantity: 25,
                        unit: 'pc.',
                        purchaseCost: 4.50,
                        salePrice: 9.99,
                        status: 'in stock',
                        minCriticalQuantity: 10,
                        warehouseLocation: 'Shop Shelf B',
                        vendor: 'Dealership',
                        vehicleCompatibility: 'Ford F-150 2018-2023',
                        notes: 'Iridium tipped',
                        itemImage: null,
                        created: '2024-01-20T08:45:00Z',
                        lastUpdated: '2024-01-20T08:45:00Z'
                    },
                    {
                        id: 5,
                        itemNumber: 'BAT-005',
                        name: 'Car Battery',
                        category: 'Electrical',
                        stockQuantity: 8,
                        unit: 'pc.',
                        purchaseCost: 85.00,
                        salePrice: 149.99,
                        status: 'in stock',
                        minCriticalQuantity: 3,
                        warehouseLocation: 'Storage Room',
                        vendor: 'Local Supplier',
                        vehicleCompatibility: 'Most vehicles',
                        notes: '12V, 650 CCA',
                        itemImage: null,
                        created: '2024-01-22T13:20:00Z',
                        lastUpdated: '2024-01-22T13:20:00Z'
                    }
                ];
                setInventoryItems(sampleItems);
                localStorage.setItem('inventoryItems', JSON.stringify(sampleItems));
            }
            setIsLoading(false);
        }, 500);
    };

    // Save items to localStorage
    useEffect(() => {
        if (inventoryItems.length > 0) {
            localStorage.setItem('inventoryItems', JSON.stringify(inventoryItems));
        }
    }, [inventoryItems]);

    const handleSave = (itemData) => {
        if (editingItem) {
            // Update existing item
            setInventoryItems(prev => 
                prev.map(item => 
                    item.id === editingItem.id 
                        ? { 
                            ...itemData, 
                            id: editingItem.id, 
                            lastUpdated: new Date().toISOString(),
                            created: item.created
                        }
                        : item
                )
            );
            setNotification({
                type: 'success',
                message: 'Item updated successfully!'
            });
            setEditingItem(null);
        } else {
            // Add new item
            const newItem = {
                ...itemData,
                id: Date.now(),
                created: new Date().toISOString(),
                lastUpdated: new Date().toISOString()
            };
            
            setInventoryItems(prev => [...prev, newItem]);
            setNotification({
                type: 'success',
                message: 'Item added successfully!'
            });
        }
        
        setShowForm(false);
        
        // Clear notification after 3 seconds
        setTimeout(() => setNotification(null), 3000);
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingItem(null);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            setInventoryItems(prev => prev.filter(item => item.id !== id));
            setNotification({
                type: 'success',
                message: 'Item deleted successfully!'
            });
            setTimeout(() => setNotification(null), 3000);
        }
    };

    const handleDeleteSelected = () => {
        if (selectedItems.length === 0) return;
        
        if (window.confirm(`Delete ${selectedItems.length} selected item(s)?`)) {
            setInventoryItems(prev => 
                prev.filter(item => !selectedItems.includes(item.id))
            );
            setSelectedItems([]);
            setNotification({
                type: 'success',
                message: `${selectedItems.length} item(s) deleted successfully!`
            });
            setTimeout(() => setNotification(null), 3000);
        }
    };

    const toggleSelectItem = (id) => {
        setSelectedItems(prev => 
            prev.includes(id) 
                ? prev.filter(itemId => itemId !== id)
                : [...prev, id]
        );
    };

    const selectAllItems = () => {
        if (selectedItems.length === filteredItems.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(filteredItems.map(item => item.id));
        }
    };

    // Filter items based on search and filters
    const filteredItems = inventoryItems.filter(item => {
        const matchesSearch = 
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.itemNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.vendor && item.vendor.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    // Calculate statistics
    const totalItems = inventoryItems.length;
    const totalValue = inventoryItems.reduce((sum, item) => 
        sum + (item.purchaseCost * item.stockQuantity), 0
    ).toFixed(2);
    
    const lowStockItems = inventoryItems.filter(item => 
        item.status === 'low stock'
    ).length;
    
    const outOfStockItems = inventoryItems.filter(item => 
        item.status === 'out of stock'
    ).length;

    // Get unique categories for filter
    const categories = [...new Set(inventoryItems.map(item => item.category))];

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading inventory...</p>
            </div>
        );
    }

    return (
        <div className="inventory-page">
            <style jsx>{`
                /* ----------------------------------------------------------------- */
                /* INVENTORY PAGE STYLES */
                /* ----------------------------------------------------------------- */
                .inventory-page {
                    min-height: 100vh;
                    background: #f8fafc;
                    padding: 24px;
                }

                /* Header */
                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                    padding-bottom: 20px;
                    border-bottom: 2px solid #e2e8f0;
                }

                .page-header h1 {
                    font-size: 32px;
                    font-weight: 700;
                    color: #1e293b;
                    margin: 0;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .header-actions {
                    display: flex;
                    gap: 12px;
                }

                .btn-primary, .btn-secondary, .btn-danger {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 24px;
                    border: none;
                    border-radius: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 15px;
                }

                .btn-primary {
                    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                    color: white;
                    box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);
                }

                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 12px rgba(59, 130, 246, 0.4);
                }

                .btn-secondary {
                    background: #64748b;
                    color: white;
                }

                .btn-secondary:hover {
                    background: #475569;
                    transform: translateY(-2px);
                }

                .btn-danger {
                    background: #ef4444;
                    color: white;
                }

                .btn-danger:hover {
                    background: #dc2626;
                    transform: translateY(-2px);
                }

                /* Stats Cards */
                .stats-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                }

                .stat-card {
                    background: white;
                    border-radius: 12px;
                    padding: 20px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
                    border: 1px solid #e2e8f0;
                    transition: transform 0.3s ease;
                }

                .stat-card:hover {
                    transform: translateY(-4px);
                }

                .stat-card.total { border-top: 4px solid #3b82f6; }
                .stat-card.value { border-top: 4px solid #10b981; }
                .stat-card.low { border-top: 4px solid #f59e0b; }
                .stat-card.out { border-top: 4px solid #ef4444; }

                .stat-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 12px;
                }

                .stat-icon {
                    font-size: 24px;
                    padding: 12px;
                    border-radius: 10px;
                }

                .stat-icon.total { background: #dbeafe; color: #3b82f6; }
                .stat-icon.value { background: #d1fae5; color: #10b981; }
                .stat-icon.low { background: #fef3c7; color: #f59e0b; }
                .stat-icon.out { background: #fee2e2; color: #ef4444; }

                .stat-title {
                    font-size: 14px;
                    color: #64748b;
                    font-weight: 500;
                }

                .stat-value {
                    font-size: 24px;
                    font-weight: 700;
                    color: #1e293b;
                }

                .stat-subtext {
                    font-size: 12px;
                    color: #94a3b8;
                    margin-top: 4px;
                }

                /* Controls Bar */
                .controls-bar {
                    background: white;
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 24px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
                    border: 1px solid #e2e8f0;
                }

                .controls-grid {
                    display: grid;
                    grid-template-columns: 1fr auto auto auto;
                    gap: 20px;
                    align-items: center;
                }

                @media (max-width: 1024px) {
                    .controls-grid {
                        grid-template-columns: 1fr;
                    }
                }

                .search-box {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 16px;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                }

                .search-input {
                    flex: 1;
                    background: transparent;
                    border: none;
                    outline: none;
                    font-size: 15px;
                    color: #1e293b;
                }

                .search-input::placeholder {
                    color: #94a3b8;
                }

                .filter-group {
                    display: flex;
                    gap: 12px;
                }

                .filter-select {
                    padding: 12px 16px;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    background: white;
                    color: #1e293b;
                    font-size: 14px;
                    min-width: 140px;
                    cursor: pointer;
                }

                /* Batch Actions */
                .batch-actions {
                    display: flex;
                    gap: 12px;
                    align-items: center;
                    background: #f1f5f9;
                    padding: 16px 20px;
                    border-radius: 12px;
                    margin-bottom: 20px;
                }

                .batch-count {
                    font-weight: 600;
                    color: #475569;
                }

                /* Notification */
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 16px 24px;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                    z-index: 1000;
                    animation: slideIn 0.3s ease-out;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    max-width: 400px;
                }

                .notification.success {
                    background: #10b981;
                    color: white;
                }

                .notification.error {
                    background: #ef4444;
                    color: white;
                }

                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                .notification-close {
                    background: transparent;
                    border: none;
                    color: inherit;
                    cursor: pointer;
                    font-size: 20px;
                    margin-left: auto;
                }

                /* Loading State */
                .loading-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 400px;
                }

                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid #e2e8f0;
                    border-top-color: #3b82f6;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 16px;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .inventory-page {
                        padding: 16px;
                    }
                    
                    .page-header {
                        flex-direction: column;
                        gap: 16px;
                        align-items: flex-start;
                    }
                    
                    .header-actions {
                        width: 100%;
                        flex-direction: column;
                    }
                    
                    .header-actions button {
                        width: 100%;
                        justify-content: center;
                    }
                    
                    .stats-container {
                        grid-template-columns: 1fr;
                    }
                    
                    .filter-group {
                        flex-direction: column;
                    }
                    
                    .filter-select {
                        min-width: 100%;
                    }
                    
                    .batch-actions {
                        flex-direction: column;
                        align-items: stretch;
                    }
                    
                    .batch-actions button {
                        width: 100%;
                        justify-content: center;
                    }
                }
            `}</style>

            {/* Notification */}
            {notification && (
                <div className={`notification ${notification.type}`}>
                    {notification.type === 'success' ? <FaCheck /> : <FaTimes />}
                    <span>{notification.message}</span>
                    <button 
                        className="notification-close"
                        onClick={() => setNotification(null)}
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Header */}
            <header className="page-header">
                <h1>
                     Inventory Management
                </h1>
                <div className="header-actions">
                    <button className="btn-secondary">
                        <FaDownload /> Export
                    </button>
                    <button className="btn-secondary">
                        <FaPrint /> Print
                    </button>
                    <button 
                        className="btn-primary"
                        onClick={() => {
                            setEditingItem(null);
                            setShowForm(true);
                        }}
                    >
                        <FaPlus /> Add New Item
                    </button>
                </div>
            </header>

            {/* Stats Cards */}
            <div className="stats-container">
                <div className="stat-card total">
                    <div className="stat-header">
                        <div>
                            <div className="stat-title">Total Items</div>
                            <div className="stat-value">{totalItems}</div>
                        </div>
                        <div className="stat-icon total">
                          
                        </div>
                    </div>
                    <div className="stat-subtext">Across all categories</div>
                </div>

                <div className="stat-card value">
                    <div className="stat-header">
                        <div>
                            <div className="stat-title">Total Value</div>
                            <div className="stat-value">Tsh{totalValue}</div>
                        </div>
                        <div className="stat-icon value">
                            <FaChartBar />
                        </div>
                    </div>
                    <div className="stat-subtext">At purchase cost</div>
                </div>

                <div className="stat-card low">
                    <div className="stat-header">
                        <div>
                            <div className="stat-title">Low Stock</div>
                            <div className="stat-value">{lowStockItems}</div>
                        </div>
                        <div className="stat-icon low">
                            <FaBell />
                        </div>
                    </div>
                    <div className="stat-subtext">Needs attention</div>
                </div>

                <div className="stat-card out">
                    <div className="stat-header">
                        <div>
                            <div className="stat-title">Out of Stock</div>
                            <div className="stat-value">{outOfStockItems}</div>
                        </div>
                        <div className="stat-icon out">
                            
                        </div>
                    </div>
                    <div className="stat-subtext">Requires restocking</div>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="controls-bar">
                <div className="controls-grid">
                    <div className="search-box">
                        <FaSearch />
                        <input
                            type="text"
                            placeholder="Search items by name, number, category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    <div className="filter-group">
                        <select 
                            className="filter-select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="in stock">In Stock</option>
                            <option value="low stock">Low Stock</option>
                            <option value="out of stock">Out of Stock</option>
                        </select>

                        <select 
                            className="filter-select"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="all">All Categories</option>
                            {categories.map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button 
                        className="btn-secondary"
                        onClick={loadInventoryData}
                    >
                        Refresh
                    </button>

                    <button className="btn-secondary">
                        <FaFilter /> Advanced Filter
                    </button>
                </div>
            </div>

            {/* Batch Actions */}
            {selectedItems.length > 0 && (
                <div className="batch-actions">
                    <span className="batch-count">
                        {selectedItems.length} item(s) selected
                    </span>
                    <button className="btn-secondary">
                        <FaBarcode /> Print Labels
                    </button>
                    <button 
                        className="btn-danger"
                        onClick={handleDeleteSelected}
                    >
                        <FaTrash /> Delete Selected
                    </button>
                    <button 
                        className="btn-secondary"
                        onClick={() => setSelectedItems([])}
                    >
                        Clear Selection
                    </button>
                </div>
            )}

            {/* Main Content */}
            {showForm ? (
                <InventoryForm 
                    onSave={handleSave} 
                    onCancel={handleCancel} 
                    initialData={editingItem}
                    isEditing={!!editingItem}
                />
            ) : (
                <InventoryList 
                    items={filteredItems}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    selectedItems={selectedItems}
                    onSelect={toggleSelectItem}
                    onSelectAll={selectAllItems}
                />
            )}
        </div>
    );
};

export default InventoryPage;