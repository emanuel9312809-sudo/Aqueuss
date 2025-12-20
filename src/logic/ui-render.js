
// --- UI RENDER MODULE ---
// Handles pure visual elements like SVGs to keep components clean.

import React from 'react';

export const WolfAvatar = ({ mood, level }) => {
    // Colors based on CSS variables
    const primary = 'var(--accent-primary)';   // Pink
    const secondary = 'var(--accent-secondary)'; // Cyan
    const text = 'var(--text-primary)';

    // Mood variations
    const isSleeping = mood === 'sleep';
    const isAlpha = mood === 'alpha';

    // Animation Style (Breathing)
    const breathStyle = {
        animation: 'wolfBreath 3s ease-in-out infinite',
        transformOrigin: 'center bottom'
    };

    // Injecting keyframes locally if not in global CSS
    // But we should put them in style.css ideally. 
    // For now, let's rely on the refactored style.css having generic animations or add inline style for the specific svg parts.

    return (
        <svg
            viewBox="0 0 200 200"
            width="100%"
            height="100%"
            style={isSleeping ? {} : breathStyle}
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* --- BASE HEAD SHAPE (Geometric) --- */}
            <path
                d="M100 180 L60 140 L40 80 L60 40 L100 60 L140 40 L160 80 L140 140 Z"
                fill="none"
                stroke={isAlpha ? primary : secondary}
                strokeWidth="4"
                filter="url(#glow)"
            />

            {/* --- EARS --- */}
            <path d="M60 40 L50 10 L80 30" fill="none" stroke={secondary} strokeWidth="3" />
            <path d="M140 40 L150 10 L120 30" fill="none" stroke={secondary} strokeWidth="3" />

            {/* --- EYES (Cyber) --- */}
            {isSleeping ? (
                <g stroke={text} strokeWidth="3">
                    <line x1="70" y1="90" x2="90" y2="90" />
                    <line x1="110" y1="90" x2="130" y2="90" />
                </g>
            ) : (
                <g fill={isAlpha ? primary : secondary} filter="url(#glow)">
                    <polygon points="70,90 90,85 80,100" />
                    <polygon points="130,90 110,85 120,100" />
                </g>
            )}

            {/* --- SNOUT --- */}
            <path d="M90 130 L100 140 L110 130" fill="none" stroke={text} strokeWidth="2" />

            {/* --- DETAILS (Circuit Lines) --- */}
            <path d="M100 60 L100 100" fill="none" stroke={secondary} strokeWidth="1" opacity="0.5" />
            <path d="M40 80 L60 80" fill="none" stroke={secondary} strokeWidth="1" opacity="0.5" />
            <path d="M160 80 L140 80" fill="none" stroke={secondary} strokeWidth="1" opacity="0.5" />

        </svg>
    );
};
