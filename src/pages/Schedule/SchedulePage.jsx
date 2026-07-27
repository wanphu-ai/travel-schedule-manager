import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useScheduleEngine } from '../../hooks/useScheduleEngine';
import { 
  subscribeUserEvents, 
  createEvent, 
  updateEvent, 
  deleteEvent 
} from '../../services/eventService';
import { EventModalForm } from '../../components/forms/EventModalForm';
import { Button } from '../../components/common/Button';
import toast from 'react-hot-toast';
import { 
  Plus, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  Edit, 
  PieChart, 
  Sparkles,
  Zap,
  Tag
} from 'lucide-react';

export const SchedulePage = () => {
  const { currentUser } = useAuth();
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Callback tự động cập nhật trạng thái theo giờ thực từ engine
  const handleAutoUpdateStatus = useCallback(async (eventId, newStatus) => {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, status: newStatus } : e));
    await updateEvent(currentUser.uid, eventId, { status: newStatus });
  }, [currentUser?.uid]);

  // Kích hoạt Realtime Engine
  const { currentTimeString } = useScheduleEngine(events, handleAutoUpdateStatus);

  // Subscribe Realtime Firestore Events
  useEffect(() => {
    if (!currentUser?.uid) return;
    const unsubscribe = subscribeUserEvents(
      currentUser.uid,
      (fetchedEvents) => setEvents(fetchedEvents),
      (err) => console.warn(err)
    );
    return () => unsubscribe();
  }, [currentUser?.uid]);

  // Kiểm tra trùng lặp khung giờ (Overlapping Validation)
  const isTimeOverlapping = (newEvent, currentEventId = null) => {
    return events.some(event => {
      if (currentEventId && event.id === currentEventId) return false;
      if (event.status === 'Hủy') return false; // Event Hủy vẫn chiếm nhưng không gây chặn

      const existStart = event.startTime;
      const existEnd = event.endTime;
      const newStart = newEvent.startTime;
      const newEnd = newEvent.endTime;

      // Trùng đè hoàn toàn: start1 < end2 AND start2 < end1
      return (newStart < existEnd && newEnd > existStart);
    });
  };

  // Thêm hoặc Cập nhật Event
  const handleSaveEvent = async (formData) => {
    if (isTimeOverlapping(formData, editingEvent?.id)) {
      toast.error('Lỗi: Khung giờ bị trùng lặp đè lên sự kiện khác!');
      return;
    }

    if (editingEvent) {
      const { success } = await updateEvent(currentUser.uid, editingEvent.id, formData);
      if (success) toast.success('Đã cập nhật sự kiện!');
    } else {
      const result = await createEvent(currentUser.uid, formData, events);
      if (result) toast.success('Tạo sự kiện mới thành công!');
    }
  };

  // Xóa Event
  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sự kiện này?')) {
      await deleteEvent(currentUser.uid, eventId);
      toast.success('Đã xóa sự kiện.');
    }
  };

  // Đánh dấu hoàn thành
  const handleToggleComplete = async (event) => {
    const newCompleted = !event.isCompleted;
    const newStatus = newCompleted ? 'Đã xong' : 'Sắp tới';
    await updateEvent(currentUser.uid, event.id, { 
      isCompleted: newCompleted, 
      status: newStatus 
    });
  };

  // Đổi vị trí thứ tự event bằng nút mũi tên ↑ ↓
  const handleMoveOrder = async (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= events.length) return;

    const newEvents = [...events];
    const temp = newEvents[index];
    newEvents[index] = newEvents[targetIndex];
    newEvents[targetIndex] = temp;

    // Cập nhật order
    newEvents.forEach((e, idx) => { e.order = idx; });
    setEvents(newEvents);

    // Sync Firestore
    await Promise.all([
      updateEvent(currentUser.uid, newEvents[index].id, { order: index }),
      updateEvent(currentUser.uid, newEvents[targetIndex].id, { order: targetIndex })
    ]);
  };

  // Filter & Thống kê
  const filteredEvents = categoryFilter === 'All' 
    ? events 
    : events.filter(e => e.category === categoryFilter);

  const ongoingEvent = events.find(e => e.status === 'Đang diễn ra');

  const stats = {
    total: events.length,
    upcoming: events.filter(e => e.status === 'Sắp tới').length,
    ongoing: events.filter(e => e.status === 'Đang diễn ra').length,
    completed: events.filter(e => e.status === 'Đã xong').length,
    postponed: events.filter(e => e.status === 'Tạm hoãn').length,
    cancelled: events.filter(e => e.status === 'Hủy').length,
  };

  // Format màu sắc dựa theo Analogous Palette (Teal / Emerald / Cyan / Sky)
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Đang diễn ra':
        return 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30 animate-pulse';
      case 'Đã xong':
        return 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'Tạm hoãn':
        return 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30';
      case 'Hủy':
        return 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30 line-through';
      default:
        return 'bg-teal-500/20 text-teal-600 dark:text-cyan-400 border-teal-500/30';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header Banner với Realtime Engine Clock */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/30 dark:border-slate-800 shadow-xl bg-analogous-subtle">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-600 dark:text-cyan-400 border border-teal-500/20 mb-3">
              <Zap className="w-3.5 h-3.5" /> Realtime Engine Clock: {currentTimeString}
            </div>
            <h1 className="text-3xl font-extrabold text-teal-600 dark:text-cyan-400">
              Quản Lý Lịch Trình Chuyến Đi
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Sắp xếp thời gian, theo dõi sự kiện trực tiếp và thống kê thông minh.
            </p>
          </div>

          <Button
            variant="primary"
            onClick={() => {
              setEditingEvent(null);
              setIsModalOpen(true);
            }}
            className="w-full md:w-auto px-6 py-3.5 shadow-xl shadow-teal-500/20"
          >
            <Plus className="w-5 h-5" /> Thêm Sự Kiện Mới
          </Button>
        </div>

        {/* Nổi bật Event đang diễn ra */}
        {ongoingEvent && (
          <div className="mt-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 backdrop-blur-md flex items-center justify-between gap-4 animate-bounce-subtle">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-amber-500 animate-ping" />
              <div>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 tracking-wider">ĐANG DIỄN RA NGAY LÚC NÀY</span>
                <h4 className="font-bold text-slate-900 dark:text-slate-100">{ongoingEvent.title}</h4>
              </div>
            </div>
            <span className="text-xs font-mono font-semibold px-3 py-1 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300">
              {ongoingEvent.startTime} - {ongoingEvent.endTime}
            </span>
          </div>
        )}
      </div>

      {/* Thống kê nhanh (Stats Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Tổng sự kiện', value: stats.total, color: 'from-teal-500 to-cyan-600' },
          { label: 'Sắp tới', value: stats.upcoming, color: 'from-cyan-500 to-sky-600' },
          { label: 'Đang diễn ra', value: stats.ongoing, color: 'from-amber-500 to-orange-600' },
          { label: 'Đã xong', value: stats.completed, color: 'from-emerald-500 to-teal-600' },
          { label: 'Tạm hoãn', value: stats.postponed, color: 'from-purple-500 to-indigo-600' },
          { label: 'Hủy', value: stats.cancelled, color: 'from-rose-500 to-pink-600' },
        ].map((item, idx) => (
          <div key={idx} className="glass-card p-4 rounded-2xl border border-white/20 dark:border-slate-800 text-center shadow-lg">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">{item.label}</span>
            <span className={`text-2xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Bộ lọc Category Filter Tag */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-bold text-slate-400 mr-2 flex items-center gap-1">
          <Tag className="w-3.5 h-3.5" /> Lọc:
        </span>
        {['All', 'Ăn uống', 'Ngắm cảnh', 'Bonding', 'Khác'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              categoryFilter === cat
                ? 'bg-analogous-gradient text-white shadow-md shadow-teal-500/20'
                : 'glass-card text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
            }`}
          >
            {cat === 'All' ? '🌟 Tất cả' : cat}
          </button>
        ))}
      </div>

      {/* Danh sách Event */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center text-slate-400 border border-slate-200 dark:border-slate-800">
            <Sparkles className="w-12 h-12 mx-auto text-teal-500/40 mb-3" />
            <p className="font-semibold">Chưa có sự kiện nào trong danh sách!</p>
            <p className="text-xs mt-1">Bấm "Thêm Sự Kiện Mới" để lên lịch cho chuyến đi của bạn.</p>
          </div>
        ) : (
          filteredEvents.map((event, index) => (
            <div
              key={event.id}
              className={`glass-panel p-5 rounded-2xl border transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md hover:shadow-xl ${
                event.status === 'Đang diễn ra'
                  ? 'border-amber-500/50 bg-amber-500/5'
                  : 'border-white/30 dark:border-slate-800'
              }`}
            >
              {/* Cột Trái: Controls Reorder & Checkbox */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="flex flex-col gap-1">
                  <button
                    disabled={index === 0}
                    onClick={() => handleMoveOrder(index, 'up')}
                    className="p-1 text-slate-400 hover:text-teal-500 disabled:opacity-20 transition-colors"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    disabled={index === filteredEvents.length - 1}
                    onClick={() => handleMoveOrder(index, 'down')}
                    className="p-1 text-slate-400 hover:text-teal-500 disabled:opacity-20 transition-colors"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => handleToggleComplete(event)}
                  className={`p-2 rounded-xl transition-colors ${
                    event.isCompleted
                      ? 'text-emerald-500 bg-emerald-500/10'
                      : 'text-slate-300 dark:text-slate-600 hover:text-emerald-500'
                  }`}
                  title="Đánh dấu đã hoàn thành"
                >
                  <CheckCircle2 className="w-6 h-6" />
                </button>

                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className={`font-bold text-base ${event.isCompleted || event.status === 'Hủy' ? 'line-through text-slate-400' : 'text-slate-900 dark:text-slate-100'}`}>
                      {event.title}
                    </h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-cyan-400 font-medium">
                      {event.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-teal-500" />
                      {event.startTime} - {event.endTime}
                    </span>
                    {event.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-cyan-500" />
                        {event.location}
                      </span>
                    )}
                  </div>
                  {event.description && (
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 italic">
                      "{event.description}"
                    </p>
                  )}
                </div>
              </div>

              {/* Cột Phải: Badge Status & Action Buttons */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-200 dark:border-slate-800">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(event.status)}`}>
                  {event.status}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingEvent(event);
                      setIsModalOpen(true);
                    }}
                    className="p-2 rounded-xl text-slate-400 hover:text-teal-500 hover:bg-teal-500/10 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Event Modal Form */}
      <EventModalForm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEvent(null);
        }}
        onSubmit={handleSaveEvent}
        initialData={editingEvent}
      />

    </div>
  );
};
