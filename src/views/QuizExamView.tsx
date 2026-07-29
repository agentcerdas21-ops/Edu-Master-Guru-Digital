import React, { useState, useEffect } from 'react';
import { ShieldAlert, Clock, AlertTriangle, CheckCircle, FileText, Lock, Play, RotateCcw } from 'lucide-react';
import { LocalDB } from '../lib/supabase';
import { ExamItem, QuestionBankItem } from '../types';
import { useToast } from '../components/common/Toast';

export const QuizExamView: React.FC = () => {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'MANAGEMENT' | 'STUDENT_SIMULATION'>('MANAGEMENT');

  // Anti-cheat state for simulation
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [violationsCount, setViolationsCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 mins
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const questions: QuestionBankItem[] = [
    {
      id: 'q-1',
      question_text: 'Diberikan sistem persamaan linear: 2x + y + z = 13, x + 2y + z = 11, x + y + 2z = 12. Tentukan nilai dari x + y + z!',
      options: [
        { code: 'A', text: '8' },
        { code: 'B', text: '9' },
        { code: 'C', text: '10' },
        { code: 'D', text: '11' },
      ],
      correct_answer: 'B',
      explanation: 'Jumlahkan ketiga persamaan: 4x + 4y + 4z = 36 => x + y + z = 9.',
      subject_id: 'sbj-1',
      subject_name: 'Matematika',
      bloom_level: 'C3',
      difficulty: 'sedang'
    },
    {
      id: 'q-2',
      question_text: 'Suatu toko kelontong menjual paket A (1 buku, 2 pensil = Rp 7.000) dan paket B (2 buku, 1 pensil = Rp 8.000). Berapakah harga 1 buah buku?',
      options: [
        { code: 'A', text: 'Rp 2.000' },
        { code: 'B', text: 'Rp 3.000' },
        { code: 'C', text: 'Rp 4.000' },
        { code: 'D', text: 'Rp 5.000' },
      ],
      correct_answer: 'B',
      explanation: 'Sistem 2 variabel: x + 2y = 7000 dan 2x + y = 8000 => x = 3000.',
      subject_id: 'sbj-1',
      subject_name: 'Matematika',
      bloom_level: 'C4',
      difficulty: 'sedang'
    }
  ];

  // Tab switch detection
  useEffect(() => {
    if (!isExamStarted || isSubmitted) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setViolationsCount(prev => {
          const updated = prev + 1;
          showToast('PELANGGARAN ANTI-CHEAT TERCATAT!', `Anda meninggalkan tab ujian (${updated}/3 kali).`, 'error');
          if (updated >= 3) {
            handleForceSubmit('Melakukan kecurangan dengan berpindah tab lebih dari 3 kali.');
          }
          return updated;
        });
      }
    };

    const handlePreventCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      showToast('Aksi Dilarang', 'Copy-paste ditutup selama ujian berlangsung!', 'warning');
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('copy', handlePreventCopy);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('copy', handlePreventCopy);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [isExamStarted, isSubmitted]);

  // Timer Countdown
  useEffect(() => {
    if (!isExamStarted || isSubmitted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleForceSubmit('Waktu ujian telah habis.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isExamStarted, isSubmitted, timeLeft]);

  const handleStartExam = () => {
    setIsExamStarted(true);
    setViolationsCount(0);
    setTimeLeft(600);
    setIsSubmitted(false);
    setSelectedAnswers({});
    showToast('Ujian Dimulai dalam Mode Anti-Cheat', 'Layar dikunci dan pelanggaran akan dicatat otomatis', 'info');
  };

  const handleForceSubmit = (reason: string) => {
    setIsSubmitted(true);
    setIsExamStarted(false);
    showToast('Ujian Selesai / Disubmit', reason, 'warning');
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct_answer) correct++;
    });
    return Math.round((correct / questions.length) * 100);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-red-600" />
            Ujian Online & Mode Anti-Kecurangan (CBT System)
          </h2>
          <p className="text-xs text-slate-400">Pencegahan tab switch, proteksi copy-paste, waktu otomatis & penilaian instant.</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('MANAGEMENT')}
            className={`px-4 py-2 rounded-xl transition-all ${activeTab === 'MANAGEMENT' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600'}`}
          >
            Bank / Kelola Ujian
          </button>
          <button
            onClick={() => setActiveTab('STUDENT_SIMULATION')}
            className={`px-4 py-2 rounded-xl transition-all ${activeTab === 'STUDENT_SIMULATION' ? 'bg-red-600 text-white shadow-md' : 'text-slate-600'}`}
          >
            Simulasi Anti-Cheat Siswa
          </button>
        </div>
      </div>

      {activeTab === 'MANAGEMENT' ? (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 text-xs">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Daftar Sesi Ujian Aktif</h3>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px]">Aktif</span>
              <h4 className="font-bold text-sm mt-1 text-slate-800 dark:text-slate-100">Asesmen Sumatif Tengah Semester - Matematika X IPA 1</h4>
              <p className="text-slate-400 text-[10px]">Durasi: 60 Menit • Soal: 20 Butir • Anti-Cheat Strict</p>
            </div>
            <button
              onClick={() => setActiveTab('STUDENT_SIMULATION')}
              className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold"
            >
              Uji Coba CBT Siswa
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          
          {!isExamStarted && !isSubmitted ? (
            <div className="p-8 rounded-3xl bg-slate-900 text-white text-center space-y-4 max-w-xl mx-auto shadow-2xl border border-slate-800">
              <ShieldAlert className="w-12 h-12 text-red-500 mx-auto animate-pulse" />
              <h3 className="text-xl font-extrabold">Ujian Online Berproteksi Ketat</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Ujian ini dilindungi oleh Sistem Anti-Cheat AI Studio. Dilarang berpindah tab browser, membuka aplikasi lain, atau melakukan copy-paste. Maksimal kecurangan: 3 kali.
              </p>
              <button
                onClick={handleStartExam}
                className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg transition-all"
              >
                Mulai Kerjakan Ujian Sekarang
              </button>
            </div>
          ) : isSubmitted ? (
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 text-center space-y-4 max-w-xl mx-auto shadow-sm border border-slate-200 dark:border-slate-800 text-xs">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Ujian Telah Selesai</h3>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-center">
                <span className="text-slate-400 block font-medium">Nilai Akhir Ujian</span>
                <span className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">{calculateScore()} / 100</span>
              </div>
              <p className="text-slate-400">Jumlah Pelanggaran Terdeteksi: <strong className="text-red-500">{violationsCount} Kali</strong></p>
              <button
                onClick={() => { setIsSubmitted(false); setIsExamStarted(false); }}
                className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 font-bold"
              >
                Kembali
              </button>
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6 text-xs">
              
              {/* CBT Status Bar */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-5 h-5 text-red-500" />
                  <div>
                    <span className="font-bold text-xs block text-slate-200">Mode Ujian Anti-Cheat Aktif</span>
                    <span className="text-[10px] text-red-400">Pelanggaran Tab: {violationsCount} / 3</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 font-mono text-xs font-bold text-amber-300">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Sisa Waktu: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                </div>
              </div>

              {/* Question */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold">
                  <span>Soal Nomor {currentQuestionIdx + 1} dari {questions.length}</span>
                  <span className="text-indigo-600">Level {questions[currentQuestionIdx].bloom_level}</span>
                </div>

                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-relaxed">
                  {questions[currentQuestionIdx].question_text}
                </h4>

                <div className="space-y-2 pt-2">
                  {questions[currentQuestionIdx].options.map(opt => (
                    <button
                      key={opt.code}
                      onClick={() => setSelectedAnswers({ ...selectedAnswers, [currentQuestionIdx]: opt.code })}
                      className={`w-full p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                        selectedAnswers[currentQuestionIdx] === opt.code
                          ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-600 font-bold text-blue-900 dark:text-blue-100'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center shrink-0">
                        {opt.code}
                      </span>
                      <span>{opt.text}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit / Nav */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  disabled={currentQuestionIdx === 0}
                  onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold disabled:opacity-40"
                >
                  Sebelumnya
                </button>

                {currentQuestionIdx < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                    className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold"
                  >
                    Selanjutnya
                  </button>
                ) : (
                  <button
                    onClick={() => handleForceSubmit('Selesai dikerjakan secara normal.')}
                    className="px-6 py-2 rounded-xl bg-emerald-600 text-white font-bold"
                  >
                    Submit Ujian Now
                  </button>
                )}
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};
