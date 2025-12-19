// src/context/InventoryContext.js
import React, { createContext, useState, useContext } from 'react';

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  const [inventory, setInventory] = useState([]);

  const addItem = (item) => {
    const newItem = {
      id: Date.now(),
      ...item,
      createdAt: new Date().toISOString()
    };
    setInventory(prev => [...prev, newItem]);
    return newItem;
  };

  const updateItem = (id, updatedData) => {
    setInventory(prev => 
      prev.map(item => 
        item.id === id ? { ...item, ...updatedData } : item
      )
    );
  };

  const deleteItem = (id) => {
    setInventory(prev => prev.filter(item => item.id !== id));
  };

  return (
    <InventoryContext.Provider value={{
      inventory,
      addItem,
      updateItem,
      deleteItem
    }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);