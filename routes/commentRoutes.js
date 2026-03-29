const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// Lấy danh sách comment theo Post ID
router.get('/:postId', commentController.getCommentsByPost);

// Thêm Comment mới
router.post('/', commentController.createComment);

// Sửa Comment
router.put('/:id', commentController.updateComment);

// Xoá Comment
router.delete('/:id', commentController.deleteComment);

module.exports = router;
