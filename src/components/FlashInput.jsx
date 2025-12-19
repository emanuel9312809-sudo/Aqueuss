import { useState } from 'react';
import { useTransaction } from '../context/TransactionContext';
import './FlashInput.css';

export default function FlashInput() {
  const [amount, setAmount] = useState('');
  const [selectedBucketId, setSelectedBucketId] = useState(null);
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [type, setType] = useState('EXPENSE'); // 'EXPENSE' | 'INCOME'
  const [isRecurring, setIsRecurring] = useState(false);
  
  const { addTransaction, buckets, accounts } = useTransaction();

  // Set default account
  if (!selectedAccountId && accounts.length > 0) {
      setSelectedAccountId(accounts[0].id);
  }

  const handleSubmit = () => {
    if (!amount) return;
    
    if (type === 'EXPENSE' && !selectedBucketId) return;
    if (!selectedAccountId) return;

    let transactionData = {
        amount: parseFloat(amount),
        type: type,
        date: new Date(),
        accountId: selectedAccountId,
        isRecurring: (type === 'INCOME' && isRecurring)
    };

    if (type === 'EXPENSE') {
        const bucket = buckets.find(b => b.id === selectedBucketId);
        transactionData.category = bucket.name; 
        transactionData.bucketId = bucket.id;
    } else {
        transactionData.category = 'Rendimento';
        transactionData.bucketId = 'income';
    }
    
    addTransaction(transactionData);

    setAmount('');
    setSelectedBucketId(null);
    setIsRecurring(false);
    
    if(transactionData.isRecurring) {
        alert('Rendimento Recorrente Configurado! Será adicionado automaticamente todos os meses neste dia.');
    } else {
        alert('Registado com sucesso!');
    }
  };

  return (
    <div className="flash-container glass-panel">
      {/* Type Toggle */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', gap: '1rem' }}>
        <button 
            onClick={() => setType('EXPENSE')}
            style={{ 
                padding: '0.5rem 1rem', borderRadius: '20px', border: 'none', 
                background: type === 'EXPENSE' ? '#FF2975' : 'rgba(255,255,255,0.1)',
                color: '#fff', fontWeight: 'bold', cursor: 'pointer'
            }}
        >
            Despesa
        </button>
        <button 
             onClick={() => setType('INCOME')}
             style={{ 
                padding: '0.5rem 1rem', borderRadius: '20px', border: 'none', 
                background: type === 'INCOME' ? '#00E5FF' : 'rgba(255,255,255,0.1)',
                color: type === 'INCOME' ? '#000' : '#fff', fontWeight: 'bold', cursor: 'pointer'
            }}
        >
            Rendimento
        </button>
      </div>
      
      {/* Amount Input */}
      <div className="amount-input-wrapper">
        <span className="currency">€</span>
        <input 
          type="number" 
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="amount-input"
          autoFocus
        />
      </div>

       {/* Account Selection */}
       <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', color: '#aaa', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
              {type === 'INCOME' ? 'Receber em:' : 'Pagar com:'}
          </label>
          <select 
            value={selectedAccountId} 
            onChange={e => setSelectedAccountId(e.target.value)}
            style={{ 
                width: '100%', padding: '0.8rem', borderRadius: '12px', 
                border: '1px solid rgba(255,255,255,0.1)', 
                background: '#0a0e17', color: '#fff' 
            }}
          >
              {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>
                      {acc.name} ({acc.balance.toFixed(2)}€)
                  </option>
              ))}
          </select>
       </div>

      {/* Recurring Checkbox (Income Only) */}
      {type === 'INCOME' && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '1rem', background: 'rgba(0, 229, 255, 0.1)', padding: '0.5rem', borderRadius: '8px' }}>
              <input 
                type="checkbox" 
                checked={isRecurring}
                onChange={e => setIsRecurring(e.target.checked)}
                style={{ width: '20px', height: '20px', accentColor: '#00E5FF' }}
              />
              <span style={{ fontSize: '0.9rem', color: '#fff' }}>Repetir todos os meses (neste dia)</span>
          </div>
      )}

      {/* Buckets Grid (Expense Only) */}
      {type === 'EXPENSE' && (
          <div className="categories-grid">
            {buckets.map(bucket => (
              <button 
                key={bucket.id}
                className={`category-btn ${selectedBucketId === bucket.id ? "active" : ""}`}
                onClick={() => setSelectedBucketId(bucket.id)}
                style={{ 
                    border: selectedBucketId === bucket.id ? `2px solid ${bucket.color}` : '1px solid rgba(255,255,255,0.1)' 
                }}
              >
                <span className="cat-icon">{bucket.icon}</span>
                <span className="cat-name">{bucket.name}</span>
              </button>
            ))}
          </div>
      )}

      {/* Submit Button */}
      <button 
        className="submit-btn" 
        onClick={handleSubmit}
        disabled={!amount || (type === 'EXPENSE' && !selectedBucketId) || !selectedAccountId}
        style={{
            background: type === 'INCOME' ? 'linear-gradient(135deg, #00E5FF 0%, #00B0FF 100%)' : 'linear-gradient(135deg, #FF2975 0%, #FF9F40 100%)',
            color: type === 'INCOME' ? '#000' : '#fff'
        }}
      >
        {type === 'INCOME' ? 'RECEBER' : 'GASTAR'}
      </button>
    </div>
  );
}
