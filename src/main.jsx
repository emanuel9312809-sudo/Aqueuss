import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// --- AGGRESSIVE CACHE REFRESH LOGIC ---
const APP_VERSION = '1.20.0';
const savedVersion = localStorage.getItem('app_version');

if (savedVersion !== APP_VERSION) {
    console.log(`Version mismatch: Saved ${savedVersion} vs Current ${APP_VERSION}. Forcing SW unregister.`);
    localStorage.setItem('app_version', APP_VERSION);

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
            for (let registration of registrations) {
                registration.unregister();
                console.log('Unregistered SW:', registration);
            }
            // Force reload skipping cache
            window.location.reload(true);
        });
    }
}
// --------------------------------------

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>,
)
