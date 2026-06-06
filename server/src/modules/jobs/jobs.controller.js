const Job = require('./jobs.model');
const { buildActiveJobFilter, isJobExpired } = require('../../utils/jobQuery');

const populateCompany = { path: 'companyId', select: 'name logo email contactPhone address description' };

const createJob = async (req, res, next) => {
  try {
    const {
      title, description, requirements, benefits, salary,
      location, industry, type, deadline, contactEmail, contactPhone,
    } = req.body;

    const newJob = await Job.create({
      title,
      description,
      requirements,
      benefits,
      salary,
      location,
      industry,
      type,
      deadline,
      contactEmail,
      contactPhone,
      companyId: req.user.companyId || null,
      createdBy: req.user._id,
    });

    const job = await Job.findById(newJob._id).populate(populateCompany);

    return res.status(201).json({
      success: true,
      message: 'Đăng tin tuyển dụng thành công!',
      data: job,
    });
  } catch (error) {
    return next(error);
  }
};

const getAllJobs = async (req, res, next) => {
  try {
    const { search, location, industry, type, status, page = 1, limit = 10 } = req.query;
    const isHrMine = req.user?.role === 'hr' && req.query.mine === 'true';

    const conditions = [];

    if (isHrMine) {
      conditions.push({ companyId: req.user.companyId });
      if (status && status !== 'all') conditions.push({ status });
    } else if (status === 'all' && req.user?.role === 'admin') {
      // Admin xem tất cả — không lọc hạn
    } else if (status === 'closed') {
      conditions.push({ status: 'closed' });
    } else {
      conditions.push(buildActiveJobFilter());
    }

    if (search) {
      conditions.push({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ],
      });
    }
    if (location) conditions.push({ location: { $regex: location, $options: 'i' } });
    if (industry) conditions.push({ industry });
    if (type) conditions.push({ type });

    const queryObject = conditions.length <= 1 ? (conditions[0] || {}) : { $and: conditions };

    const currentPage = Number(page);
    const perPage = Math.min(Number(limit), 50);
    const skipValue = (currentPage - 1) * perPage;

    const totalJobs = await Job.countDocuments(queryObject);
    const jobs = await Job.find(queryObject)
      .populate(populateCompany)
      .sort({ createdAt: -1 })
      .skip(skipValue)
      .limit(perPage);

    return res.status(200).json({
      success: true,
      pagination: {
        totalItems: totalJobs,
        totalPages: Math.ceil(totalJobs / perPage),
        currentPage,
        limit: perPage,
        hasNextPage: currentPage < Math.ceil(totalJobs / perPage),
        hasPrevPage: currentPage > 1,
      },
      data: jobs,
    });
  } catch (error) {
    return next(error);
  }
};

const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate(populateCompany);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tin tuyển dụng này' });
    }

    return res.status(200).json({
      success: true,
      data: job,
      meta: { expired: isJobExpired(job), canApply: job.status === 'active' && !isJobExpired(job) },
    });
  } catch (error) {
    return next(error);
  }
};

const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tin tuyển dụng để cập nhật' });
    }

    if (req.user.role === 'hr' && String(job.companyId) !== String(req.user.companyId)) {
      return res.status(403).json({ success: false, message: 'Không có quyền sửa tin này' });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate(populateCompany);

    return res.status(200).json({
      success: true,
      message: 'Cập nhật tin tuyển dụng thành công!',
      data: updatedJob,
    });
  } catch (error) {
    return next(error);
  }
};

const updateJobStatus = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tin tuyển dụng' });
    }

    if (req.user.role === 'hr' && String(job.companyId) !== String(req.user.companyId)) {
      return res.status(403).json({ success: false, message: 'Không có quyền thao tác tin này' });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    ).populate(populateCompany);

    const statusLabel = req.body.status === 'active' ? 'đang mở' : 'đã đóng';

    return res.status(200).json({
      success: true,
      message: `Tin tuyển dụng hiện ${statusLabel}`,
      data: updatedJob,
    });
  } catch (error) {
    return next(error);
  }
};

const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, { status: 'closed' }, { new: true });

    if (!job) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tin tuyển dụng cần xóa' });
    }

    return res.status(200).json({ success: true, message: 'Đã ẩn tin tuyển dụng (soft delete)' });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  updateJobStatus,
  deleteJob,
};
