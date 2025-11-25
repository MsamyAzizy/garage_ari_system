import React, { useState, useEffect } from 'react'; 
import { 
    FaArrowUp, 
    FaArrowDown, 
    FaUsers, 
    FaCar, 
    FaFileInvoiceDollar, 
    FaCalendarCheck, 
    FaExclamationTriangle,
    // FaRegLightbulb, // Removed: Not needed without TourBox
    // ADDED Imports for new widgets:
    FaChevronDown,
    FaEllipsisV,
} from 'react-icons/fa'; 
import apiClient from '../utils/apiClient'; 

// --- Constants ---
const KANBAN_STATUSES = [
    { title: "Open Jobs", color: "#F59E0B" }, 
    { title: "In Progress", color: "#6366F1" }, 
    { title: "Ready for Pickup", "color": "#10B981" }, 
    { title: "Paid/Closed", color: "#94A3B8" } 
];

// const TOUR_COMPLETED_KEY = 'dashboardTourLastShown'; // Removed
// const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000; // Milliseconds in 24 hours // Removed

// --- Placeholder Data for New Widgets (UPDATED FOR AUTO REPAIR) ---
const SALES_ORDERS_DATA = [
    { id: 'SO-1990', make: 'Ford', price: '$83.74', status: 'Paid' },
    { id: 'SO-1991', make: 'BMW', price: '$97.14', status: 'Out of date' },
];

const JOB_CARDS_DATA = {
    total: 0, // Total Job Cards Processed (e.g., this quarter)
    breakdown: [
        { serviceType: 'Oil Change', value: 30000, color: '#10B981' }, 
        { serviceType: 'Inspection', value: 60000, color: '#0EA5E9' }, 
        { serviceType: 'Repair', value: 48245, color: '#6366F1' }, 
        { serviceType: 'Bodywork', value: 50000, color: '#F59E0B' }, 
    ]
};

const TOP_PARTS_DATA = [
    { name: 'Brake Pad Set (Front)', version: 'Free', download: '9.91k', install: '9.88 Mb', update: '9.91k', iconColor: '#EF4444' }, // download -> Qty Sold, install -> Stock, update -> Back Orders
    { name: 'Oil Filter (Wix 51515)', version: 'Free', download: '1.95k', install: '1.9 Mb', update: '1.93k', iconColor: '#10B981' },
];

// --- Placeholder Data for Area Installed Chart (UPDATED FOR AUTO REPAIR) ---
// Note: Changed region names to reflect garage locations
const REVENUE_BY_LOCATION_DATA = [
    { month: 'Jan', 'Shop 1 (North)': 5, 'Shop 2 (South)': 8, 'Shop 3 (HQ)': 7 },
    { month: 'Feb', 'Shop 1 (North)': 10, 'Shop 2 (South)': 15, 'Shop 3 (HQ)': 25 },
    { month: 'Mar', 'Shop 1 (North)': 5, 'Shop 2 (South)': 10, 'Shop 3 (HQ)': 25 },
    { month: 'Apr', 'Shop 1 (North)': 8, 'Shop 2 (South)': 10, 'Shop 3 (HQ)': 10 },
    { month: 'May', 'Shop 1 (North)': 15, 'Shop 2 (South)': 10, 'Shop 3 (HQ)': 35 },
    { month: 'Jun', 'Shop 1 (North)': 10, 'Shop 2 (South)': 5, 'Shop 3 (HQ)': 5 },
    { month: 'Jul', 'Shop 1 (North)': 15, 'Shop 2 (South)': 20, 'Shop 3 (HQ)': 30 },
    { month: 'Aug', 'Shop 1 (North)': 10, 'Shop 2 (South)': 10, 'Shop 3 (HQ)': 30 },
    { month: 'Sep', 'Shop 1 (North)': 8, 'Shop 2 (South)': 8, 'Shop 3 (HQ)': 35 },
    { month: 'Oct', 'Shop 1 (North)': 5, 'Shop 2 (South)': 15, 'Shop 3 (HQ)': 25 },
    { month: 'Nov', 'Shop 1 (North)': 5, 'Shop 2 (South)': 5, 'Shop 3 (HQ)': 15 },
    { month: 'Dec', 'Shop 1 (North)': 10, 'Shop 2 (South)': 10, 'Shop 3 (HQ)': 30 },
];

const SHOP_LEGEND = {
    'Shop 1 (North)': '1.23K', // Sales figures placeholder
    'Shop 2 (South)': '6.79K',
    'Shop 3 (HQ)': '1.01K',
};


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
// 3. Guided Tour Pop-up Box Component - REMOVED!
// ----------------------------------------------------
/*
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
*/


// ----------------------------------------------------
// 4. NEW WIDGET COMPONENTS
// ----------------------------------------------------

/**
 * Renders the Donut Chart (Current Job Cards widget)
 */
const JobCardsChart = ({ data }) => {
    const totalValue = data.total.toLocaleString();
    
    // Simple logic to set background colors for the donut (approximation)
    const conicGradient = data.breakdown.map((item) => item.color).join(', ');
    
    return (
        <div className="widget-card">
            <h3 className="widget-title">Current Job Cards</h3>
            <p className="widget-subtitle">Grouped by Service Type</p>
            
            <div className="donut-chart-container">
                <div className="donut-chart" style={{ 
                    // Faking the donut effect using border and background colors
                    backgroundImage: `conic-gradient(${conicGradient})` 
                }}>
                    <div className="donut-center">
                        <div className="donut-center-total-label">Total</div>
                        <div className="donut-center-total-value">{totalValue}</div>
                    </div>
                </div>
            </div>

            <div className="donut-legend">
                {data.breakdown.map((item) => (
                    <div key={item.serviceType} className="legend-item">
                        <span className="legend-dot" style={{ backgroundColor: item.color }}></span>
                        {item.serviceType}
                    </div>
                ))}
            </div>
        </div>
    );
};

/**
 * Renders the Stacked Bar Chart (Service Revenue by Location widget)
 * UPDATED for a more modern appearance (rounded bars, cleaner grid).
 */
const RevenueByLocationChart = () => {
    const [selectedYear] = useState('2023');

    const chartData = REVENUE_BY_LOCATION_DATA; 
    
    // Max value for scaling bars 
    const MAX_CHART_VALUE = 80;
    
    // Keys for the location data (used for iteration and coloring)
    const shopKeys = Object.keys(SHOP_LEGEND);

    // Map keys to specific colors used in the original Area Installed chart
    const shopColors = {
        'Shop 1 (North)': 'bg-success',  // Corresponds to Asia
        'Shop 2 (South)': 'bg-warning', // Corresponds to Europe
        'Shop 3 (HQ)': 'bg-primary',     // Corresponds to Americas
    };
    
    // Y-axis markers for the grid
    const yAxisMarkers = [80, 60, 40, 20, 0];

    return (
        <div className="widget-card">
            <div className="widget-header">
                <div>
                    <h3 className="widget-title">Service Revenue by Location</h3>
                    <p className="widget-subtitle">(+43%) than last year</p>
                </div>
                <div className="dropdown-year">
                    {selectedYear} 
                    <FaChevronDown size={10} style={{ marginLeft: '5px' }} />
                </div>
            </div>
            
            <div className="chart-legend-area">
                <div className="legend-item"><span className={`legend-dot ${shopColors[shopKeys[0]]}`}></span>{shopKeys[0]} **{SHOP_LEGEND[shopKeys[0]]}**</div>
                <div className="legend-item"><span className={`legend-dot ${shopColors[shopKeys[1]]}`}></span>{shopKeys[1]} **{SHOP_LEGEND[shopKeys[1]]}**</div>
                <div className="legend-item"><span className={`legend-dot ${shopColors[shopKeys[2]]}`}></span>{shopKeys[2]} **{SHOP_LEGEND[shopKeys[2]]}**</div>
            </div>

            <div className="stacked-bar-chart">
                {/* Y-Axis and Grid Lines (Simplified to use the component's structure) */}
                <div className="y-axis">
                    {yAxisMarkers.map(marker => (
                        <span key={marker} className="y-axis-label-modern">{marker}</span>
                    ))}
                </div>
                
                <div className="bars-container">
                    
                    {/* Add horizontal grid lines behind the bars */}
                    <div className="horizontal-grid">
                        {/* We need 3 lines for markers 20, 40, 60. 80 is the top, 0 is the bottom line. */}
                        {yAxisMarkers.slice(1, -1).map(marker => (
                            <div 
                                key={marker} 
                                className="grid-line" 
                                style={{ bottom: `${(marker / MAX_CHART_VALUE) * 100}%` }}
                            ></div>
                        ))}
                    </div>
                    
                    {chartData.map((data, index) => {
                        
                        // Calculate percentage heights based on MAX_CHART_VALUE (80)
                        const shop1Height = (data[shopKeys[0]] / MAX_CHART_VALUE) * 100;
                        const shop2Height = (data[shopKeys[1]] / MAX_CHART_VALUE) * 100;
                        const shop3Height = (data[shopKeys[2]] / MAX_CHART_VALUE) * 100;
                        
                        // Determine which bar is on top to apply top rounding only to it
                        let topBarClass = '';
                        if (shop3Height > 0) topBarClass = `${shopColors[shopKeys[2]]}-top-bar`;
                        else if (shop2Height > 0) topBarClass = `${shopColors[shopKeys[1]]}-top-bar`;
                        else if (shop1Height > 0) topBarClass = `${shopColors[shopKeys[0]]}-top-bar`;
                        
                        const bottomBarClass = shop1Height > 0 ? `${shopColors[shopKeys[0]]}-bottom-bar` : '';


                        return (
                            <div key={index} className="stacked-bar-column">
                                <div 
                                    className={`bar ${shopColors[shopKeys[2]]} ${topBarClass.includes(shopKeys[2]) ? 'rounded-top' : ''}`} 
                                    style={{ height: `${shop3Height}%` }}
                                    title={`${shopKeys[2]}: ${data[shopKeys[2]]}`}
                                ></div>
                                <div 
                                    className={`bar ${shopColors[shopKeys[1]]} ${topBarClass.includes(shopKeys[1]) ? 'rounded-top' : ''}`} 
                                    style={{ height: `${shop2Height}%` }}
                                    title={`${shopKeys[1]}: ${data[shopKeys[1]]}`}
                                ></div>
                                <div 
                                    className={`bar ${shopColors[shopKeys[0]]} ${topBarClass.includes(shopKeys[0]) ? 'rounded-top' : ''} ${bottomBarClass.includes(shopKeys[0]) ? 'rounded-bottom' : ''}`} 
                                    style={{ height: `${shop1Height}%` }}
                                    title={`${shopKeys[0]}: ${data[shopKeys[0]]}`}
                                ></div>
                                <div className="x-axis-label-modern">{data.month}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};


/**
 * Renders the New Sales Orders Table
 */
const NewSalesOrdersTable = ({ data }) => (
    <div className="widget-card table-widget">
        <h3 className="widget-title">New Sales Orders</h3>
        <table>
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Vehicle Make</th> {/* Category -> Vehicle Make */}
                    <th>Price</th>
                    <th>Status</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {data.map((order) => (
                    <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.make}</td> {/* invoice.category -> order.make */}
                        <td>{order.price}</td>
                        <td>
                            <span className={`status-badge status-${order.status.toLowerCase().replace(/ /g, '-')}`}>
                                {order.status}
                            </span>
                        </td>
                        <td><FaEllipsisV className="more-options-icon" /></td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

/**
 * Renders the Top Selling Parts List
 */
const TopSellingPartsList = ({ data }) => {
    const [selectedTimeframe, setSelectedTimeframe] = useState('Top 7 days');

    return (
        <div className="widget-card">
            <h3 className="widget-title">Top Selling Parts</h3> {/* Related applications -> Top Selling Parts */}
            
            <div className="timeframe-tabs">
                {['Top 7 days', 'Top 30 days', 'All times'].map((timeframe) => (
                    <button 
                        key={timeframe} 
                        className={`tab-btn ${selectedTimeframe === timeframe ? 'active' : ''}`}
                        onClick={() => setSelectedTimeframe(timeframe)}
                    >
                        {timeframe}
                    </button>
                ))}
            </div>

            <div className="applications-list">
                {data.map((part, index) => (
                    <div key={index} className="app-item">
                        <div className="app-icon" style={{ color: part.iconColor }}>
                            {/* Placeholder Icon (e.g., using a red dot as seen in the screenshot) */}
                            <span className="app-dot" style={{ backgroundColor: part.iconColor }}></span>
                        </div>
                        <div className="app-details">
                            <span className="app-name">{part.name}</span>
                            <span className="app-version">{part.version}</span>
                            <div className="app-metrics">
                                <span><FaArrowDown style={{ color: '#EF4444' }} /> {part.download} (Sold)</span> {/* download -> Qty Sold */}
                                <span><FaArrowUp style={{ color: '#10B981' }} /> {part.install} (Stock)</span> {/* install -> Stock Level */}
                                <span><FaUsers style={{ color: '#F59E0B' }} /> {part.update} (B.O.)</span> {/* update -> Back Orders */}
                            </div>
                        </div>
                        <FaEllipsisV className="more-options-icon" />
                    </div>
                ))}
            </div>
        </div>
    );
};


// ----------------------------------------------------
// 5. Main Dashboard Component
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

    // Tour State Management (Removed everything related to running the tour)
    // const totalTourSteps = 2; // Removed
    // const [tourStep, setTourStep] = useState(-1); // Removed
    // const tourContent = [ ... ]; // Removed

    // Handlers (Removed all tour handlers)
    /*
    const saveTourTimestamp = () => {
        localStorage.setItem(TOUR_COMPLETED_KEY, Date.now().toString());
    };
    
    const handleNextStep = () => {
        if (tourStep < totalTourSteps) {
            setTourStep(prevStep => prevStep + 1);
        } else {
            saveTourTimestamp();
            setTourStep(0); 
        }
    };
    
    const handleCloseTour = () => {
        saveTourTimestamp();
        setTourStep(0); 
    };
    */
    
    // 🏆 Combined useEffect for Tour Persistence and Data Fetching
    useEffect(() => {
        // --- 1. Tour Persistence Check --- (REMOVED LOGIC)
        /*
        const lastShown = localStorage.getItem(TOUR_COMPLETED_KEY);
        const now = Date.now();
        
        if (lastShown) {
            const timeDiff = now - parseInt(lastShown, 10);
            
            if (timeDiff < TWENTY_FOUR_HOURS) {
                setTourStep(0); 
            } else {
                setTourStep(1); 
            }
        } else {
            setTourStep(1); 
        }
        */

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
            
            {/* GUIDED TOUR IMPLEMENTATION - REMOVED! */}
            {/*
            {tourStep > 0 && (
                <>
                    {(() => {
                        const currentTourStep = tourContent[tourStep - 1]; 
                        return (
                            <>
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
            */}

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
            
            {/* 2. UPDATED: Top Row Widgets */}
            <div className="top-widgets-grid">
                <JobCardsChart data={JOB_CARDS_DATA} /> {/* Current Job Cards Chart */}
                <RevenueByLocationChart />                   {/* Service Revenue by Location Chart (UPDATED) */}
            </div>

            {/* 3. NEW: Bottom Row Widgets */}
            <div className="bottom-widgets-grid">
                <NewSalesOrdersTable data={SALES_ORDERS_DATA} /> {/* New Sales Orders Table */}
                <TopSellingPartsList data={TOP_PARTS_DATA} />      {/* Top Selling Parts List */}
            </div>
            
            {/* 4. Kanban Board View (Moved to bottom) */}
            <KanbanBoardPlaceholder />
            

            {/* ----------------------------------------------------------------- */}
            {/* 🎨 UPDATED STYLES FOR LIGHT THEME (WHITE BACKGROUND) AND NEW WIDGETS */}
            {/* ----------------------------------------------------------------- */}
            <style>{`
                .dashboard-page {
                    padding: 20px; 
                    background-color: #FFFFFF; /* Set to White */
                    min-height: 100vh;
                    font-family: 'Inter', sans-serif, 'Helvetica Neue', Arial; 
                    margin-left: 0; 
                    transition: margin-left 0.3s ease;
                    position: relative; 
                    z-index: 1; 
                    color: #1E293B; /* Dark text for light background */
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
                
                /* STAT CARD STYLES */
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
                    color: #4B5563; /* Subtle gray title */
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
                
                /* --- TOUR BOX STYLES (REMOVED: Tour is no longer active) --- */
                /*
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
                    background-color: rgba(255, 255, 255, 0.85); 
                    color: #1E293B; 
                    border-radius: 8px;
                    padding: 20px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                    z-index: 9999; 
                }
                */

                /* REMAINING CSS FOR WIDGETS AND LAYOUT */

                .top-widgets-grid {
                    display: grid;
                    grid-template-columns: 1fr 2fr; 
                    gap: 30px; 
                    margin-bottom: 30px;
                }

                .bottom-widgets-grid {
                    display: grid;
                    grid-template-columns: 3fr 2fr;
                    gap: 30px; 
                    margin-bottom: 30px;
                }

                .widget-card {
                    background-color: #FFFFFF;
                    border-radius: 8px;
                    padding: 20px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
                    border: 1px solid #E5E7EB;
                    min-height: 350px;
                }

                .widget-title {
                    font-size: 18px;
                    font-weight: 700;
                    margin-bottom: 5px;
                    color: #1E293B;
                }

                .widget-subtitle {
                    font-size: 13px;
                    color: #6B7280;
                    margin-bottom: 20px;
                }
                
                /* --- DONUT CHART STYLES --- */
                .donut-chart-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin: 30px 0;
                    position: relative;
                    height: 150px;
                    width:670px; 
                }

                .donut-chart {
                    width: 150px;
                    height: 150px;
                    border-radius: 50%;
                    position: relative;
                    box-shadow: 0 0 0 15px #F3F4F6; /* Fakes the thickness */
                }

                .donut-center {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background-color: #FFFFFF;
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
                }

                .donut-center-total-label {
                    font-size: 12px;
                    color: #9CA3AF;
                    font-weight: 500;
                }

                .donut-center-total-value {
                    font-size: 24px;
                    font-weight: 800;
                    color: #1E293B;
                }

                .donut-legend {
                    display: flex;
                    justify-content: space-around;
                    padding-top: 10px;
                    border-top: 1px dashed #F3F4F6;
                    margin-top: auto;
                }

                .legend-item {
                    display: flex;
                    align-items: center;
                    font-size: 13px;
                    color: #4B5563;
                }

                .legend-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    margin-right: 6px;
                }
                
                /* --- STACKED BAR CHART STYLES (MODERN) --- */
                .widget-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                }
                
                .dropdown-year {
                    font-size: 13px;
                    color: #6B7280;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    padding: 4px 8px;
                    border: 1px solid #E5E7EB;
                    border-radius: 4px;
                }

                .chart-legend-area {
                    display: flex;
                    justify-content: flex-start;
                    gap: 15px;
                    margin-bottom: 20px;
                    flex-wrap: wrap;
                    font-size: 13px;
                }
                
                .stacked-bar-chart {
                    display: flex;
                    height: 200px; 
                    position: relative;
                    padding-left: 30px; 
                }

                .y-axis {
                    position: absolute;
                    left: 0;
                    top: 0;
                    height: 100%;
                    display: flex;
                    flex-direction: column-reverse;
                    justify-content: space-between;
                    padding-bottom: 25px; /* Adjust for x-axis labels */
                }

                .y-axis-label-modern {
                    font-size: 11px;
                    color: #9CA3AF;
                    transform: translateY(50%);
                    text-align: right;
                    width: 25px;
                }

                .bars-container {
                    flex-grow: 1;
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-around;
                    position: relative;
                    padding: 0 5px;
                    border-bottom: 1px solid #E5E7EB; /* X-axis line */
                }
                
                .horizontal-grid {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }
                
                .grid-line {
                    position: absolute;
                    left: 0;
                    width: 100%;
                    border-top: 1px dashed #F3F4F6;
                    z-index: 0; 
                }


                .stacked-bar-column {
                    width: 15px; /* Bar width */
                    height: 100%;
                    display: flex;
                    flex-direction: column-reverse;
                    align-items: center;
                    position: relative;
                }

                .bar {
                    width: 100%;
                    transition: height 0.3s ease;
                    position: relative;
                }
                
                /* Background Colors for bars */
                .bg-primary { background-color: #6366F1; } /* Blue/HQ */
                .bg-warning { background-color: #F59E0B; } /* Amber/South */
                .bg-success { background-color: #10B981; } /* Green/North */

                /* Rounded corners logic */
                .rounded-top {
                    border-top-left-radius: 4px;
                    border-top-right-radius: 4px;
                }
                
                /* Only need rounded bottom if it's the very bottom bar */
                .stacked-bar-column > .bar:last-child { 
                    border-bottom-left-radius: 4px;
                    border-bottom-right-radius: 4px;
                }
                
                /* Fix for cases where one bar is 0, the next is rounded-top */
                .stacked-bar-column > .bar:first-child.rounded-top {
                    border-bottom-left-radius: 0;
                    border-bottom-right-radius: 0;
                }


                .x-axis-label-modern {
                    position: absolute;
                    bottom: -20px;
                    font-size: 11px;
                    color: #9CA3AF;
                }
                
                /* --- TABLE STYLES --- */
                .table-widget {
                    padding: 20px 0;
                    overflow-x: auto;
                }

                .table-widget h3 {
                    padding: 0 20px;
                }

                .table-widget table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 15px;
                }

                .table-widget th, .table-widget td {
                    padding: 10px 20px;
                    text-align: left;
                    font-size: 13px;
                    border-bottom: 1px solid #F3F4F6;
                }

                .table-widget th {
                    font-weight: 600;
                    color: #4B5563;
                    text-transform: uppercase;
                    background-color: #F9FAFB;
                }
                
                .table-widget td {
                    color: #374151;
                }

                .table-widget tr:hover {
                    background-color: #F9FAFB;
                }

                .status-badge {
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-weight: 600;
                    font-size: 11px;
                    text-transform: uppercase;
                }
                
                .status-paid { background-color: #D1FAE5; color: #065F46; } /* Green */
                .status-out-of-date { background-color: #FEE2E2; color: #991B1B; } /* Red */
                /* Add more statuses as needed */
                
                .more-options-icon {
                    color: #9CA3AF;
                    cursor: pointer;
                }

                /* --- TOP SELLING PARTS LIST STYLES --- */
                .timeframe-tabs {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 20px;
                }

                .tab-btn {
                    background-color: #F3F4F6;
                    color: #6B7280;
                    border: none;
                    padding: 6px 12px;
                    border-radius: 6px;
                    font-size: 12px;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }

                .tab-btn:hover {
                    background-color: #E5E7EB;
                }

                .tab-btn.active {
                    background-color: #6366F1;
                    color: #FFFFFF;
                }

                .applications-list {
                    display: flex;
                    flex-direction: column;
                }

                .app-item {
                    display: flex;
                    align-items: center;
                    padding: 10px 0;
                    border-bottom: 1px solid #F3F4F6;
                }
                
                .app-item:last-child {
                    border-bottom: none;
                }

                .app-icon {
                    width: 40px;
                    height: 40px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-radius: 50%;
                    margin-right: 15px;
                    position: relative;
                }
                
                .app-dot {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    border: 2px solid #FFFFFF;
                }


                .app-details {
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                }

                .app-name {
                    font-weight: 600;
                    color: #1E293B;
                    font-size: 14px;
                }

                .app-version {
                    font-size: 12px;
                    color: #9CA3AF;
                }

                .app-metrics {
                    font-size: 12px;
                    color: #6B7280;
                    margin-top: 5px;
                }

                .app-metrics span {
                    margin-right: 15px;
                    display: inline-flex;
                    align-items: center;
                }
                
                .app-metrics svg {
                    margin-right: 4px;
                    font-size: 10px;
                }
                
                /* --- KANBAN BOARD STYLES --- */
                .kanban-section {
                    background-color: #FFFFFF;
                    border-radius: 8px;
                    padding: 20px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
                    border: 1px solid #E5E7EB;
                    margin-top: 30px; 
                }

                .kanban-title {
                    font-size: 18px;
                    font-weight: 700;
                    margin-bottom: 15px;
                    color: #1E293B;
                }

                .kanban-grid-placeholder {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-bottom: 15px;
                }

                .kanban-column-placeholder {
                    background-color: #F9FAFB;
                    border-radius: 6px;
                    padding: 10px;
                    border-top: 4px solid;
                }

                .column-title {
                    font-size: 14px;
                    font-weight: 700;
                    margin-bottom: 10px;
                }

                .column-content {
                    font-size: 13px;
                    color: #6B7280;
                    min-height: 50px;
                    background-color: #FFFFFF;
                    padding: 10px;
                    border-radius: 4px;
                    border: 1px solid #E5E7EB;
                }
                
                .kanban-info {
                    font-size: 12px;
                    color: #9CA3AF;
                    text-align: center;
                    margin-top: 10px;
                }
                
            `}</style>
        </div>
    );
};

export default Dashboard;