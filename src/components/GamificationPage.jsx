import { Trophy, Medal, Star, TrendingUp, CheckCircle, Zap } from 'lucide-react';
import { useTransaction } from '../context/TransactionContext';

// Icon Helper
const PiggyBankIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2.5V5z"></path>
        <path d="M2 9v1c0 1.1.9 2 2 2h1"></path>
        <path d="M16 11h.01"></path>
    </svg>
);

export default function GamificationPage() {
  const { userStats, missions } = useTransaction(); 

  const badges = [
    { id: 1, name: 'Iniciante', icon: <Star size={24} />, unlocked: true, desc: 'Começou a jornada' },
    { id: 2, name: 'Poupador', icon: <PiggyBankIcon />, unlocked: userStats.level >= 2, desc: 'Atingiu o Nível 2' },
    { id: 3, name: 'Mestre', icon: <Trophy size={24} />, unlocked: userStats.level >= 5, desc: 'Atingiu o Nível 5' },
  ];

  const progressPercent = Math.min((userStats.xp / userStats.nextLevel) * 100, 100);

  return (
    <div className="glass-panel" style={{ width: '100%', padding: '1.5rem', marginBottom: '80px' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#FFD700', marginBottom: '0.5rem' }}>Aequus Quest</h2>
        
        <div style={{ 
            width: '100px', height: '100px', borderRadius: '50%', 
            background: 'linear-gradient(135deg, #FFD700 0%, #FFAA00 100%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem auto', boxShadow: '0 0 20px rgba(255, 215, 0, 0.4)',
            color: '#000'
        }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>NÍVEL</span>
            <span style={{ fontSize: '3rem', fontWeight: 'bold', lineHeight: '1' }}>{userStats.level}</span>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.1)', height: '10px', borderRadius: '5px', overflow: 'hidden', maxWidth: '300px', margin: '0 auto' }}>
            <div style={{ 
                width: `${progressPercent}%`, 
                height: '100%', 
                background: '#00E5FF',
                transition: 'width 0.5s ease'
            }}></div>
        </div>
        <div style={{ fontSize: '0.8rem', color: '#aaa', marginTop: '5px' }}>
            XP: {userStats.xp} / {userStats.nextLevel}
        </div>
      </div>

      <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={20} color="#00E5FF" /> Missões Ativas
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          {missions.map(mission => (
              <div key={mission.id} style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  padding: '1rem', 
                  borderRadius: '12px',
                  border: mission.completed ? '1px solid #4BC0C0' : '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                  <div style={{ opacity: mission.completed ? 0.5 : 1 }}>
                      <div style={{ fontWeight: 'bold', color: '#fff' }}>{mission.desc}</div>
                      <div style={{ fontSize: '0.8rem', color: '#00E5FF' }}>+{mission.xp} XP</div>
                  </div>
                  <div>
                      {mission.completed ? <CheckCircle color="#4BC0C0" /> : <span style={{ fontSize: '1.5rem' }}>⏳</span>}
                  </div>
              </div>
          ))}
      </div>

      <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Conquistas</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
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
            <div style={{ fontWeight: 'bold', fontSize: '0.8rem', textAlign: 'center' }}>{badge.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}