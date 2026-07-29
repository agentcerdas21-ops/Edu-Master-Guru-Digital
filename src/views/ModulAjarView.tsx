import React, { useState } from 'react';
import { BookOpen, Sparkles, Download, Plus, Trash2, Eye, FileText, Loader2, FileCode } from 'lucide-react';
import { LocalDB } from '../lib/supabase';
import { LessonPlan, SchoolClass, Subject } from '../types';
import { exportModulAjarPDF } from '../lib/pdfExport';
import { exportModulAjarWord } from '../lib/wordExport';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';

export const ModulAjarView: React.FC = () => {
  const { school, user } = useAuth();
  const { showToast } = useToast();

  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>(() => LocalDB.get<LessonPlan[]>('lesson_plans', []));
  const classes = LocalDB.get<SchoolClass[]>('classes', []);
  const subjects = LocalDB.get<Subject[]>('subjects', []);

  const [selectedModul, setSelectedModul] = useState<LessonPlan | null>(lessonPlans[0] || null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Form state for AI Generator Modal
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState('Sistem Persamaan Linear Tiga Variabel (SPLTV)');
  const [aiPhase, setAiPhase] = useState<'A' | 'B' | 'C' | 'D' | 'E' | 'F'>('E');
  const [aiClassId, setAiClassId] = useState(classes[0]?.id || '');
  const [aiSubjectId, setAiSubjectId] = useState(subjects[0]?.id || '');

  const handleGenerateAI = async () => {
    if (!aiTopic) return;
    setIsGenerating(true);
    try {
      const selClass = classes.find(c => c.id === aiClassId);
      const selSubject = subjects.find(s => s.id === aiSubjectId);

      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'modul_ajar',
          prompt: aiTopic,
          context: {
            phase: aiPhase,
            className: selClass?.name || 'X IPA 1',
            subjectName: selSubject?.name || 'Matematika',
            schoolName: school.name,
          },
        }),
      });

      const data = await response.json();

      if (data.success && data.result) {
        const res = data.result;
        const newModul: LessonPlan = {
          id: `mp-${Date.now()}`,
          title: res.title || `Modul Ajar - ${aiTopic}`,
          subject_id: aiSubjectId,
          subject_name: selSubject?.name || 'Matematika',
          class_id: aiClassId,
          class_name: selClass?.name || 'X IPA 1',
          phase: aiPhase,
          duration: res.duration || '2 Pertemuan x 2 JP',
          cp: res.cp || 'Capaian Pembelajaran Kurikulum Merdeka.',
          tp: Array.isArray(res.tp) ? res.tp : ['Memahami konsep dasar topik.'],
          profil_pancasila: Array.isArray(res.profilPancasila) ? res.profilPancasila : ['Bernalar Kritis'],
          media_pembelajaran: Array.isArray(res.mediaPembelajaran) ? res.mediaPembelajaran : ['Laptop', 'LKPD'],
          target_peserta_didik: res.targetPesertaDidik || 'Peserta Didik Reguler',
          model_pembelajaran: res.modelPembelajaran || 'Problem Based Learning',
          pemahaman_bermakna: res.pemahamanBermakna || 'Penjelasan konteks kehidupan nyata.',
          pertanyaan_pemantik: Array.isArray(res.pertanyaanPemantik) ? res.pertanyaanPemantik : ['Apa contoh penerapan materi ini?'],
          kegiatan_awal: Array.isArray(res.kegiatanAwal) ? res.kegiatanAwal : ['Apersepsi dan doa bersama.'],
          kegiatan_inti: Array.isArray(res.kegiatanInti) ? res.kegiatanInti : ['Diskusi kelompok dan presentasi.'],
          kegiatan_penutup: Array.isArray(res.kegiatanPenutup) ? res.kegiatanPenutup : ['Kesimpulan dan evaluasi.'],
          asesmen_diagnostik: res.asesmen?.diagnostik || 'Kuis singkat.',
          asesmen_formatif: res.asesmen?.formatif || 'Observasi keaktifan.',
          asesmen_sumatif: res.asesmen?.sumatif || 'Tes tertulis.',
          remedial_pengayaan: res.remedialAndPengayaan || 'Remedial bagi nilai < KKTP.',
          created_by: user.full_name,
          created_at: new Date().toISOString(),
        };

        const updated = [newModul, ...lessonPlans];
        setLessonPlans(updated);
        LocalDB.set('lesson_plans', updated);
        setSelectedModul(newModul);
        showToast('Modul Ajar Berhasil Dihasilkan oleh AI', 'Format Kurikulum Merdeka Lengkap Siap Digunakan', 'success');
        setIsAiModalOpen(false);
      } else {
        throw new Error('Gagal memproses data AI.');
      }
    } catch (error: any) {
      showToast('Gagal Menghasilkan Modul', error.message || 'Periksa koneksi server', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = (id: string) => {
    const updated = lessonPlans.filter(p => p.id !== id);
    setLessonPlans(updated);
    LocalDB.set('lesson_plans', updated);
    if (selectedModul?.id === id) setSelectedModul(updated[0] || null);
    showToast('Modul Ajar Dihapus', '', 'info');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            Modul Ajar Kurikulum Merdeka
          </h2>
          <p className="text-xs text-slate-400">Susun dan hasilkan Modul Ajar otomatis berstandar Kemendikbudristek.</p>
        </div>

        <button
          onClick={() => setIsAiModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all transform active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          Generate Modul Ajar AI
        </button>
      </div>

      {/* Main Grid: Modul List & Full Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Modul List */}
        <div className="space-y-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Daftar Modul Ajar ({lessonPlans.length})</h3>
          
          <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
            {lessonPlans.map(mp => (
              <div
                key={mp.id}
                onClick={() => setSelectedModul(mp)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedModul?.id === mp.id
                    ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-900 dark:text-blue-100 font-semibold shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                    Fase {mp.phase}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(mp.id);
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h4 className="font-bold text-xs mt-2 line-clamp-2">{mp.title}</h4>
                <p className="text-[10px] opacity-70 mt-1">{mp.subject_name} • {mp.class_name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Modul Detail View */}
        <div className="lg:col-span-2">
          {selectedModul ? (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
              
              {/* Actions Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">FASE {selectedModul.phase} • {selectedModul.subject_name}</span>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{selectedModul.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => exportModulAjarPDF(selectedModul, school.name, user.full_name, user.nip)}
                    className="px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200/60 text-xs font-semibold hover:bg-red-100 flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export PDF
                  </button>
                  <button
                    onClick={() => exportModulAjarWord(selectedModul)}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/60 text-xs font-semibold hover:bg-blue-100 flex items-center gap-1.5"
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    Export Word
                  </button>
                </div>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-slate-400 font-medium">Alokasi Waktu</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedModul.duration}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Model Pembelajaran</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedModul.model_pembelajaran}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Target Siswa</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedModul.target_peserta_didik}</p>
                </div>
              </div>

              {/* CP & TP */}
              <div className="space-y-3 text-xs">
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">Capaian Pembelajaran (CP)</h4>
                  <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 leading-relaxed">{selectedModul.cp}</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">Tujuan Pembelajaran (TP)</h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-300">
                    {selectedModul.tp?.map((t, idx) => (
                      <li key={idx}>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Langkah Kegiatan */}
              <div className="space-y-3 text-xs pt-3 border-t border-slate-100 dark:border-slate-800">
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Langkah Kegiatan Pembelajaran</h4>
                
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-blue-600 dark:text-blue-400 block mb-1">1. Pendahuluan</span>
                    <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-300">
                      {selectedModul.kegiatan_awal?.map((k, i) => <li key={i}>{k}</li>)}
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-blue-600 dark:text-blue-400 block mb-1">2. Kegiatan Inti</span>
                    <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-300">
                      {selectedModul.kegiatan_inti?.map((k, i) => <li key={i}>{k}</li>)}
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-blue-600 dark:text-blue-400 block mb-1">3. Penutup</span>
                    <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-300">
                      {selectedModul.kegiatan_penutup?.map((k, i) => <li key={i}>{k}</li>)}
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              Pilih Modul Ajar dari daftar di samping atau buat baru dengan AI.
            </div>
          )}
        </div>

      </div>

      {/* AI Generator Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">AI Modul Ajar Generator</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Topik / Materi Pembelajaran</label>
                <input
                  type="text"
                  value={aiTopic}
                  onChange={e => setAiTopic(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                  placeholder="Misal: Persamaan Kuadrat, Hukum Newton, Teks Anecdot"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Fase Kurikulum</label>
                  <select
                    value={aiPhase}
                    onChange={e => setAiPhase(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                  >
                    <option value="A">Fase A (Kelas 1-2 SD)</option>
                    <option value="B">Fase B (Kelas 3-4 SD)</option>
                    <option value="C">Fase C (Kelas 5-6 SD)</option>
                    <option value="D">Fase D (Kelas 7-9 SMP)</option>
                    <option value="E">Fase E (Kelas 10 SMA/SMK)</option>
                    <option value="F">Fase F (Kelas 11-12 SMA/SMK)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Target Kelas</label>
                  <select
                    value={aiClassId}
                    onChange={e => setAiClassId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAiModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-semibold"
                  disabled={isGenerating}
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleGenerateAI}
                  disabled={isGenerating}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sedang Menyusun AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Generate Modul Sekarang</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
