// src/middlewares/error.middleware.js
const multer = require('multer');

const errorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File tải lên quá lớn! Vui lòng chọn file có dung lượng dưới 5MB.'
      });
    }
    return res.status(400).json({
      success: false,
      message: `Lỗi upload file: ${err.message}`
    });
  }

  if (err.message && err.message.includes('Định dạng file không hợp lệ')) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  console.error('💥 Lỗi hệ thống:', err.stack);
  return res.status(500).json({
    success: false,
    message: 'Đã có lỗi xảy ra từ hệ thống phía Server!'
  });
};

module.exports = errorHandler;