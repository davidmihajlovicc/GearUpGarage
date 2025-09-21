
const Filters = require('../services/filters.service');

exports.brands = async (_req, res) => {
  try {
    const rows = await Filters.listBrands();
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.models = async (req, res) => {
  try {
    const rows = await Filters.listModels(req.query.brand_id);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.partTypes = async (_req, res) => {
  try {
    const rows = await Filters.listPartTypes();
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.years = (_req, res) => {
  try {
    const years = Filters.listYears();
    res.json(years);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.partSubtypes = async (req, res) => {
  try {
    const rows = await Filters.listPartSubtypes(req.query.part_type_id);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};
