// backend/services/auth.service.js
const { query } = require('./_db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'tajna123';

async function findUserByEmail(email) {
  const rows = await query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] || null;
}

async function comparePassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

function signToken(user) {
  return jwt.sign({ id: user.id, isAdmin: !!user.is_admin }, secret);
}

async function emailExists(email) {
  const rows = await query('SELECT id FROM users WHERE email = ?', [email]);
  return rows.length > 0;
}

async function createUser(email, password) {
  const hashed = await bcrypt.hash(password, 10);
  const result = await query('INSERT INTO users (email, password, is_admin) VALUES (?, ?, 0)', [email, hashed]);
  return result.insertId;
}

async function getUserFromToken(token) {
  const payload = jwt.verify(token, secret);
  const rows = await query('SELECT id, email, is_admin FROM users WHERE id=?', [payload.id]);
  return rows[0] || null;
}

module.exports = { findUserByEmail, comparePassword, signToken, emailExists, createUser, getUserFromToken };
