import React, { useState } from 'react';
import { CalendarDays, Sparkles, Download, Plus, Table, Loader2 } from 'lucide-react';
import { LocalDB } from '../lib/supabase';
import { ProtaItem, ProsemItem } from '../types';
import { useToast } from '../components/common/Toast';

export const ProtaProsemView: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'PROTA' | 'PROSEM'>('PROTA');

  const protaList = LocalDB.get<ProtaItem[]>('prota', [
    {
      id: 'prt-1',
      subject_id: 'sbj-1',
      subject_name: 'Matematika Lanjut',
      class_id: 'cls-101',
      class_name: 'X IPA 1',
      academic_year: '2025/2026',
      semester_1_jp: 36,
      semester_2_jp: 36,
      atp_summary: [
        { no: 1, materi: 'Sistem Persamaan Linear Tiga Variabel (SPLTV)', tp_code: 'TP 1.1 - 1.3', alokasi_jp: 12, semester: 1 },
        { no: 2, materi: 'Sistem Pertidaksamaan Linear Dua Variabel (SPtLDV)', tp_code: 'TP 2.1 - 2.2', alokasi_jp: 12, semester: 1 },
        { no: 3, materi: 'Fungsi Kuadrat dan Pengoperasiannya', tp_code: 'TP 3.1 - 3.3', alokasi_jp: 12, semester: 1 },
      ],
    },
  ]);

  const prosemList = LocalDB.get<ProsemItem[]>('prosem', [
    {
      id: 'prs-1',
      subject_id: 'sbj-1',
      subject_name: 'Matematika Lanjut',
      class_id: 'cls-101',
      class_name: 'X IPA 1',
      semester: 'Ganjil',
      academic_year: '2025/2026',
      materi_list: [
        { materi: 'SPLTV - Pendahuluan', alokasi_jp: 4, bulan_minggu: { Juli_3: 2, Juli_4: 2 } },
        { materi: 'SPLTV - Eliminasi Substitusi', alokasi_jp: 8, bulan_minggu: { Agustus_1: 4, Agustus_2: 4 } },
      ],
    },
  ]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-blue-600" />
            Program Tahunan (PROTA) & Program Semester (PROSEM)
          </h2>
          <p className="text-xs text-slate-400">Alokasi jam pelajaran dan matrik distribusi mingguan selama 1 tahun ajaran.</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('PROTA')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'PROTA' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            PROTA
          </button>
          <button
            onClick={() => setActiveTab('PROSEM')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'PROSEM' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            PROSEM
          </button>
        </div>
      </div>

      {activeTab === 'PROTA' ? (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Matrik Alokasi Program Tahunan (PROTA)</h3>
            <span className="font-bold text-blue-600">Total Jam: 72 JP</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
                  <th className="p-3 font-bold">No</th>
                  <th className="p-3 font-bold">Materi Pembelajaran</th>
                  <th className="p-3 font-bold">Kode TP</th>
                  <th className="p-3 font-bold text-center">Semester</th>
                  <th className="p-3 font-bold text-center">Alokasi Waktu (JP)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {protaList[0]?.atp_summary.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-medium text-slate-400">{row.no}</td>
                    <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{row.materi}</td>
                    <td className="p-3 text-indigo-600 dark:text-indigo-400 font-bold">{row.tp_code}</td>
                    <td className="p-3 text-center">Semester {row.semester}</td>
                    <td className="p-3 text-center font-bold">{row.alokasi_jp} JP</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Matrik Program Semester (PROSEM) Ganjil</h3>
            <span className="font-bold text-blue-600">Semester 1</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
                  <th className="p-3 font-bold">Materi</th>
                  <th className="p-3 font-bold text-center">JP</th>
                  <th className="p-3 font-bold text-center">Juli (M3-M4)</th>
                  <th className="p-3 font-bold text-center">Agustus (M1-M2)</th>
                  <th className="p-3 font-bold text-center">September</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {prosemList[0]?.materi_list.map((m, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{m.materi}</td>
                    <td className="p-3 text-center font-bold">{m.alokasi_jp} JP</td>
                    <td className="p-3 text-center text-blue-600 font-bold">2 JP | 2 JP</td>
                    <td className="p-3 text-center text-blue-600 font-bold">4 JP | 4 JP</td>
                    <td className="p-3 text-center text-emerald-600 font-bold">ASTS</td>
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
