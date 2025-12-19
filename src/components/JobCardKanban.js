// src/components/JobCardKanban.js

import React, { useState, useEffect, useCallback } from 'react';
import { 
    FaCar, FaUser, FaTag, FaClock, FaMoneyBillWave, FaSpinner, FaPlus, 
    FaWrench, FaTruck, FaUserTie, 
    FaThList, FaTable, FaChartBar, FaThLarge,
    FaSortUp, FaSortDown, FaSort, FaEye, FaEdit, FaTrash,
    FaExclamationTriangle,
    FaCheckCircle,
    FaArchive,
    FaUndoAlt,
    FaFilter,
    FaSearch,
    FaCog
} from 'react-icons/fa';
import { VscLoading } from 'react-icons/vsc'; 
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'; 

// --- Enhanced Color Configuration with Modern Palette ---
const STATUS_MAP = {
    'OPEN': { 
        title: "Open Jobs", 
        color: "#3B82F6", 
        gradient: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
        lightColor: "#DBEAFE",
        description: "Jobs waiting for allocation or first inspection.", 
        icon: FaWrench 
    },
    'IN_PROGRESS': { 
        title: "In Progress", 
        color: "#F59E0B", 
        gradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
        lightColor: "#FEF3C7",
        description: "Jobs actively being worked on by a technician.", 
        icon: FaSpinner 
    },
    'READY_FOR_PICKUP': { 
        title: "Ready for Pickup", 
        color: "#10B981", 
        gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
        lightColor: "#D1FAE5",
        description: "Work complete, invoice generated, ready for client collection.", 
        icon: FaTruck 
    },
    'PAID_CLOSED': { 
        title: "Paid & Closed", 
        color: "#8B5CF6", 
        gradient: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
        lightColor: "#EDE9FE",
        description: "Job completed, payment received, and filed.", 
        icon: FaTag 
    },
};

// --- View Options Configuration ---
const VIEWS = [
    { key: 'KANBAN', icon: FaThLarge, title: 'Kanban View' },
    { key: 'LIST', icon: FaThList, title: 'List View' },
    { key: 'PIVOT', icon: FaTable, title: 'Pivot Table' },
    { key: 'CHART', icon: FaChartBar, title: 'Chart View' },
];

// -----------------------------------------------------------------
// Status Chip Component (for List View) - Enhanced
// -----------------------------------------------------------------
const StatusChip = ({ statusKey }) => {
    const statusInfo = STATUS_MAP[statusKey] || STATUS_MAP.OPEN;
    return (
        <span 
            className="status-chip" 
            style={{ 
                background: statusInfo.gradient,
                color: 'white',
                boxShadow: `0 2px 4px ${statusInfo.color}40`
            }}
        >
            {statusInfo.title}
        </span>
    );
};

// View Switcher Component - Enhanced
const ViewSwitcher = ({ currentView, onViewChange }) => {
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
                        <span className="active-view-text">{view.title.replace(' View', '')}</span>
                    )}
                </button>
            ))}
        </div>
    );
};

// --- 1. Enhanced Job Card Component ---
const JobCardItem = React.memo(({ card, index }) => {
    const navigate = useNavigate();
    const statusKey = card.status in STATUS_MAP ? card.status : 'OPEN';
    const statusInfo = STATUS_MAP[statusKey] || STATUS_MAP.OPEN;

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
                        transform: snapshot.isDragging ? 'rotate(2deg)' : 'none',
                        opacity: snapshot.isDragging ? 0.8 : 1,
                        ...provided.draggableProps.style,
                    }}
                >
                    {/* Card accent bar */}
                    <div 
                        className="card-accent-bar"
                        style={{ background: statusInfo.gradient }}
                    />
                    
                    <div className="card-content">
                        <div className="card-header">
                            <div className="card-badge-group">
                                <span className="job-number-badge">
                                    <FaTag size={10} /> 
                                    <span className="badge-text">{card.job_number}</span>
                                </span>
                                <span className="status-badge" style={{ background: statusInfo.lightColor, color: statusInfo.color }}>
                                    {statusInfo.title}
                                </span>
                            </div>
                            
                            <span className="job-due-date">
                                <FaClock size={10} /> 
                                <span className="date-text">{card.date_in}</span>
                            </span>
                        </div>
                        
                        <h4 className="card-client-name">
                            <FaUser size={14} /> 
                            <span>{card.client_name}</span>
                        </h4>
                        
                        <p className="card-vehicle-info">
                            <FaCar size={14} /> 
                            <span>{card.vehicle_model} <span className="license-plate">({card.vehicle_license})</span></span>
                        </p>
                        
                        <div className="card-technician-info">
                            <FaUserTie size={14} /> 
                            <span>Assigned to: <strong>{card.assigned_technician || 'Unassigned'}</strong></span>
                        </div>
                        
                        <div className="card-footer">
                            <div className="total-due-container">
                                <FaMoneyBillWave size={14} /> 
                                <span className="total-label">Total Due:</span>
                                <span className="total-amount">${card.total_due?.toFixed(2) || '0.00'}</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Drag handle indicator */}
                    <div className="drag-handle">
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                    </div>
                </div>
            )}
        </Draggable>
    );
});

// --- 2. Enhanced Kanban Column Component ---
const KanbanColumn = ({ statusTitle, statusKey, cards, color, gradient, lightColor, description, Icon }) => {
    return (
        <Droppable droppableId={statusKey}>
            {(provided, snapshot) => (
                <div 
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`kanban-column ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                >
                    <div className="column-header" style={{ background: gradient }}>
                        <div className="column-header-content">
                            <div className="column-title-section">
                                <Icon size={20} className="column-icon" />
                                <div>
                                    <h3 className="column-title">{statusTitle}</h3>
                                    <p className="column-description">{description}</p>
                                </div>
                            </div>
                            <div className="column-count-badge" style={{ background: lightColor, color: color }}>
                                {cards.length}
                            </div>
                        </div>
                    </div>
                    
                    <div className="column-content">
                        {cards.length > 0 ? (
                            <>
                                <div className="cards-container">
                                    {cards.map((card, index) => (
                                        <JobCardItem 
                                            key={card.id} 
                                            card={card} 
                                            index={index} 
                                        />
                                    ))}
                                </div>
                                {provided.placeholder}
                            </>
                        ) : (
                            <div className="empty-column-state">
                                <div className="empty-icon" style={{ color: lightColor }}>
                                    <Icon size={48} />
                                </div>
                                <p className="empty-message">No jobs in this stage</p>
                                <p className="empty-hint">Drag jobs here or create new ones</p>
                            </div>
                        )}
                    </div>
                    
                    <div className="column-footer">
                        <button className="add-job-btn" style={{ color: color }}>
                            <FaPlus size={14} />
                            <span>Add Job</span>
                        </button>
                    </div>
                </div>
            )}
        </Droppable>
    );
};

// -----------------------------------------------------------------
// Custom Delete Confirmation Modal Component - Enhanced
// -----------------------------------------------------------------
const DeleteConfirmationModal = ({ job, onConfirm, onCancel }) => {
    if (!job) return null;

    return (
        <div className="custom-modal-overlay">
            <div className="custom-modal-content">
                <div className="modal-header">
                    <FaExclamationTriangle size={28} className="modal-warning-icon" />
                    <h2 className="modal-title">Remove Job Card</h2>
                </div>
                
                <div className="modal-body">
                    <p className="modal-job-number">#{job.job_number}</p>
                    <p className="modal-client-name">{job.client_name}</p>
                    <p className="modal-vehicle">{job.vehicle_model} ({job.vehicle_license})</p>
                    
                    <div className="modal-warning-message">
                        <p>This action cannot be undone. All job data will be permanently deleted.</p>
                    </div>
                </div>
                
                <div className="modal-actions">
                    <button className="modal-btn secondary-btn" onClick={onCancel}>
                        Cancel
                    </button>
                    <button className="modal-btn danger-btn" onClick={onConfirm}>
                        <FaTrash size={14} />
                        Delete Permanently
                    </button>
                </div>
            </div>
        </div>
    );
};

// -----------------------------------------------------------------
// Enhanced Toast Notification Component
// -----------------------------------------------------------------
const ToastNotification = ({ message, onClose }) => {
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                onClose();
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [message, onClose]);

    if (!message) return null;

    return (
        <div className="toast-notification">
            <div className="toast-icon">
                <FaCheckCircle size={20} />
            </div>
            <div className="toast-content">
                <p className="toast-message">{message}</p>
            </div>
            <button onClick={onClose} className="toast-close-btn">
                &times;
            </button>
        </div>
    );
};

// -----------------------------------------------------------------
// 3. Main JobCardKanban Component - Enhanced
// -----------------------------------------------------------------
const JobCardKanban = () => {
    const navigate = useNavigate();
    const [currentView, setCurrentView] = useState('KANBAN');
    const [kanbanData, setKanbanData] = useState({});
    const [showArchived, setShowArchived] = useState(false);
    const [archivedJobs, setArchivedJobs] = useState([
        { id: 10, job_number: 'JC-A10', client_name: 'Archived Client Inc.', vehicle_model: 'Old Sedan', vehicle_license: 'T000ARC', total_due: 100.00, date_in: '2024-01-01', status: 'PAID_CLOSED', assigned_technician: 'Sam B.' },
    ]);
    const [statusKeys, setStatusKeys] = useState(Object.keys(STATUS_MAP));
    const [isLoading, setIsLoading] = useState(true);
    const [generalError, setGeneralError] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: 'date_in', direction: 'descending' });
    const [jobToDelete, setJobToDelete] = useState(null);
    const [toastMessage, setToastMessage] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchKanbanData = useCallback(async () => {
        setIsLoading(true);
        setGeneralError(null);
        
        const MOCK_DATA = {
            statuses: ['OPEN', 'IN_PROGRESS', 'READY_FOR_PICKUP', 'PAID_CLOSED'],
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
                ],
                'PAID_CLOSED': [
                    { id: 6, job_number: 'JC-006', client_name: 'Beta Corp', vehicle_model: 'Civic', vehicle_license: 'T111BBB', total_due: 0.00, date_in: '2025-11-06', status: 'PAID_CLOSED', assigned_technician: 'Mike' },
                ]
            }
        };
        
        try {
            setKanbanData(MOCK_DATA.columns);
            setStatusKeys(MOCK_DATA.statuses);
        } catch (err) {
            console.error("Failed to fetch Kanban data:", err);
            setGeneralError('Failed to load job cards. Check API status.');
            setKanbanData(MOCK_DATA.columns);
            setStatusKeys(MOCK_DATA.statuses);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchKanbanData();
    }, [fetchKanbanData]);

    const getAllJobs = useCallback(() => {
        return Object.values(kanbanData).flat();
    }, [kanbanData]);
    
    const getJobsForView = useCallback(() => {
        return showArchived ? archivedJobs : getAllJobs();
    }, [showArchived, archivedJobs, getAllJobs]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortedJobs = useCallback(() => {
        let sortableItems = [...getJobsForView()];
        if (searchQuery) {
            sortableItems = sortableItems.filter(job =>
                job.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.job_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.vehicle_license.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        
        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                const aValue = a[sortConfig.key] || '';
                const bValue = b[sortConfig.key] || '';

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
    }, [getJobsForView, sortConfig, searchQuery]);

    const executeDelete = useCallback((jobId, job_number) => {
        setIsUpdating(true);
        
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
            
            setTimeout(() => {
                setIsUpdating(false);
                setToastMessage(`Job Card ${job_number} successfully deleted.`);
            }, 500);
        } else {
            setIsUpdating(false);
            setGeneralError(`Error: Could not find job card ${job_number} to delete.`);
        }
        setJobToDelete(null);
    }, [kanbanData, archivedJobs]);

    const handleArchiveToggle = useCallback((job, isArchiving) => {
        setIsUpdating(true);
        const job_number = job.job_number;
        
        if (isArchiving) {
            let newKanbanData = { ...kanbanData };
            let archivedJob = null;

            for (const statusKey of Object.keys(newKanbanData)) {
                const index = newKanbanData[statusKey].findIndex(j => j.id === job.id);
                if (index !== -1) {
                    archivedJob = newKanbanData[statusKey].splice(index, 1)[0];
                    break;
                }
            }
            
            if (archivedJob) {
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
            let newArchivedJobs = archivedJobs.filter(j => j.id !== job.id);
            const statusKey = job.status in STATUS_MAP ? job.status : 'OPEN';
            
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

    const handleShowDeleteModal = useCallback((job) => {
        setJobToDelete(job);
    }, []);

    const handleConfirmDelete = useCallback(() => {
        if (jobToDelete) {
            executeDelete(jobToDelete.id, jobToDelete.job_number);
        }
    }, [jobToDelete, executeDelete]);

    const handleCancelDelete = useCallback(() => {
        setJobToDelete(null);
    }, []);

    const handleCloseToast = useCallback(() => {
        setToastMessage(null);
    }, []);

    const handleViewChange = useCallback((newView) => {
        setCurrentView(newView);
        if (newView !== 'LIST') {
            setShowArchived(false);
        }
    }, []);

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

        setIsUpdating(true);
        
        try {
            console.log(`Job Card ${cardId} status updated to ${destinationColumnKey} successfully (MOCK).`);
        } catch (apiError) {
            console.error("Failed to update Job Card status via API.", apiError);
            setGeneralError("Error: Failed to update job status on server.");
            fetchKanbanData();
        } finally {
            setIsUpdating(false);
        }
    };

    // 🛑 Enhanced List View
    const renderListView = () => {
        const sortedJobs = getSortedJobs();
        const getSortIcon = (key) => {
            if (sortConfig.key !== key) return <FaSort size={12} style={{ opacity: 0.4 }} />;
            if (sortConfig.direction === 'ascending') return <FaSortUp size={12} />;
            return <FaSortDown size={12} />;
        };

        return (
            <div className="list-view-container">
                <div className="list-view-header">
                    <div className="list-view-stats">
                        <div className="stat-card">
                            <span className="stat-label">Total Jobs</span>
                            <span className="stat-value">{sortedJobs.length}</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-label">Status</span>
                            <span className="stat-value">{showArchived ? 'Archived' : 'Active'}</span>
                        </div>
                    </div>
                    
                    <div className="list-view-controls">
                        <div className="search-box">
                            <FaSearch size={14} />
                            <input
                                type="text"
                                placeholder="Search jobs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                            />
                        </div>
                        <button className="filter-btn">
                            <FaFilter size={14} />
                            Filter
                        </button>
                    </div>
                </div>
                
                <div className="table-container">
                    <table className="job-list-table">
                        <thead>
                            <tr>
                                <th onClick={() => requestSort('job_number')}>
                                    <div className="table-header">
                                        Job # {getSortIcon('job_number')}
                                    </div>
                                </th>
                                <th onClick={() => requestSort('client_name')}>
                                    <div className="table-header">
                                        Client {getSortIcon('client_name')}
                                    </div>
                                </th>
                                <th onClick={() => requestSort('vehicle_model')}>
                                    <div className="table-header">
                                        Vehicle {getSortIcon('vehicle_model')}
                                    </div>
                                </th>
                                <th onClick={() => requestSort('status')}>
                                    <div className="table-header">
                                        Status {getSortIcon('status')}
                                    </div>
                                </th>
                                <th onClick={() => requestSort('assigned_technician')}>
                                    <div className="table-header">
                                        Technician {getSortIcon('assigned_technician')}
                                    </div>
                                </th>
                                <th onClick={() => requestSort('date_in')}>
                                    <div className="table-header">
                                        Date In {getSortIcon('date_in')}
                                    </div>
                                </th>
                                <th onClick={() => requestSort('total_due')}>
                                    <div className="table-header">
                                        Total Due {getSortIcon('total_due')}
                                    </div>
                                </th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedJobs.length > 0 ? (
                                sortedJobs.map(job => (
                                    <tr key={job.id} className={showArchived ? 'archived-row' : ''}>
                                        <td>
                                            <div className="job-number-cell" onClick={() => navigate(`/jobcards/${job.id}/detail`)}>
                                                <FaTag size={12} />
                                                <span>{job.job_number}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="client-cell">
                                                <FaUser size={12} />
                                                <span>{job.client_name}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="vehicle-cell">
                                                <FaCar size={12} />
                                                <span>{job.vehicle_model} ({job.vehicle_license})</span>
                                            </div>
                                        </td>
                                        <td><StatusChip statusKey={job.status} /></td>
                                        <td>{job.assigned_technician || 'Unassigned'}</td>
                                        <td>{job.date_in}</td>
                                        <td>
                                            <div className="total-due-cell">
                                                ${job.total_due?.toFixed(2) || '0.00'}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button title="View Detail" className="action-btn" onClick={() => navigate(`/jobcards/${job.id}/detail`)}>
                                                    <FaEye size={14} />
                                                </button>
                                                
                                                {!showArchived && (
                                                    <button title="Edit Job" className="action-btn">
                                                        <FaEdit size={14} />
                                                    </button>
                                                )}
                                                
                                                {showArchived ? (
                                                    <button 
                                                        title="Unarchive Job" 
                                                        className="action-btn success-btn"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleArchiveToggle(job, false);
                                                        }}
                                                    >
                                                        <FaUndoAlt size={14} />
                                                    </button>
                                                ) : (
                                                    <button 
                                                        title="Archive Job" 
                                                        className="action-btn"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleArchiveToggle(job, true);
                                                        }}
                                                    >
                                                        <FaArchive size={14} />
                                                    </button>
                                                )}
                                                
                                                <button 
                                                    title="Delete Job" 
                                                    className="action-btn danger-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleShowDeleteModal(job);
                                                    }}
                                                >
                                                    <FaTrash size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8">
                                        <div className="empty-table-state">
                                            <p>No {showArchived ? 'archived' : 'active'} job cards found</p>
                                            {searchQuery && (
                                                <button 
                                                    className="clear-search-btn"
                                                    onClick={() => setSearchQuery('')}
                                                >
                                                    Clear search
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const renderViewContent = () => {
        if (currentView === 'LIST') {
            return renderListView();
        }
        if (currentView === 'PIVOT') {
            return (
                <div className="pivot-view-container">
                    <div className="placeholder-view">
                        <FaTable size={48} />
                        <h3>Pivot Table View</h3>
                        <p>Advanced analytics view coming soon</p>
                    </div>
                </div>
            );
        }
        if (currentView === 'CHART') {
            return (
                <div className="chart-view-container">
                    <div className="placeholder-view">
                        <FaChartBar size={48} />
                        <h3>Chart View</h3>
                        <p>Visual analytics dashboard coming soon</p>
                    </div>
                </div>
            );
        }

        // KANBAN View
        return (
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="kanban-grid">
                    {statusKeys.map(statusKey => {
                        const statusInfo = STATUS_MAP[statusKey] || {};
                        return (
                            <KanbanColumn
                                key={statusKey}
                                statusKey={statusKey}
                                statusTitle={statusInfo.title || statusKey}
                                cards={kanbanData[statusKey] || []}
                                color={statusInfo.color}
                                gradient={statusInfo.gradient}
                                lightColor={statusInfo.lightColor}
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
            <div className="loading-container">
                <div className="loading-spinner">
                    <VscLoading className="spinner" size={48} />
                </div>
                <p className="loading-text">Loading job workflow...</p>
            </div>
        );
    }

    return (
        <div className="job-kanban-container">
            <header className="app-header">
                <div className="header-left">
                    <div className="logo-section">
                        <FaWrench className="app-logo" />
                        <h1>AutoShop Pro</h1>
                        <span className="app-subtitle">Job Workflow Dashboard</span>
                    </div>
                </div>
                
                <div className="header-right">
                    <div className="header-actions">
                        <div className="archive-toggle-section">
                            <button 
                                className={`archive-toggle-btn ${showArchived ? 'active' : ''}`}
                                onClick={() => {
                                    if (currentView === 'LIST') {
                                        setShowArchived(prev => !prev);
                                    } else {
                                        setCurrentView('LIST');
                                        setShowArchived(true);
                                    }
                                }}
                                title={showArchived ? "Show Active Jobs" : "View Archived Jobs"}
                            >
                                {showArchived ? (
                                    <>
                                        <FaWrench />
                                        <span>Active Jobs</span>
                                    </>
                                ) : (
                                    <>
                                        <FaArchive />
                                        <span>Archived ({archivedJobs.length})</span>
                                    </>
                                )}
                            </button>
                        </div>
                        
                        <button 
                            className="primary-btn new-job-btn"
                            onClick={() => navigate('/jobcards/new')}
                        >
                            <FaPlus />
                            <span>New Job</span>
                        </button>
                        
                        <ViewSwitcher currentView={currentView} onViewChange={handleViewChange} />
                        
                        <button className="settings-btn" title="Settings">
                            <FaCog />
                        </button>
                    </div>
                </div>
            </header>
            
            <main className="app-main">
                {generalError && (
                    <div className="error-banner">
                        <FaExclamationTriangle />
                        <span>{generalError}</span>
                    </div>
                )}
                
                {renderViewContent()}
            </main>
            
            {isUpdating && (
                <div className="update-overlay">
                    <FaSpinner className="spinner" />
                    <span>Updating...</span>
                </div>
            )}

            <DeleteConfirmationModal 
                job={jobToDelete} 
                onConfirm={handleConfirmDelete} 
                onCancel={handleCancelDelete} 
            />

            <ToastNotification 
                message={toastMessage} 
                onClose={handleCloseToast} 
            />

            <style>{`
                /* ----------------------------------------------------------------- */
                /* GLOBAL STYLES */
                /* ----------------------------------------------------------------- */
                .job-kanban-container {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    padding: 24px;
                }

                /* ----------------------------------------------------------------- */
                /* HEADER STYLES */
                /* ----------------------------------------------------------------- */
                .app-header {
                    background: white;
                    border-radius: 20px;
                    padding: 24px 32px;
                    margin-bottom: 32px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }

                .logo-section {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .app-logo {
                    font-size: 32px;
                    color: #3B82F6;
                    background: linear-gradient(135deg, #3B82F6, #1D4ED8);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .app-header h1 {
                    margin: 0;
                    font-size: 28px;
                    font-weight: 800;
                    background: linear-gradient(135deg, #1e293b, #334155);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .app-subtitle {
                    font-size: 14px;
                    color: #64748b;
                    font-weight: 500;
                    margin-left: 8px;
                }

                .header-actions {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .archive-toggle-section {
                    position: relative;
                }

                .archive-toggle-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 20px;
                    background: #f8fafc;
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    color: #64748b;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .archive-toggle-btn:hover {
                    background: #f1f5f9;
                    transform: translateY(-1px);
                }

                .archive-toggle-btn.active {
                    background: #3B82F6;
                    color: white;
                    border-color: #3B82F6;
                }

                .primary-btn {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 14px 24px;
                    background: linear-gradient(135deg, #3B82F6, #1D4ED8);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);
                }

                .primary-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 12px rgba(59, 130, 246, 0.4);
                }

                .settings-btn {
                    padding: 12px;
                    background: #f8fafc;
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    color: #64748b;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .settings-btn:hover {
                    background: #f1f5f9;
                    transform: rotate(30deg);
                }

                /* ----------------------------------------------------------------- */
                /* VIEW SWITCHER */
                /* ----------------------------------------------------------------- */
                .view-switcher-container {
                    display: flex;
                    background: #f8fafc;
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    padding: 4px;
                    gap: 4px;
                }

                .view-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 16px;
                    background: transparent;
                    border: none;
                    border-radius: 8px;
                    color: #64748b;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .view-btn:hover {
                    background: rgba(59, 130, 246, 0.1);
                    color: #3B82F6;
                }

                .view-btn.active {
                    background: white;
                    color: #1e293b;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }

                .active-view-text {
                    font-size: 14px;
                }

                /* ----------------------------------------------------------------- */
                /* KANBAN STYLES */
                /* ----------------------------------------------------------------- */
                .kanban-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                    gap: 24px;
                    margin-top: 24px;
                }

                .kanban-column {
                    background: white;
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    display: flex;
                    flex-direction: column;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }

                .kanban-column:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
                }

                .kanban-column.dragging-over {
                    border: 2px dashed;
                    border-color: inherit;
                }

                .column-header {
                    padding: 24px;
                    color: white;
                }

                .column-header-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                }

                .column-title-section {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                }

                .column-icon {
                    margin-top: 4px;
                }

                .column-title {
                    margin: 0 0 8px 0;
                    font-size: 18px;
                    font-weight: 700;
                }

                .column-description {
                    margin: 0;
                    font-size: 12px;
                    opacity: 0.9;
                }

                .column-count-badge {
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 14px;
                    font-weight: 700;
                    min-width: 36px;
                    text-align: center;
                }

                .column-content {
                    padding: 20px;
                    flex: 1;
                    min-height: 400px;
                    background: #f8fafc;
                }

                .cards-container {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .job-card-item {
                    background: white;
                    border-radius: 16px;
                    padding: 20px;
                    cursor: grab;
                    position: relative;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
                    border: 1px solid #f1f5f9;
                    overflow: hidden;
                }

                .job-card-item:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
                }

                .card-accent-bar {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                }

                .card-content {
                    position: relative;
                    z-index: 1;
                }

                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 16px;
                }

                .card-badge-group {
                    display: flex;
                    gap: 8px;
                }

                .job-number-badge {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 12px;
                    background: #f8fafc;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 600;
                    color: #64748b;
                }

                .status-badge {
                    padding: 6px 12px;
                    border-radius: 12px;
                    font-size: 11px;
                    font-weight: 600;
                }

                .job-due-date {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 12px;
                    color: #94a3b8;
                }

                .date-text {
                    font-weight: 500;
                }

                .card-client-name {
                    margin: 0 0 12px 0;
                    font-size: 16px;
                    font-weight: 600;
                    color: #1e293b;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .card-vehicle-info {
                    margin: 0 0 12px 0;
                    font-size: 14px;
                    color: #475569;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .license-plate {
                    background: #f1f5f9;
                    padding: 2px 8px;
                    border-radius: 6px;
                    font-family: monospace;
                    font-size: 12px;
                }

                .card-technician-info {
                    margin: 0 0 16px 0;
                    font-size: 14px;
                    color: #64748b;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .card-footer {
                    padding-top: 16px;
                    border-top: 1px dashed #e2e8f0;
                }

                .total-due-container {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 14px;
                }

                .total-label {
                    color: #64748b;
                }

                .total-amount {
                    font-weight: 700;
                    color: #059669;
                    font-size: 16px;
                }

                .drag-handle {
                    position: absolute;
                    right: 16px;
                    top: 16px;
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                    opacity: 0.3;
                    transition: opacity 0.3s ease;
                }

                .job-card-item:hover .drag-handle {
                    opacity: 1;
                }

                .dot {
                    width: 4px;
                    height: 4px;
                    background: #94a3b8;
                    border-radius: 50%;
                }

                .empty-column-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 300px;
                    text-align: center;
                }

                .empty-icon {
                    margin-bottom: 16px;
                    opacity: 0.5;
                }

                .empty-message {
                    margin: 0 0 8px 0;
                    font-size: 16px;
                    color: #64748b;
                    font-weight: 500;
                }

                .empty-hint {
                    margin: 0;
                    font-size: 12px;
                    color: #94a3b8;
                }

                .column-footer {
                    padding: 20px;
                    border-top: 1px solid #f1f5f9;
                }

                .add-job-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    width: 100%;
                    padding: 12px;
                    background: transparent;
                    border: 2px dashed #e2e8f0;
                    border-radius: 12px;
                    color: #64748b;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .add-job-btn:hover {
                    background: #f8fafc;
                    border-color: currentColor;
                }

                /* ----------------------------------------------------------------- */
                /* LIST VIEW STYLES */
                /* ----------------------------------------------------------------- */
                .list-view-container {
                    background: white;
                    border-radius: 20px;
                    padding: 24px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                }

                .list-view-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                }

                .list-view-stats {
                    display: flex;
                    gap: 16px;
                }

                .stat-card {
                    background: #f8fafc;
                    padding: 16px 24px;
                    border-radius: 12px;
                    min-width: 120px;
                }

                .stat-label {
                    display: block;
                    font-size: 12px;
                    color: #64748b;
                    margin-bottom: 4px;
                }

                .stat-value {
                    display: block;
                    font-size: 24px;
                    font-weight: 700;
                    color: #1e293b;
                }

                .list-view-controls {
                    display: flex;
                    gap: 12px;
                    align-items: center;
                }

                .search-box {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 16px;
                    background: #f8fafc;
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    min-width: 300px;
                }

                .search-input {
                    flex: 1;
                    background: transparent;
                    border: none;
                    outline: none;
                    font-size: 14px;
                    color: #1e293b;
                }

                .search-input::placeholder {
                    color: #94a3b8;
                }

                .filter-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 20px;
                    background: #f8fafc;
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    color: #64748b;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .filter-btn:hover {
                    background: #f1f5f9;
                }

                .table-container {
                    overflow-x: auto;
                    border-radius: 16px;
                    border: 1px solid #f1f5f9;
                }

                .job-list-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .job-list-table th {
                    background: #f8fafc;
                    padding: 16px 20px;
                    text-align: left;
                    font-size: 12px;
                    font-weight: 600;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    border-bottom: 2px solid #e2e8f0;
                    cursor: pointer;
                    user-select: none;
                }

                .job-list-table th:hover {
                    background: #f1f5f9;
                }

                .table-header {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .job-list-table td {
                    padding: 20px;
                    border-bottom: 1px solid #f1f5f9;
                }

                .job-number-cell {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 600;
                    color: #3B82F6;
                    cursor: pointer;
                }

                .client-cell, .vehicle-cell {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .total-due-cell {
                    font-weight: 700;
                    color: #059669;
                    font-size: 16px;
                }

                .action-buttons {
                    display: flex;
                    gap: 8px;
                }

                .action-btn {
                    padding: 8px;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    color: #64748b;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .action-btn:hover {
                    background: #f1f5f9;
                    transform: translateY(-1px);
                }

                .action-btn.success-btn {
                    color: #059669;
                }

                .action-btn.danger-btn {
                    color: #ef4444;
                }

                .archived-row {
                    opacity: 0.7;
                }

                .empty-table-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 60px 20px;
                    text-align: center;
                }

                .clear-search-btn {
                    margin-top: 12px;
                    padding: 8px 16px;
                    background: #f8fafc;
                    border: 2px solid #e2e8f0;
                    border-radius: 8px;
                    color: #64748b;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .clear-search-btn:hover {
                    background: #f1f5f9;
                }

                /* ----------------------------------------------------------------- */
                /* PLACEHOLDER VIEWS */
                /* ----------------------------------------------------------------- */
                .placeholder-view {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 80px 20px;
                    text-align: center;
                    color: #64748b;
                }

                .placeholder-view h3 {
                    margin: 16px 0 8px 0;
                    color: #1e293b;
                }

                /* ----------------------------------------------------------------- */
                /* LOADING STATES */
                /* ----------------------------------------------------------------- */
                .loading-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 400px;
                }

                .loading-spinner {
                    margin-bottom: 24px;
                }

                .loading-text {
                    font-size: 16px;
                    color: #64748b;
                    font-weight: 500;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .spinner {
                    animation: spin 1.5s linear infinite;
                }

                .update-overlay {
                    position: fixed;
                    bottom: 32px;
                    right: 32px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 16px 24px;
                    background: rgba(0, 0, 0, 0.9);
                    color: white;
                    border-radius: 12px;
                    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
                    z-index: 1000;
                }

                /* ----------------------------------------------------------------- */
                /* ERROR STATES */
                /* ----------------------------------------------------------------- */
                .error-banner {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 16px 24px;
                    background: linear-gradient(135deg, #fca5a5, #f87171);
                    color: white;
                    border-radius: 12px;
                    margin-bottom: 24px;
                    font-weight: 500;
                }

                /* ----------------------------------------------------------------- */
                /* MODAL STYLES */
                /* ----------------------------------------------------------------- */
                .custom-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(4px);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 2000;
                    padding: 20px;
                }

                .custom-modal-content {
                    background: white;
                    border-radius: 20px;
                    padding: 32px;
                    width: 100%;
                    max-width: 400px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
                    animation: modalSlideIn 0.3s ease-out;
                }

                @keyframes modalSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .modal-header {
                    text-align: center;
                    margin-bottom: 24px;
                }

                .modal-warning-icon {
                    color: #f59e0b;
                    margin-bottom: 16px;
                }

                .modal-title {
                    margin: 0 0 8px 0;
                    font-size: 24px;
                    font-weight: 700;
                    color: #1e293b;
                }

                .modal-body {
                    text-align: center;
                    margin-bottom: 32px;
                }

                .modal-job-number {
                    font-size: 18px;
                    font-weight: 600;
                    color: #3B82F6;
                    margin: 0 0 8px 0;
                }

                .modal-client-name {
                    font-size: 16px;
                    color: #1e293b;
                    margin: 0 0 4px 0;
                }

                .modal-vehicle {
                    font-size: 14px;
                    color: #64748b;
                    margin: 0 0 24px 0;
                }

                .modal-warning-message {
                    padding: 16px;
                    background: #fef3c7;
                    border-radius: 12px;
                    border-left: 4px solid #f59e0b;
                }

                .modal-warning-message p {
                    margin: 0;
                    font-size: 14px;
                    color: #92400e;
                }

                .modal-actions {
                    display: flex;
                    gap: 12px;
                }

                .modal-btn {
                    flex: 1;
                    padding: 14px;
                    border: none;
                    border-radius: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .secondary-btn {
                    background: #f8fafc;
                    color: #64748b;
                    border: 2px solid #e2e8f0;
                }

                .secondary-btn:hover {
                    background: #f1f5f9;
                }

                .danger-btn {
                    background: linear-gradient(135deg, #ffffffff, #ffffffff);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }

                .danger-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
                }

                /* ----------------------------------------------------------------- */
                /* TOAST STYLES */
                /* ----------------------------------------------------------------- */
                .toast-notification {
                    position: fixed;
                    bottom: 32px;
                    right: 32px;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 20px;
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
                    z-index: 1500;
                    animation: toastSlideIn 0.3s ease-out, toastSlideOut 0.3s ease-in 3.7s forwards;
                    border-left: 4px solid #10B981;
                    max-width: 400px;
                }

                @keyframes toastSlideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                @keyframes toastSlideOut {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }

                .toast-icon {
                    color: #10B981;
                }

                .toast-content {
                    flex: 1;
                }

                .toast-message {
                    margin: 0;
                    font-weight: 500;
                    color: #1e293b;
                }

                .toast-close-btn {
                    background: transparent;
                    border: none;
                    color: #94a3b8;
                    font-size: 20px;
                    cursor: pointer;
                    padding: 0;
                    line-height: 1;
                }

                /* ----------------------------------------------------------------- */
                /* RESPONSIVE DESIGN */
                /* ----------------------------------------------------------------- */
                @media (max-width: 1200px) {
                    .kanban-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (max-width: 768px) {
                    .job-kanban-container {
                        padding: 16px;
                    }

                    .app-header {
                        flex-direction: column;
                        gap: 16px;
                        padding: 20px;
                    }

                    .header-actions {
                        width: 100%;
                        flex-wrap: wrap;
                    }

                    .kanban-grid {
                        grid-template-columns: 1fr;
                    }

                    .list-view-header {
                        flex-direction: column;
                        gap: 16px;
                    }

                    .search-box {
                        min-width: 100%;
                    }

                    .job-list-table {
                        font-size: 14px;
                    }

                    .job-list-table th,
                    .job-list-table td {
                        padding: 12px 16px;
                    }
                }

                /* ----------------------------------------------------------------- */
                /* UTILITY CLASSES */
                /* ----------------------------------------------------------------- */
                .status-chip {
                    display: inline-block;
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
            `}</style>
        </div>
    );
};

export default JobCardKanban;