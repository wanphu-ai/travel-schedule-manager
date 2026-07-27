import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  type = 'button',
  variant = 'primary', // primary (Analogous Gradient), secondary, outline, danger
  isLoading = false,
  disabled = false,
  className = '',
  onClick,
  ...props
}) => {
  const baseStyles = 'w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]';

  const variants = {
    primary: 'bg-analogous-gradient hover:brightness-110 text-white shadow-teal-500/25 dark:shadow-cyan-500/20',
    secondary: 'bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 shadow-slate-500/10',
    outline: 'border-2 border-teal-500 text-teal-600 dark:text-cyan-400 hover:bg-teal-500/10 dark:hover:bg-cyan-500/10 shadow-none',
    danger: 'bg-gradient-to-r from-rose-500 to-pink-600 hover:brightness-110 text-white shadow-rose-500/25',
  };

  return (
    <button
      type={type}
      disabled={isLoading || disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Đang xử lý...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
