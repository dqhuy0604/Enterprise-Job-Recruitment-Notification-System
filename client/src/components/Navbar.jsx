import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const dashboardPath = user?.role === 'student'
    ? '/student'
    : user?.role === 'admin'
      ? '/admin'
      : '/recruiter';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">
          <span className="brand-icon">R</span>
          RecruitHub
        </Link>

        <nav className="nav-links">
          <NavLink to="/" end>Trang chủ</NavLink>
          <NavLink to="/jobs">Việc làm</NavLink>
          <NavLink to="/business">Dành cho Doanh nghiệp</NavLink>

          <NotificationBell />

          {isAuthenticated ? (
            <div className="user-menu">
              <button type="button" className="user-menu-trigger" onClick={() => setMenuOpen(!menuOpen)}>
                {user.name} ▾
              </button>
              {menuOpen && (
                <div className="user-menu-dropdown">
                  <Link to={dashboardPath} onClick={() => setMenuOpen(false)}>Trang cá nhân</Link>
                  <button type="button" onClick={handleLogout}>Đăng xuất</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="btn btn-ghost btn-sm">Đăng nhập</Link>
              <Link to="/register/student" className="btn btn-primary btn-sm">Đăng ký</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
