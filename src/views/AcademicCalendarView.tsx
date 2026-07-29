import React, { useState } from 'react';
import { Calendar as CalendarIcon, Plus, Trash2, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { LocalDB } from '../lib/supabase';
import { CalendarEvent } from '../types';
import { useToast } from '../components/common/Toast';

export const AcademicCalendarView: React.FC = () => {
  const { showToast } = useToast();
  const [events, setEvents] = useState<CalendarEvent[]>(() => LocalDB.get<CalendarEvent[]>('calendar', []));
  const [filterType, setFilterType] = useState<string>('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState<Partial<CalendarEvent>>({
    title: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
    type: 'agenda',
    notes: '',
  });

  const filteredEvents = filterType === 'Semua' ? events : events.filter(e => e.type === filterType);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;

    const newEv: CalendarEvent = {
      id: `cal-${Date.now()}`,
      title: form.title,
      start_date: form.start_date || new Date().toISOString().split('T')[0],
      end_date: form.end_date || form.start_date || new Date().toISOString().split('T')[0],
      type: form.type as any || 'agenda',
      notes: form.notes || '',
    };

    const updated = [...events, newEv];
    setEvents(updated);
    LocalDB.set('calendar', updated);
    showToast('Agenda Kalender Akademik Ditambahkan', '', 'success');
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    const updated = events.filter(e => e.id !== id);
    setEvents(updated);
    LocalDB.set('calendar', updated);
    showToast('Agenda Dihapus', '', 'info');
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'ujian':
        return 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300';
      case 'libur_nasional':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300';
      case 'kegiatan_sekolah':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300';
      default:
        return 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300';
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-indigo-600" />
            Kalender Akademik Interaktif
          </h2>
          <p className="text-xs text-slate-400">Jadwal kegiatan sekolah, libur nasional, dan kalender ujian resmi.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          Tambah Agenda / Libur
        </button>
      </div>

      {/* Filter Category */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {['Semua', 'agenda', 'libur_nasional', 'ujian', 'kegiatan_sekolah'].map(t => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
              filterType === t
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            {t.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* List of Events */}
      <div className="space-y-3">
        {filteredEvents.map(ev => (
          <div key={ev.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-center shrink-0">
                <span className="block text-[10px] uppercase font-bold text-slate-400">TANGGAL</span>
                <span className="block font-extrabold text-xs text-indigo-600">{ev.start_date}</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{ev.title}</h4>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold capitalize ${getTypeBadge(ev.type)}`}>
                    {ev.type.replace('_', ' ')}
                  </span>
                </div>
                {ev.notes && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{ev.notes}</p>}
              </div>
            </div>

            <button
              onClick={() => handleDelete(ev.id)}
              className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">Tambah Agenda Kalender</h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Judul Agenda / Hari Libur</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                  placeholder="Misal: Libur Hari Raya, Ujian Tengah Semester"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Mulai Tanggal</label>
                  <input
                    type="date"
                    value={form.start_date}
                    onChange={e => setForm({ ...form, start_date: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Sampai Tanggal</label>
                  <input
                    type="date"
                    value={form.end_date}
                    onChange={e => setForm({ ...form, end_date: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Kategori</label>
                <select
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                >
                  <option value="agenda">Agenda Sekolah</option>
                  <option value="libur_nasional">Libur Nasional / Keagamaan</option>
                  <option value="ujian">Ujian / Asesmen</option>
                  <option value="kegiatan_sekolah">Kegiatan Ekstrakurikuler / Rapat</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Catatan Keterangan</label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
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
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold"
                >
                  Simpan Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
