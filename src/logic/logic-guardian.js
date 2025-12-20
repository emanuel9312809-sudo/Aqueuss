
// --- GUARDIAN (WOLF) LOGIC MODULE ---
// Handles Pet XP, Mood, interactions and level progression.

// --- CONFIG ---
const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500]; // XP for levels 1-10

// --- CORE UTILS (WITH SAFETY) ---

export const calculateLevel = (xp) => {
    try {
        let level = 1;
        for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
            if (xp >= LEVEL_THRESHOLDS[i]) {
                level = i + 1;
            } else {
                break;
            }
        }
        return level;
    } catch (error) {
        console.error("Guardian Logic Error (calculateLevel):", error);
        return 1; // Safe fallback
    }
};

export const calculateNextLevelXP = (level) => {
    try {
        const index = level; // safe index since level 1 is index 0 in thresholds array? No, level 1 starts at 0.
        // If level is 1, next threshold is index 1 (100).
        if (index >= LEVEL_THRESHOLDS.length) return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] * 1.5;
        return LEVEL_THRESHOLDS[index];
    } catch (error) {
        console.error("Guardian Logic Error (calculateNextLevelXP):", error);
        return 1000;
    }
}

export const determineMood = (xp, lastInteractionTime) => {
    try {
        const now = Date.now();
        const hoursSinceInteraction = (now - lastInteractionTime) / (1000 * 60 * 60);

        if (hoursSinceInteraction > 24) return 'sleep'; // Sleeps if ignored for 24h
        if (xp > 500) return 'alpha'; // High level/XP makes him confident
        return 'idle'; // Default
    } catch (error) {
        console.error("Guardian Logic Error (determineMood):", error);
        return 'idle';
    }
};

export const processInteraction = (currentXP, type) => {
    try {
        // Types: 'click', 'task_complete', 'sale'
        let xpGain = 0;
        let message = "";

        switch (type) {
            case 'click':
                xpGain = 1;
                message = "Estou atento.";
                break;
            case 'task_complete':
                xpGain = 50;
                message = "Bom trabalho!";
                break;
            case 'sale':
                xpGain = 100;
                message = "Lucro! A Alcateia cresce."; // Wolf Pack grows
                break;
            default:
                xpGain = 0;
        }

        return {
            newXP: currentXP + xpGain,
            message
        };

    } catch (error) {
        console.error("Guardian Logic Error (processInteraction):", error);
        return { newXP: currentXP, message: "..." };
    }
}
