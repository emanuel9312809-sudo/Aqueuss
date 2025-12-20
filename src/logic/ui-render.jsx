
// --- UI RENDER MODULE ---
// Handles pure visual elements - Vector Flame Wolf (v1.15.0)

import React from 'react';

export const WolfAvatar = ({ mood, level }) => {
    // Mood Config
    const isSleeping = mood === 'sleep';
    const isAlpha = mood === 'alpha';

    // Animation: Gentle Float/Breath
    const breathStyle = {
        animation: 'wolfBreath 3s ease-in-out infinite',
        filter: 'drop-shadow(0 0 8px rgba(0, 229, 255, 0.4))'
    };

    return (
        <svg
            viewBox="0 0 100 100"
            width="100%"
            height="100%"
            xmlns="http://www.w3.org/2000/svg"
            style={{ overflow: 'visible' }}
        >
            <defs>
                <linearGradient id="flameGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00E5FF" /> {/* Cyan */}
                    <stop offset="100%" stopColor="#FF007F" /> {/* Magenta */}
                </linearGradient>
            </defs>

            <g style={breathStyle}>
                {/* --- SIMPLE FLAME SILHOUETTE --- */}
                {/* Minimalist "TikTok" Style - Single Fluid Path */}
                <path
                    d="M50 90 
                       C 40 90, 25 80, 25 60 
                       C 25 45, 35 30, 45 20 
                       C 48 15, 52 15, 55 20
                       C 65 30, 75 45, 75 60
                       C 75 80, 60 90, 50 90 Z"
                    fill="url(#flameGradient)"
                    opacity={isSleeping ? 0.5 : 0.9}
                />

                {/* --- EYES (Negative Space or White) --- */}
                {!isSleeping && (
                    <g fill="#fff">
                        <circle cx="42" cy="55" r={isAlpha ? "3" : "2.5"} />
                        <circle cx="58" cy="55" r={isAlpha ? "3" : "2.5"} />
                    </g>
                )}

                {isSleeping && (
                    <path d="M38 55 Q 42 58, 46 55 M54 55 Q 58 58, 62 55"
                        fill="none" stroke="#fff" strokeWidth="2" opacity="0.7" />
                )}
            </g>
        </svg>
    );
};
