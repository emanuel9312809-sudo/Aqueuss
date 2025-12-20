
// --- APP STATE MANAGEMENT FRAMEWORK ---
// This file will house the core React Context factories and persistence logic
// to declutter component files.

import { createContext, useContext, useState, useEffect } from 'react';

// --- GENERIC PERSISTENCE HOOK ---
// Saves state to localStorage automatically
export function usePersistentState(key, initialValue) {
    const [state, setState] = useState(() => {
        try {
            const saved = localStorage.getItem(key);
            if (saved) return JSON.parse(saved);
        } catch (error) {
            console.error(`Error loading state for key "${key}":`, error);
        }
        return initialValue;
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            console.error(`Error saving state for key "${key}":`, error);
        }
    }, [key, state]);

    return [state, setState];
}

// --- CONTEXT UTILS ---
export function createModuleContext() {
    return createContext(null);
}

export function useModule(context, moduleName) {
    const ctx = useContext(context);
    if (!ctx) {
        throw new Error(`use${moduleName} must be used within a ${moduleName}Provider`);
    }
    return ctx;
}
