import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema } from '../../validations/authSchema';
import { updateUserProfile } from '../../services/userService';
import { InputField } from '../../components/common/InputField';
import { Button } from '../../components/common/Button';
import toast from 'react-hot-toast';
import { User, Phone, MapPin, ShieldCheck, Mail, Edit3, Save, X } from 'lucide-react';

export const ProfilePage = () => {
  const { currentUser, userProfile, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: userProfile?.firstName || '',
      lastName: userProfile?.lastName || '',
      phone: userProfile?.phone || '',
      address: userProfile?.address || '',
    },
  });

  const onSubmit = async (data) => {
    const { success, error } = await updateUserProfile(currentUser.uid, data);
    if (success) {
      toast.success('Profile updated successfully!');
      await refreshProfile();
      setIsEditing(false);
    } else {
      toast.error(`Lỗi cập nhật: ${error}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="glass-panel rounded-3xl p-6 sm:p-10 shadow-2xl border border-white/20 dark:border-slate-800">
        
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative group">
              <img
                src={userProfile?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.uid}`}
                alt="Avatar"
                className="w-24 h-24 rounded-2xl bg-analogous-gradient p-1 object-cover shadow-xl"
              />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center justify-center sm:justify-start gap-2">
                {userProfile?.firstName || userProfile?.lastName
                  ? `${userProfile.firstName} ${userProfile.lastName}`
                  : userProfile?.username || 'User Profile'}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-center sm:justify-start gap-1">
                <Mail className="w-4 h-4 text-teal-500" />
                {currentUser?.email}
              </p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                {currentUser?.emailVerified ? 'Email Verified' : 'Email Unverified'}
              </div>
            </div>
          </div>

          <Button
            variant={isEditing ? 'secondary' : 'outline'}
            onClick={() => {
              if (isEditing) reset();
              setIsEditing(!isEditing);
            }}
            className="w-auto px-5"
          >
            {isEditing ? (
              <>
                <X className="w-4 h-4" /> Hủy Sửa
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4" /> Chỉnh Sửa Profile
              </>
            )}
          </Button>
        </div>

        {/* Profile Content / Edit Form */}
        <div className="mt-8">
          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Tên (First Name)"
                  icon={User}
                  registration={register('firstName')}
                  error={errors.firstName?.message}
                />
                <InputField
                  label="Họ (Last Name)"
                  icon={User}
                  registration={register('lastName')}
                  error={errors.lastName?.message}
                />
              </div>

              <InputField
                label="Số điện thoại"
                placeholder="0912345678"
                icon={Phone}
                registration={register('phone')}
                error={errors.phone?.message}
              />

              <InputField
                label="Địa chỉ"
                placeholder="123 Nguyễn Huệ, Quận 1, TP.HCM"
                icon={MapPin}
                registration={register('address')}
                error={errors.address?.message}
              />

              {/* Disabled inputs for Security */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">User ID (UID) - Đã khóa</label>
                  <input
                    type="text"
                    disabled
                    value={currentUser?.uid || ''}
                    className="w-full p-3 rounded-xl bg-slate-200/50 dark:bg-slate-900/50 text-slate-500 cursor-not-allowed text-xs font-mono border border-slate-300 dark:border-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Email - Đã khóa</label>
                  <input
                    type="text"
                    disabled
                    value={currentUser?.email || ''}
                    className="w-full p-3 rounded-xl bg-slate-200/50 dark:bg-slate-900/50 text-slate-500 cursor-not-allowed text-xs font-mono border border-slate-300 dark:border-slate-800"
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" isLoading={isSubmitting} variant="primary">
                  <Save className="w-4 h-4" /> Save Changes
                </Button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div className="glass-card p-5 rounded-2xl border border-white/20 dark:border-slate-800">
                <span className="text-xs font-medium text-slate-400 block mb-1">HỌ VÀ TÊN</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {userProfile?.firstName || userProfile?.lastName
                    ? `${userProfile.firstName} ${userProfile.lastName}`
                    : 'Chưa cập nhật'}
                </p>
              </div>

              <div className="glass-card p-5 rounded-2xl border border-white/20 dark:border-slate-800">
                <span className="text-xs font-medium text-slate-400 block mb-1">SỐ ĐIỆN THOẠI</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {userProfile?.phone || 'Chưa cập nhật'}
                </p>
              </div>

              <div className="glass-card p-5 rounded-2xl border border-white/20 dark:border-slate-800 sm:col-span-2">
                <span className="text-xs font-medium text-slate-400 block mb-1">ĐỊA CHỈ</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {userProfile?.address || 'Chưa cập nhật'}
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
