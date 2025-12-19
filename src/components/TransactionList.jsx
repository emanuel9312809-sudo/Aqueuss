import { Trash2 } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

export default function TransactionList() {
  const { ...walletProps } = useWallet();

  // Helper to get bucket icon
  const getIcon = (bucketId) => {
      const b = buckets.find(b => b.id === bucketId);
      return b ? b.icon : '??';
  };

  return (
    <div className="glass-panel" style={{ marginTop: '1rem', maxHeight: '300px', overflowY: 'auto' }}>
      <h3 className="title" style={{ fontSize: '1rem', marginBottom: '1rem' }}>Últimas Transações</h3>
      
      {transactions.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>Sem registos ainda.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {transactions.map((tx) => (
            <div key={tx.id} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '0.8rem',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <span style={{ fontSize: '1.2rem' }}>
                    {tx.type === 'INCOME' ? '??' : getIcon(tx.bucketId)}
                </span>
                <div>
                  <div style={{ color: '#fff', fontSize: '0.9rem', fontWeight: '500' }}>{tx.category}</div>
                  <div style={{ color: '#666', fontSize: '0.75rem' }}>
                      {new Date(tx.date).toLocaleDateString()}
                      {tx.note && <span style={{ color: '#00E5FF', marginLeft: '5px' }}>({tx.note})</span>}
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ color: tx.type === 'INCOME' ? '#00E5FF' : '#FF2975', fontWeight: 'bold' }}>
                    {tx.type === 'INCOME' ? '+' : '-'}{tx.amount.toFixed(2)} &euro;
                  </div>
                  <button 
                    onClick={() => {
                        if(window.confirm('Tem a certeza que deseja apagar?')) {
                            deleteTransaction(tx.id);
                        }
                    }}
                    style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}
                  >
                      <Trash2 size={16} />
                  </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

