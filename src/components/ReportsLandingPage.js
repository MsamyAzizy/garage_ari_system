// src/components/ReportsLandingPage.js

import React from 'react';
import { 
    FaChartPie, FaTruckLoading, FaUsers, FaTools, 
    FaDollarSign, FaCreditCard, 
    FaCar, FaUserTie, FaPercent, FaDatabase, FaChartLine, FaShoppingBasket, // Added necessary icons
} from 'react-icons/fa'; 

// Define the report structure to display on the landing page in a flat card format
const reportsStructure = [
    {
        title: 'Income and Expenses',
        icon: FaDollarSign, 
        description: 'Report of total income and expenses',
        path: '/reports/financial-summary', 
        color: '#2ecc71',
    },
    {
        title: 'Sales and Purchases',
        icon: FaShoppingBasket, 
        description: 'Parts and services sold or purchased',
        path: '/reports/sales-purchases', 
        color: '#3498db',
    },
    {
        title: 'Debit and Credit',
        icon: FaCreditCard, 
        description: 'How much you have to receive and pay',
        path: '/reports/ar-ap',
        color: '#f39c12',
    },
    {
        title: 'Parts and Services',
        icon: FaTools, 
        description: 'Parts sold and services performed',
        path: '/reports/parts-services', 
        color: '#9b59b6',
    },
    {
        title: 'Inventory and Profits',
        icon: FaTruckLoading, 
        description: 'Stock and profit from parts, services, etc.',
        path: '/reports/inventory-profit',
        color: '#e74c4c',
    },
    {
        title: 'Employees & Salaries',
        icon: FaUsers, 
        description: 'Work assigned and salaries paid',
        path: '/reports/employees-salaries', 
        color: '#1abc9c',
    },
    {
        title: 'Tax Report',
        icon: FaPercent, 
        description: 'Review and export your taxes',
        path: '/reports/tax-report', 
        color: '#34495e',
    },
    {
        title: 'Clients Report',
        icon: FaUsers, 
        description: 'Review and export your client database',
        // ✅ CONFIRMED: Path is now /reports/clients
        path: '/reports/clients', 
        color: '#e67e22',
    },
    {
        title: 'Vehicles Report',
        icon: FaCar, 
        description: 'Review and export your vehicles database',
        // ✅ CONFIRMED: Path is /reports/vehicles (Matches the component we just built)
        path: '/reports/vehicles',
        color: '#2980b9',
    },
    {
        title: 'Vendors Report',
        icon: FaUserTie, 
        description: 'Expenses and purchases grouped per vendors',
        path: '/reports/vendors',
        color: '#8e44ad',
    },
    {
        title: 'Data Export',
        icon: FaDatabase, 
        description: 'Export your data to Excel or PDF',
        path: '/reports/data-export',
        color: '#7f8c8d',
    },
    {
        title: 'Statistics',
        icon: FaChartLine, 
        description: 'Graphs and Stats about your business',
        path: '/reports/statistics',
        color: '#c0392b',
    },
];

// Helper Component for a single report card (New Style)
const ReportCard = ({ title, icon: Icon, description, path, navigateTo }) => (
    <div className="report-card" onClick={() => navigateTo(path)}>
        <div className="card-icon-area">
            <Icon className="card-icon" />
        </div>
        <div className="card-content">
            <div className="card-title">{title}</div>
            <div className="card-description">{description}</div>
            <div className="card-arrow">&gt;</div>
        </div>
    </div>
);


const ReportsLandingPage = ({ navigateTo }) => {
    return (
        <div className="list-page-container">
            <header className="page-header reports-header">
                {/* Header now only contains the title */}
                <h2 style={{ flexGrow: 1 }}><FaChartPie style={{ marginRight: '8px' }}/> Reports</h2>
            </header>
            
            <div className="reports-grid-new">
                {reportsStructure.map((report) => (
                    <ReportCard 
                        key={report.path}
                        title={report.title}
                        icon={report.icon}
                        description={report.description}
                        path={report.path}
                        navigateTo={navigateTo}
                    />
                ))}
            </div>
            
            {/* Consolidated Styles */}
            <style jsx global>{`
                /* Global Report Variables (Assuming these are defined elsewhere, but including them for clarity) */
                :root {
                    --bg-card: white;
                    --color-primary: #5c6bc0;
                    --color-primary-light: #9fa8da;
                    --bg-light: #f0f3fa;
                    --text-color: #333;
                    --text-color-muted: #777;
                    --border-color: #eee;
                }

                .reports-header {
                    /* Style adjusted for title only */
                    display: flex;
                    align-items: center;
                    padding: 20px;
                    border-bottom: 1px solid var(--border-color);
                    background-color: var(--bg-card);
                    border-radius: 8px 8px 0 0;
                    margin-bottom: 20px;
                }

                .reports-grid-new {
                    /* Matches the 4-column layout shown in your image */
                    display: grid;
                    grid-template-columns: repeat(4, 1fr); 
                    gap: 20px;
                    padding: 0 20px 20px 20px; /* Adjust padding for better look */
                }
                
                /* Report Card Styles */
                .report-card {
                    background-color: var(--bg-card);
                    border-radius: 8px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
                    transition: all 0.2s ease-in-out;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    cursor: pointer;
                    border: 1px solid transparent; 
                }
                .report-card:hover {
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    border-color: var(--color-primary-light);
                    transform: translateY(-2px);
                }

                .card-icon-area {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 48px; /* Slightly smaller icon area */
                    height: 48px;
                    border-radius: 50%;
                    background-color: var(--bg-light); 
                    margin-bottom: 15px;
                }

                .card-icon {
                    font-size: 24px; /* Slightly smaller icon */
                    color: var(--text-color-muted); 
                }

                .card-content {
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    position: relative;
                }

                .card-title {
                    font-size: 16px;
                    font-weight: 600;
                    color: var(--text-color);
                    margin-bottom: 5px;
                    padding-right: 25px; /* Space for arrow */
                }

                .card-description {
                    font-size: 13px;
                    color: var(--text-color-muted);
                }
                
                .card-arrow {
                    position: absolute;
                    top: 0;
                    right: 0;
                    font-size: 16px;
                    color: var(--color-primary);
                    font-weight: 700;
                }


                /* Responsive Adjustments */
                @media (max-width: 1200px) {
                    .reports-grid-new {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }
                @media (max-width: 900px) {
                    .reports-grid-new {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
                @media (max-width: 600px) {
                    .reports-grid-new {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default ReportsLandingPage;