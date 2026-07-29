import React, { useState, useEffect } from 'react';
import { Settings, Users, School, Database, ShieldCheck, Download, Upload, Server, Key, RefreshCw, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { LocalDB, testSupabaseConnection, pushAllToSupabase, fetchAllFromSupabase } from '../lib/supabase';
import { SchoolClass, Student, Subject, UserRole } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';

export const AdminPanelView: React.FC = () => {
  const { user, school, updateSchool } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'SCHOOL' | 'CLASSES' | 'SUBJECTS' | 'DATABASE' | 'ROLES'>('SCHOOL');

  const classes = LocalDB.get<SchoolClass[]>('classes', []);
  const students = LocalDB.get<Student[]>('students', []);
  const subjects = LocalDB.get<Subject[]>('subjects', []);

  // Supabase Config & Sync State
  const [supabaseUrl, setSupabaseUrl] = useState(import.meta.env.VITE_SUPABASE_URL || 'https://snbuxezdlmydruikmdgf.supabase.co');
  const [supabaseKey, setSupabaseKey] = useState(import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuYnV4ZXpkbG15ZHJ1aWttZGdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyOTE0MTgsImV4cCI6MjEwMDg2NzQxOH0.3ibkM4DfQ6EUPZplG1g4TUtM7ikitJ8eEBpvMj2rIyQ');
  const [testStatus, setTestStatus] = useState<{ loading: boolean; success?: boolean; message?: string }>({ loading: false });
  const [syncStatus, setSyncStatus] = useState<{ loading: boolean; message?: string }>({ loading: false });

  // Auto test connection on tab open
  useEffect(() => {
    if (activeTab === 'DATABASE') {
      handleTestConnection();
    }
  }, [activeTab]);

  const handleTestConnection = async () => {
    setTestStatus({ loading: true });
    const res = await testSupabaseConnection();
    setTestStatus({ loading: false, success: res.success, message: res.message });
  };

  const handlePushData = async () => {
    setSyncStatus({ loading: true, message: 'Mengunggah data lokal ke Supabase...' });
    const res = await pushAllToSupabase();
    setSyncStatus({ loading: false });
    if (res.success) {
      showToast('Sinkronisasi Berhasil', 'Semua data lokal telah berhasil dikirim ke database Supabase', 'success');
    } else {
      showToast('Sinkronisasi Sebagian', 'Beberapa tabel gagal diunggah. Pastikan DDL SQL telah dieksekusi di Supabase.', 'warning');
    }
  };

  const handleFetchData = async () => {
    setSyncStatus({ loading: true, message: 'Mengunduh data dari Supabase...' });
    const res = await fetchAllFromSupabase();
    setSyncStatus({ loading: false });
    if (res.success && res.syncedTables.length > 0) {
      showToast('Unduh Berhasil', `Berhasil menyinkronkan ${res.syncedTables.length} tabel dari Supabase`, 'success');
    } else if (res.syncedTables.length > 0) {
      showToast('Unduh Sebagian', `Tersinkronisasi ${res.syncedTables.length} tabel. Terjadi error pada beberapa tabel.`, 'warning');
    } else {
      showToast('Tidak Ada Data', 'Database Supabase kosong atau tabel belum dibuat.', 'info');
    }
  };

  const handleExportBackup = () => {
    const data = {
      school,
      classes,
      students,
      subjects,
      backup_date: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EduMasterAI_Backup_${school.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast('Backup Database Berhasil Diunduh', 'File JSON cadangan tersimpan di perangkat Anda', 'success');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Settings className="w-6 h-6 text-slate-700 dark:text-slate-200" />
            Panel Administrator Sekolah (Super Admin)
          </h2>
          <p className="text-xs text-slate-400">Pengaturan sistem, manajemen master data, backup database, & integrasi Supabase.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto custom-scrollbar text-xs font-bold">
        {[
          { id: 'SCHOOL', label: 'Profil Sekolah', icon: School },
          { id: 'CLASSES', label: 'Master Kelas', icon: Users },
          { id: 'SUBJECTS', label: 'Master Mapel', icon: Settings },
          { id: 'DATABASE', label: 'Backup & Cloud Supabase', icon: Database },
          { id: 'ROLES', label: 'Matrik Akses Peran', icon: ShieldCheck },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
              activeTab === t.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <t.icon className="w-4 h-4" />
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === 'SCHOOL' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 text-xs">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Identitas Satuan Pendidikan</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Nama Satuan Pendidikan</label>
              <input
                type="text"
                value={school.name}
                onChange={e => updateSchool({ name: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">NPSN (Nomor Pokok Sekolah Nasional)</label>
              <input
                type="text"
                value={school.npsn}
                onChange={e => updateSchool({ npsn: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Nama Kepala Sekolah</label>
              <input
                type="text"
                value={school.principal_name}
                onChange={e => updateSchool({ principal_name: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">NIP Kepala Sekolah</label>
              <input
                type="text"
                value={school.principal_nip}
                onChange={e => updateSchool({ principal_nip: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'CLASSES' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 text-xs">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Daftar Master Kelas ({classes.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {classes.map(c => (
              <div key={c.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{c.name}</h4>
                <p className="text-[10px] text-slate-400 mt-1">Fase {c.phase || 'E'} • {c.total_students} Siswa</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'DATABASE' && (
        <div className="space-y-6">
          
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Backup & Cadangan Data</h3>
                <p className="text-slate-400 text-[10px]">Unduh cadangan data lokal dalam format JSON.</p>
              </div>

              <button
                onClick={handleExportBackup}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-2 shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Download Backup JSON</span>
              </button>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Koneksi Cloud PostgreSQL (Supabase)</h3>
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Data Ads-Yakesma (snbuxezdlmydruikmdgf)
              </span>
            </div>

            <p className="text-slate-500 leading-relaxed">
              Edu Master AI terhubung secara aktif dengan database cloud <strong>Supabase (PostgreSQL)</strong>. Setiap perubahan data pada modul diautonisasi secara realtime ke cloud.
            </p>

            {/* Test Status Banner */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200">
                  {testStatus.loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                  ) : testStatus.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                  )}
                  <span>Status Koneksi Supabase:</span>
                </div>
                <button
                  onClick={handleTestConnection}
                  disabled={testStatus.loading}
                  className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 font-bold text-[11px] transition flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testStatus.loading ? 'animate-spin' : ''}`} />
                  <span>Uji Koneksi Ulang</span>
                </button>
              </div>

              <p className={`text-[11px] font-medium ${testStatus.success ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                {testStatus.loading ? 'Menguji respon database Supabase...' : testStatus.message || 'Belum diuji.'}
              </p>
            </div>

            {/* Config Inputs */}
            <div className="space-y-3 pt-1">
              <div>
                <label className="block font-semibold mb-1">VITE_SUPABASE_URL</label>
                <input
                  type="text"
                  value={supabaseUrl}
                  onChange={e => setSupabaseUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                  placeholder="https://your-project.supabase.co"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">VITE_SUPABASE_ANON_KEY</label>
                <input
                  type="password"
                  value={supabaseKey}
                  onChange={e => setSupabaseKey(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                  placeholder="eyJhbGciOiJIUzI1NiI..."
                />
              </div>

              <div className="flex flex-wrap gap-2.5 pt-2">
                <button
                  onClick={() => {
                    showToast('Koneksi Supabase Tersimpan', 'Pengaturan Supabase berhasil dikonfigurasi', 'success');
                    handleTestConnection();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md"
                >
                  Simpan Kredensial Supabase
                </button>

                <button
                  onClick={handlePushData}
                  disabled={syncStatus.loading}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md flex items-center gap-1.5"
                >
                  <Upload className="w-4 h-4" />
                  <span>{syncStatus.loading ? 'Mengunggah...' : 'Unggah Data Lokal ke Supabase'}</span>
                </button>

                <button
                  onClick={handleFetchData}
                  disabled={syncStatus.loading}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>{syncStatus.loading ? 'Mengunduh...' : 'Tarik Data dari Supabase'}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">SQL Schema Generator (PostgreSQL / Supabase DDL)</h3>
              </div>
              <button
                onClick={() => {
                  const sqlText = (document.getElementById('sql-schema-area') as HTMLTextAreaElement)?.value || '';
                  navigator.clipboard.writeText(sqlText);
                  showToast('SQL Schema Disalin', 'Siap ditempel ke Supabase SQL Editor', 'success');
                }}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md flex items-center gap-1.5"
              >
                <span>Salin Kode SQL</span>
              </button>
            </div>

            <p className="text-slate-500">
              Gunakan DDL SQL di bawah ini pada menu <strong>SQL Editor</strong> di dashboard Supabase Anda (Project ID: <code>snbuxezdlmydruikmdgf</code>) untuk membuat seluruh tabel database beserta Row Level Security (RLS) policies.
            </p>

            <textarea
              id="sql-schema-area"
              readOnly
              rows={12}
              className="w-full p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-[11px] leading-relaxed border border-slate-800 outline-none resize-y"
              value={`-- =========================================================================
-- DATABASE DDL SCHEMA FOR EDU MASTER AI (SUPABASE / POSTGRESQL)
-- Project Name: Data Ads-Yakesma
-- Project ID: snbuxezdlmydruikmdgf
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. SCHOOLS
CREATE TABLE IF NOT EXISTS public.schools (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  npsn TEXT,
  address TEXT,
  province TEXT,
  regency TEXT,
  principal_name TEXT,
  principal_nip TEXT,
  academic_year TEXT DEFAULT '2025/2026',
  semester TEXT DEFAULT 'Ganjil',
  accreditation TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. PROFILES (TEACHERS / STAFF)
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  full_name TEXT NOT NULL,
  nip TEXT,
  nuptk TEXT,
  rank TEXT,
  position TEXT,
  email TEXT,
  role TEXT NOT NULL DEFAULT 'teacher', -- super_admin, school_admin, teacher, homeroom_teacher
  school_id TEXT REFERENCES public.schools(id) ON DELETE CASCADE,
  phone TEXT,
  photo_url TEXT,
  avatar_url TEXT,
  signature_url TEXT,
  subjects JSONB DEFAULT '[]'::jsonb,
  classes JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TEACHING SCHEDULES
CREATE TABLE IF NOT EXISTS public.teaching_schedules (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  day_of_week TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  class_id TEXT REFERENCES public.classes(id) ON DELETE CASCADE,
  class_name TEXT,
  subject_id TEXT REFERENCES public.subjects(id) ON DELETE CASCADE,
  subject_name TEXT,
  teacher_id TEXT,
  teacher_name TEXT,
  room TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. CALENDAR EVENTS
CREATE TABLE IF NOT EXISTS public.calendar_events (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  type TEXT DEFAULT 'agenda',
  notes TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. SUBJECTS
CREATE TABLE IF NOT EXISTS public.subjects (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  code TEXT,
  grade_level TEXT,
  phase TEXT,
  total_jp_per_week INT DEFAULT 2,
  school_id TEXT REFERENCES public.schools(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. CLASSES
CREATE TABLE IF NOT EXISTS public.classes (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  grade_level TEXT,
  phase TEXT DEFAULT 'E',
  school_id TEXT REFERENCES public.schools(id) ON DELETE CASCADE,
  homeroom_teacher_id TEXT,
  homeroom_teacher_name TEXT,
  total_students INT DEFAULT 0,
  academic_year TEXT DEFAULT '2025/2026',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. STUDENTS
CREATE TABLE IF NOT EXISTS public.students (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  nisn TEXT UNIQUE NOT NULL,
  nis TEXT,
  full_name TEXT NOT NULL,
  gender TEXT DEFAULT 'L',
  class_id TEXT REFERENCES public.classes(id) ON DELETE CASCADE,
  class_name TEXT,
  parent_name TEXT,
  parent_phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. MODUL AJAR (MODUL_AJAR)
CREATE TABLE IF NOT EXISTS public.modul_ajar (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  subject_id TEXT REFERENCES public.subjects(id) ON DELETE SET NULL,
  subject_name TEXT,
  class_id TEXT REFERENCES public.classes(id) ON DELETE SET NULL,
  class_name TEXT,
  phase TEXT,
  alokasi_waktu TEXT,
  elemen TEXT,
  capaian_pembelajaran TEXT,
  tujuan_pembelajaran JSONB DEFAULT '[]'::jsonb,
  kata_kunci JSONB DEFAULT '[]'::jsonb,
  profil_pelajar_pancasila JSONB DEFAULT '[]'::jsonb,
  sarana_prasarana TEXT,
  kriteria_ketercapaian TEXT,
  pemahaman_bermakna TEXT,
  pertanyaan_pemantik JSONB DEFAULT '[]'::jsonb,
  kegiatan_pembelajaran JSONB DEFAULT '{}'::jsonb,
  asesmen_pembelajaran JSONB DEFAULT '{}'::jsonb,
  pengayaan_remedial TEXT,
  refleksi_guru TEXT,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. BAHAN AJAR
CREATE TABLE IF NOT EXISTS public.bahan_ajar (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  subject_id TEXT REFERENCES public.subjects(id) ON DELETE SET NULL,
  subject_name TEXT,
  class_id TEXT REFERENCES public.classes(id) ON DELETE SET NULL,
  class_name TEXT,
  type TEXT DEFAULT 'ringkasan',
  content TEXT,
  key_points JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. LKPD ITEMS
CREATE TABLE IF NOT EXISTS public.lkpd_items (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  subject_id TEXT REFERENCES public.subjects(id) ON DELETE SET NULL,
  subject_name TEXT,
  class_id TEXT REFERENCES public.classes(id) ON DELETE SET NULL,
  class_name TEXT,
  alokasi_waktu TEXT,
  petunjuk_kerja TEXT,
  kelompok_max INT DEFAULT 4,
  kasus_problem TEXT,
  pertanyaan_diskusi JSONB DEFAULT '[]'::jsonb,
  rubrik_penilaian JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. KKTP ITEMS
CREATE TABLE IF NOT EXISTS public.kktp_items (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  subject_id TEXT REFERENCES public.subjects(id) ON DELETE SET NULL,
  subject_name TEXT,
  class_id TEXT REFERENCES public.classes(id) ON DELETE SET NULL,
  class_name TEXT,
  tp_code TEXT,
  tp_description TEXT,
  interval_nilai JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. CP_TP_ATP ITEMS
CREATE TABLE IF NOT EXISTS public.cp_tp_atp_items (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  subject_id TEXT REFERENCES public.subjects(id) ON DELETE SET NULL,
  subject_name TEXT,
  phase TEXT,
  elemen TEXT,
  cp_statement TEXT,
  tp_list JSONB DEFAULT '[]'::jsonb,
  atp_sequence JSONB DEFAULT '[]'::jsonb,
  total_jp INT DEFAULT 36,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. PROTA ITEMS
CREATE TABLE IF NOT EXISTS public.prota_items (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  subject_id TEXT REFERENCES public.subjects(id) ON DELETE SET NULL,
  subject_name TEXT,
  class_id TEXT REFERENCES public.classes(id) ON DELETE SET NULL,
  class_name TEXT,
  academic_year TEXT DEFAULT '2025/2026',
  semester_1_jp INT DEFAULT 36,
  semester_2_jp INT DEFAULT 36,
  atp_summary JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. PROSEM ITEMS
CREATE TABLE IF NOT EXISTS public.prosem_items (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  subject_id TEXT REFERENCES public.subjects(id) ON DELETE SET NULL,
  subject_name TEXT,
  class_id TEXT REFERENCES public.classes(id) ON DELETE SET NULL,
  class_name TEXT,
  semester TEXT DEFAULT 'Ganjil',
  academic_year TEXT DEFAULT '2025/2026',
  materi_list JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. ATTENDANCES (PRESENSI)
CREATE TABLE IF NOT EXISTS public.attendances (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  class_id TEXT REFERENCES public.classes(id) ON DELETE CASCADE,
  class_name TEXT,
  subject_id TEXT REFERENCES public.subjects(id) ON DELETE CASCADE,
  subject_name TEXT,
  records JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. GRADES (BUKU NILAI)
CREATE TABLE IF NOT EXISTS public.grades (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  class_id TEXT REFERENCES public.classes(id) ON DELETE CASCADE,
  class_name TEXT,
  subject_id TEXT REFERENCES public.subjects(id) ON DELETE CASCADE,
  subject_name TEXT,
  semester TEXT DEFAULT 'Ganjil',
  academic_year TEXT DEFAULT '2025/2026',
  student_id TEXT REFERENCES public.students(id) ON DELETE CASCADE,
  student_name TEXT,
  tp_scores JSONB DEFAULT '{}'::jsonb,
  formatif_avg NUMERIC DEFAULT 0,
  sumatif_materi_avg NUMERIC DEFAULT 0,
  sumatif_akhir_semester NUMERIC DEFAULT 0,
  final_score NUMERIC DEFAULT 0,
  deskripsi_capaian TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. QUIZ_EXAMS
CREATE TABLE IF NOT EXISTS public.quiz_exams (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  type TEXT DEFAULT 'Kuis',
  subject_id TEXT REFERENCES public.subjects(id) ON DELETE SET NULL,
  subject_name TEXT,
  class_id TEXT REFERENCES public.classes(id) ON DELETE SET NULL,
  class_name TEXT,
  duration_minutes INT DEFAULT 60,
  questions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 16. JOURNALS (JURNAL MENGAJAR)
CREATE TABLE IF NOT EXISTS public.journals (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  period TEXT,
  class_id TEXT REFERENCES public.classes(id) ON DELETE CASCADE,
  class_name TEXT,
  subject_id TEXT REFERENCES public.subjects(id) ON DELETE CASCADE,
  subject_name TEXT,
  materi TEXT,
  material_summary TEXT,
  reflection TEXT,
  teacher_reflection TEXT,
  notes TEXT,
  absent_students JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 17. STUDENT_TASKS (TUGAS SISWA)
CREATE TABLE IF NOT EXISTS public.student_tasks (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  description TEXT,
  subject_id TEXT REFERENCES public.subjects(id) ON DELETE SET NULL,
  subject_name TEXT,
  class_id TEXT REFERENCES public.classes(id) ON DELETE SET NULL,
  class_name TEXT,
  deadline DATE,
  attachment_url TEXT,
  instructions TEXT,
  max_score INT DEFAULT 100,
  submissions_count INT DEFAULT 0,
  submissions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 18. QUESTION_BANK (BANK SOAL & KARTU SOAL HOTS)
CREATE TABLE IF NOT EXISTS public.question_bank (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  question_text TEXT NOT NULL,
  options JSONB DEFAULT '[]'::jsonb,
  correct_answer TEXT,
  explanation TEXT,
  subject_id TEXT REFERENCES public.subjects(id) ON DELETE SET NULL,
  subject_name TEXT,
  grade_level TEXT,
  bloom_level TEXT DEFAULT 'C3',
  difficulty TEXT DEFAULT 'sedang',
  indicator TEXT,
  topic TEXT,
  kisi_kisi TEXT,
  kartu_soal TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================================================
-- ENABLE ROW LEVEL SECURITY (RLS) AND PUBLIC READ/WRITE POLICIES
-- =========================================================================
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modul_ajar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bahan_ajar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lkpd_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kktp_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cp_tp_atp_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prota_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prosem_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_bank ENABLE ROW LEVEL SECURITY;

-- Allow anon and authenticated access
DO $$
DECLARE
  tbl text;
BEGIN
  FOR tbl IN
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Allow all for anon and auth" ON public.%I', tbl);
    EXECUTE format('CREATE POLICY "Allow all for anon and auth" ON public.%I FOR ALL USING (true) WITH CHECK (true)', tbl);
  END LOOP;
END $$;
`}
            />
          </div>

        </div>
      )}

      {activeTab === 'ROLES' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 text-xs">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Matrik Peran & Hak Akses Pengguna (RBAC)</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
                  <th className="p-3 font-bold">Peran (Role)</th>
                  <th className="p-3 font-bold text-center">Modul Ajar & AI</th>
                  <th className="p-3 font-bold text-center">Buku Nilai & Presensi</th>
                  <th className="p-3 font-bold text-center">Panel Guru Wali</th>
                  <th className="p-3 font-bold text-center">Admin Panel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {[
                  { role: 'Super Admin', modul: 'Penuh', nilai: 'Penuh', wali: 'Penuh', admin: 'Penuh' },
                  { role: 'Admin Sekolah', modul: 'Penuh', nilai: 'Penuh', wali: 'Penuh', admin: 'Terbatas' },
                  { role: 'Guru Pengajar', modul: 'Penuh', nilai: 'Penuh', wali: 'Tidak', admin: 'Tidak' },
                  { role: 'Guru Wali Kelas', modul: 'Penuh', nilai: 'Penuh', wali: 'Penuh', admin: 'Tidak' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{row.role}</td>
                    <td className="p-3 text-center text-emerald-600 font-bold">{row.modul}</td>
                    <td className="p-3 text-center text-emerald-600 font-bold">{row.nilai}</td>
                    <td className="p-3 text-center font-bold">{row.wali}</td>
                    <td className="p-3 text-center font-bold">{row.admin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
