import React from 'react';
import {
  Users,
  GraduationCap,
  School,
  BookOpen,
  Calendar,
  Clock,
  Sparkles,
  TrendingUp,
  Award,
  CheckCircle2,
  AlertCircle,
  Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LocalDB } from '../lib/supabase';
import { SchoolClass, Student, TeachingSchedule, CalendarEvent, GradeRecord } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

export const DashboardView: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { user, school } = useAuth();

  const classes = LocalDB.get<SchoolClass[]>('classes', []);
  const students = LocalDB.get<Student[]>('students', []);
  const schedules = LocalDB.get<TeachingSchedule[]>('schedules', []);
  const calendarEvents = LocalDB.get<CalendarEvent[]>('calendar', []);

  // Today schedule filter
  const todayName = new Date().toLocaleDateString('id-ID', { weekday: 'long' });
  const todaySchedules = schedules.filter(s => s.day_of_week === todayName || s.day_of_week === 'Senin');

  // Sample attendance stats for chart
  const attendanceChartData = [
    { name: 'Senin', Hadir: 96, Sakit: 2, Izin: 1, Alpha: 1 },
    { name: 'Selasa', Hadir: 98, Sakit: 1, Izin: 1, Alpha: 0 },
    { name: 'Rabu', Hadir: 95, Sakit: 3, Izin: 1, Alpha: 1 },
    { name: 'Kamis', Hadir: 97, Sakit: 2, Izin: 0, Alpha: 1 },
    { name: 'Jumat', Hadir: 99, Sakit: 1, Izin: 0, Alpha: 0 },
  ];

  const gradeDistData = [
    { name: 'Sangat Baik (A)', value: 45, color: '#10B981' },
    { name: 'Baik (B)', value: 35, color: '#2563EB' },
    { name: 'Cukup (C)', value: 15, color: '#F59E0B' },
    { name: 'Perlu Bimbingan (D)', value: 5, color: '#EF4444' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 p-6 md:p-8 text-white shadow-xl shadow-blue-500/10">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-cyan-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Platform AI Administrasi Guru No. 1 di Indonesia</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Selamat Datang, {user.full_name}
            </h2>
            <p className="text-sm text-blue-100 max-w-xl">
              {school.name} — Tahun Ajaran {school.academic_year} ({school.semester}). Semua perangkat ajar Kurikulum Merdeka Anda telah siap dan tersinkronisasi realtime.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('modul_ajar')}
              className="px-4 py-2.5 bg-white text-blue-700 font-bold text-xs md:text-sm rounded-xl hover:bg-blue-50 shadow-md transition-all transform active:scale-95"
            >
              + Buat Modul Ajar AI
            </button>
            <button
              onClick={() => onNavigate('ai_assistant')}
              className="px-4 py-2.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-white font-semibold text-xs md:text-sm rounded-xl border border-white/20 backdrop-blur-md transition-all"
            >
              Konsultasi AI
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Siswa Binaan</p>
            <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-0.5">128 Siswa</h4>
            <span className="text-[10px] text-emerald-600 font-semibold">100% Aktif</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <School className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Jumlah Kelas Diampu</p>
            <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-0.5">{classes.length || 3} Kelas</h4>
            <span className="text-[10px] text-blue-600 font-semibold">X IPA 1, X IPA 2, XI MIPA 1</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Jadwal Mengajar</p>
            <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-0.5">18 JP / Minggu</h4>
            <span className="text-[10px] text-emerald-600 font-semibold">Memenuhi Beban Kerja</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Presensi Hari Ini</p>
            <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-0.5">97.8%</h4>
            <span className="text-[10px] text-emerald-600 font-semibold">32 Hadir / 32 Siswa</span>
          </div>
        </div>

      </div>

      {/* Grid Layout: Schedule & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Today's Teaching Schedule */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">Jadwal Mengajar Hari Ini</h3>
                <p className="text-xs text-slate-400">{todayName}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('schedule')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Lihat Semua
            </button>
          </div>

          <div className="space-y-3">
            {todaySchedules.length > 0 ? (
              todaySchedules.map((sch, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs">
                      {sch.start_time} - {sch.end_time}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{sch.subject_name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Kelas: {sch.class_name} • {sch.room}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate('attendance')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-sm transition-colors"
                  >
                    Input Presensi
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                Tidak ada jadwal mengajar pada hari ini.
              </div>
            )}
          </div>

          {/* Realtime Attendance Analytics Chart */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">Tren Kehadiran Siswa Mingguan (%)</h4>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceChartData}>
                  <defs>
                    <linearGradient id="colorHadir" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} domain={[80, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '12px', color: '#FFF' }} />
                  <Area type="monotone" dataKey="Hadir" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorHadir)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: AI Pedagogical Insight & Academic Calendar */}
        <div className="space-y-6">
          
          {/* AI Pedagogical Assistant Insight */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                <h3 className="font-bold text-sm">Edu AI Pedagogical Insight</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 font-semibold">Realtime</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              "Berdasarkan hasil Asesmen Formatif X IPA 1 pada materi SPLTV, 85% siswa telah menguasai metode eliminasi. Disarankan memberikan <strong>Soal Pengayaan HOTS</strong> untuk kelompok A dan bimbingan tutor sebaya untuk 5 siswa pada kelompok C."
            </p>

            <div className="mt-4 pt-3 border-t border-indigo-800/60 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Rekomendasi Modul Ajar</span>
              <button
                onClick={() => onNavigate('ai_assistant')}
                className="text-xs text-amber-300 font-bold hover:underline"
              >
                Terapkan Rekomendasi →
              </button>
            </div>
          </div>

          {/* Academic Calendar Widget */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Kalender Akademik Terdekat</h3>
              </div>
              <button
                onClick={() => onNavigate('calendar')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Buka Kalender
              </button>
            </div>

            <div className="space-y-2">
              {calendarEvents.map(ev => (
                <div key={ev.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs flex items-start gap-2.5">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    ev.type === 'ujian' ? 'bg-red-500' : ev.type === 'libur_nasional' ? 'bg-amber-500' : 'bg-blue-500'
                  }`} />
                  <div>
                    <h5 className="font-semibold text-slate-800 dark:text-slate-200">{ev.title}</h5>
                    <p className="text-[10px] text-slate-400">{ev.start_date} {ev.end_date !== ev.start_date ? `s/d ${ev.end_date}` : ''}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
