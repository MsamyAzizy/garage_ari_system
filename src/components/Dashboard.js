import React, { useState, useEffect } from 'react'; 
import { 
    FaArrowUp, 
    FaArrowDown, 
    FaUsers, 
    FaCar, 
    FaFileInvoiceDollar, 
    FaCalendarCheck, 
    FaExclamationTriangle,
    FaChevronDown,
    FaEllipsisV,
    FaClipboardList,
    FaTools,
    FaCheckCircle,
    FaDollarSign
} from 'react-icons/fa'; 
import apiClient from '../utils/apiClient'; 

// --- Constants ---
const KANBAN_STATUSES = [
    { title: "Open Jobs", color: "#F59E0B", icon: FaClipboardList }, 
    { title: "In Progress", color: "#6366F1", icon: FaTools }, 
    { title: "Ready for Pickup", color: "#10B981", icon: FaCheckCircle }, 
    { title: "Paid/Closed", color: "#94A3B8", icon: FaDollarSign } 
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
// 2. Improved Kanban Board Placeholder Component
// ----------------------------------------------------
const KanbanBoardPlaceholder = () => (
    <div className="kanban-section">
        <div className="kanban-header">
            <h2 className="kanban-title">Job Card Workflow Status</h2>
            <p className="kanban-subtitle">Track and manage job cards through different stages</p>
        </div>
        <div className="kanban-grid">
            {KANBAN_STATUSES.map((status) => (
                <div key={status.title} className="kanban-column"> 
                    <div className="column-header" style={{ borderLeftColor: status.color }}>
                        <div className="column-title-wrapper">
                            <status.icon className="column-icon" style={{ color: status.color }} />
                            <h3 className="column-title">{status.title}</h3>
                        </div>
                        <div className="column-count">0</div>
                    </div>
                    <div className="column-content">
                        <div className="empty-state">
                            <div className="empty-icon">📋</div>
                            <p className="empty-text">No active job cards in this stage</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        <div className="kanban-footer">
            <p className="kanban-info">
                <strong>Coming Soon:</strong> The full, interactive Job Card Kanban board will be implemented here for easy workflow management.
            </p>
        </div>
    </div>
);

// ----------------------------------------------------
// 3. NEW WIDGET COMPONENTS (Updated to use real data)
// ----------------------------------------------------

/**
 * Renders the Donut Chart (Current Job Cards widget)
 */
const JobCardsChart = ({ data }) => {
    if (!data || !data.breakdown) {
        return (
            <div className="widget-card">
                <h3 className="widget-title">Current Job Cards</h3>
                <p className="widget-subtitle">Grouped by Service Type</p>
                <div className="loading-placeholder">Loading job card data...</div>
            </div>
        );
    }

    const totalValue = data.total.toLocaleString();
    const conicGradient = data.breakdown.map((item) => item.color).join(', ');
    
    return (
        <div className="widget-card">
            <h3 className="widget-title">Current Job Cards</h3>
            <p className="widget-subtitle">Grouped by Service Type</p>
            
            <div className="donut-chart-container">
                <div className="donut-chart" style={{ 
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
 */
const RevenueByLocationChart = ({ data }) => {
    const [selectedYear] = useState('2024');

    if (!data || !data.monthly_revenue) {
        return (
            <div className="widget-card">
                <h3 className="widget-title">Service Revenue by Location</h3>
                <div className="loading-placeholder">Loading revenue data...</div>
            </div>
        );
    }

    const chartData = data.monthly_revenue;
    const shopKeys = Object.keys(data.legend || {});
    const MAX_CHART_VALUE = Math.max(...chartData.flatMap(month => Object.values(month).filter(val => typeof val === 'number'))) * 1.2;

    const shopColors = {
        'Shop 1 (North)': 'bg-success',
        'Shop 2 (South)': 'bg-warning',
        'Shop 3 (HQ)': 'bg-primary',
    };
    
    const yAxisMarkers = [Math.ceil(MAX_CHART_VALUE * 0.8), Math.ceil(MAX_CHART_VALUE * 0.6), Math.ceil(MAX_CHART_VALUE * 0.4), Math.ceil(MAX_CHART_VALUE * 0.2), 0];

    return (
        <div className="widget-card">
            <div className="widget-header">
                <div>
                    <h3 className="widget-title">Service Revenue by Location</h3>
                    <p className="widget-subtitle">(+{data.growth_percentage || '0'}%) than last year</p>
                </div>
                <div className="dropdown-year">
                    {selectedYear} 
                    <FaChevronDown size={10} style={{ marginLeft: '5px' }} />
                </div>
            </div>
            
            <div className="chart-legend-area">
                {shopKeys.map(shop => (
                    <div key={shop} className="legend-item">
                        <span className={`legend-dot ${shopColors[shop]}`}></span>
                        {shop} **{data.legend?.[shop] || '0'}**
                    </div>
                ))}
            </div>

            <div className="stacked-bar-chart">
                <div className="y-axis">
                    {yAxisMarkers.map(marker => (
                        <span key={marker} className="y-axis-label-modern">{marker.toLocaleString()}</span>
                    ))}
                </div>
                
                <div className="bars-container">
                    <div className="horizontal-grid">
                        {yAxisMarkers.slice(1, -1).map(marker => (
                            <div 
                                key={marker} 
                                className="grid-line" 
                                style={{ bottom: `${(marker / MAX_CHART_VALUE) * 100}%` }}
                            ></div>
                        ))}
                    </div>
                    
                    {chartData.map((monthData, index) => {
                        const shop1Height = ((monthData[shopKeys[0]] || 0) / MAX_CHART_VALUE) * 100;
                        const shop2Height = ((monthData[shopKeys[1]] || 0) / MAX_CHART_VALUE) * 100;
                        const shop3Height = ((monthData[shopKeys[2]] || 0) / MAX_CHART_VALUE) * 100;
                        
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
                                    title={`${shopKeys[2]}: ${(monthData[shopKeys[2]] || 0).toLocaleString()}`}
                                ></div>
                                <div 
                                    className={`bar ${shopColors[shopKeys[1]]} ${topBarClass.includes(shopKeys[1]) ? 'rounded-top' : ''}`} 
                                    style={{ height: `${shop2Height}%` }}
                                    title={`${shopKeys[1]}: ${(monthData[shopKeys[1]] || 0).toLocaleString()}`}
                                ></div>
                                <div 
                                    className={`bar ${shopColors[shopKeys[0]]} ${topBarClass.includes(shopKeys[0]) ? 'rounded-top' : ''} ${bottomBarClass.includes(shopKeys[0]) ? 'rounded-bottom' : ''}`} 
                                    style={{ height: `${shop1Height}%` }}
                                    title={`${shopKeys[0]}: ${(monthData[shopKeys[0]] || 0).toLocaleString()}`}
                                ></div>
                                <div className="x-axis-label-modern">{monthData.month}</div>
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
const NewSalesOrdersTable = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="widget-card table-widget">
                <h3 className="widget-title">Recent Sales Orders</h3>
                <div className="loading-placeholder">No recent sales orders</div>
            </div>
        );
    }

    return (
        <div className="widget-card table-widget">
            <h3 className="widget-title">Recent Sales Orders</h3>
            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Vehicle Make</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((order) => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.make || 'N/A'}</td>
                            <td>{order.amount || 'N/A'}</td>
                            <td>
                                <span className={`status-badge status-${(order.status || 'pending').toLowerCase().replace(/ /g, '-')}`}>
                                    {order.status || 'Pending'}
                                </span>
                            </td>
                            <td><FaEllipsisV className="more-options-icon" /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

/**
 * Renders the Top Selling Parts List
 */
const TopSellingPartsList = ({ data }) => {
    const [selectedTimeframe, setSelectedTimeframe] = useState('Top 7 days');

    if (!data || data.length === 0) {
        return (
            <div className="widget-card">
                <h3 className="widget-title">Top Selling Parts</h3>
                <div className="loading-placeholder">No parts data available</div>
            </div>
        );
    }

    return (
        <div className="widget-card">
            <h3 className="widget-title">Top Selling Parts</h3>
            
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
                            <span className="app-dot" style={{ backgroundColor: part.iconColor }}></span>
                        </div>
                        <div className="app-details">
                            <span className="app-name">{part.name}</span>
                            <span className="app-version">{part.category || 'General'}</span>
                            <div className="app-metrics">
                                <span><FaArrowDown style={{ color: '#EF4444' }} /> {part.quantity_sold || 0} (Sold)</span>
                                <span><FaArrowUp style={{ color: '#10B981' }} /> {part.stock_level || 0} (Stock)</span>
                                <span><FaUsers style={{ color: '#F59E0B' }} /> {part.back_orders || 0} (B.O.)</span>
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
    
    const [widgetData, setWidgetData] = useState({
        jobCards: null,
        revenueData: null,
        salesOrders: null,
        topParts: null
    });
    
    const [isLoading, setIsLoading] = useState(true); 
    const [error, setError] = useState(null); 

    // Fetch all dashboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                // Fetch main metrics
                const metricsRes = await apiClient.get('/dashboard/metrics/'); 
                const metricsData = metricsRes.data;

                setStats({
                    totalClients: metricsData.total_clients?.toLocaleString() || '0',
                    totalVehicles: metricsData.total_vehicles?.toLocaleString() || '0',
                    totalSales: metricsData.total_sales || '0', 
                    totalAppointments: metricsData.total_appointments?.toLocaleString() || '0',
                    clientChange: metricsData.client_percentage_change || '+0.0%', 
                    salesChange: metricsData.sales_percentage_change || '+0.0%', 
                    appointmentChange: metricsData.appointment_percentage_change || '+0.0%',
                    clientStatusAlert: metricsData.client_status_alert || 'OK',
                });

                // Fetch widget data
                const [jobCardsRes, revenueRes, salesRes, partsRes] = await Promise.allSettled([
                    apiClient.get('/dashboard/job-cards/'),
                    apiClient.get('/dashboard/revenue-by-location/'),
                    apiClient.get('/dashboard/recent-sales/'),
                    apiClient.get('/dashboard/top-parts/')
                ]);

                setWidgetData({
                    jobCards: jobCardsRes.status === 'fulfilled' ? jobCardsRes.value.data : null,
                    revenueData: revenueRes.status === 'fulfilled' ? revenueRes.value.data : null,
                    salesOrders: salesRes.status === 'fulfilled' ? salesRes.value.data : null,
                    topParts: partsRes.status === 'fulfilled' ? partsRes.value.data : null
                });
                
            } catch (err) {
                console.error("Failed to fetch dashboard data:", err.response ? err.response.data : err.message);
                
                const status = err.response ? err.response.status : 'N/A';
                setError(`Failed to load data. Status: ${status}. Check API or Auth.`);
                
                // Set fallback data
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
            
            {/* 2. Top Row Widgets */}
            <div className="top-widgets-grid">
                <JobCardsChart data={widgetData.jobCards} />
                <RevenueByLocationChart data={widgetData.revenueData} />
            </div>

            {/* 3. Bottom Row Widgets */}
            <div className="bottom-widgets-grid">
                <NewSalesOrdersTable data={widgetData.salesOrders} />
                <TopSellingPartsList data={widgetData.topParts} />
            </div>
            
            {/* 4. Kanban Board View */}
            <KanbanBoardPlaceholder />

            {/* ----------------------------------------------------------------- */}
            {/* 🎨 IMPROVED STYLES */}
            {/* ----------------------------------------------------------------- */}
            <style>{`
                .dashboard-page {
                    padding: 24px; 
                    background-color: #f8fafc;
                    min-height: 100vh;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
                    margin-left: 0; 
                    transition: margin-left 0.3s ease;
                    position: relative; 
                    z-index: 1; 
                    color: #1E293B;
                }
                
                .dashboard-page.shifted {
                     margin-left: 70px; 
                }

                .dashboard-header-path {
                    margin-bottom: 24px; 
                }
                
                .dashboard-title {
                    font-size: 28px; 
                    font-weight: 800;
                    color: #1E293B;
                    margin: 0;
                    background: linear-gradient(135deg, #1E293B 0%, #475569 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .stat-card-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); 
                    gap: 20px; 
                    margin-bottom: 32px;
                }
                
                /* Loading placeholder style */
                .loading-placeholder {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 200px;
                    color: #64748B;
                    font-style: italic;
                    background: #f8fafc;
                    border-radius: 8px;
                    border: 2px dashed #e2e8f0;
                }

                .stat-card-container {
                    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
                    border-radius: 12px; 
                    padding: 20px; 
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); 
                    border: 1px solid #f1f5f9; 
                    display: flex;
                    flex-direction: column;
                    min-height: 140px; 
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    border-left: 4px solid #e2e8f0; 
                    position: relative;
                    overflow: hidden;
                }
                
                .stat-card-container::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 3px;
                    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                
                .stat-card-container:hover::before {
                    opacity: 1;
                }
                
                .stat-card-container.border-primary { 
                    border-left-color: #6366F1; 
                    background: linear-gradient(135deg, #ffffff 0%, #eef2ff 100%);
                } 
                .stat-card-container.border-warning { 
                    border-left-color: #F59E0B; 
                    background: linear-gradient(135deg, #ffffff 0%, #fffbeb 100%);
                } 
                .stat-card-container.border-success { 
                    border-left-color: #10B981; 
                    background: linear-gradient(135deg, #ffffff 0%, #ecfdf5 100%);
                } 
                .stat-card-container.border-info { 
                    border-left-color: #0EA5E9; 
                    background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%);
                } 

                .stat-card-container:hover {
                    transform: translateY(-4px) scale(1.02); 
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); 
                }
                
                .stat-card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 8px; 
                }

                .stat-card-icon {
                    width: 44px; 
                    height: 44px; 
                    font-size: 20px; 
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-radius: 12px; 
                    transition: all 0.3s ease;
                }
                
                .stat-card-icon.border-primary { 
                    color: #6366F1; 
                    background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
                    box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.2);
                } 
                .stat-card-icon.border-warning { 
                    color: #F59E0B; 
                    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                    box-shadow: 0 4px 6px -1px rgba(245, 158, 11, 0.2);
                } 
                .stat-card-icon.border-success { 
                    color: #10B981; 
                    background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
                    box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2);
                } 
                .stat-card-icon.border-info { 
                    color: #0EA5E9; 
                    background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
                    box-shadow: 0 4px 6px -1px rgba(14, 165, 233, 0.2);
                } 

                .stat-title {
                    font-size: 13px; 
                    font-weight: 600; 
                    text-transform: uppercase;
                    letter-spacing: 0.5px; 
                    color: #64748B;
                }
                
                .stat-value-group {
                    display: flex;
                    align-items: center;
                    margin-bottom: 12px; 
                }

                .stat-value {
                    font-size: 36px; 
                    font-weight: 900; 
                    color: #1F2937; 
                    line-height: 1;
                    background: linear-gradient(135deg, #1F2937 0%, #374151 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .alert-icon {
                    font-size: 20px; 
                    margin-left: 8px;
                    color: #EF4444;
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }

                .stat-card-footer {
                    border-top: 1px solid #f1f5f9; 
                    padding-top: 12px; 
                    margin-top: auto; 
                    font-size: 12px; 
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .change-icon {
                    font-size: 10px; 
                    margin-left: 4px;
                }

                .stat-change {
                    font-weight: 700; 
                    margin-right: 5px;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }
                
                .text-positive { 
                    color: #10B981; 
                    background: linear-gradient(135deg, #10B981 0%, #059669 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                .text-negative { 
                    color: #EF4444; 
                    background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                
                .stat-unit {
                    color: #94A3B8; 
                    font-weight: 500;
                }

                .stat-card-container.alert-red {
                    border: 2px solid #EF4444; 
                    box-shadow: 0 0 20px rgba(239, 68, 68, 0.15); 
                    background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%);
                    animation: alert-pulse 2s infinite;
                }

                @keyframes alert-pulse {
                    0%, 100% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.15); }
                    50% { box-shadow: 0 0 30px rgba(239, 68, 68, 0.25); }
                }

                .top-widgets-grid {
                    display: grid;
                    grid-template-columns: 1fr 2fr; 
                    gap: 24px; 
                    margin-bottom: 24px;
                }

                .bottom-widgets-grid {
                    display: grid;
                    grid-template-columns: 3fr 2fr;
                    gap: 24px; 
                    margin-bottom: 24px;
                }

                .widget-card {
                    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
                    border-radius: 16px;
                    padding: 24px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    border: 1px solid #f1f5f9;
                    min-height: 380px;
                    transition: all 0.3s ease;
                }

                .widget-card:hover {
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                    transform: translateY(-2px);
                }

                .widget-title {
                    font-size: 20px;
                    font-weight: 700;
                    margin-bottom: 8px;
                    color: #1E293B;
                    background: linear-gradient(135deg, #1E293B 0%, #475569 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .widget-subtitle {
                    font-size: 14px;
                    color: #64748B;
                    margin-bottom: 20px;
                    font-weight: 500;
                }

                /* Improved Kanban Board Styles */
                .kanban-section {
                    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
                    border-radius: 16px;
                    padding: 32px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    border: 1px solid #f1f5f9;
                    margin-top: 24px;
                }

                .kanban-header {
                    text-align: center;
                    margin-bottom: 32px;
                }

                .kanban-title {
                    font-size: 24px;
                    font-weight: 800;
                    color: #1E293B;
                    margin: 0 0 8px 0;
                    background: linear-gradient(135deg, #1E293B 0%, #475569 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .kanban-subtitle {
                    color: #64748B;
                    font-size: 14px;
                    margin: 0;
                }

                .kanban-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 20px;
                    margin-bottom: 24px;
                }

                .kanban-column {
                    background: white;
                    border-radius: 12px;
                    border: 1px solid #e2e8f0;
                    overflow: hidden;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                }

                .kanban-column:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 10px -5px rgba(0, 0, 0, 0.04);
                }

                .column-header {
                    padding: 20px;
                    border-left: 4px solid;
                    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .column-title-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .column-icon {
                    font-size: 20px;
                }

                .column-title {
                    font-size: 16px;
                    font-weight: 700;
                    margin: 0;
                    color: #1E293B;
                }

                .column-count {
                    background: white;
                    border-radius: 20px;
                    padding: 4px 12px;
                    font-size: 14px;
                    font-weight: 700;
                    color: #64748B;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

                .column-content {
                    padding: 20px;
                    min-height: 120px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .empty-state {
                    text-align: center;
                    color: #94A3B8;
                }

                .empty-icon {
                    font-size: 32px;
                    margin-bottom: 12px;
                    opacity: 0.5;
                }

                .empty-text {
                    font-size: 14px;
                    margin: 0;
                    font-style: italic;
                }

                .kanban-footer {
                    text-align: center;
                    padding-top: 20px;
                    border-top: 1px solid #f1f5f9;
                }

                .kanban-info {
                    color: #64748B;
                    font-size: 14px;
                    margin: 0;
                    font-style: italic;
                }

                /* Responsive Design */
                @media (max-width: 1200px) {
                    .kanban-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                    
                    .top-widgets-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .bottom-widgets-grid {
                        grid-template-columns: 1fr;
                    }
                }

                @media (max-width: 768px) {
                    .kanban-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .stat-card-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .dashboard-page {
                        padding: 16px;
                    }
                }
            `}</style>
        </div>
    );
};

export default Dashboard;