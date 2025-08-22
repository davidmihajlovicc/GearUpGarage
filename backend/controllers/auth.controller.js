// backend/controllers/auth.controller.js
const Auth = require('../services/auth.service');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Auth.findUserByEmail(email);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    const ok = await Auth.comparePassword(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Unauthorized' });
    const token = Auth.signToken(user);
    res.json({ token });
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are obligatory.' });
    const exists = await Auth.emailExists(email);
    if (exists) return res.status(409).json({ error: 'User already exists.' });
    const userId = await Auth.createUser(email, password);
    res.json({ success: true, userId });
  } catch {
    res.status(500).json({ error: 'Error while saving.' });
  }
};

exports.me = async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.json({ user: null });
    const user = await Auth.getUserFromToken(auth);
    if (!user) return res.json({ user: null });
    res.json({ user });
  } catch {
    res.json({ user: null });
  }
};
