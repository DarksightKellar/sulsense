import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './features/sulsense/ThemeContext';
import './index.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Unable to find the root element.');
}

createRoot(container).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
