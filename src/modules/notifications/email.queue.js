// src/modules/notifications/email.queue.js
const { Queue } = require('bullmq');
const redisConfig = require('../../config/redis');

// Khởi tạo hàng đợi có tên định danh là 'recruitment-email-queue'
const emailQueue = new Queue('recruitment-email-queue', {
  connection: redisConfig
});

/**
 * Hàm thêm một tác vụ gửi email vào hàng đợi Redis
 */
const addEmailToQueue = async (emailTo, candidateName, jobTitle) => {
  try {
    await emailQueue.add('send-notification', {
      to: emailTo,
      subject: `[FPT IS] Xác nhận nhận hồ sơ ứng tuyển - Vị trí ${jobTitle}`,
      body: `Chào ${candidateName},\n\nChúng tôi đã nhận được hồ sơ của bạn cho vị trí ${jobTitle}.\nĐội ngũ Tuyển dụng sẽ đánh giá CV và phản hồi lại bạn trong thời gian sớm nhất.\n\nTrân trọng,\nFPT IS Recruitment Team.`
    }, {
      attempts: 3,       // Nếu lỗi (mất mạng, nghẽn mạng), tự động thử lại tối đa 3 lần
      backoff: 5000      // Thời gian chờ giữa các lần thử lại là 5 giây (5000ms)
    });
    
    console.log(`🚀 [Queue] Đã ném Job gửi mail cho ${emailTo} vào Redis!`);
  } catch (error) {
    console.error('❌ Lỗi khi thêm vào hàng đợi:', error.message);
  }
};

module.exports = { addEmailToQueue };