// src/components/ReportsLandingPage.js

import React from 'react';
import { 
    FaChartPie, FaFileInvoiceDollar, FaTruckLoading, FaUsers, FaTools, 
     FaBook, FaPlusCircle, FaSearch 
} from 'react-icons/fa';

// Define the report structure to display on the landing page
const reportsStructure = [
    {
        title: 'Financial Reports',
        icon: FaFileInvoiceDollar,
        color: '#2ecc71', // Success/Green
        reports: [
            { name: 'Sales Report', path: '/reports/sales' },
            { name: 'Payments Report', path: '/reports/payments' },
            { name: 'Expense Report', path: '/reports/expenses' },
            { name: 'Profit & Loss Report', path: '/reports/pnl' },
        ],
    },
    {
        title: 'Operational Reports',
        icon: FaTools,
        color: '#3498db', // Primary/Blue
        reports: [
            { name: 'Job Card / Work Order Report', path: '/reports/jobcards' },
            { name: 'Appointment Report', path: '/reports/appointments' },
            { name: 'Technician Performance Report', path: '/reports/technician-performance' },
        ],
    },
    {
        title: 'Inventory & Purchase Reports',
        icon: FaTruckLoading,
        color: '#f39c12', // Warning/Orange
        reports: [
            { name: 'Inventory Stock Report', path: '/reports/inventory-stock' },
            { name: 'Purchase Order Report', path: '/reports/purchase-orders' },
        ],
    },
    {
        title: 'Customer & Vehicle Reports',
        icon: FaUsers,
        color: '#9b59b6', // Purple
        reports: [
            { name: 'Customer Report', path: '/reports/customers' },
            { name: 'Vehicle Service History Report', path: '/reports/service-history' },
        ],
    },
    {
        title: 'Other Key Reports',
        icon: FaBook,
        color: '#7f8c8d', // Muted/Gray
        reports: [
            { name: 'Service Reminder Report', path: '/reports/reminders' },
            { name: 'Accounting / Ledger Report', path: '/reports/ledger' },
            { name: 'Analytical Dashboard KPIs', path: '/reports/kpis' },
        ],
    },
];

// Helper Component for a single group of reports
const ReportGroupCard = ({ title, icon: Icon, color, reports, navigateTo }) => (
    <div className="report-group-card">
        <div className="card-header" style={{ borderLeft: `5px solid ${color}` }}>
            <Icon className="header-icon" style={{ color }} />
            <h3>{title}</h3>
        </div>
        <ul className="report-list">
            {reports.map((report) => (
                <li key={report.path} onClick={() => navigateTo(report.path)}>
                    {report.name}
                </li>
            ))}
        </ul>
        <style jsx>{`
            .report-group-card {
                background-color: var(--bg-card);
                border-radius: 8px;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
                transition: transform 0.3s ease;
                overflow: hidden;
            }
            
            .card-header {
                display: flex;
                align-items: center;
                padding: 15px 20px;
                background-color: #f8f9fa;
            }
            
            .header-icon {
                font-size: 24px;
                margin-right: 15px;
            }
            
            .card-header h3 {
                margin: 0;
                color: var(--text-color);
            }
            
            .report-list {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            
            .report-list li {
                padding: 12px 20px;
                border-bottom: 1px solid #f0f0f0;
                cursor: pointer;
                color: var(--text-color);
                transition: background-color 0.2s;
                font-size: 15px;
            }
            
            .report-list li:last-child {
                border-bottom: none;
            }
            
            .report-list li:hover {
                background-color: #e9ecef;
                font-weight: 600;
            }
        `}</style>
    </div>
);


const ReportsLandingPage = ({ navigateTo }) => {
    return (
        <div className="list-page-container">
            <header className="page-header reports-header">
                <h2 style={{ flexGrow: 1 }}><FaChartPie style={{ marginRight: '8px' }}/> Comprehensive Reports & Analysis</h2>
                <div className="action-area">
                    {/* Add a button for quick creation/search here if needed */}
                    <button 
                        className="btn-primary-action" 
                        onClick={() => navigateTo('/reports/new-custom')} 
                        style={{ marginRight: '10px' }}
                    >
                        <FaPlusCircle style={{ marginRight: '5px' }} /> New Custom Report
                    </button>
                    <button 
                        className="btn-primary-action" 
                        onClick={() => alert('Search functionality to be implemented!')} 
                    >
                        <FaSearch style={{ marginRight: '5px' }} /> Search Reports
                    </button>
                </div>
            </header>
            
            <div className="reports-grid">
                {reportsStructure.map((group) => (
                    <ReportGroupCard 
                        key={group.title}
                        title={group.title}
                        icon={group.icon}
                        color={group.color}
                        reports={group.reports}
                        navigateTo={navigateTo}
                    />
                ))}
            </div>
            
            <style jsx>{`
                .reports-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 25px;
                    padding: 20px;
                }
                .reports-header {
                    /* Match your existing header style */
                    display: flex;
                    align-items: center;
                    padding: 20px;
                    border-bottom: 1px solid var(--border-color);
                    background-color: var(--bg-card);
                    border-radius: 8px 8px 0 0;
                    margin-bottom: 20px;
                }
                .action-area {
                    display: flex;
                }
            `}</style>
        </div>
    );
};

export default ReportsLandingPage;