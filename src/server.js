require('dotenv').config(); // Nạp biến môi trường từ file .env đầu tiên
const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 5000;

// Khởi chạy hệ thống
const startServer = async () => {
  // 1. Kết nối database
  await connectDB();

  // 2. Lắng nghe cổng kết nối
  app.listen(PORT, () => {
    console.log(` Server is running on http://localhost:${PORT}`);
  });
};

startServer();