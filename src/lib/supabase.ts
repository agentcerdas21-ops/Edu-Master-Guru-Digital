import { createClient } from '@supabase/supabase-js';
import {
  UserProfile,
  SchoolInfo,
  Student,
  SchoolClass,
  Subject,
  TeachingSchedule,
  CalendarEvent,
  LessonPlan,
  LearningMaterial,
  LKPDItem,
  KKTPItem,
  CP_TP_ATPItem,
  ProtaItem,
  ProsemItem,
  AttendanceRecord,
  GradeRecord,
  QuizExam,
  TeachingJournal,
  StudentTask,
  QuestionBankItem,
  AuditLog
} from '../types';

// Supabase client instance configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://snbuxezdlmydruikmdgf.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuYnV4ZXpkbG15ZHJ1aWttZGdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyOTE0MTgsImV4cCI6MjEwMDg2NzQxOH0.3ibkM4DfQ6EUPZplG1g4TUtM7ikitJ8eEBpvMj2rIyQ';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'MY_SUPABASE_URL');

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Initial pre-populated data for out-of-the-box instant production execution
const defaultSchool: SchoolInfo = {
  id: 'sch-001',
  name: 'SMA Negeri 1 Jakarta',
  npsn: '20101234',
  address: 'Jl. M.H. Thamrin No. 10, Jakarta Pusat',
  logo_url: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=150&auto=format&fit=crop&q=80',
  principal_name: 'Dr. H. Ahmad Dahlan, M.Pd.',
  principal_nip: '196805121994031002',
  academic_year: '2025/2026',
  semester: 'Ganjil',
  accreditation: 'A (Unggul)'
};

const defaultUser: UserProfile = {
  id: 'usr-teacher-1',
  email: 'guru.indonesia@edumaster.id',
  full_name: 'Budi Santoso, S.Pd., M.Si.',
  role: 'teacher',
  school_id: 'sch-001',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  phone: '081234567890',
  nip: '198504152010011015',
  nuptk: '4532763664200003',
  rank: 'Penata Muda Tk. I / III-b',
  position: 'Guru Matematika & Guru Wali Kelas X-1',
  signature_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&auto=format&fit=crop&q=80',
  created_at: new Date().toISOString()
};

const defaultClasses: SchoolClass[] = [
  { id: 'cls-101', name: 'X IPA 1', grade_level: '10', school_id: 'sch-001', homeroom_teacher_id: 'usr-teacher-1', homeroom_teacher_name: 'Budi Santoso, S.Pd.', total_students: 32 },
  { id: 'cls-102', name: 'X IPA 2', grade_level: '10', school_id: 'sch-001', homeroom_teacher_id: 'usr-teacher-2', homeroom_teacher_name: 'Siti Rahma, M.Pd.', total_students: 30 },
  { id: 'cls-201', name: 'XI MIPA 1', grade_level: '11', school_id: 'sch-001', homeroom_teacher_id: 'usr-teacher-3', homeroom_teacher_name: 'Drs. Supriyadi', total_students: 34 },
];

const defaultSubjects: Subject[] = [
  { id: 'sbj-1', name: 'Matematika Lanjut', code: 'MTK-F10', grade_level: '10', school_id: 'sch-001' },
  { id: 'sbj-2', name: 'Informatika', code: 'INF-F10', grade_level: '10', school_id: 'sch-001' },
  { id: 'sbj-3', name: 'Fisika Merdeka', code: 'FIS-F10', grade_level: '10', school_id: 'sch-001' },
  { id: 'sbj-4', name: 'Bahasa Indonesia', code: 'BIN-F10', grade_level: '10', school_id: 'sch-001' },
];

const defaultStudents: Student[] = [
  { id: 'std-01', nis: '1001', nisn: '0071234561', full_name: 'Aditya Pratama', gender: 'L', class_id: 'cls-101', class_name: 'X IPA 1', parent_name: 'Bambang Pratama', parent_phone: '081299887766', school_id: 'sch-001', created_at: new Date().toISOString() },
  { id: 'std-02', nis: '1002', nisn: '0071234562', full_name: 'Anisa Putri Maharani', gender: 'P', class_id: 'cls-101', class_name: 'X IPA 1', parent_name: 'Heri Maharani', parent_phone: '081299887767', school_id: 'sch-001', created_at: new Date().toISOString() },
  { id: 'std-03', nis: '1003', nisn: '0071234563', full_name: 'Bagas Kurniawan', gender: 'L', class_id: 'cls-101', class_name: 'X IPA 1', parent_name: 'Joko Kurniawan', parent_phone: '081299887768', school_id: 'sch-001', created_at: new Date().toISOString() },
  { id: 'std-04', nis: '1004', nisn: '0071234564', full_name: 'Dewi Lestari', gender: 'P', class_id: 'cls-101', class_name: 'X IPA 1', parent_name: 'Surya Lestari', parent_phone: '081299887769', school_id: 'sch-001', created_at: new Date().toISOString() },
  { id: 'std-05', nis: '1005', nisn: '0071234565', full_name: 'Fikri Haikal', gender: 'L', class_id: 'cls-101', class_name: 'X IPA 1', parent_name: 'Rahmat Haikal', parent_phone: '081299887770', school_id: 'sch-001', created_at: new Date().toISOString() },
];

const defaultSchedules: TeachingSchedule[] = [
  { id: 'sch-1', day_of_week: 'Senin', start_time: '07:30', end_time: '09:00', class_id: 'cls-101', class_name: 'X IPA 1', subject_id: 'sbj-1', subject_name: 'Matematika Lanjut', teacher_id: 'usr-teacher-1', room: 'Ruang 101' },
  { id: 'sch-2', day_of_week: 'Senin', start_time: '09:15', end_time: '10:45', class_id: 'cls-102', class_name: 'X IPA 2', subject_id: 'sbj-1', subject_name: 'Matematika Lanjut', teacher_id: 'usr-teacher-1', room: 'Ruang 102' },
  { id: 'sch-3', day_of_week: 'Selasa', start_time: '08:00', end_time: '09:30', class_id: 'cls-201', class_name: 'XI MIPA 1', subject_id: 'sbj-1', subject_name: 'Matematika Lanjut', teacher_id: 'usr-teacher-1', room: 'Ruang Lab Komp' },
  { id: 'sch-4', day_of_week: 'Rabu', start_time: '07:30', end_time: '09:00', class_id: 'cls-101', class_name: 'X IPA 1', subject_id: 'sbj-2', subject_name: 'Informatika', teacher_id: 'usr-teacher-1', room: 'Lab Multimedia' },
];

const defaultCalendar: CalendarEvent[] = [
  { id: 'cal-1', title: 'Awal Tahun Ajaran Baru 2025/2026', start_date: '2025-07-15', end_date: '2025-07-15', type: 'agenda', notes: 'Upacara bendera & Pengenalan Lingkungan Sekolah' },
  { id: 'cal-2', title: 'HUT Kemerdekaan RI Ke-80', start_date: '2025-08-17', end_date: '2025-08-17', type: 'libur_nasional', notes: 'Upacara Proklamasi' },
  { id: 'cal-3', title: 'Asesmen Sumatif Tengah Semester (ASTS)', start_date: '2025-09-22', end_date: '2025-09-27', type: 'ujian', notes: 'Seluruh tingkatan kelas' },
];

const defaultLessonPlans: LessonPlan[] = [
  {
    id: 'mp-001',
    title: 'Modul Ajar Matematika - Sistem Persamaan Linear Tiga Variabel (SPLTV)',
    subject_id: 'sbj-1',
    subject_name: 'Matematika Lanjut',
    class_id: 'cls-101',
    class_name: 'X IPA 1',
    phase: 'E',
    duration: '3 Pertemuan x 2 JP (135 Menit)',
    cp: 'Di akhir fase E, peserta didik dapat menyelesaikan masalah yang berkaitan dengan sistem persamaan linear tiga variabel dan sistem pertidaksamaan linear dua variabel.',
    tp: [
      'Menjelaskan konsep dasar SPLTV dan penyelesaiannya.',
      'Dimodelkan masalah kontekstual kehidupan sehari-hari ke dalam bentuk SPLTV.',
      'Menyelesaikan SPLTV dengan metode eliminasi, substitusi, dan campuran.'
    ],
    profil_pancasila: ['Bernalar Kritis', 'Gotong Royong', 'Kreatif'],
    media_pembelajaran: ['LKPD Interaktif', 'Geogebra / Laptop', 'Slide Presentasi PowerPoint'],
    target_peserta_didik: 'Peserta Didik Reguler / Tipikal (32 Siswa)',
    model_pembelajaran: 'Problem-Based Learning (PBL)',
    pemahaman_bermakna: 'SPLTV digunakan untuk menghitung harga kombinasi paket belanjaan, investasi finansial, dan pemodelan teknik fisika.',
    pertanyaan_pemantik: [
      'Bagaimana cara menentukan harga 1 buku, 1 pensil, dan 1 penghapus jika membeli paket A, B, dan C dengan harga total berbeda?'
    ],
    kegiatan_awal: [
      'Guru membuka pembelajaran dengan salam, doa bersama, dan presensi (10 menit).',
      'Apersepsi: Mengingatkan kembali konsep SPLDV yang dipelajari di SMP.',
      'Menyampaikan tujuan pembelajaran dan manfaat materi SPLTV.'
    ],
    kegiatan_inti: [
      'Orientasi siswa pada masalah: Menayangkan studi kasus harga paket kebutuhan pokok.',
      'Mengorganisasi siswa: Membagi kelas menjadi 6 kelompok heterogeneous.',
      'Penyelidikan mandiri/kelompok: Masing-masing kelompok mengerjakan LKPD SPLTV.',
      'Mengembangkan karya: Perwakilan kelompok mempresentasikan solusi eliminasi-substitusi.'
    ],
    kegiatan_penutup: [
      'Siswa bersama guru menyimpulkan alur algoritma penyelesaian SPLTV.',
      'Refleksi pembelajaran menggunakan Google Forms / Lembar Refleksi.',
      'Pemberian tugas mandiri dan info materi minggu depan (10 menit).'
    ],
    asesmen_diagnostik: 'Kuis singkat 3 soal materi pembanding SPLDV.',
    asesmen_formatif: 'Observasi keaktifan diskusi kelompok & Lembar Kerja (LKPD).',
    asesmen_sumatif: 'Soal uraian 3 butir pada akhir bab.',
    remedial_pengayaan: 'Remedial: Bimbingan tutor sebaya untuk siswa nilai < KKTP. Pengayaan: Soal HOTS SPLTV kontekstual olimpiade.',
    created_by: 'Budi Santoso, S.Pd.',
    created_at: new Date().toISOString()
  }
];

// Helper to manage local storage with real Supabase synchronization
export class LocalDB {
  static get<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(`edumaster_${key}`);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  }

  static set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(`edumaster_${key}`, JSON.stringify(value));
      // Auto-sync changes to Supabase asynchronously
      if (supabase) {
        syncKeyToSupabase(key, value).catch((err) => {
          console.warn(`[Supabase AutoSync] Failed for ${key}:`, err);
        });
      }
    } catch (e) {
      console.error('LocalStorage error:', e);
    }
  }

  // Initialize DB defaults
  static initDefaults() {
    if (!localStorage.getItem('edumaster_school')) this.set('school', defaultSchool);
    if (!localStorage.getItem('edumaster_user')) this.set('user', defaultUser);
    if (!localStorage.getItem('edumaster_classes')) this.set('classes', defaultClasses);
    if (!localStorage.getItem('edumaster_subjects')) this.set('subjects', defaultSubjects);
    if (!localStorage.getItem('edumaster_students')) this.set('students', defaultStudents);
    if (!localStorage.getItem('edumaster_schedules')) this.set('schedules', defaultSchedules);
    if (!localStorage.getItem('edumaster_calendar')) this.set('calendar', defaultCalendar);
    if (!localStorage.getItem('edumaster_lesson_plans')) this.set('lesson_plans', defaultLessonPlans);
    if (!localStorage.getItem('edumaster_materials')) this.set('materials', []);
    if (!localStorage.getItem('edumaster_attendance')) this.set('attendance', []);
    if (!localStorage.getItem('edumaster_grades')) this.set('grades', []);
    if (!localStorage.getItem('edumaster_quizzes')) this.set('quizzes', []);
    if (!localStorage.getItem('edumaster_journals')) this.set('journals', []);
    if (!localStorage.getItem('edumaster_question_bank')) this.set('question_bank', []);
    if (!localStorage.getItem('edumaster_lkpd')) this.set('lkpd', []);
    if (!localStorage.getItem('edumaster_kktp')) this.set('kktp', []);
    if (!localStorage.getItem('edumaster_prota')) this.set('prota', []);
    if (!localStorage.getItem('edumaster_prosem')) this.set('prosem', []);
    if (!localStorage.getItem('edumaster_atp')) this.set('atp', []);
    if (!localStorage.getItem('edumaster_audit_logs')) this.set('audit_logs', [
      { id: 'log-1', user_name: 'Budi Santoso, S.Pd.', user_role: 'teacher', action: 'LOGIN', details: 'Berhasil masuk ke Edu Master AI', timestamp: new Date().toISOString() }
    ]);
  }
}

// Table mapping between LocalDB keys and Supabase table names
export const TABLE_MAP: Record<string, string> = {
  school: 'schools',
  user: 'profiles',
  classes: 'classes',
  subjects: 'subjects',
  students: 'students',
  schedules: 'teaching_schedules',
  calendar: 'calendar_events',
  lesson_plans: 'modul_ajar',
  materials: 'bahan_ajar',
  lkpd: 'lkpd_items',
  kktp: 'kktp_items',
  atp: 'cp_tp_atp_items',
  prota: 'prota_items',
  prosem: 'prosem_items',
  attendance: 'attendances',
  grades: 'grades',
  quizzes: 'quiz_exams',
  journals: 'journals',
  student_tasks: 'student_tasks',
  question_bank: 'question_bank',
};

// Test Supabase connectivity
export async function testSupabaseConnection(): Promise<{ success: boolean; message: string; details?: any }> {
  if (!supabase) {
    return { success: false, message: 'Klien Supabase belum terkonfigurasi. Periksa URL dan Anon Key.' };
  }
  try {
    const { data, error } = await supabase.from('schools').select('id').limit(1);
    if (error) {
      if (error.code === '42P01') {
        return {
          success: false,
          message: 'Terkoneksi ke Supabase, namun tabel belum dibuat. Silakan eksekusi DDL SQL Schema di Supabase SQL Editor.',
          details: error,
        };
      }
      return { success: false, message: `Gagal query Supabase: ${error.message} (Kode: ${error.code})`, details: error };
    }
    return { success: true, message: 'Koneksi ke database Supabase berhasil dan siap digunakan!', details: data };
  } catch (err: any) {
    return { success: false, message: `Kesalahan jaringan / endpoint: ${err?.message || err}`, details: err };
  }
}

// Helper to sanitize payload before sending to Supabase to prevent column mismatch errors
function sanitizePayloadForSupabase(tableName: string, items: any[]): any[] {
  return items.map(item => {
    if (!item || typeof item !== 'object') return item;
    const cleanItem = { ...item };

    if (tableName === 'schools') {
      if (cleanItem.logoUrl && !cleanItem.logo_url) cleanItem.logo_url = cleanItem.logoUrl;
      delete cleanItem.logoUrl;
      delete cleanItem.principalName;
      delete cleanItem.principalNip;
      delete cleanItem.academicYear;
    }

    if (tableName === 'profiles') {
      if (cleanItem.avatar_url && !cleanItem.photo_url) cleanItem.photo_url = cleanItem.avatar_url;
      if (cleanItem.photo_url && !cleanItem.avatar_url) cleanItem.avatar_url = cleanItem.photo_url;
      if (cleanItem.fullName && !cleanItem.full_name) cleanItem.full_name = cleanItem.fullName;
      if (cleanItem.schoolId && !cleanItem.school_id) cleanItem.school_id = cleanItem.schoolId;
      delete cleanItem.fullName;
      delete cleanItem.schoolId;
      delete cleanItem.schoolName;
    }

    return cleanItem;
  });
}

// Sync a single LocalDB key to Supabase
export async function syncKeyToSupabase(key: string, data: any): Promise<{ success: boolean; message: string }> {
  if (!supabase) return { success: false, message: 'Supabase client not initialized' };
  const tableName = TABLE_MAP[key];
  if (!tableName) return { success: false, message: `No table mapping for key: ${key}` };

  try {
    let payload = data;
    if (!Array.isArray(payload)) {
      payload = payload ? [payload] : [];
    }
    if (payload.length === 0) {
      return { success: true, message: 'No data to sync' };
    }

    const cleanedPayload = sanitizePayloadForSupabase(tableName, payload);

    const { error } = await supabase.from(tableName).upsert(cleanedPayload);
    if (error) {
      // 42P01 = undefined_table (Table does not exist in Supabase yet)
      // 42703 = undefined_column
      if (error.code === '42P01') {
        return {
          success: false,
          message: `Tabel '${tableName}' belum dibuat di Supabase. Silakan jalankan DDL SQL di menu Admin.`
        };
      }
      return { success: false, message: error.message };
    }
    return { success: true, message: `Berhasil sinkronisasi ${tableName}` };
  } catch (e: any) {
    return { success: false, message: e?.message || 'Sync error' };
  }
}

// Push all local data to Supabase
export async function pushAllToSupabase(): Promise<{ success: boolean; results: Record<string, string> }> {
  const results: Record<string, string> = {};
  if (!supabase) return { success: false, results: { error: 'Supabase not initialized' } };

  let allSuccess = true;
  for (const [key, tableName] of Object.entries(TABLE_MAP)) {
    const localData = LocalDB.get(key, null);
    if (localData) {
      const res = await syncKeyToSupabase(key, localData);
      results[tableName] = res.success ? 'OK' : `Gagal: ${res.message}`;
      if (!res.success) allSuccess = false;
    }
  }
  return { success: allSuccess, results };
}

// Fetch all tables from Supabase into LocalDB
export async function fetchAllFromSupabase(): Promise<{ success: boolean; syncedTables: string[]; errors: string[] }> {
  if (!supabase) return { success: false, syncedTables: [], errors: ['Supabase not initialized'] };

  const syncedTables: string[] = [];
  const errors: string[] = [];

  for (const [key, tableName] of Object.entries(TABLE_MAP)) {
    try {
      const { data, error } = await supabase.from(tableName).select('*');
      if (error) {
        errors.push(`${tableName}: ${error.message}`);
      } else if (data && data.length > 0) {
        if (key === 'school' || key === 'user') {
          LocalDB.set(key, data[0]);
        } else {
          LocalDB.set(key, data);
        }
        syncedTables.push(tableName);
      }
    } catch (e: any) {
      errors.push(`${tableName}: ${e?.message || 'Fetch error'}`);
    }
  }

  return { success: errors.length === 0, syncedTables, errors };
}

// Call init on module load
LocalDB.initDefaults();

