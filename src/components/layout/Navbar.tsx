import React, { useState } from 'react';
import {
  Bell,
  Search,
  Sun,
  Moon,
  Sparkles,
  User,
  Shield,
  ChevronDown,
  LogOut,
  Menu,
  BookOpen,
  Database
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { UserRole } from '../../types';

interface NavbarProps {
  onToggleSidebar: () => void;
  onOpenAIAssistant: () => void;
  activeMenu: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  onOpenAIAssistant,
  activeMenu
}) => {
  const { user, school, switchRole, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, text: 'Jadwal Mengajar X IPA 1 dimulai pukul 07:30 WIB di Ruang 101.', time: '10 mnt lalu' },
    { id: 2, text: 'Aditya Pratama mengumpulkan tugas Matematika Lanjut.', time: '1 jam lalu' },
    { id: 3, text: 'Kalender Akademik: ASTS diselenggarakan mulai 22 September.', time: '1 hari lalu' },
  ];

  const roleLabels: Record<UserRole, { label: string; color: string }> = {
    super_admin: { label: 'Super Admin', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' },
    school_admin: { label: 'Admin Sekolah', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
    teacher: { label: 'Guru Mapel', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
    homeroom_teacher: { label: 'Guru Wali Kelas', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
    operator: { label: 'Operator', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        
        {/* Left Side: Toggle Sidebar & Search */}
        <div className="flex items-center gap-3">
          <button
            id="btn-sidebar-toggle"
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 w-64 md:w-80 text-sm">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari modul, siswa, jadwal, nilai..."
              className="bg-transparent border-none outline-none w-full text-slate-800 dark:text-slate-200 placeholder-slate-400 text-xs md:text-sm"
            />
          </div>
        </div>

        {/* Right Side: Quick AI, Theme, Notifications, Profile */}
        <div className="flex items-center gap-2 md:gap-3">
          
          {/* Supabase Cloud Status Badge */}
          <div 
            title="Database Cloud Supabase Terhubung (PostgreSQL)"
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 text-xs font-semibold"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-[11px]">Supabase Cloud</span>
          </div>

          {/* Quick AI Trigger */}
          <button
            id="btn-quick-ai-trigger"
            onClick={onOpenAIAssistant}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium text-xs md:text-sm shadow-sm transition-all transform active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span className="hidden md:inline">Edu AI Assistant</span>
          </button>

          {/* Dark / Light Toggle */}
          <button
            id="btn-theme-toggle"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Ganti Mode Gelap/Terang"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Notifications Center */}
          <div className="relative">
            <button
              id="btn-notifications"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">Notifikasi</h4>
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-medium cursor-pointer">Tandai Dibaca</span>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-xs">
                      <p className="text-slate-700 dark:text-slate-300 font-medium">{n.text}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Role Switcher */}
          <div className="relative">
            <button
              id="btn-user-profile"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <img
                src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={user.full_name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/30"
              />
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[130px]">{user.full_name}</p>
                <p className="text-[10px] text-slate-400 truncate max-w-[130px]">{school.name}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-3 z-50">
                <div className="pb-3 mb-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">{user.full_name}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${roleLabels[user.role].color}`}>
                      {roleLabels[user.role].label}
                    </span>
                  </div>
                </div>

                {/* Role Simulator for QA testing */}
                <div className="py-1">
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 px-2 mb-1.5">Simulasi Hak Akses Role</p>
                  <div className="grid grid-cols-1 gap-1">
                    {(['super_admin', 'school_admin', 'teacher', 'homeroom_teacher', 'operator'] as UserRole[]).map(r => (
                      <button
                        key={r}
                        onClick={() => {
                          switchRole(r);
                          setShowProfileMenu(false);
                        }}
                        className={`text-left px-2 py-1 rounded-lg text-xs flex items-center justify-between ${
                          user.role === r
                            ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span>{roleLabels[r].label}</span>
                        {user.role === r && <Shield className="w-3 h-3 text-blue-600 dark:text-blue-400" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      logout();
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded-xl text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Keluar Aplikasi
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
