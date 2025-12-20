import React, { useState } from 'react';
import { useGamification } from '../context/GamificationContext';
import { WolfAvatar } from '../logic/ui-render';

export default function WolfPetV2({ size = 'full', minimal = false }) {
    const context = useGamification();
    const petMood = context?.petMood || 'idle';
    const petLevel = context?.petLevel || 1;
    const [message, setMessage] = useState('');
    const [clickCount, setClickCount] = useState(0);

    const handlePetClick = () => {
        setClickCount(prev => prev + 1);
        if (clickCount > 2) {
            setMessage(petMood === 'sleep' ? 'Zzz...' : 'Alpha Online.');
            setTimeout(() => setMessage(''), 2000);
            setClickCount(0);
        }
    };

    const containerStyle = {
        width: minimal ? '50px' : '200px',
        height: minimal ? '50px' : '200px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.2s',
    };

    return (
        <div
            className={minimal ? "" : "glass-panel"}
            style={minimal ? {} : { padding: '2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}
        >
            {!minimal && (
                <h3 style={{ marginBottom: '1rem', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '2px' }}>
                    Guardião (v1.15)
                </h3>
            )}

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={containerStyle} onClick={handlePetClick}>
                    <WolfAvatar mood={petMood} level={petLevel} />
                </div>
            </div>

            {!minimal && message && (
                <div style={{ position: 'absolute', top: '20%', right: '10%', background: '#fff', color: '#000', padding: '5px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    {message}
                </div>
            )}
        </div>
    );
}
