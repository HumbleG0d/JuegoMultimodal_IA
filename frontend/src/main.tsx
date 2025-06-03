import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './i18n.tsx'; // Import i18n configuration
import { BrowserRouter } from "react-router";

const root = document.getElementById('root') as HTMLElement;

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
