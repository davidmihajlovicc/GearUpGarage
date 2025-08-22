// src/components/navbar.jsx
import { Link, useLocation } from 'react-router-dom';

function getIsAdminFromToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return !!payload.isAdmin;
  } catch {
    return false;
  }
}

export default function Navbar(){
  const { pathname } = useLocation();
  const token = localStorage.getItem('token');

  let user = null;
  const raw = localStorage.getItem('user');
  if (raw && raw !== 'undefined' && raw !== 'null') {
    try { user = JSON.parse(raw); } catch { user = null; }
  }

  const isAdmin = user?.isAdmin || (token ? getIsAdminFromToken(token) : false);

  return (
    <nav className="nav">
      <div className="nav__inner">
        <Link to="/" className="nav__logo">GearUp Garage</Link>
        <div className="nav__links">
          <Link className={`nav__link ${pathname==='/'?'is-active':''}`} to="/">Home</Link>
          <Link className={`nav__link ${pathname.startsWith('/parts')?'is-active':''}`} to="/parts">Parts</Link>
          <Link className={`nav__link ${pathname.startsWith('/cart')?'is-active':''}`} to="/cart">Cart</Link>
        </div>
        {!token ? (
          <div className="btn-group">
            <Link className="btn btn--ghost" to="/login">Login</Link>
            <Link className="btn btn--primary" to="/register">Register</Link>
          </div>
        ) : (
          <>
            <Link className={`nav__link ${pathname.startsWith('/profile')?'is-active':''}`} to="/profile">Profile</Link>
            {isAdmin && (
              <Link className={`nav__link ${pathname.startsWith('/admin')?'is-active':''}`} to="/admin">Admin panel</Link>
            )}
            <button
              className="btn btn--ghost"
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href='/';
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
