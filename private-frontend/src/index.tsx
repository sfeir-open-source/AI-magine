import { App } from '@/src/app';
import { createRoot } from 'react-dom/client';
import '@/src/globals.css';
import '@/src/config/i18n';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');
createRoot(rootElement).render(<App />);
