import { Trophy, Medal, Star, TrendingUp, CheckCircle } from 'lucide-react';
import { useTransaction } from '../context/TransactionContext';

export default function GamificationPage() {
  const { transactions, buckets } = useTransaction();

  // --- Logic for Generic "Smart Bucket" Bonus ---
  // Check if ALL buckets are within their target % of total income (or expense)
  
  // 1. Calculate Total Expenses and Income
  const totalExpense = transactions
    .filter(tx => tx.type === 'EXPENSE')
    .reduce((acc, tx) => acc + tx.amount, 0);

  // 2. Check each bucket
  let allBucketsHealthy = true;
  let failingBucket = null;

  if (totalExpense > 0) {
      buckets.forEach(bucket => {
          const bucketSpend = transactions
            .filter(tx => tx.bucketId === bucket.id && tx.type === 'EXPENSE')
            .reduce((acc, tx) => acc + tx.amount, 0);
          
          const currentPercent = (bucketSpend / totalExpense) * 100;
          
          // Allow small margin of error (+5%)
          if (currentPercent > (bucket.target + 5)) {
              allBucketsHealthy = false;
              failingBucket = bucket.name;
          }
      });
  } else {
      allBucketsHealthy = false; // No data yet
  }

  const bonusUnlocked = allBucketsHealthy && totalExpense > 0;
  
  // --- Badge Logic ---
  const badges = [
    { id: 1, name: 'Iniciante', icon: <Star size={24} />, unlocked: true, desc: 'Criou a conta Aequus' },
    { id: 2, name: 'Equilibrista', icon: <Trophy size={24} />, unlocked: bonusUnlocked, desc: 'Respeitou todos os baldes' },
    { id: 3, name: 'Focado', icon: <TrendingUp size={24} />, unlocked: false, desc: 'Atingiu uma Meta' },
    { id: 4, name: 'Investidor', icon: <Medal size={24} />, unlocked: false, desc: 'Investiu 100€' },
  ];

  return (
    <div className="glass-panel" style={{ width: '100%', padding: '1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#FFD700', marginBottom: '0.5rem' }}>Aequus Quest</h2>
        <p style={{ color: '#ccc' }}>Complete missões e ganhe recompensas financeiras.</p>
      </div>

      {/* Bonus Section */}
      <div style={{ 
        background: 'rgba(0, 229, 255, 0.1)', 
        border: '1px solid #00E5FF', 
        borderRadius: '12px', 
        padding: '1rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <h3 style={{ color: '#00E5FF', margin: 0 }}>Bónus de Disciplina</h3>
          <p style={{ fontSize: '0.8rem', color: '#a0a0a0', margin: '0.5rem 0' }}>Mantenha todos os baldes na meta.</p>
          <div style={{ fontSize: '0.9rem', color: bonusUnlocked ? '#4BC0C0' : '#FF2975' }}>
            {bonusUnlocked ? '✅ Tudo em ordem' : `⚠️ Excesso em: ${failingBucket || 'Dados insuficientes'}`}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '2rem', display: 'block' }}>{bonusUnlocked ? '🔓' : '🔒'}</span>
          <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#fff' }}>+5.00 €</span>
        </div>
      </div>

      {/* Badges Grid */}
      <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Conquistas</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {badges.map(badge => (
          <div key={badge.id} style={{ 
            background: 'rgba(255,255,255,0.05)', 
            borderRadius: '12px', 
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            opacity: badge.unlocked ? 1 : 0.4,
            border: badge.unlocked ? '1px solid rgba(255, 215, 0, 0.3)' : 'none'
          }}>
            <div style={{ color: badge.unlocked ? '#FFD700' : '#666' }}>{badge.icon}</div>
            <div style={{ fontWeight: 'bold', fontSize: '0.9rem', textAlign: 'center' }}>{badge.name}</div>
            <div style={{ fontSize: '0.7rem', color: '#888', textAlign: 'center' }}>{badge.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
