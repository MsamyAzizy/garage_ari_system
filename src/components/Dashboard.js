// src/components/Dashboard.js - COMPLETE FILE (Now with CORRECTED API Integration Paths)

import React, { useState, useEffect } from 'react';
import { FaArrowUp, FaArrowDown, FaUsers, FaCar, FaFileInvoiceDollar, FaCalendarCheck } from 'react-icons/fa'; 
import apiClient from '../utils/apiClient'; // 🛑 Import apiClient

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
            <div className={`stat-card-icon ${color}`}>
                <Icon size={24} />
            </div>
            
            <div className="stat-card-content">
                <div className="stat-title">{title}</div>
                <div className="stat-value">{value}</div>
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
// 2. Main Dashboard Component
// ----------------------------------------------------
const Dashboard = ({ isSidebarCollapsed }) => { 
    // State to hold actual metric values
    const [stats, setStats] = useState({
        totalClients: '...',
        totalVehicles: '...',
        totalSales: '...',
        totalAppointments: '...',
    });
    
    // State for loading and errors
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // 🛑 EFFECT: Fetch data from the backend when the component mounts
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // 1. Fetching client count - Path is correct: /api/clients/
                const clientsRes = await apiClient.get('/clients/');
                // Assuming clientsRes.data is an array and we take its length for count
                const clientCount = clientsRes.data.length; 

                // 2. Fetching vehicle count - ✅ FIX APPLIED: Corrected path to /api/clients/vehicles/
                const vehiclesRes = await apiClient.get('/clients/vehicles/'); 
                const vehicleCount = vehiclesRes.data.length;
                
                // Mocking sales and appointments until proper endpoints are available
                // In a real app, this would be: await apiClient.get('/invoices/revenue/')
                const mockSales = 'Tsh 1,240,000'; 
                const mockAppointments = 15;

                setStats({
                    totalClients: clientCount.toLocaleString(),
                    totalVehicles: vehicleCount.toLocaleString(),
                    totalSales: mockSales,
                    totalAppointments: mockAppointments.toLocaleString(),
                });
                
            } catch (err) {
                // Log the detailed error (which might show a 401 if authentication fails)
                console.error("Failed to fetch dashboard metrics:", err.response ? err.response.data : err.message);
                setError("Failed to load dashboard data. Check API endpoints or Authentication.");
                setStats({
                    totalClients: 'Error',
                    totalVehicles: 'Error',
                    totalSales: 'Error',
                    totalAppointments: 'Error',
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []); // Empty dependency array ensures it runs once on mount
    
    // Prepare the stat cards using the fetched state
    const displayStats = [
        { 
            title: 'Total Clients', 
            value: stats.totalClients, 
            change: '+5.7%', 
            unit: 'than last month', 
            color: 'bg-info', 
            icon: FaUsers 
        },
        { 
            title: 'Total Vehicles', 
            value: stats.totalVehicles, 
            change: '-1.5%', 
            unit: 'in inventory', 
            color: 'bg-warning', 
            icon: FaCar 
        },
        { 
            title: 'Total Sales Orders', 
            value: stats.totalSales, 
            change: '+7.5%', 
            unit: 'This Month Revenue', 
            color: 'bg-success', 
            icon: FaFileInvoiceDollar 
        },
        { 
            title: 'Total Appointments', 
            value: stats.totalAppointments, 
            change: '+3.7%', 
            unit: 'Next 7 Days', 
            color: 'bg-primary', 
            icon: FaCalendarCheck 
        },
    ];

    return (
        <div className={`dashboard-page ${isSidebarCollapsed ? 'shifted' : ''}`}>
            <div className="dashboard-header-path">
                <span className="path-home">/ Dashboard</span>
                <span className="path-current">Dashboard</span>
            </div>
            
            {/* 1. Quick Statistics */}
            <div className="dashboard-stats">
                <div className="stat-card-grid">
                    {isLoading ? (
                        <p style={{ gridColumn: '1 / -1', textAlign: 'center' }}>Loading metrics...</p>
                    ) : error ? (
                        <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'red' }}>{error}</p>
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

            {/* ... (STYLE TAG REMAINS UNCHANGED) ... */}
            <style>{`
                /* ----------------------------------------------------------------- */
                /* DASHBOARD LAYOUT & BASE STYLES (Material Design Look) */
                /* ----------------------------------------------------------------- */
                .dashboard-page {
                    padding: 20px 30px;
                    background-color: #ffffffff; 
                    min-height: 100vh;
                    font-family: Roboto, 'Helvetica Neue', Arial, sans-serif;
                    
                    /* 🚀 FLEXIBILITY FIX 1: Assume this is the content area */
                    margin-left: 10px; /* Default margin for expanded sidebar (300px) */
                    transition: margin-left 0.3s ease;
                }
                
                /* 🚀 FLEXIBILITY FIX 2: Style applied when the sidebar is collapsed */
                .dashboard-page.shifted {
                     margin-left: 80px; /* Margin for collapsed sidebar (80px) */
                }


                .dashboard-header-path {
                    font-size: 14px;
                    margin-bottom: 20px;
                    color: #6c757d;
                }
                
                .path-current {
                    font-weight: 600;
                    color: #344767;
                    margin-left: 5px;
                }

                .stat-card-grid {
                    display: grid;
                    /* 🚀 FLEXIBILITY FIX 3: Use auto-fit with a smaller minimum size (220px) 
                       to ensure smooth shrinking/expanding of the grid columns. */
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); 
                    gap: 20px;
                    margin-bottom: 30px;
                }
                
                @media (max-width: 768px) {
                    .stat-card-grid {
                        grid-template-columns: 1fr;
                    }
                }
                
                .main-content-placeholder {
                    background-color: #fff;
                    border-radius: 10px;
                    padding: 40px;
                    min-height: 300px;
                    box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
                    color: #344767;
                }

                /* ----------------------------------------------------------------- */
                /* STAT CARD STYLES */
                /* ----------------------------------------------------------------- */
                .stat-card-container {
                    background-color: #ffffff;
                    border-radius: 10px;
                    padding: 10px 20px 20px 20px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08); 
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    min-height: 120px;
                }

                .stat-card-icon {
                    position: absolute;
                    top: -20px; 
                    left: 20px;
                    width: 70px;
                    height: 70px;
                    border-radius: 8px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: #ffffff;
                    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.14), 0 7px 10px -5px rgba(0, 0, 0, 0.4);
                }
                
                .stat-card-content {
                    margin-left: 80px; 
                    text-align: right;
                    margin-top: 10px;
                    flex-grow: 1;
                }

                .stat-title {
                    font-size: 14px;
                    color: #6c757d;
                    text-transform: capitalize;
                    font-weight: 300;
                    word-wrap: break-word; /* Ensure title fits */
                }

                .stat-value {
                    font-size: 24px;
                    font-weight: 700;
                    color: #344767;
                    line-height: 1.5;
                    word-wrap: break-word; /* Ensure value fits */
                }

                .stat-card-footer {
                    border-top: 1px solid #dee2e6;
                    padding-top: 8px;
                    margin-top: 8px;
                    font-size: 13px;
                }

                .stat-change {
                    font-weight: 600;
                    margin-right: 5px;
                    display: inline-flex;
                    align-items: center;
                }
                
                .text-positive {
                    color: #4CAF50; 
                }
                .text-negative {
                    color: #F44336; 
                }
                
                .stat-unit {
                    color: #6c757d;
                }
                
                .change-icon {
                    margin-left: 4px;
                    font-size: 10px;
                }

                /* ----------------------------------------------------------------- */
                /* COLOR UTILITIES */
                /* ----------------------------------------------------------------- */
                .bg-primary { 
                    background: linear-gradient(195deg, #EC407A, #D81B60);
                }
                .bg-warning { 
                    background: linear-gradient(195deg, #FFA726, #FB8C00);
                }
                .bg-success { 
                    background: linear-gradient(195deg, #66BB6A, #43A047);
                }
                .bg-info { 
                    background: linear-gradient(195deg, #42A5F5, #2196F3);
                }
            `}</style>
        </div>
    );
};

export default Dashboard;