// File: src/components/Configuration.js

import React, { useState, useCallback, useMemo } from 'react';
import { FaCog, FaPlus, FaSave, FaTrashAlt, FaAngleLeft, FaPencilAlt } from 'react-icons/fa';

// --- MOCK DATA / INITIAL STATE ---
const initialTaxRates = [
    { id: 1, key: 'Tax1', label: 'VAT', rate: 15.0 },
    { id: 2, key: 'Tax2', label: 'GST', rate: 5.0 },
    { id: 3, key: 'Tax3', label: 'Provincial Tax', rate: 0.0 },
];

// Mock for customizable report categories (addressing the singular/plural issue)
const initialReportCategories = [
    { id: 101, name: 'Part', singular: 'Part', plural: 'Parts' },
    { id: 102, name: 'Service', singular: 'Service', plural: 'Services' },
    { id: 103, name: 'Fee', singular: 'Fee', plural: 'Fees' },
    { id: 104, name: 'Discount', singular: 'Discount', plural: 'Discounts' },
];

const Configuration = ({
    navigateTo = (path) => console.log(`Navigating to ${path}`)
}) => {
    // State for managing configuration sections
    const [taxRates, setTaxRates] = useState(initialTaxRates);
    const [categories, setCategories] = useState(initialReportCategories);
    const [activeSection, setActiveSection] = useState('TaxRates');
    const [isSaving, setIsSaving] = useState(false);

    // --- UTILITY FUNCTIONS ---

    const handleSave = useCallback(() => {
        setIsSaving(true);
        console.log('Saving Configuration...');
        // Simulate API call delay
        setTimeout(() => {
            console.log('Configuration Saved!');
            setIsSaving(false);
            // In a real app, you would send taxRates and categories to the backend here.
        }, 800);
    }, []);

    // --- TAX RATES HANDLERS ---

    const handleTaxChange = useCallback((id, field, value) => {
        setTaxRates(prev =>
            prev.map(rate => (rate.id === id ? { ...rate, [field]: value } : rate))
        );
    }, []);

    const addTaxRate = useCallback(() => {
        const newId = Math.max(...taxRates.map(r => r.id), 0) + 1;
        setTaxRates(prev => [
            ...prev,
            { id: newId, key: `Tax${newId}`, label: `New Tax ${newId}`, rate: 0.0 },
        ]);
    }, [taxRates]);

    const removeTaxRate = useCallback((id) => {
        setTaxRates(prev => prev.filter(rate => rate.id !== id));
    }, []);

    // --- CATEGORY HANDLERS ---

    const handleCategoryChange = useCallback((id, field, value) => {
        setCategories(prev =>
            prev.map(cat => (cat.id === id ? { ...cat, [field]: value } : cat))
        );
    }, []);

    const addCategory = useCallback(() => {
        const newId = Math.max(...categories.map(c => c.id), 100) + 1;
        setCategories(prev => [
            ...prev,
            { id: newId, name: `New Cat ${newId}`, singular: 'New Item', plural: 'New Items' },
        ]);
    }, [categories]);

    const removeCategory = useCallback((id) => {
        setCategories(prev => prev.filter(cat => cat.id !== id));
    }, []);

    // --- RENDER SECTIONS ---

    const renderContent = useMemo(() => {
        switch (activeSection) {
            case 'TaxRates':
                return (
                    <div className="settings-section">
                        <h3>Tax Rates and Labels</h3>
                        <p className="description-note">Define the names and percentages for the tax fields used across all reports and invoices.</p>
                        
                        <div className="settings-grid">
                            {taxRates.map((rate) => (
                                <div key={rate.id} className="setting-card">
                                    <div className="setting-row">
                                        <label>Internal Key</label>
                                        <input type="text" value={rate.key} readOnly disabled />
                                    </div>
                                    <div className="setting-row">
                                        <label>Report Label</label>
                                        <input
                                            type="text"
                                            value={rate.label}
                                            onChange={(e) => handleTaxChange(rate.id, 'label', e.target.value)}
                                        />
                                    </div>
                                    <div className="setting-row">
                                        <label>Rate (%)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={rate.rate}
                                            onChange={(e) => handleTaxChange(rate.id, 'rate', parseFloat(e.target.value))}
                                        />
                                    </div>
                                    <button 
                                        className="btn-delete" 
                                        onClick={() => removeTaxRate(rate.id)}
                                        disabled={initialTaxRates.some(r => r.id === rate.id)} // Prevent deleting initial mock data
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button className="btn-add" onClick={addTaxRate}><FaPlus /> Add New Tax Rate</button>
                    </div>
                );

            case 'ReportCategories':
                return (
                    <div className="settings-section">
                        <h3>Report Categories (Singular/Plural)</h3>
                        <p className="description-note">Customize the singular and plural names for items like parts, services, and fees. This affects data entry and report groupings.</p>
                        
                        <div className="settings-grid category-grid">
                            {categories.map((cat) => (
                                <div key={cat.id} className="setting-card">
                                    <div className="setting-row">
                                        <label>Internal Name</label>
                                        <input type="text" value={cat.name} readOnly disabled />
                                    </div>
                                    <div className="setting-row">
                                        <label>Singular Label</label>
                                        <input
                                            type="text"
                                            value={cat.singular}
                                            onChange={(e) => handleCategoryChange(cat.id, 'singular', e.target.value)}
                                        />
                                    </div>
                                    <div className="setting-row">
                                        <label>Plural Label</label>
                                        <input
                                            type="text"
                                            value={cat.plural}
                                            onChange={(e) => handleCategoryChange(cat.id, 'plural', e.target.value)}
                                        />
                                    </div>
                                    <button 
                                        className="btn-delete" 
                                        onClick={() => removeCategory(cat.id)}
                                        disabled={initialReportCategories.some(c => c.id === cat.id)} // Prevent deleting initial mock data
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button className="btn-add" onClick={addCategory}><FaPlus /> Add New Category</button>
                    </div>
                );
            
            case 'General':
            default:
                return (
                    <div className="settings-section">
                        <h3>General Settings</h3>
                        <p className="description-note">System-wide configurations.</p>
                        <div className="general-settings-form">
                            <div className="setting-row-general">
                                <label>Default Currency Symbol</label>
                                <input type="text" defaultValue="$" style={{ width: '80px' }} />
                            </div>
                            <div className="setting-row-general">
                                <label>Fiscal Year Start Month</label>
                                <select defaultValue="1">
                                    <option value="1">January</option>
                                    <option value="4">April</option>
                                    <option value="7">July</option>
                                    <option value="10">October</option>
                                </select>
                            </div>
                        </div>
                    </div>
                );
        }
    }, [activeSection, taxRates, categories, handleTaxChange, addTaxRate, removeTaxRate, handleCategoryChange, addCategory, removeCategory]);


    return (
        <div className="configuration-page-container">
            {/* Header */}
            <header className="page-header config-header">
                <button className="back-button" onClick={() => navigateTo('/dashboard')}>
                    <FaAngleLeft />
                </button>
                <h2><FaCog style={{ marginRight: '8px' }} /> Configuration & Settings</h2>
                <div className="header-actions">
                    <button 
                        className="btn-primary-action" 
                        onClick={handleSave} 
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : <><FaSave /> Save Changes</>}
                    </button>
                </div>
            </header>

            <div className="config-layout">
                {/* Sidebar Navigation */}
                <nav className="config-sidebar">
                    <button
                        className={`sidebar-item ${activeSection === 'General' ? 'active' : ''}`}
                        onClick={() => setActiveSection('General')}
                    >
                        General Settings
                    </button>
                    <button
                        className={`sidebar-item ${activeSection === 'TaxRates' ? 'active' : ''}`}
                        onClick={() => setActiveSection('TaxRates')}
                    >
                        Tax Rate Management
                    </button>
                    <button
                        className={`sidebar-item ${activeSection === 'ReportCategories' ? 'active' : ''}`}
                        onClick={() => setActiveSection('ReportCategories')}
                    >
                        Report Categories
                    </button>
                </nav>

                {/* Main Content Area */}
                <main className="config-main-content">
                    {renderContent}
                </main>
            </div>

            {/* CSS Styles for this component */}
            <style jsx global>{`
                /* General Variables */
                :root {
                    --color-primary: #5c6bc0;
                    --color-border: #eee;
                    --color-background-light: #f5f7fa;
                    --color-text-primary: #333;
                    --color-text-muted: #777;
                    --color-error: #cc0033;
                }
                
                /* Page Layout */
                .configuration-page-container {
                    display: flex;
                    flex-direction: column;
                    min-height: 100vh;
                    background-color: var(--color-background-light);
                }

                /* Header */
                .config-header {
                    display: flex;
                    align-items: center; 
                    padding: 15px 20px;
                    background-color: white;
                    border-bottom: 1px solid var(--color-border);
                }

                .config-header h2 {
                    font-size: 1.4rem;
                    color: var(--color-text-primary);
                    flex-grow: 1; 
                }
                
                .config-header .back-button {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    color: #5c6bc0;
                    cursor: pointer;
                    margin-right: 15px;
                    display: flex;
                    align-items: center;
                    padding: 0;
                    transition: color 0.2s;
                }
                .config-header .back-button:hover {
                    color: #4a5aa8;
                }

                .btn-primary-action {
                    padding: 8px 15px;
                    background-color: var(--color-primary);
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 600;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    transition: background-color 0.2s;
                }
                .btn-primary-action:hover:not(:disabled) {
                    background-color: #4a5aa8;
                }
                .btn-primary-action:disabled {
                    background-color: #aaa;
                    cursor: not-allowed;
                }


                /* Main Layout (Sidebar + Content) */
                .config-layout {
                    display: flex;
                    flex: 1;
                    min-height: calc(100vh - 60px); /* Adjust height based on header height */
                }

                /* Sidebar */
                .config-sidebar {
                    width: 250px;
                    padding: 20px 0;
                    background-color: white;
                    border-right: 1px solid var(--color-border);
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }

                .config-sidebar .sidebar-item {
                    display: block;
                    width: 100%;
                    padding: 12px 20px;
                    text-align: left;
                    background: none;
                    border: none;
                    color: var(--color-text-primary);
                    font-weight: 500;
                    cursor: pointer;
                    border-left: 3px solid transparent;
                    transition: all 0.2s;
                    font-size: 0.95rem;
                }

                .config-sidebar .sidebar-item:hover {
                    background-color: var(--color-background-light);
                }

                .config-sidebar .sidebar-item.active {
                    color: var(--color-primary);
                    background-color: #f0f3ff;
                    border-left: 3px solid var(--color-primary);
                    font-weight: 700;
                }

                /* Main Content Area */
                .config-main-content {
                    flex: 1;
                    padding: 30px;
                    overflow-y: auto;
                }

                .settings-section h3 {
                    border-bottom: 2px solid var(--color-border);
                    padding-bottom: 10px;
                    margin-bottom: 20px;
                    color: var(--color-primary);
                    font-size: 1.5rem;
                }
                
                .description-note {
                    color: var(--color-text-muted);
                    font-size: 0.9rem;
                    margin-bottom: 25px;
                    padding: 10px;
                    background-color: #fff;
                    border-left: 3px solid var(--color-primary);
                }

                /* Setting Cards/Grid */
                .settings-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 20px;
                    margin-bottom: 20px;
                }

                .setting-card {
                    background-color: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                    position: relative;
                }

                .setting-row {
                    margin-bottom: 15px;
                }
                
                .setting-row label {
                    display: block;
                    font-weight: 600;
                    margin-bottom: 5px;
                    font-size: 0.85rem;
                    color: var(--color-text-primary);
                }
                
                .setting-row input, .setting-row select, .setting-row-general input, .setting-row-general select {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    box-sizing: border-box;
                    font-size: 1rem;
                }
                
                .setting-row input:disabled {
                    background-color: #f0f0f0;
                    color: var(--color-text-muted);
                }
                
                /* Tax Rates Specific Grid */
                .tax-rate-grid .setting-card {
                    display: grid;
                    grid-template-columns: auto 1fr 100px 30px; /* Key, Label, Rate, Delete */
                    gap: 15px;
                    align-items: center;
                }


                /* Action Buttons */
                .btn-add {
                    padding: 10px 20px;
                    background-color: #2ecc71; /* Green */
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 600;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    transition: background-color 0.2s;
                }
                .btn-add:hover {
                    background-color: #27ae60;
                }

                .btn-delete {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: none;
                    border: none;
                    color: var(--color-error);
                    cursor: pointer;
                    font-size: 1rem;
                    opacity: 0.7;
                    transition: opacity 0.2s;
                }
                .btn-delete:hover:not(:disabled) {
                    opacity: 1;
                }
                .btn-delete:disabled {
                    color: #ccc;
                    cursor: not-allowed;
                }
                
                .general-settings-form {
                    background-color: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                    max-width: 400px;
                }
                
                .setting-row-general {
                    margin-bottom: 15px;
                }
                .setting-row-general label {
                    display: block;
                    font-weight: 600;
                    margin-bottom: 5px;
                    font-size: 0.9rem;
                    color: var(--color-text-primary);
                }
                
                /* Mobile Responsiveness */
                @media (max-width: 768px) {
                    .config-layout {
                        flex-direction: column;
                    }
                    .config-sidebar {
                        width: 100%;
                        height: auto;
                        border-right: none;
                        border-bottom: 1px solid var(--color-border);
                        flex-direction: row;
                        overflow-x: auto;
                        padding: 0;
                    }
                    .config-sidebar .sidebar-item {
                        flex-shrink: 0;
                        border-left: none;
                        border-bottom: 3px solid transparent;
                    }
                    .config-sidebar .sidebar-item.active {
                        border-left: none;
                        border-bottom: 3px solid var(--color-primary);
                    }
                    .config-main-content {
                        padding: 15px;
                    }
                    .settings-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default Configuration;