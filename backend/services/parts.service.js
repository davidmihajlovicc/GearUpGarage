
const { query } = require('./_db');

function buildWhere(filters = {}) {
  const {
    brand_id,
    model_id,
    part_type_id,
    part_subtype_id,
    year_min,
    year_max,
    q,
    fuel,
  } = filters;

  const where = [];
  const vals = [];

  if (brand_id)        { where.push('p.brand_id = ?');        vals.push(brand_id); }
  if (model_id)        { where.push('p.model_id = ?');        vals.push(model_id); }
  if (part_type_id)    { where.push('p.part_type_id = ?');    vals.push(part_type_id); }
  if (part_subtype_id) { where.push('p.part_subtype_id = ?'); vals.push(part_subtype_id); }

  if (year_min && year_max) {
    where.push(`NOT (COALESCE(p.year_to, p.year_from) < ? OR p.year_from > ?)`);
    vals.push(Number(year_min), Number(year_max));
  } else if (year_min) {
    where.push('COALESCE(p.year_to, p.year_from) >= ?');
    vals.push(Number(year_min));
  } else if (year_max) {
    where.push('p.year_from <= ?');
    vals.push(Number(year_max));
  }

  if (q) {
    where.push('(p.title LIKE ? OR p.name LIKE ? OR b.name LIKE ? OR m.name LIKE ?)');
    const like = `%${q}%`;
    vals.push(like, like, like, like);
  }

  if (fuel) {
    where.push('p.fuel = ?');
    vals.push(fuel);
  }

  return { whereSql: where.length ? 'WHERE ' + where.join(' AND ') : '', vals };
}

async function listParts(filters = {}) {
  const { whereSql, vals } = buildWhere(filters);
  const sql = `
    SELECT
      p.id, p.title, p.name, p.price, p.image, p.year_from, p.year_to,
      p.fuel AS fuel,
      b.name AS brand, m.name AS model, t.name AS part_type,
      st.name AS part_subtype
    FROM parts p
    JOIN brands b ON b.id = p.brand_id
    JOIN models m ON m.id = p.model_id
    JOIN part_types t ON t.id = p.part_type_id
    LEFT JOIN part_subtypes st ON st.id = p.part_subtype_id
    ${whereSql}
    ORDER BY p.id DESC
    LIMIT 100
  `;
  return query(sql, vals);
}

async function getPartById(id) {
  const sql = `
    SELECT
      p.id, p.title, p.name, p.price, p.image, p.year_from, p.year_to,
      p.fuel AS fuel,
      b.id AS brand_id, b.name AS brand,
      m.id AS model_id, m.name AS model,
      t.id AS part_type_id, t.name AS part_type,
      st.id AS part_subtype_id, st.name AS part_subtype
    FROM parts p
    JOIN brands b ON b.id = p.brand_id
    JOIN models m ON m.id = p.model_id
    JOIN part_types t ON t.id = p.part_type_id
    LEFT JOIN part_subtypes st ON st.id = p.part_subtype_id
    WHERE p.id = ?
    LIMIT 1
  `;
  const rows = await query(sql, [id]);
  return rows[0] || null;
}

async function createPart(body, imagePath) {
  const {
    title, name, brand_id, model_id, part_type_id, part_subtype_id,
    price, year_from, year_to, fuel
  } = body;

  const allowedFuel = ['gas', 'diesel'];
  const fuelValue = allowedFuel.includes(fuel) ? fuel : null;

  const sql = `
    INSERT INTO parts
      (brand_id, model_id, part_type_id, part_subtype_id, title, name, year_from, year_to, price, image, fuel)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const vals = [
    brand_id,
    model_id,
    part_type_id,
    part_subtype_id || null,
    title,
    name || null,
    year_from ? Number(year_from) : null,
    year_to ? Number(year_to) : null,
    price ? Number(price) : 0,
    imagePath,
    fuelValue
  ];
  const result = await query(sql, vals);
  return { id: result.insertId, image: imagePath };
}

async function findImagePath(id) {
  const rows = await query('SELECT image FROM parts WHERE id = ?', [id]);
  return rows[0]?.image || null;
}

async function deletePart(id) {
  await query(`DELETE FROM orders WHERE part_id = ?`, [id]);
  await query(`DELETE FROM cart_items WHERE part_id = ?`, [id]);
  await query(`DELETE FROM parts WHERE id = ?`, [id]);
  return true;
}

async function updatePart(id, fields = {}, imagePath) {
  const b = fields || {};
  const data = {
    title: b.title ?? null,
    name: b.name ?? null,
    price: b.price ? Number(b.price) : null,
    year_from: b.year_from ? Number(b.year_from) : null,
    year_to: b.year_to ? Number(b.year_to) : null,
    fuel: b.fuel ?? null,
    brand_id: b.brand_id ? Number(b.brand_id) : null,
    model_id: b.model_id ? Number(b.model_id) : null,
    part_type_id: b.part_type_id ? Number(b.part_type_id) : null,
    part_subtype_id: b.part_subtype_id ? Number(b.part_subtype_id) : null,
  };

  const setParts = [];
  const values = [];

  Object.entries(data).forEach(([k, v]) => {
    if (v !== undefined) {
      setParts.push(`${k} = ?`);
      values.push(v);
    }
  });

  if (imagePath) {
    setParts.push('image = ?');
    values.push(imagePath);
  }

  if (!setParts.length) return null;

  await query(`UPDATE parts SET ${setParts.join(', ')} WHERE id = ?`, [...values, id]);
  const rows = await query('SELECT * FROM parts WHERE id = ?', [id]);
  return rows[0] || null;
}

module.exports = { listParts, getPartById, createPart, findImagePath, deletePart, updatePart };
