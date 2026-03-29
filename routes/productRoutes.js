const express = require('express');
const router = express.Router();
const prodCtrl = require('../controllers/productController');
const { verifyToken, checkRole } = require('../middleware/auth');

// Yêu cầu: get (tất cả user - không đăng nhập), create,update: (mod,admin) , delete (admin)

// Dành cho toàn bộ khách (không Auth)
router.get('/', prodCtrl.getAllProducts);

// CREATE & UPDATE: mod, admin
router.post('/', verifyToken, checkRole(['admin', 'mod']), prodCtrl.createProduct);
router.put('/:id', verifyToken, checkRole(['admin', 'mod']), prodCtrl.updateProduct);

// DELETE: admin
router.delete('/:id', verifyToken, checkRole(['admin']), prodCtrl.deleteProduct);

module.exports = router;
