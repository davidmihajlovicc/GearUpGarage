// backend/routes/orders.routes.js
const express = require('express');
const { verifyToken } = require('../middleware/auth');
const ctrl = require('../controllers/orders.controller');

const router = express.Router();

// Create order (postojeće)
router.post('/', verifyToken, ctrl.create);

// NEW: listaj moje narudžbe (limit query param, default 5)
router.get('/', verifyToken, ctrl.list);

// NEW: otkaži moju narudžbu (samo ako < 24h)
router.post('/:id/cancel', verifyToken, ctrl.cancel);

module.exports = router;
