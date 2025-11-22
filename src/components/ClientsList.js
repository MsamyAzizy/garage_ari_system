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
    // 🏆 NEW ICONS FOR IMPORT/EXPORT
    FaFileImport, 
    FaFileExport,
} from 'react-icons/fa'; 
// Use useLocation to read navigation state
import { useNavigate, useLocation } from 'react-router-dom'; 

import SearchBar from './SearchBar'; 
import apiClient from '../utils/apiClient'; 

// Define theme colors for consistency (Used in static styling)
const PRIMARY_BLUE = '#5d9cec';
// 🏆 UPDATED FOR LIGHT THEME (Keep these for the main app)
const BG_MAIN_LIGHT = '#f4f7f9'; // Very light grey/white background
const BG_CARD_LIGHT = '#ffffff'; // White background for the card
const TEXT_PRIMARY_LIGHT = '#333333'; // Dark text
const TEXT_MUTED_LIGHT = '#747d6cff'; // Muted grey text
const INPUT_BORDER_LIGHT = '#e5e5e5'; // Light border

// 🏆 ADDED DARK MODE CONSTANTS ONLY FOR MODAL 🏆
const BG_MODAL_DARK = '#252524ff'; // Slightly lighter dark for the modal card
const TEXT_PRIMARY_DARK = '#ffffff'; // White text for modal content
const TEXT_MUTED_DARK = '#aeb8c8'; // Light grey muted text for modal content
const INPUT_BORDER_DARK = '#4a5568'; // Dark border for modal elements

const DANGER_RED = '#ff4d4f'; 
// NEW CONSTANT FOR EDIT BUTTON ORANGE 
const EDIT_ORANGE = '#ffa726'; 
// Green color for success notification (UNCOMMENTED/ADDED BACK)
const SUCCESS_GREEN = '#2ecc71'; 
const ERROR_RED = '#e74c3c'; 
// Grey/Silver color for secondary actions (UNCOMMENTED/ADDED BACK)
//const SECONDARY_ACTION_COLOR = '#95a5a6'; // Re-adding a clear color for light mode secondary actions, or using a specific dark shade for the modal cancel button.

// Define the assumed items per page (must match your backend's page size)
const ITEMS_PER_PAGE = 10;

// -----------------------------------------------------------------
// PAGINATION CONTROL COMPONENT (Google Style)
// -----------------------------------------------------------------

/**
 * Renders the Google-style numbered pagination control.
 */
const PaginationControl = ({ currentPage, totalPages, totalItems, onPageChange }) => {
    if (totalPages <= 1 && totalItems <= ITEMS_PER_PAGE) return null; // Hide if less than or equal to one page

    // Generate visible page numbers (e.g., [1, 2, 3, 4, 5])
    // Instead of showing all, let's limit it for cleaner design, typically 5 pages centered around the current page
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
        endPage = Math.min(totalPages, 5);
        startPage = 1;
    } else if (currentPage > totalPages - 2) {
        startPage = Math.max(1, totalPages - 4);
        endPage = totalPages;
    }

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }
    
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
                    className={`pagination-link prev-next-link ${currentPage === 1 ? 'disabled' : ''}`}
                    aria-disabled={currentPage === 1}
                >
                    <FaChevronLeft size={10} style={{marginRight: '5px'}}/> Previous
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
                
                {/* Optional Dots (if total pages is large and not all pages are shown) */}
                {totalPages > 5 && endPage < totalPages && <span className="pagination-dots">...</span>}
                
                {/* Optional Last Page Link (if dots are showing) */}
                {totalPages > 5 && endPage < totalPages && !pageNumbers.includes(totalPages) && (
                    <a 
                        href="/#"
                        onClick={(e) => handlePageClick(totalPages, e)}
                        className={`pagination-link ${totalPages === currentPage ? 'active' : ''}`}
                    >
                        {totalPages}
                    </a>
                )}


                {/* 'Next' Button */}
                <a 
                    href="/#" 
                    onClick={(e) => handlePageClick(currentPage + 1, e)}
                    className={`pagination-link prev-next-link ${currentPage === totalPages ? 'disabled' : ''}`}
                    aria-disabled={currentPage === totalPages}
                >
                    Next <FaChevronRight size={10} style={{marginLeft: '5px'}}/>
                </a>
            </div>
        </div>
    );
};


// -----------------------------------------------------------------
// CLIENTS LIST COMPONENT (Main)
// -----------------------------------------------------------------
const ClientsList = () => {
    // 🏆 NEW: useRef to reference the hidden file input
    const fileInputRef = useRef(null);
    
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
    
    // 🏆 ADDED: STATE for Notification
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    
    // 🏆 NEW: State for tracking import progress/status
    const [isImporting, setIsImporting] = useState(false);

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
    // 🏆 FUNCTION: Show Notification
    // -----------------------------------------------------------------
    const showToastNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        // Automatically hide notification after 4 seconds
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 4000); 
    };
    // -----------------------------------------------------------------


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
    // 🏆 UPDATED: IMPORT HANDLERS (Directly opens file dialog and uploads)
    // -----------------------------------------------------------------
    
    const handleImport = () => {
        // Only allow import if no other import is currently in progress
        if (!isImporting) {
            // Programmatically trigger the click on the hidden file input
            fileInputRef.current.click();
        } else {
            showToastNotification('An import is already in progress.', 'info');
        }
    };

    const handleFileSelection = async (event) => {
        const file = event.target.files[0];

        if (!file) {
            // User cancelled the file selection
            event.target.value = null; 
            return;
        }

        const clientName = file.name;
        
        // Reset the file input value so selecting the same file again triggers onChange
        event.target.value = null; 
        
        setIsImporting(true);
        showToastNotification(`Processing file **${clientName}**... Uploading to API.`, 'info');
        
        // 🏆 ACTUAL FILE UPLOAD LOGIC 🏆
        const formData = new FormData();
        // IMPORTANT: 'file' must match the field name your backend expects for the uploaded file
        formData.append('file', file); 
        
        try {
            // Perform the file upload using the POST method
            const response = await apiClient.post('/clients/import/', formData, {
                headers: { 
                    // This header tells the backend it's a file upload
                    'Content-Type': 'multipart/form-data' 
                },
            });
            
            // Assume the API returns { message: "..." } on success
            const successMsg = response.data.message || `Client data successfully imported from **${clientName}**!`;

            showToastNotification(successMsg, 'success');
            // Refresh the client list after a successful import
            await fetchClients(searchTerm, currentPage); 

        } catch (err) {
            console.error("Client import error:", err.response ? err.response.data : err.message);
            
            // Attempt to extract a meaningful error message from the backend response
            let errorMsg = err.response?.data?.detail || err.response?.data?.error || err.response?.data?.file?.[0] || 'Unknown error occurred.';
            
            // Fallback for network issues
            if (!err.response) {
                errorMsg = 'Network Error. Could not connect to API.';
            }

            showToastNotification(`Failed to import client data from **${clientName}**. ${errorMsg}`, 'error');
        } finally {
            setIsImporting(false);
        }
    };
    
    const handleExport = async () => {
        try {
            // Assuming your Django API has an endpoint that returns a file stream (e.g., CSV)
            const response = await apiClient.get('/clients/export/', {
                responseType: 'blob', // Important for handling file downloads
            });
            
            // Create a blob URL and trigger download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'clients_export.csv'); // Default filename
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            showToastNotification('Client data export successfully started!', 'success');

        } catch (err) {
            console.error("Client export error:", err.response ? err.response.data : err.message);
            showToastNotification('Failed to export client data. Check API endpoint.', 'error');
        }
    };
    
    // -----------------------------------------------------------------


    // -----------------------------------------------------------------
    // EFFECT TO CONSUME AND CLEAR NAVIGATION STATE
    // -----------------------------------------------------------------
    useEffect(() => {
        // Initial fetch on mount (only if search is empty, otherwise search does the initial fetch)
        if (!searchTerm) {
            fetchClients('', 1);
        }
        
        // IMPORTANT: Check for error messages from navigation state (SUCCESS MESSAGE IGNORED)
        const navState = location.state;

        if (navState && navState.errorMessage) {
            const message = navState.errorMessage;
            const type = 'error';

            // 1. CRITICAL: Clear the state *first* and synchronously (as much as possible)
            navigate(location.pathname, { replace: true, state: {} }); 
            
            // 2. Now show the notification using the cached message/type.
            showToastNotification(message, type);
            
        } else if (navState && navState.successMessage) {
             // Clears success message immediately without showing the toast here
            navigate(location.pathname, { replace: true, state: {} }); 
        }
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate, location.pathname, fetchClients, searchTerm]); 

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
            // Assuming this DELETE endpoint performs the 'deactivation' (soft delete)
            await apiClient.delete(`/clients/${clientToDelete.id}/`);
            
            // After successful deletion, refresh the current page 
            const pageToFetch = clients.length === 1 && totalClients > 1 && currentPage > 1 ? currentPage - 1 : currentPage;
            await fetchClients(searchTerm, pageToFetch);
            
            setShowDeleteModal(false);
            setClientToDelete(null);
            
            // Show success notification for deactivation
            showToastNotification(`Successfully deactivated client: **${clientName}**.`);

        } catch (err) {
            console.error("Client delete error:", err.response ? err.response.data : err.message);
            // Show error notification
            showToastNotification(`Failed to deactivate client: **${clientName}**. ${err.message || ''}`, 'error');
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
    // HELPER: Navigate to Edit Client (used by the new link)
    // -----------------------------------------------------------------
    const navigateToEditClient = (clientId) => {
        navigate(`/clients/${clientId}`);
    };
    // -----------------------------------------------------------------


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
                
                {/* 🏆 NEW: Hidden File Input (For import dialog) */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelection}
                    // IMPORTANT: Accept CSV/Excel file types
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    style={{ display: 'none' }} 
                />

                {/* 🏆 NEW: Import Button (Triggers hidden input click) */}
                <button 
                    className="btn-secondary-action import-export-btn" 
                    onClick={handleImport} 
                    title="Import Clients from CSV/Excel"
                    disabled={isImporting} // Disable button while import is running
                >
                    {isImporting ? (
                        <FaSpinner className="spin-icon" style={{ marginRight: '5px' }} />
                    ) : (
                        <FaFileImport style={{ marginRight: '5px' }} />
                    )}
                    {isImporting ? 'Importing...' : 'Import'}
                </button>
                
                {/* 🏆 NEW: Export Button */}
                <button className="btn-secondary-action import-export-btn" onClick={handleExport} title="Export All Clients to CSV/Excel">
                    <FaFileExport style={{ marginRight: '5px' }} /> Export
                </button>
                
                {/* Original Add Button */}
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
                <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px', color: TEXT_MUTED_LIGHT }}>
                    <FaSpinner className="spin" style={{ marginRight: '10px' }}/> Loading client data...
                </div>
                <style jsx>{`
                    .spin {
                        animation: spin 1s linear infinite;
                    }
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
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
                        background-color: ${BG_CARD_LIGHT};
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
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
                                        {/* Client Name Link */}
                                        <button 
                                            className="client-name-link"
                                            onClick={() => navigateToEditClient(client.id)}
                                            title={`View/Edit ${clientName}`}
                                        >
                                            {clientName}
                                        </button>
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
                                    <td style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}> 
                                        {/* 🏆 UPDATED: Edit Button with Icon */}
                                        <button 
                                            className="icon-action-btn edit-icon" 
                                            onClick={() => navigate(`/clients/${client.id}`)}
                                            title="Edit Client Profile"
                                        >
                                            <FaEdit size={14} />
                                        </button>
                                        
                                        {/* 🏆 UPDATED: Delete Button with Icon */}
                                        <button 
                                            className="icon-action-btn delete-icon" 
                                            onClick={() => prepareDelete(client)}
                                            title="Deactivate Client"
                                        >
                                            <FaTrashAlt size={14} />
                                        </button>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
                
                {/* PAGINATION CONTROL INTEGRATION */}
                <PaginationControl 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalClients}
                    onPageChange={handlePageChange}
                />
            </div>
            
            {/* CUSTOM DELETE MODAL STRUCTURE - UPDATED TEXT */}
            {showDeleteModal && clientToDelete && (
                <div className="custom-modal-backdrop">
                    <div className="custom-modal">
                        {/* Close button at the top right */}
                        <button className="modal-close-icon" onClick={cancelDelete}>
                            <FaTimes />
                        </button>

                        <div className="modal-body-content">
                            {/* Caution Icon */}
                            <FaExclamationTriangle className="modal-caution-icon" size={30} />
                            
                            {/* UPDATED: Main Question */}
                            <h4 className="modal-title-bold">Do you want to remove client?</h4>
                            
                            {/* UPDATED: Warning Text with Client Name */}
                            <p className="modal-warning-secondary">
                                If you remove client ({getClientName(clientToDelete)}), you cannot undo.
                            </p>
                        </div>
                        
                        <div className="modal-footer">
                            {/* Button 1: Cancel (Secondary action) */}
                            <button 
                                className="modal-btn btn-secondary-action-styled" 
                                onClick={cancelDelete} 
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            {/* Button 2: Remove (Primary/Danger action) - Text changed to "Remove" */}
                            <button 
                                className="modal-btn btn-danger-action-styled" 
                                onClick={executeDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 
                                    (<>
                                        <FaSpinner className="spin-icon" /> Removing...
                                    </>)
                                    : 'Remove'
                                }
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* TOAST NOTIFICATION COMPONENT (Top-Right Position) */}
            {notification.show && (
                <div className={`toast-notification ${notification.type}`}>
                    {notification.type === 'success' ? <FaCheckCircle /> : <FaExclamationTriangle />}
                    <span>{notification.message}</span>
                </div>
            )}


            {/* --- STYLES INTEGRATED FOR A SMART, MODERN LOOK (UPDATED ONLY MODAL STYLES) --- */}
            <style>{`
                /* General Page Layout - Keep Light */
                .list-page-container {
                    padding: 25px;
                    background-color: ${BG_MAIN_LIGHT}; /* Keep Light */
                    min-height: 100vh;
                    font-family: 'Inter', sans-serif, 'Helvetica Neue', Arial; 
                }
                
                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 25px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid ${INPUT_BORDER_LIGHT}; 
                }

                .page-header h2 {
                    font-size: 24px;
                    font-weight: 700;
                    color: ${TEXT_PRIMARY_LIGHT}; 
                    display: flex;
                    align-items: center;
                }
                
                .search-and-button-container {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .btn-back-to-list {
                    background: #5d9cec;
                    border: none;
                    color: white; 
                    cursor: pointer;
                    padding: 8px 15px;
                    border-radius: 6px;
                    transition: background-color 0.2s;
                    font-size: 14px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                }
                .btn-back-to-list:hover {
                    background-color: #e9ecef; 
                    color: ${TEXT_PRIMARY_LIGHT};
                }
                
                /* Action Buttons (General) */
                .btn-primary-action {
                    background-color: ${PRIMARY_BLUE};
                    color: white;
                    border: none;
                    padding: 10px 18px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: background-color 0.2s;
                    display: flex;
                    align-items: center;
                }

                .btn-primary-action:hover {
                    background-color: #4a89dc;
                }
                
                .btn-secondary-action {
                    background-color: #f0f0f0; 
                    color: ${TEXT_PRIMARY_LIGHT}; 
                    border: none;
                    padding: 10px 15px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: background-color 0.2s;
                }
                
                .btn-secondary-action:hover {
                    background-color: #e5e5e5; 
                }
                
                /* Client Table Styles - Keep Light */
                .client-list-container {
                    background-color: ${BG_CARD_LIGHT}; 
                    border-radius: 8px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
                    padding: 20px;
                }

                .client-table-responsive {
                    overflow-x: auto;
                }

                .client-table {
                    width: 100%;
                    border-collapse: separate;
                    border-spacing: 0; 
                    font-size: 15px; 
                }

                .client-table th {
                    text-align: left;
                    padding: 12px 15px;
                    background-color: #f7f7f7; /* Light header background */
                    color: ${TEXT_MUTED_LIGHT}; 
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    border-bottom: 2px solid ${INPUT_BORDER_LIGHT};
                }

                .client-table td {
                    padding: 12px 15px;
                    border-bottom: 1px solid ${INPUT_BORDER_LIGHT}; 
                    vertical-align: middle;
                    color: ${TEXT_PRIMARY_LIGHT}; 
                }

                .client-row:hover {
                    background-color: #fafafa; 
                }
                
                /* Client Name Link Styles */
                .client-name-link {
                    background: none;
                    border: none;
                    padding: 0;
                    font-weight: 700; 
                    color: ${PRIMARY_BLUE}; 
                    cursor: pointer;
                    text-align: left;
                    transition: color 0.2s;
                    text-decoration: none; 
                    font-size: 15px; 
                }
                
                .client-name-link:hover {
                    color: #4a89dc; 
                }

                .client-phone-small, .client-address-small {
                    font-size: 13px; 
                    color: ${TEXT_MUTED_LIGHT}; 
                    display: block;
                    margin-top: 2px;
                }
                
                .client-tax-id-cell, .client-notes-cell {
                    color: ${TEXT_MUTED_LIGHT}; 
                }
                
                /* Badges */
                .client-type-badge {
                    display: inline-block;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 12px; 
                    font-weight: 600;
                    text-transform: uppercase;
                }
                .type-individual {
                    background-color: #e3f2fd; 
                    color: #1565c0; 
                }
                .type-company {
                    background-color: #fffde7; 
                    color: #fbc02d; 
                }
                
                /* Action Icons */
                .icon-action-btn {
                    background: none;
                    border: 1px solid ${INPUT_BORDER_LIGHT};
                    width: 30px;
                    height: 30px;
                    border-radius: 4px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                    color: ${TEXT_MUTED_LIGHT};
                }

                .icon-action-btn:hover {
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                }

                .edit-icon {
                    color: ${EDIT_ORANGE};
                }
                .edit-icon:hover {
                    background-color: #fff3e0; 
                    border-color: ${EDIT_ORANGE};
                }

                .delete-icon {
                    color: ${DANGER_RED};
                }
                .delete-icon:hover {
                    background-color: #ffebee; 
                    border-color: ${DANGER_RED};
                }
                
                /* 🏆 Custom Modal Styles (UPDATED FOR DARK MODE) 🏆 */
                .custom-modal-backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.6); /* Slightly darker backdrop */
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1050; 
                }

                .custom-modal {
                    background-color: ${BG_MODAL_DARK}; /* 🏆 DARK MODAL BACKGROUND 🏆 */
                    padding: 30px;
                    border-radius: 10px;
                    width: 90%;
                    max-width: 400px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
                    position: relative;
                }

                .modal-close-icon {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: none;
                    border: none;
                    font-size: 18px;
                    cursor: pointer;
                    color: ${TEXT_MUTED_DARK}; /* Light grey text */
                }
                .modal-close-icon:hover {
                    color: ${TEXT_PRIMARY_DARK}; 
                }


                .modal-body-content {
                    text-align: center;
                    margin-bottom: 20px;
                }

                .modal-caution-icon {
                    color: ${DANGER_RED};
                    margin-bottom: 15px;
                }

                .modal-title-bold {
                    font-size: 20px;
                    font-weight: 700;
                    color: ${TEXT_PRIMARY_DARK}; /* White text */
                    margin: 0 0 10px 0;
                }

                .modal-warning-secondary {
                    color: ${TEXT_MUTED_DARK}; /* Muted light text */
                    font-size: 14px;
                    margin: 0;
                }
                
                .modal-footer {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    border-top: 1px solid ${INPUT_BORDER_DARK}; /* Dark border line */
                    padding-top: 20px;
                }

                .modal-btn {
                    padding: 10px 18px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: background-color 0.2s;
                }

                /* 🏆 Cancel Button Updated for Dark Mode 🏆 */
                .btn-secondary-action-styled {
                    background-color: ${INPUT_BORDER_DARK}; /* Dark grey background */
                    color: ${TEXT_PRIMARY_DARK}; /* White text */
                }
                .btn-secondary-action-styled:hover {
                    background-color: #6a7488;
                }

                .btn-danger-action-styled {
                    background-color: ${DANGER_RED};
                    color: white;
                }
                .btn-danger-action-styled:hover {
                    background-color: #cc0000;
                }
                
                /* Toast Notification Styles */
                .toast-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 10px 20px;
                    border-radius: 6px;
                    color: white;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-weight: 600;
                    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.4);
                    z-index: 1100;
                    animation: slideIn 0.3s ease-out, fadeOut 0.5s ease-in 3.5s forwards;
                }

                .toast-notification.success {
                    background-color: ${SUCCESS_GREEN}; 
                }

                .toast-notification.error {
                    background-color: ${ERROR_RED}; 
                }
                
                .toast-notification.info {
                    background-color: ${PRIMARY_BLUE}; 
                }
                
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }

                @keyframes fadeOut {
                    to { opacity: 0; }
                }

                /* Spin icon for loading states */
                .spin-icon {
                    animation: spin 1s linear infinite;
                    margin-right: 5px;
                }
                
                /* ---------------------------------------------------- */
                /* PAGINATION STYLES (Keep Light) */
                /* ---------------------------------------------------- */
                
                .pagination-wrap {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 15px;
                    margin-top: 20px;
                    border-top: 1px solid ${INPUT_BORDER_LIGHT};
                }

                .pagination-range-text {
                    font-size: 14px;
                    color: ${TEXT_MUTED_LIGHT};
                    font-weight: 500;
                    margin: 0;
                }

                .pagination-container {
                    display: flex;
                    align-items: center;
                    gap: 5px; 
                }

                .pagination-link {
                    text-decoration: none;
                    color: ${PRIMARY_BLUE};
                    padding: 8px 12px;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 500;
                    transition: background-color 0.2s, color 0.2s;
                    display: flex;
                    align-items: center;
                    line-height: 1; 
                }
                
                .pagination-link:hover:not(.active):not(.disabled) {
                    background-color: #e3f2fd; 
                }

                .pagination-link.active {
                    background-color: ${PRIMARY_BLUE};
                    color: white;
                    font-weight: 60;
                }

                .pagination-link.disabled {
                    color: #bdbdbd; 
                    opacity: 0.8;
                    cursor: not-allowed;
                    pointer-events: none; 
                }
                
                /* Style for "Previous" and "Next" to be slightly different if desired */
                .pagination-link.prev-next-link {
                    padding: 8px 15px; 
                    border: 1px solid ${INPUT_BORDER_LIGHT};
                }
                
                .pagination-link.prev-next-link:hover:not(.disabled) {
                    border-color: #c0c0c0;
                }

                .pagination-dots {
                    font-size: 16px;
                    color: ${TEXT_MUTED_LIGHT};
                    padding: 0 5px;
                }
                
                /* ---------------------------------------------------- */
            `}</style>
        </div>
    );
};

export default ClientsList;