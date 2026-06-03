// src/modules/jobs/jobs.model.js
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Tiêu đề tin tuyển dụng là bắt buộc'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Mô tả công việc là bắt buộc'],
    },
    requirements: {
      type: String,
      required: [true, 'Yêu cầu ứng viên là bắt buộc'],
    },
    benefits: {
      type: String,
    },
    salary: {
      type: String,
      default: 'Thỏa thuận',
    },
    status: {
      type: String,
      enum: ['active', 'closed'], // Chỉ chấp nhận 1 trong 2 trạng thái này
      default: 'active',
    },
  },
  {
    timestamps: true, // Tự động tạo 2 trường: createdAt và updatedAt để theo dõi thời gian
  }
);

// Biên dịch Schema thành Model có tên là 'Job'
const Job = mongoose.model('Job', jobSchema);
module.exports = Job;