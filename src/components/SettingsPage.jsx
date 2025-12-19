import { useState } from 'react';
import { PieChart, Briefcase, Plus, Trash2, Save, Wallet, PiggyBank } from 'lucide-react';
import { useTransaction } from '../context/TransactionContext';

export default function SettingsPage() {
  const { 
    buckets, addBucket, removeBucket, updateBucket,
    accounts, addAccount, removeAccount,
    fundSettings, setFundSettings
  } = useTransaction();
  
  const [newBucketName, setNewBucketName] = useState('');
  const [newBucketTarget, setNewBucketTarget] = useState('');
  const [newBucketType, setNewBucketType] = useState('survival'); 
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountBalance, setNewAccountBalance] = useState('');

  const handleTargetChange = (id, newTarget) => {
    updateBucket(id, { target: parseInt(newTarget) || 0 });
  };

  const handleAddBucket = () => {
    if (newBucketName && newBucketTarget) {
      addBucket(newBucketName, newBucketTarget, newBucketType);
      setNewBucketName('');
      setNewBucketTarget('');
      setNewBucketType('survival');
    }
  };

  const handleAddAccount = () => {
      if (newAccountName && newAccountBalance) {
          addAccount(newAccountName, 'bank', newAccountBalance);
          setNewAccountName('');
          setNewAccountBalance('');
      }
  };

  const totalTarget = buckets.reduce((acc, b) => acc + b.target, 0);
  const isValid = totalTarget === 100;

  return (
    <div className="glass-panel" style={{ width: '100%', padding: '1.5rem', paddingBottom: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff', marginBottom: '0.5rem' }}>Personalização</h2>
            <p style={{ color: '#ccc' }}>Gerencie Ativos, Fundos e Baldes.</p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PiggyBank size={20} color="#FFD700" />
                Fundo Automático
            </h3>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span>Ativar Fundo</span>
                    <input 
                        type="checkbox" 
                        checked={fundSettings.active} 
                        onChange={e => setFundSettings({ ...fundSettings, active: e.target.checked })}
                        style={{ width: '20px', height: '20px', accentColor: '#00E5FF' }} 
                    />
                </div>
                
                {fundSettings.active && (
                    <div style={{ animation: 'fadeIn 0.3s' }}>
                        <div style={{ marginBottom: '0.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '4px' }}>Nome do Fundo</label>
                            <input 
                                value={fundSettings.name}
                                onChange={e => setFundSettings({ ...fundSettings, name: e.target.value })}
                                style={{ width: '100%', padding: '0.5rem', background: '#222', border: 'none', color: '#fff', borderRadius: '4px' }}
                            />
                        </div>
                        <div style={{ marginBottom: '0.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '4px' }}>Percentagem de Retenção (%)</label>
                            <input 
                                type="number"
                                value={fundSettings.percentage}
                                onChange={e => setFundSettings({ ...fundSettings, percentage: Number(e.target.value) })}
                                style={{ width: '100%', padding: '0.5rem', background: '#222', border: 'none', color: '#fff', borderRadius: '4px' }}
                            />
                        </div>
                        <div style={{ marginTop: '1rem', padding: '0.5rem', background: 'rgba(255, 215, 0, 0.1)', color: '#FFD700', borderRadius: '4px', textAlign: 'center' }}>
                            💰 Saldo Acumulado: {fundSettings.balance.toFixed(2)} €
                        </div>
                    </div>
                )}
            </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Wallet size={20} color="#00E5FF" />
                Gestão de Contas (Ativos)
            </h3>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px' }}>
                {accounts.map(acc => (
                    <div key={acc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                        <div>
                            <div style={{ fontWeight: 'bold' }}>{acc.name}</div>
                            <div style={{ fontSize: '0.8rem', color: '#aaa' }}>Saldo: {acc.balance.toFixed(2)} €</div>
                        </div>
                        <button onClick={() => removeAccount(acc.id)} style={{ background: 'none', border: 'none', color: '#FF2975', cursor: 'pointer' }}>
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}

                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <input 
                        placeholder="Nome (ex: Banco B)" 
                        value={newAccountName}
                        onChange={e => setNewAccountName(e.target.value)}
                        style={{ flex: 2, padding: '0.5rem', borderRadius: '8px', border: 'none', background: '#222', color: '#fff' }}
                    />
                     <input 
                        placeholder="Saldo (€)" 
                        type="number"
                        value={newAccountBalance}
                        onChange={e => setNewAccountBalance(e.target.value)}
                        style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: 'none', background: '#222', color: '#fff' }}
                    />
                    <button onClick={handleAddAccount} style={{ background: '#00E5FF', border: 'none', borderRadius: '8px', padding: '0 1rem', cursor: 'pointer' }}>
                        <Plus size={20} color="#000" />
                    </button>
                </div>
            </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PieChart size={20} color="#00E5FF" />
                Seus Baldes (Total: {totalTarget}%)
            </h3>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px', border: isValid ? '1px solid rgba(255,255,255,0.1)' : '1px solid #FF2975' }}>
                {buckets.map(bucket => (
                    <div key={bucket.id} style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                            <span style={{ color: bucket.color, display: 'flex', gap: '5px', fontWeight: 'bold' }}>
                                {bucket.icon} {bucket.name}
                                <span style={{ fontSize: '0.6rem', background: '#333', padding: '2px 4px', borderRadius: '4px', marginLeft: '5px', color: '#aaa' }}>
                                    {bucket.type === 'survival' ? 'Sobrevivência' : bucket.type === 'evolution' ? 'Evolução' : 'Lazer'}
                                </span>
                            </span>
                            <button onClick={() => removeBucket(bucket.id)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                           <input type="range" min="0" max="100" value={bucket.target} onChange={(e) => handleTargetChange(bucket.id, e.target.value)} style={{ flex: 1, accentColor: bucket.color }} />
                            <span style={{ fontWeight: 'bold', minWidth: '40px', textAlign: 'right' }}>{bucket.target}%</span>
                        </div>
                    </div>
                ))}
                
                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input placeholder="Nome" value={newBucketName} onChange={e => setNewBucketName(e.target.value)} style={{ flex: 2, padding: '0.5rem', borderRadius: '8px', border: 'none', background: '#222', color: '#fff' }} />
                        <input placeholder="%" type="number" value={newBucketTarget} onChange={e => setNewBucketTarget(e.target.value)} style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: 'none', background: '#222', color: '#fff' }} />
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <select 
                            value={newBucketType}
                            onChange={e => setNewBucketType(e.target.value)}
                            style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: 'none', background: '#222', color: '#fff' }}
                        >
                            <option value="survival">Sobrevivência</option>
                            <option value="evolution">Evolução</option>
                            <option value="leisure">Lazer</option>
                        </select>
                        <button onClick={handleAddBucket} style={{ background: '#00E5FF', border: 'none', borderRadius: '8px', padding: '0 1rem', cursor: 'pointer', flex: 0.3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Plus size={20} color="#000" />
                        </button>
                    </div>
                </div>

            </div>
        </div>

    </div>
  );
}