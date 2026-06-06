const { z } = require('zod');

const jobIdParamSchema = z.object({
  params: z.object({
    id: z.string().trim().length(24, 'ID tin tuyển dụng không hợp lệ'),
  }),
});

const createJobSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1, 'Tiêu đề tin tuyển dụng là bắt buộc'),
    description: z.string().trim().min(1, 'Mô tả công việc là bắt buộc'),
    requirements: z.string().trim().min(1, 'Yêu cầu ứng viên là bắt buộc'),
    benefits: z.string().trim().optional(),
    salary: z.string().trim().optional(),
    location: z.string().trim().optional(),
    industry: z.string().trim().optional(),
    type: z.enum(['full-time', 'part-time', 'remote', 'hybrid']).optional(),
    deadline: z.string().optional(),
    contactEmail: z.string().trim().email().optional().or(z.literal('')),
    contactPhone: z.string().trim().optional(),
  }),
});

const updateJobSchema = z.object({
  params: z.object({
    id: z.string().trim().length(24, 'ID tin tuyển dụng không hợp lệ'),
  }),
  body: z
    .object({
      title: z.string().trim().min(1).optional(),
      description: z.string().trim().min(1).optional(),
      requirements: z.string().trim().min(1).optional(),
      benefits: z.string().trim().optional(),
      salary: z.string().trim().optional(),
      location: z.string().trim().optional(),
      industry: z.string().trim().optional(),
      type: z.enum(['full-time', 'part-time', 'remote', 'hybrid']).optional(),
      deadline: z.string().optional(),
      contactEmail: z.string().trim().email().optional().or(z.literal('')),
      contactPhone: z.string().trim().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'Cần ít nhất một trường để cập nhật',
    }),
});

const updateJobStatusSchema = z.object({
  params: z.object({
    id: z.string().trim().length(24, 'ID tin tuyển dụng không hợp lệ'),
  }),
  body: z.object({
    status: z.enum(['active', 'closed'], {
      error: 'Trạng thái không hợp lệ! Chỉ chấp nhận: active, closed',
    }),
  }),
});

const getJobsQuerySchema = z.object({
  query: z.object({
    search: z.string().optional(),
    location: z.string().optional(),
    industry: z.string().optional(),
    type: z.enum(['full-time', 'part-time', 'remote', 'hybrid']).optional(),
    status: z.enum(['active', 'closed', 'all']).optional(),
    mine: z.enum(['true', 'false']).optional(),
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(50).optional(),
  }),
});

module.exports = {
  jobIdParamSchema,
  createJobSchema,
  updateJobSchema,
  updateJobStatusSchema,
  getJobsQuerySchema,
};
