
// --- UI RENDER MODULE ---
// Handles pure visual elements like SVGs to keep components clean.
// Updated: Vector Flame Style (No Pixels, No Rects)

import React from 'react';

export const WolfAvatar = ({ mood, level }) => {
    // Mood variations
    const isSleeping = mood === 'sleep';
    const isAlpha = mood === 'alpha';

    // Animation Style (Breathing)
    // We apply this to the main group
    const breathStyle = {
        animation: isSleeping ? 'wolfBreath 4s ease-in-out infinite' : 'wolfBreath 2s ease-in-out infinite',
        transformOrigin: 'center center'
    };

    return (
        <svg
            viewBox="0 0 200 200"
            width="100%"
            height="100%"
            xmlns="http://www.w3.org/2000/svg"
            style={{ overflow: 'visible' }}
        >
            <defs>
                <linearGradient id="wolfGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00E5FF" /> {/* Cyan/Neon Blue */}
                    <stop offset="50%" stopColor="#7B2CBF" /> {/* Deep Purple */}
                    <stop offset="100%" stopColor="#FF007F" /> {/* Cyber Pink */}
                </linearGradient>

                <filter id="vectorGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            <g style={breathStyle}>
                {/* --- FLUID WOLF SILHOUETTE --- */}
                {/* Drawn with bezier curves for a smooth, organic 'flame' look */}
                <path
                    d="M100 180 
                       C 80 180, 50 160, 40 120 
                       C 35 100, 20 80, 40 60 
                       C 50 50, 60 80, 70 90 
                       C 75 70, 60 30, 80 20 
                       C 95 15, 105 15, 120 20 
                       C 140 30, 125 70, 130 90 
                       C 140 80, 150 50, 160 60 
                       C 180 80, 165 100, 160 120 
                       C 150 160, 120 180, 100 180 Z"
                    fill="url(#wolfGradient)"
                    filter="url(#vectorGlow)"
                    stroke="none"
                />

                {/* --- EYES --- */}
                {isSleeping ? (
                    // Closed Eyes (Curved Lines)
                    <path d="M70 110 Q 80 120, 90 110 M110 110 Q 120 120, 130 110"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="3"
                        strokeLinecap="round" />
                ) : (
                    // Open Eyes (Sharp/Alpha)
                    <g>
                        <path d="M65 105 Q 80 95, 95 105" fill="none" stroke="#fff" strokeWidth={isAlpha ? "4" : "3"} strokeLinecap="round" />
                        <path d="M105 105 Q 120 95, 135 105" fill="none" stroke="#fff" strokeWidth={isAlpha ? "4" : "3"} strokeLinecap="round" />
                        {/* Pupils if Alpha */}
                        {isAlpha && (
                            <path d="M80 102 L80 108 M120 102 L120 108" stroke="#00E5FF" strokeWidth="3" />
                        )}
                    </g>
                )}
            </g>

        </svg>
    );
};
