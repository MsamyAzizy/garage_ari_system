// src/components/SearchBar.js

import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

// Define theme colors for consistency
const PRIMARY_BLUE = '#5d9cec';
const LIGHT_BACKGROUND = '#ffffff'; 
const BG_CARD_DARK = '#2c3848'; // Use your application's dark background color
const INPUT_BORDER_DARK = '#38465b'; // Use the border/input background color for dark theme
const INPUT_TEXT_DARK = '#ffffff'; 
const INPUT_TEXT_LIGHT = '#333333';
const PLACEHOLDER_DARK = '#aeb8c8'; 
const PLACEHOLDER_LIGHT = '#888888'; 

/**
 * A reusable search bar component with integrated styles.
 * @param {function} onSearch - Function to call when the user submits a search.
 * @param {string} placeholder - Placeholder text for the input field.
 */
const SearchBar = ({ onSearch, placeholder = "Search clients, vehicles, or jobs..." }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(searchTerm.trim());
        }
    };

    return (
        <form className="search-bar-form-v2" onSubmit={handleSubmit}>
            
            {/* Wrapper for the Search Icon and Input */}
            <div className="input-field-wrapper-v2">
                {/* Search Icon moved inside the input area */}
                <FaSearch className="search-icon-inline-v2" /> 
                <input
                    type="text"
                    className="search-input-v2"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            {/* Button changed to display text "Search" */}
            <button type="submit" className="search-button-v2" aria-label="Search">
                Search 
            </button>
            
            <style jsx>{`
                /* ----------------------------------------------------------------- */
                /* MODERN SEARCH BAR STYLES (Supports Dark Mode) */
                /* ----------------------------------------------------------------- */
                
                /* Container/Form */
                .search-bar-form-v2 {
                    display: flex;
                    align-items: center;
                    max-width: 450px; 
                    margin-left: 20px;
                    border: 1px solid #cccccc; 
                    border-radius: 8px; /* Softer, modern radius */
                    overflow: hidden;
                    height: 40px; /* Slightly taller */
                    background-color: ${LIGHT_BACKGROUND};
                    transition: border-color 0.2s, background-color 0.2s;
                }
                
                /* Focus state applies a strong blue border */
                .search-bar-form-v2:focus-within {
                    border-color: ${PRIMARY_BLUE}; 
                    box-shadow: 0 0 0 2px rgba(93, 156, 236, 0.3); /* Subtle blue glow */
                }

                /* Input Field Wrapper (Handles the icon) */
                .input-field-wrapper-v2 {
                    flex-grow: 1;
                    display: flex;
                    align-items: center;
                    padding: 0 15px;
                }

                /* Search Icon (Inside Input) */
                .search-icon-inline-v2 {
                    font-size: 16px;
                    color: ${PLACEHOLDER_LIGHT};
                    margin-right: 10px;
                }
                
                /* Input Field */
                .search-input-v2 {
                    flex-grow: 1;
                    padding: 8px 0;
                    border: none;
                    outline: none;
                    font-size: 15px;
                    background-color: transparent; 
                    color: ${INPUT_TEXT_LIGHT};
                }

                .search-input-v2::placeholder {
                    color: ${PLACEHOLDER_LIGHT};
                }

                /* Search Button */
                .search-button-v2 {
                    background-color: ${PRIMARY_BLUE}; /* Use Primary Blue for button */
                    border: none;
                    padding: 0 20px;
                    cursor: pointer;
                    color: #ffffff; 
                    font-size: 15px;
                    font-weight: 600; /* Bolder text */
                    height: 100%;
                    border-radius: 0 8px 8px 0; /* Match container radius */
                    transition: background-color 0.2s ease;
                    white-space: nowrap;
                    margin-left: -1px; /* Overlap border for clean join */
                }

                .search-button-v2:hover {
                    background-color: #4a90e2; 
                }
                
                /* ----------------------------------------------------------------- */
                /* DARK MODE ADAPTATION */
                /* ----------------------------------------------------------------- */
                
                body.dark-theme .search-bar-form-v2 {
                    background-color: ${BG_CARD_DARK};
                    border-color: ${INPUT_BORDER_DARK}; 
                }
                
                body.dark-theme .search-bar-form-v2:focus-within {
                    border-color: ${PRIMARY_BLUE};
                }
                
                body.dark-theme .search-input-v2 {
                    color: ${INPUT_TEXT_DARK}; 
                }

                body.dark-theme .search-input-v2::placeholder {
                    color: ${PLACEHOLDER_DARK};
                }

                body.dark-theme .search-icon-inline-v2 {
                    color: ${PLACEHOLDER_DARK};
                }
            `}</style>
        </form>
    );
};

export default SearchBar;