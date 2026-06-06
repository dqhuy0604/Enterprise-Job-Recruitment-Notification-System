const { z } = require('zod');

const submitApplicationSchema = z.object({
  body: z.object({
    jobId: z.string().trim().min(24, 'ID tuyển dụng (MongoDB ObjectId) phải đủ 24 ký tự'),
    candidateName: z.string().trim().min(2, 'Tên ứng viên phải có ít nhất 2 ký tự'),
    candidateEmail: z.string().trim().email('Định dạng Email không hợp lệ! Vui lòng kiểm tra lại'),
  }),
});

const updateStatusSchema = z.object({
  params: z.object({
    id: z.string().trim().min(24, 'ID hồ sơ không hợp lệ'),
  }),
  body: z.object({
    status: z.enum(['pending', 'interviewing', 'passed', 'rejected'], {
      error: 'Trạng thái không hợp lệ! Chỉ chấp nhận: pending, interviewing, passed, rejected',
    }),
  }),
});

module.exports = { submitApplicationSchema, updateStatusSchema };
