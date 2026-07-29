import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface PDFHeaderOptions {
  schoolName: string;
  npsn?: string;
  academicYear?: string;
  semester?: string;
  title: string;
  subtitle?: string;
}

export function createBasePDFDoc(options: PDFHeaderOptions) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Kop Surat / Header Sekolah
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(options.schoolName.toUpperCase(), 105, 15, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`NPSN: ${options.npsn || '20101234'} | Tahun Ajaran: ${options.academicYear || '2025/2026'} - Semester: ${options.semester || 'Ganjil'}`, 105, 20, { align: 'center' });
  
  // Double horizontal line (Kop line)
  doc.setLineWidth(0.8);
  doc.line(14, 23, 196, 23);
  doc.setLineWidth(0.2);
  doc.line(14, 24, 196, 24);

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(options.title.toUpperCase(), 105, 32, { align: 'center' });

  if (options.subtitle) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.text(options.subtitle, 105, 37, { align: 'center' });
  }

  return doc;
}

export function addSignatureBlock(doc: jsPDF, teacherName: string, nip: string, startY: number, location = 'Jakarta') {
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  const rightX = 135;
  doc.text(`${location}, ${currentDate}`, rightX, startY);
  doc.text('Guru Mata Pelajaran,', rightX, startY + 5);

  // Space for signature
  doc.setFont('helvetica', 'bold');
  doc.text(teacherName, rightX, startY + 25);
  doc.setFont('helvetica', 'normal');
  doc.text(`NIP. ${nip || '-'}`, rightX, startY + 30);
}

export function exportModulAjarPDF(modul: any, schoolName: string, teacherName: string, nip: string) {
  const doc = createBasePDFDoc({
    schoolName,
    title: 'MODUL AJAR KURIKULUM MERDEKA',
    subtitle: modul.title,
  });

  let y = 45;

  // Metadata Table
  (doc as any).autoTable({
    startY: y,
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 2 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 45 } },
    body: [
      ['Mata Pelajaran', modul.subject_name || '-'],
      ['Kelas / Fase', `${modul.class_name || '-'} / Fase ${modul.phase}`],
      ['Alokasi Waktu', modul.duration],
      ['Model Pembelajaran', modul.model_pembelajaran],
      ['Profil Pelajar Pancasila', Array.isArray(modul.profil_pancasila) ? modul.profil_pancasila.join(', ') : modul.profil_pancasila],
      ['Sarana & Prasarana', Array.isArray(modul.media_pembelajaran) ? modul.media_pembelajaran.join(', ') : modul.media_pembelajaran],
    ],
  });

  y = (doc as any).lastAutoTable.finalY + 8;

  // Capaian & Tujuan
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('A. CAPAIAN & TUJUAN PEMBELAJARAN', 14, y);
  y += 5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('Capaian Pembelajaran (CP):', 14, y);
  y += 4;
  doc.setFont('helvetica', 'normal');
  const cpLines = doc.splitTextToSize(modul.cp || '-', 180);
  doc.text(cpLines, 14, y);
  y += cpLines.length * 4.5 + 4;

  doc.setFont('helvetica', 'bold');
  doc.text('Tujuan Pembelajaran (TP):', 14, y);
  y += 4;
  doc.setFont('helvetica', 'normal');
  if (Array.isArray(modul.tp)) {
    modul.tp.forEach((tpItem: string, idx: number) => {
      const lines = doc.splitTextToSize(`${idx + 1}. ${tpItem}`, 176);
      doc.text(lines, 16, y);
      y += lines.length * 4.5;
    });
  }

  y += 6;

  // Langkah Kegiatan
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('B. KEGIATAN PEMBELAJARAN', 14, y);
  y += 5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('1. Kegiatan Pendahuluan:', 14, y);
  y += 4;
  doc.setFont('helvetica', 'normal');
  if (Array.isArray(modul.kegiatan_awal)) {
    modul.kegiatan_awal.forEach((item: string) => {
      const lines = doc.splitTextToSize(`• ${item}`, 176);
      doc.text(lines, 16, y);
      y += lines.length * 4.5;
    });
  }

  y += 3;
  doc.setFont('helvetica', 'bold');
  doc.text('2. Kegiatan Inti:', 14, y);
  y += 4;
  doc.setFont('helvetica', 'normal');
  if (Array.isArray(modul.kegiatan_inti)) {
    modul.kegiatan_inti.forEach((item: string) => {
      const lines = doc.splitTextToSize(`• ${item}`, 176);
      doc.text(lines, 16, y);
      y += lines.length * 4.5;
    });
  }

  y += 3;
  doc.setFont('helvetica', 'bold');
  doc.text('3. Kegiatan Penutup:', 14, y);
  y += 4;
  doc.setFont('helvetica', 'normal');
  if (Array.isArray(modul.kegiatan_penutup)) {
    modul.kegiatan_penutup.forEach((item: string) => {
      const lines = doc.splitTextToSize(`• ${item}`, 176);
      doc.text(lines, 16, y);
      y += lines.length * 4.5;
    });
  }

  y += 10;
  if (y > 240) {
    doc.addPage();
    y = 20;
  }

  addSignatureBlock(doc, teacherName, nip, y);

  doc.save(`Modul_Ajar_${modul.title.replace(/\s+/g, '_')}.pdf`);
}

export function exportAttendancePDF(records: any[], className: string, date: string, schoolName: string, teacherName: string, nip: string) {
  const doc = createBasePDFDoc({
    schoolName,
    title: `REKAPITULASI PRESENSI SISWA KELAS ${className}`,
    subtitle: `Tanggal: ${date}`,
  });

  const tableRows = records.map((r, index) => [
    index + 1,
    r.student_nisn || '-',
    r.student_name || 'Siswa',
    r.status.toUpperCase(),
    r.notes || '-',
  ]);

  (doc as any).autoTable({
    startY: 45,
    head: [['No', 'NISN', 'Nama Siswa', 'Status Presensi', 'Catatan']],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: [37, 99, 235], textColor: 255 },
    styles: { fontSize: 9 },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 12;
  addSignatureBlock(doc, teacherName, nip, finalY);

  doc.save(`Presensi_${className}_${date}.pdf`);
}

export function exportGradesPDF(studentsGrades: any[], subjectName: string, className: string, schoolName: string, teacherName: string, nip: string) {
  const doc = createBasePDFDoc({
    schoolName,
    title: `DAFTAR NILAI AKHIR SISWA - ${subjectName.toUpperCase()}`,
    subtitle: `Kelas: ${className}`,
  });

  const tableRows = studentsGrades.map((sg, idx) => [
    idx + 1,
    sg.nisn || '-',
    sg.student_name,
    sg.tugas || 0,
    sg.quiz || 0,
    sg.uh || 0,
    sg.uts || 0,
    sg.uas || 0,
    sg.finalScore || 0,
    sg.predicate || 'B',
  ]);

  (doc as any).autoTable({
    startY: 45,
    head: [['No', 'NISN', 'Nama Siswa', 'Tugas', 'Quiz', 'UH', 'UTS', 'UAS', 'Nilai Akhir', 'Predikat']],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229], textColor: 255 },
    styles: { fontSize: 8.5, halign: 'center' },
    columnStyles: { 2: { halign: 'left' } },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 12;
  addSignatureBlock(doc, teacherName, nip, finalY);

  doc.save(`Nilai_${subjectName}_${className}.pdf`);
}

export function exportQuestionBankPDF(questions: any[], subjectName: string, className: string, schoolName: string, teacherName: string, nip: string) {
  const doc = createBasePDFDoc({
    schoolName,
    title: `KARTU SOAL & BANK SOAL HOTS - ${subjectName.toUpperCase()}`,
    subtitle: `Kelas: ${className}`,
  });

  let y = 45;
  questions.forEach((q, idx) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`Soal No. ${idx + 1} (Taksonomi ${q.bloom_level} - Tingkat ${q.difficulty})`, 14, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const qLines = doc.splitTextToSize(q.question_text || '', 180);
    doc.text(qLines, 14, y);
    y += qLines.length * 4.5 + 2;

    if (Array.isArray(q.options)) {
      q.options.forEach((opt: any) => {
        doc.text(`${opt.code}. ${opt.text}`, 18, y);
        y += 4.5;
      });
    }

    doc.setFont('helvetica', 'bold');
    doc.text(`Kunci Jawaban: ${q.correct_answer}`, 14, y);
    y += 5;

    doc.setFont('helvetica', 'italic');
    const expLines = doc.splitTextToSize(`Pembahasan: ${q.explanation}`, 180);
    doc.text(expLines, 14, y);
    y += expLines.length * 4.5 + 6;

    if (y > 250) {
      doc.addPage();
      y = 20;
    }
  });

  addSignatureBlock(doc, teacherName, nip, y);
  doc.save(`Bank_Soal_${subjectName}_${className}.pdf`);
}
