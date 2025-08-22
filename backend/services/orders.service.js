// backend/services/orders.service.js
const { query } = require('./_db');

const CUTOFF_MS = 24 * 60 * 60 * 1000;

async function createOrder(userId, partId, qty = 1) {
  // izračunaj total na temelju cijene dijela
  const part = (await query('SELECT id, price FROM parts WHERE id = ?', [partId]))?.[0];
  if (!part) throw new Error('Part not found');

  const total = Number(part.price) * Number(qty || 1);

  await query(
    'INSERT INTO orders (user_id, part_id, qty, total_price, order_date) VALUES (?, ?, ?, ?, NOW())',
    [userId, partId, qty, total]
  );

  return { success: true };
}

// Dohvati zadnje narudžbe korisnika (sortirano, limit)
async function getUserOrders(userId, limit = 5) {
  const rows = await query(
    `
    SELECT
      o.id,
      o.user_id,
      o.part_id,
      o.qty,
      o.total_price AS total,
      o.order_date AS createdAt,
      p.name AS part_name
    FROM orders o
    LEFT JOIN parts p ON p.id = o.part_id
    WHERE o.user_id = ?
    ORDER BY o.order_date DESC
    LIMIT ?
    `,
    [userId, Number(limit)]
  );
  return rows.map(r => ({
    id: r.id,
    part_id: r.part_id,
    qty: r.qty,
    total: Number(r.total ?? 0),
    createdAt: r.createdAt,
    part_name: r.part_name,
    items: r.part_name ? [{ name: r.part_name, qty: r.qty, price: null }] : [],
  }));
}

// Otkazivanje ako < 24h: brišemo zapis (jer tablica nema status kolonu)
async function cancelOrder(userId, orderId) {
  const row = (await query(
    'SELECT id, user_id, order_date FROM orders WHERE id = ? AND user_id = ?',
    [orderId, userId]
  ))?.[0];

  if (!row) return { ok: false, reason: 'not_found' };

  const ageMs = Date.now() - new Date(row.order_date).getTime();
  if (ageMs >= CUTOFF_MS) {
    return { ok: false, reason: 'too_old' };
  }

  await query('DELETE FROM orders WHERE id = ? AND user_id = ?', [orderId, userId]);
  return { ok: true };
}

module.exports = { createOrder, getUserOrders, cancelOrder };
