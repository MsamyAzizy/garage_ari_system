// src/components/ClientDetailView.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
    FaArrowLeft, 
    FaUser, 
    FaBuilding, 
    FaMapMarkerAlt, 
    FaFileAlt,
    FaDollarSign,
    FaTools,
    FaTag,
    FaEnvelope,
    FaPhone,
    FaIdCard,
    FaPercent,
    FaCalendar,
    FaEdit
} from 'react-icons/fa';
import apiClient from '../utils/apiClient';

// Helper function for safe data display
const displayValue = (value) => (value || '—');

// Format date for display
const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch {
        return '—';
    }
};

// Status badge component
const StatusBadge = ({ status, type = 'active' }) => (
    <span className={`status-badge status-${type}`}>
        {status}
    </span>
);

// Section header component
const SectionHeader = ({ icon: Icon, title, count }) => (
    <div className="section-header">
        <div className="section-title">
            <Icon className="section-icon" />
            <h3>{title}</h3>
            {count !== undefined && <span className="section-count">{count}</span>}
        </div>
    </div>
);

// Info card component for key metrics
const InfoCard = ({ icon: Icon, label, value, color = 'blue' }) => (
    <div className={`info-card info-card--${color}`}>
        <div className="info-card-icon">
            <Icon />
        </div>
        <div className="info-card-content">
            <div className="info-card-value">{value}</div>
            <div className="info-card-label">{label}</div>
        </div>
    </div>
);

const ClientDetailView = ({ onCancel }) => {
    const { clientId } = useParams();
    const [client, setClient] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClient = async () => {
            if (!clientId) return;

            setIsLoading(true);
            try {
                const response = await apiClient.get(`/clients/${clientId}/`);
                setClient(response.data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch client details:", err);
                setError("Failed to load client details. Please check the ID and network connection.");
                setClient(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchClient();
    }, [clientId]);

    // Helper to get client name for display
    const getClientName = (client) => {
        if (!client) return '';
        if (client.client_type === 'Company' && client.company_name) {
            return client.company_name;
        }
        return (client.full_name || `${client.first_name || ''} ${client.last_name || ''}`).trim();
    };

    // Helper to format currency values
    const formatCurrency = (value) => {
        if (!value || value === '—') return '—';
        const number = parseFloat(value);
        return isNaN(number) ? '—' : `TZS ${number.toLocaleString()}`;
    };

    // Helper to format percentage values
    const formatPercentage = (value) => {
        if (!value || value === '—') return '—';
        const number = parseFloat(value);
        return isNaN(number) ? '—' : `${number}%`;
    };

    // Count active overrides
    const countActiveOverrides = () => {
        if (!client) return 0;
        return [
            client.labor_rate_override,
            client.parts_markup_override,
            client.payment_terms_override
        ].filter(Boolean).length;
    };

    // --- Loading, Error, Not Found Renders ---
    if (isLoading) {
        return (
            <div className="client-detail-container">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading client details...</p>
                </div>
            </div>
        );
    }

    if (error || !client) {
        return (
            <div className="client-detail-container">
                <div className="error-state">
                    <div className="error-icon">⚠️</div>
                    <h2>{error ? "Error Loading Details" : "Client Not Found"}</h2>
                    <p>{error || `The client with ID "${clientId}" could not be found.`}</p>
                    <button className="btn-primary" onClick={onCancel}>
                        <FaArrowLeft style={{ marginRight: '8px' }} /> Back to Clients
                    </button>
                </div>
            </div>
        );
    }

    const clientName = getClientName(client);
    const isCompany = client.client_type === 'Company';
    const activeOverrides = countActiveOverrides();

    return (
        <div className="client-detail-container">
            {/* Header Section */}
            <header className="client-detail-header">
                <div className="header-actions">
                    <button className="btn-back" onClick={onCancel}>
                        <FaArrowLeft /> Back to Clients
                    </button>
                    <button className="btn-edit" onClick={() => window.location.href = `/clients/${clientId}`}>
                        <FaEdit /> Edit Client
                    </button>
                </div>
                <div className="client-header-main">
                    <div className="client-avatar">
                        {isCompany ? <FaBuilding /> : <FaUser />}
                    </div>
                    <div className="client-info">
                        <h1>{clientName}</h1>
                        <div className="client-meta">
                            <StatusBadge status={client.client_type || 'Individual'} type="primary" />
                            <span className="client-id">ID: {displayValue(client.id)}</span>
                            <span className="client-since">
                                <FaCalendar style={{ marginRight: '4px' }} />
                                Since {formatDate(client.created_at)}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Quick Stats */}
            <div className="stats-grid">
                <InfoCard 
                    icon={FaEnvelope} 
                    label="Email" 
                    value={displayValue(client.email)}
                    color="blue"
                />
                <InfoCard 
                    icon={FaPhone} 
                    label="Phone" 
                    value={displayValue(client.phone_number)}
                    color="green"
                />
                <InfoCard 
                    icon={FaTools} 
                    label="Active Overrides" 
                    value={activeOverrides}
                    color="orange"
                />
                <InfoCard 
                    icon={FaTag} 
                    label="Tax Status" 
                    value={client.is_tax_exempt ? 'Tax Exempt' : 'Taxable'}
                    color={client.is_tax_exempt ? 'purple' : 'gray'}
                />
            </div>

            {/* Main Content Grid */}
            <div className="content-grid">
                {/* Left Column */}
                <div className="content-column">
                    {/* Contact Information */}
                    <section className="detail-section">
                        <SectionHeader icon={FaUser} title="Contact Information" />
                        <div className="detail-table">
                            <div className="detail-row">
                                <div className="detail-label">Client Type</div>
                                <div className="detail-value">
                                    <StatusBadge status={displayValue(client.client_type)} type="primary" />
                                </div>
                            </div>
                            {isCompany ? (
                                <div className="detail-row">
                                    <div className="detail-label">Company Name</div>
                                    <div className="detail-value">{displayValue(client.company_name)}</div>
                                </div>
                            ) : (
                                <>
                                    <div className="detail-row">
                                        <div className="detail-label">First Name</div>
                                        <div className="detail-value">{displayValue(client.first_name)}</div>
                                    </div>
                                    <div className="detail-row">
                                        <div className="detail-label">Last Name</div>
                                        <div className="detail-value">{displayValue(client.last_name)}</div>
                                    </div>
                                </>
                            )}
                            <div className="detail-row">
                                <div className="detail-label">Email</div>
                                <div className="detail-value">
                                    <a href={`mailto:${client.email}`} className="email-link">
                                        <FaEnvelope style={{ marginRight: '6px' }} />
                                        {displayValue(client.email)}
                                    </a>
                                </div>
                            </div>
                            <div className="detail-row">
                                <div className="detail-label">Phone</div>
                                <div className="detail-value">
                                    <a href={`tel:${client.phone_number}`} className="phone-link">
                                        <FaPhone style={{ marginRight: '6px' }} />
                                        {displayValue(client.phone_number)}
                                    </a>
                                </div>
                            </div>
                            <div className="detail-row">
                                <div className="detail-label">Tax ID</div>
                                <div className="detail-value">
                                    <FaIdCard style={{ marginRight: '6px', color: '#666' }} />
                                    {displayValue(client.tax_id)}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Address Information */}
                    <section className="detail-section">
                        <SectionHeader icon={FaMapMarkerAlt} title="Address Information" />
                        <div className="detail-table">
                            <div className="detail-row">
                                <div className="detail-label">Address</div>
                                <div className="detail-value">{displayValue(client.address)}</div>
                            </div>
                            <div className="detail-row">
                                <div className="detail-label">City</div>
                                <div className="detail-value">{displayValue(client.city)}</div>
                            </div>
                            <div className="detail-row">
                                <div className="detail-label">State/Province</div>
                                <div className="detail-value">{displayValue(client.state)}</div>
                            </div>
                            <div className="detail-row">
                                <div className="detail-label">Zip/Postal Code</div>
                                <div className="detail-value">{displayValue(client.zip_code)}</div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column */}
                <div className="content-column">
                    {/* Client Settings */}
                    <section className="detail-section">
                        <SectionHeader icon={FaTools} title="Client Settings" />
                        <div className="settings-grid">
                            <div className={`setting-item ${client.is_tax_exempt ? 'active' : ''}`}>
                                <div className="setting-icon">💰</div>
                                <div className="setting-info">
                                    <div className="setting-label">Tax Exempt</div>
                                    <div className="setting-status">
                                        {client.is_tax_exempt ? 'Enabled' : 'Disabled'}
                                    </div>
                                </div>
                            </div>
                            <div className={`setting-item ${client.apply_discount ? 'active' : ''}`}>
                                <div className="setting-icon">🎯</div>
                                <div className="setting-info">
                                    <div className="setting-label">Default Discount</div>
                                    <div className="setting-status">
                                        {client.apply_discount ? 'Enabled' : 'Disabled'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Custom Pricing */}
                    {(client.labor_rate_override || client.parts_markup_override || client.payment_terms_override) && (
                        <section className="detail-section">
                            <SectionHeader icon={FaDollarSign} title="Custom Pricing & Terms" />
                            <div className="pricing-grid">
                                {client.labor_rate_override && (
                                    <div className="pricing-item">
                                        <div className="pricing-icon">
                                            <FaTools />
                                        </div>
                                        <div className="pricing-info">
                                            <div className="pricing-label">Custom Labor Rate</div>
                                            <div className="pricing-value">
                                                {formatCurrency(client.custom_labor_rate)}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {client.parts_markup_override && (
                                    <div className="pricing-item">
                                        <div className="pricing-icon">
                                            <FaPercent />
                                        </div>
                                        <div className="pricing-info">
                                            <div className="pricing-label">Parts Markup</div>
                                            <div className="pricing-value">
                                                {formatPercentage(client.custom_markup_percentage)}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {client.payment_terms_override && (
                                    <div className="pricing-item">
                                        <div className="pricing-icon">📅</div>
                                        <div className="pricing-info">
                                            <div className="pricing-label">Payment Terms</div>
                                            <div className="pricing-value">
                                                {displayValue(client.custom_payment_terms)}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* System Information */}
                    <section className="detail-section">
                        <SectionHeader icon={FaTag} title="System Information" />
                        <div className="detail-table">
                            <div className="detail-row">
                                <div className="detail-label">Client ID</div>
                                <div className="detail-value">{displayValue(client.id)}</div>
                            </div>
                            <div className="detail-row">
                                <div className="detail-label">Created Date</div>
                                <div className="detail-value">{formatDate(client.created_at)}</div>
                            </div>
                            <div className="detail-row">
                                <div className="detail-label">Last Updated</div>
                                <div className="detail-value">{formatDate(client.updated_at)}</div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* Notes Section - Full Width */}
            {client.notes && (
                <section className="detail-section notes-section">
                    <SectionHeader icon={FaFileAlt} title="Internal Notes" />
                    <div className="notes-content">
                        <div className="notes-text">
                            {client.notes}
                        </div>
                    </div>
                </section>
            )}

            <style jsx>{`
                .client-detail-container {
                    min-height: 100vh;
                    background: #f8fafc;
                    padding: 0;
                }

                /* Header Styles */
                .client-detail-header {
                    background: #d16a33ff;
                    color: white;
                    height:180px;
                    padding: 30px 40px;
                    border-radius: 16px;
                    position: relative;
                }

                .header-actions {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 20px;
                }

                .btn-back, .btn-edit {
                    background: rgba(255, 255, 255, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    color: white;
                    padding: 10px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(10px);
                }

                .btn-back:hover, .btn-edit:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: translateY(-1px);
                }

                .client-header-main {
                    display: flex;
                    align-items: center;
                    gap: 24px;
                }

                .client-avatar {
                    width: 80px;
                    height: 80px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 32px;
                    backdrop-filter: blur(10px);
                }

                .client-info h1 {
                    margin: 0 0 12px 0;
                    font-size: 2.5rem;
                    font-weight: 700;
                }

                .client-meta {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    flex-wrap: wrap;
                }

                .client-id, .client-since {
                    font-size: 0.9rem;
                    opacity: 0.9;
                    display: flex;
                    align-items: center;
                }

                /* Stats Grid */
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                    padding: 30px 40px;
                    background: white;
                    margin: 0;
                }

                .info-card {
                    display: flex;
                    align-items: center;
                    padding: 20px;
                    border-radius: 12px;
                    background: white;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }

                .info-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
                }

                .info-card--blue { border-left: 4px solid #3b82f6; }
                .info-card--green { border-left: 4px solid #10b981; }
                .info-card--orange { border-left: 4px solid #f59e0b; }
                .info-card--purple { border-left: 4px solid #8b5cf6; }
                .info-card--gray { border-left: 4px solid #6b7280; }

                .info-card-icon {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 16px;
                    font-size: 20px;
                }

                .info-card--blue .info-card-icon { background: #dbeafe; color: #3b82f6; }
                .info-card--green .info-card-icon { background: #d1fae5; color: #10b981; }
                .info-card--orange .info-card-icon { background: #fef3c7; color: #f59e0b; }
                .info-card--purple .info-card-icon { background: #ede9fe; color: #8b5cf6; }
                .info-card--gray .info-card-icon { background: #f3f4f6; color: #6b7280; }

                .info-card-value {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #1f2937;
                    margin-bottom: 4px;
                }

                .info-card-label {
                    font-size: 0.9rem;
                    color: #6b7280;
                    font-weight: 500;
                }

                /* Content Grid */
                .content-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 24px;
                    padding: 30px 40px;
                    max-width: 1800px;
                    margin: 0 auto;
                }

                @media (max-width: 1024px) {
                    .content-grid {
                        grid-template-columns: 1fr;
                    }
                }

                .detail-section {
                    background: white;
                    border-radius: 12px;
                    padding: 24px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    margin-bottom: 24px;
                }

                .section-header {
                    margin-bottom: 20px;
                }

                .section-title {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 8px;
                }

                .section-icon {
                    color: #3b82f6;
                    font-size: 1.2rem;
                }

                .section-title h3 {
                    margin: 0;
                    font-size: 1.3rem;
                    font-weight: 600;
                    color: #1f2937;
                }

                .section-count {
                    background: #3b82f6;
                    color: white;
                    padding: 2px 8px;
                    border-radius: 12px;
                    font-size: 0.8rem;
                    font-weight: 600;
                }

                /* Detail Table */
                .detail-table {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .detail-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    padding: 12px 0;
                    border-bottom: 1px solid #f3f4f6;
                }

                .detail-row:last-child {
                    border-bottom: none;
                }

                .detail-label {
                    font-weight: 500;
                    color: #6b7280;
                    min-width: 140px;
                    font-size: 0.9rem;
                }

                .detail-value {
                    color: #1f2937;
                    font-weight: 500;
                    text-align: right;
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    gap: 6px;
                }

                /* Links */
                .email-link, .phone-link {
                    color: #3b82f6;
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                }

                .email-link:hover, .phone-link:hover {
                    color: #1d4ed8;
                    text-decoration: underline;
                }

                /* Status Badges */
                .status-badge {
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .status-primary {
                    background: #dbeafe;
                    color: #1d4ed8;
                }

                /* Settings Grid */
                .settings-grid, .pricing-grid {
                    display: grid;
                    gap: 12px;
                }

                .setting-item, .pricing-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 16px;
                    border-radius: 8px;
                    border: 1px solid #e5e7eb;
                    transition: all 0.3s ease;
                }

                .setting-item.active, .pricing-item {
                    background: #f8fafc;
                    border-color: #d1fae5;
                }

                .setting-icon, .pricing-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.1rem;
                    background: #f3f4f6;
                }

                .setting-item.active .setting-icon {
                    background: #d1fae5;
                    color: #10b981;
                }

                .pricing-icon {
                    background: #dbeafe;
                    color: #3b82f6;
                }

                .setting-info, .pricing-info {
                    flex: 1;
                }

                .setting-label, .pricing-label {
                    font-weight: 500;
                    color: #374151;
                    margin-bottom: 2px;
                }

                .setting-status, .pricing-value {
                    font-size: 0.9rem;
                    color: #6b7280;
                }

                .setting-item.active .setting-status {
                    color: #10b981;
                    font-weight: 600;
                }

                /* Notes Section */
                .notes-section {
                    max-width: 1400px;
                    margin: 0 auto 30px;
                }

                .notes-content {
                    background: #f8fafc;
                    border-radius: 8px;
                    padding: 20px;
                    border-left: 4px solid #3b82f6;
                }

                .notes-text {
                    color: #374151;
                    line-height: 1.6;
                    white-space: pre-wrap;
                }

                /* Loading and Error States */
                .loading-state, .error-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 400px;
                    text-align: center;
                }

                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid #f3f4f6;
                    border-left: 4px solid #3b82f6;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 16px;
                }

                .error-icon {
                    font-size: 3rem;
                    margin-bottom: 16px;
                }

                .error-state h2 {
                    color: #dc2626;
                    margin-bottom: 8px;
                }

                .btn-primary {
                    background: #3b82f6;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-top: 16px;
                }

                .btn-primary:hover {
                    background: #2563eb;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .client-detail-header {
                        padding: 20px;
                    }

                    .client-header-main {
                        flex-direction: column;
                        text-align: center;
                        gap: 16px;
                    }

                    .client-info h1 {
                        font-size: 2rem;
                    }

                    .client-meta {
                        justify-content: center;
                    }

                    .stats-grid {
                        grid-template-columns: 1fr;
                        padding: 20px;
                    }

                    .content-grid {
                        padding: 20px;
                        gap: 16px;
                    }

                    .detail-section {
                        padding: 20px;
                    }

                    .detail-row {
                        flex-direction: column;
                        gap: 4px;
                        align-items: flex-start;
                    }

                    .detail-value {
                        text-align: left;
                        justify-content: flex-start;
                    }
                }
            `}</style>
        </div>
    );
};

export default ClientDetailView;