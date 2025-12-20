import React from 'react';
import { X, ShoppingBag, Lock } from 'lucide-react';

export default function WolfStore({ onClose }) {
  const items = [
    { id: 1, name: 'Coleira Real', price: 500, icon: '💎', unlocked: true },
    { id: 2, name: 'Óculos Deal', price: 1200, icon: '🕶️', unlocked: false },
    { id: 3, name: 'Coroa Alpha', price: 5000, icon: '👑', unlocked: false },
    { id: 4, name: 'Capa de Veludo', price: 2500, icon: '🧣', unlocked: false },
  ];

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', background: '#111', padding: '1.5rem', borderRadius: '24px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3 style={{ display: 'flex', gap: '8px', color: 'var(--accent-primary)' }}><ShoppingBag /> Boutique Wolf</h3>
                <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff' }}><X /></button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {items.map(item => (
                    <div key={item.id} style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px', textAlign: 'center', border: item.unlocked ? '1px solid var(--accent-primary)' : '1px solid #333', opacity: item.unlocked ? 1 : 0.6 }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{item.icon}</div>
                        <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{item.name}</div>
                        <div style={{ color: item.unlocked ? 'var(--accent-primary)' : '#666', fontSize: '0.8rem', marginTop: '4px' }}>
                            {item.unlocked ? `${item.price} XP` : <span style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'4px'}}><Lock size={12}/> {item.price} XP</span>}
                        </div>
                        <button disabled={!item.unlocked} style={{ width: '100%', marginTop: '10px', padding: '6px', borderRadius: '6px', border: 'none', background: item.unlocked ? 'var(--accent-primary)' : '#333', color: item.unlocked ? '#000' : '#888', fontWeight: 'bold', cursor: item.unlocked ? 'pointer' : 'not-allowed' }}>
                            {item.unlocked ? 'Comprar' : 'Bloqueado'}
                        </button>
                    </div>
                ))}
            </div>
            <div style={{ marginTop: '1.5rem', textAlign: 'center', color: '#666', fontSize: '0.8rem' }}>
                Ganhe XP vendendo relógios para desbloquear itens.
            </div>
        </div>
    </div>
  );
}