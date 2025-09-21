
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCart, setCartQty, removeFromCart, checkout } from '../api/cart';

const imgUrl = (image) =>
  image?.startsWith('/uploads') ? `http://127.0.0.1:3001${image}` : image;

export default function Cart() {
  const nav = useNavigate();
  const token = localStorage.getItem('token');
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { nav('/login'); return; }
    (async () => {
      setLoading(true);
      try { setCart(await getCart()); } finally { setLoading(false); }
    })();
  }, [token, nav]);

  async function changeQty(part_id, delta){
    const item = cart.items.find(i => i.part_id === part_id);
    const next = (item?.qty || 1) + delta;
    await setCartQty(part_id, next);
    setCart(await getCart());
  }
  async function remove(part_id){
    await removeFromCart(part_id);
    setCart(await getCart());
  }
  // ...
    async function doCheckout(){
    nav('/checkout'); 
    }


  if (!token) return null;
  if (loading) return <div className="page">Učitavanje…</div>;

  return (
    <div className="page">
      <h2 className="cart__title">Cart</h2>
      {cart.items.length === 0 ? (
        <div className="muted">
          Cart is empty. <Link to="/parts">Go to shop</Link>
        </div>
      ) : (
        <>
          <div className="cart__list">
            {cart.items.map(it => (
              <div key={it.part_id} className="cart__item">
                <img src={imgUrl(it.image)} alt="" className="cart__img" />
                <div className="cart__info">
                  <div className="cart__item-title">{it.title}</div>
                  <div className="cart__item-meta">{it.brand} • {it.model}</div>
                  <div className="cart__item-price">
                    <strong>{it.price.toFixed(2)} €</strong>
                  </div>
                </div>
                <div className="cart__actions">
                  <button className="btn" onClick={() => changeQty(it.part_id, -1)}>-</button>
                  <div className="cart__qty">{it.qty}</div>
                  <button className="btn" onClick={() => changeQty(it.part_id, +1)}>+</button>
                  <button className="btn btn--ghost" onClick={() => remove(it.part_id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart__footer">
            <div className="cart__total">Total: <strong>{cart.total.toFixed(2)} €</strong></div>
            <button className="btn btn--primary" onClick={doCheckout}>Proceed to checkout</button>
          </div>
        </>
      )}
    </div>
  );

}
