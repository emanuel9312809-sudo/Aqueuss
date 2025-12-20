import React, { useState } from 'react';
import { Trophy, Star, Target, Zap } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';
import WolfPet from './WolfPetV2';
import WolfStore from './WolfStore';

export default function GamificationPage() {
  const [showStore, setShowStore] = useState(false);
  const { userStats, missions, checkMissions } = useGamification();

  return (
    <div style={{ paddingBottom: '80px' }}>
      
      {/* THE DEN (Wolf Section) */}
      <div style={{ marginBottom: '-20px' }}>
          <WolfPet size="full" />
          <div style={{ textAlign: 'center', marginTop: '-20px', marginBottom: '20px', position: 'relative', zIndex: 10 }}>
              <button onClick={() => setShowStore(true)} style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)', border: 'none', padding: '8px 16px', borderRadius: '20px', color: '#000', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  🛍️ Acessórios
              </button>
          </div>
          {showStore && <WolfStore onClose={() => setShowStore(false)} />}
      </div>

      <div className="glass-panel" style={{ width: '100%', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <div style={{ color: '#888', fontSize: '0.9rem' }}>Nível Atual</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>{userStats.level}</div>
          </div>
          <Trophy size={40} color="var(--accent-primary)" />
        </div>
        
        <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
          <span>XP {userStats.xp}</span>
          <span>{userStats.nextLevel} XP</span>
        </div>
        
        {/* Progress Bar */}
        <div style={{ width: '100%', height: '8px', background: '#333', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ 
            width: `${(userStats.xp / userStats.nextLevel) * 100}%`, 
            height: '100%', 
            background: 'var(--accent-primary)',
            transition: 'width 0.5s ease'
          }} />
        </div>
      </div>

      <h3 style={{ marginBottom: '1rem', color: '#fff', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Target size={20} /> Missões Diárias
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {missions.filter(m => m.type === 'daily').map(mission => (
          <div key={mission.id} className="glass-panel" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: mission.completed ? '4px solid #4caf50' : '4px solid #333' }}>
            <div style={{ background: mission.completed ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '50%' }}>
              {mission.completed ? <Star size={20} color="#4caf50" fill="#4caf50" /> : <Star size={20} color="#666" />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', color: mission.completed ? '#fff' : '#aaa', textDecoration: mission.completed ? 'line-through' : 'none' }}>{mission.desc}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--accent-primary)' }}>+{mission.xp} XP</div>
            </div>
          </div>
        ))}
      </div>
      
      <h3 style={{ marginTop: '2rem', marginBottom: '1rem', color: '#fff', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Zap size={20} /> Desafios Semanais
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {missions.filter(m => m.type === 'weekly').map(mission => (
          <div key={mission.id} className="glass-panel" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', opacity: 0.7 }}>
             <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '50%' }}>
               <Trophy size={20} color="#666" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', color: '#aaa' }}>{mission.desc}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--accent-primary)' }}>+{mission.xp} XP</div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
