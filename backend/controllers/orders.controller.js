// backend/controllers/orders.controller.js
const Orders = require('../services/orders.service');

exports.create = async (req, res) => {
  try {
    const { part_id } = req.body;
    if (!part_id) return res.status(400).json({ error: 'part_id je obavezan' });
    const out = await Orders.createOrder(req.user.id, part_id);
    res.json(out);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
