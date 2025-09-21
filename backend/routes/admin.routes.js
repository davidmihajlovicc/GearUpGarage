
const express = require('express');
const { verifyToken, requireAdmin } = require('../middleware/auth');
const ctrl = require('../controllers/admin.controller');

const router = express.Router();

router.get('/users', verifyToken, requireAdmin, ctrl.searchUsers);
router.get('/users/:id', verifyToken, requireAdmin, ctrl.getUser);
router.patch('/users/:id/role', verifyToken, requireAdmin, ctrl.setRole);

module.exports = router;
