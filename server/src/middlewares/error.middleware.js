const multer = require('multer');

const errorHandler = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu JSON gửi lên bị lỗi cú pháp! Vui lòng kiểm tra lại dấu phẩy, dấu ngoặc kép.',
    });
  }

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      const isAi = req.originalUrl?.includes('ai-analyze');
      return res.status(400).json({
        success: false,
        message: isAi
          ? 'File CV quá lớn! Giới hạn 2MB cho phân tích AI.'
          : 'File tải lên quá lớn! Vui lòng chọn file dưới 5MB.',
      });
    }
    return res.status(400).json({ success: false, message: `Lỗi upload file: ${err.message}` });
  }

  if (err.message?.includes('Định dạng file không hợp lệ')) {
    return res.status(400).json({ success: false, message: err.message });
  }

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors,
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'dữ liệu';
    return res.status(400).json({
      success: false,
      message: `${field} này đã tồn tại trong hệ thống!`,
    });
  }

  console.error('Lỗi hệ thống:', err.stack);
  return res.status(500).json({
    success: false,
    message: 'Đã có lỗi xảy ra từ hệ thống phía Server!',
  });
};

module.exports = errorHandler;
