import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app/App';
import { TelegramProvider } from './app/providers/TelegramProvider';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <TelegramProvider>
      <App />
    </TelegramProvider>
  </React.StrictMode>,
);

