const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// Route lẩy danh sách Posts
router.get('/', postController.getAllPosts);

// Route tạo Post mới
router.post('/', postController.createPost);

// Route Xoá mềm Post
router.delete('/:id', postController.softDeletePost);

module.exports = router;
