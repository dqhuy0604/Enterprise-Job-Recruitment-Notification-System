// src/app.js (Cập nhật phục vụ file tĩnh)
const express = require('express');
const path = require('path'); // Require thêm module 'path' có sẵn của Node.js
const app = express();

const jobRoutes = require('./modules/jobs/jobs.routes');
const applicationRoutes = require('./modules/applications/applications.routes');
const errorHandler = require('./middlewares/error.middleware');

app.use(express.json());

// CẤU HÌNH TẠI ĐÂY: Cho phép truy cập công khai vào thư mục 'uploads'
// Khi client gọi URL bắt đầu bằng '/uploads', Express sẽ tự động tìm file trong thư mục 'uploads' ở gốc dự án
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Welcome to Enterprise Recruitment API!' });
});

app.use(errorHandler);

module.exports = app;