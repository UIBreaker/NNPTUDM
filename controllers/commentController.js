const Comment = require('../models/Comment');

// Hàm tạo ID tự tăng
const generateCommentId = async () => {
    const comments = await Comment.find();
    if (comments.length === 0) return "1";
    let maxId = 0;
    comments.forEach(c => {
        const numId = parseInt(c.id, 10);
        if (!isNaN(numId) && numId > maxId) maxId = numId;
    });
    return (maxId + 1).toString();
};

// Lấy danh sách comment theo Id bài viết
exports.getCommentsByPost = async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId }).sort({ createdAt: 1 });
        res.json(comments);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// Tạo Comment mới cho một bài viết
exports.createComment = async (req, res) => {
    try {
        const newId = await generateCommentId(); // ID tự tăng = maxId + 1
        const newComment = new Comment({
            id: newId,
            postId: req.body.postId,
            content: req.body.content
        });
        await newComment.save();
        res.status(201).json(newComment);
    } catch (err) { res.status(400).json({ error: err.message }); }
};

// Cập nhật Comment
exports.updateComment = async (req, res) => {
    try {
        const updated = await Comment.findOneAndUpdate(
            { id: req.params.id },
            { content: req.body.content },
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: "Không tìm thấy Comment" });
        res.json(updated);
    } catch (err) { res.status(400).json({ error: err.message }); }
};

// Xoá Comment (Hard delete)
exports.deleteComment = async (req, res) => {
    try {
        const deleted = await Comment.findOneAndDelete({ id: req.params.id });
        if (!deleted) return res.status(404).json({ message: "Không tìm thấy Comment" });
        res.json({ message: "Xoá thành công Comment", comment: deleted });
    } catch (err) { res.status(400).json({ error: err.message }); }
};
