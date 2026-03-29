const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    postId: { type: String, required: true }, // Liên kết với Post.id
    content: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Comment', CommentSchema);
