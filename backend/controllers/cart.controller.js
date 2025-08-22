// backend/controllers/cart.controller.js
const Cart = require('../services/cart.service');

exports.get = async (req, res) => {
  try {
    const data = await Cart.getCart(req.user.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.add = async (req, res) => {
  try {
    const { part_id, qty = 1 } = req.body;
    if (!part_id) return res.status(400).json({ error: 'part_id is obligatory' });
    const out = await Cart.addItem(req.user.id, part_id, qty);
    res.json(out);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { part_id, qty } = req.body;
    if (!part_id) return res.status(400).json({ error: 'part_id is obligatory' });
    const out = await Cart.setQty(req.user.id, part_id, qty);
    res.json(out);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const out = await Cart.removeItem(req.user.id, req.params.part_id);
    res.json(out);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.checkout = async (req, res) => {
  try {
    const out = await Cart.checkout(req.user.id);
    res.json(out);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};
