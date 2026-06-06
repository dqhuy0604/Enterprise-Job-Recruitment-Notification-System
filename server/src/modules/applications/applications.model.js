const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Hồ sơ ứng tuyển phải thuộc về một tin tuyển dụng cụ thể'],
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    candidateName: {
      type: String,
      required: [true, 'Tên ứng viên không được để trống'],
      trim: true,
    },
    candidateEmail: {
      type: String,
      required: [true, 'Email không được để trống'],
      trim: true,
      lowercase: true,
    },
    cvUrl: {
      type: String,
      required: [true, 'Đường dẫn file CV không được để trống'],
    },
    status: {
      type: String,
      enum: ['pending', 'interviewing', 'passed', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

applicationSchema.index({ studentId: 1, jobId: 1 }, { unique: true, sparse: true });
applicationSchema.index({ candidateEmail: 1, jobId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
