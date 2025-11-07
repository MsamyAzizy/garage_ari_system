// src/components/ClientsList.js - Fetches client data from the Django API

import React, { useState, useEffect, useCallback } from 'react';
// Added FaCheckCircle for the success notification icon
import { 
    FaUserFriends, 
    FaPlusCircle, 
    FaTimes, 
    FaCheckCircle, 
    FaClipboardList, 
    FaSpinner, 
    FaChevronLeft, 
    FaChevronRight,
    FaArrowLeft // Added icon for "Back" button
} from 'react-icons/fa'; 
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
    // Function to clear search and return to the main list
    // -----------------------------------------------------------------
    const handleClearSearch = () => {
        // Clear the search term state
        setSearchTerm('');
        // Fetch clients without a search term, starting on page 1
        fetchClients('', 1);
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
            // Use Math.max(1, currentPage) to ensure we don't land on page 0 if the last item of a page was deleted.
            const pageToFetch = clients.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
            await fetchClients(searchTerm, pageToFetch);
            
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
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {/* Back Button first if search is active */}
                {searchTerm && (
                    <button 
                        className="btn-back-to-list" 
                        onClick={handleClearSearch}
                        title="Clear search filter and view all clients"
                    >
                        <FaArrowLeft style={{ marginRight: '5px' }}/> Back to All Clients
                    </button>
                )}
                <h2 style={{ flexGrow: 0, marginLeft: searchTerm ? '20px' : '0' }}>
                    <FaUserFriends style={{ marginRight: '8px' }}/> Clients ({loading ? '...' : totalClients})
                </h2>
            </div>
            
            <div className="search-and-button-container">
                <SearchBar 
                    onSearch={handleSearch} 
                    initialTerm={searchTerm} // Added to keep search term visible in search box
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
                    font-size: 15px; 
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
                
                /* 🏆 UPDATED STYLE: Back to All Clients Button (GREEN) */
                .btn-back-to-list {
                    padding: 5px 10px;
                    background-color: ${SUCCESS_GREEN}; /* Green background */
                    color: white; /* White text for contrast */
                    border: 1px solid ${SUCCESS_GREEN}; 
                    border-radius: 4px;
                    font-size: 14px;
                    font-weight: 600; /* Bolder font weight */
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    transition: background-color 0.2s, opacity 0.2s;
                    box-shadow: 0 2px 4px rgba(46, 204, 113, 0.3); /* Subtle green shadow */
                }
                .btn-back-to-list:hover {
                    background-color: #27ae60; /* Darker green on hover */
                    border-color: #27ae60;
                }
                body.dark-theme .btn-back-to-list {
                    background-color: ${SUCCESS_GREEN};
                    color: white;
                    border-color: ${SUCCESS_GREEN};
                }
                body.dark-theme .btn-back-to-list:hover {
                    background-color: #27ae60;
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
                
                /* --- MODAL STYLES --- */
                .custom-modal-backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.6);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1050;
                }
                .custom-modal {
                    background-color: #ffffff;
                    padding: 25px;
                    border-radius: 10px;
                    width: 90%;
                    max-width: 500px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                    animation: dropIn 0.3s ease-out;
                }
                body.dark-theme .custom-modal {
                    background-color: ${BG_CARD_DARK};
                    color: ${TEXT_PRIMARY_DARK};
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #e9ecef;
                    padding-bottom: 10px;
                    margin-bottom: 15px;
                }
                body.dark-theme .modal-header {
                    border-bottom-color: ${INPUT_BORDER_DARK};
                }
                
                .modal-title {
                    font-size: 20px;
                    font-weight: 600;
                    color: #333;
                }
                body.dark-theme .modal-title {
                    color: ${TEXT_PRIMARY_DARK};
                }

                .close-btn {
                    background: none;
                    border: none;
                    font-size: 20px;
                    cursor: pointer;
                    color: #aaa;
                    transition: color 0.2s;
                }
                .close-btn:hover {
                    color: #555;
                }
                body.dark-theme .close-btn {
                    color: ${TEXT_MUTED_DARK};
                }
                
                .modal-body {
                    font-size: 15px;
                    line-height: 1.6;
                    color: #555;
                }
                body.dark-theme .modal-body {
                    color: ${TEXT_MUTED_DARK};
                }
                
                .client-name-highlight {
                    font-weight: bold;
                    color: ${PRIMARY_BLUE};
                    margin-left: 5px;
                }
                body.dark-theme .client-name-highlight {
                    color: #79b0f4;
                }

                .warning-text {
                    color: ${DANGER_RED};
                    margin-top: 15px;
                    padding: 10px;
                    border: 1px solid ${DANGER_RED}40;
                    background-color: #fff0f0;
                    border-radius: 6px;
                }
                body.dark-theme .warning-text {
                    background-color: #5c1f24;
                    border-color: #7e2a33;
                    color: #f5c6cb;
                }

                .modal-footer {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    padding-top: 15px;
                    border-top: 1px solid #e9ecef;
                    margin-top: 20px;
                }
                body.dark-theme .modal-footer {
                    border-top-color: ${INPUT_BORDER_DARK};
                }

                .modal-btn {
                    padding: 10px 15px;
                    border-radius: 6px;
                    font-size: 15px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: opacity 0.2s, background-color 0.2s;
                }
                
                .btn-danger {
                    background-color: ${DANGER_RED};
                    color: white;
                    border: none;
                }
                .btn-danger:hover {
                    background-color: #c9302c;
                }
                
                .modal-btn.btn-secondary {
                    background-color: #f1f1f1;
                    color: #333;
                    border: 1px solid #ddd;
                }
                .modal-btn.btn-secondary:hover {
                    background-color: #e0e0e0;
                }
                body.dark-theme .modal-btn.btn-secondary {
                    background-color: #4a5d77;
                    color: ${TEXT_PRIMARY_DARK};
                    border: 1px solid #5a6e87;
                }
                body.dark-theme .modal-btn.btn-secondary:hover {
                    background-color: #5a6e87;
                }
                .modal-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                
                @keyframes dropIn {
                    from { transform: translateY(-50px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
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
                    background-color: ${DANGER_RED};
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
                    background-color: #fdfdfd; 
                    border-top: 1px solid #e0e0e0;
                    border-radius: 0 0 12px 12px;
                }
                body.dark-theme .pagination-wrap {
                    background-color: #334050;
                    border-top: 1px solid #38465b;
                }

                .pagination-range-text {
                    font-size: 15px;
                    color: #777;
                    margin: 0;
                }
                body.dark-theme .pagination-range-text {
                    color: ${TEXT_MUTED_DARK};
                }

                .pagination-container {
                    display: flex;
                    gap: 5px;
                    align-items: center;
                }

                .pagination-link {
                    padding: 8px 12px;
                    border-radius: 6px;
                    text-decoration: none;
                    color: ${PRIMARY_BLUE};
                    font-weight: 500;
                    font-size: 14px;
                    transition: background-color 0.2s, color 0.2s;
                    display: flex;
                    align-items: center;
                }

                .pagination-link:hover:not(.active):not(.disabled) {
                    background-color: #e6f7ff;
                }
                body.dark-theme .pagination-link:hover:not(.active):not(.disabled) {
                    background-color: #5d9cec20;
                }

                .pagination-link.active {
                    background-color: ${PRIMARY_BLUE};
                    color: white;
                    pointer-events: none;
                }

                .pagination-link.disabled {
                    color: #aaaaaa;
                    cursor: not-allowed;
                    opacity: 0.6;
                }
                body.dark-theme .pagination-link.disabled {
                    color: #777;
                }
                
                /* --- Primary Action Button (Add Client) --- */
                .btn-primary-action {
                    padding: 10px 15px;
                    border: none;
                    border-radius: 8px;
                    background-color: ${PRIMARY_BLUE};
                    color: white;
                    font-size: 15px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    transition: background-color 0.2s;
                }
                .btn-primary-action:hover {
                    background-color: #4a90e2;
                }


                /* --- Media Queries --- */
                @media (max-width: 900px) {
                    .page-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    /* Ensure back button is next to title on small screens */
                    .page-header > div:first-child {
                        width: 100%;
                        justify-content: space-between;
                        margin-bottom: 10px;
                    }

                    .search-and-button-container {
                        width: 100%;
                        margin-top: 5px;
                        flex-direction: column;
                        align-items: stretch;
                    }
                    .search-and-button-container > * {
                        width: 100%;
                    }
                    .btn-back-to-list {
                        margin-left: 0; /* Clear left margin on small screens */
                    }
                    .client-table-responsive {
                        overflow-x: auto;
                    }
                    .pagination-wrap {
                        flex-direction: column;
                        gap: 10px;
                    }
                }
            `}</style>
        </div>
    );
};

export default ClientsList;