const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const roleRoutes = require('./routes/roleRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();
app.use(express.json()); // Để server đọc được dữ liệu JSON từ request

// Host file tĩnh HTML/CSS/JS thuộc thư mục public
app.use(express.static(path.join(__dirname, 'public')));

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/HutechDB')
    .then(() => console.log("DB Connected!"))
    .catch(err => console.log(err));

// Sử dụng Routes API
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/products', productRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server chạy tại: http://localhost:${PORT}`));