import React, { useState } from 'react';
import { FaArrowUp, FaArrowDown, FaUsers, FaCar, FaFileInvoiceDollar, FaCalendarCheck } from 'react-icons/fa'; 

// ----------------------------------------------------
// 1. StatCard Component (Defined locally)
// ----------------------------------------------------
const StatCard = ({ title, value, change, unit, color, icon: Icon }) => {
    // Handling cases where change might be null or zero
    const changeValue = change !== null && change !== undefined ? change : '+0%';
    const isPositive = changeValue.startsWith('+');
    const ChangeIcon = isPositive ? FaArrowUp : FaArrowDown;
    const changeClass = isPositive ? 'text-positive' : 'text-negative';
    const displayChange = changeValue === '+0%' ? '' : changeValue; // Don't show '+0%'

    return (
        <div className="stat-card-container">
            {/* Icon is placed next to the title */}
            <div className="stat-card-header">
                <div className={`stat-card-icon ${color}`}>
                    <Icon size={20} /> 
                </div>
                <div className="stat-title">{title}</div>
            </div>
            
            <div className="stat-value">{value}</div>

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
// 2. Main Dashboard Component
// ----------------------------------------------------
const Dashboard = ({ isSidebarCollapsed }) => { 
    // State is clean for static display
    const [stats] = useState({
        totalClients: '2,500', 
        totalVehicles: '1,800',
        totalSales: 'Tsh 1,240,000',
        totalAppointments: '15',
    });
    
    const [error] = useState(null); 
    
    // Prepare the stat cards
    const displayStats = [
        { 
            title: 'Total Clients', 
            value: stats.totalClients, 
            change: '+5.7%', 
            unit: 'than last month', 
            color: 'text-info', 
            icon: FaUsers 
        },
        { 
            title: 'Total Vehicles', 
            value: stats.totalVehicles, 
            change: '-1.5%', 
            unit: 'in inventory', 
            color: 'text-warning', 
            icon: FaCar 
        },
        { 
            title: 'Total Sales Orders', 
            value: stats.totalSales, 
            change: '+7.5%', 
            unit: 'This Month Revenue', 
            color: 'text-success', 
            icon: FaFileInvoiceDollar 
        },
        { 
            title: 'Total Appointments', 
            value: stats.totalAppointments, 
            change: '+3.7%', 
            unit: 'Next 7 Days', 
            color: 'text-primary', 
            icon: FaCalendarCheck 
        },
    ];

    return (
        <div className={`dashboard-page ${isSidebarCollapsed ? 'shifted' : ''}`}>
            <div className="dashboard-header-path">
                <span className="path-home">Home</span>
                <span className="path-current">/ Dashboard</span>
            </div>
            
            {/* 1. Quick Statistics */}
            <div className="dashboard-stats">
                <div className="stat-card-grid">
                    {error ? (
                        <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'red' }}>Error: {error}</p>
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
            
            {/* Placeholder for Main Content/Charts/Tables */}
            <div className="main-content-placeholder">
                <p>Welcome to your Auto Repair Shop dashboard. Real charts and tables coming soon...</p>
            </div>

            {/* ----------------------------------------------------------------- */}
            {/* FINAL PREMIUM STYLES */}
            {/* ----------------------------------------------------------------- */}
            <style>{`
                /* ----------------------------------------------------------------- */
                /* DASHBOARD LAYOUT & BASE STYLES */
                /* ----------------------------------------------------------------- */
                .dashboard-page {
                    padding: 30px; 
                    background-color: #F8FAFC; /* Very light, cool gray page background */
                    min-height: 100vh;
                    font-family: 'Inter', sans-serif, 'Helvetica Neue', Arial; 
                    margin-left: 10px;
                    transition: margin-left 0.3s ease;
                }
                
                .dashboard-page.shifted {
                     margin-left: 80px; 
                }

                .dashboard-header-path {
                    font-size: 16px;
                    margin-bottom: 30px; 
                    color: #94A3B8; /* Muted path color */
                    font-weight: 500;
                }
                
                .path-current {
                    font-weight: 700;
                    color: #1E293B; /* Darker current path */
                    margin-left: 5px;
                }

                .stat-card-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); 
                    gap: 25px; 
                    margin-bottom: 40px;
                }

                /* ----------------------------------------------------------------- */
                /* STAT CARD STYLES */
                /* ----------------------------------------------------------------- */
                .stat-card-container {
                    background-color: #FFFFFF; /* Pure white card background */
                    border-radius: 12px; 
                    padding: 25px; 
                    /* Layered shadow for depth: Subtle inner shadow + soft outer shadow */
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 15px 30px rgba(0, 0, 0, 0.05);
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    min-height: 140px;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 1px solid #E2E8F0; /* Very subtle border for definition */
                }
                
                .stat-card-container:hover {
                    transform: translateY(-5px); /* Stronger lift on hover */
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.08), 0 20px 40px rgba(0, 0, 0, 0.08); /* Highlighted shadow */
                }
                
                .stat-card-header {
                    display: flex;
                    align-items: center;
                    margin-bottom: 5px;
                }

                .stat-card-icon {
                    width: 32px;
                    height: 32px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-radius: 6px;
                    color: #FFFFFF; /* White icon always */
                    margin-right: 10px;
                    opacity: 1;
                }
                
                .stat-title {
                    font-size: 14px;
                    color: #64748B; /* Muted gray for title */
                    font-weight: 500; 
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .stat-value {
                    font-size: 38px; /* Bigger, bolder value */
                    font-weight: 800; 
                    color: #1E293B; /* High-contrast text */
                    line-height: 1.1;
                    margin: 8px 0 10px 0; /* Tighter spacing to header/footer */
                }

                .stat-card-footer {
                    border-top: 1px solid #F1F5F9; /* Very light divider */
                    padding-top: 15px;
                    margin-top: auto; /* Push footer to bottom */
                    font-size: 14px;
                    display: flex;
                    justify-content: space-between;
                }

                .stat-change {
                    font-weight: 600;
                    margin-right: 8px;
                }
                
                .text-positive {
                    color: #10B981; /* Tailwind Emerald Green */
                }
                .text-negative {
                    color: #EF4444; /* Tailwind Red */
                }
                
                .stat-unit {
                    color: #64748B;
                    font-weight: 400;
                }

                /* ----------------------------------------------------------------- */
                /* COLOR UTILITIES (Used for ICON BACKGROUND) */
                /* ----------------------------------------------------------------- */
                .text-primary { background-color: #6366F1; } /* Indigo */
                .text-warning { background-color: #FBBF24; } /* Amber */
                .text-success { background-color: #10B981; } /* Emerald */
                .text-info { background-color: #06B6D4; } /* Cyan */
                
                /* Main Content Placeholder style refined */
                .main-content-placeholder {
                    background-color: #FFFFFF;
                    border-radius: 12px;
                    padding: 40px;
                    min-height: 300px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 15px 30px rgba(0, 0, 0, 0.05);
                    color: #64748B;
                    text-align: center;
                    border: 1px solid #E2E8F0;
                }
            `}</style>
        </div>
    );
};

export default Dashboard;