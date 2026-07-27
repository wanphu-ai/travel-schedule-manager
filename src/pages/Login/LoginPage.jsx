import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../validations/authSchema';
import { loginUser, resetPassword } from '../../services/authService';
import { InputField } from '../../components/common/InputField';
import { Button } from '../../components/common/Button';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, Lock, Compass } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [isResetting, setIsResetting] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    const { user, error } = await loginUser(data.email, data.password);
    if (error) {
      toast.error(error);
    } else {
      toast.success('Đăng nhập thành công!');
      navigate('/schedule');
    }
  };

  const handleForgotPassword = async () => {
    const email = getValues('email');
    if (!email) {
      toast.error('Vui lòng nhập Email trước khi bấm Quên mật khẩu!');
      return;
    }
    setIsResetting(true);
    const { success, error } = await resetPassword(email);
    setIsResetting(false);
    if (success) {
      toast.success('Link khôi phục mật khẩu đã được gửi vào Email của bạn!');
    } else {
      toast.error(error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel p-8 rounded-3xl shadow-2xl border border-white/30 dark:border-slate-800">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-analogous-gradient text-white shadow-xl shadow-teal-500/30 mb-4">
            <Compass className="w-8 h-8 animate-spin-slow" />
          </div>
          <h1 className="text-2xl font-bold text-teal-600 dark:text-cyan-400">
            Chào Mừng Trở Lại!
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Đăng nhập để tiếp tục quản lý lịch trình chuyến đi của bạn
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputField
            label="Địa chỉ Email"
            type="email"
            placeholder="example@gmail.com"
            icon={Mail}
            registration={register('email')}
            error={errors.email?.message}
          />

          <InputField
            label="Mật khẩu"
            isPassword={true}
            placeholder="••••••••"
            icon={Lock}
            registration={register('password')}
            error={errors.password?.message}
          />

          <div className="flex items-center justify-end mb-6">
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={isResetting}
              className="text-xs font-semibold text-teal-600 dark:text-cyan-400 hover:underline focus:outline-none"
            >
              Quên mật khẩu?
            </button>
          </div>

          <Button type="submit" isLoading={isSubmitting} variant="primary">
            Đăng Nhập
          </Button>
        </form>

        {/* Footer link */}
        <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="font-semibold text-teal-600 dark:text-cyan-400 hover:underline">
            Đăng ký ngay
          </Link>
        </p>

      </div>
    </div>
  );
};
