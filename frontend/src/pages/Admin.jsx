
import { useMemo, useState, useEffect } from 'react';
import {
  getBrands, getModels, getPartTypes, getPartSubtypes, createPart
} from '../api';
import { adminSearchUsers, adminSetRole } from '../api/admin';

function getIsAdminFromToken(token) {
  try { return !!JSON.parse(atob(token.split('.')[1])).isAdmin; } catch { return false; }
}

const FUEL_OPTIONS = [
  { value: '',       label: '— Fuel —' },
  { value: 'gas', label: 'gas' },
  { value: 'diesel', label: 'diesel' },
];

export default function Admin() {
  const token = localStorage.getItem('token');

  const user = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  }, []);
  const isAdmin = (user?.isAdmin) || getIsAdminFromToken(token);

  if (!token || !isAdmin) return <div>Only for administrators.</div>;

  
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [types, setTypes] = useState([]);
  const [subtypes, setSubtypes] = useState([]);

  const [saving, setSaving] = useState(false);
  const [image, setImage] = useState(null);

  const [f, setF] = useState({
    title: '',
    price: '',
    brand_id: '',
    model_id: '',
    part_type_id: '',
    part_subtype_id: '',
    year_from: '',
    year_to: '',
    fuel: '' 
  });


  useEffect(() => {
    (async () => {
      const [b, t] = await Promise.all([getBrands(), getPartTypes()]);
      setBrands(b || []);
      setTypes(t || []);
    })();
  }, []);

 
  useEffect(() => {
    (async () => {
      if (f.brand_id) setModels(await getModels(f.brand_id));
      else setModels([]);
      setF(prev => ({ ...prev, model_id: '' }));
    })();
  }, [f.brand_id]);

 
  useEffect(() => {
    (async () => {
      if (f.part_type_id) setSubtypes(await getPartSubtypes(f.part_type_id));
      else setSubtypes([]);
      setF(prev => ({ ...prev, part_subtype_id: '' }));
    })();
  }, [f.part_type_id]);

  const handleSavePart = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const fd = new FormData();
      Object.entries(f).forEach(([k, v]) => {
        if (v !== '' && v !== null && v !== undefined) fd.append(k, v);
      });
      if (image) fd.append('image', image);
      await createPart(fd);
      alert('Dio spremljen!');
      setF({
        title: '',
        price: '',
        brand_id: '',
        model_id: '',
        part_type_id: '',
        part_subtype_id: '',
        year_from: '',
        year_to: '',
        fuel: '' // reset
      });
      setImage(null);
    } catch (err) {
      alert(err?.response?.data?.error || 'Greška pri spremanju dijela');
    } finally {
      setSaving(false);
    }
  };

  
  const [q, setQ] = useState('');
  const [users, setUsers] = useState([]);
  const search = async () => { try { setUsers(await adminSearchUsers(q)); } catch (e) { alert(e.message); } };
  const toggleAdmin = async (u) => {
    try {
      await adminSetRole(u.id, !u.isAdmin);
      setUsers(users.map(x => x.id === u.id ? { ...x, isAdmin: !x.isAdmin } : x));
    } catch (e) { alert(e.message); }
  };
  useEffect(() => { search(); }, []);

  return (
    <div className="admin-page">
      <h1 className="page-title">Admin panel</h1>

      
      <section className="card">
        <h2 className="section-title">Add new part</h2>
        <form onSubmit={handleSavePart} className="form-grid">
          <input className="input" placeholder="Title" value={f.title}
                 onChange={e=>setF({...f, title:e.target.value})} />
          <input className="input" type="number" step="0.01" placeholder="Price (€)" value={f.price}
                 onChange={e=>setF({...f, price:e.target.value})} />

          <div className="grid gap-2 sm:grid-cols-3 form-full">
            <select className="input" value={f.brand_id}
                    onChange={e=>setF({...f, brand_id:e.target.value})}>
              <option value="">Brand</option>
              {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>

            <select className="input" value={f.model_id} disabled={!f.brand_id}
                    onChange={e=>setF({...f, model_id:e.target.value})}>
              <option value="">{f.brand_id ? 'Model' : 'Firstly choose a brand'}</option>
              {models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>

            <select className="input" value={f.part_type_id}
                    onChange={e=>setF({...f, part_type_id:e.target.value})}>
              <option value="">Part type</option>
              {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>

          <select className="input form-full" value={f.part_subtype_id} disabled={!f.part_type_id}
                  onChange={e=>setF({...f, part_subtype_id:e.target.value})}>
            <option value="">{f.part_type_id ? 'Subtype (optional)' : 'Firstly choose a type'}</option>
            {subtypes.map(st => <option key={st.id} value={st.id}>{st.name}</option>)}
          </select>

          {/* Gorivo */}
          <select className="input form-full" value={f.fuel}
                  onChange={e=>setF({...f, fuel:e.target.value})}>
            {FUEL_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          <div className="grid gap-2 sm:grid-cols-2 form-full">
            <input className="input" type="number" placeholder="Year from" value={f.year_from}
                   onChange={e=>setF({...f, year_from:e.target.value})} />
            <input className="input" type="number" placeholder="Year until" value={f.year_to}
                   onChange={e=>setF({...f, year_to:e.target.value})} />
          </div>

          <input className="file-input form-full" type="file" accept="image/*"
                 onChange={e=>setImage(e.target.files?.[0] || null)} />

          <button disabled={saving} className="btn btn--primary form-full">
            {saving ? 'Saving...' : 'Save'}
          </button>
        </form>
      </section>

      
      <section className="card">
        <h2 className="section-title">Users</h2>
        <div className="users-search">
          <input className="input" placeholder="Search (email)" value={q} onChange={e=>setQ(e.target.value)} />
          <button onClick={search} className="btn btn--primary">Search</button>
        </div>
        <div className="users-list">
          {users.map(u => (
            <div key={u.id} className="user-row">
              <div>
                <div className="user-name">{u.name || '(without a name)'}</div>
                <div className="user-email">{u.email}</div>
              </div>
              <div className="user-actions">
                <span className={`badge ${u.isAdmin ? 'badge--admin' : 'badge--user'}`}>
                  {u.isAdmin ? 'ADMIN' : 'USER'}
                </span>
                <button
                  onClick={() => toggleAdmin(u)}
                  className={`btn ${u.isAdmin ? 'btn--danger' : 'btn--success'}`}
                >
                  {u.isAdmin ? 'Remove admin' : 'Make an admin'}
                </button>
              </div>
            </div>
          ))}
          {!users.length && <div className="muted small">No results.</div>}
        </div>
      </section>
    </div>
  );
}
