const { z } = require('zod');

const registerStudentSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'Tên không được để trống'),
    email: z.string().trim().email('Email không đúng định dạng'),
    password: z.string().min(6, 'Mật khẩu phải từ 6 ký tự trở lên'),
    phone: z.string().trim().optional(),
  }),
});

const registerHrSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'Tên không được để trống'),
    email: z.string().trim().email('Email không đúng định dạng'),
    password: z.string().min(6, 'Mật khẩu phải từ 6 ký tự trở lên'),
    companyCode: z.string().trim().min(4, 'Mã công ty là bắt buộc'),
    phone: z.string().trim().optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email('Email không đúng định dạng'),
    password: z.string().min(1, 'Mật khẩu không được để trống'),
  }),
});

const updateProfileSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(2).optional(),
      phone: z.string().trim().optional(),
    })
    .refine((d) => Object.keys(d).length > 0, { message: 'Cần ít nhất một trường để cập nhật' }),
});

const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Mật khẩu hiện tại là bắt buộc'),
    newPassword: z.string().min(6, 'Mật khẩu mới phải từ 6 ký tự'),
  }),
});

const createEmployeeSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2),
    email: z.string().trim().email(),
    password: z.string().min(6),
    phone: z.string().trim().optional(),
  }),
});

module.exports = {
  registerStudentSchema,
  registerHrSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  createEmployeeSchema,
};
