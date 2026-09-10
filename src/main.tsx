import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '../app/globals.css';

const loaderStartedAt = performance.now();
const minLoaderVisibleMs = 1000;

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

  const elapsedMs = performance.now() - loaderStartedAt;
  const remainingMs = Math.max(minLoaderVisibleMs - elapsedMs, 0);

  window.setTimeout(() => {
    loader.classList.add('app-loader-hidden');
    window.setTimeout(() => loader.remove(), 300);
  }, remainingMs);
});
