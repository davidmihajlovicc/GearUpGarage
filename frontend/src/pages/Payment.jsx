import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCart, checkout } from '../api/cart';
import { getProfile } from '../api/profile';

export default function Payment() {
  const { token } = useAuth();
  const nav = useNavigate();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  // --- NOVO: polja za karticu ---
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  useEffect(() => {
    if (!token) {
      nav('/login');
      return;
    }
    (async () => {
      setLoading(true);
      try {
        const [c, p] = await Promise.all([getCart(), getProfile()]);
        if (!c || !c.items?.length) {
          nav('/cart');
          return;
        }
        setCart(c);
        setProfile(p);
      } finally {
        setLoading(false);
      }
    })();
  }, [token, nav]);

  async function payNow() {
    setErr('');
    try {
      await checkout();
      alert('Payment successful. Thank you!');
      nav('/parts');
    } catch (e) {
      const msg = e?.response?.data?.error || 'Error occured with payment.';
      setErr(msg);
      if (e?.response?.status === 400) nav('/checkout');
    }
  }

  // --- Validacija ---
  const cardNumberValid = cardNumber.replace(/\\s+/g, '').length === 16;
  const cvcValid = cardCvc.length === 3;
  const nameValid = cardName.trim().length > 0;
  const canPay = cardNumberValid && cvcValid && nameValid;

  if (!token) return null;
  if (loading) return <div className="page">Loading...</div>;

  return (
    <div className="page payment-page">
      <h2 className="page-title">Payment</h2>

      <div className="payment-grid">
        {/* Forma za plaćanje */}
        <div className="payment-form">
          <h3 className="section-title">Payment data</h3>

          <div className="form-section payment-fields">
            <input
              placeholder="Card name"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
            />
            <input
              placeholder="Card number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value.replace(/[^0-9]/g, ''))}
            />
            <div className="payment-card-row">
              <input
                placeholder="MM/YY"
                value={cardExp}
                onChange={(e) => setCardExp(e.target.value)}
              />
              <input
                placeholder="CVC"
                value={cardCvc}
                onChange={(e) => setCardCvc(e.target.value.replace(/[^0-9]/g, ''))}
              />
            </div>
          </div>

          {err && <div className="error-msg">{err}</div>}

          <div className="payment-actions">
            <Link className="btn btn--ghost" to="/checkout">
              Back
            </Link>
            <button
              className="btn btn--primary"
              onClick={payNow}
              disabled={!canPay}
            >
              Pay now
            </button>
          </div>
        </div>

        {/* Sažetak */}
        <aside className="payment-summary">
          <h3 className="section-title">Summary</h3>
          <div className="summary-items">
            {cart.items.map((it) => (
              <div key={it.part_id} className="summary-row">
                <div>
                  {it.title} <span className="muted">× {it.qty}</span>
                </div>
                <div>
                  <strong>{(it.price * it.qty).toFixed(2)} €</strong>
                </div>
              </div>
            ))}
          </div>
          <div className="summary-total">
            <div>Total</div>
            <div>
              <strong>{cart.total.toFixed(2)} €</strong>
            </div>
          </div>

          <h4 className="summary-subtitle">Delivery</h4>
          {profile ? (
            <div className="muted delivery-info">
              {profile.full_name}
              <br />
              {profile.address_line1} {profile.house_no}
              {profile.address_line2 ? `, ${profile.address_line2}` : ''}
              <br />
              {profile.postal_code} {profile.city}, {profile.country}
              <br />
              Tel: {profile.phone}
            </div>
          ) : (
            <div className="muted">
              No data. <Link to="/checkout">Enter data</Link>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
