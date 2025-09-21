
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiLogin } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const nav = useNavigate();
  const { login: setAuthToken } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  async function submit(e){
    e.preventDefault();
    setErr('');
    setLoading(true);

    try{
      
      localStorage.removeItem('user');

      const { token, user } = await apiLogin(email, password); 
      console.log('Login got token:', !!token, 'user:', user);

      if (!token) throw new Error('No token from backend');

      setAuthToken(token); 
      
      nav('/parts');
    }catch(e){
      console.error('Login error:', e);
      setErr('Neispravan email ili lozinka.');
    }finally{
      setLoading(false);
    }
  }

  return (
      <div className="page page--login">
        <h2> Login </h2>
        <form onSubmit={submit} className="form-section form-section--login">
          {err && <div className="form-error">{err}</div>}
          <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <input type="password" placeholder="Lozinka" value={password} onChange={e=>setPassword(e.target.value)} required />
          <button type="submit" disabled={loading}>{loading ? 'Logging…' : 'Login'}</button>
          <div className="form-note">
            No account? <Link to="/register">Register</Link>
          </div>
        </form>
      </div>
    );

}
