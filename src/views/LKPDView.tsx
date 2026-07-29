import React, { useState } from 'react';
import { FileText, Sparkles, Plus, Download, Trash2, Eye, Loader2 } from 'lucide-react';
import { LocalDB } from '../lib/supabase';
import { LKPDItem, SchoolClass, Subject } from '../types';
import { useToast } from '../components/common/Toast';

export const LKPDView: React.FC = () => {
  const { showToast } = useToast();
  const [lkpdList, setLkpdList] = useState<LKPDItem[]>(() => LocalDB.get<LKPDItem[]>('lkpd', [
    {
      id: 'lkpd-1',
      title: 'LKPD Interaktif 01 - Pemodelan Masalah Kontekstual SPLTV',
      subject_id: 'sbj-1',
      subject_name: 'Matematika Lanjut',
      class_id: 'cls-101',
      class_name: 'X IPA 1',
      instructions: [
        'Bacalah studi kasus pembelian paket alatalat tulis secara cermat.',
        'Diskusikan bersama kelompok (4-5 siswa) untuk membuat pemodelan aljabar.',
        'Selesaikan persamaan menggunakan metode eliminasi pada lembar jawaban.'
      ],
      summary: 'Lembar kerja ini bertujuan melatih kemampuan siswa memodelkan masalah belanja harian ke dalam bentuk 3 variabel (x, y, z).',
      individual_tasks: [
        'Tentukan variabel x, y, dan z dari cerita tersebut.',
        'Tuliskan 3 persamaan matematis yang terbentuk.'
      ],
      group_tasks: [
        'Selesaikan sistem persamaan dengan metode eliminasi substitusi.',
        'Buatlah kesimpulan berapa harga 1 buah buku, 1 pensil, dan 1 penghapus.'
      ],
      assessment_rubric: 'Keakuratan Model (40%), Ketepatan Hasil (40%), Kerjasama Kelompok (20%).',
      created_at: new Date().toISOString()
    }
  ]));

  const classes = LocalDB.get<SchoolClass[]>('classes', []);
  const subjects = LocalDB.get<Subject[]>('subjects', []);

  const [selectedLkpd, setSelectedLkpd] = useState<LKPDItem | null>(lkpdList[0] || null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [topic, setTopic] = useState('Penyelesaian SPLTV Kontekstual');

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'lkpd',
          prompt: topic,
        }),
      });

      const data = await response.json();
      if (data.success && data.result) {
        const res = data.result;
        const newLkpd: LKPDItem = {
          id: `lkpd-${Date.now()}`,
          title: res.title || `LKPD - ${topic}`,
          subject_id: subjects[0]?.id || 'sbj-1',
          subject_name: subjects[0]?.name || 'Matematika',
          class_id: classes[0]?.id || 'cls-101',
          class_name: classes[0]?.name || 'X IPA 1',
          instructions: Array.isArray(res.petunjuk) ? res.petunjuk : ['Ikuti petunjuk guru.'],
          summary: res.materiRingkas || 'Ringkasan materi LKPD.',
          individual_tasks: Array.isArray(res.tugasIndividu) ? res.tugasIndividu : ['Selesaikan soal di lembar jawaban.'],
          group_tasks: Array.isArray(res.tugasKelompok) ? res.tugasKelompok : ['Diskusikan bersama kelompok.'],
          assessment_rubric: res.rubrikPenilaian || 'Rubrik Asesmen.',
          created_at: new Date().toISOString()
        };

        const updated = [newLkpd, ...lkpdList];
        setLkpdList(updated);
        LocalDB.set('lkpd', updated);
        setSelectedLkpd(newLkpd);
        showToast('LKPD Interaktif Berhasil Dibuat AI', '', 'success');
        setIsAiModalOpen(false);
      }
    } catch (err: any) {
      showToast('Gagal Membuat LKPD', err.message, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Lembar Kerja Peserta Didik (LKPD) Interaktif
          </h2>
          <p className="text-xs text-slate-400">Lembar aktivitas kelompok & mandiri siswa siap cetak.</p>
        </div>

        <button
          onClick={() => setIsAiModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-md flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          Generate LKPD AI
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* List */}
        <div className="space-y-2">
          {lkpdList.map(lk => (
            <div
              key={lk.id}
              onClick={() => setSelectedLkpd(lk)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedLkpd?.id === lk.id
                  ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 font-semibold'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100 line-clamp-2">{lk.title}</h4>
              <p className="text-[10px] text-slate-400 mt-1">{lk.subject_name} • {lk.class_name}</p>
            </div>
          ))}
        </div>

        {/* Preview Printable LKPD */}
        <div className="lg:col-span-2">
          {selectedLkpd ? (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5 text-xs">
              <div className="text-center pb-3 border-b border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">LEMBAR KERJA PESERTA DIDIK (LKPD)</span>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">{selectedLkpd.title}</h3>
                <p className="text-slate-400 text-[11px]">{selectedLkpd.subject_name} — Kelas {selectedLkpd.class_name}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">A. Petunjuk pengerjaan:</h4>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-300">
                  {selectedLkpd.instructions.map((ins, i) => <li key={i}>{ins}</li>)}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">B. Ringkasan Materi & Kasus:</h4>
                <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedLkpd.summary}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/50 space-y-2">
                  <h4 className="font-bold text-blue-700 dark:text-blue-300">Tugas Individu</h4>
                  <ul className="list-decimal pl-4 space-y-1 text-slate-700 dark:text-slate-300">
                    {selectedLkpd.individual_tasks.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/50 dark:border-indigo-800/50 space-y-2">
                  <h4 className="font-bold text-indigo-700 dark:text-indigo-300">Tugas Kelompok</h4>
                  <ul className="list-decimal pl-4 space-y-1 text-slate-700 dark:text-slate-300">
                    {selectedLkpd.group_tasks.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">Pilih LKPD dari daftar.</div>
          )}
        </div>

      </div>

      {/* AI Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">AI LKPD Generator</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Topik Praktikum / Diskusi LKPD</label>
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
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold flex items-center gap-2"
                >
                  {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
                  <span>Generate LKPD</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
