import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventSchema } from '../../validations/eventSchema';
import { InputField } from '../common/InputField';
import { Button } from '../common/Button';
import { X, Calendar, Clock, MapPin, Tag, FileText } from 'lucide-react';

export const EventModalForm = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  if (!isOpen) return null;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: initialData || {
      title: '',
      description: '',
      startTime: '08:00',
      endTime: '10:00',
      location: '',
      category: 'Ăn uống',
      status: 'Sắp tới',
      isCompleted: false
    }
  });

  const handleFormSubmit = async (data) => {
    await onSubmit(data);
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg glass-panel rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/20 dark:border-slate-800 text-slate-900 dark:text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-teal-500 dark:text-cyan-400" />
            <h2 className="text-xl font-bold text-teal-600 dark:text-cyan-400">
              {initialData ? 'Chỉnh Sửa Sự Kiện' : 'Thêm Sự Kiện Mới'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <InputField
            label="Tiêu đề Sự kiện *"
            placeholder="Ví dụ: Ăn sáng Phở Bò, Ngắm bình minh..."
            icon={FileText}
            registration={register('title')}
            error={errors.title?.message}
          />

          <div className="grid grid-cols-2 gap-4 mb-4">
            <InputField
              label="Giờ bắt đầu *"
              type="time"
              icon={Clock}
              registration={register('startTime')}
              error={errors.startTime?.message}
            />
            <InputField
              label="Giờ kết thúc *"
              type="time"
              icon={Clock}
              registration={register('endTime')}
              error={errors.endTime?.message}
            />
          </div>

          <InputField
            label="Địa điểm"
            placeholder="Ví dụ: Bãi biển Mỹ Khê, Quán Cà phê A..."
            icon={MapPin}
            registration={register('location')}
            error={errors.location?.message}
          />

          {/* Category Dropdown */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">
              Loại hoạt động *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-teal-500 dark:text-cyan-400">
                <Tag className="h-5 w-5" />
              </div>
              <select
                {...register('category')}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 focus:outline-none backdrop-blur-md"
              >
                <option value="Ăn uống">🍲 Ăn uống</option>
                <option value="Ngắm cảnh">📸 Ngắm cảnh</option>
                <option value="Bonding">🎉 Bonding / Trò chơi</option>
                <option value="Khác">🚗 Khác / Di chuyển</option>
              </select>
            </div>
          </div>

          {/* Status Selection (If Edit mode) */}
          {initialData && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">
                Trạng thái sự kiện
              </label>
              <select
                {...register('status')}
                className="w-full px-4 py-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 focus:outline-none backdrop-blur-md"
              >
                <option value="Sắp tới">⏳ Sắp tới</option>
                <option value="Đang diễn ra">🔥 Đang diễn ra</option>
                <option value="Đã xong">✅ Đã xong</option>
                <option value="Tạm hoãn">⏸️ Tạm hoãn</option>
                <option value="Hủy">❌ Hủy</option>
              </select>
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">
              Ghi chú / Mô tả
            </label>
            <textarea
              {...register('description')}
              rows="3"
              placeholder="Nhập ghi chú cần mang theo gì, chi phí dự kiến..."
              className="w-full p-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 focus:outline-none backdrop-blur-md"
            ></textarea>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose} type="button">
              Hủy
            </Button>
            <Button variant="primary" type="submit" isLoading={isSubmitting}>
              {initialData ? 'Lưu Thay Đổi' : 'Tạo Sự Kiện'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
