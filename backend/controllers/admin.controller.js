
const Admin = require('../services/admin.service');

exports.searchUsers = async (req, res) => {
  try {
    const list = await Admin.searchUsers(req.query.q || '');
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'DB error', error: err });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await Admin.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'DB error', error: err });
  }
};

exports.setRole = async (req, res) => {
  try {
    const { isAdmin } = req.body;
    await Admin.setUserRole(req.params.id, !!isAdmin);
    res.json({ message: 'Role updated' });
  } catch (err) {
    res.status(500).json({ message: 'DB error', error: err });
  }
};
