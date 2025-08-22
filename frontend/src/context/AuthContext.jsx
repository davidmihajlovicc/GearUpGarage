import { createContext, useContext, useEffect, useState } from 'react';

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');

  // sync s localStorage (npr. kad user ručno obriše token u drugom tabu)
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'token') setToken(e.newValue || '');
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
  };

  return (
    <AuthCtx.Provider value={{ token, isAuthed: !!token, login, logout, setToken }}>
      {children}
    </AuthCtx.Provider>
  );
}
