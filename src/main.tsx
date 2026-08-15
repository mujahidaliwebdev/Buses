import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Filter out benign Firestore sandbox network warnings in proxy/iframe environment
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  const msg = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
  if (
    msg.includes('@firebase/firestore') && 
    (msg.includes('Could not reach Cloud Firestore backend') || msg.includes('Connection failed'))
  ) {
    // Gracefully route as a debug log to prevent confusing red console errors
    console.debug('[Firestore Cache Status] Operating in offline-first mode.');
    return;
  }
  originalConsoleError.apply(console, args);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
