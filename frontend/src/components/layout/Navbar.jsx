import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand fw-semibold" to="/dashboard">
          Splitwise College
        </Link>

        <div className="d-flex align-items-center gap-3">
          <span className="navbar-text text-white-50 small d-none d-sm-inline">
            {user?.email}
          </span>
          <NavLink className="btn btn-outline-light btn-sm" to="/dashboard">
            Dashboard
          </NavLink>
          <button type="button" className="btn btn-light btn-sm" onClick={logout}>
            Log out
          </button>
        </div>
      </div>
    </nav>
  );
}
