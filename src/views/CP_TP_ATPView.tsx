import React, { useState } from 'react';
import { Layers, Sparkles, Plus, Trash2, Loader2, ArrowRight } from 'lucide-react';
import { LocalDB } from '../lib/supabase';
import { CP_TP_ATPItem, Subject } from '../types';
import { useToast } from '../components/common/Toast';

export const CP_TP_ATPView: React.FC = () => {
  const { showToast } = useToast();
  const [atpList, setAtpList] = useState<CP_TP_ATPItem[]>(() => LocalDB.get<CP_TP_ATPItem[]>('atp', [
    {
      id: 'atp-01',
      subject_id: 'sbj-1',
      subject_name: 'Matematika Lanjut',
      phase: 'E',
      element: 'Aljabar dan Fungsi',
      cp_text: 'Peserta didik dapat menyelesaikan masalah yang berkaitan dengan sistem persamaan linear tiga variabel dan sistem pertidaksamaan linear dua variabel.',
      tp_list: [
        { code: 'TP 1.1', description: 'Menjelaskan konsep dasar SPLTV dan bentuk umumnya.', alokasi_waktu: '2 JP', keywords: 'SPLTV, Variabel' },
        { code: 'TP 1.2', description: 'Memodelkan masalah kontekstual ke dalam sistem persamaan linear tiga variabel.', alokasi_waktu: '4 JP', keywords: 'Pemodelan, Kontekstual' },
        { code: 'TP 1.3', description: 'Menyelesaikan SPLTV dengan metode eliminasi dan substitusi.', alokasi_waktu: '4 JP', keywords: 'Eliminasi, Substitusi' },
      ],
      atp_sequence: ['TP 1.1', 'TP 1.2', 'TP 1.3'],
    },
  ]));

  const subjects = LocalDB.get<Subject[]>('subjects', []);
  const [selectedAtp, setSelectedAtp] = useState<CP_TP_ATPItem | null>(atpList[0] || null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [topic, setTopic] = useState('Aljabar & Sistem Persamaan');

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'atp_cp',
          prompt: topic,
        }),
      });

      const data = await response.json();
      if (data.success && data.result) {
        const res = data.result;
        const newAtp: CP_TP_ATPItem = {
          id: `atp-${Date.now()}`,
          subject_id: subjects[0]?.id || 'sbj-1',
          subject_name: subjects[0]?.name || 'Matematika',
          phase: res.fase || 'E',
          element: 'Elemen Utama',
          cp_text: res.cp || 'Capaian Pembelajaran Elemen.',
          tp_list: (res.tpList || []).map((t: any) => ({
            code: t.code || 'TP 1',
            description: t.description || 'Deskripsi TP',
            alokasi_waktu: t.alokasiWaktu || '2 JP',
            keywords: t.kataKunci || 'Utama',
          })),
          atp_sequence: res.atpOrder || ['TP 1'],
        };

        const updated = [newAtp, ...atpList];
        setAtpList(updated);
        LocalDB.set('atp', updated);
        setSelectedAtp(newAtp);
        showToast('CP, TP, & ATP AI Berhasil Dihasilkan', '', 'success');
        setIsAiModalOpen(false);
      }
    } catch (err: any) {
      showToast('Gagal Menghasilkan ATP', err.message, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-600" />
            Capaian, Tujuan & Alur Tujuan Pembelajaran (CP, TP & ATP)
          </h2>
          <p className="text-xs text-slate-400">Peta jalan hirarki pembelajaran Kurikulum Merdeka.</p>
        </div>

        <button
          onClick={() => setIsAiModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-md flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          Generate CP, TP & ATP AI
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* List */}
        <div className="space-y-2">
          {atpList.map(a => (
            <div
              key={a.id}
              onClick={() => setSelectedAtp(a)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedAtp?.id === a.id
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 font-semibold'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                Fase {a.phase}
              </span>
              <h4 className="font-bold text-xs mt-2 text-slate-800 dark:text-slate-100">{a.element}</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">{a.subject_name}</p>
            </div>
          ))}
        </div>

        {/* Detail */}
        <div className="lg:col-span-2">
          {selectedAtp ? (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 text-xs">
              
              <div>
                <span className="font-bold text-indigo-600">ELEMEN: {selectedAtp.element} (FASE {selectedAtp.phase})</span>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mt-1">Capaian Pembelajaran (CP)</h3>
                <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 mt-2 leading-relaxed">
                  {selectedAtp.cp_text}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-3">Tujuan Pembelajaran (TP) & Alur (ATP)</h4>
                <div className="space-y-3">
                  {selectedAtp.tp_list.map((tp, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
                      <div className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold text-[10px] shrink-0">
                        {tp.code}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{tp.description}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-400">
                          <span>Alokasi: <strong className="text-slate-700 dark:text-slate-300">{tp.alokasi_waktu}</strong></span>
                          <span>Kata Kunci: <strong className="text-indigo-500">{tp.keywords}</strong></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">Pilih data dari daftar.</div>
          )}
        </div>

      </div>

      {/* AI Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">AI CP, TP & ATP Generator</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Materi / Topik Utama</label>
                <input
                  type="text"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  onClick={() => setIsAiModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-semibold"
                >
                  Batal
                </button>
                <button
                  onClick={handleGenerateAI}
                  disabled={isGenerating}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold flex items-center gap-2"
                >
                  {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
                  <span>Generate AI</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
