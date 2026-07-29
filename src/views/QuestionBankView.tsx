import React, { useState } from 'react';
import { HelpCircle, Sparkles, Download, Plus, Trash2, Filter, FileText, Loader2, FileCode } from 'lucide-react';
import { LocalDB } from '../lib/supabase';
import { QuestionBankItem, Subject } from '../types';
import { exportQuestionBankPDF } from '../lib/pdfExport';
import { exportQuestionBankWord } from '../lib/wordExport';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';

export const QuestionBankView: React.FC = () => {
  const { school, user } = useAuth();
  const { showToast } = useToast();

  const [questions, setQuestions] = useState<QuestionBankItem[]>(() => LocalDB.get<QuestionBankItem[]>('question_bank', [
    {
      id: 'qb-1',
      question_text: 'Tentukan himpunan penyelesaian dari sistem persamaan linear tiga variabel berikut: x + y + z = 6, 2x - y + z = 3, x + 2y - z = 2!',
      options: [
        { code: 'A', text: 'x = 1, y = 2, z = 3' },
        { code: 'B', text: 'x = 2, y = 1, z = 3' },
        { code: 'C', text: 'x = 3, y = 2, z = 1' },
        { code: 'D', text: 'x = 1, y = 1, z = 4' },
      ],
      correct_answer: 'A',
      explanation: 'Substitusikan x=1, y=2, z=3 ke ketiga persamaan. Memenuhi seluruh persamaan secara akurat.',
      subject_id: 'sbj-1',
      subject_name: 'Matematika Lanjut',
      bloom_level: 'C3',
      difficulty: 'sedang',
      indicator: 'Disajikan 3 persamaan SPLTV, siswa mampu menghitung nilai variabel dengan eliminasi.',
      created_at: new Date().toISOString()
    }
  ]));

  const subjects = LocalDB.get<Subject[]>('subjects', []);
  const [filterBloom, setFilterBloom] = useState<string>('Semua');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [topic, setTopic] = useState('Sistem Persamaan Linear & Pertidaksamaan');

  const filtered = filterBloom === 'Semua' ? questions : questions.filter(q => q.bloom_level === filterBloom);

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'question_bank',
          prompt: topic,
        }),
      });

      const data = await response.json();
      if (data.success && data.result) {
        const res = data.result;
        const newQuestions: QuestionBankItem[] = (res.questions || []).map((q: any, i: number) => ({
          id: `qb-${Date.now()}-${i}`,
          question_text: q.soal || 'Pertanyaan Soal AI',
          options: (q.pilihan || []).map((p: any) => ({ code: p.kode || 'A', text: p.teks || '' })),
          correct_answer: q.kunci || 'A',
          explanation: q.pembahasan || 'Pembahasan Soal',
          subject_id: subjects[0]?.id || 'sbj-1',
          subject_name: subjects[0]?.name || 'Matematika',
          bloom_level: q.bloomLevel || 'C3',
          difficulty: q.kesukaran || 'sedang',
          indicator: q.indikator || 'Indikator Pencapaian Soal',
          created_at: new Date().toISOString()
        }));

        const updated = [...newQuestions, ...questions];
        setQuestions(updated);
        LocalDB.set('question_bank', updated);
        showToast(`Berhasil Generate ${newQuestions.length} Soal HOTS AI`, '', 'success');
        setIsAiModalOpen(false);
      }
    } catch (err: any) {
      showToast('Gagal Generate Soal', err.message, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportPDF = () => {
    const list = questions.map(q => ({
      question_text: q.question_text,
      options: q.options,
      correct_answer: q.correct_answer,
      explanation: q.explanation,
      bloom_level: q.bloom_level,
      difficulty: q.difficulty,
    }));
    exportQuestionBankPDF(list, 'Matematika Lanjut', 'X IPA 1', school.name, user.full_name, user.nip);
  };

  const handleExportWord = () => {
    const list = questions.map(q => ({
      question_text: q.question_text,
      options: q.options,
      correct_answer: q.correct_answer,
      explanation: q.explanation,
      bloom_level: q.bloom_level,
      difficulty: q.difficulty,
    }));
    exportQuestionBankWord(list, 'Matematika Lanjut');
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-indigo-600" />
            Bank Soal, Kisi-Kisi & Kartu Soal HOTS (C1-C6)
          </h2>
          <p className="text-xs text-slate-400">Penyusunan butir soal, pilihan ganda, pembahasan & ekspor dokumen resmi.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPDF}
            className="px-3 py-2 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 border border-red-200 text-xs font-semibold hover:bg-red-100 flex items-center gap-1"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Kartu Soal PDF</span>
          </button>
          <button
            onClick={handleExportWord}
            className="px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 border border-blue-200 text-xs font-semibold hover:bg-blue-100 flex items-center gap-1"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Word</span>
          </button>
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Generate Soal AI</span>
          </button>
        </div>
      </div>

      {/* Bloom Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {['Semua', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6'].map(b => (
          <button
            key={b}
            onClick={() => setFilterBloom(b)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterBloom === b ? 'bg-indigo-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 border text-slate-600 dark:text-slate-300'
            }`}
          >
            Taksonomi {b}
          </button>
        ))}
      </div>

      {/* Questions list */}
      <div className="space-y-4">
        {filtered.map((q, idx) => (
          <div key={q.id} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px]">
                  Taksonomi {q.bloom_level}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] uppercase">
                  Tingkat {q.difficulty}
                </span>
              </div>
              <span className="text-slate-400 text-[10px] font-mono">ID: {q.id}</span>
            </div>

            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 leading-relaxed">
              {idx + 1}. {q.question_text}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
              {q.options.map(opt => (
                <div
                  key={opt.code}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                    opt.code === q.correct_answer
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 font-bold text-emerald-900 dark:text-emerald-100'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="w-5 h-5 rounded bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                    {opt.code}
                  </span>
                  <span>{opt.text}</span>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 mt-2 space-y-1">
              <span className="font-bold text-indigo-600 block">Kunci Jawaban & Pembahasan:</span>
              <p className="text-slate-600 dark:text-slate-300">{q.explanation}</p>
            </div>
          </div>
        ))}
      </div>

      {/* AI Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">AI Question Bank Generator</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Topik / Materi Soal</label>
                <input
                  type="text"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
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
                  <span>Generate Soal HOTS</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
