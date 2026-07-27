import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';
import { logoutUser } from '../../services/authService';
import toast from 'react-hot-toast';
import { Sun, Moon, Compass, Calendar, User, LogOut } from 'lucide-react';

export const Navbar = () => {
  const { currentUser, userProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    const { error } = await logoutUser();
    if (error) {
      toast.error(error);
    } else {
      toast.success('Đã đăng xuất thành công!');
      navigate('/login');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 w-full glass-panel border-b border-white/20 dark:border-slate-800/80 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-analogous-gradient p-2 flex items-center justify-center text-white shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform duration-300">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight text-teal-600 dark:text-cyan-400">
                TripPlanner
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 tracking-wider">SCHEDULE MANAGER</span>
            </div>
          </Link>

          {/* Navigation Links & Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-200/60 dark:bg-slate-800/60 text-teal-600 dark:text-cyan-400 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors duration-200"
              title={`Chuyển sang giao diện ${theme === 'dark' ? 'Sáng' : 'Tối'}`}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {currentUser ? (
              <>
                <Link
                  to="/schedule"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive('/schedule')
                      ? 'bg-teal-500/10 text-teal-600 dark:text-cyan-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span className="hidden sm:inline">Lịch Trình</span>
                </Link>

                {/* User Profile Badge */}
                <Link
                  to="/profile"
                  className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border transition-all ${
                    isActive('/profile')
                      ? 'border-teal-500/50 bg-teal-500/10'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <img
                    src={userProfile?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.uid}`}
                    alt="User Avatar"
                    className="w-7 h-7 rounded-lg bg-teal-500/20 object-cover"
                  />
                  <span className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
                    {userProfile?.username || currentUser.email?.split('@')[0]}
                  </span>
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
                  title="Đăng xuất"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-cyan-400 transition-colors"
                >
                  Đăng Nhập
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold rounded-xl bg-analogous-gradient text-white hover:brightness-110 shadow-md shadow-teal-500/20 transition-all"
                >
                  Đăng Ký
                </Link>
              </div>
            )}

          </div>

        </div>
      </div>
    </nav>
  );
};
