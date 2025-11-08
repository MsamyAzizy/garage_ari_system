import React, { useState, useEffect } from 'react'; 
import { FaArrowUp, FaArrowDown, FaUsers, FaCar, FaFileInvoiceDollar, FaCalendarCheck, FaExclamationTriangle } from 'react-icons/fa'; 
import apiClient from '../utils/apiClient'; 

// --- Kanban Statuses for Display ---
const KANBAN_STATUSES = [
    { title: "Open Jobs", color: "#F59E0B" }, 
    { title: "In Progress", color: "#6366F1" }, 
    { title: "Ready for Pickup", color: "#10B981" }, 
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
                    <Icon size={18} /> {/* Reduced icon size */}
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
                <div key={status.title} className="kanban-column-placeholder"> {/* Border removed here */}
                    {/* Title color remains to distinguish columns */}
                    <h3 className="column-title" style={{ color: status.color }}>
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
// 3. Main Dashboard Component (Unchanged functionality)
// ----------------------------------------------------
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
    
    useEffect(() => {
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
            {/* STYLES (MINIMAL & COMPACT) */}
            {/* ----------------------------------------------------------------- */}
            <style>{`
                .dashboard-page {
                    padding: 20px; /* Reduced padding */
                    background-color: #F8F9FA; 
                    min-height: 100vh;
                    font-family: 'Inter', sans-serif, 'Helvetica Neue', Arial; 
                    margin-left: 0; /* Let main layout handle margin */
                    transition: margin-left 0.3s ease;
                }
                
                .dashboard-page.shifted {
                     margin-left: 70px; /* Reduced shift margin */
                }

                .dashboard-header-path {
                    margin-bottom: 20px; /* Reduced margin */
                }
                
                .dashboard-title {
                    font-size: 22px; /* Reduced title size */
                    font-weight: 700;
                    color: #1E293B;
                }

                .stat-card-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); /* Minimized card width */
                    gap: 15px; /* Reduced gap */
                    margin-bottom: 30px;
                }
                
                /* KANBAN STYLES (Minimized and Borderless) */
                .kanban-section {
                    background-color: #FFFFFF;
                    border-radius: 8px; /* Slightly smaller radius */
                    padding: 20px; /* Reduced padding */
                    margin-bottom: 30px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); 
                    border: 1px solid #E5E7EB; 
                }

                .kanban-title {
                    color: #1E293B;
                    font-size: 18px; /* Reduced size */
                    font-weight: 700;
                    margin-bottom: 15px;
                    border-bottom: 1px solid #F3F4F6;
                    padding-bottom: 10px;
                }
                
                .kanban-grid-placeholder {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); /* Minimized column width */
                    gap: 15px;
                }

                .kanban-column-placeholder {
                    background-color: #FAFAFA;
                    border-radius: 6px; 
                    padding: 0;
                    min-height: 150px; /* Reduced min height */
                    border-left: none; /* --- REMOVED BORDER --- */
                    border: 1px solid #F3F4F6; /* Light surrounding border */
                    overflow: hidden;
                    box-shadow: none; 
                }
                
                .column-title {
                    background-color: transparent; 
                    padding: 10px 15px; /* Reduced padding */
                    margin-top: 0;
                    font-size: 14px; 
                    font-weight: 600;
                    text-transform: uppercase;
                    border-bottom: 1px solid #E5E7EB;
                }
                
                .column-content {
                    padding: 10px;
                    color: #6B7280;
                    font-size: 13px; /* Reduced size */
                    text-align: center;
                }
                
                .kanban-info {
                    margin-top: 15px;
                    font-style: italic;
                    color: #9CA3AF;
                    font-size: 12px;
                }
                
                /* STAT CARD STYLES (COMPACT) */
                .stat-card-container {
                    background-color: #FFFFFF; 
                    border-radius: 8px; /* Reduced radius */
                    padding: 15px; /* Reduced padding */
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); 
                    border: 1px solid #E5E7EB; 
                    display: flex;
                    flex-direction: column;
                    min-height: 120px; /* Reduced min height */
                    transition: all 0.2s ease-in-out;
                    border-left: 4px solid #E5E7EB; /* Reduced border thickness */
                }
                
                /* Dynamic Left Borders based on passed color class */
                .stat-card-container.border-primary { border-left-color: #6366F1; } 
                .stat-card-container.border-warning { border-left-color: #F59E0B; } 
                .stat-card-container.border-success { border-left-color: #10B981; } 
                .stat-card-container.border-info { border-left-color: #0EA5E9; } 

                .stat-card-container:hover {
                    transform: translateY(-3px); /* Reduced lift */
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08); /* Reduced shadow */
                }
                
                .stat-card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 5px; /* Reduced margin */
                }

                .stat-card-icon {
                    width: 36px; /* Reduced size */
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
                    font-size: 12px; /* Reduced size */
                    font-weight: 600; 
                    text-transform: uppercase;
                    letter-spacing: 0.5px; 
                }
                
                .stat-value-group {
                    display: flex;
                    align-items: center;
                    margin-bottom: 8px; /* Reduced margin */
                }

                .stat-value {
                    font-size: 32px; /* Significantly reduced value size */
                    font-weight: 900; 
                    color: #1F2937; 
                    line-height: 1;
                }

                .alert-icon {
                    font-size: 18px; /* Reduced size */
                    margin-left: 8px;
                }

                .stat-card-footer {
                    border-top: 1px dashed #F3F4F6; 
                    padding-top: 10px; /* Reduced padding */
                    margin-top: auto; 
                    font-size: 12px; /* Reduced size */
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .change-icon {
                    font-size: 8px; /* Reduced size */
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