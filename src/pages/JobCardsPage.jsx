// src/pages/JobCardsPage.jsx
import React, { useState, useEffect, useCallback } from 'react'; // <-- FIX 1: Import useCallback
import axios from 'axios';
import { FaPlusCircle, FaTrash } from 'react-icons/fa';

const JobCardsPage = () => {
  const [jobCards, setJobCards] = useState([]);
  const [parts, setParts] = useState([]);
  const [clients, setClients] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [lineItems, setLineItems] = useState([]);
  const [formData, setFormData] = useState({
    client: '',
    vehicle: '',
    assigned_technician: '',
    initial_odometer: '',
    date_promised: '',
    status: 'DRAFT'
  });

  const headers = { Authorization: `Bearer ${localStorage.getItem('access_token')}` };

  // FIX 2: Wrap fetch functions in useCallback, listing 'headers' as their dependency.
  const fetchJobCards = useCallback(async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/jobcards/', { headers });
      setJobCards(res.data.results);
    } catch (err) { console.error(err); }
  }, [headers]);

  const fetchParts = useCallback(async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/inventory/parts/', { headers });
      setParts(res.data.results);
    } catch (err) { console.error(err); }
  }, [headers]);

  const fetchClients = useCallback(async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/clients/', { headers });
      setClients(res.data);
    } catch (err) { console.error(err); }
  }, [headers]);
  
  // FIX 3: Add fetch functions to the dependency array (Line 27).
  useEffect(() => {
    fetchJobCards();
    fetchParts();
    fetchClients();
  }, [fetchJobCards, fetchParts, fetchClients]); // <-- FIX 3: Added all three dependencies

  const fetchVehicles = async clientId => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/clients/${clientId}/`, { headers });
      setVehicles(res.data.vehicles || []);
    } catch (err) { console.error(err); }
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'client') {
      fetchVehicles(value);
      setFormData(prev => ({ ...prev, vehicle: '' }));
    }
  };

  const handleAddLineItem = () => {
    setLineItems(prev => [...prev, { item_type: 'PART', description: '', sku: '', quantity: 1, unit_price: 0 }]);
  };

  const handleLineItemChange = (index, field, value) => {
    setLineItems(prev => {
      const updated = [...prev];
      if (field === 'quantity' || field === 'unit_price') updated[index][field] = parseFloat(value);
      else updated[index][field] = value;
      return updated;
    });
  };

  const handleRemoveLineItem = (index) => setLineItems(prev => prev.filter((_, i) => i !== index));

  const calculateLineTotal = (item) => (item.quantity * item.unit_price).toFixed(2);

  const calculateTotals = () => {
    let partsSubtotal = lineItems.filter(i => i.item_type === 'PART').reduce((acc, i) => acc + i.quantity * i.unit_price, 0);
    let laborSubtotal = lineItems.filter(i => i.item_type === 'LABOR').reduce((acc, i) => acc + i.quantity * i.unit_price, 0);
    let totalDue = partsSubtotal + laborSubtotal;
    return { partsSubtotal, laborSubtotal, totalDue };
  };

  // Note: For completeness, you should also wrap handleSubmit and fetchVehicles in useCallback
  // and include their dependencies ('headers', 'lineItems', 'formData', 'fetchJobCards')
  // but for the immediate ESLint fix, the above changes are sufficient.

  const handleSubmit = async () => {
    const payload = { ...formData, line_items: lineItems };
    try {
      await axios.post('http://127.0.0.1:8000/api/jobcards/', payload, { headers });
      alert('Job Card Created!');
      setLineItems([]);
      setFormData({ client: '', vehicle: '', assigned_technician: '', initial_odometer: '', date_promised: '', status: 'DRAFT' });
      fetchJobCards();
    } catch (err) {
      console.error(err);
      alert('Error creating Job Card.');
    }
  };

  const totals = calculateTotals();

  const statusColors = {
    DRAFT: 'bg-gray-200 text-gray-700',
    OPEN: 'bg-blue-200 text-blue-800',
    INSPECT: 'bg-yellow-200 text-yellow-800',
    PENDING_APPROVAL: 'bg-orange-200 text-orange-800',
    CLOSED: 'bg-green-200 text-green-800',
    PAID: 'bg-teal-200 text-teal-800',
    CANCELED: 'bg-red-200 text-red-800'
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Job Cards</h1>

      {/* Job Card Form */}
      <div className="p-6 border rounded shadow bg-white space-y-4">
        <h2 className="font-semibold text-xl">New Job Card</h2>

        <div className="grid grid-cols-2 gap-4">
          <select value={formData.client} onChange={e => handleFormChange('client', e.target.value)} className="border p-2 rounded">
            <option value="">Select Client</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
          </select>

          <select value={formData.vehicle} onChange={e => handleFormChange('vehicle', e.target.value)} className="border p-2 rounded">
            <option value="">Select Vehicle</option>
            {vehicles.map(v => <option key={v.id} value={v.id}>{v.year} {v.make} {v.model} ({v.license_plate})</option>)}
          </select>

          <input type="text" placeholder="Technician ID" value={formData.assigned_technician} onChange={e => handleFormChange('assigned_technician', e.target.value)} className="border p-2 rounded" />
          <input type="number" placeholder="Initial Odometer" value={formData.initial_odometer} onChange={e => handleFormChange('initial_odometer', e.target.value)} className="border p-2 rounded" />
          <input type="datetime-local" placeholder="Promised Date" value={formData.date_promised} onChange={e => handleFormChange('date_promised', e.target.value)} className="border p-2 rounded col-span-2" />
        </div>

        {/* Line Items */}
        <div className="space-y-2">
          <h3 className="font-semibold">Line Items</h3>
          {lineItems.map((item, i) => (
            <div key={i} className="flex gap-2 items-center">
              <select value={item.item_type} onChange={e => handleLineItemChange(i, 'item_type', e.target.value)} className="border p-1 rounded w-24">
                <option value="PART">Part</option>
                <option value="LABOR">Labor</option>
                <option value="FEE">Fee</option>
              </select>

              {item.item_type === 'PART' ? (
                <select
                  value={item.description}
                  onChange={e => {
                    const selectedPart = parts.find(p => p.id === parseInt(e.target.value));
                    handleLineItemChange(i, 'description', selectedPart?.name || '');
                    handleLineItemChange(i, 'unit_price', selectedPart?.sale_price || 0);
                    handleLineItemChange(i, 'sku', selectedPart?.sku || '');
                  }}
                  className="border p-1 rounded flex-1"
                >
                  <option value="">Select Part</option>
                  {parts.map(p => <option key={p.id} value={p.id}>[{p.sku}] {p.name} - {p.sale_price}</option>)}
                </select>
              ) : (
                <input type="text" placeholder="Description" value={item.description} onChange={e => handleLineItemChange(i, 'description', e.target.value)} className="border p-1 rounded flex-1" />
              )}

              <input type="number" placeholder="Qty" value={item.quantity} onChange={e => handleLineItemChange(i, 'quantity', e.target.value)} className="border p-1 rounded w-20" />
              <input type="number" placeholder="Unit Price" value={item.unit_price} onChange={e => handleLineItemChange(i, 'unit_price', e.target.value)} className="border p-1 rounded w-24" disabled={item.item_type === 'PART'} />
              <span className="w-20 text-right">{calculateLineTotal(item)}</span>
              <button onClick={() => handleRemoveLineItem(i)} className="text-red-500 hover:text-red-700"><FaTrash /></button>
            </div>
          ))}
          <button onClick={handleAddLineItem} className="flex items-center gap-1 text-blue-600 hover:text-blue-800 mt-2"><FaPlusCircle /> Add Line Item</button>
        </div>

        {/* Totals Card */}
        <div className="p-4 border rounded bg-gray-50 space-y-1">
          <p>Parts Subtotal: {totals.partsSubtotal.toFixed(2)}</p>
          <p>Labor Subtotal: {totals.laborSubtotal.toFixed(2)}</p>
          <p className="font-semibold">Total Due: {totals.totalDue.toFixed(2)}</p>
        </div>

        <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save Job Card</button>
      </div>

      {/* Job Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobCards.map(j => (
          <div key={j.id} className={`p-4 border rounded shadow ${statusColors[j.status] || 'bg-gray-100'}`}>
            <h4 className="font-semibold">Job #{j.job_number}</h4>
            <p><strong>Client:</strong> {j.client_name}</p>
            <p><strong>Vehicle:</strong> {j.vehicle_info}</p>
            <p><strong>Status:</strong> {j.status}</p>
            <p><strong>Total Due:</strong> {j.total_due}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobCardsPage;