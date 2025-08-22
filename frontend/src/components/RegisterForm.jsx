import { useState } from 'react';
import { registerUser } from '../api';

export default function RegisterForm({ onClose }) {
  const [form, setForm] = useState({ email: '', password: '', is_admin: false });
  const [loading, setLoading] = useState(false);

  async function submit() {
    try {
      setLoading(true);
      await registerUser(form);
      alert('Registracija uspješna! Možete se prijaviti.');
      onClose?.();
    } catch (e) {
      alert('Registracija nije uspjela: ' + (e.response?.data?.error || 'Greška.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="form-section">
      <h2>User registration</h2>
      <input
        placeholder="Email"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
      />
      <input
        placeholder="Password"
        type="password"
        value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })}
      />
      <label>
        <input
          type="checkbox"
          checked={form.is_admin}
          onChange={e => setForm({ ...form, is_admin: e.target.checked })}
        />{' '}
        Admin korisnik
      </label>
      <div className="flex gap-2">
        <button onClick={submit} disabled={loading}>Register</button>
        <button onClick={onClose}>Return</button>
      </div>
    </section>
  );
}
