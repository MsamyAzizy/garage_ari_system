import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../utils/apiClient';
import { FaCar, FaUser, FaTag, FaClock, FaMoneyBillWave, FaSpinner, FaPlus } from 'react-icons/fa';
import { VscLoading } from 'react-icons/vsc'; 
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'; 

// --- Configuration ---
const STATUS_MAP = {
    'OPEN': { title: "Open Jobs", color: "#0EA5E9", description: "Jobs waiting for allocation." },      // Sky Blue
    'IN_PROGRESS': { title: "In Progress", color: "#6366F1", description: "Jobs currently being worked on." }, // Indigo
    'READY_FOR_PICKUP': { title: "Ready for Pickup", color: "#10B981", description: "Work complete, ready for client." }, // Emerald Green
    // You might add a 'PAID' or 'CLOSED' status if needed, based on your backend
};

// --- 1. Component for Individual Job Card (Draggable Element) ---
const JobCardItem = React.memo(({ card, index }) => {
    
    const navigate = useNavigate();
    
    const statusKey = card.status in STATUS_MAP ? card.status : 'OPEN';
    const statusColor = STATUS_MAP[statusKey]?.color || '#9CA3AF';

    const handleCardClick = () => {
        // Navigate to the job card detail view (assuming route /jobcards/:id/detail)
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
                        // 🌟 POLISH: Use a lighter, more professional blue for dragging
                        backgroundColor: snapshot.isDragging ? '#EBF8FF' : 'white', 
                        borderLeftColor: statusColor,
                        ...provided.draggableProps.style,
                    }}
                >
                    <div className="card-header-kanban">
                        <span className="job-number-tag" style={{ color: statusColor }}>
                            <FaTag size={10} style={{ marginRight: '5px' }}/> **{card.job_number}**
                        </span>
                        <span className="job-due-date">
                            <FaClock size={10} style={{ marginRight: '3px' }}/> {card.date_in}
                        </span>
                    </div>
                    
                    <h4 className="card-client-name">
                        <FaUser size={12} style={{ marginRight: '5px' }} /> **{card.client_name}**
                    </h4>
                    
                    <div className="card-vehicle-info">
                        <FaCar size={12} style={{ marginRight: '5px' }} /> {card.vehicle_model} ({card.vehicle_license})
                    </div>
                    
                    <div className="card-footer-kanban">
                        <FaMoneyBillWave size={12} style={{ marginRight: '5px' }} /> Total Due: **{card.total_due ? `$${card.total_due.toFixed(2)}` : 'N/A'}**
                    </div>
                </div>
            )}
        </Draggable>
    );
});


// --- 2. Component for Kanban Column (Droppable Target) ---
const KanbanColumn = ({ statusTitle, statusKey, cards, color, description }) => {
    return (
        <Droppable droppableId={statusKey}>
            {(provided, snapshot) => (
                <div 
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`kanban-column ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                >
                    <h3 className="column-title-kanban" style={{ borderBottomColor: color }}>
                        {statusTitle} ({cards.length})
                    </h3>
                    <p className="column-description">{description}</p>
                    
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


// --- 3. Main JobCardKanban Component ---
const JobCardKanban = () => {
    const navigate = useNavigate();
    const [kanbanData, setKanbanData] = useState({});
    const [statusKeys, setStatusKeys] = useState(Object.keys(STATUS_MAP));
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false); 

    
    const fetchKanbanData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        
        // MOCK DATA (Defined in scope for error fallback)
        const MOCK_DATA = {
            statuses: ['OPEN', 'IN_PROGRESS', 'READY_FOR_PICKUP'],
            columns: {
                'OPEN': [
                    { id: 1, job_number: 'JC-001', client_name: 'Azizi Bongo Motors', vehicle_model: 'Patrol', vehicle_license: 'T789DFG', total_due: 150.00, date_in: '2025-11-01', status: 'OPEN' },
                    { id: 4, job_number: 'JC-004', client_name: 'Mwana Pesa', vehicle_model: 'X5', vehicle_license: 'T999LMN', total_due: 0.00, date_in: '2025-11-04', status: 'OPEN' },
                ],
                'IN_PROGRESS': [
                    { id: 2, job_number: 'JC-002', client_name: 'John Doe', vehicle_model: 'Corolla', vehicle_license: 'T123ABC', total_due: 450.50, date_in: '2025-11-02', status: 'IN_PROGRESS' },
                ],
                'READY_FOR_PICKUP': [
                    { id: 3, job_number: 'JC-003', client_name: 'Jane Smith', vehicle_model: 'CRV', vehicle_license: 'T456XYZ', total_due: 75.00, date_in: '2025-11-03', status: 'READY_FOR_PICKUP' },
                ]
            }
        };
        
        try {
            // Uncomment this line when your Django API is ready:
            // const res = await apiClient.get('/jobcards/kanban/'); 
            // setKanbanData(res.data.columns);
            // setStatusKeys(res.data.statuses);
            
            setKanbanData(MOCK_DATA.columns);
            setStatusKeys(MOCK_DATA.statuses);
            
        } catch (err) {
            console.error("Failed to fetch Kanban data:", err.response ? err.response.data : err.message);
            setError('Failed to load job cards. Check API status. (Showing mock data)');
            setKanbanData(MOCK_DATA.columns);
            setStatusKeys(MOCK_DATA.statuses);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchKanbanData();
    }, [fetchKanbanData]); 

    // 🔑 CORE DRAG AND DROP LOGIC
    const onDragEnd = async (result) => {
        const { source, destination, draggableId } = result;

        if (!destination || isUpdating) {
            return;
        }

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
                                 : Array.from(newKanbanData[destinationColumnKey]);
        
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
            await apiClient.patch(`/jobcards/${cardId}/`, {
                status: destinationColumnKey
            });

            console.log(`Job Card ${cardId} status updated to ${destinationColumnKey} successfully.`);
            
        } catch (apiError) {
            console.error("Failed to update Job Card status via API. Reverting state.", apiError);
            setError("Error: Failed to update job status on server. Reverting...");
            fetchKanbanData(); 
            
        } finally {
            setIsUpdating(false);
        }
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
                <h2><FaTag style={{marginRight: '10px'}}/> **Job Workflow**</h2>
                <button 
                    className="btn-new-job" 
                    onClick={() => navigate('/jobcards/new')}
                    disabled={isUpdating}
                >
                    <FaPlus /> Create Job Card
                </button>
            </header>
            
            {error && <div className="kanban-error-message">{error}</div>}
            
            <DragDropContext onDragEnd={onDragEnd}> 
                <div className="kanban-grid-full">
                    {statusKeys.map(statusKey => (
                        <KanbanColumn
                            key={statusKey}
                            statusKey={statusKey}
                            statusTitle={STATUS_MAP[statusKey]?.title || statusKey}
                            cards={kanbanData[statusKey] || []}
                            color={STATUS_MAP[statusKey]?.color || '#94A3B8'}
                            description={STATUS_MAP[statusKey]?.description}
                        />
                    ))}
                </div>
            </DragDropContext>
            
            {/* Overlay when API call is pending */}
            {isUpdating && <div className="update-overlay"><FaSpinner className="spinner-small" /> **Updating status...**</div>}


            {/* --- STYLES FOR KANBAN --- */}
            <style>{`
                .kanban-board-container {
                    padding: 25px; /* Slightly more spacious padding */
                    background-color: #F8F9FA;
                    min-height: 90vh;
                }
                
                .kanban-header-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 25px; /* Increased margin */
                    padding-bottom: 10px;
                    border-bottom: 1px solid #E5E7EB;
                }
                
                .btn-new-job {
                    /* Color remains excellent */
                    background-color: #10B981;
                    color: white;
                    border: none;
                    padding: 10px 18px; /* Slightly wider button */
                    border-radius: 8px; /* Slightly rounder buttons */
                    cursor: pointer;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: background-color 0.2s, transform 0.1s;
                }
                .btn-new-job:hover {
                    background-color: #059669;
                    transform: translateY(-1px);
                }
                
                .kanban-error-message {
                    padding: 12px;
                    margin-bottom: 25px;
                    background-color: #FEE2E2;
                    color: #B91C1C;
                    border: 1px solid #FCA5A5;
                    border-radius: 6px;
                    font-weight: 600; /* Bolder error message */
                }

                .update-overlay {
                    /* ... (remains unchanged, functionally perfect) ... */
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(255, 255, 255, 0.8);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 18px;
                    font-weight: 700;
                    color: #6366F1;
                    z-index: 9999;
                    gap: 10px;
                    border-radius: 8px;
                }

                /* ... Loading/Spinner CSS (remains unchanged) ... */

                .kanban-grid-full {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); /* Slightly wider minimum column size */
                    gap: 20px; 
                    align-items: flex-start;
                }

                .kanban-column {
                    background-color: #F4F7F9; 
                    border-radius: 10px; /* Slightly rounder corners for columns */
                    padding: 0 12px 12px 12px; /* Adjusted padding */
                    min-height: 70vh;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08); /* Slightly more prominent column shadow */
                }
                
                .kanban-column.dragging-over {
                    background-color: #E0E7FF; 
                    box-shadow: 0 0 15px rgba(99, 102, 241, 0.4); /* Highlight drag zone with a glow */
                }

                .column-title-kanban {
                    font-size: 19px; 
                    font-weight: 800;
                    padding: 18px 0 10px 0; /* More vertical padding */
                    margin: 0;
                    text-transform: uppercase;
                    border-bottom: 3px solid; 
                    text-align: center;
                    letter-spacing: 1px; /* Tighter letter spacing for title */
                    color: #111827; /* Darker title color for contrast */
                }
                
                .column-description {
                    font-size: 13px; /* Slightly larger description */
                    color: #9CA3AF;
                    text-align: center;
                    margin: 5px 0 15px 0;
                }
                
                .column-content-kanban {
                    flex-grow: 1;
                    padding-top: 8px;
                }
                
                .no-cards {
                    font-style: italic;
                    color: #9CA3AF;
                    text-align: center;
                    padding: 30px 10px;
                    font-size: 14px;
                    border: 1px dashed #D1D5DB;
                    border-radius: 6px; /* Match card border radius */
                    margin-top: 10px;
                }

                /* --- JOB CARD ITEM STYLES --- */
                .job-card-item {
                    background-color: #FFFFFF;
                    border-radius: 8px; 
                    padding: 18px; /* More padding inside the card */
                    margin-bottom: 15px; /* More space between cards */
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Crisper shadow for cards */
                    cursor: pointer; 
                    border-left: 6px solid; 
                    transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94); /* Smoother transition */
                }
                
                .job-card-item:active {
                    cursor: grabbing;
                    transform: scale(0.98); /* Slight press effect when dragging starts */
                }

                .job-card-item:hover {
                    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* Deeper lift on hover */
                    transform: translateY(-5px); 
                }

                .card-header-kanban {
                    display: flex;
                    justify-content: space-between;
                    font-size: 12px;
                    margin-bottom: 12px; /* More space below header */
                    font-weight: 600;
                    color: #6B7280;
                    border-bottom: 1px solid #F3F4F6;
                    padding-bottom: 5px;
                }
                
                .job-number-tag {
                    font-weight: 800;
                    text-transform: uppercase;
                }
                
                .card-client-name {
                    font-size: 16px; /* Slightly larger client name */
                    font-weight: 800;
                    color: #111827;
                    margin: 0 0 8px 0;
                }
                
                .card-vehicle-info, .card-footer-kanban {
                    font-size: 13px;
                    color: #4B5563;
                    margin-top: 5px;
                }
                
                .card-footer-kanban {
                    border-top: 1px solid #E5E7EB; /* Slightly darker top border */
                    padding-top: 10px; /* More space above total due */
                    margin-top: 10px;
                    font-weight: 700; /* Bolder total due */
                    color: #374151;
                }
            `}</style>
        </div>
    );
};

export default JobCardKanban;