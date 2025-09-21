
const { query } = require('./_db');

async function searchUsers(q = '') {
  const like = `%${(q || '').trim()}%`;
  const rows = await query(
    `SELECT id, email, is_admin AS isAdmin
     FROM users
     WHERE email LIKE ?
     ORDER BY id DESC
     LIMIT 50`,
    [like]
  );
  return rows.map(r => ({ ...r, name: r.name ?? '' }));
}

async function getUserById(id) {
  try {
    const rows = await query(
      `SELECT id, name, email, is_admin AS isAdmin, created_at
       FROM users WHERE id = ?`,
      [id]
    );
    const u = rows[0];
    return u ? { ...u, name: u.name ?? '' } : null;
  } catch (e) {
    const rows = await query(
      `SELECT id, email, is_admin AS isAdmin, created_at
       FROM users WHERE id = ?`,
      [id]
    );
    const u = rows[0];
    return u ? { ...u, name: '' } : null;
  }
}

async function setUserRole(id, isAdmin) {
  await query(`UPDATE users SET is_admin = ? WHERE id = ?`, [isAdmin ? 1 : 0, id]);
  return true;
}

module.exports = { searchUsers, getUserById, setUserRole };
