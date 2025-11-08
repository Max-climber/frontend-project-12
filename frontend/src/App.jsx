// App.jsx
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRollbar } from '@rollbar/react';
import ChatPage from './pages/ChatPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { NotFoundPage } from './pages/NotFoundPage';
import Header from './components/Header';

function App() {
  const rollbar = useRollbar();

  // Тестовая ошибка для проверки Rollbar (только в продакшене)
  useEffect(() => {
    // Создаем тестовую ошибку только один раз при загрузке приложения
    // и только если это продакшен окружение
    if (import.meta.env.MODE === 'production' && !sessionStorage.getItem('rollbarTestErrorSent')) {
      try {
        // Искусственно создаем ошибку для тестирования Rollbar
        throw new Error('Тестовая ошибка Rollbar - проверка работы системы мониторинга');
      } catch (error) {
        rollbar.error('Тестовая ошибка для проверки Rollbar', error, {
          context: 'App.testError',
          test: true,
        });
        sessionStorage.setItem('rollbarTestErrorSent', 'true');
      }
    }
  }, [rollbar]);

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </BrowserRouter>
  );
}

export default App;