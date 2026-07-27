import { z } from 'zod';

export const eventSchema = z.object({
  title: z.string().min(1, 'Tiêu đề không được để trống'),
  description: z.string().optional(),
  startTime: z.string().min(1, 'Giờ bắt đầu không được để trống'),
  endTime: z.string().min(1, 'Giờ kết thúc không được để trống'),
  location: z.string().optional(),
  category: z.enum(['Ăn uống', 'Ngắm cảnh', 'Bonding', 'Khác']),
  status: z.enum(['Sắp tới', 'Đang diễn ra', 'Đã xong', 'Hủy', 'Tạm hoãn']).default('Sắp tới'),
  isCompleted: z.boolean().default(false),
}).refine((data) => {
  if (!data.startTime || !data.endTime) return true;
  return data.endTime > data.startTime;
}, {
  message: 'Giờ kết thúc phải sau giờ bắt đầu',
  path: ['endTime']
});
