import { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { useWallet } from '../../context/WalletContext';
import { Plus, X } from 'lucide-react';

export default function StockPage() {
  const { items, addItem, sellItem, clients, addClient } = useInventory();
  const { addTransaction, accounts } = useWallet();

  const [view, setView] = useState('list');
  const [sellingItem, setSellingItem] = useState(null);

  // Add Form State
  const [newBrand, setNewBrand] = useState('');
  const [newModel, setNewModel] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newStatus, setNewStatus] = useState('available');

  // Sell Form State
  const [salePrice, setSalePrice] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [newClientName, setNewClientName] = useState('');
  const [targetAccount, setTargetAccount] = useState('');

  const handleAddItem = () => {
    if (newBrand && newPrice) {
        addItem({ brand: newBrand, model: newModel, buyPrice: Number(newPrice), status: newStatus });
        setNewModel('');
        setNewPrice('');
    }
  };

  const handleSell = () => {
      if (!salePrice) return;
      
      let clientId = selectedClient;
      if (!clientId && newClientName) {
          clientId = newClientName; // Simple string for now
          addClient({ name: newClientName }); 
      }
      
      sellItem(sellingItem.id, {
          finalPrice: salePrice,
          clientId: clientId || 'Unknown',
          accountId: targetAccount
      });

      if (targetAccount) {
        addTransaction({
            amount: Number(salePrice),
            type: 'INCOME',
            category: 'Negócio (Relógios)',
            note: `Venda: ${sellingItem.brand} ${sellingItem.model}`,
            accountId: targetAccount,
            date: new Date().toISOString()
        });
      }

      setSellingItem(null);
      setView('list');
      setSalePrice('');
  };

  const availableItems = items.filter(i => i.status !== 'sold');

  const inputStyle = {
    padding: '1rem', borderRadius: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', width: '100%'
  };

  const primaryBtnStyle = {
    padding: '1rem', borderRadius: '12px', background: 'var(--accent-primary)', color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem', width: '100%'
  };

  return (
    <div className="glass-panel" style={{ padding: '1rem', paddingBottom: '3rem' }}>
        
        {view === 'list' && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 className="title">Estoque ({availableItems.length})</h2>
                <button 
                    onClick={() => setView('add')}
                    style={{ background: 'var(--accent-primary)', color: '#000', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 0 15px var(--accent-primary)' }}
                >
                    <Plus size={24} />
                </button>
            </div>
        )}

        {view === 'list' && (
            <div style={{ display: 'grid', gap: '1rem' }}>
                {availableItems.map(item => (
                    <div key={item.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{item.brand}</span>
                                <span style={{ fontSize: '0.8rem', background: item.status === 'available' ? '#00FF94' : '#FF9F40', color: '#000', padding: '2px 6px', borderRadius: '4px' }}>
                                    {item.status === 'available' ? 'Disp.' : item.status === 'ordered' ? 'Enc.' : 'Res.'}
                                </span>
                            </div>
                            <div style={{ color: 'var(--text-secondary)' }}>{item.model}</div>
                            <div style={{ fontSize: '0.9rem', color: '#aaa', marginTop: '4px' }}>Custo: {item.buyPrice} €</div>
                        </div>
                        <button 
                            onClick={() => { setSellingItem(item); setView('sell'); }}
                            style={{ background: 'var(--glass-bg)', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}
                        >
                            Vender
                        </button>
                    </div>
                ))}
            </div>
        )}

        {view === 'add' && (
            <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h3>Novo Item</h3>
                    <button onClick={() => setView('list')} style={{ background: 'none', border: 'none', color: '#fff' }}><X /></button>
                </div>
                <div style={{ display: 'grid', gap: '1rem' }}>
                    <input placeholder="Marca (ex: Rolex)" value={newBrand} onChange={e => setNewBrand(e.target.value)} style={inputStyle} />
                    <input placeholder="Modelo (ex: Submariner)" value={newModel} onChange={e => setNewModel(e.target.value)} style={inputStyle} />
                    <input placeholder="Preço de Custo (€)" type="number" value={newPrice} onChange={e => setNewPrice(e.target.value)} style={inputStyle} />
                    
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {['available', 'ordered', 'reserved'].map(s => (
                            <button 
                                key={s} 
                                onClick={() => setNewStatus(s)}
                                style={{ 
                                    flex: 1, 
                                    padding: '0.8rem', 
                                    borderRadius: '8px', 
                                    border: newStatus === s ? '1px solid var(--accent-primary)' : '1px solid #333',
                                    background: newStatus === s ? 'rgba(0, 229, 255, 0.1)' : 'transparent',
                                    color: newStatus === s ? 'var(--accent-primary)' : '#666'
                                }}
                            >
                                {s === 'available' ? 'Disp' : s === 'ordered' ? 'Encom' : 'Reser'}
                            </button>
                        ))}
                    </div>

                    <button onClick={handleAddItem} style={primaryBtnStyle}>Adicionar ao Estoque</button>
                </div>
            </div>
        )}

        {view === 'sell' && sellingItem && (
             <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h3>Vender {sellingItem.brand}</h3>
                    <button onClick={() => { setSellingItem(null); setView('list'); }} style={{ background: 'none', border: 'none', color: '#fff' }}><X /></button>
                </div>
                
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px', marginBottom: '1rem' }}>
                    <div>Custo: {sellingItem.buyPrice} €</div>
                    <div style={{ fontSize: '1.2rem', marginTop: '10px', color: 'var(--accent-primary)' }}>
                        Lucro Est.: {salePrice ? (Number(salePrice) - sellingItem.buyPrice).toFixed(2) : 0} €
                    </div>
                </div>

                <div style={{ display: 'grid', gap: '1rem' }}>
                    <label>Preço Final</label>
                    <input placeholder="€" type="number" value={salePrice} onChange={e => setSalePrice(e.target.value)} style={inputStyle} />
                    
                    <label>Cliente</label>
                    {clients.length > 0 && (
                        <select 
                            value={selectedClient} 
                            onChange={e => setSelectedClient(e.target.value)}
                            style={inputStyle}
                        >
                            <option value="">Selecione...</option>
                            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    )}
                    <input placeholder="Novo Cliente (se não selecionado)" value={newClientName} onChange={e => setNewClientName(e.target.value)} style={inputStyle} />

                    <label>Receber em:</label>
                    <select value={targetAccount} onChange={e => setTargetAccount(e.target.value)} style={inputStyle}>
                         <option value="">Selecione a Conta</option>
                         {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>

                    <button onClick={handleSell} style={primaryBtnStyle}>Confirmar Venda</button>
                </div>
             </div>
        )}
    </div>
  );
}
