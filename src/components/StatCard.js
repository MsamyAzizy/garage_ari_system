// src/components/StatCard.js

import React from 'react';
// We only need FaArrowUp/Down for the change indicator
import { FaArrowUp, FaArrowDown } from 'react-icons/fa'; 

/**
 * A reusable component to display a key metric with a change indicator.
 * @param {string} title - The title of the metric (e.g., 'Total Revenue').
 * @param {string} value - The current metric value (e.g., '$15,450').
 * @param {number} change - Percentage change since last period (positive or negative).
 * @param {string} unit - The time unit for the change (e.g., 'since last month').
 */
const StatCard = ({ title, value, change, unit }) => {
    
    // Determine color and icon based on change value
    // Assuming change can be positive, negative, or zero
    const isPositive = change > 0;
    const isZero = change === 0;
    
    const changeClass = isPositive ? 'change-positive' : 
                        !isZero ? 'change-negative' : 
                        'change-neutral';

    // Decide which icon to show (only show arrow if not zero)
    const ChangeIcon = isPositive ? FaArrowUp : FaArrowDown;
    
    // Format the change percentage
    const changeText = Math.abs(change).toFixed(1) + '%';

    return (
        <div className="stat-card">
            <p className="stat-title">{title}</p>
            <h3 className="stat-value">{value}</h3>
            {/* Display change indicator only if change is not zero */}
            {!isZero && (
                <div className={`stat-change ${changeClass}`}>
                    <ChangeIcon />
                    <span>{changeText}</span>
                    <span className="stat-unit">{unit}</span>
                </div>
            )}
            {/* Handle zero change case (e.g., for 'since last month' unit) */}
            {isZero && (
                 <div className="stat-change change-neutral">
                    <span>No change</span>
                    <span className="stat-unit">{unit}</span>
                 </div>
            )}
        </div>
    );
};

export default StatCard;