const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');

router.get('/', userCtrl.getAllUsers);
router.post('/', userCtrl.createUser);
router.delete('/:id', userCtrl.softDeleteUser);

router.post('/enable', userCtrl.enableUser);
router.post('/disable', userCtrl.disableUser);

module.exports = router;