const Company = require('./companies.model');
const User = require('../users/users.model');
const Application = require('../applications/applications.model');
const Job = require('../jobs/jobs.model');
const { sendCompanyApprovalEmail } = require('../notifications/email.queue');

const registerCompany = async (req, res, next) => {
  try {
    const exists = await Company.findOne({ email: req.body.email });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Email công ty đã được đăng ký' });
    }

    const company = await Company.create(req.body);
    return res.status(201).json({
      success: true,
      message: 'Đăng ký công ty thành công! Vui lòng chờ Admin phê duyệt.',
      data: { id: company._id, name: company.name, status: company.status },
    });
  } catch (error) {
    return next(error);
  }
};

const getPendingCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find({ status: 'pending', isActive: true }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: companies });
  } catch (error) {
    return next(error);
  }
};

const approveCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy công ty' });
    }
    if (company.status === 'approved') {
      return res.status(400).json({ success: false, message: 'Công ty đã được phê duyệt' });
    }

    company.status = 'approved';
    company.isActive = true;
    company.companyCode = Company.generateCode();
    await company.save();

    await sendCompanyApprovalEmail(company);

    return res.status(200).json({
      success: true,
      message: `Đã phê duyệt! Mã công ty: ${company.companyCode} — đã gửi email tới ${company.email}`,
      data: company,
    });
  } catch (error) {
    return next(error);
  }
};

const rejectCompany = async (req, res, next) => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', isActive: false },
      { new: true }
    );
    if (!company) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy công ty' });
    }
    return res.status(200).json({
      success: true,
      message: 'Đã từ chối đăng ký công ty (soft delete — dữ liệu vẫn lưu trong hệ thống)',
      data: company,
    });
  } catch (error) {
    return next(error);
  }
};

const getMyCompany = async (req, res, next) => {
  try {
    if (!req.user.companyId) {
      return res.status(404).json({ success: false, message: 'Bạn chưa thuộc công ty nào' });
    }
    const company = await Company.findById(req.user.companyId);
    return res.status(200).json({ success: true, data: company });
  } catch (error) {
    return next(error);
  }
};

const updateMyCompany = async (req, res, next) => {
  try {
    const company = await Company.findByIdAndUpdate(req.user.companyId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!company) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy công ty' });
    }
    return res.status(200).json({
      success: true,
      message: 'Cập nhật thông tin công ty thành công',
      data: company,
    });
  } catch (error) {
    return next(error);
  }
};

const getCompanyStats = async (req, res, next) => {
  try {
    const companyId = req.user.companyId;
    const jobs = await Job.find({ companyId }).select('_id title');
    const jobIds = jobs.map((j) => j._id);

    const applications = await Application.find({ jobId: { $in: jobIds } });
    const byStatus = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {});

    const byMonth = {};
    applications.forEach((app) => {
      const key = `${app.createdAt.getFullYear()}-${String(app.createdAt.getMonth() + 1).padStart(2, '0')}`;
      byMonth[key] = (byMonth[key] || 0) + 1;
    });

    return res.status(200).json({
      success: true,
      data: {
        totalJobs: jobs.length,
        totalApplications: applications.length,
        byStatus,
        byMonth: Object.entries(byMonth).map(([month, count]) => ({ month, count })),
      },
    });
  } catch (error) {
    return next(error);
  }
};

const getCompanyEmployees = async (req, res, next) => {
  try {
    const employees = await User.find({
      companyId: req.user.companyId,
      role: 'hr',
      isActive: true,
    }).select('-password');
    return res.status(200).json({ success: true, data: employees });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  registerCompany,
  getPendingCompanies,
  approveCompany,
  rejectCompany,
  getMyCompany,
  updateMyCompany,
  getCompanyStats,
  getCompanyEmployees,
};
