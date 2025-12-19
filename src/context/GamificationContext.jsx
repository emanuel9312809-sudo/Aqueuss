import { createContext, useContext, useState, useEffect } from 'react';
import LevelUpModal from '../components/LevelUpModal';

const GamificationContext = createContext();

export const useGamification = () => useContext(GamificationContext);

export const GamificationProvider = ({ children }) => {
  const [userStats, setUserStats] = useState({ level: 1, xp: 0, nextLevel: 100 });
  const [missions, setMissions] = useState([
    { id: 'daily-1', type: 'daily', desc: 'Registrar 1 Transação', xp: 50, completed: false },
    { id: 'weekly-1', type: 'weekly', desc: 'Poupar 10€ (Fundo)', xp: 200, completed: false }, 
  ]);
  const [levelUpModal, setLevelUpModal] = useState({ isOpen: false, level: 1 });
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const loadedStats = localStorage.getItem('aequus_stats');
    if (loadedStats) setUserStats(JSON.parse(loadedStats));
    setDataLoaded(true);
  }, []);

  useEffect(() => {
    if (!dataLoaded) return;
    localStorage.setItem('aequus_stats', JSON.stringify(userStats));
  }, [userStats, dataLoaded]);

  const closeLevelUpModal = () => {
    setLevelUpModal(prev => ({ ...prev, isOpen: false }));
  };

  const gainXP = (amount) => {
    setUserStats(prev => {
        let newXP = prev.xp + amount;
        let newLevel = prev.level;
        let newNext = prev.nextLevel;
        
        if (newXP >= newNext) {
            newLevel += 1;
            newXP = newXP - newNext;
            newNext = Math.floor(newNext * 1.5); 
            // Trigger Modal
            setLevelUpModal({ isOpen: true, level: newLevel });
        }
        return { level: newLevel, xp: newXP, nextLevel: newNext };
    });
  };

  const checkMissions = (action) => {
    if (action === 'ADD_TRANSACTION') {
        setMissions(prev => prev.map(m => {
            if (m.type === 'daily' && !m.completed) {
                gainXP(m.xp);
                return { ...m, completed: true };
            }
            return m;
        }));
    }
  };

  return (
    <GamificationContext.Provider value={{
      userStats, missions, setMissions,
      gainXP, checkMissions,
      levelUpModal, closeLevelUpModal
    }}>
      {children}
      <LevelUpModal 
        isOpen={levelUpModal.isOpen} 
        level={levelUpModal.level} 
        onClose={closeLevelUpModal} 
      />
    </GamificationContext.Provider>
  );
};

