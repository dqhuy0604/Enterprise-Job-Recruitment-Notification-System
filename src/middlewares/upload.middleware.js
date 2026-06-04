// src/middlewares/upload.middleware.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Cấu hình nơi lưu file và tên file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/cvs';
    // Tự động tạo thư mục 'uploads/cvs' nếu chưa tồn tại trên máy
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Đặt tên file độc nhất để không bị đè: candidate-timestamp.pdf
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname); // Lấy đuôi file (.pdf, .docx)
    cb(null, `cv-${uniqueSuffix}${ext}`);
  }
});

// Bộ lọc chỉ cho phép nhận file tài liệu
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true); // Chấp nhận file
  } else {
    cb(new Error('Định dạng file không hợp lệ. Chỉ chấp nhận .pdf, .doc, .docx'), false);
  }
};

// Khởi tạo middleware multer với giới hạn dung lượng 5MB
const uploadCV = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

module.exports = uploadCV;