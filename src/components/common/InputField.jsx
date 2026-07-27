import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const InputField = ({
  label,
  type = 'text',
  error,
  icon: Icon,
  isPassword = false,
  registration,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div class="mb-4">
      {label && (
        <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <div className="relative rounded-xl shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-teal-500 dark:text-cyan-400">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <input
          type={inputType}
          className={`w-full ${Icon ? 'pl-11' : 'pl-4'} ${isPassword ? 'pr-11' : 'pr-4'} py-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border ${
            error 
              ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500' 
              : 'border-slate-200 dark:border-slate-800 focus:ring-teal-500 focus:border-teal-500'
          } text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 backdrop-blur-md transition-all duration-200`}
          {...registration}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none transition-colors"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-rose-500 font-medium animate-shake">
          {error}
        </p>
      )}
    </div>
  );
};
