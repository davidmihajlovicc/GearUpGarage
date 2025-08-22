import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProfile, saveProfile } from '../api/profile';
import { getCart } from '../api/cart';

const EMPTY = {
  full_name:'', phone:'',
  address_line1:'', house_no:'', address_line2:'',
  city:'', postal_code:'', country:'Hrvatska'
};

export default function Checkout(){
  const { token } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [cart, setCart] = useState({ items:[], total:0 });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!token){ nav('/login'); return; }
    (async () => {
      setLoading(true);
      try {
        const [prof, c] = await Promise.all([ getProfile(), getCart() ]);
        setForm(prof ? { ...EMPTY, ...prof } : EMPTY);   // auto-popuni ako postoji
        setCart(c || { items:[], total:0 });
        if (!c || !c.items?.length) nav('/cart');
      } finally { setLoading(false); }
    })();
  }, [token, nav]);

  const onChange = k => e => setForm(s => ({ ...s, [k]: e.target.value }));

  async function onContinue(e){
    e.preventDefault();
    setErr('');
    const req = ['full_name','phone','address_line1','house_no','city','postal_code','country'];
    for (const k of req) if (!String(form[k]||'').trim()){
      setErr('Please enter all obligatory fields.'); return;
    }
    try{
      await saveProfile(form);   // spremi/azuriraj profil za dostavu
      nav('/payment');           // dalje na plaćanje
    }catch(e){
      setErr(e?.response?.data?.error || 'Error while saving data.');
    }
  }

  if (!token) return null;
  if (loading) return <div className="page">Loading..</div>;

  return (
      <div className="page checkout-page">
        <h2 className="checkout-title">Delivery details</h2>
        <div className="checkout-grid">
          <form onSubmit={onContinue} className="form-section checkout-form">
            {err && <div className="checkout-error">{err}</div>}

            <input placeholder="Full name *" value={form.full_name} onChange={onChange('full_name')} required />
            <input placeholder="Telefon *" value={form.phone} onChange={onChange('phone')} required />

            <div className="checkout-address">
              <input placeholder="Address *" value={form.address_line1} onChange={onChange('address_line1')} required />
              <input placeholder="House number *" value={form.house_no} onChange={onChange('house_no')} required />
            </div>

            <input placeholder="Address (second lane)" value={form.address_line2 || ''} onChange={onChange('address_line2')} />

            <div className="checkout-city">
              <input placeholder="City *" value={form.city} onChange={onChange('city')} required />
              <input placeholder="Postal code *" value={form.postal_code} onChange={onChange('postal_code')} required />
              <input placeholder="Country *" value={form.country} onChange={onChange('country')} required />
            </div>

            <div className="checkout-buttons">
              <Link className="btn btn--ghost" to="/cart">Back to cart</Link>
              <button type="submit" className="btn btn--primary">Proceed to payment</button>
            </div>
          </form>

          <aside className="checkout-summary">
            <h3 className="checkout-summary__title">Order summary</h3>
            <div className="checkout-summary__items">
              {cart.items.map(it => (
                <div key={it.part_id} className="checkout-summary__row">
                  <div>{it.title} <span className="muted">× {it.qty}</span></div>
                  <div><strong>{(it.price*it.qty).toFixed(2)} €</strong></div>
                </div>
              ))}
            </div>
            <div className="checkout-summary__total">
              <div>Total</div>
              <div><strong>{cart.total.toFixed(2)} €</strong></div>
            </div>
          </aside>
        </div>
      </div>
    );

}
