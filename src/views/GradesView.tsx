import React, { useState } from 'react';
import { Award, FileSpreadsheet, FileText, Sparkles, TrendingUp, Filter } from 'lucide-react';
import { LocalDB } from '../lib/supabase';
import { GradeRecord, Student, SchoolClass } from '../types';
import { exportGradesToExcel } from '../lib/excelExport';
import { exportGradesPDF } from '../lib/pdfExport';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';

export const GradesView: React.FC = () => {
  const { school, user } = useAuth();
  const { showToast } = useToast();

  const students = LocalDB.get<Student[]>('students', []);
  const classes = LocalDB.get<SchoolClass[]>('classes', []);

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || 'cls-101');

  // Grades state { [studentId]: { tugas: number, quiz: number, uts: number, uas: number } }
  const [gradeMap, setGradeMap] = useState<Record<string, { tugas: number; quiz: number; uts: number; uas: number }>>({
    'std-01': { tugas: 88, quiz: 85, uts: 90, uas: 92 },
    'std-02': { tugas: 90, quiz: 92, uts: 88, uas: 95 },
    'std-03': { tugas: 75, quiz: 70, uts: 72, uas: 78 },
    'std-04': { tugas: 60, quiz: 65, uts: 58, uas: 62 },
    'std-05': { tugas: 82, quiz: 80, uts: 85, uas: 84 },
  });

  const classStudents = students.filter(s => s.class_id === selectedClassId);

  // Calculate weighted average & ranking
  const studentRankings = classStudents.map(std => {
    const g = gradeMap[std.id] || { tugas: 75, quiz: 75, uts: 75, uas: 75 };
    const finalScore = Math.round((g.tugas * 0.2) + (g.quiz * 0.2) + (g.uts * 0.3) + (g.uas * 0.3));
    
    let predikat = 'Baik (B)';
    if (finalScore >= 90) predikat = 'Sangat Baik (A)';
    else if (finalScore < 70) predikat = 'Perlu Bimbingan (D)';
    else if (finalScore < 78) predikat = 'Cukup (C)';

    return {
      student_id: std.id,
      student_name: std.full_name,
      student_nisn: std.nisn,
      tugas: g.tugas,
      quiz: g.quiz,
      uts: g.uts,
      uas: g.uas,
      finalScore,
      predikat,
    };
  }).sort((a, b) => b.finalScore - a.finalScore);

  const handleScoreChange = (studentId: string, field: 'tugas' | 'quiz' | 'uts' | 'uas', value: number) => {
    setGradeMap(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { tugas: 75, quiz: 75, uts: 75, uas: 75 }),
        [field]: value
      }
    }));
  };

  const handleSaveGrades = () => {
    showToast('Buku Nilai Berhasil Disimpan', 'Nilai akhir & ranking dikalkulasi ulang secara otomatis', 'success');
  };

  const handleExportPDF = () => {
    const list = studentRankings.map((sr, idx) => ({
      student_name: sr.student_name,
      student_nisn: sr.student_nisn,
      tugas: sr.tugas,
      quiz: sr.quiz,
      uts: sr.uts,
      uas: sr.uas,
      final_score: sr.finalScore,
      grade: sr.predikat,
    }));
    const className = classes.find(c => c.id === selectedClassId)?.name || '10';
    exportGradesPDF(list, className, 'Matematika Lanjut', school.name, user.full_name, user.nip);
  };

  const handleExportExcel = () => {
    const list = studentRankings.map((sr, idx) => ({
      Rank: idx + 1,
      NISN: sr.student_nisn,
      Nama: sr.student_name,
      Tugas: sr.tugas,
      Quiz: sr.quiz,
      UTS: sr.uts,
      UAS: sr.uas,
      Nilai_Akhir: sr.finalScore,
      Predikat: sr.predikat,
    }));
    exportGradesToExcel(list, `Buku_Nilai_Kelas_${selectedClassId}.xlsx`);
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Award className="w-6 h-6 text-blue-600" />
            Buku Nilai & Ranking Otomatis
          </h2>
          <p className="text-xs text-slate-400">Pembobotan Tugas, Quiz, UTS, UAS, Kalkulasi Nilai Akhir & Predikat Capaian.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPDF}
            className="px-3 py-2 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 border border-red-200 text-xs font-semibold hover:bg-red-100 flex items-center gap-1"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>PDF Rapor</span>
          </button>
          <button
            onClick={handleExportExcel}
            className="px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 flex items-center gap-1"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Excel Rekap</span>
          </button>
        </div>
      </div>

      {/* Class Selector & Save */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <label className="font-bold text-slate-700 dark:text-slate-300">Pilih Kelas:</label>
          <select
            value={selectedClassId}
            onChange={e => setSelectedClassId(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
          >
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSaveGrades}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md transition-all"
        >
          Simpan Buku Nilai
        </button>
      </div>

      {/* Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-x-auto text-xs">
        <table className="w-full text-left border-collapse min-w-[750px]">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-500">
              <th className="p-3 font-bold w-12 text-center">Peringkat</th>
              <th className="p-3 font-bold">Nama Siswa</th>
              <th className="p-3 font-bold text-center">Tugas (20%)</th>
              <th className="p-3 font-bold text-center">Quiz (20%)</th>
              <th className="p-3 font-bold text-center">UTS (30%)</th>
              <th className="p-3 font-bold text-center">UAS (30%)</th>
              <th className="p-3 font-bold text-center">Nilai Akhir</th>
              <th className="p-3 font-bold text-center">Predikat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {studentRankings.map((sr, idx) => (
              <tr key={sr.student_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="p-3 text-center">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-extrabold text-[10px] ${
                    idx === 0 ? 'bg-amber-400 text-slate-950' : idx === 1 ? 'bg-slate-300 text-slate-900' : idx === 2 ? 'bg-amber-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {idx + 1}
                  </span>
                </td>
                <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{sr.student_name}</td>
                
                <td className="p-3 text-center">
                  <input
                    type="number"
                    value={sr.tugas}
                    onChange={e => handleScoreChange(sr.student_id, 'tugas', parseInt(e.target.value) || 0)}
                    className="w-16 p-1.5 rounded-lg border text-center font-semibold bg-slate-50 dark:bg-slate-800"
                  />
                </td>

                <td className="p-3 text-center">
                  <input
                    type="number"
                    value={sr.quiz}
                    onChange={e => handleScoreChange(sr.student_id, 'quiz', parseInt(e.target.value) || 0)}
                    className="w-16 p-1.5 rounded-lg border text-center font-semibold bg-slate-50 dark:bg-slate-800"
                  />
                </td>

                <td className="p-3 text-center">
                  <input
                    type="number"
                    value={sr.uts}
                    onChange={e => handleScoreChange(sr.student_id, 'uts', parseInt(e.target.value) || 0)}
                    className="w-16 p-1.5 rounded-lg border text-center font-semibold bg-slate-50 dark:bg-slate-800"
                  />
                </td>

                <td className="p-3 text-center">
                  <input
                    type="number"
                    value={sr.uas}
                    onChange={e => handleScoreChange(sr.student_id, 'uas', parseInt(e.target.value) || 0)}
                    className="w-16 p-1.5 rounded-lg border text-center font-semibold bg-slate-50 dark:bg-slate-800"
                  />
                </td>

                <td className="p-3 text-center font-extrabold text-blue-600 dark:text-blue-400 text-sm">
                  {sr.finalScore}
                </td>

                <td className="p-3 text-center">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    sr.finalScore >= 80 ? 'bg-emerald-100 text-emerald-700' : sr.finalScore >= 70 ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {sr.predikat}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
