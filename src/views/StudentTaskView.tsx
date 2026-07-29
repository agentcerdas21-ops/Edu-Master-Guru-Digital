import React, { useState } from 'react';
import { FileQuestion, Plus, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { LocalDB } from '../lib/supabase';
import { StudentTaskItem } from '../types';
import { useToast } from '../components/common/Toast';

export const StudentTaskView: React.FC = () => {
  const { showToast } = useToast();
  const [tasks, setTasks] = useState<StudentTaskItem[]>(() => LocalDB.get<StudentTaskItem[]>('student_tasks', [
    {
      id: 'tsk-1',
      title: 'Tugas Mandiri 01 - Pemodelan SPLTV Kasus Toko Buku',
      subject_id: 'sbj-1',
      subject_name: 'Matematika Lanjut',
      class_id: 'cls-101',
      class_name: 'X IPA 1',
      deadline: '2025-08-15',
      instructions: 'Kerjakan soal pada halaman 42 buku cetak. Foto dan upload jawaban dalam bentuk PDF.',
      max_score: 100,
      submissions_count: 28,
      created_at: new Date().toISOString()
    }
  ]));

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <FileQuestion className="w-6 h-6 text-blue-600" />
            Penugasan & Pengumpulan Tugas Siswa
          </h2>
          <p className="text-xs text-slate-400">Buat instruksi penugasan mandiri / kelompok dan periksa hasil kiriman siswa.</p>
        </div>
      </div>

      <div className="space-y-4">
        {tasks.map(t => (
          <div key={t.id} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="font-bold text-blue-600">Tenggat: {t.deadline}</span>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 mt-1">{t.title}</h4>
                <p className="text-slate-400 text-[10px]">{t.subject_name} • Kelas {t.class_name}</p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-medium">Pengumpulan</span>
                <span className="font-bold text-emerald-600 text-sm">{t.submissions_count} / 32 Siswa</span>
              </div>
            </div>

            <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300">
              {t.instructions}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
};
