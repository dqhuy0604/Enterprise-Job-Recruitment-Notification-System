// src/modules/jobs/jobs.controller.js
const Job = require('./jobs.model');

/**
 * @desc    Tạo tin tuyển dụng mới
 * @route   POST /api/jobs
 */
const createJob = async (req, res) => {
  try {
    // Lấy dữ liệu từ body do client gửi lên
    const { title, description, requirements, benefits, salary } = req.body;

    // Lưu vào database sử dụng Mongoose Model
    const newJob = await Job.create({
      title,
      description,
      requirements,
      benefits,
      salary,
    });

    // Trả về kết quả thành công cho client
    return res.status(201).json({
      success: true,
      message: 'Tạo tin tuyển dụng thành công!',
      data: newJob,
    });
  } catch (error) {
    // Xử lý lỗi hệ thống hoặc lỗi validate từ Mongoose
    return res.status(400).json({
      success: false,
      message: 'Không thể tạo tin tuyển dụng',
      error: error.message,
    });
  }
};

/**
 * @desc    Lấy danh sách tất cả tin tuyển dụng đang hoạt động (active)
 * @route   GET /api/jobs
 */
const getAllJobs = async (req, res) => {
  try {
    // Chỉ lấy các tin tuyển dụng có status là 'active' và sắp xếp mới nhất lên đầu
    const jobs = await Job.find({ status: 'active' }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách tin tuyển dụng',
      error: error.message,
    });
  }
};

module.exports = {
  createJob,
  getAllJobs,
};