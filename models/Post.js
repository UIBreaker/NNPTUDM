const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    isDeleted: { type: Boolean, default: false } // Phục vụ xoá mềm
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
