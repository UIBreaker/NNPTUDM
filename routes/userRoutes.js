const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');
const { verifyToken, checkRole } = require('../middleware/auth');

// Public route: Đăng nhập
router.post('/login', userCtrl.login);

// Require auth: Đổi mật khẩu
router.post('/change-password', verifyToken, userCtrl.changePassword);

// Các chức năng CRUD (theo yêu cầu RBAC)
// GET: Admin và Mod
router.get('/', verifyToken, checkRole(['admin', 'mod']), userCtrl.getAllUsers);

// POST, PUT, DELETE: Chỉ Admin
router.post('/', verifyToken, checkRole(['admin']), userCtrl.createUser);
router.delete('/:id', verifyToken, checkRole(['admin']), userCtrl.softDeleteUser);
router.post('/enable', verifyToken, checkRole(['admin']), userCtrl.enableUser);
router.post('/disable', verifyToken, checkRole(['admin']), userCtrl.disableUser);

module.exports = router;