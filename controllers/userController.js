const User = require('../models/User');

// 1. Lấy tất cả User (chưa bị xoá)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ isDeleted: false }).populate('role');
        res.json(users);
    } catch (err) { res.status(500).json(err); }
};

// 2. Tạo User mới
exports.createUser = async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) { res.status(400).json(err); }
};

// 3. Xoá mềm (Update isDeleted = true)
exports.softDeleteUser = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, { isDeleted: true });
        res.json({ message: "Xoá thành công (Soft Delete)" });
    } catch (err) { res.status(400).json(err); }
};

// 4. Hàm /enable: Chuyển status sang true
exports.enableUser = async (req, res) => {
    const { email, username } = req.body;
    try {
        const user = await User.findOneAndUpdate(
            { email, username, isDeleted: false },
            { status: true },
            { new: true }
        );
        if (!user) return res.status(404).json("Thông tin không chính xác!");
        res.json(user);
    } catch (err) { res.status(400).json(err); }
};

// 5. Hàm /disable: Chuyển status sang false
exports.disableUser = async (req, res) => {
    const { email, username } = req.body;
    try {
        const user = await User.findOneAndUpdate(
            { email, username, isDeleted: false },
            { status: false },
            { new: true }
        );
        if (!user) return res.status(404).json("Thông tin không chính xác!");
        res.json(user);
    } catch (err) { res.status(400).json(err); }
};