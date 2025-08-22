// backend/services/cart.service.js
const { query } = require('./_db');

async function getCart(userId) {
  const rows = await query(`
    SELECT ci.part_id, ci.qty,
           p.title, p.price, p.image,
           b.name AS brand, m.name AS model
    FROM cart_items ci
    JOIN parts p    ON p.id = ci.part_id
    JOIN brands b   ON b.id = p.brand_id
    JOIN models m   ON m.id = p.model_id
    WHERE ci.user_id = ?
    ORDER BY ci.id DESC
  `, [userId]);
  const items = rows.map(r => ({
    part_id: r.part_id,
    title: r.title, brand: r.brand, model: r.model,
    price: Number(r.price || 0),
    qty: r.qty,
    image: r.image,
  }));
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  return { items, total };
}

async function addItem(userId, partId, qty = 1) {
  await query(`
    INSERT INTO cart_items (user_id, part_id, qty)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE qty = qty + VALUES(qty)
  `, [userId, partId, Number(qty)]);
  return { ok: true };
}

async function setQty(userId, partId, qty) {
  if (!qty || Number(qty) <= 0) {
    await query('DELETE FROM cart_items WHERE user_id=? AND part_id=?', [userId, partId]);
    return { ok: true, deleted: true };
  } else {
    await query('UPDATE cart_items SET qty=? WHERE user_id=? AND part_id=?', [Number(qty), userId, partId]);
    return { ok: true };
  }
}

async function removeItem(userId, partId) {
  await query('DELETE FROM cart_items WHERE user_id=? AND part_id=?', [userId, partId]);
  return { ok: true };
}

async function checkout(userId) {
  const profRows = await query(`
    SELECT full_name, phone, address_line1, house_no, city, postal_code, country
    FROM user_profiles WHERE user_id=? LIMIT 1
  `, [userId]);
  const prof = profRows[0];
  if (!prof || !prof.full_name || !prof.phone || !prof.address_line1 || !prof.house_no || !prof.city || !prof.postal_code) {
    const err = new Error('Finish your profile.');
    err.status = 400;
    throw err;
  }
  const items = await query(`
    SELECT ci.part_id, ci.qty, p.price
    FROM cart_items ci
    JOIN parts p ON ci.part_id = p.id
    WHERE ci.user_id=?
  `, [userId]);
  if (!items.length) {
    const err = new Error('Cart is empty.');
    err.status = 400;
    throw err;
  }
  const values = items.map(r => [userId, r.part_id, r.qty, r.qty * r.price]);
  await query('INSERT INTO orders (user_id, part_id, qty, total_price) VALUES ?', [values]);
  await query('DELETE FROM cart_items WHERE user_id=?', [userId]);
  return { ok: true };
}

module.exports = { getCart, addItem, setQty, removeItem, checkout };
