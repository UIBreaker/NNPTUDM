const express = require('express');
const router = express.Router();
const roleCtrl = require('../controllers/roleController');
const { verifyToken, checkRole } = require('../middleware/auth');

// RBAC: GET cho admin, mod. Còn lại chỉ admin
router.get('/', verifyToken, checkRole(['admin', 'mod']), roleCtrl.getAllRoles);
router.post('/', verifyToken, checkRole(['admin']), roleCtrl.createRole);
router.put('/:id', verifyToken, checkRole(['admin']), roleCtrl.updateRole);
router.delete('/:id', verifyToken, checkRole(['admin']), roleCtrl.deleteRole);

module.exports = router;
