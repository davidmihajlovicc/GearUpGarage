import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthBar({ onShowRegister }) {
  const { token, login, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    const email = prompt('Email:');
    const password = prompt('Lozinka:');
    if (!email || !password) return;
    try {
      setLoading(true);
      await login(email, password);
      alert('Uspješna prijava!');
    } catch {
      alert('Login nije uspio');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="btn-group">
      {!token ? (
        <>
          <button className="btn btn--ghost" onClick={handleLogin} disabled={loading}>
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M10 17v-2h4v2h-4Zm7 4H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Zm-5-13V4H7v16h10V8h-5Z"/>
            </svg>
            Login
          </button>
          <button className="btn btn--primary" onClick={onShowRegister}>
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M12 12a5 5 0 1 0-5-5a5 5 0 0 0 5 5Zm-7 8a7 7 0 0 1 14 0v1H5v-1Z"/>
            </svg>
            Register
          </button>
        </>
      ) : (
        <button className="btn btn--ghost" onClick={logout}>
          Logout
        </button>
      )}
    </div>
  );
}
