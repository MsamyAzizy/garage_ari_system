// src/components/VendorForm.js

import React from 'react';
// Corrected: FaTimes removed. FaUserTie and FaSave are kept as they are used in the header and the save button.
import { FaUserTie, FaSave } from 'react-icons/fa'; 

const VendorForm = ({ onSave, onCancel }) => { 
    // onCancel is kept in props for completeness, though unused in the button's absence

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, collect and validate the form data
        const vendorData = { name: "Example Vendor Inc.", phone: "555-1234" };
        console.log("Saving new vendor:", vendorData);
        onSave(vendorData);
    };

    return (
        <div className="form-container">
            <header className="page-header">
                <h2><FaUserTie style={{ marginRight: '15px' }} /> New Vendor</h2>
            </header>
            
            <form onSubmit={handleSubmit} className="form-card full-page-form">
                
                {/* Descriptive Text Section */}
                <div style={{ paddingBottom: '20px', borderBottom: '1px solid var(--border-color)', marginBottom: '20px' }}>
                    
                </div>

                {/* Vendor Details Section (Uses form-grid for two columns) */}
                <div className="form-grid">
                    {/* Vendor's full name (Column 1, Row 1) */}
                    <div className="form-group">
                        <label htmlFor="vendorName">Vendor's full name*</label>
                        <input 
                            type="text" 
                            id="vendorName" 
                            placeholder="Enter Vendor's full name" 
                            required 
                        />
                    </div>
                    
                    {/* Email (Column 2, Row 1 - moved up to fill the space where the icon was) */}
                    <div className="form-group">
                        <label htmlFor="vendorEmail">Email</label>
                        <input 
                            type="email" 
                            id="vendorEmail" 
                            placeholder="Enter Vendor's Email" 
                        />
                    </div>
                    
                    {/* Phone Number (Column 1, Row 2) */}
                    <div className="form-group">
                        <label htmlFor="vendorPhone">Phone number*</label>
                        <input 
                            type="tel" 
                            id="vendorPhone" 
                            placeholder="Enter Vendor's phone number" 
                            required 
                        />
                    </div>

                    {/* Contact Person (Column 2, Row 2 - Added placeholder field to balance the grid) */}
                    <div className="form-group">
                        <label htmlFor="vendorContact">Contact Person</label>
                        <input 
                            type="text" 
                            id="vendorContact" 
                            placeholder="Enter contact name" 
                        />
                    </div>
                    
                    {/* ❌ REMOVED: The middle icon placeholder has been removed */}
                </div>
                
                {/* Address (Full-width group) */}
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label htmlFor="vendorAddress">Address</label>
                    <input 
                        type="text" 
                        id="vendorAddress" 
                        placeholder="Enter Vendor's address" 
                    />
                </div>

                {/* Tax ID (Full-width group) */}
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label htmlFor="vendorTaxId">Tax Id</label>
                    <input 
                        type="text" 
                        id="vendorTaxId" 
                        placeholder="Enter Vendor's Tax Id" 
                    />
                </div>

                {/* Other/Notes (Full-width Textarea) */}
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label htmlFor="vendorNotes">Other</label>
                    <textarea 
                        id="vendorNotes" 
                        rows="4" 
                        placeholder="Enter note"
                        style={{ resize: 'vertical' }}
                    ></textarea>
                </div>

                {/* Form Actions (Fixed Footer - Save button on the right) */}
                <div className="form-actions fixed-footer">
                    {/* The Save button is on the right, controlled by CSS justify-content: flex-end */}
                    <button type="submit" className="btn-primary-action">
                        <FaSave style={{ marginRight: '8px' }} /> Save
                    </button>
                    
                    {/* The CANCEL button remains removed */}
                </div>
            </form>
        </div>
    );
};

export default VendorForm;