const { Queue } = require('bullmq');
const redisConfig = require('../../config/redis');

const emailQueue = new Queue('recruitment-email-queue', { connection: redisConfig });

const queueEmail = async ({ to, subject, body }) => {
  try {
    await emailQueue.add(
      'send-email',
      { to, subject, body },
      { attempts: 3, backoff: 5000 }
    );
  } catch (error) {
    console.error('Lỗi khi thêm email vào hàng đợi:', error.message);
  }
};

const addEmailToQueue = async (emailTo, candidateName, jobTitle) =>
  queueEmail({
    to: emailTo,
    subject: `[RecruitHub] Xác nhận nhận hồ sơ ứng tuyển - ${jobTitle}`,
    body: `Chào ${candidateName},\n\nChúng tôi đã nhận được hồ sơ của bạn cho vị trí "${jobTitle}".\nĐội ngũ Tuyển dụng sẽ đánh giá CV và phản hồi trong thời gian sớm nhất.\n\nTrân trọng,\nRecruitHub`,
  });

const sendCompanyApprovalEmail = async (company) =>
  queueEmail({
    to: company.email,
    subject: '[RecruitHub] Công ty đã được phê duyệt - Mã kích hoạt',
    body: `Kính gửi ${company.name},\n\nCông ty của bạn đã được Admin phê duyệt trên hệ thống RecruitHub.\n\nMã công ty (Company Code): ${company.companyCode}\n\nVui lòng chia sẻ mã này cho nhân viên HR để đăng ký tài khoản tại: ${process.env.CLIENT_URL || 'http://localhost:5173'}/business/register-hr\n\nTrân trọng,\nRecruitHub`,
  });

const sendApplicationStatusEmail = async (application, job, statusLabel) =>
  queueEmail({
    to: application.candidateEmail,
    subject: `[RecruitHub] Cập nhật trạng thái hồ sơ - ${job.title}`,
    body: `Chào ${application.candidateName},\n\nHồ sơ ứng tuyển vị trí "${job.title}" đã được cập nhật.\nTrạng thái mới: ${statusLabel}\n\nĐăng nhập để xem chi tiết: ${process.env.CLIENT_URL || 'http://localhost:5173'}/student/applications\n\nTrân trọng,\nRecruitHub`,
  });

const sendNewApplicationEmailToHr = async (hrUser, application, job) =>
  queueEmail({
    to: hrUser.email,
    subject: `[RecruitHub] Hồ sơ ứng tuyển mới - ${job.title}`,
    body: `Chào ${hrUser.name},\n\nỨng viên ${application.candidateName} (${application.candidateEmail}) vừa nộp hồ sơ cho vị trí "${job.title}".\n\nXem tại: ${process.env.CLIENT_URL || 'http://localhost:5173'}/recruiter/applications\n\nTrân trọng,\nRecruitHub`,
  });

module.exports = {
  queueEmail,
  addEmailToQueue,
  sendCompanyApprovalEmail,
  sendApplicationStatusEmail,
  sendNewApplicationEmailToHr,
};
