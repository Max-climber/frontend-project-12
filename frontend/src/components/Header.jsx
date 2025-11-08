import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { clearUser } from '../features/users/userSlice'

export default function Header() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const username = useSelector((state) => state.user?.username)
  const token = localStorage.getItem('token')

  const handleLogout = () => {
    localStorage.removeItem('token')
    dispatch(clearUser())
    navigate('/login')
  }

  // Убрали тестовую функцию Rollbar, чтобы не мешать автоматическим тестам

  return (
    <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          {t('header.brand')}
        </Link>
        <div className="d-flex gap-2">
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
  )
}
