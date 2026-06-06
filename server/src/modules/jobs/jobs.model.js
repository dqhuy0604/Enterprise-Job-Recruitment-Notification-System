const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Tiêu đề tin tuyển dụng là bắt buộc'],
      trim: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },
    description: {
      type: String,
      required: [true, 'Mô tả công việc là bắt buộc'],
    },
    requirements: {
      type: String,
      required: [true, 'Yêu cầu ứng viên là bắt buộc'],
    },
    benefits: { type: String },
    salary: { type: String, default: 'Thỏa thuận' },
    location: { type: String, trim: true, default: 'Hà Nội' },
    industry: { type: String, trim: true, default: 'CNTT' },
    type: {
      type: String,
      enum: ['full-time', 'part-time', 'remote', 'hybrid'],
      default: 'full-time',
    },
    deadline: { type: Date },
    contactEmail: { type: String, trim: true },
    contactPhone: { type: String, trim: true },
    status: {
      type: String,
      enum: ['active', 'closed'],
      default: 'active',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
