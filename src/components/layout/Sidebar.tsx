import React from 'react';
import {
  LayoutDashboard,
  User,
  Calendar,
  Clock,
  BookOpen,
  FolderKanban,
  FileText,
  Target,
  Layers,
  CalendarDays,
  Users,
  CheckSquare,
  Award,
  HelpCircle,
  BookMarked,
  Upload,
  Database,
  GraduationCap,
  Sparkles,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activeMenu: string;
  onSelectMenu: (menuId: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
  roles?: string[];
}

interface MenuGroup {
  groupLabel: string;
  items: MenuItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeMenu,
  onSelectMenu,
  collapsed,
  onToggleCollapse
}) => {
  const { user, school } = useAuth();

  const menuGroups: MenuGroup[] = [
    {
      groupLabel: 'UTAMA',
      items: [
        { id: 'dashboard', label: 'Dashboard Utama', icon: LayoutDashboard },
        { id: 'profile', label: 'Profil Guru & Cover', icon: User },
        { id: 'schedule', label: 'Jadwal Mengajar', icon: Clock },
        { id: 'calendar', label: 'Kalender Akademik', icon: Calendar },
      ],
    },
    {
      groupLabel: 'PERENCANAAN (PERANGKAT AJAR)',
      items: [
        { id: 'modul_ajar', label: 'Modul Ajar (Merdeka)', icon: BookOpen, badge: 'AI', badgeColor: 'bg-blue-500 text-white' },
        { id: 'cp_tp_atp', label: 'CP, TP & ATP', icon: Layers, badge: 'AI', badgeColor: 'bg-blue-500 text-white' },
        { id: 'prota_prosem', label: 'PROTA & PROSEM', icon: CalendarDays, badge: 'AI', badgeColor: 'bg-blue-500 text-white' },
        { id: 'kktp', label: 'KKTP', icon: Target },
        { id: 'lkpd', label: 'LKPD Interaktif', icon: FileText, badge: 'AI', badgeColor: 'bg-blue-500 text-white' },
        { id: 'bahan_ajar', label: 'Bahan Ajar & Media', icon: FolderKanban },
      ],
    },
    {
      groupLabel: 'PELAKSANAAN & KELAS',
      items: [
        { id: 'attendance', label: 'Presensi / Absensi', icon: CheckSquare },
        { id: 'journal', label: 'Jurnal Mengajar', icon: BookMarked },
        { id: 'group_division', label: 'Pembagian Kelompok', icon: Users },
        { id: 'student_tasks', label: 'Tugas Murid', icon: Upload },
      ],
    },
    {
      groupLabel: 'ASESMEN & SOAL',
      items: [
        { id: 'grades', label: 'Penilaian & Rapor', icon: Award },
        { id: 'quiz_exam', label: 'Quiz & Ujian Online', icon: ShieldAlert, badge: 'Anti-Curang', badgeColor: 'bg-amber-500 text-white' },
        { id: 'question_bank', label: 'Bank Soal & Kisi-Kisi', icon: Database, badge: 'C1-C6', badgeColor: 'bg-indigo-500 text-white' },
      ],
    },
    {
      groupLabel: 'KHUSUS & AI',
      items: [
        { id: 'homeroom', label: 'Guru Wali Kelas', icon: GraduationCap },
        { id: 'ai_assistant', label: 'Edu AI Assistant', icon: Sparkles, badge: 'PRO', badgeColor: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' },
        { id: 'admin_panel', label: 'Admin Panel', icon: Settings, roles: ['super_admin', 'school_admin'] },
      ],
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen bg-slate-900 text-slate-100 border-r border-slate-800 transition-all duration-300 flex flex-col ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-500/20 shrink-0">
            EM
          </div>
          {!collapsed && (
            <div className="transition-opacity duration-200">
              <h1 className="font-bold text-sm tracking-tight text-white leading-tight">Edu Master AI</h1>
              <p className="text-[10px] text-cyan-400 font-medium">Administrasi Guru ID</p>
            </div>
          )}
        </div>

        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={collapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Menu items list */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
        {menuGroups.map((group, groupIdx) => {
          // Filter items based on user role if roles array is present
          const visibleItems = group.items.filter(item => {
            if (!item.roles) return true;
            return item.roles.includes(user.role);
          });

          if (visibleItems.length === 0) return null;

          return (
            <div key={groupIdx} className="space-y-1">
              {!collapsed && (
                <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  {group.groupLabel}
                </p>
              )}

              {visibleItems.map(item => {
                const Icon = item.icon;
                const isActive = activeMenu === item.id;

                return (
                  <button
                    key={item.id}
                    id={`menu-item-${item.id}`}
                    onClick={() => onSelectMenu(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-cyan-400'
                      }`}
                    />

                    {!collapsed && (
                      <span className="truncate text-left flex-1">{item.label}</span>
                    )}

                    {!collapsed && item.badge && (
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}

                    {collapsed && (
                      <div className="absolute left-full ml-2 px-2.5 py-1 bg-slate-800 text-white text-xs rounded-md shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-opacity">
                        {item.label}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      {!collapsed && (
        <div className="p-3 m-3 rounded-2xl bg-slate-800/60 border border-slate-700/50 text-xs">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-[11px] font-semibold text-slate-200 truncate">{school.name}</p>
          </div>
          <p className="text-[10px] text-slate-400">T.A. {school.academic_year} ({school.semester})</p>
        </div>
      )}
    </aside>
  );
};
