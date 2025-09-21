
const express = require('express');
const { verifyToken } = require('../middleware/auth');
const ctrl = require('../controllers/orders.controller');

const router = express.Router();


router.post('/', verifyToken, ctrl.create);


router.get('/', verifyToken, ctrl.list);


router.post('/:id/cancel', verifyToken, ctrl.cancel);

module.exports = router;
