import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './i18next.js'; // инициализация i18next
import App from './App.jsx';
import store from './app/store.js';
import { Provider } from 'react-redux';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
