// backend/controllers/profile.controller.js
const Profile = require('../services/profile.service');

exports.get = async (req, res) => {
  try {
    const row = await Profile.getProfile(req.user.id);
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const out = await Profile.upsertProfile(req.user.id, req.body || {});
    res.json(out);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};
