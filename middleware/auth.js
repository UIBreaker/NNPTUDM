const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SECRET_KEY = "hutech_secret_key_2026"; // Nên dùng file .env thực tế

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Không tìm thấy token đăng nhập!" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, SECRET_KEY);
        
        // Populate role để lấy name (admin, mod)
        const user = await User.findById(decoded.id).populate('role');
        if (!user) return res.status(404).json({ message: "Người dùng không tồn tại!" });

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
    }
};

const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role || !req.user.role.name) {
            return res.status(403).json({ message: "Bạn không có quyền truy cập (Không có Role)." });
        }

        if (allowedRoles.includes(req.user.role.name.toLowerCase())) {
            next();
        } else {
            return res.status(403).json({ message: "Quyền truy cập bị từ chối." });
        }
    }
};

module.exports = {
    SECRET_KEY,
    verifyToken,
    checkRole
};
