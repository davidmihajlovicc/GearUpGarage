// backend/routes/filters.routes.js
const express = require('express');
const ctrl = require('../controllers/filters.controller');

const router = express.Router();

router.get('/brands', ctrl.brands);
router.get('/models', ctrl.models);
router.get('/part-types', ctrl.partTypes);
router.get('/years', ctrl.years);
router.get('/part-subtypes', ctrl.partSubtypes);

module.exports = router;
