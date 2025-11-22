// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUsers, FaClipboardList, FaBoxOpen } from 'react-icons/fa';

const API_BASE = 'http://127.0.0.1:8000/api';

export default function Dashboard() {
  const [clients, setClients] = useState([]);
  const [jobcards, setJobcards] = useState([]);
  const [inventory, setInventory] = useState([]);

  const token = localStorage.getItem('access_token'); // Assuming you store JWT in localStorage

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    // Fetch clients
    axios.get(`${API_BASE}/clients/`, config).then(res => setClients(res.data.results));
    
    // Fetch jobcards
    axios.get(`${API_BASE}/jobcards/`, config).then(res => setJobcards(res.data.results));
    
    // Fetch inventory parts
    axios.get(`${API_BASE}/inventory/parts/`, config).then(res => setInventory(res.data.results));
  }, [config]); // <-- FIX: 'config' added here

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow rounded p-6 flex items-center space-x-4">
          <FaUsers className="text-4xl text-blue-500" />
          <div>
            <p className="text-gray-500">Total Clients</p>
            <p className="text-2xl font-bold">{clients.length}</p>
          </div>
        </div>
        <div className="bg-white shadow rounded p-6 flex items-center space-x-4">
          <FaClipboardList className="text-4xl text-green-500" />
          <div>
            <p className="text-gray-500">Open Job Cards</p>
            <p className="text-2xl font-bold">
              {jobcards.filter(j => j.status !== 'CLOSED' && j.status !== 'PAID').length}
            </p>
          </div>
        </div>
        <div className="bg-white shadow rounded p-6 flex items-center space-x-4">
          <FaBoxOpen className="text-4xl text-yellow-500" />
          <div>
            <p className="text-gray-500">Inventory Items</p>
            <p className="text-2xl font-bold">{inventory.length}</p>
          </div>
        </div>
      </div>

      {/* Recent Clients Table */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Recent Clients</h2>
        <div className="bg-white shadow rounded overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Email</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Phone</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.map(c => (
                <tr key={c.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{c.full_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{c.email || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{c.phone_number || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Job Cards Table */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Recent Job Cards</h2>
        <div className="bg-white shadow rounded overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Job #</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Client</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Vehicle</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jobcards.map(j => (
                <tr key={j.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{j.job_number}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{j.client_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{j.vehicle_info}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{j.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}