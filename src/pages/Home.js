// src/pages/Home.js

import React, { useState, useEffect, useCallback } from 'react';
// 🛑 Added useLocation to read state from navigation
import { Routes, Route, useNavigate, Navigate, useLocation, useParams } from 'react-router-dom';
// 🏆 Updated: Imported FaFileInvoice for Payments List header, FaBell for reminders
import { 
    FaCar, FaPlusCircle, FaCheckCircle, FaTimesCircle, FaUsers, FaBell, 
   FaTrashAlt, FaEdit, FaEye, FaExclamationTriangle, FaInfoCircle, // 🛑 Added FaInfoCircle for info modal
    // 🆕 Added for inventory
} from 'react-icons/fa'; // Combined all icons for completeness
// IMPORT the apiClient instance
import apiClient from '../utils/apiClient';
// IMPORT the useAuth hook to get the logout function AND THE USER OBJECT
import { useAuth } from '../context/AuthContext';

// Import Layout Components
import TopNavBar from '../components/TopNavigationBar';
import Sidebar from '../components/Sidebar';

// Import Page Components
import RequestServiceGarage from '../components/RequestServiceGarage'; // 🛑 UPDATED IMPORT
import EmployeeDetailView from '../components/EmployeeDetailView';
import StatisticsPage from '../components/StatisticsPage'; // Add this import
import DataExportPage from '../components/DataExportPage'; // Add this import
import VendorsReport from '../components/VendorsReport'; // Add this import
import VehiclesReport from '../components/VehiclesReport'; // Add this import
import ClientsReport from '../components/ClientsReport';
import TaxReport from '../components/TaxReport';
import EmployeesAndSalariesReport from '../components/EmployeesAndSalariesReport';
import InventoryAndProfitReport from '../components/InventoryAndProfitReport';
import PartsServicesReport from '../components/PartsServicesReport'; // <--- ADD THIS LINE
import DebitCreditReport from '../components/DebitCreditReport';
import IncomeExpenseReport from '../components/IncomeExpenseReport';
import SalesPurchasesReport from '../components/SalesPurchasesReport';
import Dashboard from '../components/Dashboard';
import ClientsList from '../components/ClientsList';
import ClientForm from '../components/ClientDetailForm';
// Add this import with the other component imports
import ClientDetailView from '../components/ClientDetailView';
import VehicleForm from '../components/VehicleForm';
//import InventoryForm from '../components/InventoryForm';
import TireForm from '../components/TireForm';
import LaborForm from '../components/LaborForm';
import CannedJobForm from '../components/CannedJobForm';
import BusinessAssetList from '../components/BusinessAssetList';
import BusinessAssetForm from '../components/BusinessAssetForm';
import VendorForm from '../components/VendorForm';
import AppointmentForm from '../components/AppointmentForm';
import ProfilePage from '../components/ProfilePage';

// 🚀 NEW: Import the Kanban Component
import JobCardKanban from '../components/JobCardKanban';
// 🏆 NEW: Import the Job Card Form Component
import JobCardForm from '../components/JobCardForm';
// 🏆 NEW: Import the Employee Form Component
import EmployeeForm from '../components/EmployeeForm';

// 🏆 NEW INVOICE/ESTIMATE IMPORTS
import InvoiceEstimateForm from '../components/InvoiceEstimateForm';
import InvoiceEstimateLanding from '../components/InvoiceEstimateLanding';

// 🏆 NEW PAYMENT IMPORT
import PaymentForm from '../components/PaymentForm';
import PaymentList from '../components/PaymentList';

// 🏆 NEW ACCOUNT COMPONENTS
import AccountForm from '../components/AccountForm';
import AccountList from '../components/AccountList';

// 🏆 LATEST UPDATE: Import ExpenseForm and TransactionJournal
import ExpenseForm from '../components/ExpenseForm';
import TransactionJournal from '../components/TransactionJournal';

// ⭐ NEW: Import ServiceReminderForm
import ServiceReminderForm from '../components/ServiceReminderForm';

// ⭐ NEW: Import PurchaseOrderForm AND PurchaseOrderList
import PurchaseOrderForm from '../components/PurchaseOrderForm';
import PurchaseOrderList from '../components/PurchaseOrderList';

// 📈 NEW REPORTS IMPORTS
import ReportsLandingPage from '../components/ReportsLandingPage'; // Added Reports Landing Page

// 🆕 IMPORT INVENTORY PAGE
import InventoryPage from './InventoryPage';


// Define common colors for the Toast
const SUCCESS_COLOR = '#2ecc71';
const ERROR_COLOR = '#e74c3c';
// 🛑 Custom dark color for the modal background
const MODAL_BG_COLOR = '#252525';
const INFO_COLOR = '#3498db'; // Blue for info modals


// -----------------------------------------------------------------
// 1. TOAST NOTIFICATION COMPONENT 
// -----------------------------------------------------------------
const ToastNotification = ({ message, type, duration = 2000, onClose }) => {
    
    useEffect(() => {
        if (!message) return;

        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [message, duration, onClose]);

    if (!message) return null;

    // Determine color and icon
    const color = type === 'success' ? SUCCESS_COLOR : ERROR_COLOR;
    const icon = type === 'success' ? <FaCheckCircle /> : <FaTimesCircle />;

    return (
        <div className="app-toast-notification-container">
            <div className="toast-content" style={{ backgroundColor: color }}>
                {icon}
                <span className="toast-message">{message}</span>
            </div>
             {/* CSS for the Toast Notification (Top Right) */}
            <style jsx>{`
                .app-toast-notification-container {
                    position: fixed;
                    top: 80px; /* Below the 60px TopNavBar + 20px buffer */
                    right: 20px;
                    z-index: 10000;
                    opacity: 0;
                    animation: slide-in 0.5s forwards, fade-out 0.5s ${duration/1000 - 0.5}s forwards;
                }

                .toast-content {
                    color: white;
                    padding: 12px 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-weight: 600;
                }

                @keyframes slide-in {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes fade-out {
                    0% { opacity: 1; }
                    100% { opacity: 0; }
                }
            `}</style>
        </div>
    );
};


// -----------------------------------------------------------------
// 🛑 2. CONFIRMATION MODAL COMPONENT (NEW)
// -----------------------------------------------------------------
const ConfirmationModal = ({ isOpen, title, message, confirmText, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    // Use keys to handle the colors/styles based on the delete theme
    const dangerColor = '#ff6b6b'; // Light red/pink for the primary action button (like the image)
    const secondaryColor = '#4a4a4a'; // Dark grey for the secondary button

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <button className="modal-close" onClick={onCancel}>
                    <FaTimesCircle style={{ color: '#aaa' }} />
                </button>
                <div className="modal-icon">
                    <FaExclamationTriangle size={32} color={dangerColor} />
                </div>
                
                <h3 className="modal-title">{title}</h3>
                <p className="modal-message">{message}</p>
                
                <div className="modal-actions">
                    <button className="btn-secondary-action" onClick={onCancel} style={{ 
                        backgroundColor: secondaryColor, 
                        color: 'white', 
                        border: '1px solid #5a5a5a'
                    }}>
                        Cancel
                    </button>
                    <button className="btn-primary-action" onClick={onConfirm} style={{ 
                        backgroundColor: dangerColor, 
                        color: 'white', 
                        border: 'none',
                        marginLeft: '10px'
                    }}>
                        {confirmText}
                    </button>
                </div>
            </div>

            {/* Modal CSS */}
            <style jsx>{`
                .modal-backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(3px);
                    z-index: 11000;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .modal-content {
                    background-color: ${MODAL_BG_COLOR}; 
                    color: white;
                    border-radius: 12px;
                    padding: 30px;
                    width: 90%;
                    max-width: 400px;
                    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
                    text-align: center;
                    position: relative;
                }
                .modal-close {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 1.2rem;
                    line-height: 1;
                    padding: 0;
                }
                .modal-icon {
                    margin-bottom: 15px;
                }
                .modal-title {
                    font-size: 1.5rem;
                    margin: 0 0 5px 0;
                    font-weight: 600;
                }
                .modal-message {
                    font-size: 0.9rem;
                    color: #bbb;
                    margin-bottom: 30px;
                }
                .modal-actions {
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                }
                .btn-secondary-action, .btn-primary-action {
                    padding: 10px 20px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: opacity 0.2s;
                    min-width: 120px;
                }
                .btn-secondary-action:hover { opacity: 0.8; }
                .btn-primary-action:hover { opacity: 0.8; }
            `}</style>
        </div>
    );
};

// -----------------------------------------------------------------
// 🆕 INFORMATION MODAL COMPONENT (For the client selection message)
// -----------------------------------------------------------------
const InformationModal = ({ isOpen, title, message, confirmText, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <button className="modal-close" onClick={onCancel}>
                    <FaTimesCircle style={{ color: '#aaa' }} />
                </button>
                <div className="modal-icon">
                    <FaInfoCircle size={32} color={INFO_COLOR} />
                </div>
                
                <h3 className="modal-title">{title}</h3>
                <p className="modal-message">{message}</p>
                
                <div className="modal-actions">
                    <button className="btn-secondary-action" onClick={onCancel} style={{ 
                        backgroundColor: '#4a4a4a', 
                        color: 'white', 
                        border: '1px solid #5a5a5a'
                    }}>
                        Cancel
                    </button>
                    <button className="btn-primary-action" onClick={onConfirm} style={{ 
                        backgroundColor: INFO_COLOR, 
                        color: 'white', 
                        border: 'none',
                        marginLeft: '10px'
                    }}>
                        {confirmText}
                    </button>
                </div>
            </div>

            {/* Modal CSS */}
            <style jsx>{`
                .modal-backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(3px);
                    z-index: 11000;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .modal-content {
                    background-color: ${MODAL_BG_COLOR}; 
                    color: white;
                    border-radius: 12px;
                    padding: 30px;
                    width: 90%;
                    max-width: 400px;
                    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
                    text-align: center;
                    position: relative;
                }
                .modal-close {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 1.2rem;
                    line-height: 1;
                    padding: 0;
                }
                .modal-icon {
                    margin-bottom: 15px;
                }
                .modal-title {
                    font-size: 1.5rem;
                    margin: 0 0 5px 0;
                    font-weight: 600;
                }
                .modal-message {
                    font-size: 0.9rem;
                    color: #bbb;
                    margin-bottom: 30px;
                    line-height: 1.5;
                }
                .modal-actions {
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                }
                .btn-secondary-action, .btn-primary-action {
                    padding: 10px 20px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: opacity 0.2s;
                    min-width: 120px;
                }
                .btn-secondary-action:hover { opacity: 0.8; }
                .btn-primary-action:hover { opacity: 0.8; }
            `}</style>
        </div>
    );
};


// -----------------------------------------------------------------
// 🚗 UPDATED VEHICLE LIST COMPONENT (Matching full file structure)
// -----------------------------------------------------------------
const VehicleList = ({ navigateTo, vehicles, onDeleteVehicle, onShowClientModal }) => (
    <div className="list-page-container">
        <header className="page-header vehicle-list-header">
            <h2 style={{ flexGrow: 1 }}><FaCar style={{ marginRight: '8px' }}/> Customer Vehicles ({vehicles.length})</h2>
            <button
                className="btn-primary-action"
                onClick={() => {
                    // Show the beautiful modal instead of basic alert
                    onShowClientModal();
                }}
                style={{ marginLeft: 'auto' }}
            >
                <FaPlusCircle style={{ marginRight: '5px' }} /> Add New Vehicle
            </button>
        </header>
        <div className="list-content-area" style={{ padding: '20px' }}>

            {vehicles.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    <p>No vehicles have been added yet.</p>
                </div>
            ) : (
                <table className="data-table">
            <thead>
                <tr>
                    <th style={{ textAlign: 'left' }}>Make/Model</th>
                    <th style={{ textAlign: 'left' }}>VIN / SN</th>
                    <th style={{ textAlign: 'right' }}>Year</th>
                    <th style={{ textAlign: 'right' }}>Odometer</th>
                    <th style={{ textAlign: 'center' }}>Plate / Unit #</th>
                    <th className="action-column-header">Actions</th>
                </tr>
            </thead>
            <tbody>
                {vehicles.map((v) => (
                    <tr key={v.id || v.vin || v.licensePlate || Date.now() + Math.random()}>
                        <td style={{ textAlign: 'left', fontWeight: 'bold' }}>
                            {v.make} {v.model}
                            <br/><small style={{ fontWeight: 'normal', color: '#777' }}>{v.vehicleType} | {v.color}</small>
                        </td>
                        <td style={{ textAlign: 'left' }}>{v.vin || 'N/A'}</td>
                        <td style={{ textAlign: 'right' }}>{v.year}</td>
                        <td style={{ textAlign: 'right' }}>
                            {v.odoReading ? `${Number(v.odoReading).toLocaleString()} ${v.odoUnit}` : 'N/A'}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                            {v.licensePlate || v.unitNumber || 'N/A'}
                        </td>
                        <td className="action-column-cell icon-action-container"> 
    
    {/* 🏆 VIEW Icon: Stays on the simpler route for read-only view */}
    <button 
        className="icon-action view" 
        // We'll use this route for the new VehicleDetailView (Read-Only)
        onClick={() => navigateTo(`/vehicles/${v.vin || v.id}/view`)} 
        title="View Details"
    >
        <FaEye />
    </button>
    
    {/* 🏆 EDIT Icon: Needs a separate route, typically using a dedicated 'edit' suffix */}
    <button 
        className="icon-action edit" 
        // We'll use this route for the VehicleFormWrapper (Editable Form)
        onClick={() => navigateTo(`/vehicles/${v.vin || v.id}`)}
        title="Edit Vehicle"
    >
        <FaEdit />
    </button>
    
    {/* DELETE Icon (Using onDeleteVehicle function, referencing the Employee List example) */}
    <button 
        className="icon-action delete" 
        // Assuming your list component receives onDeleteVehicle as a prop
        onClick={() => onDeleteVehicle(v.vin || v.id, v.model)} 
        title="Delete Vehicle"
    >
        <FaTrashAlt />
    </button>
</td>
                    </tr>
                ))}
            </tbody>
        </table>
            )}
        </div>
    </div>
);

// -----------------------------------------------------------------
// 🏆 MOCK/REAL EMPLOYEE LIST COMPONENT (UPDATED TO INCLUDE EMPLOYEE ID)
// -----------------------------------------------------------------
// 🏆 UPDATED EMPLOYEE LIST COMPONENT - FIXED EDIT BUTTON
// -----------------------------------------------------------------
const EmployeeList = ({ navigateTo, employees, onDeleteEmployee }) => (
    <div className="list-page-container">
        <header className="page-header employee-list-header">
            <h2 style={{ flexGrow: 1 }}><FaUsers style={{ marginRight: '8px' }}/> Employee List ({employees.length})</h2>
            <button
                className="btn-primary-action"
                onClick={() => navigateTo('/employees/new')}
                style={{ marginLeft: 'auto' }}
            >
                <FaPlusCircle style={{ marginRight: '5px' }} /> Add New Employee
            </button>
        </header>
        <div className="list-content-area" style={{ padding: '20px' }}>

            {employees.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    <p>No employees have been added yet.</p>
                </div>
            ) : (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Employee ID</th> 
                            <th>Name</th>
                            <th>Last Name</th>
                            <th>JOB TITLE</th>
                            <th>Department</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>STATUS</th>
                            <th className="action-column-header">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((employee) => (
                            <tr key={employee.id}>
                                <td>{employee.employee_id || employee.employeeId}</td> 
                                <td>
                                    {employee.first_name || employee.firstName} 
                                    {/*{employee.last_name || employee.lastName ? ` ${employee.last_name || employee.lastName}` : ''}*/}
                                </td>
                                <td>{employee.last_name || employee.lastName}</td>
                                <td>{employee.job_title || employee.jobTitle}</td>
                                <td>{employee.department}</td>
                                <td>{employee.email}</td>
                                <td>{employee.phone_number || employee.phoneNumber}</td>
                                <td>
                                    <span className={`status-badge ${(employee.employment_status || employee.employmentStatus)?.toLowerCase() || 'active'}`}>
                                        {employee.employment_status || employee.employmentStatus}
                                    </span>
                                </td>
                                {/* 🛑 CRITICAL FIX: UPDATED ACTION BUTTONS */}
                                <td className="action-column-cell icon-action-container"> 
                                    
                                    {/* VIEW Icon */}
                                    <button 
                                        className="icon-action view" 
                                        onClick={() => navigateTo(`/employees/${employee.id}/view`)}
                                        title="View Details"
                                    >
                                        <FaEye />
                                    </button>
                                    
                                    {/* 🛑 FIXED EDIT BUTTON: Use employee.id and proper route */}
                                    <button 
                                        className="icon-action edit" 
                                        onClick={() => navigateTo(`/employees/${employee.id}/edit`)}
                                        title="Edit Employee"
                                    >
                                        <FaEdit />
                                    </button>
                                    
                                    {/* DELETE Icon */}
                                    <button 
                                        className="icon-action delete" 
                                        onClick={() => onDeleteEmployee(
                                            employee.id, 
                                            `${employee.first_name || employee.firstName} ${employee.last_name || employee.lastName}`
                                        )}
                                        title="Delete Employee"
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>

        {/* Add status badge styles */}
        <style jsx>{`
            .status-badge {
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 0.75rem;
                font-weight: 600;
                text-transform: capitalize;
            }
            .status-badge.active {
                background-color: #d4edda;
                color: #155724;
            }
            .status-badge.suspended {
                background-color: #fff3cd;
                color: #856404;
            }
            .status-badge.terminated {
                background-color: #f8d7da;
                color: #721c24;
            }
            .status-badge.on-leave {
                background-color: #cce7ff;
                color: #004085;
            }
        `}</style>
    </div>
);

// -----------------------------------------------------------------
// ⭐ MOCK SERVICE REMINDER LIST COMPONENT (UPDATED ACTIONS)
// -----------------------------------------------------------------
const ServiceReminderList = ({ navigateTo, reminders, onDeleteReminder }) => (
    <div className="list-page-container">
        <header className="page-header reminder-list-header">
            <h2 style={{ flexGrow: 1 }}><FaBell style={{ marginRight: '8px' }}/> Service Reminders ({reminders.length})</h2>
            <button
                className="btn-primary-action"
                onClick={() => navigateTo('/reminders/new')}
                style={{ marginLeft: 'auto' }}
            >
                <FaPlusCircle style={{ marginRight: '5px' }} /> Create New Reminder
            </button>
        </header>
        <div className="list-content-area" style={{ padding: '20px' }}>

            {reminders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    <p>No active service reminders.</p>
                </div>
            ) : (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Customer</th>
                            <th>Vehicle Plate</th>
                            <th>Reminder Type</th>
                            <th>Next Due Date</th>
                            <th>Status</th>
                            <th className="action-column-header">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reminders.map((r, index) => (
                            <tr key={index}>
                                <td>{r.customerName}</td>
                                <td>{r.plate}</td>
                                <td>{r.type}</td>
                                <td>{r.nextDueDate}</td>
                                <td>{r.status}</td>
                                {/* 🌟 UPDATED ACTIONS COLUMN 🌟 */}
                                <td className="action-column-cell icon-action-container">
                                    
                                    {/* VIEW Icon (Hidden Icon - replaces text button) */}
                                    <button 
                                        className="icon-action view" 
                                        onClick={() => navigateTo(`/reminders/${r.id}`)}
                                        title="View Details"
                                    >
                                        <FaEye />
                                    </button>
                                    
                                    {/* EDIT Icon */}
                                    <button 
                                        className="icon-action edit" 
                                        onClick={() => navigateTo(`/reminders/${r.id}/edit`)} // Assuming an edit route
                                        title="Edit Reminder"
                                    >
                                        <FaEdit />
                                    </button>
                                    
                                    {/* DELETE Icon */}
                                    <button 
                                    className="icon-action delete"
                                    onClick={() => onDeleteReminder && onDeleteReminder(r.id, r.customerName)}
                                    title="Delete Reminder"
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    </div>
);
// -----------------------------------------------------------------
// 🏆 NEW: A wrapper component to handle fetching data for EmployeeForm
// -----------------------------------------------------------------
// 🏆 UPDATED EMPLOYEE FORM WRAPPER COMPONENT - ADDED DATA TRANSFORMATION
// -----------------------------------------------------------------
// -----------------------------------------------------------------
// 🏆 UPDATED EMPLOYEE FORM WRAPPER COMPONENT - FIXED DATA LOADING
// -----------------------------------------------------------------
const EmployeeFormWrapper = ({ onSave, onCancel }) => {
    const { employeeId } = useParams(); 
    const [employeeData, setEmployeeData] = useState(null);
    const [isLoading, setIsLoading] = useState(!!employeeId);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (employeeId) {
            setIsLoading(true);
            setError(null);

            const fetchEmployee = async () => {
                try {
                    console.log(`🔄 Fetching employee data for ID: ${employeeId}`);
                    const response = await apiClient.get(`/employees/${employeeId}/`);
                    console.log('📥 API Response:', response.data);
                    
                    // 🏆 CRITICAL FIX: Set the employee data directly
                    setEmployeeData(response.data);
                } catch (error) {
                    console.error('❌ Failed to fetch employee:', error);
                    setError('Failed to load employee data. Please try again.');
                } finally {
                    setIsLoading(false);
                }
            };
            fetchEmployee();

        } else {
            // New employee mode
            setEmployeeData(null);
            setIsLoading(false);
        }
    }, [employeeId]);

    if (isLoading) {
        return (
            <div className="page-content-area" style={{ padding: '40px', textAlign: 'center' }}>
                <div>Loading Employee Data...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-content-area" style={{ padding: '40px', textAlign: 'center' }}>
                <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>
                <button className="btn-secondary" onClick={onCancel}>
                    Back to List
                </button>
            </div>
        );
    }

    return (
        <EmployeeForm
            onSave={onSave}
            onCancel={onCancel}
            employeeData={employeeData}
        />
    );
};

// 🏆 NEW: Vehicle Form Wrapper to extract route parameters
const VehicleFormWrapper = ({ onSave, onCancel }) => {
    const { clientId, vehicleId } = useParams(); 

    console.log('🔍 VehicleFormWrapper - URL clientId:', clientId);
    console.log('🔍 VehicleFormWrapper - URL vehicleId:', vehicleId)
    
    return (
        <VehicleForm 
            onSave={onSave} 
            onCancel={onCancel} 
            clientId={clientId}  // 🛑 CRITICAL: Pass the clientId from URL params
            vehicleId={vehicleId} // Pass vehicleId if needed for edit mode
        />
    );
};

// -----------------------------------------------------------------
// HOME COMPONENT (MAIN APPLICATION LAYOUT)
// -----------------------------------------------------------------
const Home = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();// 🛑 Hook to read navigation state

    // State Hooks
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [vehicles] = useState([]); 
    
    // 🏆 NEW/REPLACED: purchaseOrders is now a mutable state variable
   const [purchaseOrders, setPurchaseOrders] = useState([
        { poId: 'PO-2025-001', poNo: 'PO-001', supplierName: 'Auto Parts Inc.', poDate: '2025-10-20', expectedDeliveryDate: '2025-10-25', status: 'Received', currency: 'TZS', grandTotalAmount: 1250000 },
        { poId: 'PO-2025-002', poNo: 'PO-002', supplierName: 'Tool Mart Ltd.', poDate: '2025-11-01', expectedDeliveryDate: '2025-11-15', status: 'Sent', currency: 'USD', grandTotalAmount: 850.50 },
    ]);
    const [reminders, setReminders] = useState([
        { id: 1, customerName: 'Azizi Bongo', plate: 'T 789 DFG', type: 'Oil Change', nextDueDate: '2026-01-15', status: 'Active' },
        { id: 2, customerName: 'John Doe', plate: 'T 123 ABC', type: 'Insurance Renewal', nextDueDate: '2025-12-01', status: 'Overdue' },
    ]);
    const [payments, setPayments] = useState([
        { id: 101, invoice: 'INV-2025-001', date: '2025-11-01', amount: '1,200,000 TZS', method: 'Bank Transfer', collectedBy: 'SA Jane' },
        { id: 102, invoice: 'INV-2025-003', date: '2025-11-05', amount: '450,000 TZS', method: 'Cash', collectedBy: 'SA John' },
        { id: 103, invoice: 'INV-2025-004', date: '2025-11-10', amount: '200,000 TZS', method: 'Mobile Money', collectedBy: 'SA Jane' },
    ]);

    // 🏆 NEW: State for Employee List Data (Replacing hardcoded array)
     const [employeeList, setEmployeeList] = useState([]);
    const [isEmployeeListLoading, setIsEmployeeListLoading] = useState(true);

    // 🛑 NEW: Toast state for application-wide messages
    const [appToast, setAppToast] = useState({ message: '', type: '' });
    
    // 🛑 NEW: State for the Confirmation Modal
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        confirmText: '',
        onConfirmAction: () => {}, 
    });

    // 🆕 NEW: State for Information Modal (Client Selection)
    const [infoModalConfig, setInfoModalConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        confirmText: '',
        onConfirmAction: () => {},
    });


    // 🏆 NEW HELPER: Standardized navigation function for success/error messages
    const handleNavigationSuccess = useCallback((path, message, type = 'success') => {
        console.log(`Navigating to ${path} with ${type} message: ${message}`);
        navigate(path, {
            replace: true,
            state: {
                [type === 'success' ? 'successMessage' : 'errorMessage']: message
            }
        });
    }, [navigate]);

    // EFFECT: Read and display success/error message from navigation state
     useEffect(() => {
        if (location.state?.successMessage) {
            setAppToast({ message: location.state.successMessage, type: 'success' });
            navigate(location.pathname, { replace: true, state: {} });
        } else if (location.state?.errorMessage) {
            setAppToast({ message: location.state.errorMessage, type: 'error' });
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, location.pathname, navigate]);

    // 🏆 EFFECT: Fetch Employee List Data (Now using real API)
    const fetchEmployees = useCallback(async () => {
        setIsEmployeeListLoading(true);
        try {
            const response = await apiClient.get('/employees/');
            
            // ✅ CRITICAL FIX: Handle both paginated and non-paginated responses
            const employeeData = response.data.results || response.data || [];
            setEmployeeList(employeeData);

            console.log("SUCCESS: Fetched employee list from API.");
            
        } catch (error) {
            console.error("Failed to fetch employee list from API:", error);
            setAppToast({ message: "Failed to load employees. Please try again.", type: 'error' });
        } finally {
            setIsEmployeeListLoading(false);
        }
    }, []);

    // Initial fetch
    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);



    // --- Navigation & UI Handlers ---

    const handleNavigate = (path) => {
        navigate(path);
        setIsProfileMenuOpen(false);
        if (window.innerWidth < 768) {
            setIsSidebarCollapsed(true);
        }
    };

    const toggleProfileMenu = () => {
        setIsProfileMenuOpen(prev => !prev);
    };

    // Helper to close modal
    // 🏆 FIX 1: Wrap closeModal in useCallback to give it a stable reference
     const closeModal = useCallback(() => {
        setModalConfig(prevConfig => ({ ...prevConfig, isOpen: false }));
    }, []); // Dependency: setModalConfig (stable setter)

    // 🆕 NEW: Helper to close info modal
    const closeInfoModal = useCallback(() => {
        setInfoModalConfig(prevConfig => ({ ...prevConfig, isOpen: false }));
    }, []);

    // 🆕 NEW: Show client selection modal
    const showClientSelectionModal = useCallback(() => {
        setInfoModalConfig({
            isOpen: true,
            title: 'Select Client First',
            message: 'Please select a client first, then add a vehicle for that client.',
            confirmText: 'Go to Clients',
            onConfirmAction: () => {
                closeInfoModal();
                navigate('/clients');
            },
        });
    }, [navigate, closeInfoModal]);

    // 🛑 New function to handle the actual API call/logic (Defined first)
    // 🏆 FIXED: Wrapped in useCallback with correct dependencies, including closeModal
   const performDeleteEmployee = useCallback(async (id, name) => {
        closeModal();
        try {
            await apiClient.delete(`/employees/${id}/`);
            console.log(`SUCCESS: Deleted employee with ID: ${id} from the API.`);
            
            setEmployeeList(prevList => prevList.filter(e => e.id !== id));
            const message = `Employee **${name}** was successfully deleted.`;
            setAppToast({ message, type: 'success' });
            
        } catch (error) {
            console.error("Failed to delete employee on API:", error);
            setAppToast({ message: `Error deleting employee ${name}. Server error.`, type: 'error' });
        }
    }, [closeModal]);  
    
    
    // 🏆 NEW EMPLOYEE DELETE HANDLER (UPDATED to use Modal)
    // 🏆 FIXED: Now includes performDeleteEmployee as a dependency.
    const handleDeleteEmployee = useCallback((id, name) => {
        setModalConfig({
            isOpen: true,
            title: `Delete Employee: ${name}?`,
            message: 'Permanently remove this employee. You cannot undo this action.',
            confirmText: 'Delete',
            onConfirmAction: () => performDeleteEmployee(id, name), 
        });
    }, [performDeleteEmployee]);

    // 🏆 NEW EMPLOYEE SAVE HANDLER (Called from EmployeeForm -> onSave)
   const handleSaveEmployee = useCallback((savedEmployee, isNew) => {
        const action = isNew ? 'created' : 'updated';
        const successMsg = `Employee **${savedEmployee.firstName} ${savedEmployee.lastName}** was successfully ${action}.`;

        // Update the local list state
        setEmployeeList(prevList => {
            if (isNew) {
                return [savedEmployee, ...prevList];
            } else {
                return prevList.map(e => 
                    e.id === savedEmployee.id ? savedEmployee : e
                );
            }
        });

        handleNavigationSuccess('/employees', successMsg, 'success');
    }, [handleNavigationSuccess]);

    // --- Form Handlers (All handlers below remain functional as per previous steps) ---

    /**
     * Handles the submission (POST or PUT/PATCH) for the ClientForm.
     */

    // 🏆 NEW: Function to handle the actual API call/logic for PO deletion
    const performDeletePO = useCallback(async (id, poNo) => {
        // Close modal first
        closeModal(); 
        try {
            console.log(`MOCK: Deleting Purchase Order with ID: ${id}`);
            // 🛑 REAL API CALL: await apiClient.delete(`/purchase-orders/${id}/`);
            
            // MOCK: Filter out the deleted purchase order
            setPurchaseOrders(prevList => prevList.filter(po => po.poId !== id));
            
            // Add Toast Notification for success
            // **Bolding the PO number in the success message**
            const message = `Purchase Order **${poNo}** was successfully removed.`; 
            setAppToast({ message, type: 'success' });
            
        } catch (error) {
            console.error("Failed to delete Purchase Order:", error);
            setAppToast({ message: `Error deleting PO ${poNo}. Please try again.`, type: 'error' });
        }
    }, [setPurchaseOrders, setAppToast, closeModal]);

    // 🏆 NEW: PO DELETE HANDLER (Sets up the Confirmation Modal)
    const handleDeletePO = useCallback((id, poNo) => {
        setModalConfig({
            isOpen: true,
            // Title matching the screenshot ("Do you want to remove client?") but generic
            title: `Do you want to remove this Purchase Order?`, 
            // Message showing which item is being deleted (matching screenshot structure)
            message: `If you remove Purchase Order (${poNo}), you cannot undo.`, 
            confirmText: 'Remove', // Matches the screenshot button text
            onConfirmAction: () => performDeletePO(id, poNo),
        });
    }, [performDeletePO, setModalConfig]);

    // 🏆 NEW: Function to handle the actual API call/logic for REMINDER deletion
    const performDeleteReminder = useCallback(async (id, name) => {
        closeModal(); 
        try {
            console.log(`MOCK: Deleting Service Reminder for: ${name}`);
            // 🛑 REAL API CALL: await apiClient.delete(`/reminders/${id}/`);
            
            // MOCK: Filter out the deleted reminder
            setReminders(prevList => prevList.filter(r => r.id !== id));
            
            // Add Toast Notification for success
            const message = `Service Reminder for **${name}** was successfully removed.`; 
            setAppToast({ message, type: 'success' });
            
        } catch (error) {
            console.error("Failed to delete Service Reminder:", error);
            setAppToast({ message: `Error deleting reminder for ${name}. Please try again.`, type: 'error' });
        }
    }, [setReminders, setAppToast, closeModal]);

    // 🏆 NEW: REMINDER DELETE HANDLER (Sets up the Confirmation Modal)
    const handleDeleteReminder = useCallback((id, name) => {
        setModalConfig({
            isOpen: true,
            title: `Do you want to remove this Reminder?`, 
            message: `If you remove the reminder for (${name}), you cannot undo this action.`, 
            confirmText: 'Remove', 
            onConfirmAction: () => performDeleteReminder(id, name),
        });
    }, [performDeleteReminder, setModalConfig]);

    // 🏆 NEW: Function to handle the actual API call/logic for PAYMENT deletion
    const performDeletePayment = useCallback(async (id, invoice) => {
        closeModal(); 
        try {
            console.log(`MOCK: Deleting Payment with ID: ${id} for Invoice: ${invoice}`);
            // 🛑 REAL API CALL: await apiClient.delete(`/payments/${id}/`);
            
            // MOCK: Filter out the deleted payment
            setPayments(prevList => prevList.filter(p => p.id !== id));
            
            // Add Toast Notification for success
            const message = `Payment for Invoice **${invoice}** was successfully deleted.`; 
            setAppToast({ message, type: 'success' });
            
        } catch (error) {
            console.error("Failed to delete Payment:", error);
            setAppToast({ message: `Error deleting payment for invoice ${invoice}. Please try again.`, type: 'error' });
        }
    }, [setPayments, setAppToast, closeModal]);

    // 🏆 NEW: PAYMENT DELETE HANDLER (Sets up the Confirmation Modal)
    const handleDeletePayment = useCallback((id, invoice) => {
        setModalConfig({
            isOpen: true,
            title: `Delete Payment for Invoice ${invoice}?`, 
            message: 'Permanently remove this payment record. This action cannot be undone.', 
            confirmText: 'Delete', 
            onConfirmAction: () => performDeletePayment(id, invoice),
        });
    }, [performDeletePayment, setModalConfig]);



    const handleClientSave = async (formData) => {
        const isEditMode = !!formData.id;
        const clientId = formData.id;
        const isIndividual = formData.clientType === 'Individual';

        // 1. Start with common fields
        let apiData = {
            client_type: formData.clientType || 'Individual',
            tax_id: formData.taxId || '',
            notes: formData.notes || '',
            email: formData.email || '',
            phone_number: formData.phone || '',
            address: formData.addressLine1 || '',
            city: formData.city || '',
            state: formData.state || '',
            zip_code: formData.zip || '',
            // Add settings fields (even if default/false, to ensure proper save)
            is_tax_exempt: formData.isTaxExempt || false,
            apply_discount: formData.applyDiscount || false,
            labor_rate_override: formData.laborRateOverride || false,
            custom_labor_rate: formData.customLaborRate || null,
            parts_markup_override: formData.partsMarkupOverride || false,
            custom_markup_percentage: formData.customMarkupPercentage || null,
            payment_terms_override: formData.paymentTermsOverride || false,
            custom_payment_terms: formData.customPaymentTerms || null,
        };

        // 🛑 CRITICAL FIX: Conditionally add name fields.
        if (isIndividual) {
            apiData = {
                ...apiData,
                first_name: formData.firstName || '',
                last_name: formData.lastName || '',
                company_name: '',
            };
        } else {
            apiData = {
                ...apiData,
                company_name: formData.companyName || '',
                first_name: '',
                last_name: '',
            };
        }

        try {
            let response;
            let successMessage;
            let savedClient;

            if (isEditMode) {
                // 2. EDIT MODE
                console.log(`Submitting Client UPDATE (PUT) for ID ${clientId}:`, apiData);
                // 🛑 Using apiClient reference to suppress the ESLint warning
                // Replace with actual API call: response = await apiClient.put(`/clients/${clientId}/`, apiData);
                
                // MOCK RESPONSE
                if (apiClient) { 
                    response = { data: { ...apiData, id: clientId, phone_number: formData.phone } }; 
                } else {
                    response = { data: { ...apiData, id: clientId, phone_number: formData.phone } }; 
                }
                savedClient = response.data;

                const clientName = isIndividual
                    ? `${formData.firstName} ${formData.lastName}`.trim()
                    : formData.companyName;

                successMessage = `Client **${clientName}** was successfully updated!`;

                // Navigate back to the client list upon success (Edit Mode)
                handleNavigationSuccess('/clients', successMessage);

            } else {
                // 2. CREATE MODE
                console.log("Submitting Client CREATE (POST):", apiData);
                // 🛑 Using apiClient reference to suppress the ESLint warning
                // Replace with actual API call: response = await apiClient.post('/clients/', apiData);

                // MOCK RESPONSE
                const mockId = Math.floor(Math.random() * 1000) + 100;
                if (apiClient) {
                     response = { data: { ...apiData, id: mockId, phone_number: formData.phone } };
                } else {
                     response = { data: { ...apiData, id: mockId, phone_number: formData.phone } };
                }
                savedClient = response.data;

                const clientName = (savedClient.company_name || `${savedClient.first_name || ''} ${savedClient.last_name || ''}`).trim();
                successMessage = `Client **${clientName}** was successfully created!`;

                // 3. Navigate to the Add Vehicle page for the new client
                 handleNavigationSuccess(`/vehicles/new/${savedClient.id}`, successMessage);
            }

            console.log("Client successfully saved:", savedClient);


        } catch (error) {
            // Log the detailed response data (CRITICAL for debugging failed validations)
            console.error("Failed to save client:", error.response ? error.response.data : error.message);

            let displayMessage = "Error saving client. Please check your inputs."; // Default message

            if (error.response && error.response.data) {
                const errorData = error.response.data;

                // 🏆 Robust Parsing Logic for API Validation Errors 🏆

                if (errorData.phone_number) {
                    displayMessage = `Phone Error: ${errorData.phone_number.join(' ')}`;
                } else if (errorData.email) {
                    displayMessage = `Email Error: ${errorData.email.join(' ')}`;
                } else if (errorData.first_name) {
                    displayMessage = `First Name Error: ${errorData.first_name.join(' ')}`;
                } else if (errorData.company_name) {
                    displayMessage = `Company Name Error: ${errorData.company_name.join(' ')}`;
                }

                else if (typeof errorData === 'object' && !Array.isArray(errorData)) {
                    const allErrors = Object.entries(errorData)
                        .map(([field, messages]) => {
                            const cleanField = field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                            return `${cleanField}: ${Array.isArray(messages) ? messages.join(' ') : String(messages)}`;
                        })
                        .join(' | ');

                    if (allErrors) {
                        displayMessage = allErrors;
                    }
                }
                else if (Array.isArray(errorData) && typeof errorData[0] === 'string') {
                    displayMessage = errorData.join(' | ');
                }
            }

            // Navigate back to the client list upon FAILURE
            handleNavigationSuccess('/clients', displayMessage, 'error');
        }
    };

    const handleClientCancel = () => {
        navigate('/clients');
    };
    // ---------------------------------

   const handleVehicleSave = useCallback(async (formData) => {
    try {
        console.log('🚀 Saving vehicle data:', formData);
        
        // Prepare data for backend
        const dataToSend = {
            client_id: formData.clientId,
            vin: formData.vin,
            license_plate: formData.licensePlate,
            vehicle_type: formData.vehicleType,
            year: formData.year,
            make: formData.make,
            model: formData.model,
            trim: formData.trim,
            transmission: formData.transmission,
            drivetrain: formData.drivetrain,
            engine: formData.engine,
            odo_reading: formData.odoReading,
            odo_unit: formData.odoUnit,
            color: formData.color,
            unit_number: formData.unitNumber,
            notes: formData.notes,
        };

        // Use nested route: /api/clients/{clientId}/vehicles/
        const clientId = formData.clientId;
        const url = `/clients/${clientId}/vehicles/`;

        console.log('🌐 Making API call to:', url);

        const response = await apiClient({
            method: 'post',
            url: url,
            data: dataToSend,
        });

        console.log('✅ Vehicle saved successfully:', response.data);

        // Show success message
        const message = `Vehicle **${formData.make} ${formData.model}** added successfully!`;
        handleNavigationSuccess('/vehicles', message, 'success');

    } catch (error) {
        console.error('❌ Failed to save vehicle:', error);
        
        const errorData = error.response?.data;
        let errorMsg = 'Failed to save vehicle. Please check your connection and try again.';
        
        if (errorData) {
            errorMsg = Object.keys(errorData)
                .map(key => {
                    const errorValue = errorData[key];
                    if (Array.isArray(errorValue)) {
                        return `${key}: ${errorValue.join(' ')}`;
                    } else if (typeof errorValue === 'string') {
                        return `${key}: ${errorValue}`;
                    } else {
                        return `${key}: ${JSON.stringify(errorValue)}`;
                    }
                })
                .join('\n');
        }

        setAppToast({ message: errorMsg, type: 'error' });
    }
}, [handleNavigationSuccess]);

    const handleVehicleCancel = () => {
    navigate('/vehicles');
};

const performDeleteVehicle = useCallback(async (id, name) => {
    closeModal();
    try {
        await apiClient.delete(`/vehicles/${id}/`);
        console.log(`SUCCESS: Deleted vehicle with ID: ${id}`);
        
        // Update vehicles state if you have it
        // setVehicles(prev => prev.filter(v => v.id !== id));
        
        const message = `Vehicle **${name}** was successfully deleted.`;
        setAppToast({ message, type: 'success' });
        
    } catch (error) {
        console.error("Failed to delete vehicle:", error);
        setAppToast({ message: `Error deleting vehicle ${name}. Server error.`, type: 'error' });
    }
}, [closeModal]);

const handleDeleteVehicle = useCallback((id, name) => {
    setModalConfig({
        isOpen: true,
        title: `Delete Vehicle: ${name}?`,
        message: 'Permanently remove this vehicle. This action cannot be undone.',
        confirmText: 'Delete',
        onConfirmAction: () => performDeleteVehicle(id, name),
    });
}, [performDeleteVehicle]);



    const handleGenericInventorySave = (data) => {
        console.log("Inventory Item Saved!", data);
        handleNavigationSuccess('/inventory/parts', `Inventory item saved!`);
    };

    const handleGenericInventoryCancel = () => {
        navigate('/inventory/parts');
    };

    const handleAssetSave = (data) => {
        console.log("Business Asset Saved!", data);
        handleNavigationSuccess('/inventory/asset', `Asset saved!`);
    };

    const handleAssetCancel = () => {
        navigate('/inventory/asset');
    };

    const handleVendorSave = (data) => {
        console.log("Vendor Saved!", data);
        handleNavigationSuccess('/inventory/vendors', `Vendor **${data.name}** saved!`);
    };

    const handleVendorCancel = () => {
        navigate('/inventory/vendors');
    };

    const handleAppointmentSave = (data) => {
        console.log("Appointment Saved!", data);
        handleNavigationSuccess('/appointments/new', `Appointment scheduled for ${data.date}!`);
    };

    const handleAppointmentCancel = () => {
        navigate('/appointments/new'); // Assuming this page is the list
    };

    // 🏆 NEW JOB CARD HANDLERS

    /**
     * Called by JobCardForm upon successful creation/update.
     */
    const handleJobCardSave = (isEditMode, jobCardNumber) => {
        const message = isEditMode
            ? `Job Card #${jobCardNumber} updated successfully!`
            : `New Job Card #${jobCardNumber} created and moved to Kanban board!`;

        // Navigate to the Kanban board with a success toast
        handleNavigationSuccess('/jobcards/kanban', message);
    };

    const handleJobCardCancel = () => {
        // Safe navigation back to the Kanban board
        navigate('/jobcards/kanban');
    };

    // 🏆 NEW EMPLOYEE HANDLERS (UPDATED TO USE FORM DATA STRUCTURE)
    // 🏆 NEW/UPDATED HELPER: Function to handle saving/updating an employee
const handleEmployeeSave = useCallback(async (formData) => {
    // 1. Determine if this is an EDIT or a CREATE operation
    const isEdit = !!formData.id; // True if the employee object already has an ID
    const apiUrl = isEdit ? `/employees/${formData.id}/` : '/employees/';
    const apiMethod = isEdit ? 'put' : 'post'; // Use PUT for update, POST for create

    // 2. Format the data for the API
    // Ensure the data keys match what your Django REST Framework (DRF) backend expects.
    // Assuming your backend uses snake_case and separated names:
    const dataToSend = {
        // The API model likely expects first_name, last_name, job_title, etc.
        first_name: formData.firstName,
        middle_name: formData.middleName || '',
        last_name: formData.lastName,
        job_title: formData.jobTitle,
        department: formData.department,
        email: formData.email,
        phone_number: formData.phoneNumber, // Assuming backend uses phone_number
        employment_status: formData.employmentStatus,
        // ... include other necessary fields like dateOfHire, basicSalary ...
        date_of_hire: formData.dateOfHire, // Example
        basic_salary: formData.basicSalary, // Example
        currency: formData.currency, // Example
    };

    try {
        console.log(`API ${apiMethod.toUpperCase()}: Sending data to ${apiUrl}`);
        
        // 3. Perform the API call
        const response = await apiClient[apiMethod](apiUrl, dataToSend);

        // 4. Handle State Update
        const savedEmployee = response.data;
        
        // Transform API response object back into the camelCase/combined format the List component expects (if necessary)
        // Ensure you always use the ID returned by the API for correctness (especially for new items)
        const formattedSavedEmployee = {
            id: savedEmployee.id,
            employeeId: savedEmployee.employee_id || savedEmployee.employeeId, // Use backend's ID
            firstName: savedEmployee.first_name,
            middleName: savedEmployee.middle_name,
            lastName: savedEmployee.last_name,
            jobTitle: savedEmployee.job_title,
            department: savedEmployee.department,
            email: savedEmployee.email,
            phoneNumber: savedEmployee.phone_number,
            employmentStatus: savedEmployee.employment_status,
        };

        setEmployeeList(prevList => {
            if (isEdit) {
                // If editing, map over the list and REPLACE the old object
                return prevList.map(e => 
                    e.id === formattedSavedEmployee.id ? formattedSavedEmployee : e
                );
            } else {
                // If creating, APPEND the new object
                return [...prevList, formattedSavedEmployee];
            }
        });

        // 5. Navigate back and show success message
        const message = isEdit 
            ? `Employee **${formattedSavedEmployee.firstName} ${formattedSavedEmployee.lastName}** updated successfully.`
            : `New employee **${formattedSavedEmployee.firstName} ${formattedSavedEmployee.lastName}** added successfully.`;
            
        handleNavigationSuccess('/employees', message, 'success');

    } catch (error) {
        console.error(`Failed to ${isEdit ? 'update' : 'create'} employee:`, error.response?.data || error);
        setAppToast({ message: `Error saving employee: ${error.response?.data?.detail || error.message || 'Please check your network.'}`, type: 'error' });
    }
}, [setEmployeeList, handleNavigationSuccess, setAppToast]);

    const handleEmployeeCancel = () => {
        // Safe navigation back to the Employee List
        navigate('/employees');
    };


    // ⭐ NEW SERVICE REMINDER HANDLERS
    const handleServiceReminderSave = (data) => {
        // Mock save logic
        const clientName = data.customer_name;
        const type = data.reminder_type;
        const message = `Service Reminder (${type}) for **${clientName}** created successfully!`;

        // Navigate to the Reminders List with a success toast
        handleNavigationSuccess('/reminders', message);
    };

    const handleServiceReminderCancel = () => {
        // Safe navigation back to the Reminders List
        navigate('/reminders');
    };

    // ⭐ NEW PURCHASE ORDER HANDLERS
    const handlePOSave = (data, isEditMode) => {
        // Mock save logic
        const poNumber = data.poNo || 'N/A';
        const supplier = data.supplierName || 'Unknown Supplier';
        const action = isEditMode ? 'updated' : 'created';
        const message = `Purchase Order #${poNumber} for **${supplier}** successfully ${action}!`;

        // Navigate to the Purchase Orders List with a success toast
        handleNavigationSuccess('/purchase-orders', message);
    };

    const handlePOCancel = () => {
        // Safe navigation back to the Purchase Orders List
        navigate('/purchase-orders');
    };

    // 🏆 NEW INVOICE/ESTIMATE HANDLERS
    const handleInvoiceEstimateSave = (data, type) => {
        // Mock save logic
        const number = data.id || 'N/A';
        const action = type === 'Invoice' ? 'Invoiced' : 'Estimated';
        const message = `${type} #${number} successfully ${action}!`;

        // Navigate back to the landing page with a success toast
        handleNavigationSuccess('/invoices-estimates', message);
    };

    const handleInvoiceEstimateCancel = () => {
        // Safe navigation back to the main list/landing page
        navigate('/invoices-estimates');
    };

    // 🏆 NEW PAYMENT HANDLERS
    const handlePaymentSave = (data) => {
        // Mock save logic
        const number = data.id || 'N/A';
        // Ensure amountPaid is a number for toFixed
        const amountPaid = parseFloat(data.amountPaid) || 0;
        const message = `Payment #${number} of ${data.currency} ${amountPaid.toFixed(2)} recorded successfully!`;

        // Navigate back to the payments list/landing page with a success toast
        handleNavigationSuccess('/payments', message);
    };

    const handlePaymentCancel = () => {
        // Safe navigation back to the payments list/landing page
        navigate('/payments');
    };

    // 🏆 NEW ACCOUNT HANDLERS
    const handleAccountSave = (data, isEditMode) => {
        // Mock save logic
        const accountName = data.accountName;
        const message = isEditMode
            ? `Account **${accountName} (${data.accountCode})** updated successfully!`
            : `New Account **${accountName} (${data.accountCode})** created!`;

        // Navigate back to the Accounting List/Chart of Accounts page
        handleNavigationSuccess('/accounting', message);
    };

    const handleAccountCancel = () => {
        // Safe navigation back to the Accounting List/Chart of Accounts page
        navigate('/accounting');
    };

    // 🏆 LATEST UPDATE: Expense Handlers
    const handleExpenseSave = (data) => {
        // Mock save logic using the calculated values
        const grossAmount = parseFloat(data.amountPaidGross);
        const expenseCategory = data.expenseCategory;
        const message = `Expense of ${data.currency} ${grossAmount.toFixed(2)} for **${expenseCategory}** recorded successfully!`;

        // Navigate back to the Accounting/Expense Tracking list
        handleNavigationSuccess('/accounting/expenses', message);
    };

    const handleExpenseCancel = () => {
        // Safe navigation back to the Expense Tracking list
        navigate('/accounting/expenses');
    };


    // Dynamic Props for TopNavBar
    const navBarProps = {
        shopName: "Autowork Garage",
        userName: user
            ? `${user.first_name} ${user.last_name || ''}`.trim()
            : 'Loading User...',
        shopLocation: user?.email || "No Email Provided",
        userAvatarUrl: user?.avatar_url,
    };

    // RENDER MAIN APPLICATION LAYOUT
    return (
        <div className="app-container">

            {/* 🛑 RENDER APPLICATION-WIDE TOAST HERE */}
            <ToastNotification
                message={appToast.message}
                type={appToast.type}
                onClose={() => setAppToast({ message: '', type: '' })}
            />
            
            {/* 🛑 RENDER CONFIRMATION MODAL HERE */}
            <ConfirmationModal
                isOpen={modalConfig.isOpen}
                title={modalConfig.title}
                message={modalConfig.message}
                confirmText={modalConfig.confirmText}
                onConfirm={modalConfig.onConfirmAction}
                onCancel={closeModal}
            />

            {/* 🆕 RENDER INFORMATION MODAL HERE */}
            <InformationModal
                isOpen={infoModalConfig.isOpen}
                title={infoModalConfig.title}
                message={infoModalConfig.message}
                confirmText={infoModalConfig.confirmText}
                onConfirm={infoModalConfig.onConfirmAction}
                onCancel={closeInfoModal}
            />


             {/* Top Navigation Bar (Fixed at top) */}
            <TopNavBar
                {...navBarProps}
                isSidebarCollapsed={isSidebarCollapsed}
                isProfileMenuOpen={isProfileMenuOpen}
                toggleProfileMenu={toggleProfileMenu}
                navigate={navigate}
                onLogout={logout}
            />

            {/* Main Content Wrapper (Covers Sidebar and Page Content) */}
            <div className={`main-content-wrapper ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>

                {/* Sidebar (Navigation) */}
                <Sidebar 
                    isCollapsed={isSidebarCollapsed} 
                    currentPath={window.location.pathname} 
                    navigateTo={handleNavigate}
                    toggleSidebar={() => setIsSidebarCollapsed(prev => !prev)} 
                />

                {/* Page Content Area (Scrollable) */}
                <div className="page-content-area">
                    {/* 👇 Routes Definition starts here */}
                    <Routes>
                        <Route path="/" element={<Dashboard navigateTo={handleNavigate} />} />
                        <Route path="/dashboard" element={<Navigate to="/" replace />} />
                        {/* 🛑 UPDATED REQUEST SERVICE ROUTE 🛑 */}
                        <Route path="/request-service" element={<RequestServiceGarage />} />
    
                        
                        {/* -------------------- 1. Clients & Vehicles -------------------- */}
                        <Route path="/clients" element={<ClientsList navigateTo={handleNavigate} />} />
                        <Route path="/clients/new" element={<ClientForm onSave={handleClientSave} onCancel={handleClientCancel} />} />
                        <Route path="/clients/:clientId" element={<ClientForm onSave={handleClientSave} onCancel={handleClientCancel} />} />
                        <Route path="/clients/:clientId/view" element={<ClientDetailView onCancel={() => navigate('/clients')} />} />
                        
                         {/* Vehicle Routes */}
<Route path="/vehicles" element={
    <VehicleList 
        navigateTo={handleNavigate} 
        vehicles={vehicles} 
        onDeleteVehicle={handleDeleteVehicle} 
        onShowClientModal={showClientSelectionModal}
    />
} />
<Route path="/vehicles/new/:clientId?/:vehicleId?" element={
    <VehicleFormWrapper onSave={handleVehicleSave} onCancel={handleVehicleCancel} />
} />
<Route path="/vehicles/:vin" element={
    <VehicleFormWrapper onSave={handleVehicleSave} onCancel={handleVehicleCancel} />
} />
                        
                        {/* -------------------- 2. Work Orders (Job Cards) -------------------- */}
                         <Route path="/jobcards/kanban" element={<JobCardKanban navigateTo={handleNavigate} />} />
                        <Route path="/jobcards/new/:clientId?/:vehicleId?" element={<JobCardForm onSave={handleJobCardSave} onCancel={handleJobCardCancel} />} />
                        <Route path="/jobcards/:jobCardId" element={<JobCardForm onSave={handleJobCardSave} onCancel={handleJobCardCancel} />} />

                        {/* -------------------- 3. Estimates & Invoices -------------------- */}
                         <Route path="/invoices-estimates" element={<InvoiceEstimateLanding navigateTo={handleNavigate} />} />
                        <Route path="/invoices-estimates/new/:type/:jobCardId?" element={<InvoiceEstimateForm onSave={handleInvoiceEstimateSave} onCancel={handleInvoiceEstimateCancel} />} />
                        <Route path="/invoices-estimates/:invoiceEstimateId" element={<InvoiceEstimateForm onSave={handleInvoiceEstimateSave} onCancel={handleInvoiceEstimateCancel} />} />

                        {/* -------------------- 4. Inventory & Assets & Vendors -------------------- */}
                        {/* 🆕 UPDATED: Now using InventoryPage for main inventory management */}
                        <Route path="/inventory/parts" element={<InventoryPage />} />
                        <Route path="/inventory/tires" element={<TireForm navigateTo={handleNavigate} onSave={handleGenericInventorySave} onCancel={handleGenericInventoryCancel} />} />
                        <Route path="/inventory/labor" element={<LaborForm navigateTo={handleNavigate} onSave={handleGenericInventorySave} onCancel={handleGenericInventoryCancel} />} />
                        <Route path="/inventory/canned-jobs" element={<CannedJobForm navigateTo={handleNavigate} onSave={handleGenericInventorySave} onCancel={handleGenericInventoryCancel} />} />
                        <Route path="/inventory/asset" element={<BusinessAssetList navigateTo={handleNavigate} />} />
                        <Route path="/inventory/asset/new" element={<BusinessAssetForm onSave={handleAssetSave} onCancel={handleAssetCancel} />} />
                        <Route path="/inventory/vendors" element={<VendorForm navigateTo={handleNavigate} onSave={handleVendorSave} onCancel={handleVendorCancel} />} />


                        {/* -------------------- 5. Purchase Orders -------------------- */}
                        <Route path="/purchase-orders" element={<PurchaseOrderList navigateTo={handleNavigate} purchaseOrders={purchaseOrders} onDeletePO={handleDeletePO} />} />
                        <Route path="/purchase-orders/new/:supplierId?/:jobCardId?" element={<PurchaseOrderForm onSave={handlePOSave} onCancel={handlePOCancel}  />} />
                        <Route path="/purchase-orders/:poId" element={<PurchaseOrderForm onSave={handlePOSave} onCancel={handlePOCancel} />} />

                        {/* -------------------- 6. Appointments & Reminders -------------------- */}
                         <Route path="/appointments/new" element={<AppointmentForm onSave={handleAppointmentSave} onCancel={handleAppointmentCancel} />} />
                        <Route path="/reminders" element={<ServiceReminderList navigateTo={handleNavigate} reminders={reminders} onDeleteReminder={handleDeleteReminder}/>} />
                        <Route path="/reminders/new/:clientId?/:vehicleId?" element={<ServiceReminderForm onSave={handleServiceReminderSave} onCancel={handleServiceReminderCancel} />} />
                        <Route path="/reminders/:reminderId" element={<ServiceReminderForm onSave={handleServiceReminderSave} onCancel={handleServiceReminderCancel} />} />

                        {/* -------------------- 7. Accounting & Payments -------------------- */}
                        <Route path="/accounting" element={<AccountList navigateTo={handleNavigate} />} />
                        <Route path="/accounting/account/new" element={<AccountForm onSave={handleAccountSave} onCancel={handleAccountCancel} />} />
                        <Route path="/accounting/account/:accountId" element={<AccountForm onSave={handleAccountSave} onCancel={handleAccountCancel} />} />

                         <Route path="/accounting/journal" element={<TransactionJournal navigateTo={handleNavigate} />} />
                        <Route path="/accounting/expenses" element={<ExpenseForm navigateTo={handleNavigate} onSave={handleExpenseSave} onCancel={handleExpenseCancel} />} />

                        <Route path="/payments" element={<PaymentList navigateTo={handleNavigate} payments={payments} onDeletePayment={handleDeletePayment} />} />
                        <Route path="/payments/new/:invoiceId?" element={<PaymentForm onSave={handlePaymentSave} onCancel={handlePaymentCancel} />} />
                        <Route path="/payments/:paymentId" element={<PaymentForm onSave={handlePaymentSave} onCancel={handlePaymentCancel} />} />

                        {/* -------------------- 8. Employees & HR -------------------- */}
                        {/* Employees List now passes the delete handler */}
                        <Route path="/employees" element={
                            isEmployeeListLoading ? (
                                <div className="page-content-area" style={{padding: '20px', textAlign: 'center'}}>Loading Employee List...</div>
                            ) : (
                                <EmployeeList 
                                    navigateTo={handleNavigate} 
                                    employees={employeeList}
                                    onDeleteEmployee={handleDeleteEmployee} 
                                />
                            )
                        } />
                        {/* 🛑 NEW VIEW ROUTE (FOR READ-ONLY DETAIL PAGE) */}
<Route path="/employees/:employeeId/view" element={
                            <EmployeeDetailView onCancel={() => handleNavigate('/employees')} />
                        } />
                        <Route path="/employees/:employeeId/edit" element={
                            <EmployeeFormWrapper onSave={handleSaveEmployee} onCancel={() => handleNavigate('/employees')} />
                        } />
                        {/* The wrapper handles fetching data for new/edit modes */}
                        <Route path="/employees/new" element={
                            <EmployeeFormWrapper onSave={handleSaveEmployee} onCancel={() => handleNavigate('/employees')} />
                        } />
                        <Route path="/employees/:employeeId" element={<EmployeeFormWrapper onSave={handleEmployeeSave} onCancel={handleEmployeeCancel} />} />

                      {/* -------------------- 9. Reports & Settings -------------------- */}
                 




 {/* -------------------- 9. Reports & Settings (UPDATED) -------------------- */}
    
    {/* Income and Expenses Report Route */}
    <Route path="/reports/financial-summary" element={<IncomeExpenseReport navigateTo={handleNavigate} />} />
                        <Route path="/reports/sales-purchases" element={<SalesPurchasesReport navigateTo={handleNavigate} />} />
                        <Route path="/reports/ar-ap" element={<DebitCreditReport navigateTo={handleNavigate} />} />
                        <Route path="/reports/parts-services" element={<PartsServicesReport navigateTo={handleNavigate} />} />
                        <Route path="/reports/inventory-profit" element={<InventoryAndProfitReport navigateTo={handleNavigate} />} />
                        <Route path="/reports/employees-salaries" element={<EmployeesAndSalariesReport navigateTo={handleNavigate} />} />
                        <Route path="/reports/tax-report" element={<TaxReport navigateTo={handleNavigate} />} />
                        <Route path="/reports/clients" element={<ClientsReport navigateTo={handleNavigate} />} />
                        <Route path="/reports/vehicles" element={<VehiclesReport navigateTo={handleNavigate} />} />
                        <Route path="/reports/vendors" element={<VendorsReport navigateTo={handleNavigate} />} />
                        <Route path="/reports/data-export" element={<DataExportPage navigateTo={handleNavigate} />} />
                        <Route path="/reports/statistics" element={<StatisticsPage navigateTo={handleNavigate} />} />
                        <Route path="/reports" element={<ReportsLandingPage navigateTo={handleNavigate} />} />
                        <Route path="/profile" element={<ProfilePage />} />

{/* -------------------- Catch All -------------------- */}
    <Route path="*" element={
                            <div style={{ padding: '20px', textAlign: 'center' }}>
                                <h2>404 - Page Not Found</h2>
                                <p>The page you are looking for does not exist.</p>
                                <button className="btn-secondary" onClick={() => navigate('/')}>Go to Dashboard</button>
                            </div>
                        } />
                    </Routes>

                    
                </div>
            </div>

            {/* Global App Styling */}
            <style jsx global>{`
                :root {
                    --color-primary: #007bff; /* Blue */
                    --color-primary-dark: #0056b3;
                    --color-primary-light: #b3d7ff;
                    --color-secondary: #6c757d;
                    --color-success: #28a745;
                    --color-success-dark: #1e7e34;
                    --color-danger: #dc3545; /* Red */
                    --color-danger-dark: #a71d2a;
                    --color-warning: #ffc107; /* Yellow */
                    --color-warning-dark: #d39e00;
                    --color-info: #17a2b8; /* Blue-Green */
                    --text-color: #333;
                    --text-muted: #6c757d;
                    --bg-light: #f8f9fa;
                    --border-color: #dee2e6;
                    --sidebar-width: 250px;
                    --sidebar-collapsed-width: 60px;
                    --navbar-height: 60px;
                }
                body {
                    margin: 0;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
                    background-color: var(--bg-light);
                    color: var(--text-color);
                }

                .app-container {
                    display: flex;
                    flex-direction: column;
                    min-height: 100vh;
                }

                .main-content-wrapper {
                    display: flex;
                    flex: 1;
                    padding-top: var(--navbar-height); /* Space for fixed TopNavBar */
                    transition: margin-left 0.3s ease;
                    margin-left: var(--sidebar-width);
                }

                .main-content-wrapper.sidebar-collapsed {
                    margin-left: var(--sidebar-collapsed-width);
                }

                .page-content-area {
                    flex-grow: 1;
                    padding: 20px;
                    overflow-y: auto;
                }
                
                /* --- Common List/Page Styles --- */
                .list-page-container {
                    background-color: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                }
                .page-header {
                    display: flex;
                    align-items: center;
                    padding: 15px 20px;
                    border-bottom: 1px solid var(--border-color);
                }
                .page-header h2 {
                    margin: 0;
                    color: var(--color-primary-dark);
                }
                
                /* --- Table Styles --- */
                .data-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 15px;
                }
                .data-table th, .data-table td {
                    text-align: left;
                    padding: 12px 15px;
                    border-bottom: 1px solid var(--border-color);
                }
                .data-table th {
                    background-color: #e9ecef;
                    font-weight: 700;
                    color: #495057;
                    text-transform: uppercase;
                    font-size: 0.85rem;
                }
                .data-table tbody tr:hover {
                    background-color: #f5f5f5;
                }

                /* 🛑 STYLES FOR WIDER ACTION COLUMN */
                .data-table th.action-column-header {
                    width: 150px; /* Reduced width for icons */
                    min-width: 120px;
                }

                .data-table td.action-column-cell {
                    /* Set minimum width to hold 3 icons + gaps */
                    width: 120px; 
                    min-width: 120px; 
                    
                    display: flex;
                    gap: 12px; /* Increased gap for better spacing */
                    justify-content: flex-start; 
                    align-items: center;
                }

                /* --- Button Styles (General) --- */
                .btn-primary-action, .btn-secondary, .btn-link {
                    padding: 8px 15px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: background-color 0.2s, border-color 0.2s;
                    display: inline-flex;
                    align-items: center;
                }
                .btn-primary-action {
                    background-color: var(--color-primary);
                    color: white;
                    border: 1px solid var(--color-primary);
                }
                .btn-primary-action:hover {
                    background-color: var(--color-primary-dark);
                    border-color: var(--color-primary-dark);
                }
                .btn-secondary {
                    background-color: var(--bg-light);
                    color: var(--text-color);
                    border: 1px solid var(--border-color);
                }
                .btn-secondary:hover {
                    background-color: #e2e6ea;
                }
                .btn-link {
                    background: none;
                    border: none;
                    color: var(--color-primary);
                    padding: 0;
                    margin: 0;
                    text-decoration: underline;
                    font-weight: normal;
                }
                .btn-link:hover {
                    color: var(--color-primary-dark);
                }
                
                
                /* 🏆 UPDATED: Modern Outline/Ghost Icon Actions */
                .icon-action {
                    /* Base Styles */
                    background: none; 
                    border: 1px var(--border-color); 
                    padding: 6px; 
                    cursor: pointer;
                    font-size: 1rem; 
                    line-height: 1; 
                    border-radius: 6px; 
                    
                    /* Initial Color - Muted but visible */
                    color: var(--text-muted); 
                    
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 32px; 
                    height: 32px; 
                    transition: all 0.25s ease;
                }

                /* 🏆 VIEW (YELLOW) - Changed from Blue-Green to Yellow for clear identification */
                .icon-action.view {
                    color: var(--color-warning); /* Yellow icon */
                    border-color: var(--color-warning); /* Yellow border */
                    background-color: rgba(255, 193, 7, 0.1); /* Very light yellow background */
                }
                .icon-action.view:hover {
                    background-color: var(--color-warning); /* Solid yellow background */
                    color: var(--text-color); /* Dark text for contrast */
                    border-color: var(--color-warning-dark);
                    box-shadow: 0 2px 4px rgba(255, 193, 7, 0.3);
                    transform: none; /* Removed transform for stability */
                }

                /* 🏆 EDIT (BLUE) - Primary color */
                .icon-action.edit {
                    color: var(--color-primary); /* Blue icon */
                    border-color: var(--color-primary);
                    background-color: rgba(0, 123, 255, 0.1); /* Very light blue background */
                }
                .icon-action.edit:hover {
                    background-color: var(--color-primary); /* Solid blue background */
                    color: white; /* White icon for contrast */
                    border-color: var(--color-primary-dark);
                    box-shadow: 0 2px 4px rgba(0, 123, 255, 0.3);
                    transform: none;
                }
                
                /* 🏆 DELETE (RED) - Danger color */
                .icon-action.delete {
                    color: var(--color-danger); /* Red icon */
                    border-color: var(--color-danger);
                    background-color: rgba(220, 53, 69, 0.1); /* Very light red background */
                }
                .icon-action.delete:hover {
                    background-color: var(--color-danger); /* Solid red background */
                    color: white; /* White icon for contrast */
                    border-color: var(--color-danger-dark);
                    box-shadow: 0 2px 4px rgba(220, 53, 69, 0.3);
                    transform: none;
                }


                /* Mobile Optimization */
                @media (max-width: 768px) {
                    .main-content-wrapper {
                        margin-left: var(--sidebar-collapsed-width);
                    }
                    .main-content-wrapper.sidebar-collapsed {
                        margin-left: 0; /* Sidebar collapses to full overlay */
                    }
                    .page-content-area {
                        padding: 10px;
                    }
                    .data-table th, .data-table td {
                        padding: 8px 10px;
                    }
                    .data-table td.icon-action-container {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 10px;
                        width: auto; 
                        min-width: 100px;
                    }
                    /* Ensure icons are still readable on mobile */
                    .icon-action {
                        width: 30px;
                        height: 30px;
                        font-size: 1.1rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default Home;