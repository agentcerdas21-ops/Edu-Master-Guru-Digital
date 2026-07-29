import React, { useState } from 'react';
import { User, School, FileSignature, Save, Upload, ShieldCheck, QrCode } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';

export const ProfileTeacherView: React.FC = () => {
  const { user, school, updateUser, updateSchool } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    full_name: user.full_name || '',
    nip: user.nip || '',
    nuptk: user.nuptk || '',
    rank: user.rank || '',
    position: user.position || '',
    phone: user.phone || '',
    email: user.email || '',
    avatar_url: user.avatar_url || '',
    signature_url: user.signature_url || '',
  });

  const [schoolData, setSchoolData] = useState({
    name: school.name || '',
    npsn: school.npsn || '',
    address: school.address || '',
    principal_name: school.principal_name || '',
    principal_nip: school.principal_nip || '',
    academic_year: school.academic_year || '2025/2026',
    semester: school.semester || 'Ganjil',
    logo_url: school.logo_url || '',
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(formData);
    updateSchool(schoolData);
    showToast('Profil Guru & Sekolah Berhasil Diperbarui', 'Semua dokumen administrasi akan menggunakan data terbaru.', 'success');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Printable Cover Preview Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-6">
            <img
              src={schoolData.logo_url || 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=150'}
              alt="Logo Sekolah"
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white/10 bg-white p-1"
            />
            <div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/20 text-cyan-300 border border-cyan-400/30">
                Sampul Administrasi Resmi (Cover)
              </span>
              <h2 className="text-2xl font-bold mt-2">{schoolData.name}</h2>
              <p className="text-xs text-slate-300">NPSN: {schoolData.npsn} • T.A. {schoolData.academic_year} ({schoolData.semester})</p>
            </div>
          </div>

          <div className="flex items-center gap-4 border-l border-slate-700/80 pl-6">
            <img
              src={formData.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
              alt="Foto Guru"
              className="w-16 h-16 rounded-full object-cover ring-2 ring-cyan-400"
            />
            <div>
              <h4 className="font-bold text-sm text-white">{formData.full_name}</h4>
              <p className="text-xs text-slate-300">NIP: {formData.nip}</p>
              <p className="text-[10px] text-cyan-300 font-medium mt-0.5">{formData.position}</p>
            </div>
          </div>

        </div>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        
        {/* Guru Profile Details */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <User className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">Data Biodata Guru Pengajar</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap & Gelar</label>
              <input
                type="text"
                value={formData.full_name}
                onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">NIP (Nomor Induk Pegawai)</label>
              <input
                type="text"
                value={formData.nip}
                onChange={e => setFormData({ ...formData, nip: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">NUPTK</label>
              <input
                type="text"
                value={formData.nuptk}
                onChange={e => setFormData({ ...formData, nuptk: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Pangkat / Golongan Ruang</label>
              <input
                type="text"
                value={formData.rank}
                onChange={e => setFormData({ ...formData, rank: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Jabatan & Tugas Tambahan</label>
              <input
                type="text"
                value={formData.position}
                onChange={e => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Nomor Telepon / WhatsApp</label>
              <input
                type="text"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* School Information & Digital Signature */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <School className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">Informasi Satuan Pendidikan</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Sekolah</label>
                <input
                  type="text"
                  value={schoolData.name}
                  onChange={e => setSchoolData({ ...schoolData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Kepala Sekolah</label>
                <input
                  type="text"
                  value={schoolData.principal_name}
                  onChange={e => setSchoolData({ ...schoolData, principal_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Tahun Ajaran</label>
                  <input
                    type="text"
                    value={schoolData.academic_year}
                    onChange={e => setSchoolData({ ...schoolData, academic_year: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Semester</label>
                  <select
                    value={schoolData.semester}
                    onChange={e => setSchoolData({ ...schoolData, semester: e.target.value as 'Ganjil' | 'Genap' })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Ganjil">Ganjil</option>
                    <option value="Genap">Genap</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <FileSignature className="w-5 h-5 text-cyan-600" />
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">Tanda Tangan Digital & Otentikasi</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">URL Gambar Tanda Tangan Digital</label>
                <input
                  type="text"
                  value={formData.signature_url}
                  onChange={e => setFormData({ ...formData, signature_url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://..."
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <h5 className="font-semibold text-slate-800 dark:text-slate-200">Pratinjau Tanda Tangan</h5>
                  <p className="text-[10px] text-slate-400">Otomatis dicetak pada dokumen PDF & Word</p>
                </div>
                {formData.signature_url ? (
                  <img src={formData.signature_url} alt="TTD" className="h-12 object-contain bg-white p-1 rounded-lg border" />
                ) : (
                  <div className="h-12 w-24 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center text-[10px] text-slate-400">
                    Kosong
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs md:text-sm shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all transform active:scale-95"
          >
            <Save className="w-4 h-4" />
            Simpan Perubahan Profil & Cover
          </button>
        </div>

      </form>

    </div>
  );
};
