// src/modules/applications/applications.controller.js
const Application = require('./applications.model');
const Job = require('../jobs/jobs.model');
const { addEmailToQueue } = require('../notifications/email.queue');
/**
 * @desc    Ứng viên nộp hồ sơ ứng tuyển (Gồm chữ và File CV)
 * @route   POST /api/applications
 */
const submitApplication = async (req, res) => { // <--- Biến 'req' được định nghĩa ở đây
  try {
    // 1. Kiểm tra xem ứng viên đã upload file chưa
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Vui lòng tải lên file CV của bạn' });
    }

    const { jobId, candidateName, candidateEmail } = req.body;

    // Kiểm tra tin tuyển dụng có tồn tại không
    const jobExists = await Job.findById(jobId);
    if (!jobExists) {
      return res.status(404).json({ success: false, message: 'Tin tuyển dụng này không tồn tại' });
    }

    // ĐẶT ĐÚNG VỊ TRÍ NÀY: Lúc này req và req.file đã chắc chắn tồn tại hợp lệ
    const downloadUrl = `${req.protocol}://${req.get('host')}/uploads/cvs/${req.file.filename}`;

    // 2. Tiến hành lưu vào Database với cvUrl là đường dẫn tuyệt đối vừa tạo
    const newApplication = await Application.create({
      jobId,
      candidateName,
      candidateEmail,
      cvUrl: downloadUrl // <-- Lưu link đầy đủ dạng http://localhost:5000/uploads/cvs/...
    });

    // 3. Gọi hàng đợi gửi mail ngầm qua Redis
    await addEmailToQueue(candidateEmail, candidateName, jobExists.title);

    // 4. Trả kết quả về cho ứng viên
    return res.status(201).json({
      success: true,
      message: 'Nộp hồ sơ ứng tuyển thành công! Hệ thống đang gửi mail xác nhận cho bạn.',
      data: newApplication
    });

  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
// src/modules/applications/applications.controller.js

// ... Giữ nguyên hàm submitApplication cũ ở đây ...

/**
 * @desc    Lấy danh sách tất cả hồ sơ ứng tuyển
 * @route   GET /api/applications
 */
const getAllApplications = async (req, res) => {
  try {
    // Dùng .populate('jobId', 'title salary') để lôi thêm thông tin tiêu đề và mức lương của Job đó vào kết quả
    const applications = await Application.find()
      .populate('jobId', 'title salary')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách hồ sơ',
      error: error.message
    });
  }
};

/**
 * @desc    Xem chi tiết 1 hồ sơ ứng tuyển
 * @route   GET /api/applications/:id
 */
const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate('jobId', 'title description');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy hồ sơ ứng tuyển này'
      });
    }

    return res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi tìm hồ sơ',
      error: error.message
    });
  }
};

/**
 * @desc    Cập nhật trạng thái hồ sơ (Duyệt/Từ chối)
 * @route   PATCH /api/applications/:id/status
 */
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Ràng buộc kiểm tra xem status gửi lên có hợp lệ với enum đã định nghĩa không
    const validStatuses = ['pending', 'interviewing', 'passed', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái cập nhật không hợp lệ. Chỉ chấp nhận: pending, interviewing, passed, rejected'
      });
    }

    // Tiến hành cập nhật trạng thái mới
    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true } // new: true để trả về dữ liệu MỚI sau khi sửa
    );

    if (!updatedApplication) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy hồ sơ ứng tuyển để cập nhật'
      });
    }

    return res.status(200).json({
      success: true,
      message: `Đã cập nhật trạng thái hồ sơ thành: ${status}`,
      data: updatedApplication
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Lỗi khi cập nhật trạng thái',
      error: error.message
    });
  }
};

/**
 * @desc    Xóa một hồ sơ ứng tuyển
 * @route   DELETE /api/applications/:id
 */
const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy hồ sơ ứng tuyển để xóa'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Đã xóa hồ sơ ứng tuyển thành công khỏi hệ thống'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa hồ sơ',
      error: error.message
    });
  }
};

module.exports = {
  submitApplication,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication
};
