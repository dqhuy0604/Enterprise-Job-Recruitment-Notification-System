// src/modules/notifications/email.worker.js
const { Worker } = require('bullmq');
const nodemailer = require('nodemailer');
const redisConfig = require('../../config/redis');

// Khởi tạo cấu hình gửi Email (Sử dụng Gmail SMTP để test)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Sẽ cấu hình trong file .env
    pass: process.env.EMAIL_PASS  // Mật khẩu ứng dụng (App Password) của Gmail
  }
});

// Tạo Worker lắng nghe cùng tên hàng đợi 'recruitment-email-queue'
const emailWorker = new Worker('recruitment-email-queue', async (job) => {
  console.log(`📦 [Worker] Đang xử lý Job ID: ${job.id} -> Gửi đến: ${job.data.to}`);
  
  const { to, subject, body } = job.data;

  // Thực hiện gửi mail bằng Nodemailer
  await transporter.sendMail({
    from: `"FPT IS Recruitment System" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: subject,
    text: body
  });

  console.log(`✅ [Worker] Đã gửi email thành công cho ${to}!`);
}, {
  connection: redisConfig
});

// Lắng nghe sự kiện để tiện theo dõi log hệ thống
emailWorker.on('completed', (job) => {
  console.log(`🎉 Job ID ${job.id} đã hoàn thành nhiệm vụ và giải phóng khỏi RAM Redis.`);
});

emailWorker.on('failed', (job, err) => {
  console.error(`❌ Job ID ${job.id} thất bại! Lý do: ${err.message}`);
});

module.exports = emailWorker;