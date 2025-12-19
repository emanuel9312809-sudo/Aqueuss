import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { WalletProvider } from './context/WalletContext';
import { GamificationProvider } from './context/GamificationContext';

// Components
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import FlashInput from './components/FlashInput';
import GoalsPage from './components/GoalsPage';
import SettingsPage from './components/SettingsPage';
import EnergyMap from './components/EnergyMap';
import GamificationPage from './components/GamificationPage';
import AccountsPage from './components/AccountsPage';

// Icons
import { LayoutDashboard, Target, Settings, Trophy, PlusCircle, Wallet, User } from 'lucide-react';

const Navigation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Helper to determine if a tab is active (matches current path)
    const isActive = (path) => {
        if (path === '/' && location.pathname === '/') return true;
        if (path !== '/' && location.pathname.startsWith(path)) return true;
        return false;
    };

    const NavButton = ({ path, icon: Icon, label }) => (
        <button
            onClick={() => navigate(path)}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'none',
                border: 'none',
                color: isActive(path) ? '#00E5FF' : '#666',
                transition: 'color 0.3s',
                cursor: 'pointer',
                flex: 1
            }}
        >
            <Icon size={24} style={{ marginBottom: '4px' }}/>
            <span style={{ fontSize: '0.7rem', fontWeight: isActive(path) ? 'bold' : 'normal' }}>{label}</span>
        </button>
    );

    return (
        <div className='glass-panel' style={{ 
            position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', 
            width: '95%', maxWidth: '400px', padding: '0.8rem 1rem', 
            borderRadius: '24px', zIndex: 1000,
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.1)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <NavButton path='/' icon={LayoutDashboard} label='Início' />
                <NavButton path='/accounts' icon={Wallet} label='Contas' />
                
                {/* Floating Action Button for Add */}
                <button 
                    onClick={() => navigate('/add')}
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
                
                <NavButton path='/quest' icon={Trophy} label='Missões' />
                <NavButton path='/settings' icon={Settings} label='Ajustes' />
            </div>
        </div>
    );
};

const AppContent = () => {
  return (
    <div className='container' style={{ paddingBottom: '80px', position: 'relative' }}>
      
      {/* Top Bar */}
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        marginBottom: '1rem', padding: '1rem 0' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ 
            width: '40px', height: '40px', borderRadius: '12px', 
            background: 'linear-gradient(135deg, #00E5FF 0%, #00B0FF 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 15px rgba(0, 229, 255, 0.3)'
          }}>
            <Wallet size={24} color="#000" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', lineHeight: '1.1' }}>Aequus</h1>
            <span style={{ 
                fontSize: '0.7rem', 
                background: 'rgba(0, 229, 255, 0.1)', 
                color: '#00E5FF', 
                padding: '2px 6px', 
                borderRadius: '4px',
                border: '1px solid rgba(0, 229, 255, 0.3)'
            }}>
                v1.5.0
            </span>
          </div>
        </div>
        <div style={{ 
            width: '32px', height: '32px', borderRadius: '50%', background: '#333', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #444' 
        }}>
            <User size={18} color="#aaa" />
        </div>
      </div>

      {/* Main Content Area - Routes */}
      <div className='content-area'>
        <Routes>
            <Route path="/" element={
                <>
                    <Dashboard />
                    <EnergyMap />
                    <TransactionList />
                </>
            } />
            <Route path="/add" element={<FlashInput />} />
            <Route path="/goals" element={<GoalsPage />} />
            <Route path="/quest" element={<GamificationPage />} />
            <Route path="/accounts" element={<AccountsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>

      <Navigation />

    </div>
  );
};

export default function App() {
    return (
        <ThemeProvider>
            <GamificationProvider>
                <WalletProvider>
                    <BrowserRouter>
                        <AppContent />
                    </BrowserRouter>
                </WalletProvider>
            </GamificationProvider>
        </ThemeProvider>
    );
}
