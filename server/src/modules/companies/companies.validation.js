const { z } = require('zod');

const registerCompanySchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'Tên công ty là bắt buộc'),
    email: z.string().trim().email('Email không hợp lệ'),
    address: z.string().trim().min(5, 'Địa chỉ là bắt buộc'),
    logo: z.string().trim().optional(),
    description: z.string().trim().optional(),
    contactPhone: z.string().trim().optional(),
  }),
});

const updateCompanySchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(2).optional(),
      address: z.string().trim().min(5).optional(),
      logo: z.string().trim().optional(),
      description: z.string().trim().optional(),
      contactPhone: z.string().trim().optional(),
    })
    .refine((d) => Object.keys(d).length > 0, { message: 'Cần ít nhất một trường để cập nhật' }),
});

const companyIdParamSchema = z.object({
  params: z.object({
    id: z.string().trim().length(24, 'ID công ty không hợp lệ'),
  }),
});

module.exports = { registerCompanySchema, updateCompanySchema, companyIdParamSchema };
