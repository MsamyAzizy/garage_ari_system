// src/components/PartModal.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTimes, FaSave } from 'react-icons/fa';

const API_BASE_URL = 'http://127.0.0.1:8000/api/inventory/parts/';

export default function PartModal({ show, onClose, partToEdit, categories, vendors, onSaved }) {
  const token = localStorage.getItem('access_token');
  const headers = { Authorization: `Bearer ${token}` };

  const [form, setForm] = useState({
    name: '',
    sku: '',
    category: '',
    vendor: '',
    cost_price: '',
    sale_price: '',
    stock_qty: '',
    critical_qty: '',
    is_active: true,
  });

  useEffect(() => {
    if (partToEdit) {
      setForm({
        name: partToEdit.name || '',
        sku: partToEdit.sku || '',
        category: partToEdit.category || '',
        vendor: partToEdit.vendor || '',
        cost_price: partToEdit.cost_price || '',
        sale_price: partToEdit.sale_price || '',
        stock_qty: partToEdit.stock_qty || '',
        critical_qty: partToEdit.critical_qty || '',
        is_active: partToEdit.is_active !== undefined ? partToEdit.is_active : true,
      });
    } else {
      setForm({
        name: '',
        sku: '',
        category: '',
        vendor: '',
        cost_price: '',
        sale_price: '',
        stock_qty: '',
        critical_qty: '',
        is_active: true,
      });
    }
  }, [partToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (partToEdit) {
        await axios.put(`${API_BASE_URL}${partToEdit.id}/`, form, { headers });
      } else {
        await axios.post(API_BASE_URL, form, { headers });
      }
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Error saving part. Check the fields.');
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded shadow-lg w-96 p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          <FaTimes />
        </button>
        <h2 className="text-xl font-bold mb-4">
          {partToEdit ? 'Edit Part' : 'Add New Part'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="name"
            placeholder="Part Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            name="sku"
            placeholder="SKU / Part Number"
            value={form.sku}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            name="vendor"
            value={form.vendor}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select Vendor</option>
            {vendors.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>

          <input
            type="number"
            step="0.01"
            name="cost_price"
            placeholder="Cost Price"
            value={form.cost_price}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <input
            type="number"
            step="0.01"
            name="sale_price"
            placeholder="Sale Price"
            value={form.sale_price}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <input
            type="number"
            name="stock_qty"
            placeholder="Stock Quantity"
            value={form.stock_qty}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <input
            type="number"
            name="critical_qty"
            placeholder="Critical Quantity"
            value={form.critical_qty}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
            />
            <span>Active</span>
          </label>

          <button
            type="submit"
            className="flex items-center justify-center w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            <FaSave className="mr-2" /> Save
          </button>
        </form>
      </div>
    </div>
  );
}
