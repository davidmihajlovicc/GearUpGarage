// backend/routes/orders.routes.js
const express = require('express');
const { verifyToken } = require('../middleware/auth');
const ctrl = require('../controllers/orders.controller');

const router = express.Router();

router.post('/', verifyToken, ctrl.create);

module.exports = router;
