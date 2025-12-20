import { useInventory } from '../../context/InventoryContext';
import { useState } from 'react';

export default function ClientsPage() {
  const { clients, addClient, items } = useInventory();
  const [newClient, setNewClient] = useState('');

  const handleAdd = () => {
      if(newClient) {
          addClient({ name: newClient });
          setNewClient('');
      }
  };

  const getClientHistory = (clientId) => {
      // Logic relies on soldTo matching clientId (or client name if fallback used)
      return items.filter(i => i.soldTo === clientId || i.soldTo === clients.find(c => c.id === clientId)?.name);
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h2 className="title" style={{ marginBottom: '1.5rem' }}>Clientes</h2>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '2rem' }}>
            <input placeholder="Novo Cliente" value={newClient} onChange={e => setNewClient(e.target.value)} style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: 'none', color: '#fff' }} />
             <button onClick={handleAdd} style={{ padding: '0 1rem', background: 'var(--accent-primary)', color: '#000', borderRadius: '8px', border: 'none' }}>+</button>
        </div>

        <div style={{ display: 'grid', gap: '1rem' }}>
            {clients.map(client => {
                const history = getClientHistory(client.id);
                const totalSpent = history.reduce((acc, i) => acc + (Number(i.soldPrice) || 0), 0);

                return (
                    <div key={client.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{client.name}</div>
                            <div style={{ color: 'var(--accent-primary)' }}>Total: {totalSpent}€</div>
                        </div>
                        {history.length > 0 && (
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                                Comprou: {history.map(i => i.brand).join(', ')}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    </div>
  );
}
