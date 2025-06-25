import ReactDOM from 'react-dom/client';
import React from 'react';
import App from './App.tsx';
import './index.css';
import './i18n.tsx'; // Import i18n configuration
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n.tsx';


 ReactDOM.createRoot(document.getElementById('root')!).render(
     <React.StrictMode>
       <I18nextProvider i18n={i18n}>
         <App />
       </I18nextProvider>
     </React.StrictMode>
   );
