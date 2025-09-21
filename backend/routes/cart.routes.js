
const express = require('express');
const { verifyToken } = require('../middleware/auth');
const ctrl = require('../controllers/cart.controller');

const router = express.Router();

router.get('/cart', verifyToken, ctrl.get);
router.post('/cart', verifyToken, ctrl.add);
router.patch('/cart', verifyToken, ctrl.update);
router.delete('/cart/:part_id', verifyToken, ctrl.remove);
router.post('/cart/checkout', verifyToken, ctrl.checkout);

module.exports = router;
