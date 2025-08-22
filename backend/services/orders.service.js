// backend/services/orders.service.js
const { query } = require('./_db');

async function createOrder(userId, partId) {
  await query('INSERT INTO orders (user_id, part_id) VALUES (?, ?)', [userId, partId]);
  return { success: true };
}

module.exports = { createOrder };
