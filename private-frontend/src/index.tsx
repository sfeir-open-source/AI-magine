import { App } from '@/src/app';
import { createRoot } from 'react-dom/client';
import '@/src/global.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');
createRoot(rootElement).render(<App />);
