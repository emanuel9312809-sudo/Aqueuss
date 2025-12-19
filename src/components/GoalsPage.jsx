import { useState } from 'react';
import { Target, Plus } from 'lucide-react';

export default function GoalsPage() {
  const [goals, setGoals] = useState([
    { id: 1, name: 'Viagem 2026', target: 2000, current: 850, deadline: '2026-06-01' },
    { id: 2, name: 'Fundo de Emergência', target: 5000, current: 1200, deadline: '2025-12-31' },
  ]);
  
  const [showForm, setShowForm] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', target: '' });

  const handleAddGoal = () => {
    if(!newGoal.name || !newGoal.target) return;
    setGoals([...goals, { 
      id: Date.now(), 
      name: newGoal.name, 
      target: Number(newGoal.target), 
      current: 0,
      deadline: '2026-01-01'
    }]);
    setNewGoal({ name: '', target: '' });
    setShowForm(false);
  };

  return (
    <div className="glass-panel" style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Metas Futuras</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{ 
            background: 'rgba(255, 255, 255, 0.1)', 
            border: 'none', 
            borderRadius: '50%', 
            width: '36px', 
            height: '36px',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center'
          }}
        >
          <Plus size={20} />
        </button>
      </div>

      {showForm && (
        <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
          <input 
            placeholder="Nome da Meta (ex: Carro)" 
            style={{ width: '100%', padding: '0.8rem', background: '#222', border: 'none', marginBottom: '0.5rem', color: '#fff', borderRadius: '4px' }}
            value={newGoal.name}
            onChange={e => setNewGoal({...newGoal, name: e.target.value})}
          />
          <input 
            placeholder="Valor Alvo (€)" 
            type="number"
            style={{ width: '100%', padding: '0.8rem', background: '#222', border: 'none', marginBottom: '0.5rem', color: '#fff', borderRadius: '4px' }}
            value={newGoal.target}
            onChange={e => setNewGoal({...newGoal, target: e.target.value})}
          />
          <button 
            onClick={handleAddGoal}
            style={{ width: '100%', padding: '0.8rem', background: '#00E5FF', border: 'none', cursor: 'pointer', fontWeight: 'bold', borderRadius: '4px', color: '#000' }}
          >
            Criar Meta
          </button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {goals.map(goal => {
          const progress = (goal.current / goal.target) * 100;
          return (
            <div key={goal.id} style={{ 
              background: 'rgba(255,255,255,0.03)', 
              borderRadius: '12px', 
              padding: '1rem',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: '500' }}>{goal.name}</span>
                <span style={{ color: '#aaa', fontSize: '0.9rem' }}>{goal.current}€ / {goal.target}€</span>
              </div>
              
              <div style={{ width: '100%', height: '8px', background: '#333', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${progress}%`, 
                  height: '100%', 
                  background: progress >= 100 ? '#4BC0C0' : 'linear-gradient(90deg, #FF2975 0%, #FF9F40 100%)',
                  transition: 'width 0.5s'
                }} />
              </div>
              
              <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#666', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Target size={12} />
                <span>{progress.toFixed(0)}% atingido</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
