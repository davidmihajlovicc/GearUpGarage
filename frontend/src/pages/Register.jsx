import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiRegister } from '../api/auth';

export default function Register() {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');

  async function submit(e){
    e.preventDefault();
    setErr(''); setOk('');
    if (password !== confirm){ setErr('Lozinke se ne podudaraju.'); return; }
    setLoading(true);
    try{
      await apiRegister(email, password); // server ignorira is_admin
      setOk('Registracija uspješna. Sada se možete prijaviti.');
      setTimeout(()=> nav('/login'), 600);
    }catch(e){
      const msg = e?.response?.data?.error || 'Registracija nije uspjela.';
      setErr(msg);
    }finally{
      setLoading(false);
    }
  }

  return (
  <div className="page register-page">
    <h2 className="page-title">Registracija</h2>
    <form onSubmit={submit} className="form-section register-form">
      {err && <div className="error-msg">{err}</div>}
      {ok && <div className="success-msg">{ok}</div>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e=>setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Lozinka"
        value={password}
        onChange={e=>setPassword(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Potvrdi lozinku"
        value={confirm}
        onChange={e=>setConfirm(e.target.value)}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Slanje…' : 'Kreiraj račun'}
      </button>

      <div className="form-hint">
        Već imaš račun? <Link to="/login">Prijava</Link>
      </div>
    </form>
  </div>
);

}
