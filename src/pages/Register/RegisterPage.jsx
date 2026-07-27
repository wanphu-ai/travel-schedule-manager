import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../../validations/authSchema';
import { registerUser } from '../../services/authService';
import { createUserProfile } from '../../services/userService';
import { InputField } from '../../components/common/InputField';
import { Button } from '../../components/common/Button';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, Lock, UserPlus } from 'lucide-react';

export const RegisterPage = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    // 1. Tạo User trong Firebase Authentication
    const { user, error } = await registerUser(data.email, data.password);
    
    if (error) {
      toast.error(error);
      return;
    }

    // 2. Tạo document profile trong Firestore
    await createUserProfile(user.uid, { email: data.email });

    // 3. Thông báo & chuyển hướng
    toast.success('Successfully! Tạo tài khoản thành công.');
    navigate('/login');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel p-8 rounded-3xl shadow-2xl border border-white/30 dark:border-slate-800">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-analogous-gradient text-white shadow-xl shadow-teal-500/30 mb-4">
            <UserPlus className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold bg-analogous-gradient bg-clip-text text-transparent">
            Tạo Tài Khoản Mới
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Bắt đầu lên lịch cho các chuyến đi tuyệt vời của bạn
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <InputField
            label="Địa chỉ Email *"
            type="email"
            placeholder="example@gmail.com"
            icon={Mail}
            registration={register('email')}
            error={errors.email?.message}
          />

          <InputField
            label="Mật khẩu *"
            isPassword={true}
            placeholder="••••••••"
            icon={Lock}
            registration={register('password')}
            error={errors.password?.message}
          />

          <InputField
            label="Xác nhận mật khẩu *"
            isPassword={true}
            placeholder="••••••••"
            icon={Lock}
            registration={register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />

          <Button type="submit" isLoading={isSubmitting} variant="primary" className="mt-2">
            Đăng Ký Tài Khoản
          </Button>
        </form>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6">
          Đã có tài khoản?{' '}
          <Link to="/login" className="font-semibold text-teal-600 dark:text-cyan-400 hover:underline">
            Đăng nhập
          </Link>
        </p>

      </div>
    </div>
  );
};
