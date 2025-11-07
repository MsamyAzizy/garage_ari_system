// src/components/Layout.jsx
import React, { useState } from 'react';
import { FaTachometerAlt, FaUsers, FaClipboardList, FaBoxOpen, FaBars } from 'react-icons/fa';
import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* Sidebar */}
      <aside className={`bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute md:relative transition-all ${sidebarOpen ? 'left-0' : '-left-64'}`}>
        <h1 className="text-2xl font-bold text-center">ARI Garage</h1>
        <nav className="mt-10">
          <Link to="/dashboard" className="flex items-center px-4 py-2 hover:bg-gray-700 rounded mb-2">
            <FaTachometerAlt className="mr-3" /> Dashboard
          </Link>
          <Link to="/clients" className="flex items-center px-4 py-2 hover:bg-gray-700 rounded mb-2">
            <FaUsers className="mr-3" /> Clients
          </Link>
          <Link to="/jobcards" className="flex items-center px-4 py-2 hover:bg-gray-700 rounded mb-2">
            <FaClipboardList className="mr-3" /> Job Cards
          </Link>
          <Link to="/inventory" className="flex items-center px-4 py-2 hover:bg-gray-700 rounded mb-2">
            <FaBoxOpen className="mr-3" /> Inventory
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        
        {/* Top Navbar */}
        <header className="flex items-center justify-between bg-white shadow p-4">
          <button onClick={toggleSidebar} className="text-gray-700 md:hidden">
            <FaBars size={24} />
          </button>
          <div className="flex items-center space-x-4">
            <span className="font-semibold">Admin User</span>
            <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Logout</button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet /> {/* Nested route pages will render here */}
        </main>
      </div>
    </div>
  );
}
