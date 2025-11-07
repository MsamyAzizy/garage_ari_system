// src/components/LoadingScreen.js - Updated to use dark background for consistency

import React from 'react';

const LoadingScreen = () => {
  return (
    // Uses the .loading-overlay class, with inline style to enforce dark background
    <div className="loading-overlay" style={{ backgroundColor: '#242424' }}>
      <div className="spinner"></div>
      {/* We use an explicit color here, as the dark overlay overrides 
        the standard theme variables. We need a visible text color.
      */}
      <p style={{ color: '#e2e6e9', marginTop: '15px', fontSize: '1.1rem' }}>
        Loading Shop Dashboard...
      </p>
    </div>
  );
};

export default LoadingScreen;