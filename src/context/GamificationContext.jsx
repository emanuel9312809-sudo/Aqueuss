import { createContext, useContext, useState, useEffect } from 'react';
import LevelUpModal from '../components/LevelUpModal';
// Import new Logic Modules
import { usePersistentState } from '../logic/app-state';
import {
    getInitialMissions,
    determineMood,
    calculateLevel,
    calculateNextLevelXP,
    calculateLevelBonus
} from '../logic/logic-guardian';

const GamificationContext = createContext();

export const useGamification = () => useContext(GamificationContext);

export const GamificationProvider = ({ children }) => {
    // -- STATE MANAGEMENT (Modular Persistance) --
    const [userStats, setUserStats] = usePersistentState('aequus_stats', { level: 1, xp: 0, nextLevel: 100 });
    const [missions, setMissions] = usePersistentState('aequus_missions', getInitialMissions());
    const [bonusVault, setBonusVault] = usePersistentState('aequus_bonus_vault', 0); // New Feature

    // -- Wolf Pet State --
    const [petMood, setPetMood] = useState('idle');
    const petLevel = userStats.level;

    const [levelUpModal, setLevelUpModal] = useState({ isOpen: false, level: 1, bonus: 0 });

    // Mood Logic
    useEffect(() => {
        // Check mood based on XP and time (Interaction tracking could be added here)
        const mood = determineMood(userStats.xp, Date.now());
        setPetMood(mood);
    }, [userStats.xp]);

    const closeLevelUpModal = () => {
        setLevelUpModal(prev => ({ ...prev, isOpen: false }));
    };

    const gainXP = (amount) => {
        setUserStats(prev => {
            let newXP = prev.xp + amount;
            let newLevel = prev.level;
            let newNext = prev.nextLevel;

            // Calculate Level Up
            if (newXP >= newNext) {
                newLevel += 1;
                newXP = newXP - newNext;
                newNext = calculateNextLevelXP(newLevel);

                // BONUS VAULT REWARD
                const bonus = calculateLevelBonus(newLevel);
                setBonusVault(current => current + bonus);

                // Trigger Modal
                setLevelUpModal({ isOpen: true, level: newLevel, bonus });

                // Wolf celebration
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
                // Check Daily/Weekly logic here (simplified for now to just generic transaction)
                if ((m.type === 'daily' || m.type === 'weekly') && !m.completed) {
                    // In a real scenario, we'd check specific conditions like 'daily-1' vs 'weekly-2'
                    // For this implementation, we simply complete the first available 'daily' task as a proof of concept
                    if (m.id === 'daily-1') {
                        gainXP(m.xp);
                        return { ...m, completed: true };
                    }
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
    const streak = 1;

    return (
        <GamificationContext.Provider value={{
            userStats, missions, setMissions, bonusVault,
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
                bonus={levelUpModal.bonus}
                onClose={closeLevelUpModal}
            />
        </GamificationContext.Provider>
    );
};
