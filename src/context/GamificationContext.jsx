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
  
  // -- Wolf Pet State --
  const [petMood, setPetMood] = useState('idle'); // idle, alpha, sleep
  // We can derive petLevel from userStats.level or keep it separate. Let's sync them for now.
  const petLevel = userStats.level;

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

  // Mood Logic (Simple Time-based + Event Mock)
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 22 || hour < 6) setPetMood('sleep');
    else setPetMood('idle');
  }, []);

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
            // Wolf celebrates
            setPetMood('alpha');
            setTimeout(() => setPetMood('idle'), 5000);
        }
        return { level: newLevel, xp: newXP, nextLevel: newNext };
    });
  };

  const checkMissions = (action) => {
    if (action === 'ADD_TRANSACTION') {
        // Trigger generic happiness
        setPetMood('alpha');
        setTimeout(() => setPetMood('idle'), 3000);

        setMissions(prev => prev.map(m => {
            if (m.type === 'daily' && !m.completed) {
                gainXP(m.xp);
                return { ...m, completed: true };
            }
            return m;
        }));
    }
  };

  // Helper bindings for WolfPet
  const xp = userStats.xp;
  const level = userStats.level;
  const nextLevelXp = userStats.nextLevel;
  const progress = (xp / nextLevelXp) * 100;
  const streak = 1; // Mock for now

  return (
    <GamificationContext.Provider value={{
      userStats, missions, setMissions,
      gainXP, checkMissions,
      levelUpModal, closeLevelUpModal,
      // Wolf Exports
      petMood, setPetMood, petLevel,
      xp, level, nextLevelXp, progress, streak
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
