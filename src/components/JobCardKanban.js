// src/components/JobCardKanban.js

import React, { useState, useEffect, useCallback } from 'react';
// import apiClient from '../utils/apiClient'; <--- REMOVED THIS LINE
import { 
    FaCar, FaUser, FaTag, FaClock, FaMoneyBillWave, FaSpinner, FaPlus, 
    FaWrench, FaTruck, FaUserTie, 
    FaThList, FaTable, FaChartBar, FaThLarge, // Icons for the new view options
    FaSortUp, FaSortDown, FaSort, FaEye, FaEdit, FaTrash,
    FaExclamationTriangle,
    FaCheckCircle, // Success toast icon
    FaArchive, // Archive icon
    FaUndoAlt // Unarchive icon
} from 'react-icons/fa';
import { VscLoading } from 'react-icons/vsc'; 
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'; 

// --- Configuration ---
const STATUS_MAP = {
    // 🏆 Enhanced Color Palette
    'OPEN': { title: "Open Jobs", color: "#1D4ED8", description: "Jobs waiting for allocation or first inspection.", icon: FaWrench }, // Blue-700
    'IN_PROGRESS': { title: "In Progress", color: "#F59E0B", description: "Jobs actively being worked on by a technician.", icon: FaSpinner }, // Amber-500
    'READY_FOR_PICKUP': { title: "Ready for Pickup", color: "#10B981", description: "Work complete, invoice generated, ready for client collection.", icon: FaTruck }, // Emerald-500
    'PAID_CLOSED': { title: "Paid & Closed", color: "#6B7280", description: "Job completed, payment received, and filed.", icon: FaTag }, // Gray-500
};

// --- View Options Configuration ---
const VIEWS = [
    { key: 'KANBAN', icon: FaThLarge, title: 'Kanban View' },
    { key: 'LIST', icon: FaThList, title: 'List View' },
    { key: 'PIVOT', icon: FaTable, title: 'Pivot Table' },
    { key: 'CHART', icon: FaChartBar, title: 'Chart View' },
];

// -----------------------------------------------------------------
// Status Chip Component (for List View)
// -----------------------------------------------------------------
const StatusChip = ({ statusKey }) => {
    const statusInfo = STATUS_MAP[statusKey] || STATUS_MAP.OPEN;
    return (
        <span className="status-chip" style={{ backgroundColor: statusInfo.color + '20', color: statusInfo.color }}>
            {statusInfo.title}
        </span>
    );
};

// View Switcher Component 
const ViewSwitcher = ({ currentView, onViewChange }) => {
    const activeView = VIEWS.find(v => v.key === currentView);

    return (
        <div className="view-switcher-container">
            {VIEWS.map((view) => (
                <button
                    key={view.key}
                    title={view.title}
                    className={`view-btn ${currentView === view.key ? 'active' : ''}`}
                    onClick={() => onViewChange(view.key)}
                >
                    <view.icon size={18} /> 
                    {currentView === view.key && (
                        <span className="active-view-text">{activeView.title.replace(' View', '')}</span>
                    )}
                </button>
            ))}
        </div>
    );
};


// --- 1. Component for Individual Job Card (Draggable Element) ---
const JobCardItem = React.memo(({ card, index }) => {
    
    const navigate = useNavigate();
    
    const statusKey = card.status in STATUS_MAP ? card.status : 'OPEN';
    const statusColor = STATUS_MAP[statusKey]?.color || '#9CA3AF';

    const handleCardClick = () => {
        navigate(`/jobcards/${card.id}/detail`);
    };

    return (
        <Draggable draggableId={String(card.id)} index={index}>
            {(provided, snapshot) => (
                <div 
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="job-card-item"
                    onClick={handleCardClick}
                    style={{
                        // Kanban Card Styling
                        backgroundColor: snapshot.isDragging ? '#EBF8FF' : 'white', // Lighter color when dragging
                        borderColor: snapshot.isDragging ? statusColor : '#E5E7EB',
                        borderLeftColor: statusColor,
                        boxShadow: snapshot.isDragging ? `0 8px 20px rgba(0, 0, 0, 0.15), 0 0 0 2px ${statusColor}50` : '0 2px 8px rgba(0, 0, 0, 0.08)',
                        ...provided.draggableProps.style,
                    }}
                >
                    <div className="card-header-kanban">
                        <span className="job-number-tag">
                            <FaTag size={10} style={{ marginRight: '5px' }}/> <span style={{ fontWeight: 500 }}>{card.job_number}</span>
                        </span>
                        <span className="job-due-date">
                            <FaClock size={10} style={{ marginRight: '3px' }}/> {card.date_in}
                        </span>
                    </div>
                    
                    <h4 className="card-client-name" style={{ fontWeight: 600 }}>
                        <FaUser size={12} style={{ marginRight: '5px', color: statusColor }} /> {card.client_name}
                    </h4>
                    
                    <p className="card-vehicle-info">
                        <FaCar size={12} style={{ marginRight: '5px' }} /> {card.vehicle_model} ({card.vehicle_license})
                    </p>
                    
                    <p className="card-technician-info">
                        <FaUserTie size={12} style={{ marginRight: '5px', color: '#4B5563' }} /> Tech: <span style={{ fontWeight: 500 }}>{card.assigned_technician || 'Unassigned'}</span>
                    </p>
                    
                    <div className="card-footer-kanban">
                        <FaMoneyBillWave size={12} style={{ marginRight: '5px' }} /> Total Due: <span style={{ fontWeight: 700, color: STATUS_MAP.READY_FOR_PICKUP.color }}>{card.total_due ? `$${card.total_due.toFixed(2)}` : 'N/A'}</span>
                    </div>
                </div>
            )}
        </Draggable>
    );
});


// --- 2. Component for Kanban Column (Droppable Target) ---
const KanbanColumn = ({ statusTitle, statusKey, cards, color, description, Icon }) => {
    return (
        <Droppable droppableId={statusKey}>
            {(provided, snapshot) => (
                <div 
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`kanban-column ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                    style={{
                        backgroundColor: snapshot.isDraggingOver ? color + '08' : '#FFFFFF',
                        border: snapshot.isDraggingOver ? `1px dashed ${color}` : '1px solid #E5E7EB',
                        boxShadow: snapshot.isDraggingOver ? `0 0 10px ${color}30` : '0 8px 20px rgba(0, 0, 0, 0.05)',
                    }}
                >
                    <div className="column-header-sticky" style={{ borderBottomColor: color, backgroundColor: snapshot.isDraggingOver ? color + '08' : '#FFFFFF' }}>
                        <h3 className="column-title-kanban" style={{ color: color, fontWeight: 700 }}>
                            <Icon size={16} style={{ marginRight: '10px' }} />
                            {statusTitle} <span className="card-count">({cards.length})</span>
                        </h3>
                        <p className="column-description">{description}</p> 
                    </div>
                    
                    <div className="column-content-kanban">
                        {cards.length > 0 ? (
                            cards.map((card, index) => (
                                <JobCardItem 
                                    key={card.id} 
                                    card={card} 
                                    index={index} 
                                />
                            ))
                        ) : (
                            <p className="no-cards">No jobs currently in this stage.</p>
                        )}
                        {provided.placeholder}
                    </div>
                </div>
            )}
        </Droppable>
    );
};


// -----------------------------------------------------------------
// Custom Delete Confirmation Modal Component
// -----------------------------------------------------------------
const DeleteConfirmationModal = ({ job, onConfirm, onCancel }) => {
    if (!job) return null;

    return (
        <div className="custom-modal-overlay">
            <div className="custom-modal-content">
                <button className="modal-close-btn" onClick={onCancel} title="Close">
                    &times;
                </button>
                <div className="modal-body-content">
                    <FaExclamationTriangle size={36} color="#F59E0B" className="modal-warning-icon"/>
                    
                    <h2 className="modal-title">Remove Job Card {job.job_number}?</h2>
                    
                    <p className="modal-message">
                        You are about to delete **{job.job_number}** belonging to **{job.client_name}**. <br/>
                        <span style={{ fontWeight: 600, color: '#F87171' }}>You cannot undo this action.</span>
                    </p>
                </div>
                
                <div className="modal-actions">
                    <button className="modal-btn modal-cancel-btn" onClick={onCancel}>
                        Cancel
                    </button>
                    <button className="modal-btn modal-remove-btn" onClick={onConfirm}>
                        Remove
                    </button>
                </div>
            </div>
        </div>
    );
};

// -----------------------------------------------------------------
// Toast Notification Component
// -----------------------------------------------------------------
const ToastNotification = ({ message, onClose }) => {
    // Automatically close the toast after 3000ms (3 seconds)
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000); 
            return () => clearTimeout(timer); // Cleanup timer on unmount/message change
        }
    }, [message, onClose]);

    if (!message) return null;

    return (
        <div className="toast-notification">
            <FaCheckCircle size={20} style={{ color: '#10B981' }}/>
            <p className="toast-message">{message}</p>
            <button onClick={onClose} className="toast-close-btn">&times;</button>
        </div>
    );
};


// -----------------------------------------------------------------
// 3. Main JobCardKanban Component 
// -----------------------------------------------------------------
const JobCardKanban = () => {
    const navigate = useNavigate();
    const [currentView, setCurrentView] = useState('KANBAN'); 
    const [kanbanData, setKanbanData] = useState({});
    // New state to toggle between active list and archived list
    const [showArchived, setShowArchived] = useState(false); 
    const [archivedJobs, setArchivedJobs] = useState([
        // MOCK ARCHIVED DATA
        { id: 10, job_number: 'JC-A10', client_name: 'Archived Client Inc.', vehicle_model: 'Old Sedan', vehicle_license: 'T000ARC', total_due: 100.00, date_in: '2024-01-01', status: 'PAID_CLOSED', assigned_technician: 'Sam B.' },
    ]); 
    const [statusKeys, setStatusKeys] = useState(Object.keys(STATUS_MAP).filter(key => key !== 'PAID_CLOSED')); 
    const [isLoading, setIsLoading] = useState(true);
    const [generalError, setGeneralError] = useState(null); 
    const [isUpdating, setIsUpdating] = useState(false); 
    
    // State for List View Sorting
    const [sortConfig, setSortConfig] = useState({ key: 'date_in', direction: 'descending' });

    // New State for Delete Modal
    const [jobToDelete, setJobToDelete] = useState(null); 
    
    // New State for Toast Notification
    const [toastMessage, setToastMessage] = useState(null);
    
    const fetchKanbanData = useCallback(async () => {
        setIsLoading(true);
        setGeneralError(null);
        
        // MOCK DATA 
        const MOCK_DATA = {
            statuses: ['OPEN', 'IN_PROGRESS', 'READY_FOR_PICKUP'], 
            columns: {
                'OPEN': [
                    { id: 1, job_number: 'JC-001', client_name: 'Azizi Bongo Motors', vehicle_model: 'Patrol', vehicle_license: 'T789DFG', total_due: 150.00, date_in: '2025-11-01', status: 'OPEN', assigned_technician: null },
                    { id: 4, job_number: 'JC-004', client_name: 'Mwana Pesa', vehicle_model: 'X5', vehicle_license: 'T999LMN', total_due: 2250.50, date_in: '2025-11-04', status: 'OPEN', assigned_technician: 'Jane' },
                ],
                'IN_PROGRESS': [
                    { id: 2, job_number: 'JC-002', client_name: 'John Doe', vehicle_model: 'Corolla', vehicle_license: 'T123ABC', total_due: 450.50, date_in: '2025-11-02', status: 'IN_PROGRESS', assigned_technician: 'Peter M.' },
                ],
                'READY_FOR_PICKUP': [
                    { id: 3, job_number: 'JC-003', client_name: 'Jane Smith', vehicle_model: 'CRV', vehicle_license: 'T456XYZ', total_due: 75.00, date_in: '2025-11-03', status: 'READY_FOR_PICKUP', assigned_technician: 'Peter M.' },
                    { id: 5, job_number: 'JC-005', client_name: 'Alpha Transporters', vehicle_model: 'Truck 10T', vehicle_license: 'T000AAA', total_due: 500.00, date_in: '2025-11-05', status: 'READY_FOR_PICKUP', assigned_technician: 'Jane' },
                ]
            }
        };
        
        try {
            // API calls removed for mock implementation
            setKanbanData(MOCK_DATA.columns);
            setStatusKeys(MOCK_DATA.statuses);
            
        } catch (err) {
            console.error("Failed to fetch Kanban data:", err.response ? err.response.data : err.message);
            setGeneralError('Failed to load job cards. Check API status. (Showing mock data)');
            setKanbanData(MOCK_DATA.columns);
            setStatusKeys(MOCK_DATA.statuses);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchKanbanData();
    }, [fetchKanbanData]); 

    // Helper to get all ACTIVE jobs for List and Pivot Views
    const getAllJobs = useCallback(() => {
        return Object.values(kanbanData).flat();
    }, [kanbanData]);
    
    // Helper to get jobs based on view (Active or Archived)
    const getJobsForView = useCallback(() => {
        return showArchived ? archivedJobs : getAllJobs();
    }, [showArchived, archivedJobs, getAllJobs]);


    // Function to handle sort request
    const requestSort = (key) => {
        let direction = 'ascending';
        // If we are already sorting by this key and it's ascending, switch to descending
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    // Function to get sorted jobs
    const getSortedJobs = useCallback(() => {
        let sortableItems = [...getJobsForView()]; // Use getJobsForView()
        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                const aValue = a[sortConfig.key] || '';
                const bValue = b[sortConfig['key']] || '';

                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [getJobsForView, sortConfig]);

    // --- Core Delete Logic (Executed after modal confirmation) ---
    const executeDelete = useCallback((jobId, job_number) => {
        setIsUpdating(true);
        console.log(`Attempting to delete job ID: ${jobId}`);
        
        // 1. Check if job is in Kanban (Active) data
        const newKanbanData = { ...kanbanData };
        let found = false;
        
        for (const statusKey of Object.keys(newKanbanData)) {
            const initialLength = newKanbanData[statusKey].length;
            newKanbanData[statusKey] = newKanbanData[statusKey].filter(job => job.id !== jobId);
            if (newKanbanData[statusKey].length < initialLength) {
                found = true;
                break;
            }
        }

        // 2. Check if job is in Archived data
        let newArchivedJobs = [...archivedJobs];
        if (!found) {
            const initialLength = newArchivedJobs.length;
            newArchivedJobs = newArchivedJobs.filter(job => job.id !== jobId);
            if (newArchivedJobs.length < initialLength) {
                found = true;
            }
        }


        if (found) {
            setKanbanData(newKanbanData);
            setArchivedJobs(newArchivedJobs);
            
            // Simulate API delay
            setTimeout(() => {
                setIsUpdating(false);
                // SUCCESS MESSAGE NOW GOES TO TOAST
                setToastMessage(`Job Card ${job_number} successfully deleted.`);
                console.log(`Job Card ${jobId} deleted successfully (MOCK).`);
            }, 500);
        } else {
            setIsUpdating(false);
            setGeneralError(`Error: Could not find job card ${job_number} to delete.`);
        }
        setJobToDelete(null); // Close the modal
    }, [kanbanData, archivedJobs]);

    // --- Core Archive/Unarchive Logic ---
    const handleArchiveToggle = useCallback((job, isArchiving) => {
        setIsUpdating(true);
        const job_number = job.job_number;
        
        if (isArchiving) {
            // Archive the job
            let newKanbanData = { ...kanbanData };
            let archivedJob = null;

            for (const statusKey of Object.keys(newKanbanData)) {
                const index = newKanbanData[statusKey].findIndex(j => j.id === job.id);
                if (index !== -1) {
                    // Extract the job from the active list
                    archivedJob = newKanbanData[statusKey].splice(index, 1)[0];
                    break;
                }
            }
            
            if (archivedJob) {
                // Add to archived list
                setKanbanData(newKanbanData);
                setArchivedJobs(prev => [...prev, archivedJob]);
                
                setTimeout(() => {
                    setIsUpdating(false);
                    setToastMessage(`Job Card ${job_number} successfully archived.`);
                }, 500);
            } else {
                setIsUpdating(false);
                setGeneralError(`Error: Job ${job_number} not found in active lists for archiving.`);
            }

        } else {
            // Unarchive the job
            let newArchivedJobs = archivedJobs.filter(j => j.id !== job.id);
            const statusKey = job.status in STATUS_MAP ? job.status : 'OPEN';
            
            // Add back to the Kanban data in its original status column
            setArchivedJobs(newArchivedJobs);
            setKanbanData(prev => ({
                ...prev,
                [statusKey]: [...(prev[statusKey] || []), job]
            }));

            setTimeout(() => {
                setIsUpdating(false);
                setToastMessage(`Job Card ${job_number} successfully unarchived.`);
            }, 500);
        }

    }, [kanbanData, archivedJobs]);

    // --- Modal Handler (Shows the modal) ---
    const handleShowDeleteModal = useCallback((job) => {
        setJobToDelete(job);
    }, []);

    // --- Modal Confirmation Handler ---
    const handleConfirmDelete = useCallback(() => {
        if (jobToDelete) {
            executeDelete(jobToDelete.id, jobToDelete.job_number);
        }
    }, [jobToDelete, executeDelete]);

    // --- Modal Cancellation Handler ---
    const handleCancelDelete = useCallback(() => {
        setJobToDelete(null);
    }, []);

    // --- Toast Close Handler ---
    const handleCloseToast = useCallback(() => {
        setToastMessage(null);
    }, []);
    // ------------------------------------

    // --- View Change Handler (Resets showArchived flag when switching away from List View) ---
    const handleViewChange = useCallback((newView) => {
        setCurrentView(newView);
        // If switching away from List view, reset the archived toggle state
        if (newView !== 'LIST') {
            setShowArchived(false);
        }
    }, []);


    // 🔑 CORE DRAG AND DROP LOGIC
    const onDragEnd = async (result) => {
        if (currentView !== 'KANBAN' || !result.destination || isUpdating) {
            return;
        }
        
        const { source, destination, draggableId } = result;

        if (source.droppableId === destination.droppableId &&
            source.index === destination.index) {
            return;
        }

        const sourceColumnKey = source.droppableId;
        const destinationColumnKey = destination.droppableId;
        const cardId = draggableId;
        
        // 1. Optimistic UI update
        const newKanbanData = { ...kanbanData };
        const sourceCards = Array.from(newKanbanData[sourceColumnKey]);
        const destinationCards = (sourceColumnKey === destinationColumnKey) 
                                 ? sourceCards 
                                 : Array.from(newKanbanData[destinationColumnKey] || []); 
        
        const [movedCard] = sourceCards.splice(source.index, 1);
        movedCard.status = destinationColumnKey; 

        destinationCards.splice(destination.index, 0, movedCard);
        
        setKanbanData({
            ...newKanbanData,
            [sourceColumnKey]: sourceCards,
            [destinationColumnKey]: destinationCards
        });

        // 2. Persist the change to the backend API
        setIsUpdating(true);
        
        try {
            console.log(`Job Card ${cardId} status updated to ${destinationColumnKey} successfully (MOCK).`);
            
        } catch (apiError) {
            console.error("Failed to update Job Card status via API. Reverting state.", apiError);
            setGeneralError("Error: Failed to update job status on server. Reverting...");
            fetchKanbanData(); 
            
        } finally {
            setIsUpdating(false);
        }
    };

    // 🛑 Component for List View
    const renderListView = () => {
        const sortedJobs = getSortedJobs();
        const getSortIcon = (key) => {
            if (sortConfig.key !== key) return <FaSort size={12} style={{ opacity: 0.4 }} />;
            if (sortConfig.direction === 'ascending') return <FaSortUp size={12} />;
            return <FaSortDown size={12} />;
        };

        return (
            <div className="list-view-container">
                <p className="list-summary">
                    Showing <span style={{ fontWeight: 700 }}>{sortedJobs.length}</span> {showArchived ? 'Archived' : 'Active'} Job Cards.
                </p>
                <div className="table-responsive">
                    <table className="job-list-table">
                        <thead>
                            <tr>
                                {/* Headers are clickable for sorting */}
                                <th onClick={() => requestSort('status')}>Status {getSortIcon('status')}</th>
                                <th onClick={() => requestSort('job_number')}>Job # {getSortIcon('job_number')}</th>
                                <th onClick={() => requestSort('client_name')}>Client Name {getSortIcon('client_name')}</th>
                                <th onClick={() => requestSort('vehicle_model')}>Vehicle {getSortIcon('vehicle_model')}</th>
                                <th onClick={() => requestSort('assigned_technician')}>Tech {getSortIcon('assigned_technician')}</th>
                                <th onClick={() => requestSort('date_in')}>Date In {getSortIcon('date_in')}</th>
                                <th onClick={() => requestSort('total_due')}>Total Due {getSortIcon('total_due')}</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedJobs.length > 0 ? (
                                sortedJobs.map(job => (
                                    <tr key={job.id} className={showArchived ? 'archived-row' : ''}>
                                        <td><StatusChip statusKey={job.status} /></td>
                                        <td className="job-number-cell" onClick={() => navigate(`/jobcards/${job.id}/detail`)}>{job.job_number}</td>
                                        <td>{job.client_name}</td>
                                        <td>{job.vehicle_model} ({job.vehicle_license})</td>
                                        <td>{job.assigned_technician || 'Unassigned'}</td>
                                        <td>{job.date_in}</td>
                                        <td className="total-due-cell"><span style={{ fontWeight: 700 }}>${job.total_due.toFixed(2)}</span></td>
                                        <td className="actions-cell">
                                            {/* Standard Actions */}
                                            <button title="View Detail" className="action-btn action-view" onClick={() => navigate(`/jobcards/${job.id}/detail`)}><FaEye size={16} /></button>
                                            
                                            {!showArchived && (
                                                <button title="Edit Job" className="action-btn action-edit"><FaEdit size={16} /></button>
                                            )}
                                            
                                            {/* Archive/Unarchive Toggle */}
                                            {showArchived ? (
                                                <button 
                                                    title="Unarchive Job" 
                                                    className="action-btn action-unarchive"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); 
                                                        handleArchiveToggle(job, false); // False = Unarchive
                                                    }}
                                                    disabled={isUpdating}
                                                >
                                                    <FaUndoAlt size={16} />
                                                </button>
                                            ) : (
                                                <button 
                                                    title="Archive Job" 
                                                    className="action-btn action-archive"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); 
                                                        handleArchiveToggle(job, true); // True = Archive
                                                    }}
                                                    disabled={isUpdating}
                                                >
                                                    <FaArchive size={16} />
                                                </button>
                                            )}
                                            
                                            {/* Delete Action (Available on both views) */}
                                            <button 
                                                title="Delete Job" 
                                                className="action-btn action-delete"
                                                onClick={(e) => {
                                                    e.stopPropagation(); 
                                                    handleShowDeleteModal(job); 
                                                }}
                                                disabled={isUpdating}
                                            >
                                                <FaTrash size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="no-jobs-row">No {showArchived ? 'archived' : 'active'} job cards found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };
    
    // 🛑 Component for Pivot View
    const renderPivotView = () => {
        const allJobs = getAllJobs(); // Only active jobs for pivot
        
        // Simple Mock Aggregation: Sum of Total Due per Technician
        const technicianRevenue = allJobs.reduce((acc, job) => {
            const tech = job.assigned_technician || 'Unassigned';
            acc[tech] = (acc[tech] || 0) + job.total_due;
            return acc;
        }, {});

        // Calculate Grand Total for the footer
        const grandTotal = Object.values(technicianRevenue).reduce((sum, revenue) => sum + revenue, 0);

        return (
            <div className="pivot-view-container">
                <p className="pivot-summary">Total active revenue aggregated by technician. (Default View)</p>
                <div className="table-responsive pivot-responsive">
                    <table className="pivot-table">
                        <thead>
                            <tr>
                                <th className="pivot-row-header">Technician</th>
                                <th className="pivot-value-header">Total Due (USD)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(technicianRevenue).map(([tech, revenue]) => (
                                <tr key={tech}>
                                    <td className="pivot-row-cell"><span style={{ fontWeight: 600 }}>{tech}</span></td>
                                    <td className="pivot-value-cell">${revenue.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td className="pivot-footer-cell"><span style={{ fontWeight: 700 }}>GRAND TOTAL</span></td>
                                <td className="pivot-footer-cell total-due-footer"><span style={{ fontWeight: 700 }}>${grandTotal.toFixed(2)}</span></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        );
    };

    // 🛑 Component for Chart View
    const renderChartView = () => {
        const allJobs = getAllJobs(); // Only active jobs for chart
        if (allJobs.length === 0) {
            return (
                <div className="placeholder-view">
                    No job data available to generate charts.
                </div>
            );
        }

        // --- Chart 1 Data: Status Breakdown (Count) ---
        const statusCounts = allJobs.reduce((acc, job) => {
            const status = job.status in STATUS_MAP ? job.status : 'OPEN';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});
        const totalJobs = allJobs.length;
        
        // --- Chart 2 Data: Revenue by Technician ---
        const technicianRevenue = allJobs.reduce((acc, job) => {
            const tech = job.assigned_technician || 'Unassigned';
            acc[tech] = (acc[tech] || 0) + job.total_due;
            return acc;
        }, {});
        const maxRevenue = Math.max(...Object.values(technicianRevenue));
        // Ensure maxRevenue is at least 1 to avoid division by zero/NaN
        const calculatedMaxRevenue = maxRevenue > 0 ? maxRevenue : 1;

        
        // Helper to generate pie chart segments (Mock for visualization)
        const renderPieSegments = () => {
            // Note: In a real app, this would use SVG or a charting library to draw a dynamic pie chart.
            // Here, we just render the legend blocks visually.
            return Object.entries(statusCounts).map(([statusKey, count], index) => {
                const percentage = (count / totalJobs) * 100;
                const statusInfo = STATUS_MAP[statusKey] || STATUS_MAP.OPEN;
                
                return (
                    <div key={statusKey} className="chart-legend-item">
                        <span style={{ backgroundColor: statusInfo.color }} className="legend-dot"></span>
                        {statusInfo.title}: <span style={{ fontWeight: 600 }}>{count}</span> Jobs ({percentage.toFixed(1)}%)
                    </div>
                );
            });
        };
        
        // Helper to generate bar chart bars
        const renderBarChart = () => {
            return Object.entries(technicianRevenue).map(([tech, revenue]) => {
                const barWidth = (revenue / calculatedMaxRevenue) * 90; // Max width is 90%
                const displayRevenue = `$${revenue.toFixed(2)}`;
                
                // Use a default color for bars (e.g., IN_PROGRESS color)
                const barColor = STATUS_MAP.IN_PROGRESS.color; 

                return (
                    <div key={tech} className="bar-chart-row">
                        <span className="bar-label">{tech || 'Unassigned'}</span>
                        <div className="bar-wrapper">
                            <div 
                                className="chart-bar" 
                                style={{ 
                                    width: `${barWidth}%`, 
                                    backgroundColor: barColor 
                                }}
                            >
                                <span className="bar-value">{displayRevenue}</span>
                            </div>
                        </div>
                    </div>
                );
            });
        };


        return (
            <div className="chart-view-container">
                <div className="chart-grid">
                    {/* --- Chart 1: Status Distribution (Pie Mock) --- */}
                    <div className="chart-card">
                        <h3><FaWrench style={{ color: STATUS_MAP.OPEN.color, marginRight: '8px' }}/> Job Status Distribution (Count)</h3>
                        <div className="pie-chart-mock">
                            {/* Placeholder for the actual visual chart */}
                            <div className="pie-visual-placeholder">
                                <FaChartBar size={30} style={{ opacity: 0.5 }} />
                                <span>Visual Pie Chart Placeholder</span>
                            </div>
                            
                            <div className="pie-legend-list">
                                {renderPieSegments()}
                                <p className="chart-footer">Total Active Jobs: <span style={{ fontWeight: 600 }}>{totalJobs}</span></p>
                            </div>
                        </div>
                    </div>

                    {/* --- Chart 2: Revenue by Technician (Bar Chart) --- */}
                    <div className="chart-card">
                        <h3><FaMoneyBillWave style={{ color: STATUS_MAP.READY_FOR_PICKUP.color, marginRight: '8px' }}/> Outstanding Revenue by Technician</h3>
                        <div className="bar-chart-container">
                            {renderBarChart()}
                        </div>
                        <p className="chart-footer">Highest Revenue: <span style={{ fontWeight: 600 }}>${calculatedMaxRevenue.toFixed(2)}</span></p>
                    </div>
                </div>
            </div>
        );
    };


    const renderViewContent = () => {
        if (currentView === 'LIST') {
            return renderListView();
        }
        if (currentView === 'PIVOT') {
            return renderPivotView();
        }
        if (currentView === 'CHART') {
            return renderChartView();
        }

        // Default: KANBAN View
        return (
            <DragDropContext onDragEnd={onDragEnd}> 
                <div className="kanban-grid-full">
                    {statusKeys.map(statusKey => {
                        const statusInfo = STATUS_MAP[statusKey] || {};
                        return (
                            <KanbanColumn
                                key={statusKey}
                                statusKey={statusKey}
                                statusTitle={statusInfo.title || statusKey}
                                cards={kanbanData[statusKey] || []}
                                color={statusInfo.color || '#94A3B8'}
                                description={statusInfo.description}
                                Icon={statusInfo.icon || FaTag}
                            />
                        );
                    })}
                </div>
            </DragDropContext>
        );
    };


    if (isLoading) {
        return (
            <div className="kanban-loading">
                <VscLoading className="spinner" size={40} />
                <p>Loading active job workflow...</p>
            </div>
        );
    }


    return (
        <div className="kanban-board-container">
            <header className="kanban-header-bar">
                <div className="header-left">
                    <h2 style={{ fontWeight: 700 }}><FaWrench style={{marginRight: '10px', color: STATUS_MAP.IN_PROGRESS.color}}/> Job Workflow Dashboard</h2>
                </div>
                
                <div className="header-right">
                    <button 
                        className="btn-archive-toggle"
                        onClick={() => {
                            // Only allow toggling if we are in the LIST view
                            if (currentView === 'LIST') {
                                setShowArchived(prev => !prev);
                            } else {
                                // Switch to LIST view and show archived
                                setCurrentView('LIST');
                                setShowArchived(true);
                            }
                        }}
                        disabled={isUpdating}
                        style={{
                            backgroundColor: currentView === 'LIST' && showArchived ? '#6B7280' : '#4B5563', 
                            color: 'white', 
                            border: '1px solid transparent'
                        }}
                        title={currentView === 'LIST' && showArchived ? "Show Active Jobs" : "View Archived Jobs"}
                    >
                        {currentView === 'LIST' && showArchived ? <><FaWrench /> Show Active</> : <><FaArchive /> Archived ({archivedJobs.length})</>}
                    </button>
                    
                    <button 
                        className="btn-new-job" 
                        onClick={() => navigate('/jobcards/new')}
                        disabled={isUpdating}
                    >
                        <FaPlus /> Create Job Card
                    </button>
                    <ViewSwitcher currentView={currentView} onViewChange={handleViewChange} />
                </div>
            </header>
            
            {/* General error message remains at the top for serious issues */}
            {generalError && <div className="kanban-error-message">{generalError}</div>}
            
            {renderViewContent()}
            
            {isUpdating && <div className="update-overlay"><FaSpinner className="spinner-small" /> <span style={{ fontWeight: 600 }}>Updating status...</span></div>}

            {/* --- CUSTOM DELETE MODAL RENDERED HERE --- */}
            <DeleteConfirmationModal 
                job={jobToDelete} 
                onConfirm={handleConfirmDelete} 
                onCancel={handleCancelDelete} 
            />

            {/* --- TOAST NOTIFICATION RENDERED HERE --- */}
            <ToastNotification 
                message={toastMessage} 
                onClose={handleCloseToast} 
            />


            {/* --- STYLES FOR KANBAN, LIST, PIVOT, CHART, MODAL, AND TOAST VIEWS --- */}
            <style>{`
                /* ----------------------------------------------------------------- */
                /* GLOBAL FONT AND LAYOUT */
                /* ----------------------------------------------------------------- */
                .kanban-board-container {
                    padding: 30px; 
                    background-color: #F9FAFB; 
                    min-height: 90vh;
                    font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
                }
                
                .kanban-header-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px; 
                    padding-bottom: 10px;
                    border-bottom: 2px solid #E5E7EB; 
                }

                .header-right {
                    display: flex;
                    align-items: center;
                    gap: 15px; 
                }
                
                .kanban-header-bar h2 {
                    font-size: 24px;
                    color: #111827;
                    margin: 0;
                }
                
                .btn-new-job, .btn-archive-toggle {
                    /* Combined styling for new buttons */
                    border: none;
                    padding: 12px 20px; 
                    border-radius: 10px; 
                    cursor: pointer;
                    font-weight: 700;
                    font-size: 15px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    transition: all 0.2s;
                }
                
                .btn-new-job {
                    background-color: #10B981;
                    color: white;
                    box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3); 
                }
                .btn-new-job:hover {
                    background-color: #059669;
                    transform: translateY(-1px);
                    box-shadow: 0 5px 8px rgba(16, 185, 129, 0.35);
                }

                .btn-archive-toggle {
                    /* Default state for Archive Toggle */
                    background-color: #4B5563; /* Gray-600 */
                    color: white;
                    box-shadow: 0 4px 6px rgba(75, 85, 99, 0.3);
                }
                .btn-archive-toggle:hover {
                    background-color: #374151; /* Gray-700 */
                    transform: translateY(-1px);
                    box-shadow: 0 5px 8px rgba(75, 85, 99, 0.35);
                }
                
                .btn-new-job:disabled, .btn-archive-toggle:disabled {
                    background-color: #D1D5DB;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                    color: #9CA3AF;
                }
                
                /* ----------------------------------------------------------------- */
                /* VIEW SWITCHER */
                /* ----------------------------------------------------------------- */
                .view-switcher-container {
                    display: flex;
                    border: 1px solid #D1D5DB;
                    border-radius: 10px;
                    overflow: hidden;
                    background-color: #F8F9FA; 
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
                }
                
                .view-btn {
                    background-color: transparent;
                    color: #6B7280;
                    border: none;
                    padding: 12px 14px; 
                    cursor: pointer;
                    transition: all 0.2s;
                    line-height: 1;
                    font-size: 15px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 8px; 
                }
                .view-btn:hover:not(.active) {
                    background-color: #ECEFF1;
                    color: #374151;
                }

                .view-btn.active {
                    background-color: #1D4ED8; 
                    color: white;
                    box-shadow: 0 0 5px rgba(29, 78, 216, 0.4);
                    padding-right: 20px; 
                    padding-left: 20px;
                    border-radius: 10px;
                    margin: -1px; 
                    border: 1px solid #1D4ED8;
                }

                .active-view-text {
                    text-transform: capitalize;
                }
                
                .placeholder-view {
                    text-align: center;
                    padding: 100px;
                    background-color: #FFFFFF;
                    border: 2px dashed #D1D5DB;
                    border-radius: 12px;
                    margin: 20px 0;
                    color: #9CA3AF;
                    font-size: 18px;
                    font-weight: 600;
                }


                /* ----------------------------------------------------------------- */
                /* LIST VIEW STYLES */
                /* ----------------------------------------------------------------- */
                .list-view-container {
                    padding: 20px 0;
                }
                
                .list-summary {
                    font-size: 15px;
                    color: #4B5563;
                    margin-bottom: 15px;
                    padding-left: 5px;
                }

                .table-responsive {
                    overflow-x: auto;
                    background-color: white;
                    border-radius: 10px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
                    border: 1px solid #E5E7EB; 
                }

                .job-list-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 14px;
                }

                .job-list-table th {
                    text-align: left;
                    padding: 15px 20px; 
                    background-color: #F8F9FA; 
                    color: #1F2937;
                    font-weight: 600; 
                    cursor: pointer;
                    white-space: nowrap;
                    border-bottom: 2px solid #D1D5DB; 
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .job-list-table td {
                    padding: 15px 20px; 
                    border-bottom: 1px solid #F3F4F6; 
                    color: #374151; 
                    vertical-align: middle;
                    white-space: nowrap; 
                }

                /* Highlight for archived rows */
                .archived-row {
                    background-color: #F3F4F6; /* Lighter gray for archived */
                    opacity: 0.8;
                }
                
                .job-list-table tbody tr:hover:not(.archived-row) {
                    background-color: #F9FAFB;
                }
                
                .job-number-cell {
                    font-weight: 600;
                    color: #1D4ED8; 
                    cursor: pointer;
                }
                .total-due-cell {
                    /* Only the span inside has the actual bolding/color for smart look */
                    color: #059669; 
                }

                .status-chip {
                    display: inline-block;
                    padding: 4px 10px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                /* --- List View Action Buttons (Retained) --- */
                .actions-cell {
                    text-align: center;
                    display: flex;
                    gap: 5px;
                    justify-content: center;
                    min-width: 150px; 
                }
                
                .action-btn {
                    background: none;
                    border: none; 
                    border-radius: 8px; 
                    padding: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                    color: #6B7280; 
                    line-height: 1;
                    font-size: 16px; 
                }
                
                .action-btn:hover {
                    color: #1F2937; 
                    background-color: #E5E7EB; 
                }

                .action-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    background-color: transparent;
                }
                
                .action-view { color: #1D4ED8; }
                .action-view:hover { background-color: #E0E7FF; }
                .action-edit { color: #F59E0B; }
                .action-edit:hover { background-color: #FEF3C7; }
                
                /* --- ARCHIVE/UNARCHIVE BUTTON STYLES --- */
                .action-archive { color: #4B5563; } /* Gray-600 */
                .action-archive:hover { background-color: #D1D5DB; } 
                
                .action-unarchive { color: #059669; } /* Emerald-600 */
                .action-unarchive:hover { background-color: #D1FAE5; }

                /* --- DELETE BUTTON STYLE --- */
                .action-delete { color: #EF4444; } /* Red-500 */
                .action-delete:hover { background-color: #FEE2E2; }


                /* ----------------------------------------------------------------- */
                /* PIVOT VIEW STYLES */
                /* ----------------------------------------------------------------- */
                .pivot-view-container {
                    padding: 20px 0;
                }
                
                .pivot-summary {
                    font-size: 15px;
                    color: #4B5563;
                    margin-bottom: 15px;
                    padding-left: 5px;
                }
                
                .pivot-responsive {
                    background-color: white;
                    border-radius: 10px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
                    border: 1px solid #E5E7EB; 
                }
                
                .pivot-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                
                .pivot-table th {
                    background-color: #F8F9FA;
                    color: #1F2937;
                    font-weight: 600;
                    padding: 15px 20px;
                    text-align: left;
                    border-bottom: 2px solid #D1D5DB;
                }

                .pivot-value-header {
                    text-align: right !important; 
                }
                
                .pivot-table td {
                    padding: 12px 20px;
                    border-bottom: 1px solid #F3F4F6;
                    color: #374151;
                }

                .pivot-row-cell {
                    font-size: 15px;
                }

                .pivot-value-cell {
                    text-align: right;
                    font-weight: 500;
                    color: #059669;
                }
                
                .pivot-table tfoot td {
                    background-color: #F8F9FA;
                    font-weight: 700;
                    border-top: 3px solid #D1D5DB;
                    font-size: 16px;
                }
                
                .total-due-footer {
                    color: #111827 !important;
                }
                
                /* ----------------------------------------------------------------- */
                /* CHART VIEW STYLES */
                /* ----------------------------------------------------------------- */
                .chart-view-container {
                    padding: 20px 0;
                }

                .chart-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                    gap: 25px;
                }

                .chart-card {
                    background-color: white;
                    border-radius: 12px;
                    padding: 20px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
                    border: 1px solid #E5E7EB;
                }
                
                .chart-card h3 {
                    font-size: 18px;
                    color: #1F2937;
                    margin-top: 0;
                    padding-bottom: 10px;
                    border-bottom: 1px solid #F3F4F6;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                }
                
                .pie-chart-mock {
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    min-height: 200px;
                }
                
                .pie-visual-placeholder {
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    background-color: #F3F4F6;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: #9CA3AF;
                    font-size: 10px;
                    border: 5px solid #E5E7EB;
                    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);
                }
                
                .pie-legend-list {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    padding: 10px;
                }
                
                .chart-legend-item {
                    display: flex;
                    align-items: center;
                    font-size: 14px;
                    color: #374151;
                }
                
                .legend-dot {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    margin-right: 10px;
                    display: inline-block;
                }

                .chart-footer {
                    font-size: 12px;
                    color: #6B7280;
                    margin-top: 15px;
                    border-top: 1px dashed #F3F4F6;
                    padding-top: 10px;
                }
                
                /* Bar Chart Styles */
                .bar-chart-row {
                    display: flex;
                    align-items: center;
                    margin-bottom: 10px;
                    font-size: 14px;
                }
                
                .bar-label {
                    width: 100px; 
                    font-weight: 500;
                    color: #4B5563;
                }
                
                .bar-wrapper {
                    flex-grow: 1;
                    height: 25px;
                    background-color: #F3F4F6;
                    border-radius: 4px;
                    margin-left: 10px;
                    overflow: hidden;
                }
                
                .chart-bar {
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    padding-right: 5px;
                    color: white;
                    font-weight: 700;
                    transition: width 0.5s ease;
                }
                
                .bar-value {
                    font-size: 12px;
                }
                
                /* ----------------------------------------------------------------- */
                /* KANBAN VIEW STYLES */
                /* ----------------------------------------------------------------- */
                .kanban-grid-full {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
                    gap: 20px; 
                    align-items: flex-start;
                }
                
                .kanban-column {
                    padding: 0 10px 10px 10px; 
                    min-height: 70vh;
                    display: flex;
                    flex-direction: column;
                    border-radius: 12px; 
                    transition: all 0.2s;
                }

                .column-header-sticky {
                    position: sticky; 
                    top: 0; 
                    z-index: 10;
                    padding: 15px 0 10px 0; 
                    margin-bottom: 5px; 
                    border-bottom: 3px solid; 
                    border-radius: 12px 12px 0 0;
                    transition: background-color 0.2s;
                }
                
                .column-title-kanban {
                    font-size: 18px; 
                    margin: 0;
                    text-transform: uppercase; 
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    letter-spacing: 0.5px;
                }

                .card-count {
                    font-size: 16px;
                    font-weight: 500;
                    color: #6B7280;
                    margin-left: 5px;
                }
                
                .column-description {
                    font-size: 12px;
                    color: #9CA3AF;
                    text-align: center;
                    margin: 5px 0 10px 0;
                    font-style: italic;
                    min-height: 30px; 
                }
                
                .column-content-kanban {
                    flex-grow: 1;
                    padding-top: 5px;
                }
                
                .job-card-item {
                    background-color: #FFFFFF;
                    border-radius: 10px; 
                    padding: 15px; 
                    margin-bottom: 12px; 
                    cursor: grab; 
                    border: 1px solid #E5E7EB;
                    border-left: 4px solid; 
                    transition: all 0.2s ease;
                }

                .job-card-item:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    border-color: #D1D5DB;
                }
                
                .card-header-kanban {
                    display: flex;
                    justify-content: space-between;
                    font-size: 11px;
                    color: #9CA3AF;
                    margin-bottom: 10px;
                }
                
                .card-client-name {
                    font-size: 16px; 
                    color: #111827; 
                    margin: 0 0 8px 0;
                    line-height: 1.2;
                }
                
                .card-vehicle-info, 
                .card-technician-info {
                    color: #4B5563; 
                    font-size: 13px;
                    margin: 3px 0;
                }
                
                .card-footer-kanban {
                    margin-top: 10px;
                    padding-top: 10px;
                    border-top: 1px dashed #F3F4F6;
                    font-size: 13px; 
                    color: #1F2937; 
                    display: flex;
                    align-items: center;
                }

                .no-cards {
                    color: #9CA3AF;
                    font-size: 14px;
                    text-align: center;
                    margin-top: 50px;
                }
                
                /* Loading and Error */
                .kanban-loading {
                    text-align: center;
                    padding: 50px;
                    color: #4B5563;
                }

                .kanban-loading .spinner, .spinner-small {
                    animation: spin 1.5s linear infinite;
                }

                .update-overlay {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background-color: rgba(0, 0, 0, 0.8);
                    color: white;
                    padding: 10px 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    z-index: 1000;
                    font-size: 14px;
                }
                
                .spinner-small {
                    font-size: 18px;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                /* ----------------------------------------------------------------- */
                /* CUSTOM MODAL STYLES (FROM PREVIOUS UPDATE) */
                /* ----------------------------------------------------------------- */
                .custom-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.85); 
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 2000; 
                }

                .custom-modal-content {
                    background-color: #1F2937; 
                    color: white;
                    padding: 30px;
                    border-radius: 12px;
                    width: 90%;
                    max-width: 400px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
                    position: relative;
                    text-align: center;
                    border: 1px solid #374151;
                }

                .modal-close-btn {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: none;
                    border: none;
                    color: #6B7280; 
                    font-size: 24px;
                    cursor: pointer;
                    line-height: 1;
                    transition: color 0.2s;
                }
                .modal-close-btn:hover {
                    color: white;
                }

                .modal-body-content {
                    padding: 10px 0 20px 0;
                }

                .modal-warning-icon {
                    margin-bottom: 20px;
                    padding: 10px;
                    border-radius: 50%;
                    background-color: #374151; 
                }

                .modal-title {
                    font-size: 20px;
                    font-weight: 700;
                    margin: 10px 0 10px 0;
                    color: #F9FAFB;
                }

                .modal-message {
                    font-size: 14px;
                    color: #D1D5DB; 
                    line-height: 1.5;
                }

                .modal-actions {
                    display: flex;
                    justify-content: center;
                    gap: 15px;
                    margin-top: 25px;
                }

                .modal-btn {
                    padding: 12px 25px;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.2s, opacity 0.2s;
                    font-size: 15px;
                    min-width: 100px;
                    border: none;
                }

                .modal-cancel-btn {
                    background-color: #374151; 
                    color: #F9FAFB;
                }
                .modal-cancel-btn:hover {
                    background-color: #4B5563;
                }

                .modal-remove-btn {
                    background-color: #F87171; 
                    color: white;
                }
                .modal-remove-btn:hover {
                    background-color: #EF4444;
                }
                
                /* ----------------------------------------------------------------- */
                /* TOAST NOTIFICATION STYLES (NEW) */
                /* ----------------------------------------------------------------- */
                .toast-notification {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background-color: white;
                    color: #1F2937;
                    padding: 15px 20px;
                    border-radius: 10px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    z-index: 1500;
                    font-size: 14px;
                    min-width: 250px;
                    border-left: 5px solid #10B981; 
                    animation: slidein 0.3s ease-out forwards, slideout 0.3s ease-in 2.7s forwards;
                }
                
                .toast-message {
                    margin: 0;
                    font-weight: 600;
                    flex-grow: 1;
                }

                .toast-close-btn {
                    background: none;
                    border: none;
                    color: #9CA3AF;
                    font-size: 20px;
                    cursor: pointer;
                    line-height: 1;
                    padding: 0;
                }

                @keyframes slidein {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }

                @keyframes slideout {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }

            `}</style>
        </div>
    );
};

export default JobCardKanban;