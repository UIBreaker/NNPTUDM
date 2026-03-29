const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../middleware/auth');

// 1. Lấy tất cả User (chưa bị xoá)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ isDeleted: false }).populate('role');
        res.json(users);
    } catch (err) { res.status(500).json(err); }
};

// 2. Tạo User mới (có băm mật khẩu)
exports.createUser = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            ...req.body,
            password: hashedPassword
        });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) { res.status(400).json(err); }
};

// Đăng nhập
exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username, isDeleted: false });
        if (!user) return res.status(404).json({ message: "Sai tài khoản hoặc mật khẩu!" });
        
        // So sánh mật khẩu
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ message: "Sai tài khoản hoặc mật khẩu!" });

        // Tăng đếm login lên 1
        user.loginCount += 1;
        await user.save();

        const token = jwt.sign(
            { id: user._id },
            SECRET_KEY,
            { expiresIn: '1d' }
        );

        res.json({ message: "Đăng nhập thành công", token, user });
    } catch (err) { res.status(500).json(err); }
};

// Thay đổi mật khẩu (có oldPassword và newPassword)
exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        // req.user được gắn từ verifyToken
        const user = await User.findById(req.user._id);

        const validOld = await bcrypt.compare(oldPassword, user.password);
        if (!validOld) return res.status(400).json({ message: "Mật khẩu cũ không chính xác!" });

        const salt = await bcrypt.genSalt(10);
        const hashedNew = await bcrypt.hash(newPassword, salt);

        user.password = hashedNew;
        await user.save();

        res.json({ message: "Đổi mật khẩu thành công!" });
    } catch (err) { res.status(500).json(err); }
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