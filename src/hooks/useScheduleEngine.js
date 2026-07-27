import { useEffect, useState } from 'react';

/**
 * Realtime engine: tự động kiểm tra giờ hệ thống và cập nhật trạng thái Event
 * - Tự động chuyển event sang "Đang diễn ra" khi tới giờ bắt đầu
 * - Tự động chuyển sang "Đã xong" khi qua giờ kết thúc
 * - KHÔNG áp dụng đối với Event ở trạng thái "Tạm hoãn" hoặc "Hủy"
 */
export const useScheduleEngine = (events, onAutoUpdateStatus) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 5000); // Quét mỗi 5 giây

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!events || events.length === 0) return;

    const currentHHMM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    events.forEach((event) => {
      // Bỏ qua nếu là Tạm hoãn hoặc Hủy
      if (event.status === 'Tạm hoãn' || event.status === 'Hủy') return;

      const { startTime, endTime, status, id } = event;

      // 1. Kiểm tra chuyển sang Đang diễn ra
      if (currentHHMM >= startTime && currentHHMM < endTime && status !== 'Đang diễn ra') {
        onAutoUpdateStatus(id, 'Đang diễn ra');
      }

      // 2. Kiểm tra chuyển sang Đã xong
      if (currentHHMM >= endTime && status !== 'Đã xong') {
        onAutoUpdateStatus(id, 'Đã xong');
      }
    });
  }, [now, events, onAutoUpdateStatus]);

  return { currentTimeString: now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) };
};
