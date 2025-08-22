// backend/routes/parts.routes.js
const express = require('express');
const upload = require('../middleware/upload');
const { verifyToken, requireAdmin } = require('../middleware/auth');
const ctrl = require('../controllers/parts.controller');

const router = express.Router();

router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);
router.post('/', verifyToken, requireAdmin, upload.single('image'), ctrl.create);
router.delete('/:id', verifyToken, requireAdmin, ctrl.remove);
router.put('/:id', verifyToken, requireAdmin, upload.single('image'), ctrl.update);

module.exports = router;
