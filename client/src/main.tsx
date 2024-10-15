import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './i18n';
import { LanguageProvider } from "./contexts/LanguageContext.tsx";
import { ThemeProvider } from "./contexts/ThemeContext.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
    <LanguageProvider>
      <App />
    </LanguageProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
