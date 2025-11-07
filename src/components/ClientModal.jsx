// src/components/ClientModal.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaTrash } from 'react-icons/fa';

const API_BASE_URL = 'http://127.0.0.1:8000/api/clients/';

export default function ClientModal({ show, onClose, clientToEdit, onSaved }) {
  const [clientData, setClientData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    vehicles: [],
  });

  useEffect(() => {
    if (clientToEdit) {
      setClientData({ ...clientToEdit });
    } else {
      setClientData({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        vehicles: [],
      });
    }
  }, [clientToEdit]);

  const handleChange = (e) => {
    setClientData({ ...clientData, [e.target.name]: e.target.value });
  };

  const handleVehicleChange = (index, field, value) => {
    const newVehicles = [...clientData.vehicles];
    newVehicles[index][field] = value;
    setClientData({ ...clientData, vehicles: newVehicles });
  };

  const addVehicle = () => {
    setClientData({
      ...clientData,
      vehicles: [...clientData.vehicles, { make: '', model: '', year: '', license_plate: '', vin: '' }],
    });
  };

  const removeVehicle = (index) => {
    const newVehicles = [...clientData.vehicles];
    newVehicles.splice(index, 1);
    setClientData({ ...clientData, vehicles: newVehicles });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      if (clientToEdit) {
        await axios.put(`${API_BASE_URL}${clientToEdit.id}/`, clientData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(API_BASE_URL, clientData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Error saving client.');
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-10 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 overflow-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-4">{clientToEdit ? 'Edit Client' : 'Add Client'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="first_name"
              value={clientData.first_name}
              onChange={handleChange}
              placeholder="First Name"
              className="border p-2 rounded"
              required
            />
            <input
              name="last_name"
              value={clientData.last_name}
              onChange={handleChange}
              placeholder="Last Name"
              className="border p-2 rounded"
              required
            />
            <input
              name="email"
              value={clientData.email}
              onChange={handleChange}
              placeholder="Email"
              type="email"
              className="border p-2 rounded"
            />
            <input
              name="phone_number"
              value={clientData.phone_number}
              onChange={handleChange}
              placeholder="Phone Number"
              className="border p-2 rounded"
            />
            <input
              name="address"
              value={clientData.address}
              onChange={handleChange}
              placeholder="Address"
              className="border p-2 rounded"
            />
            <input
              name="city"
              value={clientData.city}
              onChange={handleChange}
              placeholder="City"
              className="border p-2 rounded"
            />
            <input
              name="state"
              value={clientData.state}
              onChange={handleChange}
              placeholder="State"
              className="border p-2 rounded"
            />
            <input
              name="zip_code"
              value={clientData.zip_code}
              onChange={handleChange}
              placeholder="ZIP Code"
              className="border p-2 rounded"
            />
          </div>

          {/* Vehicles Section */}
          <div>
            <h3 className="font-semibold mb-2 flex items-center justify-between">
              Vehicles
              <button type="button" onClick={addVehicle} className="text-green-500 hover:text-green-700 flex items-center">
                <FaPlus className="mr-1" /> Add Vehicle
              </button>
            </h3>

            {clientData.vehicles.map((v, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-2 items-end">
                <input
                  placeholder="Make"
                  value={v.make}
                  onChange={(e) => handleVehicleChange(idx, 'make', e.target.value)}
                  className="border p-2 rounded"
                  required
                />
                <input
                  placeholder="Model"
                  value={v.model}
                  onChange={(e) => handleVehicleChange(idx, 'model', e.target.value)}
                  className="border p-2 rounded"
                  required
                />
                <input
                  placeholder="Year"
                  value={v.year}
                  type="number"
                  onChange={(e) => handleVehicleChange(idx, 'year', e.target.value)}
                  className="border p-2 rounded"
                  required
                />
                <input
                  placeholder="License Plate"
                  value={v.license_plate}
                  onChange={(e) => handleVehicleChange(idx, 'license_plate', e.target.value)}
                  className="border p-2 rounded"
                />
                <div className="flex space-x-2">
                  <input
                    placeholder="VIN"
                    value={v.vin}
                    onChange={(e) => handleVehicleChange(idx, 'vin', e.target.value)}
                    className="border p-2 rounded flex-1"
                    required
                  />
                  <button type="button" onClick={() => removeVehicle(idx)} className="text-red-500 hover:text-red-700">
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
