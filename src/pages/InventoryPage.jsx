// src/pages/InventoryPage.jsx
import React, { useEffect, useState, useCallback } from 'react'; // <-- FIX 1: Import useCallback
import axios from 'axios';
import PartModal from '../components/PartModal';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const API_BASE_URL = 'http://127.0.0.1:8000/api/inventory/parts/';
const CATEGORY_URL = 'http://127.0.0.1:8000/api/inventory/categories/';
const VENDOR_URL = 'http://127.0.0.1:8000/api/inventory/vendors/';

export default function InventoryPage() {
  const [parts, setParts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [partToEdit, setPartToEdit] = useState(null);

  const token = localStorage.getItem('access_token');
  // Define 'headers'
  const headers = { Authorization: `Bearer ${token}` };

  // FIX 2: Wrap fetchData in useCallback.
  // We need to include 'headers' in useCallback's dependency array 
  // because it uses the 'headers' object defined above.
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [partsRes, catRes, venRes] = await Promise.all([
        axios.get(API_BASE_URL, { headers }),
        axios.get(CATEGORY_URL, { headers }),
        axios.get(VENDOR_URL, { headers }),
      ]);
      setParts(partsRes.data.results || partsRes.data);
      setCategories(catRes.data.results || catRes.data);
      setVendors(venRes.data.results || venRes.data);
    } catch (err) {
      console.error(err);
      alert('Error fetching inventory data.');
    }
    setLoading(false);
  }, [headers]); // <-- FIX 3: 'headers' is a dependency of useCallback

  // FIX 4: Add fetchData to useEffect's dependency array (Line 42)
  useEffect(() => {
    fetchData();
  }, [fetchData]); // <-- FIX 4: 'fetchData' is now a dependency

  const handleAdd = () => {
    setPartToEdit(null);
    setShowModal(true);
  };

  const handleEdit = (part) => {
    setPartToEdit(part);
    setShowModal(true);
  };

  // Note: handleDelete also uses 'headers' and 'fetchData', 
  // so it should ideally be wrapped in useCallback as well for consistency.
  const handleDelete = async (partId) => {
    if (!window.confirm('Are you sure you want to delete this part?')) return;
    try {
      await axios.delete(`${API_BASE_URL}${partId}/`, { headers });
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Error deleting part.');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Inventory Parts</h1>
        <button
          onClick={handleAdd}
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          <FaPlus className="mr-2" /> Add Part
        </button>
      </div>

      {loading ? (
        <p>Loading inventory...</p>
      ) : (
        <table className="w-full border-collapse shadow rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">SKU</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Vendor</th>
              <th className="p-2 border">Stock</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {parts.map((part) => (
              <tr key={part.id} className="hover:bg-gray-50">
                <td className="p-2 border">{part.sku}</td>
                <td className="p-2 border">{part.name}</td>
                <td className="p-2 border">{part.category_name}</td>
                <td className="p-2 border">{part.vendor_name}</td>
                <td className="p-2 border">{part.stock_qty}</td>
                <td className="p-2 border">{part.sale_price}</td>
                <td className="p-2 border space-x-2">
                  <button
                    onClick={() => handleEdit(part)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(part.id)}
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

      <PartModal
        show={showModal}
        onClose={() => setShowModal(false)}
        partToEdit={partToEdit}
        categories={categories}
        vendors={vendors}
        onSaved={fetchData}
      />
    </div>
  );
}