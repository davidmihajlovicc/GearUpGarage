
const express = require('express');
const { verifyToken } = require('../middleware/auth');
const ctrl = require('../controllers/profile.controller');

const router = express.Router();

router.get('/profile', verifyToken, ctrl.get);
router.put('/profile', verifyToken, ctrl.update);

module.exports = router;
