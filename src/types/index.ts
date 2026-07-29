export type UserRole = 'super_admin' | 'school_admin' | 'teacher' | 'homeroom_teacher' | 'operator';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  school_id: string;
  avatar_url?: string;
  phone?: string;
  nip?: string;
  nuptk?: string;
  rank?: string; // Golongan/Pangkat
  position?: string;
  signature_url?: string;
  created_at: string;
}

export interface SchoolInfo {
  id: string;
  name: string;
  npsn: string;
  address: string;
  logo_url: string;
  principal_name: string;
  principal_nip: string;
  academic_year: string; // e.g. "2025/2026"
  semester: 'Ganjil' | 'Genap';
  accreditation: string;
}

export interface Student {
  id: string;
  nis: string;
  nisn: string;
  full_name: string;
  gender: 'L' | 'P';
  class_id: string;
  class_name?: string;
  parent_name: string;
  parent_phone: string;
  parent_email?: string;
  address?: string;
  school_id: string;
  created_at: string;
}

export interface SchoolClass {
  id: string;
  name: string; // e.g. "X IPA 1"
  grade_level: string; // e.g. "10"
  phase?: string; // e.g. "E"
  school_id: string;
  homeroom_teacher_id: string;
  homeroom_teacher_name?: string;
  total_students?: number;
}

export interface Subject {
  id: string;
  name: string; // e.g. "Matematika", "Bahasa Indonesia"
  code: string;
  grade_level: string;
  school_id: string;
}

export interface TeachingSchedule {
  id: string;
  day_of_week: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
  start_time: string; // e.g. "07:30"
  end_time: string; // e.g. "09:00"
  class_id: string;
  class_name?: string;
  subject_id: string;
  subject_name?: string;
  teacher_id: string;
  teacher_name?: string;
  room: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  type: 'agenda' | 'libur_nasional' | 'ujian' | 'kegiatan_sekolah';
  notes?: string;
  color?: string;
}

export interface LessonPlan { // Modul Ajar Kurikulum Merdeka
  id: string;
  title: string;
  subject_id: string;
  subject_name?: string;
  class_id: string;
  class_name?: string;
  phase: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  duration: string;
  cp: string;
  tp: string[];
  profil_pancasila: string[];
  media_pembelajaran: string[];
  target_peserta_didik: string;
  model_pembelajaran: string;
  pemahaman_bermakna: string;
  pertanyaan_pemantik: string[];
  kegiatan_awal: string[];
  kegiatan_inti: string[];
  kegiatan_penutup: string[];
  asesmen_diagnostik: string;
  asesmen_formatif: string;
  asesmen_sumatif: string;
  remedial_pengayaan: string;
  created_by: string;
  created_at: string;
}

export interface LearningMaterial { // Bahan Ajar
  id: string;
  title: string;
  type: 'pdf' | 'word' | 'ppt' | 'video' | 'youtube';
  url: string;
  category: string;
  subject_id: string;
  subject_name?: string;
  class_id: string;
  class_name?: string;
  size?: string;
  created_at: string;
}

export interface LKPDItem { // Lembar Kerja Peserta Didik
  id: string;
  title: string;
  subject_id: string;
  subject_name?: string;
  class_id: string;
  class_name?: string;
  instructions: string[];
  summary: string;
  individual_tasks: string[];
  group_tasks: string[];
  assessment_rubric: string;
  created_at: string;
}

export interface KKTPItem { // Kriteria Ketercapaian Tujuan Pembelajaran
  id: string;
  subject_id: string;
  subject_name?: string;
  class_id: string;
  class_name?: string;
  tp_code: string;
  tp_description: string;
  interval_nilai: {
    perlu_bimbingan: string; // 0-60
    cukup: string; // 61-75
    baik: string; // 76-88
    sangat_baik: string; // 89-100
  };
  created_at: string;
}

export interface CP_TP_ATPItem {
  id: string;
  subject_id: string;
  subject_name?: string;
  phase: string;
  element: string; // Elemen CP
  cp_text: string;
  tp_list: {
    code: string;
    description: string;
    alokasi_waktu: string;
    keywords: string;
  }[];
  atp_sequence: string[];
}

export interface ProtaItem {
  id: string;
  subject_id: string;
  subject_name?: string;
  class_id: string;
  class_name?: string;
  academic_year: string;
  semester_1_jp: number;
  semester_2_jp: number;
  atp_summary: {
    no: number;
    materi: string;
    tp_code: string;
    alokasi_jp: number;
    semester: 1 | 2;
  }[];
}

export interface ProsemItem {
  id: string;
  subject_id: string;
  subject_name?: string;
  class_id: string;
  class_name?: string;
  semester: 'Ganjil' | 'Genap';
  academic_year: string;
  materi_list: {
    materi: string;
    alokasi_jp: number;
    bulan_minggu: { [monthWeek: string]: number }; // e.g. "Juli_1": 2
  }[];
}

export type AttendanceStatus = 'hadir' | 'izin' | 'sakit' | 'alpha' | 'dispensasi' | 'bolos' | 'terlambat';

export interface AttendanceRecord {
  id: string;
  student_id: string;
  student_name?: string;
  student_nisn?: string;
  class_id: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  notes?: string;
  recorded_by: string;
}

export type GradeCategory = 'tugas' | 'presentasi' | 'quiz' | 'uh' | 'uts' | 'uas';

export interface GradeRecord {
  id: string;
  student_id: string;
  student_name?: string;
  subject_id: string;
  class_id: string;
  category: GradeCategory;
  score: number;
  weight: number;
  notes?: string;
  semester: 'Ganjil' | 'Genap';
  academic_year: string;
  created_at: string;
}

export type QuestionType = 'pg' | 'pg_kompleks' | 'benar_salah' | 'menjodohkan' | 'isian' | 'essay' | 'essay_panjang';
export type BloomLevel = 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6';

export interface Question {
  id: string;
  quiz_id?: string;
  type: QuestionType;
  question_text: string;
  media_type?: 'image' | 'audio' | 'video';
  media_url?: string;
  options?: string[];
  correct_answer: any; // e.g. "A" or ["A", "C"] or boolean or string
  matching_pairs?: { left: string; right: string }[];
  explanation?: string;
  level_bloom: BloomLevel;
}

export interface QuizExam {
  id: string;
  title: string;
  type: 'Quiz' | 'UH' | 'UTS' | 'UAS';
  subject_id: string;
  subject_name?: string;
  class_id: string;
  class_name?: string;
  duration_minutes: number;
  start_time: string;
  end_time: string;
  random_questions: boolean;
  random_answers: boolean;
  max_violations: number; // Anti cheat limit
  questions: Question[];
  status: 'draft' | 'active' | 'completed';
  created_by: string;
}

export interface AntiCheatLog {
  id: string;
  quiz_id: string;
  student_id: string;
  student_name: string;
  violation_type: 'exit_fullscreen' | 'tab_switch' | 'minimize' | 'right_click' | 'copy_paste';
  timestamp: string;
  count: number;
}

export interface TeachingJournal {
  id: string;
  date: string; // YYYY-MM-DD
  period?: string; // Jam Ke (e.g. "1 - 2")
  class_id: string;
  class_name?: string;
  subject_id: string;
  subject_name?: string;
  materi?: string;
  material_summary?: string;
  reflection?: string;
  teacher_reflection?: string;
  notes?: string;
  absent_students?: string[];
  created_at: string;
}
export type TeachingJournalItem = TeachingJournal;

export interface StudentTask {
  id: string;
  title: string;
  description?: string;
  subject_id: string;
  subject_name?: string;
  class_id: string;
  class_name?: string;
  deadline: string;
  attachment_url?: string;
  instructions?: string;
  max_score?: number;
  submissions_count?: number;
  created_at?: string;
  submissions?: {
    student_id: string;
    student_name: string;
    file_url?: string;
    submitted_at: string;
    score?: number;
    comment?: string;
    status: 'submitted' | 'late' | 'graded';
  }[];
}
export type StudentTaskItem = StudentTask;

export interface QuestionBankItem {
  id: string;
  question_text: string;
  options: { code: string; text: string }[];
  correct_answer: string;
  explanation: string;
  subject_id: string;
  subject_name?: string;
  grade_level?: string;
  bloom_level: BloomLevel;
  difficulty: 'mudah' | 'sedang' | 'sukar';
  indicator?: string;
  topic?: string;
  kisi_kisi?: string;
  kartu_soal?: string;
  created_at?: string;
}

export type ExamItem = QuizExam;

export interface StudentHomeroomRecord {
  student_id: string;
  achievements: { id: string; date: string; title: string; category: string; description: string }[];
  violations: { id: string; date: string; title: string; points: number; description: string }[];
  counseling_notes: { id: string; date: string; topic: string; summary: string; follow_up: string }[];
}

export interface AuditLog {
  id: string;
  user_name: string;
  user_role: string;
  action: string;
  details: string;
  timestamp: string;
}
