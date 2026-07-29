import React, { useState } from 'react';
import { Shield, Phone, Award, AlertTriangle, Heart, User } from 'lucide-react';
import { LocalDB } from '../lib/supabase';
import { Student } from '../types';
import { useToast } from '../components/common/Toast';

export const HomeroomTeacherView: React.FC = () => {
  const { showToast } = useToast();
  const students = LocalDB.get<Student[]>('students', []);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(students[0] || null);

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Shield className="w-6 h-6 text-indigo-600" />
            Panel Khusus Guru Wali Kelas (Homeroom Management)
          </h2>
          <p className="text-xs text-slate-400">Pencatatan prestasi, poin pelanggaran, kontak orang tua, & bimbingan konseling.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Roster */}
        <div className="space-y-2">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Daftar Siswa Wali (Kelas X IPA 1)</h3>
          <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
            {students.map(s => (
              <div
                key={s.id}
                onClick={() => setSelectedStudent(s)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  selectedStudent?.id === s.id
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 font-semibold'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-100">{s.full_name}</span>
                  <span className="text-[10px] text-slate-400">NISN: {s.nisn}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Detail */}
        <div className="lg:col-span-2">
          {selectedStudent ? (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 text-xs">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 font-bold text-lg flex items-center justify-center">
                    {selectedStudent.full_name[0]}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">{selectedStudent.full_name}</h3>
                    <p className="text-slate-400 text-[10px]">NISN: {selectedStudent.nisn} • NIS: {selectedStudent.nis}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-medium">Ortu / Wali</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedStudent.parent_name || 'Bpk. Santoso'}</span>
                  <span className="text-indigo-600 font-bold block text-[10px]">{selectedStudent.parent_phone || '0812-3456-7890'}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Achievements */}
                <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/50 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold">
                    <Award className="w-4 h-4" />
                    <span>Catatan Prestasi Siswa</span>
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-slate-700 dark:text-slate-300">
                    <li>Juara 1 Olimpiade Matematika Tingkat Kabupaten (2025)</li>
                    <li>Ketua OSIS Periode 2025/2026</li>
                  </ul>
                </div>

                {/* Violations / Counseling */}
                <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/50 space-y-2">
                  <div className="flex items-center gap-2 text-amber-700 font-bold">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Catatan Bimbingan & Pelanggaran</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">Poin Pelanggaran: <strong className="text-emerald-600">0 Poin (Sangat Baik)</strong></p>
                  <p className="text-slate-500 text-[11px]">Siswa sangat aktif dan tidak memiliki catatan kedisiplinan negatif.</p>
                </div>

              </div>

            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">Pilih siswa dari daftar.</div>
          )}
        </div>

      </div>

    </div>
  );
};
