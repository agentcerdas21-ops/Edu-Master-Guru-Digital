import React, { useState } from 'react';
import { Users2, Shuffle, Download, RefreshCw, Layers } from 'lucide-react';
import { LocalDB } from '../lib/supabase';
import { Student, SchoolClass } from '../types';
import { useToast } from '../components/common/Toast';

export const GroupDivisionView: React.FC = () => {
  const { showToast } = useToast();
  const students = LocalDB.get<Student[]>('students', []);
  const classes = LocalDB.get<SchoolClass[]>('classes', []);

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || 'cls-101');
  const [groupCount, setGroupCount] = useState<number>(4);
  const [strategy, setStrategy] = useState<'random' | 'grade' | 'gender'>('random');
  const [groups, setGroups] = useState<Student[][]>([]);

  const classStudents = students.filter(s => s.class_id === selectedClassId);

  const handleGenerateGroups = () => {
    let arr = [...classStudents];

    if (strategy === 'random') {
      arr = arr.sort(() => Math.random() - 0.5);
    } else if (strategy === 'gender') {
      arr = arr.sort((a, b) => a.gender.localeCompare(b.gender));
    }

    const res: Student[][] = Array.from({ length: groupCount }, () => []);
    arr.forEach((student, index) => {
      res[index % groupCount].push(student);
    });

    setGroups(res);
    showToast('Pembagian Kelompok Berhasil', `Dibentuk ${groupCount} kelompok belajar siswa`, 'success');
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Users2 className="w-6 h-6 text-indigo-600" />
            Generator Pembagian Kelompok Belajar
          </h2>
          <p className="text-xs text-slate-400">Pembagian siswa acak, seimbang gender, atau heterogenitas nilai.</p>
        </div>
      </div>

      {/* Control Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div>
          <label className="block font-bold mb-1">Pilih Kelas</label>
          <select
            value={selectedClassId}
            onChange={e => setSelectedClassId(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
          >
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-bold mb-1">Jumlah Kelompok</label>
          <input
            type="number"
            min={2}
            max={10}
            value={groupCount}
            onChange={e => setGroupCount(parseInt(e.target.value) || 2)}
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
          />
        </div>

        <div>
          <label className="block font-bold mb-1">Strategi Pembagian</label>
          <select
            value={strategy}
            onChange={e => setStrategy(e.target.value as any)}
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
          >
            <option value="random">Acak Sepenuhnya (Random)</option>
            <option value="gender">Keseimbangan Gender (L/P)</option>
            <option value="grade">Heterogenitas Prestasi Nilai</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={handleGenerateGroups}
            className="w-full p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center justify-center gap-2 shadow-md"
          >
            <Shuffle className="w-4 h-4" />
            <span>Bagikan Kelompok</span>
          </button>
        </div>
      </div>

      {/* Group Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((grp, gIdx) => (
          <div key={gIdx} className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-sm text-indigo-600 dark:text-indigo-400">Kelompok {gIdx + 1}</h4>
              <span className="text-[10px] text-slate-400">{grp.length} Siswa</span>
            </div>

            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              {grp.map((s, idx) => (
                <li key={s.id} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                  <span>{idx + 1}. {s.full_name}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-semibold">{s.gender}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

    </div>
  );
};
