const Post = require('../models/Post');

// Hàm tạo ID tự tăng
const generatePostId = async () => {
    const posts = await Post.find();
    if (posts.length === 0) return "1";
    let maxId = 0;
    posts.forEach(p => {
        const numId = parseInt(p.id, 10);
        if (!isNaN(numId) && numId > maxId) maxId = numId;
    });
    return (maxId + 1).toString();
};

// 1. Lấy tất cả Post (Bao gồm xoá mềm để hiển thị gạch ngang)
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) { res.status(500).json(err); }
};

// 2. Tạo Post mới
exports.createPost = async (req, res) => {
    try {
        const newId = await generatePostId(); // ID tự tăng = maxId + 1
        const newPost = new Post({
            id: newId,
            title: req.body.title,
            content: req.body.content
        });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (err) { res.status(400).json(err); }
};

// 3. Xoá mềm Post
exports.softDeletePost = async (req, res) => {
    try {
        const post = await Post.findOneAndUpdate({ id: req.params.id }, { isDeleted: true }, { new: true });
        if (!post) return res.status(404).json({ message: "Không tìm thấy Post" });
        res.json({ message: "Xoá thành công (Soft Delete)", post });
    } catch (err) { res.status(400).json(err); }
};
