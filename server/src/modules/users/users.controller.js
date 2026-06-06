const User = require('./users.model');
const Company = require('../companies/companies.model');
const jwt = require('jsonwebtoken');

const generateToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  companyId: user.companyId?._id || user.companyId || null,
  company: user.companyId?.name
    ? { id: user.companyId._id, name: user.companyId.name, logo: user.companyId.logo }
    : null,
});

const registerStudent = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    if (await User.findOne({ email })) {
      return res.status(400).json({ success: false, message: 'Email này đã được sử dụng!' });
    }

    const user = await User.create({ name, email, password, phone, role: 'student' });
    return res.status(201).json({
      success: true,
      message: 'Đăng ký tài khoản sinh viên thành công!',
      token: generateToken(user),
      data: formatUser(user),
    });
  } catch (error) {
    return next(error);
  }
};

const registerHr = async (req, res, next) => {
  try {
    const { name, email, password, companyCode, phone } = req.body;

    if (await User.findOne({ email })) {
      return res.status(400).json({ success: false, message: 'Email này đã được sử dụng!' });
    }

    const company = await Company.findOne({ companyCode, status: 'approved', isActive: true });
    if (!company) {
      return res.status(400).json({ success: false, message: 'Mã công ty không hợp lệ hoặc chưa được phê duyệt' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: 'hr',
      companyId: company._id,
    });

    const populated = await User.findById(user._id).populate('companyId', 'name logo');
    return res.status(201).json({
      success: true,
      message: 'Đăng ký tài khoản nhân viên thành công!',
      token: generateToken(user),
      data: formatUser(populated),
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password').populate('companyId', 'name logo');

    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không chính xác' });
    }

    if (!(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không chính xác' });
    }

    return res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công!',
      token: generateToken(user),
      data: formatUser(user),
    });
  } catch (error) {
    return next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('companyId', 'name logo');
    return res.status(200).json({ success: true, data: formatUser(user) });
  } catch (error) {
    return next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
      .populate('companyId', 'name logo');
    return res.status(200).json({
      success: true,
      message: 'Cập nhật thông tin thành công',
      data: formatUser(user),
    });
  } catch (error) {
    return next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ success: false, message: 'Mật khẩu hiện tại không đúng' });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({ success: true, message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    return next(error);
  }
};

const createEmployee = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    if (await User.findOne({ email })) {
      return res.status(400).json({ success: false, message: 'Email đã tồn tại' });
    }

    const employee = await User.create({
      name,
      email,
      password,
      phone,
      role: 'hr',
      companyId: req.user.companyId,
    });

    return res.status(201).json({
      success: true,
      message: 'Tạo tài khoản nhân viên thành công',
      data: { id: employee._id, name: employee.name, email: employee.email },
    });
  } catch (error) {
    return next(error);
  }
};

const deactivateEmployee = async (req, res, next) => {
  try {
    const employee = await User.findOne({
      _id: req.params.id,
      companyId: req.user.companyId,
      role: 'hr',
    });

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy nhân viên' });
    }

    if (String(employee._id) === String(req.user._id)) {
      return res.status(400).json({ success: false, message: 'Không thể vô hiệu hóa chính mình' });
    }

    employee.isActive = false;
    await employee.save();

    return res.status(200).json({
      success: true,
      message: 'Đã vô hiệu hóa nhân viên (soft delete)',
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  registerStudent,
  registerHr,
  login,
  getMe,
  updateProfile,
  changePassword,
  createEmployee,
  deactivateEmployee,
};
