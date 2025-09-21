import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, saveProfile } from '../api/profile';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { token } = useAuth();
  const nav = useNavigate();

  const EMPTY = {
    full_name: '', phone: '',
    address_line1: '', house_no: '', address_line2: '',
    city: '', postal_code: '', country: 'Hrvatska',
  };

  const [profile, setProfile] = useState(null);       
  const [form, setForm] = useState(EMPTY);            
  const [editing, setEditing] = useState(true);       
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!token) { nav('/login'); return; }
    (async () => {
      setLoading(true);
      try {
        const data = await getProfile();              
        if (data) {
          setProfile(data);
          setForm({ ...EMPTY, ...data });
          setEditing(false);                          
        } else {
          setProfile(null);
          setForm(EMPTY);
          setEditing(true);                           
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [token, nav]);

  const onChange = (k) => (e) => setForm(s => ({ ...s, [k]: e.target.value }));

  async function onSave(e){
    e.preventDefault();
    setErr(''); setMsg('');
    try {
      await saveProfile(form);
      const fresh = await getProfile().catch(() => null);
      setProfile(fresh || form);
      setEditing(false);                              
      setMsg('Profile saved.');
    } catch (e) {
      setErr(e?.response?.data?.error || 'Error while saving profile details.');
    }
  }

  function onCancel(){
    if (profile) {
      setForm({ ...EMPTY, ...profile });
      setEditing(false);                              
    } else {
      setForm(EMPTY);
      setEditing(true);
    }
  }

  if (!token) return null;
  if (loading) return <div className="page">Loading…</div>;

  const Avatar = ({ url, size = 112 }) => (
    <img
      src={url || '/img/profile.jpg'}
      alt="Profile picture"
      style={{
        width: size, height: size, borderRadius: '9999px',
        objectFit: 'cover', background: '#e5e7eb', border: '1px solid #e5e7eb'
      }}
      onError={(e) => { e.currentTarget.src = '/img/profile.jpg'; }}
    />
  );


  if (!editing && profile) {
    return (
      <div className="page profile-page">
        <h2 className="page-title">My Profile</h2>
        {msg && <div className="success-msg">{msg}</div>}

        <div className="form-section profile-view">
          <div className="profile-layout">
            
            <div className="profile-avatar">
              <Avatar url={profile.avatar_url} size={120} />
            </div>

            
            <div className="profile-info">
              <div><strong>Name:</strong> {profile.full_name}</div>
              <div><strong>Telephone:</strong> {profile.phone}</div>
              <div><strong>Address:</strong> {profile.address_line1} {profile.house_no}</div>
              {profile.address_line2 && <div><strong>Address (second lane):</strong> {profile.address_line2}</div>}
              <div><strong>City:</strong> {profile.city}</div>
              <div><strong>Postal code:</strong> {profile.postal_code}</div>
              <div><strong>Country:</strong> {profile.country}</div>
              <div className="profile-actions">
                <button className="btn btn--primary" onClick={() => setEditing(true)}>Edit</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // === EDIT MODE ===
  return (
    <div className="page profile-page">
      <h2 className="page-title">My profile</h2>
      <form onSubmit={onSave} className="form-section profile-form">
        {err && <div className="error-msg">{err}</div>}

        <input placeholder="Full name *" value={form.full_name} onChange={onChange('full_name')} required />
        <input placeholder="Telephone *" value={form.phone} onChange={onChange('phone')} required />

        <div className="grid-2">
          <input placeholder="Address *" value={form.address_line1} onChange={onChange('address_line1')} required />
          <input placeholder="House number *" value={form.house_no} onChange={onChange('house_no')} required />
        </div>

        <input placeholder="Address (Second lane)" value={form.address_line2 || ''} onChange={onChange('address_line2')} />

        <div className="grid-3">
          <input placeholder="City *" value={form.city} onChange={onChange('city')} required />
          <input placeholder="Postal code *" value={form.postal_code} onChange={onChange('postal_code')} required />
          <input placeholder="Country *" value={form.country} onChange={onChange('country')} required />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn--primary">Save</button>
          <button type="button" className="btn btn--ghost" onClick={onCancel}>Return</button>
        </div>
      </form>
    </div>
  );

}
