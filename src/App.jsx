import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import TransitionWrapper from './components/TransitionWrapper';
import { HashRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { WalletProvider } from './context/WalletContext';
import { InventoryProvider } from './context/InventoryContext';
import { GamificationProvider } from './context/GamificationContext';

// Components
import BusinessDashboard from './components/business/BusinessDashboard';
import StockPage from './components/business/StockPage';
import ClientsPage from './components/business/ClientsPage';

import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import FlashInput from './components/FlashInput';
import GoalsPage from './components/GoalsPage';
import SettingsPage from './components/SettingsPage';
import EnergyMap from './components/EnergyMap';
import GamificationPage from './components/GamificationPage';
import AccountsPage from './components/AccountsPage';

// Icons
import { LayoutDashboard, Target, Settings, Trophy, PlusCircle, Wallet, User, Briefcase, Package, Users } from 'lucide-react';

const Navigation = ({ mode }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Helper to determine if a tab is active
    const isActive = (path) => {
        if (path === '/' && location.pathname === '/') return true;
        if (path !== '/' && location.pathname.startsWith(path)) return true;
        return false;
    };

    const NavButton = ({ path, icon: Icon, label }) => (
        <button
            onClick={() => navigate(path)}
            style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                background: 'none', border: 'none',
                color: isActive(path) ? 'var(--accent-primary)' : '#666',
                transition: 'color 0.3s', cursor: 'pointer', flex: 1
            }}
        >
            <Icon size={24} style={{ marginBottom: '4px' }} />
            <span style={{ fontSize: '0.7rem', fontWeight: isActive(path) ? 'bold' : 'normal' }}>{label}</span>
        </button>
    );

    // Business Mode Navigation
    if (mode === 'business') {
        return (
            <div className='glass-panel' style={{
                position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
                width: '95%', maxWidth: '400px', padding: '0.8rem 1rem',
                borderRadius: '24px', zIndex: 1000,
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <NavButton path='/business' icon={LayoutDashboard} label='Resumo' />
                    <NavButton path='/stock' icon={Package} label='Estoque' />
                    <NavButton path='/clients' icon={Users} label='Clientes' />
                    <NavButton path='/settings' icon={Settings} label='Ajustes' />
                </div>
            </div>
        );
    }

    // Personal Mode Navigation (Default)
    return (
        <div className='glass-panel' style={{
            position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
            width: '95%', maxWidth: '400px', padding: '0.8rem 1rem',
            borderRadius: '24px', zIndex: 1000,
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <NavButton path='/' icon={LayoutDashboard} label='Início' />
                <NavButton path='/accounts' icon={Wallet} label='Contas' />

                <button
                    onClick={() => navigate('/add')}
                    style={{
                        width: '48px', height: '48px', borderRadius: '50%',
                        background: 'var(--accent-primary)',
                        border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#000', boxShadow: '0 0 15px var(--accent-primary)',
                        transform: 'translateY(-10px)', cursor: 'pointer'
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
    const [appMode, setAppMode] = useState('personal');
    const toggleMode = () => {
        if (appMode === 'personal') {
            setAppMode('business');
            navigate('/business');
        } else {
            setAppMode('personal');
            navigate('/');
        }
    };

    const navigate = useNavigate();
    const location = useLocation();
    const [direction, setDirection] = useState(0);

    const personalTabs = ['/', '/accounts', '/quest', '/settings'];
    const businessTabs = ['/business', '/stock', '/clients', '/settings'];

    const currentTabs = appMode === 'business' ? businessTabs : personalTabs;

    // Update direction when navigating manually
    const handleNavigate = (path) => {
        // Automatic via existing logic or forced? 
        // Handled by useEffect mainly or direct usage.
        // But we need to update state if we want click animations too.
        const newIndex = currentTabs.indexOf(path);
        const oldIndex = currentTabs.indexOf(location.pathname);
        if (newIndex !== -1 && oldIndex !== -1) {
            setDirection(newIndex > oldIndex ? 1 : -1);
        }
        navigate(path);
    };

    const handlers = useSwipeable({
        onSwipedLeft: (eventData) => {
            // Prevent swipe if horizontal scroll is detected or on specific elements
            if (eventData.event.target.closest('.nodrag, input, select')) return;

            const currentIndex = currentTabs.indexOf(location.pathname);
            if (currentIndex !== -1 && currentIndex < currentTabs.length - 1) {
                setDirection(1);
                navigate(currentTabs[currentIndex + 1]);
            }
        },
        onSwipedRight: (eventData) => {
            if (eventData.event.target.closest('.nodrag, input, select')) return;

            const currentIndex = currentTabs.indexOf(location.pathname);
            if (currentIndex !== -1 && currentIndex > 0) {
                setDirection(-1);
                navigate(currentTabs[currentIndex - 1]);
            }
        },
        preventScrollOnSwipe: true,
        trackMouse: true
    });

    const Page = ({ children }) => (
        <TransitionWrapper custom={direction}>
            {children}
        </TransitionWrapper>
    );

    return (
        <div className='container' {...handlers} style={{ paddingBottom: '80px', position: 'relative', minHeight: '100vh', overflowX: 'hidden' }}>

            {/* Top Bar */}
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: '1rem', padding: '1rem 0'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate('/')}>
                    <div style={{
                        width: '40px', height: '40px', borderRadius: '12px',
                        background: 'var(--accent-primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 0 15px var(--accent-primary)'
                    }}>
                        <Wallet size={24} color="#000" />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', lineHeight: '1.1' }}>Aequus</h1>
                        <span style={{
                            fontSize: '0.7rem',
                            background: 'var(--glass-bg)',
                            color: 'var(--accent-primary)',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            border: '1px solid var(--accent-primary)'
                        }}>
                            v1.16.0
                        </span>
                    </div>
                </div>

                {/* MODE TOGGLE */}
                <div onClick={toggleMode} style={{
                    width: '36px', height: '36px', borderRadius: '50%', background: 'var(--glass-bg)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid var(--accent-primary)', cursor: 'pointer'
                }}>
                    {appMode === 'personal' ? <Briefcase size={18} color="var(--accent-primary)" /> : <User size={18} color="var(--accent-primary)" />}
                </div>
            </div>

            {/* Main Content Area - Routes */}
            <div className='content-area'>
                <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                    <Routes location={location} key={location.pathname}>
                        {/* Personal Routes */}
                        <Route path="/" element={
                            <Page>
                                <Dashboard />
                                <EnergyMap />
                                <TransactionList />
                            </Page>
                        } />
                        <Route path="/add" element={<FlashInput />} />
                        <Route path="/goals" element={<GoalsPage />} />
                        <Route path="/quest" element={<Page><GamificationPage /></Page>} />
                        <Route path="/accounts" element={<Page><AccountsPage /></Page>} />
                        <Route path="/settings" element={<Page><SettingsPage /></Page>} />

                        {/* Business Routes */}
                        <Route path="/business" element={<Page><BusinessDashboard /></Page>} />
                        <Route path="/stock" element={<Page><StockPage /></Page>} />
                        <Route path="/clients" element={<Page><ClientsPage /></Page>} />

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </AnimatePresence>
            </div>

            <Navigation mode={appMode} />

        </div>
    );
};


export default function App() {
    return (
        <ThemeProvider>
            <GamificationProvider>
                <WalletProvider>
                    <InventoryProvider>
                        <HashRouter>
                            <AppContent />
                        </HashRouter>
                    </InventoryProvider>
                </WalletProvider>
            </GamificationProvider>
        </ThemeProvider>
    );
}
