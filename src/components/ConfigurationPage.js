// src/components/ConfigurationPage.js

import React, { useState } from 'react';
import { FaWrench } from 'react-icons/fa';

/* --- Mock Sub-Component: ConfigurationSection ---
   This component handles the structure for each configuration block.
   It is assumed to be defined in this file or imported.
*/
const ConfigurationSection = ({ title, fields, data, sectionKey, onChange, onSave }) => {
    return (
        <div className="config-section">
            <h3>{title}</h3>
            <div className="form-grid">
                {fields.map(field => (
                    <div className="form-group" key={field.key}>
                        <label htmlFor={`${sectionKey}-${field.key}`}>{field.label}</label>
                        {field.type === 'text' && (
                            <input
                                type="text"
                                id={`${sectionKey}-${field.key}`}
                                name={field.key}
                                value={data[field.key] || ''}
                                onChange={(e) => onChange(sectionKey, field.key, e.target.value)}
                            />
                        )}
                        {field.type === 'email' && (
                            <input
                                type="email"
                                id={`${sectionKey}-${field.key}`}
                                name={field.key}
                                value={data[field.key] || ''}
                                onChange={(e) => onChange(sectionKey, field.key, e.target.value)}
                            />
                        )}
                        {field.type === 'number' && (
                            <input
                                type="number"
                                id={`${sectionKey}-${field.key}`}
                                name={field.key}
                                value={data[field.key] || ''}
                                onChange={(e) => onChange(sectionKey, field.key, e.target.value)}
                            />
                        )}
                        {field.type === 'textarea' && (
                            <textarea
                                id={`${sectionKey}-${field.key}`}
                                name={field.key}
                                value={data[field.key] || ''}
                                onChange={(e) => onChange(sectionKey, field.key, e.target.value)}
                            />
                        )}
                        {field.type === 'select' && (
                            <select
                                id={`${sectionKey}-${field.key}`}
                                name={field.key}
                                value={data[field.key] || field.options[0].value}
                                onChange={(e) => onChange(sectionKey, field.key, e.target.value)}
                            >
                                {field.options.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        )}
                    </div>
                ))}
            </div>
            <div className="section-actions">
                <button 
                    className="btn-primary-action" 
                    onClick={() => onSave(sectionKey, data)}
                >
                    Save {title}
                </button>
            </div>
        </div>
    );
};
/* --- End Mock Sub-Component --- */


const ConfigurationPage = ({ handleNavigationSuccess, onSave }) => {
    
    // Mock initial configuration data structure
    const [configData, setConfigData] = useState({
        company: {
            name: 'Autowork Garage',
            taxId: 'TZN123456',
            phone: '+255 700 123 456',
            email: 'info@autowork.com',
            address: 'P.O. Box 123, Dar es Salaam',
        },
        financial: {
            defaultCurrency: 'TZS',
            defaultTaxRate: 18, // as percentage
            invoicePrefix: 'INV-',
        },
        settings: {
            sendReminders: 'Yes',
            defaultLaborRate: 50000,
        }
    });

    /**
     * Handles changes to form inputs within a specific configuration section.
     */
    const handleChange = (sectionKey, key, value) => {
        setConfigData(prevData => ({
            ...prevData,
            [sectionKey]: {
                ...prevData[sectionKey],
                [key]: value
            }
        }));
    };

    /**
     * Handles the save action for a specific configuration section.
     * In a real app, this would call an API PATCH endpoint.
     */
    const handleSave = (sectionKey, data) => {
        console.log(`Saving section: ${sectionKey}`, data);
        // Call the parent's onSave handler
        onSave(data, sectionKey); 
        // For mock purposes, we assume success is handled by the parent
    };
    
    // Define the field structures for each section
    
    const companyFields = [
        { key: 'name', label: 'Company Name', type: 'text' },
        { key: 'taxId', label: 'Tax ID / VAT No.', type: 'text' },
        { key: 'phone', label: 'Phone Number', type: 'text' },
        { key: 'email', label: 'Email Address', type: 'email' },
        { key: 'address', label: 'Physical Address', type: 'textarea' },
    ];
    
    const financialFields = [
        { key: 'defaultCurrency', label: 'Default Currency', type: 'select', 
            options: [
                { value: 'TZS', label: 'Tanzanian Shilling (TZS)' },
                { value: 'USD', label: 'US Dollar (USD)' },
                { value: 'EUR', label: 'Euro (EUR)' },
            ] 
        },
        { key: 'defaultTaxRate', label: 'Default Tax Rate (%)', type: 'number' },
        { key: 'invoicePrefix', label: 'Invoice Prefix', type: 'text' },
    ];

    const generalSettingsFields = [
        { key: 'sendReminders', label: 'Auto Send Reminders?', type: 'select', 
            options: [
                { value: 'Yes', label: 'Yes' },
                { value: 'No', label: 'No' },
            ] 
        },
        { key: 'defaultLaborRate', label: 'Default Labor Rate (per hour)', type: 'number' },
    ];


    return (
        <div className="list-page-container configuration-page">
            <header className="page-header">
                <h2><FaWrench style={{ marginRight: '8px' }}/> System Configuration</h2>
            </header>
            
            <div className="config-settings-wrapper">
                {/* 1. Company Information Section */}
                <ConfigurationSection
                    title="Company Information"
                    fields={companyFields} 
                    data={configData.company || {}} 
                    sectionKey="company"
                    onChange={handleChange}
                    onSave={handleSave}
                />
                
                {/* 2. Financial Settings Section */}
                <ConfigurationSection
                    title="Financial Settings"
                    fields={financialFields} 
                    data={configData.financial || {}} 
                    sectionKey="financial"
                    onChange={handleChange}
                    onSave={handleSave}
                />

                {/* 3. General Settings Section */}
                <ConfigurationSection
                    title="General Settings"
                    fields={generalSettingsFields} 
                    data={configData.settings || {}} 
                    sectionKey="settings"
                    onChange={handleChange}
                    onSave={handleSave}
                />
            </div>
            
            {/* Minimal styling for the ConfigurationPage component */}
            <style jsx>{`
                .configuration-page {
                    max-width: 1000px;
                    margin: 0 auto;
                }
                .config-settings-wrapper {
                    display: grid;
                    gap: 30px;
                }
                .config-section {
                    background-color: white;
                    padding: 25px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                }
                .config-section h3 {
                    border-bottom: 2px solid var(--border-color);
                    padding-bottom: 10px;
                    margin-top: 0;
                    color: var(--color-primary);
                }
                .form-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 20px;
                    margin-bottom: 20px;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: 600;
                    color: var(--text-color);
                }
                .form-group input, .form-group select, .form-group textarea {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid var(--border-color);
                    border-radius: 5px;
                    box-sizing: border-box;
                }
                .form-group textarea {
                    resize: vertical;
                    min-height: 80px;
                }
                .section-actions {
                    padding-top: 15px;
                    border-top: 1px dashed var(--border-color);
                    text-align: right;
                }
            `}</style>
        </div>
    );
};

export default ConfigurationPage;