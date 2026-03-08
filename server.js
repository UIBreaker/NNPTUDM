const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(express.json()); // Để server đọc được dữ liệu JSON từ request

// Kết nối MongoDB (Thay 'test' bằng tên DB bạn muốn)
mongoose.connect('mongodb://localhost:27017/HutechDB')
    .then(() => console.log("DB Connected!"))
    .catch(err => console.log(err));

// Sử dụng Routes
app.use('/api/users', userRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server chạy tại: http://localhost:${PORT}`));