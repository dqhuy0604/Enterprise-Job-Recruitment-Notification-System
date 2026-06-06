const jwt = require('jsonwebtoken');
const User = require('../modules/users/users.model');

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Bạn không có quyền truy cập! Vui lòng đính kèm Token bảo mật.',
    });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user || !req.user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Người dùng thuộc Token này không còn tồn tại hoặc đã bị vô hiệu hóa',
      });
    }

    return next();
  } catch {
    return res.status(401).json({
      success: false,
      message: 'Token không hợp lệ hoặc đã hết hạn! Vui lòng đăng nhập lại.',
    });
  }
};

const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: `Tài khoản quyền [${req.user?.role || 'guest'}] không được phép thực hiện hành động này!`,
    });
  }
  return next();
};

const optionalProtect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return next();

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
  } catch {
    // Bỏ qua token không hợp lệ — xử lý như khách
  }
  return next();
};

module.exports = { protect, authorize, optionalProtect };
