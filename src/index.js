import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 🛑 1. IMPORT the AuthProvider component
import { AuthProvider } from './context/AuthContext'; 
// Make sure the path './context/AuthContext' is correct based on where you placed the file!

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* 🛑 2. WRAP the App component with AuthProvider */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);