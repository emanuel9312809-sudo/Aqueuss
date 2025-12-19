import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, X } from 'lucide-react';

const LevelUpModal = ({ isOpen, level, onClose }) => {
  if (!isOpen) return null;

  useEffect(() => {
    if (isOpen) {
      // Fire confetti!
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.8)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(5px)'
    }}>
      <div className="glass-panel" style={{
        width: '90%', maxWidth: '350px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '2rem', position: 'relative',
        animation: 'fadeIn 0.5s ease'
      }}>
        
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
        >
          <X />
        </button>

        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #FFD700 0%, #FFAA00 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '1.5rem',
          boxShadow: '0 0 30px rgba(255, 215, 0, 0.5)'
        }}>
          <Trophy size={40} color="#000" />
        </div>

        <h2 style={{ 
          fontSize: '2rem', fontWeight: 'bold', margin: 0,
          background: 'linear-gradient(to right, #FFD700, #FFAA00)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
          LEVEL UP!
        </h2>
        
        <p style={{ fontSize: '1.2rem', color: '#fff', margin: '1rem 0' }}>
            Você alcançou o Nível <span style={{ color: '#FFD700', fontWeight: 'bold' }}>{level}</span>
        </p>

        <p style={{ textAlign: 'center', color: '#aaa', fontSize: '0.9rem', marginBottom: '2rem' }}>
            Continue registrando transações para desbloquear mais recompensas!
        </p>

        <button
          onClick={onClose}
          style={{
            background: 'linear-gradient(90deg, #00E5FF, #00B0FF)',
            border: 'none', padding: '1rem 2rem', borderRadius: '12px',
            color: '#000', fontWeight: 'bold', fontSize: '1rem',
            cursor: 'pointer', width: '100%',
            boxShadow: '0 0 20px rgba(0, 229, 255, 0.4)'
          }}
        >
          RESGATAR RECOMPENSAS
        </button>

      </div>
    </div>
  );
};

export default LevelUpModal;
