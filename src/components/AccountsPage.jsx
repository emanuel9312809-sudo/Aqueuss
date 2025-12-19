import { useState } from 'react';
import { Wallet, Plus, Trash2, ArrowRightLeft } from 'lucide-react';
import { useTransaction } from '../context/TransactionContext';

export default function AccountsPage() {
  const { accounts, addAccount, removeAccount, transactions } = useTransaction();
  
  const [showForm, setShowForm] = useState(false);
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountBalance, setNewAccountBalance] = useState('');

  const handleAddAccount = () => {
    if (newAccountName && newAccountBalance) {
      addAccount(newAccountName, 'bank', newAccountBalance);
      setNewAccountName('');
      setNewAccountBalance('');
      setShowForm(false);
    }
  };

  return (
    <div className='glass-panel' style={{ width: '100%', marginBottom: '5rem' }}>
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Minhas Contas</h2>
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
            placeholder='Nome (ex: Nubank, Carteira)' 
            style={{ width: '100%', padding: '0.8rem', background: '#222', border: 'none', marginBottom: '0.5rem', color: '#fff', borderRadius: '4px' }}
            value={newAccountName}
            onChange={e => setNewAccountName(e.target.value)}
          />
          <input 
            placeholder='Saldo Atual (€)' 
            type='number'
            style={{ width: '100%', padding: '0.8rem', background: '#222', border: 'none', marginBottom: '0.5rem', color: '#fff', borderRadius: '4px' }}
            value={newAccountBalance}
            onChange={e => setNewAccountBalance(e.target.value)}
          />
          <button 
            onClick={handleAddAccount}
            style={{ width: '100%', padding: '0.8rem', background: '#00E5FF', border: 'none', cursor: 'pointer', fontWeight: 'bold', borderRadius: '4px', color: '#000' }}
          >
            Adicionar Conta
          </button>
        </div>
      )}

      <div style={{ display: 'grid', gap: '1rem' }}>
        {accounts.map(acc => (
             <div key={acc.id} style={{ 
                background: 'rgba(255,255,255,0.03)', 
                borderRadius: '12px', 
                padding: '1rem',
                border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ 
                        width: '40px', height: '40px', borderRadius: '10px', 
                        background: 'rgba(0, 229, 255, 0.1)', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#00E5FF'
                    }}>
                        <Wallet size={20} />
                    </div>
                    <div>
                        <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{acc.name}</div>
                        <div style={{ color: '#aaa', fontSize: '0.8rem' }}>Ativo</div>
                    </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff' }}>
                        {acc.balance.toFixed(2)} €
                    </div>
                     <button onClick={() => removeAccount(acc.id)} style={{ background: 'none', border: 'none', color: '#FF2975', cursor: 'pointer', marginTop: '5px', fontSize: '0.8rem' }}>
                        Remover
                    </button>
                </div>
            </div>
        ))}
      </div>

       {/* Simple Total Assets Display */}
       <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(0, 229, 255, 0.05)', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(0, 229, 255, 0.2)' }}>
            <div style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Património Total</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#00E5FF' }}>
                {accounts.reduce((acc, obj) => acc + obj.balance, 0).toFixed(2)} €
            </div>
       </div>

    </div>
  );
}
