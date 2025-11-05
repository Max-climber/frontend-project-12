import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser } from '../features/users/userSlice';

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const username = useSelector((state) => state.user?.username);
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(clearUser());
    navigate('/login');
  };

  return (
    <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          Hexlet Chat
        </Link>
        {token && username && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleLogout}
          >
            Выйти
          </button>
        )}
      </div>
    </nav>
  );
}

