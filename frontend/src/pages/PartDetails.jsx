import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPart } from '../api';
import { addToCart } from '../api/cart';
import { deletePart } from '../api/index';
import { updatePart } from '../api'; 

function getIsAdminFromToken(token) {
  try { return !!JSON.parse(atob(token.split('.')[1])).isAdmin; } catch { return false; }
}

function resolveImg(image) {
  if (!image) return '';
  if (image.startsWith('http') || image.startsWith('//')) return image;
  return image.startsWith('/uploads') ? image : `/${String(image).replace(/^\//, '')}`;
}

export default function PartDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const { token } = useAuth();

  const isAdmin = useMemo(() => getIsAdminFromToken(token || localStorage.getItem('token')), [token]);

  const [p, setP] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  // EDIT STATE
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: '', price: '', year_from: '', year_to: '',
    fuel: '', brand: '', model: '', part_type: '', part_subtype: ''
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true); setErr('');
      try {
        const data = await getPart(id);
        if (!alive) return;
        setP(data);
        setForm({
          name: data.name || '',
          price: data.price ?? '',
          year_from: data.year_from ?? '',
          year_to: data.year_to ?? '',
          fuel: data.fuel || '',
          brand: data.brand || '',
          model: data.model || '',
          part_type: data.part_type || '',
          part_subtype: data.part_subtype || '',
        });
      } catch {
        if (alive) setErr('Part not found.');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; if (preview) URL.revokeObjectURL(preview); };
  }, [id]); // eslint-disable-line

  async function handleAdd() {
    if (!token) { nav('/login'); return; }
    try { await addToCart(p.id, qty || 1); alert('Added to cart'); }
    catch (e) { if (e?.response?.status === 401) nav('/login'); else alert('Error while adding to cart'); }
  }

  async function handleDelete() {
    if (!isAdmin || !p) return;
    if (!window.confirm('Delete this part? This cannot be undone.')) return;
    try {
      await deletePart(p.id);
      alert('Part deleted.');
      nav('/parts');
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.error || 'Delete failed');
    }
  }

  function startEdit() {
    if (!isAdmin) return;
    setEditing(true);
    setFile(null);
    if (preview) { URL.revokeObjectURL(preview); setPreview(''); }
  }

  function cancelEdit() {
    if (!p) { setEditing(false); return; }
    setEditing(false);
    setFile(null);
    if (preview) { URL.revokeObjectURL(preview); setPreview(''); }
    setForm({
      name: p.name || '',
      price: p.price ?? '',
      year_from: p.year_from ?? '',
      year_to: p.year_to ?? '',
      fuel: p.fuel || '',
      brand: p.brand || '',
      model: p.model || '',
      part_type: p.part_type || '',
      part_subtype: p.part_subtype || '',
    });
  }

  async function saveEdit() {
  if (!isAdmin || !p) return;

  try {
    const toNullableNum = (v) => {
      if (v === '' || v == null) return '';
      const n = Number(v);
      return Number.isFinite(n) ? String(n) : '';
    };

    const fd = new FormData();
    fd.append('title', (form.name || '').trim());   
    fd.append('name', (form.name || '').trim());
    fd.append('price', toNullableNum(form.price));
    fd.append('year_from', toNullableNum(form.year_from));
    fd.append('year_to', toNullableNum(form.year_to));
    fd.append('fuel', form.fuel || '');

    
    fd.append('brand_id', form.brand_id || '');
    fd.append('model_id', form.model_id || '');
    fd.append('part_type_id', form.part_type_id || '');
    fd.append('part_subtype_id', form.part_subtype_id || '');

    if (file) fd.append('image', file);

    const updated = await updatePart(p.id, fd);    
    setP(updated);
    setEditing(false);
    setFile(null);
    if (preview) { URL.revokeObjectURL(preview); setPreview(''); }
    alert('Saved.');
  } catch (e) {
    const status = e?.response?.status;
    const data = e?.response?.data;
    console.error('SAVE ERROR:', status, data, e);
    const msg = data?.error || data?.message || e.message || 'Save failed';
    alert(`Save failed${status ? ` (${status})` : ''}: ${msg}`);
  }
}


  if (loading) return <div className="page">Loading...</div>;
  if (err) return <div className="page">{err}</div>;
  if (!p) return null;

  const title = p.title || p.name || 'Without a title';
  const imgSrc = preview || resolveImg(p.image);
  const years = p.year_from ? `${p.year_from}${p.year_to ? `–${p.year_to}` : ''}` : '—';
  const priceStr = p.price != null && !isNaN(Number(p.price)) ? `${Number(p.price).toFixed(2)} €` : '—';
  const fuelLabel = p.fuel ? (String(p.fuel).charAt(0).toUpperCase() + String(p.fuel).slice(1)) : '—';

  return (
    <div className="page">
      <Link to="/parts" className="nav__link part-backlink">← Back to parts</Link>

      <div className="part-details">
        {/* Slika */}
        <div className="part-image-box">
          {imgSrc ? <img src={imgSrc} alt={title} className="part-image" /> : <div className="muted">Without a picture</div>}

          {editing && (
            <div className="mt-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0] || null;
                  setFile(f);
                  if (preview) URL.revokeObjectURL(preview);
                  setPreview(f ? URL.createObjectURL(f) : '');
                }}
              />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="part-info">
          <div className="part-header">
            {!editing ? <h2>{title}</h2> : (
              <input
                className="inp"
                value={form.name}
                onChange={(e)=> setForm({...form, name: e.target.value})}
                placeholder="Name / Title"
              />
            )}

            {isAdmin && (
              <div className="admin-actions">
                {!editing ? (
                  <>
                    <button className="btn btn--ghost" onClick={startEdit}>Edit</button>
                    <button className="btn btn--danger" onClick={handleDelete}>Delete</button>
                  </>
                ) : (
                  <>
                    <button className="btn btn--primary" onClick={saveEdit}>Save</button>
                    <button className="btn" onClick={cancelEdit}>Cancel</button>
                  </>
                )}
              </div>
            )}
          </div>

          {!editing ? (
            <>
            
              <div className="part-meta">
                {[p.brand, p.model, p.part_type, p.part_subtype].filter(Boolean).join(' • ') || '—'}
              </div>

              <div className="part-table">
                <div className="muted">Years</div><div>{years}</div>
                <div className="muted">Price</div><div><strong>{priceStr}</strong></div>
                <div className="muted">Fuel</div><div>{fuelLabel}</div>
              </div>

              {p.name && (
                <>
                  <div className="muted part-label">Description</div>
                  <div className="part-desc">{p.name}</div>
                </>
              )}

              <div className="part-actions">
                <label className="muted" htmlFor="qty">Quantity</label>
                <input
                  id="qty" type="number" value={qty} min={1}
                  onChange={(e)=> setQty(Math.max(1, Number(e.target.value) || 1))}
                  className="part-qty"
                />
                <button className="btn btn--primary" onClick={handleAdd}>Add to cart</button>
              </div>
            </>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              <label className="lbl">Price (€)
                <input className="inp" type="number" step="0.01"
                  value={form.price}
                  onChange={(e)=> setForm({...form, price: e.target.value})}/>
              </label>

              <label className="lbl">Fuel
                <input className="inp"
                  value={form.fuel}
                  onChange={(e)=> setForm({...form, fuel: e.target.value})}
                  placeholder="petrol/diesel/electric..."/>
              </label>

              <label className="lbl">Year from
                <input className="inp" type="number"
                  value={form.year_from}
                  onChange={(e)=> setForm({...form, year_from: e.target.value})}/>
              </label>

              <label className="lbl">Year to
                <input className="inp" type="number"
                  value={form.year_to}
                  onChange={(e)=> setForm({...form, year_to: e.target.value})}/>
              </label>

              <label className="lbl">Brand
                <input className="inp"
                  value={form.brand}
                  onChange={(e)=> setForm({...form, brand: e.target.value})}/>
              </label>

              <label className="lbl">Model
                <input className="inp"
                  value={form.model}
                  onChange={(e)=> setForm({...form, model: e.target.value})}/>
              </label>

              <label className="lbl">Part type
                <input className="inp"
                  value={form.part_type}
                  onChange={(e)=> setForm({...form, part_type: e.target.value})}/>
              </label>

              <label className="lbl">Subtype
                <input className="inp"
                  value={form.part_subtype}
                  onChange={(e)=> setForm({...form, part_subtype: e.target.value})}/>
              </label>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .inp { width:100%; padding:8px 10px; border:1px solid #ddd; border-radius:8px; }
        .lbl { display:flex; flex-direction:column; gap:6px; font-size:14px; color:#666; }
      `}</style>
    </div>
  );
}
