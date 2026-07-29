import React, { useState } from 'react';
import { Clock, Plus, Trash2, Edit3, Filter, Bell, MapPin, BookOpen } from 'lucide-react';
import { LocalDB } from '../lib/supabase';
import { TeachingSchedule, SchoolClass, Subject } from '../types';
import { useToast } from '../components/common/Toast';

export const TeachingScheduleView: React.FC = () => {
  const { showToast } = useToast();
  const [schedules, setSchedules] = useState<TeachingSchedule[]>(() => LocalDB.get<TeachingSchedule[]>('schedules', []));
  const classes = LocalDB.get<SchoolClass[]>('classes', []);
  const subjects = LocalDB.get<Subject[]>('subjects', []);

  const [selectedDay, setSelectedDay] = useState<string>('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<Partial<TeachingSchedule>>({
    day_of_week: 'Senin',
    start_time: '07:30',
    end_time: '09:00',
    class_id: classes[0]?.id || '',
    subject_id: subjects[0]?.id || '',
    room: 'Ruang 101',
  });

  const daysList = ['Semua', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  const filtered = selectedDay === 'Semua' ? schedules : schedules.filter(s => s.day_of_week === selectedDay);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const selClass = classes.find(c => c.id === form.class_id);
    const selSub = subjects.find(s => s.id === form.subject_id);

    if (editingId) {
      const updated = schedules.map(s => s.id === editingId ? {
        ...s,
        ...form,
        class_name: selClass?.name || 'Kelas',
        subject_name: selSub?.name || 'Mata Pelajaran'
      } as TeachingSchedule : s);
      setSchedules(updated);
      LocalDB.set('schedules', updated);
      showToast('Jadwal Mengajar Diperbarui', '', 'success');
    } else {
      const newSch: TeachingSchedule = {
        id: `sch-${Date.now()}`,
        day_of_week: form.day_of_week as any || 'Senin',
        start_time: form.start_time || '07:30',
        end_time: form.end_time || '09:00',
        class_id: form.class_id || '',
        class_name: selClass?.name || 'Kelas',
        subject_id: form.subject_id || '',
        subject_name: selSub?.name || 'Mata Pelajaran',
        teacher_id: 'usr-teacher-1',
        room: form.room || 'Ruang Kelas',
      };
      const updated = [...schedules, newSch];
      setSchedules(updated);
      LocalDB.set('schedules', updated);
      showToast('Jadwal Baru Ditambahkan', '', 'success');
    }
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    const updated = schedules.filter(s => s.id !== id);
    setSchedules(updated);
    LocalDB.set('schedules', updated);
    showToast('Jadwal Dihapus', '', 'info');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-600" />
            Jadwal Mengajar Mingguan
          </h2>
          <p className="text-xs text-slate-400">Kelola alokasi waktu jam tatap muka di kelas.</p>
        </div>

        <button
          onClick={() => {
            setForm({
              day_of_week: 'Senin',
              start_time: '07:30',
              end_time: '09:00',
              class_id: classes[0]?.id || '',
              subject_id: subjects[0]?.id || '',
              room: 'Ruang 101',
            });
            setEditingId(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          Tambah Jadwal Mengajar
        </button>
      </div>

      {/* Days Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {daysList.map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              selectedDay === day
                ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(sch => (
          <div key={sch.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold text-xs">
                {sch.day_of_week}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setEditingId(sch.id);
                    setForm(sch);
                    setIsModalOpen(true);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(sch.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{sch.subject_name}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                Kelas {sch.class_name}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                <Clock className="w-3.5 h-3.5 text-emerald-500" />
                {sch.start_time} - {sch.end_time}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                {sch.room}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
              {editingId ? 'Edit Jadwal Mengajar' : 'Tambah Jadwal Mengajar Baru'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Hari</label>
                <select
                  value={form.day_of_week}
                  onChange={e => setForm({ ...form, day_of_week: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                >
                  {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Jam Mulai</label>
                  <input
                    type="time"
                    value={form.start_time}
                    onChange={e => setForm({ ...form, start_time: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Jam Selesai</label>
                  <input
                    type="time"
                    value={form.end_time}
                    onChange={e => setForm({ ...form, end_time: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Pilih Kelas</label>
                <select
                  value={form.class_id}
                  onChange={e => setForm({ ...form, class_id: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Pilih Mata Pelajaran</label>
                <select
                  value={form.subject_id}
                  onChange={e => setForm({ ...form, subject_id: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Ruangan / Lab</label>
                <input
                  type="text"
                  value={form.room}
                  onChange={e => setForm({ ...form, room: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                  required
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold"
                >
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
