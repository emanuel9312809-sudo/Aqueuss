import React, { useState, useEffect } from 'react';
import { useGamification } from '../context/GamificationContext';
import { WolfAvatar } from '../logic/ui-render'; // Import SVG Render

export default function WolfPetV2({ size = 'full', minimal = false }) {
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

    const handlePetClick = () => {
        setClickCount(prev => prev + 1);

        // Interaction Logic
        if (petMood === 'sleep') {
            setMessage('Zzz... (O sistema descansa)');
            setTimeout(() => setMessage(''), 2000);
            return;
        }

        if (clickCount > 3) {
            setMessage('🐺 Sistemas Operacionais.');
            setTimeout(() => setMessage(''), 2000);
            setClickCount(0);
        }
    };

    // --- SVG CONTAINER STYLES ---
    const containerStyle = {
        width: minimal ? '50px' : '200px',
        height: minimal ? '50px' : '200px',
        maxWidth: '100%',
        transition: 'transform 0.2s',
        transform: `scale(${minimal ? 0.8 : 1.2}) ${!facingRight ? 'scaleX(-1)' : ''}`, // Look at mouse
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
    };

    // Minimal View (Dashboard)
    if (minimal) {
        return (
            <div style={{ width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={handlePetClick}>
                <div style={containerStyle}>
                    <WolfAvatar mood={petMood} level={petLevel} />
                </div>
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
                    height: '280px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
            >
                {/* THE SVG WOLF */}
                <div style={containerStyle} onClick={handlePetClick}>
                    <WolfAvatar mood={petMood} level={petLevel} />
                </div>
            </div>

            {/* Interaction Bubble */}
            {message && (
                <div style={{ position: 'absolute', top: '20%', right: '10%', background: '#fff', color: '#000', padding: '5px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold', animation: 'fadeIn 0.3s', zIndex: 10 }}>
                    {message}
                </div>
            )}

            <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#888', fontStyle: 'italic' }}>
                {petMood === 'alpha' ? "Protocolo de Lucro Ativado." : (petMood === 'sleep' ? "Modo de Economia de Energia..." : "Monitorando transações.")}
            </div>
        </div>
    );
}
