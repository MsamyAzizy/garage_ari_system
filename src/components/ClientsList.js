import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
    FaUserFriends, 
    FaPlusCircle, 
    FaTimes, 
    FaClipboardList, 
    FaSpinner, 
    FaChevronLeft, 
    FaChevronRight,
    FaArrowLeft, 
    FaCheckCircle, 
    FaExclamationTriangle, 
    FaEdit, 
    FaTrashAlt, 
    FaEye,
    FaFileImport, 
    FaFileExport,
    //FaSearch,
    FaBuilding,
    FaUser,
    FaMapMarkerAlt,
    FaPhone,
    FaEnvelope
} from 'react-icons/fa'; 
import { useNavigate, useLocation } from 'react-router-dom'; 

import apiClient from '../utils/apiClient'; 

// Modern color palette
const COLORS = {
    primary: '#d16a33',
    primaryDark: '#b3592b',
    secondary: '#5d9cec',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    dark: '#1f2937',
    light: '#f8fafc',
    white: '#ffffff',
    gray: {
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827'
    }
};

const ITEMS_PER_PAGE = 10;

// Enhanced SearchBar component with search icon
const SearchBar = ({ onSearch, initialTerm = '', placeholder = "Search clients..." }) => {
    const [searchTerm, setSearchTerm] = useState(initialTerm);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(searchTerm);
    };

    const handleClear = () => {
        setSearchTerm('');
        onSearch('');
    };

    return (
        <form className="search-bar" onSubmit={handleSubmit}>
            <div className="search-input-container">
                {/*<FaSearch className="search-icon" />*/}
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={placeholder}
                    className="search-input"
                />
                {searchTerm && (
                    <button type="button" className="clear-search" onClick={handleClear}>
                        <FaTimes />
                    </button>
                )}
            </div>
            <button type="submit" className="search-btn">
                Search
            </button>
        </form>
    );
};

// Enhanced Pagination Control
const PaginationControl = ({ currentPage, totalPages, totalItems, onPageChange }) => {
    if (totalPages <= 1 && totalItems <= ITEMS_PER_PAGE) return null;

    const startRange = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    let endRange = startRange + ITEMS_PER_PAGE - 1;
    if (endRange > totalItems) endRange = totalItems;

    const generatePageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            let start = Math.max(1, currentPage - 2);
            let end = Math.min(totalPages, currentPage + 2);
            
            if (currentPage <= 3) {
                end = maxVisible;
            } else if (currentPage >= totalPages - 2) {
                start = totalPages - maxVisible + 1;
            }
            
            for (let i = start; i <= end; i++) pages.push(i);
        }
        return pages;
    };

    const handlePageClick = (page, event) => {
        event.preventDefault();
        if (page > 0 && page <= totalPages && page !== currentPage) {
            onPageChange(page);
        }
    };

    return (
        <div className="pagination-container">
            <div className="pagination-info">
                <span className="pagination-text">
                    Showing <strong>{startRange}-{endRange}</strong> of <strong>{totalItems}</strong> clients
                </span>
            </div>
            
            <div className="pagination-controls">
                <button
                    onClick={(e) => handlePageClick(currentPage - 1, e)}
                    disabled={currentPage === 1}
                    className="pagination-btn pagination-prev"
                >
                    <FaChevronLeft size={12} />
                    <span>Previous</span>
                </button>

                <div className="pagination-numbers">
                    {generatePageNumbers().map(number => (
                        <button
                            key={number}
                            onClick={(e) => handlePageClick(number, e)}
                            className={`pagination-btn ${number === currentPage ? 'active' : ''}`}
                        >
                            {number}
                        </button>
                    ))}
                </div>

                <button
                    onClick={(e) => handlePageClick(currentPage + 1, e)}
                    disabled={currentPage === totalPages}
                    className="pagination-btn pagination-next"
                >
                    <span>Next</span>
                    <FaChevronRight size={12} />
                </button>
            </div>
        </div>
    );
};

// Client Card Component for Grid View
const ClientCard = ({ client, onEdit, onView, onDelete, getClientName }) => {
    const clientName = getClientName(client);
    const isCompany = client.client_type === 'Company';

    return (
        <div className="client-card">
            <div className="client-card-header">
                <div className="client-avatar">
                    {isCompany ? <FaBuilding /> : <FaUser />}
                </div>
                <div className="client-info">
                    <h3 className="client-name">{clientName}</h3>
                    <span className={`client-type ${client.client_type?.toLowerCase()}`}>
                        {client.client_type || 'Individual'}
                    </span>
                </div>
            </div>

            <div className="client-details">
                <div className="detail-item">
                    <FaEnvelope className="detail-icon" />
                    <span className="detail-text">{client.email || '—'}</span>
                </div>
                <div className="detail-item">
                    <FaPhone className="detail-icon" />
                    <span className="detail-text">{client.phone_number || '—'}</span>
                </div>
                {client.address && (
                    <div className="detail-item">
                        <FaMapMarkerAlt className="detail-icon" />
                        <span className="detail-text">{client.address}</span>
                    </div>
                )}
                {client.tax_id && (
                    <div className="detail-item">
                        <span className="detail-label">Tax ID:</span>
                        <span className="detail-text">{client.tax_id}</span>
                    </div>
                )}
            </div>

            {client.notes && (
                <div className="client-notes">
                    <FaClipboardList className="notes-icon" />
                    <span className="notes-text">{client.notes}</span>
                </div>
            )}

            <div className="client-actions">
                <button 
                    className="action-btn view-btn"
                    onClick={() => onView(client.id)}
                    title="View Client"
                >
                    <FaEye size={14} />
                </button>
                <button 
                    className="action-btn edit-btn"
                    onClick={() => onEdit(client.id)}
                    title="Edit Client"
                >
                    <FaEdit size={14} />
                </button>
                <button 
                    className="action-btn delete-btn"
                    onClick={() => onDelete(client)}
                    title="Delete Client"
                >
                    <FaTrashAlt size={14} />
                </button>
            </div>
        </div>
    );
};

// Updated No Results Popup Component with modern design
const NoResultsPopup = ({ searchTerm, onClearSearch, onAddNew }) => {
    return (
        <div className="no-results-popup">
            <div className="popup-content">
                <div className="popup-icon">
                    <FaUserFriends />
                </div>
                <h3>No Clients Found</h3>
                <p className="popup-message">
                    No clients match <strong>"{searchTerm}"</strong>. Try adjusting your search.
                </p>
                <div className="popup-actions">
                    <button className="popup-btn secondary" onClick={onClearSearch}>
                        Clear Search
                    </button>
                    <button className="popup-btn primary" onClick={onAddNew}>
                        <FaPlusCircle />
                        Add New Client
                    </button>
                </div>
            </div>
        </div>
    );
};

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    clientName, 
    isDeleting 
}) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-content">
                    <div className="modal-icon">
                        <FaExclamationTriangle />
                    </div>
                    <h3 className="modal-title">Delete chat?</h3>
                    <p className="modal-message">
                        Are you sure you want to delete this chat?
                    </p>
                    <div className="modal-actions">
                        <button 
                            className="modal-btn cancel-btn" 
                            onClick={onClose}
                            disabled={isDeleting}
                        >
                            Cancel
                        </button>
                        <button 
                            className="modal-btn delete-btn" 
                            onClick={onConfirm}
                            disabled={isDeleting}
                        >
                            {isDeleting ? <FaSpinner className="spin" /> : 'Delete'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main ClientsList Component
const ClientsList = () => {
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    
    // State management
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalClients, setTotalClients] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
    
    // Modal and notification states
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [clientToDelete, setClientToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const [isImporting, setIsImporting] = useState(false);

    // Helper functions
    const getClientName = (client) => {
        if (!client) return '';
        if (client.client_type === 'Company' && client.company_name) {
            return client.company_name;
        }
        return (client.full_name || `${client.first_name || ''} ${client.last_name || ''}`).trim();
    };

    const truncateNotes = (notes, maxLength = 50) => {
        if (!notes) return '—';
        const cleanedNotes = String(notes).replace(/<[^>]*>?/gm, '');
        return cleanedNotes.length > maxLength 
            ? cleanedNotes.substring(0, maxLength) + '...'
            : cleanedNotes;
    };

    const showToastNotification = useCallback((message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 4000);
    }, []);

    // Data fetching
    const fetchClients = useCallback(async (currentSearchTerm, page = 1) => {
        setLoading(true);
        setError(null);
        
        let apiUrl = `/clients/?page=${page}`;
        if (currentSearchTerm) {
            apiUrl += `&search=${encodeURIComponent(currentSearchTerm)}`;
        }

        try {
            const response = await apiClient.get(apiUrl);
            const receivedData = response.data;
            
            let clientArray = [];
            let total = 0;
            let totalP = 1;

            if (receivedData && Array.isArray(receivedData.results)) {
                clientArray = receivedData.results;
                total = receivedData.count || 0;
                totalP = Math.ceil(total / ITEMS_PER_PAGE) || 1;
            } else if (Array.isArray(receivedData)) {
                clientArray = receivedData;
                total = receivedData.length;
                totalP = 1;
            }
            
            setClients(clientArray);
            setTotalClients(total);
            setTotalPages(totalP);
            setCurrentPage(page);

        } catch (err) {
            setError("Failed to load client data. Please check your backend API status or network connection.");
            console.error("Client fetch error:", err.response ? err.response.data : err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Event handlers
    const handleSearch = useCallback((term) => {
        setSearchTerm(term);
        fetchClients(term, 1);
    }, [fetchClients]);

    const handleClearSearch = useCallback(() => {
        setSearchTerm('');
        fetchClients('', 1);
    }, [fetchClients]);

    const handlePageChange = useCallback((newPage) => {
        fetchClients(searchTerm, newPage);
    }, [fetchClients, searchTerm]);

    const handleImport = useCallback(() => {
        if (!isImporting) {
            fileInputRef.current.click();
        } else {
            showToastNotification('An import is already in progress.', 'info');
        }
    }, [isImporting, showToastNotification]);

    const handleFileSelection = useCallback(async (event) => {
        const file = event.target.files[0];
        if (!file) {
            event.target.value = null;
            return;
        }

        setIsImporting(true);
        showToastNotification(`Processing file **${file.name}**...`, 'info');
        
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            await apiClient.post('/clients/import/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            
            showToastNotification(`Client data successfully imported from **${file.name}**!`, 'success');
            await fetchClients(searchTerm, currentPage);

        } catch (err) {
            const errorMsg = err.response?.data?.detail || err.response?.data?.error || 'Unknown error occurred.';
            showToastNotification(`Failed to import client data: ${errorMsg}`, 'error');
        } finally {
            setIsImporting(false);
            event.target.value = null;
        }
    }, [showToastNotification, fetchClients, searchTerm, currentPage]);

    const handleExport = useCallback(async () => {
        try {
            const response = await apiClient.get('/clients/export/', {
                responseType: 'blob',
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `clients_export_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            showToastNotification('Client data export started successfully!', 'success');

        } catch (err) {
            showToastNotification('Failed to export client data. Please try again.', 'error');
        }
    }, [showToastNotification]);

    const prepareDelete = useCallback((client) => {
        setClientToDelete(client);
        setShowDeleteModal(true);
    }, []);

    const executeDelete = useCallback(async () => {
        if (!clientToDelete) return;

        const clientName = getClientName(clientToDelete);
        setIsDeleting(true);
        
        try {
            await apiClient.delete(`/clients/${clientToDelete.id}/`);
            const pageToFetch = clients.length === 1 && totalClients > 1 && currentPage > 1 ? currentPage - 1 : currentPage;
            await fetchClients(searchTerm, pageToFetch);
            
            setShowDeleteModal(false);
            setClientToDelete(null);
            showToastNotification(`Successfully deactivated client: **${clientName}**`);

        } catch (err) {
            showToastNotification(`Failed to deactivate client: **${clientName}**`, 'error');
        } finally {
            setIsDeleting(false);
        }
    }, [clientToDelete, clients.length, totalClients, currentPage, fetchClients, searchTerm, showToastNotification]);

    const cancelDelete = useCallback(() => {
        setShowDeleteModal(false);
        setClientToDelete(null);
    }, []);

    const navigateToViewClient = useCallback((clientId) => {
        navigate(`/clients/${clientId}/view`);
    }, [navigate]);

    const navigateToEditClient = useCallback((clientId) => {
        navigate(`/clients/${clientId}`);
    }, [navigate]);

    const navigateToAddClient = useCallback(() => {
        navigate('/clients/add');
    }, [navigate]);

    // Effects
    useEffect(() => {
        if (!searchTerm) {
            fetchClients('', 1);
        }
        
        const navState = location.state;
        if (navState && navState.errorMessage) {
            const message = navState.errorMessage;
            navigate(location.pathname, { replace: true, state: {} });
            showToastNotification(message, 'error');
        } else if (navState && navState.successMessage) {
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [navigate, location.pathname, location.state, fetchClients, searchTerm, showToastNotification]);

    // Render components
    const renderHeader = () => (
        <header className="page-header">
            <div className="header-left">
                {searchTerm && (
                    <button className="btn-back" onClick={handleClearSearch}>
                        <FaArrowLeft />
                        <span>Back to All</span>
                    </button>
                )}
                <div className="header-title">
                    <FaUserFriends className="header-icon" />
                    <h1>Clients</h1>
                    {!loading && <span className="client-count">{totalClients}</span>}
                </div>
            </div>

            <div className="header-actions">
                <div className="view-toggle">
                    <button 
                        className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
                        onClick={() => setViewMode('table')}
                        title="Table View"
                    >
                        Table
                    </button>
                    <button 
                        className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                        onClick={() => setViewMode('grid')}
                        title="Grid View"
                    >
                        Grid
                    </button>
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelection}
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    style={{ display: 'none' }}
                />

                <button 
                    className="btn-secondary" 
                    onClick={handleImport}
                    disabled={isImporting}
                >
                    {isImporting ? <FaSpinner className="spin" /> : <FaFileImport />}
                    <span>{isImporting ? 'Importing...' : 'Import'}</span>
                </button>
                
                <button className="btn-secondary" onClick={handleExport}>
                    <FaFileExport />
                    <span>Export</span>
                </button>
                
                <button className="btn-primary" onClick={navigateToAddClient}>
                    <FaPlusCircle />
                    <span>Add Client</span>
                </button>
            </div>
        </header>
    );

    const renderTableRow = (client) => {
        const clientName = getClientName(client);
        return (
            <tr key={client.id} className="client-row">
                <td>
                    <button className="client-name-link" onClick={() => navigateToEditClient(client.id)}>
                        {clientName}
                    </button>
                </td>
                <td>
                    <div className="contact-info">
                        <div className="email">{client.email}</div>
                        {client.phone_number && (
                            <div className="phone">{client.phone_number}</div>
                        )}
                    </div>
                </td>
                <td>
                    <div className="address">
                        {[client.address, client.city].filter(Boolean).join(', ')}
                    </div>
                </td>
                <td>
                    <span className={`client-type-badge ${client.client_type?.toLowerCase()}`}>
                        {client.client_type || 'Individual'}
                    </span>
                </td>
                <td>
                    <span className="tax-id">{client.tax_id || '—'}</span>
                </td>
                <td>
                    <span className="notes" title={client.notes}>
                        {truncateNotes(client.notes)}
                    </span>
                </td>
                <td>
                    <div className="action-buttons">
                        <button className="action-btn view" onClick={() => navigateToViewClient(client.id)}>
                            <FaEye />
                        </button>
                        <button className="action-btn edit" onClick={() => navigateToEditClient(client.id)}>
                            <FaEdit />
                        </button>
                        <button className="action-btn delete" onClick={() => prepareDelete(client)}>
                            <FaTrashAlt />
                        </button>
                    </div>
                </td>
            </tr>
        );
    };

    // Loading state
    if (loading && clients.length === 0) {
        return (
            <div className="container">
                {renderHeader()}
                <div className="loading-state">
                    <FaSpinner className="spinner" />
                    <p>Loading client data...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="container">
                {renderHeader()}
                <div className="error-state">
                    <FaExclamationTriangle />
                    <h3>Unable to Load Clients</h3>
                    <p>{error}</p>
                    <button className="btn-primary" onClick={() => fetchClients(searchTerm, 1)}>
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            {renderHeader()}

            <main className="main-content">
                {/* Search Bar */}
                <div className="search-section">
                    <SearchBar 
                        onSearch={handleSearch}
                        initialTerm={searchTerm}
                        placeholder="Search by name, email, phone, tax ID..."
                    />
                </div>

                {/* Show No Results Popup when search returns no results */}
                {clients.length === 0 && searchTerm && !loading && (
                    <NoResultsPopup 
                        searchTerm={searchTerm}
                        onClearSearch={handleClearSearch}
                        onAddNew={navigateToAddClient}
                    />
                )}

                {/* Show regular empty state when no clients exist at all */}
                {clients.length === 0 && !searchTerm && !loading && (
                    <div className="empty-state">
                        <FaUserFriends />
                        <h3>No Clients Found</h3>
                        <p>Get started by adding your first client.</p>
                        <button className="btn-primary" onClick={navigateToAddClient}>
                            <FaPlusCircle />
                            Add Your First Client
                        </button>
                    </div>
                )}

                {/* Show client list when there are results */}
                {clients.length > 0 && (
                    <>
                        {viewMode === 'table' ? (
                            <div className="table-container">
                                <table className="client-table">
                                    <thead>
                                        <tr>
                                            <th>Client Name</th>
                                            <th>Contact Info</th>
                                            <th>Address</th>
                                            <th>Type</th>
                                            <th>Tax ID</th>
                                            <th>Notes</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {clients.map(renderTableRow)}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="grid-container">
                                {clients.map(client => (
                                    <ClientCard
                                        key={client.id}
                                        client={client}
                                        onEdit={navigateToEditClient}
                                        onView={navigateToViewClient}
                                        onDelete={prepareDelete}
                                        getClientName={getClientName}
                                    />
                                ))}
                            </div>
                        )}

                        <PaginationControl
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={totalClients}
                            onPageChange={handlePageChange}
                        />
                    </>
                )}
            </main>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={cancelDelete}
                onConfirm={executeDelete}
                clientName={clientToDelete ? getClientName(clientToDelete) : ''}
                isDeleting={isDeleting}
            />

            {/* Notification Toast */}
            {notification.show && (
                <div className={`toast ${notification.type}`}>
                    {notification.type === 'success' ? <FaCheckCircle /> : <FaExclamationTriangle />}
                    <span>{notification.message}</span>
                </div>
            )}

            <style jsx>{`
                .container {
                    min-height: 100vh;
                    background: ${COLORS.light};
                    padding: 0;
                }

                /* Header Styles */
                .page-header {
                    background: ${COLORS.white};
                    padding: 24px 32px;
                    border-bottom: 1px solid ${COLORS.gray[200]};
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                }

                .header-left {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }

                .btn-back {
                    background: ${COLORS.gray[100]};
                    border: 1px solid ${COLORS.gray[300]};
                    color: ${COLORS.gray[700]};
                    padding: 8px 16px;
                    border-radius: 8px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 500;
                    transition: all 0.2s;
                }

                .btn-back:hover {
                    background: ${COLORS.gray[200]};
                }

                .header-title {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .header-title h1 {
                    margin: 0;
                    font-size: 24px;
                    font-weight: 700;
                    color: ${COLORS.dark};
                }

                .header-icon {
                    color: ${COLORS.primary};
                    font-size: 24px;
                }

                .client-count {
                    background: ${COLORS.primary};
                    color: ${COLORS.white};
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 14px;
                    font-weight: 600;
                }

                .header-actions {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .view-toggle {
                    display: flex;
                    background: ${COLORS.gray[100]};
                    border-radius: 8px;
                    padding: 4px;
                    margin-right: 8px;
                }

                .view-btn {
                    background: none;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 500;
                    color: ${COLORS.gray[600]};
                    transition: all 0.2s;
                }

                .view-btn.active {
                    background: ${COLORS.white};
                    color: ${COLORS.primary};
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                }

                .btn-primary, .btn-secondary {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.2s;
                    font-size: 14px;
                }

                .btn-primary {
                    background: ${COLORS.primary};
                    color: ${COLORS.white};
                }

                .btn-primary:hover {
                    background: ${COLORS.primaryDark};
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(209, 106, 51, 0.3);
                }

                .btn-secondary {
                    background: ${COLORS.gray[100]};
                    color: ${COLORS.gray[700]};
                    border: 1px solid ${COLORS.gray[300]};
                }

                .btn-secondary:hover {
                    background: ${COLORS.gray[200]};
                }

                .btn-secondary:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                /* Search Section */
                .search-section {
                    margin-bottom: 24px;
                }

                .search-bar {
                    display: flex;
                    gap: 12px;
                    align-items: center;
                }

                .search-input-container {
                    position: relative;
                    flex: 1;
                    max-width: 400px;
                }

                .search-icon {
                    position: absolute;
                    left: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: ${COLORS.gray[400]};
                }

                .search-input {
                    width: 100%;
                    padding: 10px 40px 10px 40px;
                    border: 1px solid ${COLORS.gray[300]};
                    border-radius: 8px;
                    font-size: 14px;
                    transition: all 0.2s;
                }

                .search-input:focus {
                    outline: none;
                    border-color: ${COLORS.primary};
                    box-shadow: 0 0 0 3px rgba(209, 106, 51, 0.1);
                }

                .clear-search {
                    position: absolute;
                    right: 8px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    color: ${COLORS.gray[400]};
                    cursor: pointer;
                    padding: 4px;
                }

                .clear-search:hover {
                    color: ${COLORS.gray[600]};
                }

                .search-btn {
                    background: ${COLORS.primary};
                    color: ${COLORS.white};
                    border: none;
                    padding: 10px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.2s;
                }

                .search-btn:hover {
                    background: ${COLORS.primaryDark};
                }

                /* No Results Popup */
                .no-results-popup {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 400px;
                    padding: 40px 20px;
                }

                .popup-content {
                    background: ${COLORS.white};
                    border-radius: 16px;
                    padding: 48px 40px;
                    text-align: center;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
                    border: 1px solid ${COLORS.gray[200]};
                    max-width: 480px;
                    width: 100%;
                }

                .popup-icon {
                    width: 80px;
                    height: 80px;
                    background: linear-gradient(135deg, ${COLORS.gray[100]}, ${COLORS.gray[200]});
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 24px;
                    font-size: 32px;
                    color: ${COLORS.gray[500]};
                }

                .popup-content h3 {
                    margin: 0 0 16px 0;
                    font-size: 24px;
                    font-weight: 700;
                    color: ${COLORS.dark};
                }

                .popup-message {
                    color: ${COLORS.gray[600]};
                    font-size: 16px;
                    line-height: 1.6;
                    margin-bottom: 32px;
                }

                .popup-actions {
                    display: flex;
                    gap: 12px;
                    justify-content: center;
                    flex-wrap: wrap;
                }

                .popup-btn {
                    padding: 12px 24px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.2s;
                    font-size: 14px;
                }

                .popup-btn.primary {
                    background: ${COLORS.primary};
                    color: ${COLORS.white};
                }

                .popup-btn.primary:hover {
                    background: ${COLORS.primaryDark};
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(209, 106, 51, 0.3);
                }

                .popup-btn.secondary {
                    background: ${COLORS.gray[100]};
                    color: ${COLORS.gray[700]};
                    border: 1px solid ${COLORS.gray[300]};
                }

                .popup-btn.secondary:hover {
                    background: ${COLORS.gray[200]};
                }

                /* Modern Delete Modal Styles */
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
                    padding: 20px;
                }

                .modal {
                    background: ${COLORS.white};
                    border-radius: 16px;
                    width: 100%;
                    max-width: 400px;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                    animation: modalSlideIn 0.2s ease-out;
                }

                .modal-content {
                    padding: 32px;
                    text-align: center;
                }

                .modal-icon {
                    width: 64px;
                    height: 64px;
                    background: ${COLORS.gray[100]};
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 20px;
                    font-size: 24px;
                    color: ${COLORS.gray[600]};
                }

                .modal-title {
                    margin: 0 0 12px 0;
                    font-size: 20px;
                    font-weight: 600;
                    color: ${COLORS.dark};
                }

                .modal-message {
                    color: ${COLORS.gray[600]};
                    font-size: 14px;
                    line-height: 1.5;
                    margin-bottom: 24px;
                }

                .modal-actions {
                    display: flex;
                    gap: 12px;
                    justify-content: center;
                }

                .modal-btn {
                    padding: 10px 24px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 14px;
                    transition: all 0.2s;
                    min-width: 80px;
                }

                .modal-btn.cancel-btn {
                    background: ${COLORS.gray[100]};
                    color: ${COLORS.gray[700]};
                    border: 1px solid ${COLORS.gray[300]};
                }

                .modal-btn.cancel-btn:hover:not(:disabled) {
                    background: ${COLORS.gray[200]};
                }

                .modal-btn.delete-btn {
                    background: ${COLORS.danger};
                    color: ${COLORS.white};
                }

                .modal-btn.delete-btn:hover:not(:disabled) {
                    background: #dc2626;
                    transform: translateY(-1px);
                }

                .modal-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none !important;
                }

                @keyframes modalSlideIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95) translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }

                /* Main Content */
                .main-content {
                    padding: 32px;
                    max-width: 1900px;
                    margin: 0 auto;
                }

                /* Table Styles */
                .table-container {
                    background: ${COLORS.white};
                    border-radius: 12px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                    margin-bottom: 24px;
                }

                .client-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 14px;
                }

                .client-table th {
                    background: ${COLORS.gray[50]};
                    padding: 16px;
                    text-align: left;
                    font-weight: 600;
                    color: ${COLORS.gray[700]};
                    border-bottom: 1px solid ${COLORS.gray[200]};
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    font-size: 12px;
                }

                .client-table td {
                    padding: 16px;
                    border-bottom: 1px solid ${COLORS.gray[100]};
                    vertical-align: top;
                }

                .client-row:hover {
                    background: ${COLORS.gray[50]};
                }

                .client-name-link {
                    background: none;
                    border: none;
                    color: ${COLORS.primary};
                    font-weight: 600;
                    cursor: pointer;
                    text-align: left;
                    padding: 0;
                    font-size: 14px;
                    text-decoration: none;
                }

                .client-name-link:hover {
                    color: ${COLORS.primaryDark};
                }

                .contact-info .email {
                    color: ${COLORS.gray[700]};
                    margin-bottom: 4px;
                }

                .contact-info .phone {
                    color: ${COLORS.gray[500]};
                    font-size: 13px;
                }

                .address {
                    color: ${COLORS.gray[600]};
                    font-size: 13px;
                }

                .client-type-badge {
                    padding: 4px 8px;
                    border-radius: 6px;
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: uppercase;
                }

                .client-type-badge.individual {
                    background: #dbeafe;
                    color: #1d4ed8;
                }

                .client-type-badge.company {
                    background: #fef3c7;
                    color: #92400e;
                }

                .tax-id {
                    color: ${COLORS.gray[500]};
                    font-family: 'Monaco', 'Consolas', monospace;
                }

                .notes {
                    color: ${COLORS.gray[600]};
                    font-size: 13px;
                }

                .action-buttons {
                    display: flex;
                    gap: 8px;
                }

                .action-btn {
                    width: 32px;
                    height: 32px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                    color: ${COLORS.gray[600]};
                }

                .action-btn.view {
                    background: #dbeafe;
                }

                .action-btn.view:hover {
                    background: #93c5fd;
                    color: ${COLORS.white};
                }

                .action-btn.edit {
                    background: #fef3c7;
                }

                .action-btn.edit:hover {
                    background: #f59e0b;
                    color: ${COLORS.white};
                }

                .action-btn.delete {
                    background: #fee2e2;
                }

                .action-btn.delete:hover {
                    background: #ef4444;
                    color: ${COLORS.white};
                }

                /* Grid Styles */
                .grid-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 24px;
                    margin-bottom: 24px;
                }

                .client-card {
                    background: ${COLORS.white};
                    border-radius: 12px;
                    padding: 20px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                    transition: all 0.2s;
                    border: 1px solid ${COLORS.gray[200]};
                }

                .client-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }

                .client-card-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 16px;
                }

                .client-avatar {
                    width: 48px;
                    height: 48px;
                    background: ${COLORS.primary};
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: ${COLORS.white};
                    font-size: 20px;
                }

                .client-info h3 {
                    margin: 0 0 4px 0;
                    font-size: 16px;
                    font-weight: 600;
                    color: ${COLORS.dark};
                }

                .client-type {
                    padding: 2px 8px;
                    border-radius: 4px;
                    font-size: 11px;
                    font-weight: 600;
                    text-transform: uppercase;
                }

                .client-type.individual {
                    background: #dbeafe;
                    color: #1d4ed8;
                }

                .client-type.company {
                    background: #fef3c7;
                    color: #92400e;
                }

                .client-details {
                    margin-bottom: 16px;
                }

                .detail-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 8px;
                    font-size: 13px;
                }

                .detail-icon {
                    color: ${COLORS.gray[500]};
                    width: 14px;
                }

                .detail-label {
                    color: ${COLORS.gray[600]};
                    font-weight: 500;
                }

                .detail-text {
                    color: ${COLORS.gray[700]};
                }

                .client-notes {
                    background: ${COLORS.gray[50]};
                    padding: 12px;
                    border-radius: 6px;
                    margin-bottom: 16px;
                    display: flex;
                    gap: 8px;
                    font-size: 13px;
                }

                .notes-icon {
                    color: ${COLORS.gray[500]};
                    flex-shrink: 0;
                }

                .notes-text {
                    color: ${COLORS.gray[600]};
                    line-height: 1.4;
                }

                .client-actions {
                    display: flex;
                    gap: 8px;
                }

                /* Empty State */
                .empty-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 80px 40px;
                    text-align: center;
                    background: ${COLORS.white};
                    border-radius: 16px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                }

                .empty-state svg {
                    font-size: 64px;
                    margin-bottom: 16px;
                    opacity: 0.5;
                    color: ${COLORS.gray[400]};
                }

                .empty-state h3 {
                    color: ${COLORS.dark};
                    margin: 16px 0 8px 0;
                    font-size: 24px;
                }

                .empty-state p {
                    color: ${COLORS.gray[600]};
                    font-size: 16px;
                    margin: 0 0 24px 0;
                }

                /* Pagination */
                .pagination-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px 0;
                    border-top: 1px solid ${COLORS.gray[200]};
                }

                .pagination-text {
                    color: ${COLORS.gray[600]};
                    font-size: 14px;
                }

                .pagination-controls {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .pagination-btn {
                    padding: 8px 12px;
                    border: 1px solid ${COLORS.gray[300]};
                    background: ${COLORS.white};
                    color: ${COLORS.gray[700]};
                    cursor: pointer;
                    border-radius: 6px;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    transition: all 0.2s;
                }

                .pagination-btn:hover:not(:disabled) {
                    background: ${COLORS.gray[50]};
                    border-color: ${COLORS.gray[400]};
                }

                .pagination-btn.active {
                    background: ${COLORS.primary};
                    color: ${COLORS.white};
                    border-color: ${COLORS.primary};
                }

                .pagination-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .pagination-numbers {
                    display: flex;
                    gap: 4px;
                }

                /* Toast */
                .toast {
                    position: fixed;
                    top: 24px;
                    right: 24px;
                    padding: 16px 20px;
                    border-radius: 8px;
                    color: ${COLORS.white};
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-weight: 500;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    z-index: 1100;
                    animation: slideIn 0.3s ease-out;
                }

                .toast.success {
                    background: ${COLORS.success};
                }

                .toast.error {
                    background: ${COLORS.danger};
                }

                .toast.info {
                    background: ${COLORS.secondary};
                }

                /* Loading and Error States */
                .loading-state, .error-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 80px 40px;
                    text-align: center;
                }

                .spinner {
                    animation: spin 1s linear infinite;
                    font-size: 32px;
                    color: ${COLORS.primary};
                    margin-bottom: 16px;
                }

                .loading-state p, .error-state p {
                    color: ${COLORS.gray[600]};
                    font-size: 16px;
                    margin: 8px 0 0 0;
                }

                .error-state h3 {
                    color: ${COLORS.dark};
                    margin: 16px 0 8px 0;
                }

                .error-state {
                    color: ${COLORS.danger};
                }

                /* Animations */
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
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

                /* Responsive Design */
                @media (max-width: 1024px) {
                    .page-header {
                        flex-direction: column;
                        gap: 16px;
                        align-items: stretch;
                    }

                    .header-actions {
                        justify-content: space-between;
                    }

                    .grid-container {
                        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    }

                    .popup-actions {
                        flex-direction: column;
                        align-items: center;
                    }

                    .popup-btn {
                        width: 200px;
                        justify-content: center;
                    }

                    .modal-actions {
                        flex-direction: column;
                    }
                }

                @media (max-width: 768px) {
                    .main-content {
                        padding: 20px;
                    }

                    .header-actions {
                        flex-wrap: wrap;
                    }

                    .pagination-container {
                        flex-direction: column;
                        gap: 16px;
                        align-items: stretch;
                    }

                    .table-container {
                        overflow-x: auto;
                    }

                    .client-table {
                        min-width: 800px;
                    }

                    .grid-container {
                        grid-template-columns: 1fr;
                    }

                    .search-bar {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .search-input-container {
                        max-width: none;
                    }

                    .popup-content {
                        padding: 32px 24px;
                    }

                    .modal-content {
                        padding: 24px;
                    }
                }

                @media (max-width: 480px) {
                    .page-header {
                        padding: 16px;
                    }

                    .main-content {
                        padding: 16px;
                    }

                    .header-actions {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .view-toggle {
                        align-self: center;
                    }

                    .popup-content {
                        margin: 0 16px;
                        padding: 24px 20px;
                    }

                    .popup-icon {
                        width: 60px;
                        height: 60px;
                        font-size: 24px;
                    }

                    .popup-content h3 {
                        font-size: 20px;
                    }

                    .popup-message {
                        font-size: 14px;
                    }

                    .modal {
                        margin: 20px;
                    max-width: none;
                    width: calc(100% - 40px);
                    }
                }
            `}</style>
        </div>
    );
};

export default ClientsList;