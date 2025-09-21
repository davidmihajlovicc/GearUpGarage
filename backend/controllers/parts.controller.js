
const Parts = require('../services/parts.service');
const fs = require('fs');
const path = require('path');

exports.list = async (req, res) => {
  try {
    const rows = await Parts.listParts(req.query || {});
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const row = await Parts.getPartById(req.params.id);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, brand_id, model_id, part_type_id } = req.body || {};
    if (!brand_id || !model_id || !part_type_id || !title) {
      return res.status(400).json({ error: 'Missing fields.' });
    }
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const out = await Parts.createPart(req.body, image);
    res.json(out);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const imgPath = await Parts.findImagePath(req.params.id);
    const ok = await Parts.deletePart(req.params.id);
    if (ok && imgPath && imgPath.startsWith('/uploads/')) {
      const fullPath = path.join(process.cwd(), imgPath.replace(/^\//, ''));
      fs.unlink(fullPath, () => {});
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const updated = await Parts.updatePart(req.params.id, req.body || {}, image);
    if (!updated) return res.status(400).json({ error: 'No field to update' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
