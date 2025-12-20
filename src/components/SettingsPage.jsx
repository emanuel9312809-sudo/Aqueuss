import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { Trash2, Plus, Save, Edit2, Shield, TrendingUp, Anchor } from 'lucide-react';

export default function SettingsPage() {
  const { 
    buckets, addBucket, removeBucket, updateBucket, 
    accounts, addAccount, removeAccount, 
    fundSettings, setFundSettings,
    resetData 
  } = useWallet();

  const [newBucketName, setNewBucketName] = useState('');
  const [newBucketTarget, setNewBucketTarget] = useState('');
  
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  // const [editIcon, setEditIcon] = useState('');

  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountBalance, setNewAccountBalance] = useState('');

  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');

  const handleAddBucket = () => {
    if (newBucketName && newBucketTarget) {
      addBucket(newBucketName, parseInt(newBucketTarget));
      setNewBucketName('');
      setNewBucketTarget('');
    }
  };

  const handleStartEdit = (b) => {
    setEditingId(b.id);
    setEditName(b.name);
    // setEditIcon(b.icon);
  };

  const handleSaveEdit = (id) => {
    updateBucket(id, { name: editName }); // icon excluded for simplicity
    setEditingId(null);
  };

  const handleAddAccount = () => {
      if (newAccountName && newAccountBalance) {
          addAccount(newAccountName, 'bank', newAccountBalance);
          setNewAccountName('');
          setNewAccountBalance('');
      }
  };

  const handleSaveKey = (e) => { 
      setApiKey(e.target.value); 
      localStorage.setItem('gemini_api_key', e.target.value); 
  };

  const totalTarget = buckets.reduce((acc, b) => acc + b.target, 0);
  const isValid = totalTarget === 100;

  return (
    <div style={{ paddingBottom: '80px' }}>
        
        {/* --- SMART ALLOCATION PROFILES (Added Feature) --- */}
        <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>⚖️</span> Perfis de Alocação
            </h3>
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
                <button style={{ padding: '1rem', minWidth: '120px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', cursor: 'pointer' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Conservador</div>
                    <div style={{ fontSize: '0.7rem', color: '#888' }}>30% Renda Fixa / 70% Seguro</div>
                </button>
                <button style={{ padding: '1rem', minWidth: '120px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', cursor: 'pointer' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Investidor</div>
                    <div style={{ fontSize: '0.7rem', color: '#888' }}>50% Ações / 50% FIIs</div>
                </button>
                <button style={{ padding: '1rem', minWidth: '120px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', cursor: 'pointer' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Agressivo</div>
                    <div style={{ fontSize: '0.7rem', color: '#888' }}>100% Crypto</div>
                </button>
            </div>
        </div>

        <div className="glass-panel" style={{ width: '100%', padding: '1.5rem', paddingBottom: '3rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '0.5rem' }} className="title">Configurações</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Gerencie seu Império.</p>
            </div>

            {/* AI Settings */}
            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.2rem' }}>🧠</span> Inteligência Artificial
                </h3>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Chave API Gemini (Opcional)</label>
                    <input type="password" placeholder="Cole sua API Key..." value={apiKey} onChange={handleSaveKey} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid #444', color: '#fff' }} />
                </div>
            </div>

            {/* Buckets Settings */}
            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.2rem' }}>💧</span> Baldes de Alocação
                </h3>
                
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.9rem', color: isValid ? '#4caf50' : '#f44336' }}>
                        <span>Total Alocado:</span>
                        <span>{totalTarget}% / 100%</span>
                    </div>

                    {buckets.map(bucket => (
                        <div key={bucket.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', gap: '10px' }}>
                            <div style={{ width: '30px', textAlign: 'center' }}>{bucket.icon}</div>
                            {editingId === bucket.id ? (
                                <input value={editName} onChange={e => setEditName(e.target.value)} style={{ flex: 1, padding: '4px', background: '#333', border: 'none', color: '#fff' }} />
                            ) : (
                                <div style={{ flex: 1, fontWeight: 'bold' }}>{bucket.name}</div>
                            )}
                            <div style={{ color: '#aaa', fontSize: '0.9rem' }}>{bucket.target}%</div>
                            
                            {editingId === bucket.id ? (
                                <button onClick={() => handleSaveEdit(bucket.id)}><Save size={16} /></button>
                            ) : (
                                <button onClick={() => handleStartEdit(bucket)} style={{ background: 'none', border: 'none', color: '#aaa' }}><Edit2 size={16} /></button>
                            )}
                             <button onClick={() => removeBucket(bucket.id)} style={{ background: 'none', border: 'none', color: '#f44336' }}><Trash2 size={16} /></button>
                        </div>
                    ))}

                    <div style={{ display: 'flex', gap: '5px', marginTop: '1rem' }}>
                        <input placeholder="Ex: Investimentos" value={newBucketName} onChange={e => setNewBucketName(e.target.value)} style={{ flex: 2, padding: '0.5rem', borderRadius: '8px', border: 'none' }} />
                        <input placeholder="%" type="number" value={newBucketTarget} onChange={e => setNewBucketTarget(e.target.value)} style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: 'none' }} />
                        <button onClick={handleAddBucket} style={{ background: 'var(--accent-primary)', border: 'none', borderRadius: '8px', padding: '0 10px' }}><Plus color="#000" /></button>
                    </div>
                </div>
            </div>

            {/* Fund Settings */}
            <div style={{ marginBottom: '2rem' }}>
                 <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.2rem' }}>🏦</span> Fundo Automático
                </h3>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ fontWeight: 'bold' }}>Dedução Automática</div>
                        <div style={{ fontSize: '0.8rem', color: '#aaa' }}>Retirar {fundSettings.percentage}% de toda entrada</div>
                    </div>
                    <input 
                        type="checkbox" 
                        checked={fundSettings.enabled} 
                        onChange={(e) => setFundSettings(prev => ({ ...prev, enabled: e.target.checked }))} 
                        style={{ width: '20px', height: '20px' }}
                    />
                </div>
            </div>

            {/* Danger Zone */}
             <div style={{ marginTop: '3rem', borderTop: '1px solid #333', paddingTop: '1rem' }}>
                <button onClick={() => { if(confirm('Apagar TUDO?')) resetData(); }} style={{ width: '100%', padding: '1rem', background: 'rgba(255,0,0,0.1)', color: 'red', border: '1px solid red', borderRadius: '12px' }}>
                    Resetar Dados (Danger)
                </button>
             </div>
        </div>
    </div>
  );
}
