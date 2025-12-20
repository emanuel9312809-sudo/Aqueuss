import { createContext, useContext, useState, useEffect } from 'react';

const InventoryContext = createContext();

export const useInventory = () => useContext(InventoryContext);

export const InventoryProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const loadedItems = localStorage.getItem('business_items');
    const loadedClients = localStorage.getItem('business_clients');
    if (loadedItems) setItems(JSON.parse(loadedItems));
    if (loadedClients) setClients(JSON.parse(loadedClients));
  }, []);

  useEffect(() => {
    localStorage.setItem('business_items', JSON.stringify(items));
    localStorage.setItem('business_clients', JSON.stringify(clients));
  }, [items, clients]);

  const addItem = (item) => {
    const newItem = { ...item, id: Date.now().toString(), status: item.status || 'available', dateAdded: new Date().toISOString() };
    setItems(prev => [newItem, ...prev]);
  };

  const updateItem = (id, updates) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const sellItem = (itemId, saleDetails) => {
    updateItem(itemId, { 
        status: 'sold', 
        soldPrice: Number(saleDetails.finalPrice), 
        soldDate: new Date().toISOString(),
        soldTo: saleDetails.clientId 
    });
  };

  const addClient = (client) => {
    const newClient = { ...client, id: Date.now().toString(), joined: new Date().toISOString() };
    setClients(prev => [...prev, newClient]);
  };

  return (
    <InventoryContext.Provider value={{ items, clients, addItem, updateItem, sellItem, addClient }}>
      {children}
    </InventoryContext.Provider>
  );
};
