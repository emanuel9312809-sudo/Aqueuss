import { useState, useEffect } from 'react'
import { LayoutDashboard, PlusCircle, Trophy, Target, Settings, Sun, Moon, Bell } from 'lucide-react';

import FlashInput from './components/FlashInput'
import TransactionList from './components/TransactionList'
import Dashboard from './components/Dashboard'
import AnalyticsPanel from './components/AnalyticsPanel'
import EnergyMap from './components/EnergyMap'
import GamificationPage from './components/GamificationPage'
import GoalsPage from './components/GoalsPage'
import SettingsPage from './components/SettingsPage'
import { TransactionProvider, useTransaction } from './context/TransactionContext'
import { ThemeProvider, useTheme } from './context/ThemeContext'

const AppContent = () => {
  const [view, setView] = useState('dashboard'); 
  const { theme, toggleTheme } = useTheme();
  const { transactions } = useTransaction();
  const [showNotification, setShowNotification] = useState(false);

  // Notification Logic (Mock)
  useEffect(() => {
    // Check if Transport > 85% basic logic
    const totalTransport = transactions
      .filter(tx => tx.category === 'Transporte')
      .reduce((acc, tx) => acc + tx.amount, 0);
    
    // Mock budget 200
    if (totalTransport > 180) {
        setShowNotification(true);
    }
  }, [transactions]);

  const NavButton = ({ id, icon: Icon, label }) => (
    <button 
      onClick={() => setView(id)}
      style={{
        background: 'transparent',
        border: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        color: view === id ? 'var(--accent-primary)' : 'var(--text-secondary)',
        cursor: 'pointer',
        flex: 1
      }}
    >
      <Icon size={24} />
      <span style={{ fontSize: '0.7rem' }}>{label}</span>
    </button>
  );

  return (
    <div className="app-container" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      height: '100vh', 
      overflow: 'hidden',
      position: 'relative',
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      transition: 'all 0.3s ease'
    }}>
        
      {/* Notifications Banner */}
      {showNotification && (
        <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            background: 'var(--accent-secondary)', color: 'white',
            padding: '0.8rem', fontSize: '0.9rem', fontWeight: 'bold',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            zIndex: 200, animation: 'fadeIn 0.5s'
        }}>
            <Bell size={18} />
            ⚠️ Alerta: Orçamento de Transporte a 90%!
            <button onClick={() => setShowNotification(false)} style={{ background: 'none', border: 'none', color: 'white', marginLeft: 'auto', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      {/* Main Content Area */}
      <div style={{ 
        flex: 1, 
        width: '100%', 
        maxWidth: '450px', 
        overflowY: 'auto',
        padding: '1.5rem',
        paddingTop: showNotification ? '3.5rem' : '1.5rem',
        paddingBottom: '80px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1rem'
      }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }} className="title">
              Aequus
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button 
                    onClick={toggleTheme} 
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}
                >
                    {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
                </button>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--glass-border)' }}></div> 
            </div>
        </div>

        {view === 'dashboard' && (
          <>
            <Dashboard />
            <EnergyMap />
            <AnalyticsPanel />
            <TransactionList />
          </>
        )}

        {view === 'add' && (
           <>
              <FlashInput />
              <TransactionList />
           </>
        )}

        {view === 'quest' && <GamificationPage />}
        
        {view === 'goals' && <GoalsPage />}

        {view === 'settings' && <SettingsPage />}

      </div>

      {/* Bottom Navigation */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '70px',
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--glass-border)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100
      }}>
        <div style={{ width: '100%', maxWidth: '450px', display: 'flex', justifyContent: 'space-between', padding: '0 1rem' }}>
          <NavButton id="dashboard" icon={LayoutDashboard} label="Home" />
          <NavButton id="quest" icon={Trophy} label="Quest" />
          <button 
            onClick={() => setView('add')}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent-primary) 0%, #00B0FF 100%)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000',
              boxShadow: '0 0 15px rgba(0, 229, 255, 0.4)',
              transform: 'translateY(-10px)',
              cursor: 'pointer'
            }}
          >
            <PlusCircle size={28} />
          </button>
          <NavButton id="goals" icon={Target} label="Metas" />
          <NavButton id="settings" icon={Settings} label="Ajustes" />
        </div>
      </div>

    </div>
  );
};

export default function App() {
    return (
        <ThemeProvider>
            <TransactionProvider>
                <AppContent />
            </TransactionProvider>
        </ThemeProvider>
    );
}
