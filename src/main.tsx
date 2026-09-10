import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '../app/globals.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

requestAnimationFrame(() => {
  const loader = document.getElementById('app-loader');

  if (!loader) {
    return;
  }

  loader.classList.add('app-loader-hidden');
  window.setTimeout(() => loader.remove(), 300);
});
