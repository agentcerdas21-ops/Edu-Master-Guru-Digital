import React, { useState } from 'react';
import { BookMarked, Plus, Trash2 } from 'lucide-react';
import { LocalDB } from '../lib/supabase';
import { TeachingJournalItem } from '../types';
import { useToast } from '../components/common/Toast';

export const TeachingJournalView: React.FC = () => {
  const { showToast } = useToast();
  const [journals, setJournals] = useState<TeachingJournalItem[]>(() => LocalDB.get<TeachingJournalItem[]>('journals', [
    {
      id: 'jrn-1',
      date: new Date().toISOString().split('T')[0],
      class_id: 'cls-101',
      class_name: 'X IPA 1',
      subject_id: 'sbj-1',
      subject_name: 'Matematika Lanjut',
      materi: 'Pemodelan Masalah Kontekstual ke Bentuk SPLTV',
      absent_students: ['Budi Santoso (Izin)'],
      notes: 'Siswa antusias mengerjakan LKPD kelompok. 2 siswa perlu pendampingan ulang.',
      teacher_reflection: 'Waktu diskusi kelompok perlu ditambah 10 menit di pertemuan berikutnya.',
      created_at: new Date().toISOString()
    }
  ]));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<Partial<TeachingJournalItem>>({
    date: new Date().toISOString().split('T')[0],
    class_name: 'X IPA 1',
    subject_name: 'Matematika Lanjut',
    materi: '',
    notes: '',
    teacher_reflection: '',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newJrn: TeachingJournalItem = {
      id: `jrn-${Date.now()}`,
      date: form.date || new Date().toISOString().split('T')[0],
      class_id: 'cls-101',
      class_name: form.class_name || 'X IPA 1',
      subject_id: 'sbj-1',
      subject_name: form.subject_name || 'Matematika Lanjut',
      materi: form.materi || '',
      absent_students: [],
      notes: form.notes || '',
      teacher_reflection: form.teacher_reflection || '',
      created_at: new Date().toISOString()
    };

    const updated = [newJrn, ...journals];
    setJournals(updated);
    LocalDB.set('journals', updated);
    showToast('Jurnal Mengajar Berhasil Disimpan', '', 'success');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <BookMarked className="w-6 h-6 text-blue-600" />
            Jurnal Mengajar & Refleksi Guru
          </h2>
          <p className="text-xs text-slate-400">Catatan pelaksanaan KBM harian, hambatan, & tindak lanjut reflektif.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Isi Jurnal Hari Ini
        </button>
      </div>

      <div className="space-y-4">
        {journals.map(j => (
          <div key={j.id} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="font-bold text-blue-600">{j.date}</span>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 mt-0.5">{j.materi}</h4>
                <p className="text-slate-400 text-[10px]">{j.subject_name} • Kelas {j.class_name}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Catatan KBM</span>
                <p className="text-slate-600 dark:text-slate-400">{j.notes || 'Tidak ada catatan.'}</p>
              </div>

              <div className="p-3 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50">
                <span className="font-bold text-indigo-600 block mb-1">Refleksi Guru</span>
                <p className="text-slate-600 dark:text-slate-300">{j.teacher_reflection || 'Tidak ada refleksi.'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">Catat Jurnal Mengajar</h3>
            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Materi Pembelajaran Yang Disampaikan</label>
                <input
                  type="text"
                  value={form.materi}
                  onChange={e => setForm({ ...form, materi: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Catatan Pelaksanaan KBM</label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  rows={2}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Refleksi Pembelajaran Guru</label>
                <textarea
                  value={form.teacher_reflection}
                  onChange={e => setForm({ ...form, teacher_reflection: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  rows={2}
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold"
                >
                  Simpan Jurnal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
