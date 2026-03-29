const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    id: { type: String, unique: true }, // Tuỳ chọn, hoặc dùng _id mặc định
    title: { type: String, required: true },
    price: { type: Number, required: true },
    images: [{ type: String }],
    categoryId: { type: Number, default: 1 },
    description: { type: String, default: 'No description' }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
