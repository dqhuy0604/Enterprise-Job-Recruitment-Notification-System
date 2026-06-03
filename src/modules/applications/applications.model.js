
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId, // Kiểu dữ liệu ID đặc trưng của MongoDB
      ref: 'Job', // Liên kết trực tiếp tới Model 'Job'
      required: [true, 'Hồ sơ ứng tuyển phải thuộc về một tin tuyển dụng cụ thể'],
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
      lowercase: true, // Tự động chuyển email thành chữ thường
    },
    cvUrl: {
      type: String,
      required: [true, 'Đường dẫn file CV không được để trống'], // Sau này sẽ lưu đường dẫn file PDF sau khi upload thành công
    },
    status: {
      type: String,
      enum: ['pending', 'interviewing', 'passed', 'rejected'],
      default: 'pending', // Mặc định khi nộp vào sẽ ở trạng thái Chờ duyệt
    },
  },
  {
    timestamps: true,
  }
);

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;