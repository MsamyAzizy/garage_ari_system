import React, { useState, useEffect } from 'react'; 
import { 
    FaArrowUp, 
    FaArrowDown, 
    FaUsers, 
    FaCar, 
    FaFileInvoiceDollar, 
    FaCalendarCheck, 
    FaExclamationTriangle,
    FaRegLightbulb, 
} from 'react-icons/fa'; 
import apiClient from '../utils/apiClient'; 

// --- Kanban Statuses for Display ---
const KANBAN_STATUSES = [
    { title: "Open Jobs", color: "#F59E0B" }, 
    { title: "In Progress", color: "#6366F1" }, 
    { title: "Ready for Pickup", "color": "#10B981" }, 
    { title: "Paid/Closed", color: "#94A3B8" } 
];

// ----------------------------------------------------
// 1. StatCard Component (Unchanged functionality)
// ----------------------------------------------------
const StatCard = ({ title, value, change, unit, color, icon: Icon, statusAlert }) => {
    const changeValue = change !== null && change !== undefined ? change : '+0%';
    
    const isPositive = changeValue.startsWith('+');
    
    const ChangeIcon = isPositive ? FaArrowUp : FaArrowDown;
    const changeClass = isPositive ? 'text-positive' : 'text-negative';
    
    const displayChange = changeValue === '+0.0%' ? '' : changeValue; 
    
    const cardClass = statusAlert === 'RED_ALERT' 
        ? `stat-card-container alert-red` 
        : `stat-card-container ${color}`; 

    return (
        <div className={cardClass}>
            <div className="stat-card-header">
                <div className="stat-title">{title}</div>
                <div className={`stat-card-icon ${color}`}> 
                    <Icon size={18} /> 
                </div>
            </div>
            
            <div className="stat-value-group">
                <div className="stat-value">
                    {value}
                </div>
                {statusAlert === 'RED_ALERT' && (
                    <FaExclamationTriangle className="alert-icon" title="Client Count is Low!" />
                )}
            </div>

            <div className="stat-card-footer">
                <span className={`stat-change ${changeClass}`}>
                    {displayChange} {displayChange && <ChangeIcon className="change-icon" />}
                </span>
                <span className="stat-unit">{unit}</span>
            </div>
        </div>
    );
};


// ----------------------------------------------------
// 2. Kanban Board Placeholder Component
// ----------------------------------------------------
const KanbanBoardPlaceholder = () => (
    <div className="kanban-section">
        <h2 className="kanban-title">Job Card Workflow Status</h2>
        <div className="kanban-grid-placeholder">
            {KANBAN_STATUSES.map((status) => (
                <div key={status.title} className="kanban-column-placeholder"> 
                    {/* Updated component to use inline style for border-color for visual cue */}
                    <h3 className="column-title" style={{ borderTopColor: status.color, color: status.color }}>
                        {status.title} (0)
                    </h3>
                    <div className="column-content">
                        <p>No active job cards in this stage.</p>
                    </div>
                </div>
            ))}
        </div>
        <p className="kanban-info">The full, interactive Job Card Kanban board will be implemented here for easy workflow management.</p>
    </div>
);


// ----------------------------------------------------
// 3. Guided Tour Pop-up Box Component
// ----------------------------------------------------
const TourBox = ({ step, totalSteps, onClose, onNext, position, title, content }) => {
    const isLastStep = step === totalSteps; 
    
    return (
        <div className={`tour-box ${position}`}>
            <div className="tour-header">
                <FaRegLightbulb size={18} style={{ marginRight: '8px', color: '#6366F1' }}/>
                <span className="tour-step-counter">Step {step} of {totalSteps}</span>
            </div>
            
            <h4 className="tour-title">{title}</h4>
            <p className="tour-content">{content}</p>

            <div className="tour-actions">
                <button className="tour-btn tour-btn-skip" onClick={onClose}>
                    {isLastStep ? 'Close Tour' : 'Skip Tour'}
                </button>
                <button className="tour-btn tour-btn-next" onClick={isLastStep ? onClose : onNext}>
                    {isLastStep ? 'Finish' : 'Next →'} 
                </button>
            </div>
        </div>
    );
};


// ----------------------------------------------------
// 4. Main Dashboard Component
// ----------------------------------------------------
const TOUR_COMPLETED_KEY = 'dashboardTourLastShown';
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000; // Milliseconds in 24 hours

const Dashboard = ({ isSidebarCollapsed }) => { 
    const [stats, setStats] = useState({ 
        totalClients: '...', 
        totalVehicles: '...',
        totalSales: '...',
        totalAppointments: '...',
        clientChange: '+0.0%',
        salesChange: '+0.0%', 
        appointmentChange: '+0.0%', 
        clientStatusAlert: 'OK',
    });
    
    const [isLoading, setIsLoading] = useState(true); 
    const [error, setError] = useState(null); 

    // Tour State Management (Start at -1 until localStorage check determines if it should be 1 or 0)
    const totalTourSteps = 2;
    const [tourStep, setTourStep] = useState(-1);

    const tourContent = [
        {
            position: 'center-modal', // Step 1: Center Modal Overlay
            title: "Welcome to your Dashboard!",
            content: "This quick tour will highlight key areas. Let's start with the overall metrics.",
        },
        {
            position: 'top-right', // Step 2: Top Right Corner
            title: "Quick Status Overview",
            content: "These cards provide real-time metrics and month-over-month change for Clients, Vehicles, and Revenue.",
        },
    ];

    // Handlers
    const saveTourTimestamp = () => {
        // Save the current time when the tour is finished or skipped
        localStorage.setItem(TOUR_COMPLETED_KEY, Date.now().toString());
    };
    
    const handleNextStep = () => {
        if (tourStep < totalTourSteps) {
            setTourStep(prevStep => prevStep + 1);
        } else {
            // Last step reached: Save timestamp and close tour
            saveTourTimestamp();
            setTourStep(0); 
        }
    };
    
    const handleCloseTour = () => {
        // User explicitly skips: Save timestamp and close tour
        saveTourTimestamp();
        setTourStep(0); 
    };
    
    // 🏆 Combined useEffect for Tour Persistence and Data Fetching
    useEffect(() => {
        // --- 1. Tour Persistence Check ---
        const lastShown = localStorage.getItem(TOUR_COMPLETED_KEY);
        const now = Date.now();
        
        if (lastShown) {
            const timeDiff = now - parseInt(lastShown, 10);
            
            if (timeDiff < TWENTY_FOUR_HOURS) {
                // Tour was shown less than 24 hours ago
                setTourStep(0); 
            } else {
                // Tour is older than 24 hours, show it
                setTourStep(1); 
            }
        } else {
            // Never shown, show it
            setTourStep(1); 
        }

        // --- 2. Data Fetching Logic ---
        const fetchDashboardData = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                const metricsRes = await apiClient.get('/dashboard/metrics/'); 
                const data = metricsRes.data;

                setStats({
                    totalClients: data.total_clients.toLocaleString(),
                    totalVehicles: data.total_vehicles.toLocaleString(),
                    totalSales: data.total_sales, 
                    totalAppointments: data.total_appointments.toLocaleString(),
                    clientChange: data.client_percentage_change, 
                    salesChange: data.sales_percentage_change, 
                    appointmentChange: data.appointment_percentage_change,
                    clientStatusAlert: data.client_status_alert,
                });
                
            } catch (err) {
                console.error("Failed to fetch dashboard metrics:", err.response ? err.response.data : err.message);
                
                const status = err.response ? err.response.status : 'N/A';
                setError(`Failed to load data. Status: ${status}. Check API or Auth.`);
                
                setStats({
                    totalClients: 'Error',
                    totalVehicles: 'Error',
                    totalSales: 'Error',
                    totalAppointments: 'Error',
                    clientChange: '+0.0%',
                    salesChange: '+0.0%',
                    appointmentChange: '+0.0%',
                    clientStatusAlert: 'ERROR',
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []); 

    const displayStats = [
        { 
            title: 'Total Clients', 
            value: stats.totalClients, 
            change: stats.clientChange, 
            unit: 'MoM New Clients', 
            color: 'border-info', 
            icon: FaUsers,
            statusAlert: stats.clientStatusAlert,
        },
        { 
            title: 'Total Vehicles', 
            value: stats.totalVehicles, 
            change: '+0.0%', 
            unit: 'MoM Vehicle Adds', 
            color: 'border-warning', 
            icon: FaCar 
        },
        { 
            title: 'Total Sales Orders', 
            value: stats.totalSales, 
            change: stats.salesChange, 
            unit: 'MoM Revenue Change', 
            color: 'border-success', 
            icon: FaFileInvoiceDollar 
        },
        { 
            title: 'Total Appointments', 
            value: stats.totalAppointments, 
            change: stats.appointmentChange, 
            unit: 'MoM Appointment Change', 
            color: 'border-primary', 
            icon: FaCalendarCheck 
        },
    ];

    return (
        <div className={`dashboard-page ${isSidebarCollapsed ? 'shifted' : ''}`}>
            
            {/* GUIDED TOUR IMPLEMENTATION: Only render if tourStep is 1 or 2 */}
            {tourStep > 0 && (
                <>
                    {/* Define currentTourStep only when tourStep > 0 to prevent runtime error */}
                    {(() => {
                        // tourStep is guaranteed to be 1 or 2 here
                        const currentTourStep = tourContent[tourStep - 1]; 
                        return (
                            <>
                                {/* Dark overlay for all steps */}
                                <div className="tour-backdrop" onClick={handleCloseTour}></div>

                                <TourBox
                                    step={tourStep}
                                    totalSteps={totalTourSteps}
                                    onClose={handleCloseTour}
                                    onNext={handleNextStep}
                                    position={currentTourStep.position}
                                    title={currentTourStep.title}
                                    content={currentTourStep.content}
                                />
                            </>
                        );
                    })()}
                </>
            )}
            {/* ----------------------------- */}

            <div className="dashboard-header-path">
                <h1 className="dashboard-title">Dashboard Overview</h1>
            </div>
            
            {/* 1. Quick Statistics */}
            <div className="dashboard-stats">
                <div className="stat-card-grid">
                    {isLoading ? (
                         <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#64748B' }}>Loading data...</p>
                    ) : error ? (
                        <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#DC2626', fontWeight: 'bold' }}>{error}</p>
                    ) : (
                        displayStats.map((stat) => (
                            <StatCard 
                                key={stat.title} 
                                {...stat}
                            />
                        ))
                    )}
                </div>
            </div>
            
            {/* 2. Kanban Board View */}
            <KanbanBoardPlaceholder />
            

            {/* ----------------------------------------------------------------- */}
            {/* 🎨 UPDATED KANBAN STYLES ONLY */}
            {/* ----------------------------------------------------------------- */}
            <style>{`
                .dashboard-page {
                    padding: 20px; 
                    background-color: #F8F9FA; 
                    min-height: 100vh;
                    font-family: 'Inter', sans-serif, 'Helvetica Neue', Arial; 
                    margin-left: 0; 
                    transition: margin-left 0.3s ease;
                    position: relative; 
                    z-index: 1; 
                }
                
                .dashboard-page.shifted {
                     margin-left: 70px; 
                }

                .dashboard-header-path {
                    margin-bottom: 20px; 
                }
                
                .dashboard-title {
                    font-size: 22px; 
                    font-weight: 700;
                    color: #1E293B;
                }

                .stat-card-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); 
                    gap: 15px; 
                    margin-bottom: 30px;
                }
                
                /* ---------------------------------------------------- */
                /* 🏆 TOUR BOX (POP-UP) STYLES (Unchanged) */
                /* ---------------------------------------------------- */
                
                .tour-backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5); 
                    z-index: 1000;
                }

                .tour-box {
                    position: fixed;
                    /* Semi-transparent white background */
                    background-color: rgba(255, 255, 255, 0.85); 
                    /* Black text color */
                    color: #1E293B; 
                    border-radius: 8px;
                    padding: 20px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                    /* FIX: High z-index to ensure visibility over the sidebar */
                    z-index: 9999; 
                    max-width: 350px;
                    animation: fadeIn 0.3s ease-out;
                    border: 2px solid #6366F1; 
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }

                .tour-header {
                    display: flex;
                    align-items: center;
                    margin-bottom: 10px;
                }
                
                .tour-step-counter {
                    font-size: 12px;
                    font-weight: 600;
                    color: #4B5563; 
                    text-transform: uppercase;
                }

                .tour-title {
                    font-size: 16px;
                    font-weight: 700;
                    margin: 0 0 5px 0;
                    color: #1E293B; 
                }
                
                .tour-content {
                    font-size: 14px;
                    line-height: 1.4;
                    margin-bottom: 20px;
                    color: #1E293B; 
                }

                .tour-actions {
                    display: flex;
                    justify-content: space-between;
                    gap: 10px;
                }
                
                .tour-btn {
                    padding: 8px 15px;
                    border: none;
                    border-radius: 4px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.2s;
                    font-size: 13px;
                }

                .tour-btn-skip {
                    background-color: #F3F4F6;
                    color: #4B5563;
                }
                .tour-btn-skip:hover {
                    background-color: #E5E7EB;
                }

                .tour-btn-next {
                    background-color: #6366F1;
                    color: #FFFFFF;
                    min-width: 80px;
                }
                .tour-btn-next:hover {
                    background-color: #4F46E5;
                }

                /* --- Position Modifiers --- */
                
                /* Step 1: Center Modal Overlay */
                .tour-box.center-modal {
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    text-align: center;
                }

                /* Step 2: Top Right */
                .tour-box.top-right {
                    top: 20px;
                    right: 20px;
                }
                
                /* Step 3 (No longer used by logic, but CSS remains): Top Left */
                .tour-box.top-left {
                    top: 100px; 
                    left: 20px;
                }
                
                /* --- END TOUR BOX STYLES --- */
                /* ---------------------------------------------------- */
                
                
                /* 🎨 KANBAN STYLES (UPDATED FOR GOOD APPEARANCE) */
                .kanban-section {
                    background-color: #FFFFFF;
                    border-radius: 10px; 
                    padding: 25px; /* Increased padding */
                    margin-bottom: 30px;
                    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08); /* Stronger shadow for main box */
                    border: 1px solid #E5E7EB; 
                }

                .kanban-title {
                    color: #1E293B;
                    font-size: 20px; 
                    font-weight: 700;
                    margin-bottom: 20px;
                    border-bottom: 2px solid #F3F4F6; /* Thicker separator */
                    padding-bottom: 10px;
                    letter-spacing: 0.5px;
                }
                
                .kanban-grid-placeholder {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
                    gap: 20px; /* Increased gap */
                }

                .kanban-column-placeholder {
                    background-color: #FFFFFF; /* White body */
                    border-radius: 8px; 
                    padding: 0;
                    min-height: 180px; 
                    border: 1px solid #E5E7EB; 
                    overflow: hidden;
                    /* Subtle inner shadow for depth */
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05); 
                    transition: box-shadow 0.2s ease-in-out;
                }

                .kanban-column-placeholder:hover {
                    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1); /* Lift on hover */
                }
                
                .column-title {
                    /* Style for visual flair */
                    background-color: #F9FAFB; /* Light header background */
                    padding: 12px 15px; 
                    margin-top: 0;
                    font-size: 15px; 
                    font-weight: 700;
                    text-transform: uppercase;
                    border-bottom: 1px solid #E5E7EB;
                    border-top: 4px solid; /* Colored strip at the top (defined by inline style in component) */
                    color: #1E293B; /* Title color set to dark for better contrast */
                    letter-spacing: 0.5px;
                }
                
                .column-content {
                    padding: 20px 15px; /* More padding */
                    color: #6B7280;
                    font-size: 14px; 
                    text-align: center;
                }
                
                .kanban-info {
                    margin-top: 25px; 
                    font-style: italic;
                    color: #9CA3AF;
                    font-size: 13px;
                    padding-top: 15px;
                    border-top: 1px solid #F3F4F6;
                }
                
                /* STAT CARD STYLES (Unchanged) */
                .stat-card-container {
                    background-color: #FFFFFF; 
                    border-radius: 8px; 
                    padding: 15px; 
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); 
                    border: 1px solid #E5E7EB; 
                    display: flex;
                    flex-direction: column;
                    min-height: 120px; 
                    transition: all 0.2s ease-in-out;
                    border-left: 4px solid #E5E7EB; 
                }
                
                /* Dynamic Left Borders based on passed color class */
                .stat-card-container.border-primary { border-left-color: #6366F1; } 
                .stat-card-container.border-warning { border-left-color: #F59E0B; } 
                .stat-card-container.border-success { border-left-color: #10B981; } 
                .stat-card-container.border-info { border-left-color: #0EA5E9; } 

                .stat-card-container:hover {
                    transform: translateY(-3px); 
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08); 
                }
                
                .stat-card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 5px; 
                }

                .stat-card-icon {
                    width: 36px; 
                    height: 36px; 
                    font-size: 18px; 
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-radius: 50%; 
                }
                
                /* Icon colors */
                .stat-card-icon.border-primary { color: #6366F1; background-color: #EEF2FF; } 
                .stat-card-icon.border-warning { color: #F59E0B; background-color: #FFFBEB; } 
                .stat-card-icon.border-success { color: #10B981; background-color: #ECFDF5; } 
                .stat-card-icon.border-info { color: #0EA5E9; background-color: #EFF6FF; } 


                .stat-title {
                    font-size: 12px; 
                    font-weight: 600; 
                    text-transform: uppercase;
                    letter-spacing: 0.5px; 
                }
                
                .stat-value-group {
                    display: flex;
                    align-items: center;
                    margin-bottom: 8px; 
                }

                .stat-value {
                    font-size: 32px; 
                    font-weight: 900; 
                    color: #1F2937; 
                    line-height: 1;
                }

                .alert-icon {
                    font-size: 18px; 
                    margin-left: 8px;
                }

                .stat-card-footer {
                    border-top: 1px dashed #F3F4F6; 
                    padding-top: 10px; 
                    margin-top: auto; 
                    font-size: 12px; 
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .change-icon {
                    font-size: 8px; 
                    margin-left: 4px;
                }

                .stat-change {
                    font-weight: 700; 
                    margin-right: 5px;
                }
                
                .text-positive { color: #10B981; }
                .text-negative { color: #EF4444; }
                
                .stat-unit {
                    color: #9CA3AF; 
                    font-weight: 500;
                }

                .stat-card-container.alert-red {
                    border: 2px solid #EF4444; 
                    box-shadow: 0 0 10px rgba(248, 113, 113, 0.4); 
                }
                
                @keyframes pulse {
                  0% { opacity: 0.6; }
                  50% { opacity: 1.0; }
                  100% { opacity: 0.6; }
                }
            `}</style>
        </div>
    );
};

export default Dashboard;