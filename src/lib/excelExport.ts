import * as XLSX from 'xlsx';

export function exportAttendanceToExcel(data: any[], filename = 'Presensi_Siswa.xlsx') {
  const formatted = data.map((item, index) => ({
    No: index + 1,
    NISN: item.student_nisn || '-',
    'Nama Siswa': item.student_name,
    Tanggal: item.date,
    Status: item.status.toUpperCase(),
    Catatan: item.notes || '-',
  }));

  const worksheet = XLSX.utils.json_to_sheet(formatted);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Presensi');
  XLSX.writeFile(workbook, filename);
}

export function exportGradesToExcel(data: any[], filename = 'Daftar_Nilai_Siswa.xlsx') {
  const formatted = data.map((item, index) => ({
    No: index + 1,
    NISN: item.nisn || '-',
    'Nama Siswa': item.student_name,
    'Tugas Harian': item.tugas || 0,
    Quiz: item.quiz || 0,
    'Ulangan Harian': item.uh || 0,
    UTS: item.uts || 0,
    UAS: item.uas || 0,
    'Nilai Akhir': item.finalScore || 0,
    Predikat: item.predicate || 'B',
  }));

  const worksheet = XLSX.utils.json_to_sheet(formatted);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Nilai');
  XLSX.writeFile(workbook, filename);
}
