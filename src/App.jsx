// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ClientsPage from './pages/ClientsPage';
import JobCardsPage from './pages/JobCardsPage';
import InventoryPage from './pages/InventoryPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="jobcards" element={<JobCardsPage />} />
          <Route path="inventory" element={<InventoryPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
