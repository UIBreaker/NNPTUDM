const Product = require('../models/Product');

// GET (tất cả user - không đăng nhập)
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (err) { res.status(500).json(err); }
};

// CREATE (mod, admin)
exports.createProduct = async (req, res) => {
    try {
        const newProd = new Product(req.body);
        await newProd.save();
        res.status(201).json(newProd);
    } catch (err) { res.status(400).json(err); }
};

// UPDATE (mod, admin)
exports.updateProduct = async (req, res) => {
    try {
        const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: "Không tìm thấy Product" });
        res.json(updated);
    } catch (err) { res.status(400).json(err); }
};

// DELETE (admin)
exports.deleteProduct = async (req, res) => {
    try {
        const deleted = await Product.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Không tìm thấy Product" });
        res.json({ message: "Xoá thành công Product" });
    } catch (err) { res.status(400).json(err); }
};
