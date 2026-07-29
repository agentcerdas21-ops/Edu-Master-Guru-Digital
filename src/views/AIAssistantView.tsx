import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, Loader2, Copy, Check, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';

export const AIAssistantView: React.FC = () => {
  const { user, school } = useAuth();
  const { showToast } = useToast();

  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: `Halo ${user.full_name}! Saya adalah **Edu AI Assistant** khusus untuk administrasi dan pedagogi guru di ${school.name}.\n\nBagaimana saya dapat membantu Anda hari ini? Anda dapat memilih salah satu prompt preset cepat di bawah atau mengetikkan pertanyaan langsung.`
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const presets = [
    { label: 'Rekomendasi Strategi Remedial', prompt: 'Berikan strategi pembelajaran remedial dan pengayaan yang efektif untuk materi Sistem Persamaan Linear Tiga Variabel (SPLTV) Kurikulum Merdeka.' },
    { label: 'Narasi Catatan Rapor Kurikulum Merdeka', prompt: 'Buatkan 3 variasi narasi capaian kompetensi rapor Kurikulum Merdeka untuk siswa yang sangat menguasai materi Aljabar dan siswa yang memerlukan bimbingan.' },
    { label: 'Rubrik Penilaian Unjuk Kerja (LKPD)', prompt: 'Buatkan rubrik penilaian analitik untuk tugas kelompok presentasi pemodelan matematika dengan skala 1-4.' },
    { label: 'Soal HOTS Berbasis Kasus Kontekstual', prompt: 'Buatkan 2 butir soal cerita HOTS matematika tingkat SMA beserta kunci jawaban dan langkah pembahasannya.' },
  ];

  const handleSendMessage = async (promptText?: string) => {
    const textToSend = promptText || inputPrompt;
    if (!textToSend.trim() || isGenerating) return;

    const newMsgs = [...messages, { role: 'user' as const, text: textToSend }];
    setMessages(newMsgs);
    setInputPrompt('');
    setIsGenerating(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMsgs.map(m => ({ role: m.role, content: m.text })),
          systemInstruction: `Anda adalah Edu Master AI, asisten AI pakar administrasi guru dan pedagogi Kurikulum Merdeka di Indonesia. Berikan jawaban yang terstruktur, praktis, ramah, dan profesional untuk Bpk/Ibu Guru ${user.full_name} di ${school.name}.`
        })
      });

      const data = await response.json();
      if (data.success && data.reply) {
        setMessages([...newMsgs, { role: 'assistant', text: data.reply }]);
      } else {
        throw new Error(data.message || 'Gagal merespons AI.');
      }
    } catch (err: any) {
      showToast('Gagal Menghubungi AI', err.message || 'Periksa server', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    showToast('Teks Berhasil Disalin', '', 'info');
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500 animate-pulse" />
            Workspace Konsultasi Edu AI Assistant
          </h2>
          <p className="text-xs text-slate-400">Asisten kecerdasan buatan terdedikasi untuk solusi administrasi & pedagogi guru.</p>
        </div>
      </div>

      {/* Presets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {presets.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p.prompt)}
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-left hover:border-blue-500 hover:shadow-md transition-all space-y-1 text-slate-700 dark:text-slate-300"
          >
            <span className="font-bold text-blue-600 dark:text-blue-400 block">{p.label}</span>
            <p className="text-[10px] text-slate-400 line-clamp-2">{p.prompt}</p>
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col h-[520px]">
        
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 text-xs ${
                m.role === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gradient-to-tr from-amber-500 to-indigo-600 text-white'
              }`}>
                {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`p-4 rounded-2xl max-w-[80%] leading-relaxed space-y-2 relative group ${
                m.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
              }`}>
                <div className="whitespace-pre-wrap">{m.text}</div>

                {m.role === 'assistant' && (
                  <button
                    onClick={() => handleCopy(m.text, idx)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-200/50 dark:bg-slate-700/50 opacity-0 group-hover:opacity-100 transition-opacity text-slate-600 dark:text-slate-300"
                    title="Salin Teks"
                  >
                    {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
            </div>
          ))}

          {isGenerating && (
            <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span>Edu AI Assistant sedang berpikir...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputPrompt}
            onChange={e => setInputPrompt(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ketikkan instruksi atau konsultasi administrasi guru di sini..."
            className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isGenerating || !inputPrompt.trim()}
            className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md disabled:opacity-50 flex items-center gap-1.5 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Kirim</span>
          </button>
        </div>

      </div>

    </div>
  );
};
