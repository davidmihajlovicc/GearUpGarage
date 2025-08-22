// backend/services/profile.service.js
const { query } = require('./_db');

async function getProfile(userId) {
  const rows = await query('SELECT * FROM user_profiles WHERE user_id=? LIMIT 1', [userId]);
  return rows[0] || null;
}

async function upsertProfile(userId, data = {}) {
  const {
    full_name, phone, address_line1, house_no,
    address_line2 = null, city, postal_code, country = 'Hrvatska'
  } = data;

  if (!full_name || !phone || !address_line1 || !house_no || !city || !postal_code) {
    const err = new Error('Molimo ispunite sva obavezna polja.');
    err.status = 400;
    throw err;
  }

  await query(
    `INSERT INTO user_profiles
      (user_id, full_name, phone, address_line1, house_no, address_line2, city, postal_code, country)
     VALUES (?,?,?,?,?,?,?,?,?)
     ON DUPLICATE KEY UPDATE
      full_name=VALUES(full_name),
      phone=VALUES(phone),
      address_line1=VALUES(address_line1),
      house_no=VALUES(house_no),
      address_line2=VALUES(address_line2),
      city=VALUES(city),
      postal_code=VALUES(postal_code),
      country=VALUES(country)
    `,
    [userId, full_name, phone, address_line1, house_no, address_line2, city, postal_code, country]
  );

  return { ok: true };
}

module.exports = { getProfile, upsertProfile };
