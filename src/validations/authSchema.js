import { z } from 'zod';

// Regex: Tối thiểu 8 ký tự, 1 chữ hoa, 1 chữ thường, 1 ký tự đặc biệt
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

export const registerSchema = z.object({
  email: z.string().min(1, 'Email không được để trống').email('Định dạng Email không hợp lệ'),
  password: z.string()
    .min(1, 'Mật khẩu không được để trống')
    .regex(passwordRegex, 'Mật khẩu phải từ 8 ký tự, gồm ít nhất 1 chữ hoa, 1 chữ thường và 1 ký tự đặc biệt'),
  confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không trùng khớp 100%',
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z.string().min(1, 'Email không được để trống').email('Định dạng Email không hợp lệ'),
  password: z.string().min(1, 'Mật khẩu không được để trống'),
});

export const profileSchema = z.object({
  firstName: z.string().min(1, 'Tên không được để trống'),
  lastName: z.string().min(1, 'Họ không được để trống'),
  phone: z.string().optional().refine(val => !val || /^[0-9]{9,11}$/.test(val), {
    message: 'Số điện thoại không hợp lệ (9 - 11 chữ số)'
  }),
  address: z.string().optional(),
});
