import React from 'react';
// Assuming you have a way to handle icons, we'll use simple text for placeholders.

const EstimatePage = () => {
    // --- START OF EMBEDDED STYLES (For a single-file solution) ---
    // NOTE: In a real application, these styles should be imported from src/assets/styles.css
    // and this <style> block should be removed. We include them here as requested for a 'single page'.
    const pageStyles = `
        /* Inherited global variables and base styles are omitted for brevity,
           but critical layout styles are included below. */

        .page-content {
            padding: 0;
            overflow-y: auto;
            background-color: var(--background-secondary, #f4f6f9);
        }

        .form-card {
            background-color: var(--card-bg, #ffffff);
            padding: 20px;
            border-radius: var(--border-radius-large, 8px);
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
            margin: 20px;
        }

        .estimate-wrapper {
            padding-bottom: 90px; /* Space for fixed footer */
        }

        /* --- Client & Vehicle Header --- */
        .client-vehicle-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding: 10px 20px;
            border-bottom: 1px solid var(--border-color, #dee2e6);
            margin-bottom: 15px;
        }
        .client-info h4 {
            margin: 0;
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--text-color, #333);
        }
        .vehicle-info {
            text-align: right;
        }

        /* --- Section Styling --- */
        .form-section-title {
            font-size: 1.2rem;
            font-weight: 600;
            color: var(--primary-color-dark, #0056b3);
            border-bottom: 1px solid var(--border-color, #dee2e6);
            padding-bottom: 8px;
            margin-top: 30px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        /* --- Inspect & Diagnose Cards --- */
        .diag-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
        }
        .diag-card {
            background-color: var(--primary-color-lightest, #e6f2ff);
            border: 1px solid var(--primary-color-light, #52a3ff);
            border-radius: var(--border-radius-base, 4px);
            padding: 15px;
            text-align: center;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        .diag-card:hover {
            background-color: var(--primary-color-light, #52a3ff);
            color: white;
        }
        .diag-card strong {
            display: block;
            font-size: 0.95rem;
            margin-bottom: 5px;
        }
        .diag-card small {
            font-size: 0.8rem;
            color: var(--text-muted, #6c757d);
        }
        .diag-card:hover small {
            color: white;
        }
        
        /* --- Parts & Labor Tabs --- */
        .tab-bar {
            display: flex;
            margin-bottom: 20px;
        }
        .tab-bar button {
            padding: 8px 15px;
            border: 1px solid var(--border-color, #dee2e6);
            background-color: var(--background-color, #fff);
            cursor: pointer;
            font-size: 0.9rem;
        }
        .tab-bar button:first-child {
            border-radius: var(--border-radius-base, 4px) 0 0 var(--border-radius-base, 4px);
        }
        .tab-bar button:last-child {
            border-radius: 0 var(--border-radius-base, 4px) var(--border-radius-base, 4px) 0;
            border-left: none;
        }
        .tab-bar .active {
            background-color: var(--primary-color, #007bff);
            color: white;
            border-color: var(--primary-color, #007bff);
        }

        /* --- Table Styling for Line Items --- */
        .line-item-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.9rem;
            margin-top: 10px;
        }
        .line-item-table th, .line-item-table td {
            padding: 8px 10px;
            border-bottom: 1px solid var(--border-color, #dee2e6);
            text-align: left;
            white-space: nowrap;
        }
        .line-item-table th {
            background-color: var(--primary-color-lightest, #e6f2ff);
            font-weight: 600;
        }
        .line-item-table .apply-btn-row td {
            padding: 15px 0;
            text-align: center;
            border-bottom: none;
        }
        .apply-changes-btn {
            background-color: var(--success-color, #28a745);
            color: white;
            padding: 12px 30px;
            font-size: 1rem;
            border: none;
            border-radius: var(--border-radius-base, 4px);
            cursor: pointer;
            font-weight: 600;
        }

        /* --- Subtotal Summary --- */
        .subtotal-summary {
            padding-top: 20px;
            display: flex;
            flex-direction: column;
        }
        .subtotal-summary > strong {
            font-size: 1.4rem;
            font-weight: 700;
            margin-bottom: 15px;
        }
        .financial-breakdown {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr; /* 3 columns for tax, other, discount buttons */
            gap: 15px;
            margin-bottom: 20px;
        }
        .financial-breakdown button {
            padding: 8px 15px;
            border: 1px solid var(--border-color-darker, #c3c7cb);
            background: var(--hover-bg, #f8f9fa);
            border-radius: var(--border-radius-base, 4px);
            cursor: pointer;
        }
        .total-summary-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            border-top: 1px solid var(--border-color, #dee2e6);
            padding-top: 15px;
        }
        .summary-col {
            display: flex;
            flex-direction: column;
        }
        .summary-line {
            display: flex;
            justify-content: space-between;
            padding: 3px 0;
            font-size: 0.95rem;
        }
        .summary-line strong {
            font-weight: 700;
        }
        .total-line {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--text-color, #333);
            margin-top: 10px;
        }
        .profit-line {
            color: var(--success-color, #28a745);
        }
        .right-align {
            text-align: right;
        }

        /* --- Payments Section --- */
        .payments-summary {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 20px;
        }
        .payments-summary h4 {
            font-size: 1.2rem;
            margin: 0;
            font-weight: 600;
        }
        .balance-due {
            font-size: 1.6rem;
            font-weight: 700;
            color: var(--danger-color, #dc3545);
        }
        .payments-buttons {
            display: flex;
            gap: 10px;
        }

        /* --- Page Form Actions (Sticky Footer) --- */
        .page-form-actions {
            position: fixed;
            bottom: 0;
            right: 0;
            left: 250px; /* Assuming default sidebar width */
            padding: 15px 30px;
            background-color: var(--card-bg, #ffffff);
            border-top: 1px solid var(--border-color, #dee2e6);
            box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.05);
            display: flex;
            justify-content: flex-end; /* PUSH BUTTONS TO THE RIGHT */
            gap: 15px;
            z-index: 100;
        }
        .large-action-btn {
            padding: 12px 20px;
            font-size: 1rem;
            font-weight: 600;
            border-radius: var(--border-radius-base, 4px);
            cursor: pointer;
            min-width: 120px;
        }
        .btn-primary-action {
            background-color: #5d9cec; /* Primary blue for Save */
            color: white;
            border: none;
        }
        .btn-secondary-action {
            background-color: #f5f5f5; /* Light grey for Cancel */
            color: var(--text-color, #333);
            border: 1px solid var(--border-color-darker, #c3c7cb);
        }

    `;
    // --- END OF EMBEDDED STYLES ---

    // Placeholder data for the tables
    const parts = [
        { id: 1, description: 'Brake Rotor, Front', cost: 50.00, qty: 2, unit: 'EA', taxable: true, amount: 100.00 },
    ];
    const labor = [
        { id: 1, description: 'Brake Service - Front', type: 'Flat Rate', rate: 50.00, hours: 2.00, taxable: true, amount: 100.00 },
    ];

    return (
        <div className="page-content">
            {/* Embed the styles for a single-file solution */}
            <style>{pageStyles}</style>

            <div className="estimate-wrapper">
                
                {/* Client & Vehicle Header */}
                <div className="client-vehicle-header">
                    <div className="client-info">
                        <small>Client & Vehicle</small>
                        <h4>MR DEMO USER</h4>
                        <small>Estimate 1 | My Business & Logo</small>
                    </div>
                    <div className="vehicle-info">
                        <small>12-19-2025</small>
                        <h4>2024 1955 CUSTOM BELAIR</h4>
                    </div>
                </div>

                <div className="form-card">
                    {/* ------------------------------------------- */}
                    {/* SECTION 1: Inspect & Diagnose */}
                    {/* ------------------------------------------- */}
                    <div className="form-section-title">
                        Inspect & Diagnose
                    </div>
                    <div className="diag-grid">
                        <div className="diag-card">
                            <strong>Visual Inspection</strong>
                            <small>Start a multi-page inspection on any tablet or mobile device.</small>
                        </div>
                        <div className="diag-card">
                            <strong>System Function Check</strong>
                            <small>Check vehicle lights, wipers, and other functions.</small>
                        </div>
                        <div className="diag-card">
                            <strong>Labor Guides</strong>
                            <small>Access vehicle repair manuals and labor times.</small>
                        </div>
                    </div>

                    <div className="form-section-title" style={{marginTop: '40px'}}>
                        Integrations
                    </div>
                    <div className="placeholder-section">
                        Integration placeholders go here (e.g., CarFax, Tire Inventory)
                    </div>

                    {/* ------------------------------------------- */}
                    {/* SECTION 2: Parts and Labor */}
                    {/* ------------------------------------------- */}
                    <div className="form-section-title">
                        Parts and Labor
                    </div>
                    
                    <div className="tab-bar">
                        <button className="active">Detailed</button>
                        <button>Compact</button>
                        <button>Grouped</button>
                    </div>

                    {/* --- Parts Table --- */}
                    <h4 style={{marginTop: '0'}}>Parts</h4>
                    <table className="line-item-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Description</th>
                                <th>Cost</th>
                                <th>Price</th>
                                <th>Qty</th>
                                <th>Unit</th>
                                <th>Taxable</th>
                                <th className='right-align'>Amount</th>
                                <th>Save</th>
                            </tr>
                        </thead>
                        <tbody>
                            {parts.map((part) => (
                                <tr key={part.id}>
                                    <td>{part.id}</td>
                                    <td>{part.description}</td>
                                    <td>${part.cost.toFixed(2)}</td>
                                    <td>${part.cost.toFixed(2)}</td>
                                    <td>{part.qty}</td>
                                    <td>{part.unit}</td>
                                    <td>{part.taxable ? 'Yes' : 'No'}</td>
                                    <td className='right-align'>${part.amount.toFixed(2)}</td>
                                    <td><button className='btn-link'>...</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className='right-align' style={{marginBottom: '20px'}}>
                        <button className='btn-secondary-outline small-btn'>+ New Part</button>
                    </div>


                    {/* --- Labor Table --- */}
                    <h4>Labor</h4>
                    <table className="line-item-table">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Description</th>
                                <th>Labor Type</th>
                                <th>Rate</th>
                                <th>Hours</th>
                                <th>Fixed Amt</th>
                                <th>Taxable</th>
                                <th className='right-align'>Amount</th>
                                <th>Save</th>
                            </tr>
                        </thead>
                        <tbody>
                            {labor.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.description}</td>
                                    <td>{item.type}</td>
                                    <td>${item.rate.toFixed(2)}</td>
                                    <td>{item.hours.toFixed(2)} hrs</td>
                                    <td>-</td>
                                    <td>{item.taxable ? 'Yes' : 'No'}</td>
                                    <td className='right-align'>${item.amount.toFixed(2)}</td>
                                    <td><button className='btn-link'>...</button></td>
                                </tr>
                            ))}
                            <tr className='apply-btn-row'>
                                <td colSpan="9">
                                    <button className="apply-changes-btn">Apply Changes</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* ------------------------------------------- */}
                    {/* SECTION 3: Subtotal & Financial Summary */}
                    {/* ------------------------------------------- */}
                    <div className="subtotal-summary">
                        <strong>Subtotal: $200.00</strong> {/* Sum of Parts and Labor example */}
                        
                        <div className="financial-breakdown">
                            <button>Edit Other charges</button>
                            <button>Edit Taxes</button>
                            <button>Edit Discounts</button>
                        </div>

                        <div className="total-summary-grid">
                            <div className="summary-col">
                                <div className="summary-line"><span>Taxes:</span> <span>$0.00</span></div>
                                <div className="summary-line"><span>Discount:</span> <span>$0.00</span></div>
                                <div className="summary-line"><span>Other Charges:</span> <span>$0.00</span></div>
                                <div className="total-line">Total: <strong>$200.00</strong></div>
                            </div>
                            <div className="summary-col right-align">
                                <div className="summary-line"><span>Profit from Parts:</span> <span>$50.00</span></div>
                                <div className="summary-line"><span>Profit from Labor:</span> <span>$50.00</span></div>
                                <div className="summary-line"><span>Discount Subtraction:</span> <span>-$0.00</span></div>
                                <div className="total-line profit-line">Profit: <strong>$100.00</strong></div>
                            </div>
                        </div>
                    </div>
                </div> {/* End form-card */}


                <div className="form-card">
                    {/* ------------------------------------------- */}
                    {/* SECTION 4: Payments & Deposits */}
                    {/* ------------------------------------------- */}
                    <div className="form-section-title">
                        Payments & Deposits
                    </div>
                    <div className="payments-summary">
                        <div className="payments-buttons">
                            <button className='btn-secondary-action'>View Payments</button>
                        </div>
                        <div className="balance-due">
                            Balance Due: <strong>$200.00</strong>
                        </div>
                        <div className="payments-buttons">
                            <button className='btn-secondary-action'>Request a Deposit</button>
                        </div>
                    </div>
                </div>

                <div className="form-card">
                    {/* ------------------------------------------- */}
                    {/* SECTION 5: Attachments */}
                    {/* ------------------------------------------- */}
                    <div className="form-section-title">
                        Attachments
                    </div>
                    <div className="placeholder-section" style={{minHeight: '100px'}}>
                        Click to upload photos, files, or documents...
                    </div>
                </div>

                <div className="form-card">
                    {/* ------------------------------------------- */}
                    {/* SECTION 6: Warranty & Notes */}
                    {/* ------------------------------------------- */}
                    <div className="form-section-title">
                        Warranty & Notes
                        <button className='btn-link-icon'>Edit</button>
                    </div>
                    <p className="note-text">
                        Anything you enter here will be visible on the invoice.
                    </p>
                </div>

            </div> {/* End estimate-wrapper */}


            {/* ------------------------------------------- */}
            {/* STICKY FOOTER ACTIONS (Save/Cancel) */}
            {/* ------------------------------------------- */}
            <div className="page-form-actions">
                <button type="button" className="btn-secondary-action large-action-btn">
                    <span style={{marginRight: '5px'}}>❌</span> Cancel
                </button>
                <button type="submit" className="btn-primary-action large-action-btn">
                    <span style={{marginRight: '5px'}}>💾</span> Save Estimate
                </button>
            </div>
            
        </div>
    );
}

export default EstimatePage;