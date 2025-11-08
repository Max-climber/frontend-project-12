import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useRollbar } from '@rollbar/react';
import { clearUser } from '../features/users/userSlice';

export default function Header() {
  const { t } = useTranslation();
  const rollbar = useRollbar();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const username = useSelector((state) => state.user?.username);
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(clearUser());
    navigate('/login');
  };

  // Функция для тестирования Rollbar (только для разработки)
  const handleTestRollbar = () => {
    try {
      throw new Error('Тестовая ошибка Rollbar - проверка работы системы мониторинга');
    } catch (error) {
      rollbar.error('Тестовая ошибка для проверки Rollbar', error, {
        context: 'Header.testError',
        test: true,
      });
      alert('Тестовая ошибка отправлена в Rollbar! Проверьте раздел Items.');
    }
  };

  return (
    <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          {t('header.brand')}
        </Link>
        <div className="d-flex gap-2">
          {token && username && import.meta.env.DEV && (
            <button
              type="button"
              className="btn btn-warning btn-sm"
              onClick={handleTestRollbar}
              title="Тестовая ошибка для проверки Rollbar"
            >
              Test Rollbar
            </button>
          )}
          {token && username && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleLogout}
            >
              {t('header.exit')}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

