// src/pages/ClientsPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ClientModal from '../components/ClientModal';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const API_BASE_URL = 'http://127.0.0.1:8000/api/clients/';

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [clientToEdit, setClientToEdit] = useState(null);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.get(API_BASE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClients(res.data);
    } catch (err) {
      console.error(err);
      alert('Error fetching clients.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleAdd = () => {
    setClientToEdit(null);
    setShowModal(true);
  };

  const handleEdit = (client) => {
    setClientToEdit(client);
    setShowModal(true);
  };

  const handleDelete = async (clientId) => {
    if (!window.confirm('Are you sure you want to delete this client?')) return;
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`${API_BASE_URL}${clientId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchClients();
    } catch (err) {
      console.error(err);
      alert('Error deleting client.');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Clients</h1>
        <button
          onClick={handleAdd}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <FaPlus className="mr-2" /> Add Client
        </button>
      </div>

      {loading ? (
        <p>Loading clients...</p>
      ) : (
        <table className="w-full border-collapse shadow rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Vehicles</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50">
                <td className="p-2 border">{client.full_name}</td>
                <td className="p-2 border">{client.email}</td>
                <td className="p-2 border">{client.phone_number}</td>
                <td className="p-2 border">
                  {client.vehicles?.map((v) => (
                    <div key={v.id}>
                      {v.make} {v.model} ({v.license_plate || 'N/A'})
                    </div>
                  ))}
                </td>
                <td className="p-2 border space-x-2">
                  <button
                    onClick={() => handleEdit(client)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(client.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <ClientModal
        show={showModal}
        onClose={() => setShowModal(false)}
        clientToEdit={clientToEdit}
        onSaved={fetchClients}
      />
    </div>
  );
}
