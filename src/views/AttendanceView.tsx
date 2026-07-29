import React, { useState } from 'react';
import { CheckSquare, Calendar, Download, Users, FileSpreadsheet, FileText } from 'lucide-react';
import { LocalDB } from '../lib/supabase';
import { AttendanceRecord, Student, SchoolClass, AttendanceStatus } from '../types';
import { exportAttendancePDF } from '../lib/pdfExport';
import { exportAttendanceToExcel } from '../lib/excelExport';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';

export const AttendanceView: React.FC = () => {
  const { school, user } = useAuth();
  const { showToast } = useToast();

  const students = LocalDB.get<Student[]>('students', []);
  const classes = LocalDB.get<SchoolClass[]>('classes', []);

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || 'cls-101');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Attendance Map state { [studentId]: status }
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceStatus>>({
    'std-01': 'hadir',
    'std-02': 'hadir',
    'std-03': 'hadir',
    'std-04': 'izin',
    'std-05': 'sakit',
  });

  const [notesMap, setNotesMap] = useState<Record<string, string>>({
    'std-04': 'Izin urusan keluarga',
    'std-05': 'Surat dokter',
  });

  const classStudents = students.filter(s => s.class_id === selectedClassId);
  const currentClassObj = classes.find(c => c.id === selectedClassId);

  const statusOptions: { key: AttendanceStatus; label: string; color: string }[] = [
    { key: 'hadir', label: 'Hadir', color: 'bg-emerald-500 text-white' },
    { key: 'izin', label: 'Izin', color: 'bg-blue-500 text-white' },
    { key: 'sakit', label: 'Sakit', color: 'bg-amber-500 text-white' },
    { key: 'alpha', label: 'Alpha', color: 'bg-red-500 text-white' },
    { key: 'dispensasi', label: 'Dispensasi', color: 'bg-purple-500 text-white' },
    { key: 'bolos', label: 'Bolos', color: 'bg-orange-600 text-white' },
    { key: 'terlambat', label: 'Terlambat', color: 'bg-yellow-500 text-white' },
  ];

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceMap(prev => ({ ...prev, [studentId]: status }));
  };

  const handleNoteChange = (studentId: string, note: string) => {
    setNotesMap(prev => ({ ...prev, [studentId]: note }));
  };

  const handleSaveAll = () => {
    const recordsToSave: AttendanceRecord[] = classStudents.map(s => ({
      id: `att-${s.id}-${selectedDate}`,
      student_id: s.id,
      student_name: s.full_name,
      student_nisn: s.nisn,
      class_id: selectedClassId,
      date: selectedDate,
      status: attendanceMap[s.id] || 'hadir',
      notes: notesMap[s.id] || '',
      recorded_by: user.full_name,
    }));

    const existing = LocalDB.get<AttendanceRecord[]>('attendance', []);
    const updated = [...existing.filter(a => !(a.class_id === selectedClassId && a.date === selectedDate)), ...recordsToSave];
    LocalDB.set('attendance', updated);

    showToast('Presensi Berhasil Disimpan', `Presensi Kelas ${currentClassObj?.name} Tanggal ${selectedDate}`, 'success');
  };

  const handleExportPDF = () => {
    const list = classStudents.map(s => ({
      student_name: s.full_name,
      student_nisn: s.nisn,
      status: attendanceMap[s.id] || 'hadir',
      notes: notesMap[s.id] || '',
    }));
    exportAttendancePDF(list, currentClassObj?.name || '10', selectedDate, school.name, user.full_name, user.nip);
  };

  const handleExportExcel = () => {
    const list = classStudents.map(s => ({
      student_name: s.full_name,
      student_nisn: s.nisn,
      date: selectedDate,
      status: attendanceMap[s.id] || 'hadir',
      notes: notesMap[s.id] || '',
    }));
    exportAttendanceToExcel(list, `Presensi_${currentClassObj?.name}_${selectedDate}.xlsx`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-emerald-600" />
            Matrik Presensi Siswa Realtime
          </h2>
          <p className="text-xs text-slate-400">Pencatatan kehadiran harian dengan 7 status lengkap & ekspor rekapan.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPDF}
            className="px-3 py-2 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 border border-red-200 text-xs font-semibold hover:bg-red-100 flex items-center gap-1"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={handleExportExcel}
            className="px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 flex items-center gap-1"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Class & Date Filter Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Pilih Kelas</label>
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

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Tanggal Presensi</label>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
            />
          </div>
        </div>

        <button
          onClick={handleSaveAll}
          className="w-full md:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md transition-all"
        >
          Simpan Presensi Kelas
        </button>
      </div>

      {/* Attendance Matrix Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-x-auto text-xs">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-500">
              <th className="p-3 font-bold w-12 text-center">No</th>
              <th className="p-3 font-bold">NISN</th>
              <th className="p-3 font-bold">Nama Lengkap Siswa</th>
              <th className="p-3 font-bold text-center">Status Kehadiran</th>
              <th className="p-3 font-bold">Catatan Keterangan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {classStudents.map((std, idx) => {
              const currentStatus = attendanceMap[std.id] || 'hadir';

              return (
                <tr key={std.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 text-center text-slate-400 font-medium">{idx + 1}</td>
                  <td className="p-3 font-mono text-slate-500">{std.nisn}</td>
                  <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{std.full_name}</td>
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-1">
                      {statusOptions.map(opt => (
                        <button
                          key={opt.key}
                          onClick={() => handleStatusChange(std.id, opt.key)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                            currentStatus === opt.key
                              ? opt.color + ' ring-2 ring-offset-1 ring-emerald-500 shadow-sm'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 opacity-60 hover:opacity-100'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="p-3">
                    <input
                      type="text"
                      value={notesMap[std.id] || ''}
                      onChange={e => handleNoteChange(std.id, e.target.value)}
                      placeholder="Catatan..."
                      className="w-full px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[11px]"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};
