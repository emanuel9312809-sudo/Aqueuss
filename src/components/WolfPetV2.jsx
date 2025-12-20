import React, { useState, useEffect } from 'react';
import { useGamification } from '../context/GamificationContext';

// Import Versioned Sprite Sheets (Cache Busting)
import wolfSheetIdle from '../assets/wolf_sheet_idle_v12.png';
import wolfSheetAlpha from '../assets/wolf_sheet_alpha_v12.png';
import wolfSheetRest from '../assets/wolf_sheet_rest_v12.png';

export default function WolfPetV2({ size = 'full', minimal = false }) {
    // Context Safety - The Context now already uses logic-guardian.js
    // So the data we get here (petMood) is already processed by the new logic.
    // We just render it.
    const context = useGamification();
    const petMood = context?.petMood || 'idle';
    const petLevel = context?.petLevel || 1;

    // Interaction State
    const [clickCount, setClickCount] = useState(0);
    const [message, setMessage] = useState('');

    // Dynamic styles for "Looking at Mouse" effect (Flip horizontally)
    const [facingRight, setFacingRight] = useState(true);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const width = window.innerWidth;
            const x = e.clientX;
            // If mouse is on the left half, face left. Right half, face right.
            if (x < width / 2) setFacingRight(false);
            else setFacingRight(true);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Determine Sprite Sheet
    const getSpriteSheet = () => {
        if (petMood === 'sleep') return wolfSheetRest;
        if (petMood === 'alpha') return wolfSheetAlpha;
        return wolfSheetIdle;
    };

    const handlePetClick = () => {
        setClickCount(prev => prev + 1);

        // Interaction Logic
        if (petMood === 'sleep') {
            setMessage('Zzz... (Não acorde o Alpha)');
            setTimeout(() => setMessage(''), 2000);
            return;
        }

        if (clickCount > 3) {
            setMessage('🐺 Estou atento!');
            setTimeout(() => setMessage(''), 2000);
            setClickCount(0);
        }
    };

    // --- SPRITE ANIMATION STYLES ---
    // We assume 4 frames per sheet, 64px width per frame.
    // background-size: 400% 100% -> 4 frames wide.
    // animation: steps(4) -> cycles 4 frames.

    const spriteStyle = {
        width: '64px',
        height: '64px',
        backgroundImage: `url(${getSpriteSheet()})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '0 0',
        backgroundSize: '400% 100%',
        imageRendering: 'pixelated',
        animation: 'playStrip 1s steps(4) infinite',
        transform: `scale(${minimal ? 1 : 3}) ${!facingRight ? 'scaleX(-1)' : ''}`,
        transition: 'transform 0.2s',
        display: 'inline-block'
    };

    // Keyframes are now in style.css! Removing inline keyframes to respect new architecture.

    // Minimal View (Dashboard)
    if (minimal) {
        return (
            <div style={{ width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={handlePetClick}>
                <div style={spriteStyle}></div>
            </div>
        );
    }

    // Full View (Gamification Page)
    return (
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>

            <h3 style={{ marginBottom: '1rem', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '2px' }}>
                Guardião Alpha (Lvl {petLevel})
            </h3>

            <div
                style={{
                    height: '250px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer'
                }}
                onClick={handlePetClick}
            >
                {/* The Sprite Element */}
                <div style={spriteStyle}></div>
            </div>

            {/* Interaction Bubble */}
            {message && (
                <div style={{ position: 'absolute', top: '20%', right: '10%', background: '#fff', color: '#000', padding: '5px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold', animation: 'fadeIn 0.3s' }}>
                    {message}
                </div>
            )}

            <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#888', fontStyle: 'italic' }}>
                {petMood === 'alpha' ? "O cheiro do lucro está no ar." : (petMood === 'sleep' ? "Recuperando energias..." : "Observando cada movimento.")}
            </div>
        </div>
    );
}
