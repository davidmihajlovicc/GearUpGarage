
const { query } = require('./_db');

async function listBrands() {
  return query('SELECT id, name FROM brands ORDER BY name');
}

async function listModels(brand_id) {
  if (!brand_id) return [];
  return query('SELECT id, name FROM models WHERE brand_id=? ORDER BY name', [brand_id]);
}

async function listPartTypes() {
  return query('SELECT id, name FROM part_types ORDER BY name');
}

function listYears() {
  const to = new Date().getFullYear();
  const from = 1980;
  const years = [];
  for (let y = from; y <= to; y++) years.push(y);
  return years.reverse();
}

async function listPartSubtypes(part_type_id) {
  if (!part_type_id) return [];
  return query('SELECT id, name FROM part_subtypes WHERE part_type_id=? ORDER BY name', [part_type_id]);
}

module.exports = { listBrands, listModels, listPartTypes, listYears, listPartSubtypes };
