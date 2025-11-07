// src/components/BusinessAssetList.js

import React from 'react';
import { FaArrowLeft, FaSearch, FaRedoAlt, FaEllipsisV, FaPlusCircle } from 'react-icons/fa';
import { IoDocumentTextOutline } from 'react-icons/io5'; // Using a paper/document icon for the no-data graphic

const BusinessAssetList = ({ navigateTo }) => {
    
    // In a real application, this would be fetched from an API
    const assetCount = 0; 
    const isListEmpty = assetCount === 0;

    const handleNewRecord = () => {
        // Navigate to the form page for adding a new asset
        navigateTo('/inventory/asset/add');
    };

    const handleRefresh = () => {
        // Placeholder for refreshing data
        console.log("Refreshing Business Assets...");
        alert("Refreshing data...");
    };

    const handleMoreActions = () => {
        // Placeholder for a dropdown menu with more options (e.g., Import/Export)
        alert("Showing More Actions menu...");
    };

    return (
        <div className="full-page-list">
            {/* Header Area */}
            <div className="page-header">
                {/* Back Button and Title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <FaArrowLeft 
                        onClick={() => navigateTo('/inventory')} 
                        style={{ cursor: 'pointer', fontSize: '1.5rem', color: 'var(--text-color)' }} 
                        title="Back to Inventory List"
                    />
                    <h2>Business Assets</h2>
                </div>
                
                {/* Actions: Refresh and More */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button 
                        type="button" 
                        className="btn-secondary-action" 
                        onClick={handleRefresh}
                        style={{ padding: '8px 15px', background: 'var(--card-bg)' }}
                    >
                        <FaRedoAlt style={{ marginRight: '5px' }} /> Refresh
                    </button>
                    <button 
                        type="button" 
                        className="btn-secondary-action" 
                        onClick={handleMoreActions}
                        style={{ padding: '8px 15px', background: 'var(--card-bg)' }}
                    >
                        More <FaEllipsisV style={{ marginLeft: '5px' }} />
                    </button>
                </div>
            </div>
            
            <div className="list-content-area" style={{ padding: '0 30px' }}>
                {/* Add New Record Banner/Button */}
                <div 
                    className="add-new-record-banner"
                    onClick={handleNewRecord}
                    style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '10px',
                        border: '1px solid #73b754', // Green border
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginBottom: '20px',
                        color: '#73b754',
                        fontWeight: 'bold'
                    }}
                >
                    <FaPlusCircle style={{ marginRight: '10px' }} /> Add new record
                </div>

                {/* Search Bar */}
                <div className="search-bar-container" style={{ marginBottom: '40px' }}>
                    <div className="input-with-icon">
                        <FaSearch className="input-icon" />
                        <input
                            type="text"
                            placeholder="Search by name, or description"
                            className="search-input"
                            style={{ paddingLeft: '35px' }}
                        />
                    </div>
                </div>

                {/* Empty State / No Data Found */}
                {isListEmpty && (
                    <div className="empty-state" style={{ textAlign: 'center', paddingTop: '100px', color: 'var(--text-muted)' }}>
                        {/* Custom sad-face document icon */}
                        <div style={{ fontSize: '70px', color: '#ccc', marginBottom: '20px' }}>
                             <IoDocumentTextOutline style={{ transform: 'rotate(-15deg)', marginRight: '10px' }}/>
                             <span role="img" aria-label="sad face" style={{ position: 'absolute', transform: 'translate(-50px, 30px)', fontSize: '20px' }}>😟</span>
                        </div>
                        
                        <h3 style={{ margin: '0 0 5px 0', color: 'var(--text-color)' }}>No Business Assets Found</h3>
                        <p>Change filters or press the **New Record** button to add a new business asset</p>
                    </div>
                )}

                {/* --- Asset List (Rendered if not empty) --- */}
                {/* {!isListEmpty && (
                    <div className="asset-list">
                        // List items would be rendered here
                    </div>
                )}
                */}

            </div>
        </div>
    );
};

export default BusinessAssetList;