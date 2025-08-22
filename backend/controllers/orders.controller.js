// backend/controllers/orders.controller.js
const Orders = require('../services/orders.service');

exports.create = async (req, res) => {
  try {
    const { part_id, qty = 1 } = req.body;
    if (!part_id) return res.status(400).json({ error: 'part_id is obligatory' });
    const out = await Orders.createOrder(req.user.id, part_id, qty);
    res.json(out);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// NEW: GET /api/orders?limit=5
exports.list = async (req, res) => {
  try {
    const limit = Math.max(1, Math.min(50, parseInt(req.query.limit || '5', 10)));
    const rows = await Orders.getUserOrders(req.user.id, limit);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// NEW: POST /api/orders/:id/cancel
exports.cancel = async (req, res) => {
  try {
    const orderId = parseInt(req.params.id, 10);
    if (!orderId) return res.status(400).json({ error: 'Invalid ID' });

    const result = await Orders.cancelOrder(req.user.id, orderId);
    if (result?.ok) return res.json({ ok: true });

   
    if (result?.reason === 'too_old') {
      return res.status(400).json({ error: 'Order is shipped.' });
    }
    if (result?.reason === 'not_found') {
      return res.status(404).json({ error: 'Order not found.' });
    }
    return res.status(400).json({ error: 'Can not cancel the order.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
