const Application = require('./applications.model');
const Job = require('../jobs/jobs.model');
const User = require('../users/users.model');
const { addEmailToQueue, sendApplicationStatusEmail, sendNewApplicationEmailToHr } = require('../notifications/email.queue');
const { createNotification, notifyMany } = require('../notifications/notification.service');
const { isJobExpired } = require('../../utils/jobQuery');

const STATUS_LABELS = {
  pending: 'Đang chờ duyệt',
  interviewing: 'Mời phỏng vấn',
  passed: 'Đã chấp nhận',
  rejected: 'Đã từ chối',
};

const submitApplication = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng tải lên file CV của bạn (định dạng PDF hoặc DOCX)',
      });
    }

    const { jobId, candidateName, candidateEmail } = req.body;

    const jobExists = await Job.findById(jobId).populate('companyId');
    if (!jobExists) {
      return res.status(404).json({ success: false, message: 'Tin tuyển dụng này không tồn tại' });
    }

    if (jobExists.status !== 'active' || isJobExpired(jobExists)) {
      return res.status(400).json({ success: false, message: 'Tin tuyển dụng đã đóng hoặc quá hạn nộp hồ sơ' });
    }

    const duplicateQuery = req.user?.role === 'student'
      ? { studentId: req.user._id, jobId }
      : { candidateEmail: candidateEmail.toLowerCase(), jobId };

    const alreadyApplied = await Application.findOne(duplicateQuery);
    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: 'Bạn đã ứng tuyển tin tuyển dụng này rồi. Vui lòng theo dõi trạng thái tại trang Quản lý ứng tuyển.',
      });
    }

    const downloadUrl = `${req.protocol}://${req.get('host')}/uploads/cvs/${req.file.filename}`;

    const newApplication = await Application.create({
      jobId,
      studentId: req.user?.role === 'student' ? req.user._id : null,
      candidateName,
      candidateEmail,
      cvUrl: downloadUrl,
    });

    await addEmailToQueue(candidateEmail, candidateName, jobExists.title);

    if (req.user?.role === 'student') {
      await createNotification({
        userId: req.user._id,
        type: 'application_submitted',
        title: 'Ứng tuyển thành công',
        message: `Bạn đã nộp hồ sơ cho vị trí "${jobExists.title}"`,
        link: '/student/applications',
      });
    }

    if (jobExists.companyId) {
      const hrUsers = await User.find({
        companyId: jobExists.companyId,
        role: 'hr',
        isActive: true,
      });

      await notifyMany(
        hrUsers.map((u) => u._id),
        {
          type: 'new_application_hr',
          title: 'Hồ sơ ứng tuyển mới',
          message: `${candidateName} vừa nộp CV cho "${jobExists.title}"`,
          link: '/recruiter/applications',
        }
      );

      await Promise.all(
        hrUsers.map((hr) => sendNewApplicationEmailToHr(hr, newApplication, jobExists))
      );
    }

    return res.status(201).json({
      success: true,
      message: 'Ứng tuyển thành công! Hệ thống đang gửi mail xác nhận cho bạn.',
      data: newApplication,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Bạn đã ứng tuyển tin tuyển dụng này rồi.',
      });
    }
    return next(error);
  }
};

const getAllApplications = async (req, res, next) => {
  try {
    let filter = {};

    if (req.user.role === 'hr' && req.user.companyId) {
      const companyJobs = await Job.find({ companyId: req.user.companyId }).select('_id');
      filter = { jobId: { $in: companyJobs.map((j) => j._id) } };
    }

    const applications = await Application.find(filter)
      .populate({
        path: 'jobId',
        select: 'title salary location companyId',
        populate: { path: 'companyId', select: 'name' },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    return next(error);
  }
};

const getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id).populate('jobId', 'title description');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy hồ sơ ứng tuyển này' });
    }

    return res.status(200).json({ success: true, data: application });
  } catch (error) {
    return next(error);
  }
};

const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const statusLabel = STATUS_LABELS[status] || status;

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy hồ sơ ứng tuyển' });
    }

    const job = await Job.findById(application.jobId);
    if (req.user.role === 'hr' && String(job?.companyId) !== String(req.user.companyId)) {
      return res.status(403).json({ success: false, message: 'Không có quyền cập nhật hồ sơ này' });
    }

    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (application.studentId) {
      await createNotification({
        userId: application.studentId,
        type: 'application_status',
        title: 'Cập nhật trạng thái hồ sơ',
        message: `Hồ sơ "${job?.title}" → ${statusLabel}`,
        link: '/student/applications',
      });
    }

    await sendApplicationStatusEmail(updatedApplication, job, statusLabel);

    return res.status(200).json({
      success: true,
      message: `Đã cập nhật trạng thái hồ sơ sang: ${statusLabel}`,
      data: updatedApplication,
    });
  } catch (error) {
    return next(error);
  }
};

const deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy hồ sơ ứng tuyển cần xóa' });
    }

    return res.status(200).json({
      success: true,
      message: 'Đã xóa hồ sơ ứng tuyển thành công khỏi hệ thống',
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  submitApplication,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
};
