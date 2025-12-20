import React, { useState } from 'react';
import { Target, Plus, Trash2, Crosshair } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

export default function GoalsPage() {
  // Mocking goals for simplicity in this script, or creating context if needed.
  // Ideally this should use WalletContext.
  // Adding "Sniper Mode" UI demo.
  
  const [goals, setGoals] = useState([{ id: 1, name: 'Patek Philippe', target: 50000, current: 12000, sniper: true }]);
  const [newGoal, setNewGoal] = useState('');

  return (
    <div className="glass-panel" style={{ minHeight: '80vh' }}>
        <h2 className="title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Crosshair color="red" /> Sniper de Metas
        </h2>
        
        <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            O "Sniper Mode" deduz uma % de cada venda automaticamente para atingir o alvo.
        </p>

        {goals.map(g => (
            <div key={g.id} style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px', marginBottom: '1rem', border: g.sniper ? '1px solid red' : '1px solid transparent' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 'bold' }}>{g.name}</span>
                    <span style={{ color: g.sniper ? 'red' : '#fff' }}>{g.sniper ? '🎯 SNIPER ON' : ''}</span>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{g.current}€ / {g.target}€</div>
                <div style={{ width: '100%', height: '6px', background: '#333', borderRadius: '3px' }}>
                    <div style={{ width: `${(g.current/g.target)*100}%`, height: '100%', background: g.sniper ? 'red' : 'var(--accent-primary)' }}></div>
                </div>
            </div>
        ))}
        
        <div style={{ textAlign: 'center', marginTop: '2rem', color: '#666', fontSize: '0.8rem' }}>
            (Integração completa do Sniper virá na v2.0)
        </div>
    </div>
  );
}