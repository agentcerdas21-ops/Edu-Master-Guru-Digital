import React, { useState } from 'react';
import { Target, Sparkles, Plus, Trash2 } from 'lucide-react';
import { LocalDB } from '../lib/supabase';
import { KKTPItem } from '../types';
import { useToast } from '../components/common/Toast';

export const KKTPView: React.FC = () => {
  const { showToast } = useToast();
  const [kktpList, setKktpList] = useState<KKTPItem[]>(() => LocalDB.get<KKTPItem[]>('kktp', [
    {
      id: 'kktp-1',
      subject_id: 'sbj-1',
      subject_name: 'Matematika Lanjut',
      class_id: 'cls-101',
      class_name: 'X IPA 1',
      tp_code: 'TP 1.1',
      tp_description: 'Menjelaskan konsep dasar SPLTV dan bentuk umumnya.',
      interval_nilai: {
        perlu_bimbingan: '0 - 60 (Belum mencapai KKTP, perlu intervensi khusus)',
        cukup: '61 - 75 (Mencapai KKTP, dengan remedi pada indikator tertentu)',
        baik: '76 - 88 (Mencapai KKTP, tanpa remedi)',
        sangat_baik: '89 - 100 (Melampaui KKTP, diberikan pengayaan HOTS)',
      },
      created_at: new Date().toISOString()
    }
  ]));

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Target className="w-6 h-6 text-emerald-600" />
            Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)
          </h2>
          <p className="text-xs text-slate-400">Interval ketuntasan kriteria nilai Kurikulum Merdeka.</p>
        </div>
      </div>

      <div className="space-y-4">
        {kktpList.map(k => (
          <div key={k.id} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px]">
                  {k.tp_code}
                </span>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 mt-2">{k.tp_description}</h4>
                <p className="text-slate-400 text-[10px]">{k.subject_name} • Kelas {k.class_name}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200/60 dark:border-red-800/60">
                <span className="font-bold text-red-600 dark:text-red-400 block mb-1">Perlu Bimbingan</span>
                <p className="text-slate-600 dark:text-slate-300 text-[11px]">{k.interval_nilai.perlu_bimbingan}</p>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/60">
                <span className="font-bold text-amber-600 dark:text-amber-400 block mb-1">Cukup</span>
                <p className="text-slate-600 dark:text-slate-300 text-[11px]">{k.interval_nilai.cukup}</p>
              </div>

              <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-800/60">
                <span className="font-bold text-blue-600 dark:text-blue-400 block mb-1">Baik</span>
                <p className="text-slate-600 dark:text-slate-300 text-[11px]">{k.interval_nilai.baik}</p>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/60">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">Sangat Baik</span>
                <p className="text-slate-600 dark:text-slate-300 text-[11px]">{k.interval_nilai.sangat_baik}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
