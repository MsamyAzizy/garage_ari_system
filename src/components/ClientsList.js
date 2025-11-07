// src/components/ClientsList.js - Fetches client data from the Django API

import React, { useState, useEffect, useCallback } from 'react';
// Added FaCheckCircle for the success notification icon
import { FaUserFriends, FaPlusCircle, FaTimes, FaCheckCircle, FaClipboardList, FaSpinner, FaChevronLeft, FaChevronRight } from 'react-icons/fa'; 
// Use useLocation to read navigation state
import { useNavigate, useLocation } from 'react-router-dom'; 

import SearchBar from './SearchBar'; 
import apiClient from '../utils/apiClient'; 

// Define theme colors for consistency (Used in static styling)
const PRIMARY_BLUE = '#5d9cec';
const BG_CARD_DARK = '#2c3848';
const TEXT_PRIMARY_DARK = '#ffffff';
const TEXT_MUTED_DARK = '#aeb8c8';
const INPUT_BORDER_DARK = '#38465b'; 
const DANGER_RED = '#ff4d4f'; 
// NEW CONSTANT FOR EDIT BUTTON ORANGE 
const EDIT_ORANGE = '#ffa726'; 
// Green color for success notification
const SUCCESS_GREEN = '#2ecc71'; 
const ERROR_RED = '#e74c3c'; 
const YELLOW_WARNING = '#ffc107'; // For warning/highlight

// Define the assumed items per page (must match your backend's page size)
const ITEMS_PER_PAGE = 10;

// -----------------------------------------------------------------
// PAGINATION CONTROL COMPONENT (Google Style)
// -----------------------------------------------------------------

/**
 * Renders the Google-style numbered pagination control.
 */
const PaginationControl = ({ currentPage, totalPages, totalItems, onPageChange }) => {
    if (totalPages <= 1) return null;

    // Generate visible page numbers (e.g., [1, 2, 3, 4, 5])
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    
    // 🏆 CORRECTED LOGIC FOR PER-PAGE RANGE DISPLAY 🏆
    // Page 1: (1-1) * 10 + 1 = 1
    // Page 2: (2-1) * 10 + 1 = 11
    const startRange = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    
    // End range is either the theoretical end of the page or the total number of items
    let endRange = startRange + ITEMS_PER_PAGE - 1;
    if (endRange > totalItems) {
        endRange = totalItems;
    }
    // -----------------------------------------------------------------

    const handlePageClick = (page, event) => {
        event.preventDefault();
        // Ensure the page number is valid before calling the handler
        if (page > 0 && page <= totalPages && page !== currentPage) {
            onPageChange(page);
        }
    };

    return (
        <div className="pagination-wrap">
            {/* Range Text (Now Per-Page) */}
            <p className="pagination-range-text">
                Showing **{startRange} to {endRange}** of {totalItems} clients
            </p>

            <div className="pagination-container">
                {/* 'Previous' Button */}
                <a 
                    href="/#" 
                    onClick={(e) => handlePageClick(currentPage - 1, e)}
                    className={`pagination-link ${currentPage === 1 ? 'disabled' : ''}`}
                    aria-disabled={currentPage === 1}
                >
                    <FaChevronLeft size={10} style={{marginRight: '3px'}}/> Previous
                </a>

                {/* Page Numbers */}
                {pageNumbers.map(number => (
                    <a
                        key={number}
                        href="/#"
                        onClick={(e) => handlePageClick(number, e)}
                        className={`pagination-link ${number === currentPage ? 'active' : ''}`}
                    >
                        {number}
                    </a>
                ))}

                {/* 'Next' Button */}
                <a 
                    href="/#" 
                    onClick={(e) => handlePageClick(currentPage + 1, e)}
                    className={`pagination-link ${currentPage === totalPages ? 'disabled' : ''}`}
                    aria-disabled={currentPage === totalPages}
                >
                    Next <FaChevronRight size={10} style={{marginLeft: '3px'}}/>
                </a>
            </div>
        </div>
    );
};


// -----------------------------------------------------------------
// CLIENTS LIST COMPONENT (Main)
// -----------------------------------------------------------------
const ClientsList = () => {
    // Client data
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalClients, setTotalClients] = useState(0); 
    
    // Search state
    const [searchTerm, setSearchTerm] = useState(''); 

    const navigate = useNavigate();
    const location = useLocation();
    
    // Custom Delete Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [clientToDelete, setClientToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    
    // STATE for Notification
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    // Helper to determine the client's name
    const getClientName = (client) => {
        if (!client) return '';
        if (client.client_type === 'Company' && client.company_name) {
            return client.company_name;
        }
        return (client.full_name || `${client.first_name || ''} ${client.last_name || ''}`).trim();
    };
    
    // HELPER: Truncate notes for display
    const truncateNotes = (notes, maxLength = 50) => {
        if (!notes) return '—';
        const cleanedNotes = String(notes).replace(/<[^>]*>?/gm, ''); 
        if (cleanedNotes.length > maxLength) {
            return cleanedNotes.substring(0, maxLength) + '...';
        }
        return cleanedNotes;
    };


    // -----------------------------------------------------------------
    // Function to Fetch Clients (Now accepts page parameter)
    // -----------------------------------------------------------------
    const fetchClients = useCallback(async (currentSearchTerm, page = 1) => {
        setLoading(true);
        setError(null);
        
        // Construct API URL with search and page query parameters
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

            // Handle paginated response structure (Django REST Framework standard)
            if (receivedData && Array.isArray(receivedData.results)) {
                clientArray = receivedData.results;
                total = receivedData.count || 0;
                // Calculate total pages based on count and ITEMS_PER_PAGE
                totalP = Math.ceil(total / ITEMS_PER_PAGE) || 1;
                
            // Fallback for non-paginated or simple array response
            } else if (Array.isArray(receivedData)) {
                clientArray = receivedData;
                total = receivedData.length;
                totalP = 1;
            } 
            
            setClients(clientArray); 
            setTotalClients(total);
            setTotalPages(totalP);
            setCurrentPage(page); // Update current page state

        } catch (err) {
            setError("Failed to load client data. Please check your backend API status or network connection.");
            console.error("Client fetch error:", err.response ? err.response.data : err.message);
        } finally {
            setLoading(false);
        }
    }, []); 

    // -----------------------------------------------------------------
    // Function to handle search submission from SearchBar
    // -----------------------------------------------------------------
    const handleSearch = (term) => {
        setSearchTerm(term);
        // CRITICAL: When searching, reset to page 1
        fetchClients(term, 1);
    };
    
    // -----------------------------------------------------------------
    // Function to handle page change from PaginationControl
    // -----------------------------------------------------------------
    const handlePageChange = (newPage) => {
        // Fetch clients for the new page, retaining the current search term
        fetchClients(searchTerm, newPage);
    };


    // -----------------------------------------------------------------
    // FUNCTION: Show Notification
    // -----------------------------------------------------------------
    const showToastNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        // Automatically hide notification after 3 seconds
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 3000);
    };

    // -----------------------------------------------------------------
    // EFFECT: Initial Load and Check for Save Success/Error Message
    // -----------------------------------------------------------------
    useEffect(() => {
        // Initial fetch on mount (only if search is empty, otherwise search does the initial fetch)
        if (!searchTerm) {
            fetchClients('', 1);
        }
        
        // IMPORTANT: Check for error message first
        if (location.state && location.state.errorMessage) {
            showToastNotification(`API Error: ${location.state.errorMessage}`, 'error');
            // Use replace: true to clean up history state without adding a new entry
            navigate(location.pathname, { replace: true, state: {} }); 
        }
        
        // Check if a success message was passed in the navigation state
        else if (location.state && location.state.successMessage) {
            showToastNotification(location.state.successMessage, 'success');
            // Use replace: true to clean up history state without adding a new entry
            navigate(location.pathname, { replace: true, state: {} }); 
        }
    }, [location.state, navigate, location.pathname, fetchClients, searchTerm]); 

    const navigateToAddClient = () => {
        navigate('/clients/add');
    };
    
    // -----------------------------------------------------------------
    // MODAL FUNCTIONS 
    // -----------------------------------------------------------------
    
    // 1. Prepare to delete (Open modal)
    const prepareDelete = (client) => {
        setClientToDelete(client);
        setShowDeleteModal(true);
    };

    // 2. Execute Delete (Perform API call)
    const executeDelete = async () => {
        if (!clientToDelete) return;

        const clientName = getClientName(clientToDelete);
        setIsDeleting(true);
        
        try {
            await apiClient.delete(`/clients/${clientToDelete.id}/`);
            
            // After successful deletion, refresh the current page 
            await fetchClients(searchTerm, currentPage);
            
            setShowDeleteModal(false);
            setClientToDelete(null);
            
            showToastNotification(`Successfully deactivated client: ${clientName}.`, 'success');

        } catch (err) {
            console.error("Client delete error:", err.response ? err.response.data : err.message);
            showToastNotification(`Failed to deactivate client: ${clientName}.`, 'error');
        } finally {
            setIsDeleting(false);
        }
    };
    
    // 3. Cancel Delete (Close modal)
    const cancelDelete = () => {
        setShowDeleteModal(false);
        setClientToDelete(null);
    };


    // -----------------------------------------------------------------
    // Conditional Rendering 
    // -----------------------------------------------------------------
    
    // Function to render the top header area (reusable)
    const renderHeader = () => (
        <header className="page-header">
            <h2 style={{ flexGrow: 0 }}><FaUserFriends style={{ marginRight: '8px' }}/> Clients ({loading ? '...' : totalClients})</h2>
            
            <div className="search-and-button-container">
                <SearchBar 
                    onSearch={handleSearch} 
                    placeholder="Search by name, email, tax ID..."
                />
                <button className="btn-primary-action" onClick={navigateToAddClient}>
                    <FaPlusCircle style={{ marginRight: '5px' }} /> Add New Client
                </button>
            </div>
        </header>
    );

    // Loading State
    if (loading && clients.length === 0) {
        return (
            <div className="list-page-container">
                {renderHeader()}
                <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px', color: TEXT_MUTED_DARK }}>
                    <FaSpinner className="spin" style={{ marginRight: '10px' }}/> Loading client data...
                </div>
            </div>
        );
    }
    
    // Error State
    if (error) {
        return (
            <div className="list-page-container">
                {renderHeader()}
                <div className="error-message-box">
                    **Error:** {error}
                </div>
                <style jsx>{`
                    .error-message-box {
                        text-align: center; 
                        padding: 20px; 
                        color: ${ERROR_RED}; 
                        border: 1px solid ${ERROR_RED}40; 
                        border-radius: 8px; 
                        margin: 20px 0; 
                        background-color: #fdd; 
                        font-size: 18px;
                    }
                    body.dark-theme .error-message-box {
                        background-color: #5c1f24;
                        color: #f5c6cb;
                        border-color: #7e2a33;
                    }
                `}</style>
            </div>
        );
    }

    // Empty State (No results)
    if (clients.length === 0) {
        return (
            <div className="list-page-container">
                {renderHeader()}
                <div className="list-content-area list-empty-state">
                    <p style={{ fontSize: '18px' }}>
                        {searchTerm.trim() 
                            ? `No clients found matching "${searchTerm}".` 
                            : 'No active clients found in the system.'
                        }
                    </p>
                    {!searchTerm.trim() && 
                        <p style={{ marginTop: '10px', color: '#aaaaaa' }}>Click "Add New Client" above to get started.</p>
                    }
                </div>
                <style jsx>{`
                    .list-empty-state {
                        text-align: center; 
                        padding: 50px; 
                        color: #999999; 
                        font-size: 18px; 
                        background-color: #ffffff;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                    }
                    body.dark-theme .list-empty-state {
                        background-color: ${BG_CARD_DARK};
                        color: ${TEXT_MUTED_DARK};
                    }
                `}</style>
            </div>
        );
    }

    // -----------------------------------------------------------------
    // Success State: Render Client Table
    // -----------------------------------------------------------------
    return (
        <div className="list-page-container">
            {renderHeader()}

            <div className="list-content-area client-list-container">
                <div className="client-table-responsive">
                    <table className="client-table">
                        <thead>
                            <tr>
                                <th>Client Name</th>
                                <th>Email / Phone</th>
                                <th>Address</th>
                                <th>Type</th>
                                <th>Tax ID</th>
                                <th><FaClipboardList style={{ marginRight: '5px' }} /> Notes</th> 
                                <th style={{ textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(clients) && clients.map((client) => {
                                const clientName = getClientName(client);
                                
                                return (
                                <tr key={client.id} className="client-row">
                                    <td>
                                        <span className="client-name-cell">
                                            {clientName}
                                        </span>
                                    </td>
                                    <td>
                                        {client.email}<br />
                                        <small className="client-phone-small">{client.phone_number}</small>
                                    </td>
                                    <td>
                                        <span className="client-address-small">
                                            {client.address}
                                            {client.city ? `, ${client.city}` : ''}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`client-type-badge type-${client.client_type ? client.client_type.toLowerCase() : 'individual'}`}>
                                            {client.client_type || 'Individual'}
                                        </span>
                                    </td>
                                    <td className="client-tax-id-cell">
                                        {client.tax_id || '—'}
                                    </td>
                                    <td className="client-notes-cell">
                                        <span title={client.notes}>
                                            {truncateNotes(client.notes)}
                                        </span>
                                    </td>
                                    <td style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}> 
                                        <button 
                                            className="action-btn edit-action" 
                                            onClick={() => navigate(`/clients/${client.id}`)}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className="action-btn delete-action" 
                                            onClick={() => prepareDelete(client)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
                
                {/* 🏆 PAGINATION CONTROL INTEGRATION 🏆 */}
                <PaginationControl 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalClients}
                    onPageChange={handlePageChange}
                />
            </div>
            
            {/* CUSTOM DELETE MODAL STRUCTURE */}
            {showDeleteModal && clientToDelete && (
                <div className="custom-modal-backdrop">
                    <div className="custom-modal">
                        <div className="modal-header">
                            <h4 className="modal-title">Confirm Client Deactivation</h4>
                            <button className="close-btn" onClick={cancelDelete}>
                                <FaTimes />
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>
                                You are about to **deactivate** the client: 
                                <span className="client-name-highlight"> {getClientName(clientToDelete)}</span>.
                            </p>
                            <p className="warning-text">
                                **Important:** Deactivating this client will remove them from the active list. 
                                  Are you sure you want to delete this client..!
                                </p>
                        </div>
                        <div className="modal-footer">
                            <button 
                                className="modal-btn btn-secondary" 
                                onClick={cancelDelete} 
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button 
                                className="modal-btn btn-danger" 
                                onClick={executeDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 
                                    (<>
                                        <FaSpinner className="spin-icon" /> Deactivating...
                                    </>)
                                    : 'Deactivate Client'
                                }
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* TOAST NOTIFICATION COMPONENT (Top-Right Position) */}
            {notification.show && (
                <div className={`toast-notification ${notification.type}`}>
                    {/* Choose the appropriate icon */}
                    {notification.type === 'success' ? 
                        <FaCheckCircle style={{ marginRight: '10px' }} /> : 
                        <FaTimes style={{ marginRight: '10px' }} />
                    }
                    {notification.message}
                </div>
            )}


            {/* --- STYLES INTEGRATED FOR A SMART, MODERN LOOK --- */}
            <style jsx>{`
                /* ----------------------------------------------------------------- */
                /* Base Styles & Typography */
                /* ----------------------------------------------------------------- */
                
                .list-page-container {
                    padding: 0 10px 40px 20px;
                    max-width: 2800px;
                    margin: 0 auto;
                    font-family: 'Inter', 'Roboto', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
                }
                
                .page-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 0 15px 0;
                    border-bottom: 1px solid #e0e0e0;
                    margin-bottom: 25px;
                }
                .page-header h2 {
                    font-size: 26px; 
                    font-weight: 700; 
                    color: #333333;
                }
                body.dark-theme .page-header {
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                }
                body.dark-theme .page-header h2 {
                    color: ${TEXT_PRIMARY_DARK};
                }
                
                /* Search bar and button layout */
                .search-and-button-container {
                    display: flex;
                    gap: 15px;
                    align-items: center;
                }

                /* Main Content Card */
                .client-list-container {
                    padding: 0; 
                    background-color: #ffffff;
                    border-radius: 12px; 
                    box-shadow: 0 6px 20px rgba(0,0,0,0.08); 
                    overflow: hidden; /* To handle table borders/shadows */
                    border: 1px solid #e0e0e0; /* Added a subtle border */
                }
                body.dark-theme .client-list-container {
                    background-color: ${BG_CARD_DARK};
                    box-shadow: 0 6px 20px rgba(0,0,0,0.3);
                    border: 1px solid ${INPUT_BORDER_DARK};
                }

                .client-table {
                    width: 100%;
                    border-collapse: collapse;
                    border-spacing: 0;
                }
                
                /* --- Table Cells & Headers --- */
                .client-table th, .client-table td {
                    padding: 15px 20px; /* Adjusted padding */
                    text-align: left;
                    font-size: 15px; 
                    border-bottom: 1px solid #f0f0f0;
                    color: #444444; 
                    vertical-align: middle;
                }
                
                body.dark-theme .client-table th, 
                body.dark-theme .client-table td {
                    border-bottom: 1px solid ${INPUT_BORDER_DARK}; 
                    color: #cccccc; 
                }
                
                .client-table th {
                    background-color: #f8f8f8; 
                    font-weight: 700; 
                    color: #666666;
                    text-transform: uppercase;
                    font-size: 13px; 
                    letter-spacing: 0.5px; 
                }
                body.dark-theme .client-table th {
                    background-color: #38465b; /* Darker header background */
                    color: ${TEXT_MUTED_DARK};
                }
                
                /* Hover effect for rows */
                .client-table tbody tr:hover {
                    background-color: #f5f8ff; /* Lighter hover */
                    cursor: default;
                }
                body.dark-theme .client-table tbody tr:hover {
                    background-color: #334050;
                }

                /* --- ROW CONTENT STYLING --- */
                .client-name-cell {
                    font-weight: 200; 
                    color: #222222; 
                    font-size: 15px; 
                }
                body.dark-theme .client-name-cell {
                    color: #ffffff;
                }

                .client-phone-small, .client-address-small {
                    font-size: 15px; 
                    color: #888888; 
                    font-weight: 400;
                    display: block;
                }
                body.dark-theme .client-phone-small, body.dark-theme .client-address-small {
                    color: ${TEXT_MUTED_DARK};
                }
                
                /* Tax ID cell (New Style) */
                .client-tax-id-cell {
                    font-size: 15px;
                    font-weight: 500;
                    color: #555;
                }
                body.dark-theme .client-tax-id-cell {
                    color: #ccc;
                }
                
                /* Notes cell styling (Truncation) */
                .client-notes-cell {
                    font-size: 14px;
                    color: #666666;
                    max-width: 180px; /* Adjusted max-width */
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
                body.dark-theme .client-notes-cell {
                    color: #aeb8c8;
                }

                /* --- TYPE BADGES (Smart Look) --- */
                .client-type-badge {
                    display: inline-block;
                    padding: 4px 10px; /* Reduced padding */
                    border-radius: 14px; 
                    font-size: 12px; /* Reduced font size */
                    font-weight: 700;
                    text-transform: capitalize; 
                    letter-spacing: 0.2px;
                }
                .type-individual {
                    background-color: #e6f7ff; 
                    color: #1890ff; 
                }
                .type-company {
                    background-color: #fffbe6; 
                    color: #faad14; 
                }
                /* Dark Mode Badges */
                body.dark-theme .type-individual {
                    background-color: #1890ff33;
                    color: ${PRIMARY_BLUE};
                }
                body.dark-theme .type-company {
                    background-color: #faad1433;
                    color: ${YELLOW_WARNING};
                }


                /* --- ACTION BUTTONS (Modern Outline/Ghost Style) --- */
                .action-btn { 
                    /* 💡 Base style for all action buttons */
                    padding: 8px 12px; 
                    border-radius: 4px; /* Slightly squared for a modern look */
                    font-size: 14px; 
                    font-weight: 600; 
                    cursor: pointer;
                    transition: background-color 0.2s, transform 0.1s, opacity 0.2s, border-color 0.2s;
                    background-color: transparent; /* IMPORTANT: Transparent background */
                }
                
                /* 🍊 EDIT BUTTON STYLES (Orange Outline) 🍊 */
                .edit-action {
                    color: ${EDIT_ORANGE}; 
                    border: 1px solid ${EDIT_ORANGE}60; /* Subtle outline border */
                }
                .edit-action:hover {
                    background-color: ${EDIT_ORANGE}20; /* Light orange fill on hover */
                    border-color: ${EDIT_ORANGE};
                    transform: translateY(-1px);
                }
                body.dark-theme .edit-action {
                    color: ${EDIT_ORANGE};
                    border-color: ${EDIT_ORANGE}30;
                }
                body.dark-theme .edit-action:hover {
                    background-color: ${EDIT_ORANGE}33;
                }
                
                /* 🛑 DELETE BUTTON STYLES (Red Outline) 🛑 */
                .delete-action {
                    color: ${DANGER_RED};
                    border: 1px solid ${DANGER_RED}60; /* Subtle outline border */
                }
                .delete-action:hover {
                    background-color: ${DANGER_RED}20; /* Light red fill on hover */
                    border-color: ${DANGER_RED};
                    transform: translateY(-1px);
                }
                body.dark-theme .delete-action {
                    color: ${DANGER_RED};
                    border-color: ${DANGER_RED}30;
                }
                body.dark-theme .delete-action:hover {
                    background-color: ${DANGER_RED}33;
                }
                
                .spin-icon {
                    animation: spin 1s linear infinite;
                    margin-right: 5px;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                @media (max-width: 1000px) {
                    .page-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    .search-and-button-container {
                        margin-top: 15px;
                        width: 100%;
                        justify-content: space-between;
                    }
                }
                @media (max-width: 768px) {
                    .client-table-responsive {
                        overflow-x: auto;
                    }
                    .client-table {
                        min-width: 1250px; 
                    }
                    .client-table th, .client-table td {
                        padding: 15px 15px;
                    }
                }
                
                .btn-primary-action {
                    padding: 10px 18px; 
                    background-color: ${PRIMARY_BLUE};
                    color: white;
                    border: none;
                    border-radius: 8px; 
                    font-size: 15px; 
                    cursor: pointer;
                    font-weight: 600; 
                    display: inline-flex;
                    align-items: center;
                    transition: background-color 0.2s, transform 0.1s;
                }
                .btn-primary-action:hover {
                    background-color: #4a90e2;
                }
                .btn-primary-action:active {
                    transform: scale(0.98);
                }
                
                /* ----------------------------------------------------------------- */
                /* CUSTOM MODAL STYLES */
                /* ----------------------------------------------------------------- */
                .custom-modal-backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.7); 
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }

                .custom-modal {
                    background-color: #ffffff;
                    border-radius: 12px; 
                    width: 90%;
                    max-width: 480px; 
                    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3); 
                    animation: slideInDown 0.3s ease-out;
                    overflow: hidden;
                }
                
                body.dark-theme .custom-modal {
                    background-color: #37475a; 
                    color: ${TEXT_PRIMARY_DARK};
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px 25px; 
                    border-bottom: 1px solid #e9e9e9;
                }
                body.dark-theme .modal-header {
                    border-bottom: 1px solid #4a5d77;
                }

                .modal-title {
                    margin: 0;
                    font-size: 20px; 
                    font-weight: 700; 
                    color: #333;
                }
                body.dark-theme .modal-title {
                    color: ${TEXT_PRIMARY_DARK};
                }

                .modal-body {
                    padding: 25px; 
                    font-size: 16px; 
                    line-height: 1.6;
                }
                
                .client-name-highlight {
                    font-weight: 700;
                    color: ${PRIMARY_BLUE}; 
                }
                
                .warning-text {
                    font-size: 15px; 
                    color: #777;
                    margin-top: 20px;
                    padding: 15px; 
                    background-color: #fff0f0; 
                    border-left: 4px solid ${DANGER_RED};
                    border-radius: 6px;
                }
                body.dark-theme .warning-text {
                    color: ${TEXT_MUTED_DARK};
                    background-color: #4a3030;
                    border-left-color: ${DANGER_RED};
                }

                .modal-footer {
                    display: flex;
                    justify-content: flex-end;
                    padding: 15px 25px; 
                    border-top: 1px solid #eeeeee;
                    gap: 10px;
                }
                 body.dark-theme .modal-footer {
                    border-top: 1px solid #4a5d77;
                }

                .modal-btn {
                    padding: 10px 20px; 
                    border-radius: 8px; 
                    font-size: 15px; 
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.2s, box-shadow 0.2s, opacity 0.2s;
                    border: 1px solid transparent;
                }

                .modal-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                
                .btn-danger {
                    background-color: ${DANGER_RED};
                    color: white;
                }
                .btn-danger:hover:not(:disabled) {
                    background-color: #c0392b;
                    box-shadow: 0 4px 12px ${DANGER_RED}40;
                }
                .btn-secondary {
                    background-color: #f1f1f1;
                    color: #333;
                }
                body.dark-theme .btn-secondary {
                    background-color: #4a5d77;
                    color: ${TEXT_PRIMARY_DARK};
                }
                .btn-secondary:hover:not(:disabled) {
                    background-color: #e0e0e0;
                }
                body.dark-theme .btn-secondary:hover:not(:disabled) {
                    background-color: #5d7596;
                }
                
                .close-btn {
                    background: none;
                    border: none;
                    font-size: 20px;
                    cursor: pointer;
                    color: #999;
                    padding: 5px;
                    transition: color 0.2s;
                }
                body.dark-theme .close-btn {
                    color: ${TEXT_MUTED_DARK};
                }
                .close-btn:hover {
                    color: #333;
                }
                body.dark-theme .close-btn:hover {
                    color: ${TEXT_PRIMARY_DARK};
                }
                
                /* ----------------------------------------------------------------- */
                /* TOAST NOTIFICATION STYLES */
                /* ----------------------------------------------------------------- */
                .toast-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 15px 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    font-size: 15px;
                    font-weight: 600;
                    z-index: 1001;
                    display: flex;
                    align-items: center;
                    animation: slideIn 0.3s ease-out;
                }
                
                .toast-notification.success {
                    background-color: ${SUCCESS_GREEN};
                    color: white;
                }
                .toast-notification.error {
                    background-color: ${ERROR_RED};
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

                /* ----------------------------------------------------------------- */
                /* PAGINATION STYLES */
                /* ----------------------------------------------------------------- */
                .pagination-wrap {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px 20px; 
                    margin-top: 0; /* Already integrated inside client-list-container */
                    border-top: 1px solid #e0e0e0;
                    background-color: #fcfcfc;
                }
                body.dark-theme .pagination-wrap {
                    border-top: 1px solid ${INPUT_BORDER_DARK};
                    background-color: #263240; 
                }
                
                .pagination-range-text {
                    font-size: 14px;
                    color: #777;
                    margin: 0;
                }
                body.dark-theme .pagination-range-text {
                    color: ${TEXT_MUTED_DARK};
                }

                .pagination-container {
                    display: flex;
                    gap: 5px;
                }

                .pagination-link {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-width: 32px;
                    height: 32px;
                    padding: 0 8px;
                    text-decoration: none;
                    color: ${PRIMARY_BLUE}; /* Primary Blue */
                    font-size: 14px;
                    border-radius: 4px;
                    transition: background-color 0.2s, color 0.2s;
                    font-weight: 500;
                    border: 1px solid transparent; 
                }

                .pagination-link:hover:not(.active):not(.disabled) {
                    background-color: #e0eaff;
                }
                body.dark-theme .pagination-link {
                    color: #8bb4e8;
                }
                body.dark-theme .pagination-link:hover:not(.active):not(.disabled) {
                    background-color: #4a5d77;
                }

                .pagination-link.active {
                    /* Style for the current page number */
                    background-color: ${PRIMARY_BLUE}; 
                    color: #fff;
                    font-weight: 700;
                    border-color: ${PRIMARY_BLUE};
                }
                
                .pagination-link.disabled {
                    color: #aaa;
                    cursor: not-allowed;
                }
                body.dark-theme .pagination-link.disabled {
                    color: #555;
                }

                /* Responsive adjustment for pagination */
                @media (max-width: 600px) {
                    .pagination-wrap {
                        flex-direction: column;
                        gap: 10px;
                        padding: 15px 10px;
                    }
                }

            `}</style>
        </div>
    );
};

export default ClientsList;