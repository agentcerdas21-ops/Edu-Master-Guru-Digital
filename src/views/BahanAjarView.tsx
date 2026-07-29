import React, { useState } from 'react';
import { FolderKanban, Upload, FileText, Video, Play, Plus, Trash2, ExternalLink } from 'lucide-react';
import { LocalDB } from '../lib/supabase';
import { LearningMaterial } from '../types';
import { useToast } from '../components/common/Toast';

export const BahanAjarView: React.FC = () => {
  const { showToast } = useToast();
  const [materials, setMaterials] = useState<LearningMaterial[]>(() => LocalDB.get<LearningMaterial[]>('materials', [
    {
      id: 'mat-1',
      title: 'Video Pembelajaran Konsep SPLTV dalam Kehidupan Sehari-hari',
      type: 'youtube',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      category: 'Video Animasi',
      subject_id: 'sbj-1',
      subject_name: 'Matematika Lanjut',
      class_id: 'cls-101',
      class_name: 'X IPA 1',
      created_at: new Date().toISOString()
    },
    {
      id: 'mat-2',
      title: 'Slide Presentasi PowerPoint Materi SPLTV (PDF)',
      type: 'ppt',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      category: 'Slide PPT',
      subject_id: 'sbj-1',
      subject_name: 'Matematika Lanjut',
      class_id: 'cls-101',
      class_name: 'X IPA 1',
      size: '4.2 MB',
      created_at: new Date().toISOString()
    }
  ]));

  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<Partial<LearningMaterial>>({
    title: '',
    type: 'pdf',
    url: '',
    category: 'Materi Utama',
  });

  const categories = ['Semua', 'pdf', 'word', 'ppt', 'video', 'youtube'];

  const filtered = activeCategory === 'Semua' ? materials : materials.filter(m => m.type === activeCategory);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.url) return;

    const newMat: LearningMaterial = {
      id: `mat-${Date.now()}`,
      title: form.title,
      type: form.type as any || 'pdf',
      url: form.url,
      category: form.category || 'Materi Pembelajaran',
      subject_id: 'sbj-1',
      subject_name: 'Matematika Lanjut',
      class_id: 'cls-101',
      class_name: 'X IPA 1',
      size: '2.5 MB',
      created_at: new Date().toISOString()
    };

    const updated = [newMat, ...materials];
    setMaterials(updated);
    LocalDB.set('materials', updated);
    showToast('Bahan Ajar Berhasil Diunggah', '', 'success');
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    const updated = materials.filter(m => m.id !== id);
    setMaterials(updated);
    LocalDB.set('materials', updated);
    showToast('Bahan Ajar Dihapus', '', 'info');
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-blue-600" />
            Bahan Ajar & Media Digital
          </h2>
          <p className="text-xs text-slate-400">Modul PDF, Word, PowerPoint, Video Pembelajaran, & Link YouTube.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload Bahan Ajar
        </button>
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase transition-all ${
              activeCategory === c
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(mat => (
          <div key={mat.id} className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] px-2.5 py-1 rounded-full font-bold uppercase bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                {mat.type}
              </span>
              <button
                onClick={() => handleDelete(mat.id)}
                className="p-1 rounded-lg text-slate-400 hover:text-red-500"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100 line-clamp-2">{mat.title}</h4>

            {mat.type === 'youtube' && (
              <div className="aspect-video rounded-xl overflow-hidden bg-slate-950">
                <iframe
                  src={mat.url}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[10px]">{mat.size || 'Digital Link'}</span>
              <a
                href={mat.url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
              >
                <span>Buka Media</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">Upload Media / Bahan Ajar</h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Judul Bahan Ajar</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Jenis Format Format</label>
                <select
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                >
                  <option value="pdf">PDF Document</option>
                  <option value="word">Word (.docx)</option>
                  <option value="ppt">PowerPoint (.pptx)</option>
                  <option value="video">Video MP4</option>
                  <option value="youtube">Embed YouTube</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">URL File / Embed Link</label>
                <input
                  type="text"
                  value={form.url}
                  onChange={e => setForm({ ...form, url: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  placeholder="https://..."
                  required
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
                  Simpan Media
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
