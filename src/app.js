const express = require('express');
const app = express();

// Middleware giúp Express đọc được dữ liệu JSON từ request body gửi lên
app.use(express.json());

// Thử nghiệm một Route cơ bản để kiểm tra xem server chạy ổn không
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Enterprise Recruitment API!'
  });
});

module.exports = app;