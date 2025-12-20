import React from 'react';
import { useGamification } from '../context/GamificationContext';

export default function WolfPet({ size = 'full', minimal = false }) {
    // Safety check for context
    const context = useGamification();
    const petMood = context?.petMood || 'idle';
    const petLevel = context?.petLevel || 1;

    // CSS Interactions
    const style = {
        fontSize: minimal ? '30px' : '80px',
        filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))',
        transition: 'all 0.5s ease',
        cursor: 'pointer',
        display: 'inline-block',
        animation: petMood === 'alpha' ? 'bounce 1s infinite' : 'breathe 3s infinite alternate'
    };

    // Inline Keyframes (injected once)
    const keyframes = `
      @keyframes breathe { from { transform: scale(1); } to { transform: scale(1.05); } }
      @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
    `;

    const renderEmoji = () => {
        if (petMood === 'sleep') return '💤🐺';
        if (petMood === 'alpha') return '🐺💰';
        return '🐺';
    };

    if (minimal) {
        return (
            <div style={{ position: 'relative', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <style>{keyframes}</style>
                <div style={style}>{renderEmoji()}</div>
            </div>
        );
    }

    return (
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <style>{keyframes}</style>
            
            <h3 style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>Guardião (Nível {petLevel})</h3>
            
            <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={style}>{renderEmoji()}</div>
            </div>

            <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#888' }}>
                {petMood === 'alpha' ? "O Lobo está celebrando!" : "Vigilante e fiel."}
            </div>
        </div>
    );
}
